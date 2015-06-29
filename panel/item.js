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

        detail: {
            type: String,
            value: '',
        }
    },

    ready: function (){
        this.description = this.text.split("\n")[0];
        var firstLine = this.text.indexOf('\n');
        if (firstLine > 0) {
            this.detail = this.text.substring(firstLine + 1);
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

    _textClass: function (detail) {
        if (detail) {
            return 'text more';
        }
        else {
            return 'text';
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

    _foldClass: function ( detail, folded ) {
        if (!detail) {
            return;
        }
        return folded ? 'fa fold fa-caret-down' : 'fa fold fa-caret-right';
    },
});
