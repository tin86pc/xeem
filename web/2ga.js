import { log, vt } from "./1dc.js";

let chanGa = document.getElementById("chan-ga");
let chanGa2 = document.getElementById("chan-ga2");

function layVTbam(e) {
  let cg = chanGa.getBoundingClientRect();

  let vtb = 100 - parseInt(((vt(e).y - cg.top) / cg.height) * 100);

  if (vtb >= 100) {
    vtb = 100;
  }
  if (vtb < 0) {
    vtb = 0;
  }
  return vtb;
}

function setChanGa(p) {
  chanGa2.setAttribute("v", p);
  chanGa2.style.height = p + "%";
}

let anChanGa = false;

let di = 0;
function thayDoiChanGa() {
  if (di < dat) {
    di = di + 1;
  }
  if (di > dat) {
    di = di - 1;
  }

  setChanGa(di);
}

setInterval(thayDoiChanGa, 50);
let dat = 0;

function startChanGa(e) {
  anChanGa = true;
  dat = layVTbam(e);
}

function moveChanGa(e) {
  if (anChanGa) {
    dat = layVTbam(e);
  }
}

function upChanGa() {
  anChanGa = false;
  dat = 0;
}

// mouse
chanGa.addEventListener("mousedown", (e) => {
  startChanGa(e);
});
chanGa.addEventListener("mousemove", (e) => {
  moveChanGa(e);
});
chanGa.addEventListener("mouseup", (e) => {
  upChanGa();
});
chanGa.addEventListener("mouseleave", (e) => {
  upChanGa();
});

// touch
chanGa.addEventListener("touchstart", (e) => {
  startChanGa(e);
});
chanGa.addEventListener("touchmove", (e) => {
  moveChanGa(e);
});
chanGa.addEventListener("touchcancel", (e) => {
  upChanGa();
});
chanGa.addEventListener("touchend", (e) => {
  upChanGa();
});

function phanh() {
  dat = 0;
  di = 0;
  setChanGa(0);
}

const chanPhanh = document.getElementById("chan-phanh");
chanPhanh.addEventListener("touchstart", function () {
  phanh();
});

chanPhanh.addEventListener("mousedown", function () {
  phanh();
});
