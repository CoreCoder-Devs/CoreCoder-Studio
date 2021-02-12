const {ipcMain, app, BrowserWindow} = require('electron');

// Only create the window when electron is ready
app.on("ready", ()=>{
    // Create the window instance
    const window = new BrowserWindow({
        title : "CoreCoder:Studio dev preview 1",
        titleBarStyle: 'customButtonsOnHover',
        frame: false,
        icon: "src/resources/icon.ico",
        nodeIntegration: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule:true,
            webSecurity: false
        }
    });

    // Show the window then load the html file
    window.show();
    window.loadFile("./src/project-manager.html");

    // Events from html
    ipcMain.on("minimize", (event, arg)=>{
        window.minimize();
    });
    ipcMain.on("maximize", (event, arg)=>{
        window.maximize();
    });
    ipcMain.on("restore", (event, arg)=>{
        window.restore();
    });
    ipcMain.on("close", (event, arg)=>{
        app.quit();
    });

    // Event from the window
    window.on("maximize", ()=>{
        window.webContents.send("windowStateMaximized");
    });
    window.on("unmaximize", ()=>{
        window.webContents.send("windowStateRestored");
    });
    window.on("restore", ()=>{
        window.webContents.send("windowStateRestored");
    });
});
