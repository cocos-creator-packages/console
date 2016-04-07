'use strict';

const Electron = require('electron');

module.exports = {
  load () {
  },

  unload () {
  },

  messages: {
    'open' () {
      Editor.Panel.open('console.panel');
    },

    'open-log-file': function () {
      Electron.shell.openItem(Editor.logfile);
    },

    'console:clear' () {
      Editor.clearLog();
    },
  }
};
