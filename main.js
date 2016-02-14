const Electron = require('electron');

module.exports = {
    load: function () {
    },

    unload: function () {
    },

    'console:open': function () {
        Editor.Panel.open('console.panel');
    },

    '_console:open': function () {
        Electron.shell.openItem(Editor.logfile);
    },
};
