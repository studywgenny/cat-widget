const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  moveKitty: (pos) => ipcRenderer.send("move-kitty", pos),
  kittyBounds: () => ipcRenderer.invoke("kitty-bounds"),
});