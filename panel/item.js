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
            reflectToAttribute: true,
        },

        _hasDetail: {
            type: Boolean,
            value: true,
        }
    },

    ready: function (){
        if (this.text.indexOf('\r\n') < 0 && this.text.indexOf('\n') < 0) {
            this._hasDetail = false;
        }
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
            default:
                return '';
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

    _onFoldClick: function () {
        this.folded = !this.folded;
    },

    _foldClass: function ( hasDetail, folded ) {
        if (!hasDetail) {
            return '';
        }

        return folded ? 'fa fold fa-caret-down' : 'fa fold fa-caret-right';
    },
});
