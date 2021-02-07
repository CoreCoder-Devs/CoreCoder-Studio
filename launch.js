const {app, BrowserWindow} = require('electron');

app.on("ready", ()=>{
    const window = new BrowserWindow({
        title : "CoreCoder:Studio dev preview 1",
        frame: false
    });
    window.show();
    window.loadFile("./src/project-manager.html");
});