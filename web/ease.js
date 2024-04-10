// https://easings.net/#
// t = 0 - Hoạt ảnh vừa mới bắt đầu. Không có thời gian đã trôi qua
// b = 200 - Vị trí bắt đầu của vật có tọa độ x là 200
// c = 300 - Vật phải di chuyển 300 về bên phải, kết thúc ở 500
// d = 1 - Vật có 1 giây để thực hiện chuyển động này từ 200 đến 500

// khi
// t chạy từ 0 đến d
// thì
// x chạy từ b đến b+c

function easeInOutQuad(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function easeLinear(x) {
  return x;
}
