Polymer({
    is: 'editor-console-item',

    properties: {
        type: {
            type: String,
            value: 'log',
        },

        count: {
            type: Number,
            value: 0,
        },

        text: {
            type: String,
            value: '',
        },

        showCount: {
            type: Boolean,
            value: false,
        },

        folded: {
            type: Boolean,
            value: false,
            observer: '_foldInChanged',
            reflectToAttribute: true,
        },
    },

    _typeClass: function ( type ) {
        return 'item layout horizontal ' + type;
    },

    _iconClass: function (type) {
        switch (type) {
            case 'error':
                return 'fa fa-times-circle icon';
            break;
            case 'warn':
                return 'fa fa-warning icon';
            break;
        }
    },

    _showCount: function ( showCount, count ) {
        if ( showCount && count > 0 ) {
            return true;
        }

        return false;
    },

    _computedCount: function ( count ) {
        return count + 1;
    },

    _onClickFold: function () {
        this.folded = !this.folded;
    },

    _foldInChanged: function () {
        if (this.folded) {
            this.foldIconClass = 'fa fold fa-caret-down';
        }
        else {
            this.foldIconClass = 'fa fold fa-caret-right';
        }
    },
});
