'use strict';

const Electron = require('electron');
const BrowserWindow = require('browser-window');

module.exports = {
  load () {
    Editor.Menu.register( 'open-log-file', () => {
      return [
        {
          label: Editor.T('CONSOLE.editor_log'),
          params: [],
          click () {
            Editor.sendToCore('console:open-log-file');
          }
        },
        {
          label: Editor.T('CONSOLE.cocos_console_log'),
          params: [],
          click () {
            Editor.sendToCore('app:open-cocos-console-log');
          }
        },
      ];
    }, true );
  },

  unload () {
    Editor.Menu.unregister( 'open-log-file' );
  },

  messages: {
    'open' () {
      Editor.Panel.open('console.panel');
    },

    'open-log-file': function () {
      Electron.shell.openItem(Editor.logfile);
    },

    'popup-open-log-menu': function (event, x, y) {
      let menuTmpl = Editor.Menu.getMenu('open-log-file');

      let editorMenu = new Editor.Menu(menuTmpl, event.sender);
      x = Math.floor(x);
      y = Math.floor(y);
      editorMenu.nativeMenu.popup(BrowserWindow.fromWebContents(event.sender), x, y);
      editorMenu.dispose();
    }
  }
};
