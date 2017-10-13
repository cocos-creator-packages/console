'use strict';

const ConsoleList = require(Editor.url('packages://console/panel/list'));
const Manager = require(Editor.url('packages://console/panel/manager'));

Editor.Panel.extend({

    style: `
        @import url('app://bower_components/fontawesome/css/font-awesome.min.css');
        #console {
            display: flex;
            flex-direction: column;
            font-family: Menlo, monospace;
        }
        header {
            display: flex;
            padding: 4px;
            position: relative;
            padding-right: 88px;
            flex-wrap: wrap;
        }
        section {
            flex: 1;
            border: 1px solid black;
            box-shadow: inset 0 0 8px 2px rgba(0,0,0,0.2);
            background: #333;
        }
        
        ui-checkbox {
            padding: 3px 4px;
        }
        .collapse {
            position: absolute;
            right: 0;
        }
        
        section {
            overflow-y: auto;
            position: relative;
        }
        section .item {
            color: #999;
            line-height: 30px;
            padding: 0 10px;
            box-sizing: border-box;
            position: absolute;
            top: 0;
            font-size: 14px;
            width: 100%;
            -webkit-user-select: initial;
            overflow-x: scroll;
        }
        section .item[fold] {
            overflow-x: hidden;
        }
        section .item[texture=light] {
            background-color:#292929;
        }
        section .item[texture=dark] {
            background-color:#222;
        }
        section .item[type=log] {
            color: #999;
        }
        section .item[type=error] {
            color: #DA2121;
        }
        section .item[type=warn] {
            color: #990;
        }
        section .item[type=info] {
            color: #09F;
        }
        section .item[type=failed] {
            color: #DA2121;
        }
        section .item[type=success] {
            color: #090;
        }
        section .item i {
        }
        section .item i.fold {
            color: #555;
            cursor: pointer;
            padding: 2px;
        }
        section .item i.fa-caret-right {
            padding: 2px 5px 2px 6px;
            margin: 0 -2px;
        }
        
        section div .warp {
            display: flex;
            font-size: inherit;
            line-height: inherit;
        }
        section div .text {
            position: relative;
            flex: 1;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding-right: 2px;
        }
        section div[fold] .text {
            overflow: hidden;
        }
        section div .info {
            margin-left: 25px;
        }
        section div[fold] .info > div {
            display: none;
        }
        section div .info div {
            white-space: nowrap;
            text-overflow: ellipsis;
            line-height: 26px;
            font-size: 13px;
        }
        section div .info div pre {
            margin: 0;
            display: inline;
        }
        section div[fold] .info div {
            overflow: hidden;
        }
        section .item[type=error] .info div {
            color: #A73637;
        }
        section .item:hover {
            background: #353535;
        }
        .select-wrap {
            display: inline-block;
            margin-right: 5px;
        }
    `,

    template: `
    <div id="console" class="fit">
        
        <header>
            <ui-button class="red small transparent" v-on:confirm="onClear">
                <i class="icon-block"></i>
            </ui-button>
            <ui-button id="openLogBtn" class="small transparent" v-on:click="onPopup">
                <i class="icon-doc-text"></i>
            </ui-button>
            <ui-input v-on:change="onFilterText"></ui-input>
            <ui-checkbox v-on:confirm="onFilterRegex">Regex</ui-checkbox>
            <ui-select v-on:confirm="onFilterType">
                <option value="">All</option>
                <option value="log">Log</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="info">Info</option>
                <option value="warn">Warn</option>
                <option value="error">Error</option>
            </ui-select>
            <div class="select-wrap">
                <i class="fa fa-text-width" title="Font Size" style="padding: 0.5em 0.6em"></i>
                <ui-select :value="fontsize" @change="onChangeFontSize">
                    <option v-for="fontsize in getSizeArr(8,20)" :value="fontsize">{{ fontsize }}</option>
                </ui-select>
            </div>
            <div class="select-wrap">
                <i class="fa fa-text-height" title="Font LineHeight" style="padding: 0.5em 0.6em;margin-left:0.1em;"></i>
                <ui-select :value="lineheight" @change="onChangeLineHeight">
                    <option v-for="lineheight in getSizeArr(18,36)" :value="lineheight">{{ lineheight }}</option>
                </ui-select>            
            </div>
            <ui-checkbox class="collapse" v-on:confirm="onCollapse" checked>Collapse</ui-checkbox>
        </header>
        <console-list v-bind:messages="messages" :fontsize="fontsize" :lineheight="lineheight"></console-list>
    </div>
    `,

    $: {
        console: '#console',
        openLogBtn: '#openLogBtn'
    },

    listeners: {
        'panel-resize' () {
            Manager.update();
        },
        'panel-show' () {
            Manager.update();
        }
    },

    messages: {
        'editor:console-log' (event, message) {
            Manager.addItem({ type: 'log', message: message });
        },

        'editor:console-success' (event, message) {
            Manager.addItem({ type: 'success', message: message });
        },

        'editor:console-failed' (event, message) {
            Manager.addItem({ type: 'failed', message: message });
        },

        'editor:console-info' (event, message) {
            Manager.addItem({ type: 'info', message: message });
        },

        'editor:console-warn' (event, message) {
            Manager.addItem({ type: 'warn', message: message });
        },

        'editor:console-error' (event, message) {
            Manager.addItem({ type: 'error', message: message });
        },

        'editor:console-clear' (event, pattern, useRegex) {
            if (!pattern) {
                return Manager.clear();
            }

            let filter;
            if ( useRegex ) {
                try {
                    filter = new RegExp(pattern);
                } catch ( err ) {
                    filter = new RegExp('');
                }
            } else {
                filter = pattern;
            }

            for (let i = Manager.list.length - 1; i >= 0; i--) {
                let log = Manager.list[i];

                if (useRegex) {
                    if ( filter.exec(log.title) ) {
                        Manager.list.splice(i, 1);
                    }
                }
                else {
                    if ( log.title.indexOf(filter) !== -1 ) {
                        Manager.list.splice(i, 1);
                    }
                }
            }

            Manager.update();

        },

        'console:query-last-error-log' (event) {
            if (!event.reply) {
                return;
            }

            var list = Manager.list;
            var index = list.length - 1;
            while (index >= 0) {
                let item = list[index--];
                if (item.type === 'error' || item.type === 'failed' || item.type === 'warn') {
                    return  event.reply(null, item);
                }
            }

            event.reply(null, undefined);
        }
    },

    ready () {
        let openLogBtn = this.$openLogBtn;
        let profile = this.profiles.local || { data: {}, save () { Editor.warn('The console settings are problematic'); } };

        this._vm = new Vue({
            el: this.$console,
            data: {
                messages: [],
                fontsize: profile.data.fontsize || 12,
                lineheight: profile.data.lineheight || 26,  // 每一行的高度
            },
            methods: {
                onClear () {
                    Editor.Ipc.sendToMain('console:clear', '^(?!.*?SyntaxError)', true);
                },
                onPopup () {
                    let rect = openLogBtn.getBoundingClientRect();
                    Editor.Ipc.sendToPackage('console', 'popup-open-log-menu', rect.left, rect.bottom + 5 );
                },
                onFilterType (event) {
                    Manager.setFilterType(event.target.value);
                },
                onCollapse (event) {
                    Manager.setCollapse(event.target.checked);
                },
                onFilterRegex (event) {
                    Manager.setFilterRegex(event.target.value);
                },
                onFilterText (event) {
                    Manager.setFilterText(event.target.value);
                },
                // 改变font-size
                onChangeFontSize (event) {
                    profile.data.fontsize = this.fontsize = parseInt( event.target.value );
                    profile.save();
                },
                // 改变line-height
                onChangeLineHeight(event) {
                    profile.data.lineheight = this.lineheight = parseInt( event.target.value );
                    Manager.itemHeight = this.lineheight;
                    Manager.update();
                    profile.save();
                },
                // 获得select范围
                getSizeArr (start, end) {
                    let arr = [];
                    while ( start < end ) arr.push( ++start );
                    return arr;
                }
            },
            components: {
                'console-list': ConsoleList
            }
        });

        // 将显示的数组设置进Manager
        // manager可以直接修改这个数组，更新数据
        // 将每一行的行高设置进Manager，然后通过Manager进行操作设置相应的translateY.
        Manager.setRenderCmds(this._vm.messages, this._vm.lineheight);

        Editor.Ipc.sendToMain( 'editor:console-query', (err,results) => {
            Manager.addItems(results);
        });
    },

    clear () {
        Manager.clear();
        Editor.Ipc.sendToMain('console:clear');
    }

});
