// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import { app, Menu } from "electron";
import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import createWindow from "./helpers/window";

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";

const setApplicationMenu = () => {
  const menus = [editMenuTemplate];
  if (env.name !== "production") {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    //if (url === 'https://github.com') {
      // Verification logic.
      event.preventDefault()
      callback(true)
    //} else {
    //  callback(false)
    //}
})

app.on("ready", () => {
  setApplicationMenu();
  const cp = require('child_process') ;

  //This will load the child_process module, and spawn a new process in the background that executes your script.
  let options = {stdio: [ 0, 1, 2, 'ipc' ]}; // Verbose
  //let options = {stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]}; // Silent

  const child1 = cp.spawn('node',[path.join(__dirname, "server.js")], options);
  const child2 = cp.spawn('node',[path.join(__dirname, "ps.js")], options);

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "app.html"),
      protocol: "file:",
      slashes: true
    })
  );

  if (env.name === "development") {
    mainWindow.openDevTools();
  }
});

app.on("window-all-closed", () => {
  child1.stdin.pause();
  child1.kill();
  child2.stdin.pause();
  child2.kill();
  app.quit();
});
