'use strict';

const fs = require('fs');
const path = require('path');

exports.template = fs.readFileSync(path.join(__dirname, './template/item.html'), 'utf-8');

exports.props = ['type', 'title', 'info', 'y', 'texture', 'rows', 'fold', 'num', 'lineheight', 'fontsize'];

exports.data = function () {
    return {
        foldInfo: [],
        style: {
            transform: 'translateY(0)',
            fontSize: this.fontsize + 'px',
            lineHeight: this.lineheight + 'px'
        }
    };
};

exports.watch = {
    fontsize: function() {
        this.style.fontSize = this.fontsize + 'px';
    },
    lineheight: function() {
        this.style.lineHeight = this.lineheight + 'px';
    }
}

exports.directives = {
    init (y) {
        this.vm.style.transform = `translateY(${y}px)`;
    },
    info (info) {
        var sources = info.split('\n');
        var results = this.vm.foldInfo;
        while (results.length > 0) {
            results.pop();
        }
        sources.forEach((item) => {
            var match = item.match(/(^ *at (\S+ )*)(\(*[^\:]+\:\d+\:\d+\)*)/);
            match = match || ['', item, undefined, ''];
            results.push({
                info: match[1] || '',
                path: match[3] || ''
            });
        });
    }
};

var Selection = document.getSelection();

exports.methods = {
    onHide () {
        this.$parent.onUpdateFold(this.y, true);
    },
    onShow () {
        this.$parent.onUpdateFold(this.y, false);
    },
    onMouseDown (event) {
        if (event.button !== 2) return;

        // 获取选中的文本
        var text = Selection.toString();
        if (!text) {
            text += this.title;
            if (this.info) {
                text += '\r\n' + this.info;
            }
        }

        Editor.Ipc.sendToPackage('console', 'popup-item-menu', event.clientX, event.clientY + 5, text );
    }
};
