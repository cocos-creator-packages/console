'use strict';

const Electron = require('electron');
const Clipboard = Electron.clipboard;

module.exports = {
  load () {
    Editor.Menu.register( 'open-log-file', () => {
      return [
        {
          label: Editor.T('CONSOLE.editor_log'),
          params: [],
          click () {
            Editor.Ipc.sendToMain('console:open-log-file');
          }
        },
        {
          label: Editor.T('CONSOLE.cocos_console_log'),
          params: [],
          click () {
            Editor.Ipc.sendToMain('app:open-cocos-console-log');
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
      Editor.Panel.open('console');
    },

    'open-log-file': function () {
      Electron.shell.openItem(Editor.logfile);
    },

    'console:clear' ( event, pattern, useRegex ) {
      Editor.clearLog( pattern, useRegex );
    },

    'popup-open-log-menu': function (event, x, y) {
      let menuTmpl = Editor.Menu.getMenu('open-log-file');

      let editorMenu = new Editor.Menu(menuTmpl, event.sender);
      x = Math.floor(x);
      y = Math.floor(y);
      editorMenu.nativeMenu.popup(Electron.BrowserWindow.fromWebContents(event.sender), x, y);
      editorMenu.dispose();
    },

    'popup-item-menu' (event, x, y, text) {
      var menuTmpl = [
        {
          label: Editor.T('CONSOLE.copy_to_clipboard'),
          params: [],
          click () {
            Clipboard.writeText(text || '');
          }
        }
      ];
      let editorMenu = new Editor.Menu(menuTmpl, event.sender);
      x = Math.floor(x);
      y = Math.floor(y);
      editorMenu.nativeMenu.popup(Electron.BrowserWindow.fromWebContents(event.sender), x, y);
      editorMenu.dispose();
    },
  }
};
