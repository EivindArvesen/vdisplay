import "./stylesheets/main.css";

// Small helpers you might want to keep
import "./helpers/context_menu.js";
import "./helpers/external_links.js";

// ----------------------------------------------------------------------------
// Everything below is just to show you how it works. You can delete all of it.
// ----------------------------------------------------------------------------

import { remote } from "electron";
import path from "path";
import jetpack from "fs-jetpack";
import { greet } from "./hello_world/hello_world";
import env from "env";

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

const localIP = require('my-local-ip')();

var os = require("os");
const hostName = os.hostname();

// Holy crap! This is browser window with HTML and stuff, but I can read
// files from disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read("package.json", "json");

/*
const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};

document.querySelector("#app").style.display = "block";
document.querySelector("#greet").innerHTML = greet();
document.querySelector("#os").innerHTML = osMap[process.platform];
document.querySelector("#author").innerHTML = manifest.author;
document.querySelector("#env").innerHTML = env.name;
document.querySelector("#electron-version").innerHTML =
  process.versions.electron;
*/

const {BrowserWindow} = require('electron').remote;

var media = require('rtc-media');
var h = require('hyperscript');
var crel = require('crel');
var screenshare = require('rtc-screenshare')({
  chromeExtension: 'rtc.io screenshare',
  version: '^1.0.0'
});

document.querySelector("#address1").innerHTML =
  hostName; //localIp
document.querySelector("#address2").innerHTML =
  hostName; //localIp

// peer.js
import Peer from 'peerjs';

var hostname = os.hostname();

// No API key required when not using cloud server
var peer = new Peer('computer', {secure: true, host: hostname, port: 7563, path: '/api'});

screenshare.request(function(err, constraints) {
  if (err) {
    return console.error('Could not capture window: ', err);
  }

  //constraints.video = { width: 400, height: 200};
  constraints.video.mandatory.minFrameRate = 1; // 1
  constraints.video.mandatory.maxFrameRate = 24; // 5
  constraints.video.mandatory.maxWidth = 667; // 1334 / 667 /640 / 320
  constraints.video.mandatory.maxHeight = 375; // 750 / 375 /360 / 240
  //constraints.video.mandatory.quality = 5; // 1-9
  constraints.audio = false;
  console.log('attempting capture with constraints: ', constraints);
  navigator.getUserMedia(constraints, function(stream) {
    var call = peer.call('phone', stream);
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });
});

