Editor.registerElement({
    properties: {
        type: {
            type: String,
            value: 'log',
            reflectToAttribute: true,
        },

        count: {
            type: Number,
            value: 0,
        },

        desc: {
            type: String,
            value: '',
        },

        detail: {
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
    },

    ready: function () {
    },

    _typeClass: function ( type ) {
        return 'item layout  ' + type;
    },

    _iconClass: function (type) {
        switch (type) {
            case 'error':
                return 'fa fa-times-circle icon';

            case 'warn':
                return 'fa fa-warning icon';

            default:
                return '';
        }
    },

    _textClass: function (detail) {
        if (detail) {
            return 'more';
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
        this.set( 'folded', !this.folded );
    },

    _foldClass: function ( detail, folded ) {
        if (!detail) {
            return;
        }
        return folded ? 'fa fold fa-caret-down' : 'fa fold fa-caret-right';
    },
});
