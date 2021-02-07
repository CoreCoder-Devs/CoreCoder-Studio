const {app, BrowserWindow} = require('electron');

// Only create the window when electron is ready
app.on("ready", ()=>{
    // Create the window instance
    const window = new BrowserWindow({
        title : "CoreCoder:Studio dev preview 1",
        frame: false
    });

    // Show the window then load the html file
    window.show();
    window.loadFile("./src/project-manager.html");
});