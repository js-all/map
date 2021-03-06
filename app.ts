import { app, BrowserWindow } from 'electron';

let win :BrowserWindow | null;

function createWindow () {
  win = new BrowserWindow({ width: 800, height: 600, frame: false })
  win.loadFile('./app/index.html')
  win.webContents.toggleDevTools();
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})