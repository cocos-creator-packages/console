'use strict';

// 数据源，从外部获取 log 信息后，就直接存在这里
var list = exports.list = [];

// 显示数据，从数据源筛选出来的显示数据
// 这个数据直接用于 vue 的数据绑定
// 所以应该避免使用 array[i] = xxx 这样的用法
// 只能够使用 pop() splice() push() 等方法，否则会破坏数据绑定
var renderCmds = exports.renderCmds = null;

exports.setRenderCmds = function (array) {
    renderCmds = exports.renderCmds = array;
};

var collapse = true;
var filterType = '';
var filterText = '';
var filterRegex = false;

/**
 * 添加一组数据
 * @param array
 */
exports.addItems = function (array) {
    array.forEach((item) => {
        exports.addItem(item);
    });
};

/**
 * 添加一条数据
 * @param item
 */
exports.addItem = function (item) {
    var result = {};
    result.type = item.type;
    var split = item.message.split('\n');
    split = split.map((item) => {
        return item.trim();
    });
    split = split.filter((item) => {
        return item !== "";
    });
    result.rows = split.length; // 默认高度
    result.title = split[0];
    result.info = split.splice(1).join('\n');
    result.fold = true; // 折叠
    result.num = 1;
    // result.translateY = list.length * 30;

    list.push(result);
    exports.update();
};

/**
 * 清空数据
 */
exports.clear = function () {
    while (list.length > 0) {
        list.pop();
    }
    exports.update();
};

var updateLocker = false;
/**
 * 更新显示数据
 */
exports.update = function () {
    if (updateLocker || !renderCmds) return;
    updateLocker = true;
    requestAnimationFrame(() => {
        updateLocker = false;
        var offsetY = 0;
        while (renderCmds.length > 0) {
            renderCmds.pop();
        }

        var filter = filterText;
        if (filterRegex) {
            try {
                filter = new RegExp(filter);
            } catch (error) {
                filter = /.*/;
            }
        }

        var sources = list.filter((item) => {
            // 过滤一遍 title 不存在的项目
            if (!item.title) {
                return false;
            }

            // 根据 type 过滤一遍 log
            if (filterType && item.type !== filterType) {
                return false;
            }

            // 根据填入的过滤条件再次过滤一遍
            if (filterRegex) {
                return filter.test(item.title);
            } else {
                return item.title.indexOf(filter) !== -1;
            }
        });


        // 最后将过滤出来的 log 信息放入需要显示的 renderCmds 队列
        sources.forEach((item) => {
            var reference = renderCmds[renderCmds.length - 1];
            // 根据 collapse 过滤一遍
            if (collapse && reference && item.title === reference.title && item.info === reference.info && item.type === reference.type) {
                reference.num += 1;
                return;
            }
            item.num = 1;
            item.translateY = offsetY;
            renderCmds.push(item);
            if (item.fold) {
                offsetY += 30;
            } else {
                offsetY += item.rows * 26 + 14;
            }
        });
    });
};

exports.setCollapse = function (bool) {
    collapse = !!bool;
    exports.update();
};

exports.setFilterType = function (str) {
    filterType = str;
    exports.update();
};

exports.setFilterText = function (str) {
    filterText = str;
    exports.update();
};

exports.setFilterRegex = function (bool) {
    filterRegex = !!bool;
    exports.update();
};