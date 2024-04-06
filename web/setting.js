"use strict";
import { tinh } from "./1dc.js";
import { send, skSocket } from "./5sk.js";

tinh();

fetch("/caidat.txt")
  .then((response) => response.text())
  .then((text) => {
    console.log(text);
    const ar = text.split("|");

    set(a[0], ar[0]);
    set(a[1], ar[1]);
    set(a[2], ar[2]);
    set(a[3], ar[3]);

    document.getElementById("ipb").text += ar[4];
  });

const a = ["tf", "pf", "tb", "pb", "ipf", "ipb"];

function get(id) {
  return document.getElementById(id).value;
}

function set(id, v) {
  document.getElementById(id).value = v;
}

document.getElementById("ok").addEventListener("click", (e) => {
  const nd =
    get("tf") + "|" + get("pf") + "|" + get("tb") + "|" + get("pb") + "|";
  console.log(nd);

  const blob = new Blob([nd], { type: "text/plain" });
  let formData = new FormData();
  formData.append("file", blob, "caidat.txt");

  fetch("/u", {
    method: "POST",
    body: formData,
  }).then((response) => {
    if (response.status == 200) {
      alert("lưu thành công");
    }
  });
});

const chonWifi = document.getElementById("chonWifi");

window.onload = (e) => {
  fetch("/w", {
    method: "get",
    headers: {
      "Content-Type": "application/json ",
    },
  })
    .then((response) => response.text())
    .then((response) => {
      // console.log(response);

      response = response.replaceAll("`", '"');

      const obj = JSON.parse(response);
      const wifi = obj.wifi;

      set("ipb", obj.ip);

      wifi.forEach((element) => {
        let ten = Object.getOwnPropertyNames(element)[0];
        let option = document.createElement("option");
        option.value = ten;
        option.text = ten;
        chonWifi.add(option);
      });
    })
    .catch((err) => console.log(err));
};

chonWifi.addEventListener("change", (e) => {
  set("tb", event.target.value);
});
