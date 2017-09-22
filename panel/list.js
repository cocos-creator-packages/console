'use strict';

const fs = require('fs');
const path = require('path');
const ConsoleItem = require(Editor.url('packages://console/panel/item'));

exports.template = fs.readFileSync(path.join(__dirname, './template/list.html'), 'utf-8');

// 新添加一个参数 itemHeight，行高为可变的。
var getHeight = function (list, itemHeight) {
    var height = 0;
    list.forEach((item) => {
        if (item.fold) {
            height += itemHeight;
        } else {
            height += item.rows * (itemHeight - 2) + 14;
        }
    });
    return height;
};

// 获得滚动位置
// list: 所有的数据; itemHeight: 行高。
var getScrollPosition = function(list, itemHeight, scroll) {
    var tmp = 0;
    var index = 0;
    list.some((item, i) => {
        if (item.fold) {
            tmp += itemHeight;
        } else {
            tmp += item.rows * (itemHeight - 2) + 14;
        }
        if (tmp > scroll) {
            index = i - 1;
            return true;
        }
    });
    return index;
}

exports.props = ['messages','fontsize','lineheight'];

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
        translateY: -1000,
        show: false,
    };
};

exports.methods = {
    onScroll (event) {
        var list = this.messages;
        var dataList = this.list;
        var scroll = event.target.scrollTop;

        var itemHeight = this.lineheight;
        var index = getScrollPosition(list, itemHeight, scroll);

        dataList.forEach(function (item, i) {
            var source = list[index + i];
            if (!source) {
                item.translateY = -1000;
                item.show = false;
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
            item.show = true;
        });
    },
    onUpdateFold (y, fold) {
        var index = 0;
        var itemHeight = this.lineheight;
        for (var j = 0; j < this.messages.length; j++) {
            if (this.messages[j].translateY === y) {
                index = j;
                break;
            }
        }

        var source = this.messages[index++];
        source.fold = fold;
        var offsetY = source.rows * (itemHeight - 2) + 14 - itemHeight;
        if (fold) {
            offsetY = -offsetY;
        }
        for (index; index<this.messages.length; index++) {
            let item = this.messages[index];
            item['translateY'] += offsetY;
            item.show = true;
        }

        // 计算总高度
        this.sectionStyle.height = getHeight(this.messages, itemHeight);

        this.onScroll({ target: this.$el });
    }
};

var scrollTimer = null;
var scrollNumCache = null;

exports.directives = {
    init (obj) {
        // 计算总高度
        var itemHeight = obj.lineheight;
        var list = obj.messages;
        var height = getHeight(list, itemHeight);
        this.vm.sectionStyle.height = height;

        // 当前显示高度可以显示多少条信息
        var num = this.vm.$el.clientHeight / itemHeight + 3 | 0;

        // 生成 list 数组
        var dataList = this.vm.list;
        while (dataList.length > num) {
            dataList.pop();
        }

        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {

            var height = getHeight(list, itemHeight);

            // 用户如果更改了滚动的 scrollTop，则不自动跳到底部
            // 如果滚动条不在页面最顶部以及最底部，则添加 log 的时候不去滚动
            var ts = this.vm.$el.scrollTop;
            var tc = this.vm.$el.clientHeight;
            var cn = list.length - scrollNumCache;
            scrollNumCache = list.length;

            var scroll;
            if (ts !== 0 && height - tc -ts > itemHeight * cn) {
                scroll = this.vm.$el.scrollTop;
            } else {
                scroll = this.vm.$el.scrollTop = height - tc
            }

            var index = getScrollPosition(list, itemHeight, scroll)

            for (var i=0; i<num; i++) {
                if (!dataList[i]) {
                    dataList.push(createItem());
                } else {
                    let item = dataList[i];
                    item.translateY = -1000;
                    item.show = false;
                }

            }

            this.vm.onScroll({ target: this.vm.$el });
        }, 10);


    }
};