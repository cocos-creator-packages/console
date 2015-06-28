(function () {
var Util = require('util');

Editor.registerPanel( 'console.panel', {
    is: 'editor-console',

    properties: {
        logs: {
            type: Object,
            notify: true,
            value: [],
        },

        _logs: {
            type: Object,
            notify: true,
        },

        option: {
            type: Number,
            value: 0,
            notify: true,
            observer: 'applyFilter'
        },

        filterText: {
            type: String,
            value: '',
            notify: true,
            observer: 'applyFilter'
        },

        useRegex: {
            type: Boolean,
            value: false,
            notify: true,
            observer: 'applyFilter'
        },
    },

    ready: function () {
        this.logs = [];
        this._logs = [];
        this.options = [
            { name: 'All'  , value: 0 },
            { name: 'Log'  , value: 1 },
            { name: 'Success' , value: 2 },
            { name: 'Failed', value: 3 },
            { name: 'Info' , value: 4 },
            { name: 'Warn' , value: 5 },
            { name: 'Error' , value: 6 },
        ];

        this.option = 0;
        this.collapse = true;

        Editor.sendRequestToCore( 'console:query', function ( results ) {
            for ( var i = 0; i < results.length; ++i ) {
                var item = results[i];
                this.add( item.type, item.message );
            }
        }.bind(this));
    },

    _logsChanged: function () {
        this.applyFilter();
    },

    'console:log': function ( message ) {
        this.add( 'log', message );
    },

    'console:success': function ( message ) {
        this.add( 'success', message );
    },

    'console:failed': function ( message ) {
        this.add( 'failed', message );
    },

    'console:info': function ( message ) {
        this.add( 'info', message );
    },

    'console:warn': function ( message ) {
        this.add( 'warn', message );
    },

    'console:error': function ( message ) {
        this.add( 'error', message );
    },

    'console:clear': function () {
        this.clear();
    },

    add: function ( type, text ) {
        this.push('logs', {
            type: type,
            text: text,
            count: 0,
        });

        this.push('_logs', {
            type: type,
            text: text,
            count: 0,
        });

        // to make sure after layout and before render
        if ( !this._scrollTaskID ) {
            this._scrollTaskID = window.requestAnimationFrame ( function () {
                this._scrollTaskID = null;
                this.$.view.scrollTop = this.$.view.scrollHeight;
            }.bind(this) );
        }
    },

    clear: function () {
        this.logs = [];
        this._logs = [];
        Editor.sendToCore('console:clear');
    },

    _format: function ( args ) {
        var text = args.length > 0 ?  args[0] : '';
        if (args.length <= 1) {
            text = '' + text;
        } else {
            text = Util.format.apply(Util, args);
        }
        return text;
    },

    applyFilter: function () {
        var tempLogs = [];
        this.option = parseInt(this.option);
        if (this.option !== 0) {
            for (var i = 0; i < this._logs.length; i++) {
                if (this.options[this.option].name.toLowerCase() === this._logs[i].type) {
                    tempLogs.push(this._logs[i]);
                }
            }
        }
        else {
            tempLogs = this._logs;
        }

        if (this.filterText !== '') {
            if (typeof(this._logs) === 'object') {
                var filter;
                if ( this.useRegex ) {
                    try {
                        filter = new RegExp(this.filterText);
                        this.$.input.invalid = false;
                    }
                    catch ( err ) {
                        filter = new RegExp("");
                        this.$.input.invalid = true;
                    }
                }
                else {
                    filter = this.filterText.toLowerCase();
                }

                var tempFilterLogs = [];
                for (var i = 0; i < tempLogs.length; i++) {
                    if (this.useRegex) {
                        if (filter.exec(tempLogs[i].text)) {
                            tempFilterLogs.push(tempLogs[i]);
                        }
                    }
                    else {
                        if (tempLogs[i].text.toLowerCase().indexOf(filter) > -1) {
                            tempFilterLogs.push(tempLogs[i]);
                        }
                    }
                }
                tempLogs = tempFilterLogs;
            }
        }

        this.logs = [];
        this.logs = tempLogs;
    },
});

})();
