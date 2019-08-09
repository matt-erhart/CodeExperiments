const { format } = require("url");

const { BrowserWindow, app, globalShortcut } = require("electron");
const isDev = require("electron-is-dev");
const { resolve } = require("app-root-path");

app.on("ready", async () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      plugins: true,
    }
  });

  

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
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
