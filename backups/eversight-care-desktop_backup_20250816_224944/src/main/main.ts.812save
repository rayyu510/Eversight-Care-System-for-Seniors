import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';

// Disable security warnings in development
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// Remove Electron security flags for development
if (process.env.NODE_ENV === 'development') {
  app.commandLine.appendSwitch('--disable-web-security');
}

// Check if we're in development
const isDev = process.env.NODE_ENV === 'development';

console.log('📊 Running in demo mode - using mock data');

async function createWindow(): Promise<void> {
  const mainWindow = new BrowserWindow({
    title: 'EverSight Care Desktop',
    icon: join(process.env.DIST || '', 'icon.ico'),
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Test active push message to Renderer-process
  mainWindow.webContents.on('did-finish-load', () => {
    const title = 'EverSight Care Desktop';
    const message = 'Guardian Protect Module Ready';

    mainWindow?.webContents.send('main-process-message', { title, message });
  });

  // Make all links open with the browser, not with the application
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Load the appropriate URL based on environment
  if (isDev) {
    // Development: load from webpack dev server
    await mainWindow.loadURL('http://localhost:3000');
    // Open devtools in development
    mainWindow.webContents.openDevTools();
  } else {
    // Production: load from built files
    const indexPath = join(process.env.DIST || '', 'index.html');
    console.log('Loading from:', indexPath);
    await mainWindow.loadFile(indexPath);
  }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS, re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Security: Prevent new window creation
app.on('web-contents-created', (_, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
});