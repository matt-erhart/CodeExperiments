const { format } = require("url");

import { BrowserWindow, app, globalShortcut, shell, desktopCapturer } from "electron"
const isDev = require("electron-is-dev");
const { resolve } = require("app-root-path");
const util = require("util");
const setTimeoutPromise = util.promisify(setTimeout);

app.on("ready", async () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    x: 0,
    y: 0,
    show: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      plugins: true
    }
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
    setTimeoutPromise(1000).then(value => {
      
      // value === 'foobar' (passing values is optional)
      // This is executed after about 40 milliseconds.
      mainWindow.setBounds({ x: 440, y: 225, width: 800, height: 600 }, true);
    });
  });

  const devPath = "http://localhost:1124";
  const prodPath = format({
    pathname: resolve("app/renderer/.parcel/production/index.html"),
    protocol: "file:",
    slashes: true
  });
  const url = isDev ? devPath : prodPath;

  mainWindow.setMenu(null);
  mainWindow.loadURL(url);

  mainWindow.on("focus", () => {
    globalShortcut.register("CommandOrControl+F", function() {
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send("on-find", "");
      }
    });
  });

  mainWindow.on("blur", () => {
    globalShortcut.unregister("CommandOrControl+F");
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
  globalShortcut.unregister("CommandOrControl+F");
});


