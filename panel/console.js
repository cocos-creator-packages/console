(function () {
Editor.registerPanel( 'console.panel', {
    properties: {
        logs: {
            type: Array,
            value: function () {
                return [];
            },
        },

        filterOption: {
            type: String,
            value: 'All',
        },

        filterText: {
            type: String,
            value: '',
        },

        useRegex: {
            type: Boolean,
            value: false,
        },

        collapse: {
            type: Boolean,
            value: true,
        },

        logsCount: {
            type: Number,
            value: 0,
        },
    },

    ready: function () {
        Editor.sendRequestToCore( 'console:query', function ( results ) {
            for ( var i = 0; i < results.length; ++i ) {
                var item = results[i];
                this.add( item.type, item.message );
            }
        }.bind(this));
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
        var desc = text.split('\n')[0];
        var detail = '';
        var firstLine = text.indexOf('\n');
        if (firstLine > 0) {
            detail = text.substring(firstLine + 1);
        }

        this.push('logs', {
            type: type,
            text: text,
            desc: desc,
            detail: detail,
            count: 0,
        });
        this.logsCount = this.logs.length;

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
        this.logsCount = this.logs.length;
        Editor.sendToCore('console:clear');
    },

    applyFilter: function ( logsCount, filterText, filterOption, useRegex, collapse ) {
        var filterLogs = [];
        var type = filterOption.toLowerCase();

        var filter;
        if ( useRegex ) {
            try {
                filter = new RegExp(filterText);
            }
            catch ( err ) {
                filter = new RegExp('');
            }
        }
        else {
            filter = filterText.toLowerCase();
        }

        var i = 0;
        var log = null;

        for ( i = 0; i < this.logs.length; ++i ) {
            var log_ = this.logs[i];

            log = {
                type: log_.type,
                text: log_.text,
                desc: log_.desc,
                detail: log_.detail,
                count: 0,
            };

            if ( type !== 'all' && log.type !== type ) {
                continue;
            }

            if ( useRegex ) {
                if ( !filter.exec(log.text) ) {
                    continue;
                }
            }
            else {
                if ( log.text.toLowerCase().indexOf(filter) === -1 ) {
                    continue;
                }
            }

            filterLogs.push(log);
        }


        if ( collapse && filterLogs.length > 0 ) {
            var collapseLogs = [];
            var lastLog = filterLogs[0];

            collapseLogs.push( lastLog );

            for ( i = 1; i < filterLogs.length; ++i ) {
                log = filterLogs[i];

                if ( lastLog.text === log.text && lastLog.type === log.type ) {
                    lastLog.count += 1;
                }
                else {
                    collapseLogs.push( log );
                    lastLog = log;
                }
            }

            filterLogs = collapseLogs;
        }

        return filterLogs;
    },
});

})();
