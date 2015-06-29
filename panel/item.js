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
    },

    _typeClass: function ( type ) {
        return 'item layout horizontal ' + type;
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
});
