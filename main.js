const { app, BrowserWindow } = require('electron')
const updater = require("electron-updater");
const autoUpdater = updater.autoUpdater;

autoUpdater.requestHeaders = { "PRIVATE-TOKEN": "kCKEssDnSefnehqb4A2D" };
autoUpdater.autoDownload = true;

autoUpdater.setFeedURL({
  provider: "generic",
  url: "http://gitlab.com/api/v4/projects/21372852/jobs/artifacts/master/raw/dist/?job=build"
});

let Gwin;

function createWindow () {
  // Erstelle das Browser-Fenster.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // und lade den Inhalt von index.html.
  win.loadFile('index.html')

  // Öffnen der DevTools.
  win.webContents.openDevTools()

  Gwin = win;

}

function sendStatusToWindow(text) {
    log.info(text);
    win.webContents.send('message', text);
}

// Diese Methode wird aufgerufen, wenn Electron das Starten abgeschlossen hat und bereit ist, 
// ein Browser Fenster zu erstellen.
// Einige APIs können nur nach dem Auftreten dieses Events genutzt werden.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In dieser Datei kann der Rest des App-Codes für den main proccess eingefügt werden. Sie können den Code auch 
// auf mehrere Dateien aufteilen und diese hier einbinden.


autoUpdater.on('checking-for-update', function () {
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', function (info) {
  sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', function (info) {
  sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', function (err) {
  sendStatusToWindow('Error in auto-updater.');
});

autoUpdater.on('download-progress', function (progressObj) {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', function (info) {
  sendStatusToWindow('Update downloaded; will install in 1 seconds');
});

autoUpdater.on('update-downloaded', function (info) {
  setTimeout(function () {
      autoUpdater.quitAndInstall();
  }, 1000);
});

autoUpdater.checkForUpdates();

function sendStatusToWindow(message) {
  console.log(message);
}