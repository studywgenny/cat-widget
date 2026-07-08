const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");

let kittyWin;

function createKittyWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  kittyWin = new BrowserWindow({
    width: 180,
    height: 180,
    x: Math.floor(width / 2),
    y: Math.floor(height / 2),
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });
  kittyWin.loadFile("kitty.html");
}

app.whenReady().then(createKittyWindow);

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });

ipcMain.on("move-kitty", (_e, { x, y }) => { if (kittyWin) kittyWin.setPosition(x, y); });
ipcMain.handle("kitty-bounds", () => {
  const d = screen.getPrimaryDisplay().workAreaSize;
  const p = kittyWin ? kittyWin.getPosition() : [0, 0];
  return { screenW: d.width, screenH: d.height, x: p[0], y: p[1] };
});