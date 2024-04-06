import { vt, log } from "./1dc.js";
// 2,5 – 3,5 vòng

let anVoLang = false;
let gocAn;
let angle = 0;
let angleLuu = 0;
let voLang = document.getElementById("vo-lang");

function LayTam() {
  let tam = voLang.getBoundingClientRect();
  return {
    x: tam.left + tam.width / 2,
    y: tam.top + tam.height / 2,

    w: tam.width / 2,
    h: tam.height / 2,
  };
}
function layGoc(e) {
  return (
    Math.atan2(vt(e).x - LayTam().x, -(vt(e).y - LayTam().y)) * (180 / Math.PI)
  );
}

function startVoLang(e) {
  anVoLang = true;
  gocAn = layGoc(e);
}

function upVolang() {
  anVoLang = false;
  angleLuu = angle;
}

function setVolang(g) {
  voLang.style.transform = `rotate(${g}deg)`;
  document.getElementById("td").innerText = g.toFixed(2);

  let gg = Math.round(g);
  voLang.setAttribute("v", gg);
}

let angle_cu = 0;
let goc = 0;
function moveVolang(e) {
  if (anVoLang) {
    angle = layGoc(e) - gocAn + angleLuu;

    let h = angle - angle_cu;

    angle_cu = angle;
    if (h > 300) {
      h = h - 360;
    }
    if (h < 0 && h < -300) {
      h = 360 + h;
    }
    goc = goc + h;

    if (goc >= 540) {
      goc = 540;
    }
    if (goc < -540) {
      goc = -540;
    }

    setVolang(goc);
  }
}

//mouse
voLang.addEventListener("mousedown", (e) => {
  startVoLang(e);
});
voLang.addEventListener("mouseup", () => {
  upVolang();
});
voLang.addEventListener("mouseleave", (e) => {
  upVolang();
});
voLang.addEventListener("mousemove", (e) => {
  moveVolang(e);
});

// touch
voLang.addEventListener("touchstart", (e) => {
  startVoLang(e);
});
voLang.addEventListener("touchend", () => {
  upVolang();
});
voLang.addEventListener("touchend", (e) => {
  upVolang();
});
voLang.addEventListener("touchmove", (e) => {
  moveVolang(e);
});

function traLai() {
  if (anVoLang == false && goc != 0) {
    if (goc > 0) {
      goc = goc - 1;
    }
    if (goc < 0) {
      goc = goc + 1;
    }
    if ((goc < 1 && goc > 0) || (goc > -1 && goc < 0)) {
      goc = 0;
    }
    setVolang(goc);
  }
}

setInterval(traLai, 10);

// ease js algorithm
// ease- Chỉ định một hoạt ảnh có khởi đầu chậm, sau đó nhanh, rồi kết thúc chậm (đây là mặc định)
// linear- Chỉ định hoạt ảnh có cùng tốc độ từ đầu đến cuối
// ease-in- Chỉ định một hình ảnh động có khởi đầu chậm
// ease-out- Chỉ định một hình ảnh động có kết thúc chậm
// ease-in-out- Chỉ định một hoạt ảnh có phần bắt đầu và kết thúc chậm
// cubic-bezier(n,n,n,n)- Cho phép bạn xác định các giá trị của riêng mình trong hàm khối bezier

// https://spicyyoghurt.com/tools/easing-functions

function easeInOutCubic(t, b, c, d) {
  if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
  return (c / 2) * ((t -= 2) * t * t + 2) + b;
}

// t = 0 - Hoạt ảnh vừa mới bắt đầu. Không có thời gian đã trôi qua
// b = 200 - Vị trí bắt đầu của vật có tọa độ x là 200
// c = 300 - Vật phải di chuyển 300 về bên phải, kết thúc ở 500
// d = 1 - Vật có 1 giây để thực hiện chuyển động này từ 200 đến 500
// x = easeLinear(t, b, c, d);
// x = easeLinear(0, 200, 300, 1);
