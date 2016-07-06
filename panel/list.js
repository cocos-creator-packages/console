'use strict';

const ConsoleItem = require(Editor.url('packages://console/panel/item'));

exports.template = `
<section v-init="messages" v-on:scroll="onScroll">

    <!--<console-item id=""></console-item>-->

    <div v-bind:style="sectionStyle">
    
        <template v-for="item in list">
            <console-item
             v-bind:type="item.type"
             v-bind:title="item.title"
             v-bind:info="item.info"
             v-bind:y="item.translateY"
             v-bind:texture="item.texture"
             v-bind:rows="item.rows"
             v-bind:fold="item.fold"
             v-bind:num="item.num"
         ></console-item>
        </template>
    </div>

</section>
`;


var getHeight = function (list) {
    var height = 0;
    list.forEach((item) => {
        if (item.fold) {
            height += 30;
        } else {
            height += item.rows * 30;
        }
    });
    return height;
};

exports.props = ['messages'];

exports.components = {
    'console-item': ConsoleItem
};

exports.data = function () {
    return {
        list: [],
        sectionStyle: { height: 0 }
    }
};

var createItem = function () {
    return {
        type: '',
        rows: 0, // 默认高度
        title: '',
        info: '',
        texture: 'dark',
        fold: true,
        num: 1,
        translateY: -1000
    };
};

exports.methods = {
    onScroll (event) {
        var list = this.messages;
        var dataList = this.list;
        var scroll = event.target.scrollTop;

        var tmp = 0;
        var index = 0;
        list.some((item, i) => {
            if (item.fold) {
                tmp += 30;
            } else {
                tmp += item.rows * 30;
            }
            if (tmp > scroll) {
                index = i - 1;
                return true;
            }
        });

        dataList.forEach(function (item, i) {
            var source = list[index + i];
            if (!source) {
                item.translateY = -1000;
                return;
            }
            item.type = source.type;
            item.rows = source.rows;
            item.title = source.title;
            item.info = source.info;
            item.fold = source.fold;
            item.num = source.num;
            item.texture = ((index + i)%2 === 0) ? 'dark' : 'light';
            item.translateY = source.translateY;
        });
    },
    onUpdateFold (y, fold) {
        var index = 0;
        for (var j = 0; j < this.messages.length; j++) {
            if (this.messages[j].translateY === y) {
                index = j;
                break;
            }
        }

        var source = this.messages[index++];
        source.fold = fold;
        var offsetY = source.rows * 30 - 30;
        if (fold) {
            offsetY = -offsetY;
        }
        for (index; index<this.messages.length; index++) {
            this.messages[index]['translateY'] += offsetY;
        }

        // 计算总高度
        this.sectionStyle.height = getHeight(this.messages);

        this.onScroll({ target: this.$el });
    }
};

exports.directives = {
    init (list) {
        // 计算总高度
        var height = getHeight(list);
        this.vm.sectionStyle.height = height;

        // 当前显示高度可以显示多少条信息
        var num = this.vm.$el.clientHeight / 30 + 3 | 0;

        // 生成 list 数组
        var dataList = this.vm.list;
        while (dataList.length > num) {
            dataList.pop();
        }

        // 用户如果更改了滚动的 scrollTop，则不自动跳到底部
        // 如果滚动条不在页面最顶部以及最底部，则添加 log 的时候不去滚动
        var ts = this.vm.$el.scrollTop;
        var tc = this.vm.$el.clientHeight;
        if (ts !== 0 && height - tc -ts > 30) {
            return this.vm.onScroll({ target: this.vm.$el });
        }

        requestAnimationFrame(() => {
            var scroll = this.vm.$el.scrollTop = height - tc;

            var tmp = 0;
            var index = 0;
            list.some((item, i) => {
                if (item.fold) {
                    tmp += 30;
                } else {
                    tmp += item.rows * 30;
                }
                if (tmp > scroll) {
                    index = i - 1;
                    return true;
                }
            });

            for (var i=0; i<num; i++) {
                if (!dataList[i])
                    dataList.push(createItem());
                else
                    dataList[i].translateY = -1000;
            }

            this.vm.onScroll({ target: this.vm.$el });
        });


    }
};