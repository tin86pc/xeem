import { log } from "./1dc.js";
import { send } from "./5sk.js";

function khoiToaNutAn() {
  const aid = [
    "nut-P",
    "nut-R",
    "nut-N",
    "nut-D",
    "nut-coi",
    "nut-den-xa",
    "nut-den-gan",
    "nut-nguy-hiem",
    "nut-trai",
    "nut-phai",
  ];

  for (let i = 0; i < aid.length; i++) {
    document.getElementById(aid[i]).addEventListener("mousedown", (e) => {
      e["nd"] = "l" + i;
      anNut(e);
    });
    document.getElementById(aid[i]).addEventListener("touchstart", (e) => {
      e["nd"] = "l" + i;
      anNut(e);
    });
  }
}

function anNut(e) {
  e.preventDefault();
  log("send> " + e.nd);
  send(e.nd);
}

function isFullScreen() {
  return (
    (document.fullScreenElement && document.fullScreenElement !== null) ||
    document.mozFullScreen ||
    document.webkitIsFullScreen
  );
}

function requestFullScreen(element) {
  if (element.requestFullscreen) element.requestFullscreen();
  else if (element.msRequestFullscreen) element.msRequestFullscreen();
  else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
  else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
}

function exitFullScreen() {
  if (document.exitFullscreen) document.exitFullscreen();
  else if (document.msExitFullscreen) document.msExitFullscreen();
  else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
}

function toggleFullScreen(element) {
  if (isFullScreen()) exitFullScreen();
  else requestFullScreen(element || document.documentElement);
}

let khoa = false;
document.getElementById("tmh").addEventListener("click", () => {
  if (khoa == true) {
    khoa = false;
    exitFullScreen();
    // (B1) UNLOCK FIRST
    screen.orientation.unlock();

    

    // // (B2) THEN EXIT FULL SCREEN
    // if (document.fullscreenElement) {
    //   document.exitFullscreen();
    // } else if (document.webkitExitFullscreen) {
    //   document.webkitExitFullscreen();
    // } else if (document.mozCancelFullScreen) {
    //   document.mozCancelFullScreen();
    // } else if (document.msExitFullscreen) {
    //   document.msExitFullscreen();
    // }
  } else {
    khoa = true;
    requestFullScreen(element || document.documentElement);
    // (A1) GO INTO FULL SCREEN FIRST

    // let de = document.documentElement;
    // if (de.requestFullscreen) {
    //   de.requestFullscreen();
    // } else if (de.mozRequestFullScreen) {
    //   de.mozRequestFullScreen();
    // } else if (de.webkitRequestFullscreen) {
    //   de.webkitRequestFullscreen();
    // } else if (de.msRequestFullscreen) {
    //   de.msRequestFullscreen();
    // }

    // (A2) THEN LOCK ORIENTATION
    if (screen.orientation.type != "landscape-primary") {
      screen.orientation.lock("landscape");
    }
    
  }
});

export { khoiToaNutAn };
