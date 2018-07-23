'use strict'

// Import parts of electron to use
const electron = require('electron')
const electronReload = require('./electron-reload')
const { app, BrowserWindow } = electron
const path = require('path')
const url = require('url')
const fs = require('fs')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// eslint-disable-next-line
let mainWindow

function createWindow() {
  const opts = JSON.parse(process.env.ESOPS)
  const { cwd, devMode } = opts

  const electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron')
  electronReload([cwd, __dirname], {
    // Note that the path to electron may vary according to the main file
    electron: electronPath
  })

  const desktopFilePath = path.join(cwd, 'target/main.desktop.js')
  const desktopTargetFileFound = fs.existsSync(desktopFilePath)

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    // minHeight: 563,
    // minWidth: 1000,
    height: 563,
    show: false
  })

  if (desktopTargetFileFound) {
    const userMain = require(desktopFilePath)
    const userExportFunc = userMain.default || userMain
    userExportFunc({ electron, mainWindow, esops: opts })
  }

  // and load the index.html of the app.
  const indexConfig = devMode
    ? {
        protocol: 'http:',
        host: 'localhost:8000',
        pathname: 'index.html',
        slashes: true
      }
    : {
        protocol: 'file:',
        pathname: path.join(__dirname, 'dist', 'index.html'),
        slashes: true
      }

  mainWindow.loadURL(url.format(indexConfig))

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    // Open the DevTools automatically if developing
    if (devMode) {
      // mainWindow.webContents.openDevTools()
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}
