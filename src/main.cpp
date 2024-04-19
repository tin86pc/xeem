// https://tttapa.github.io/ESP8266/Chap14%20-%20WebSocket.html
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPUpdateServer.h> // nạp chương trình qua wifi
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

ESP8266WebServer sv(80);
ESP8266HTTPUpdateServer u;      // nạp chương trình qua wifi
WebSocketsServer webSocket(81); // create a websocket server on port 81


#include "data.h"
#include "ham.h"
#include "vl.h"
#include "sk.h"

void chay()
{
  Serial.println("test");
}

//   let caidat = {
//   tf: "0",
//   pf: "0",
//   tb: "0",
//   pb: "0",
//   ipf: "0",
//   ipb: "0",
//   ip: "0",
//   p: "0",
// };

void startWifi()
{

  String tenWifiPhat = "XEEM";
  String passWifiPhat = "12345678";

  String tenWifiBat = "Tuyen T1";
  String passWifiBat = "0978333563";

  String s = getFile("caidat.json");
  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, s);
  if (error)
  {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }
  tenWifiPhat = String(doc["tf"]);
  passWifiPhat = String(doc["pf"]);
  tenWifiBat = String(doc["tb"]);
  passWifiBat = String(doc["pb"]);

  WiFi.softAPdisconnect();
  WiFi.disconnect();

  WiFi.mode(WIFI_AP_STA);

  if (passWifiPhat.length() >= 8)
  {
    WiFi.softAP(tenWifiPhat, passWifiPhat);
  }
  else
  {
    WiFi.softAP(tenWifiPhat);
  }

  WiFi.begin(tenWifiBat, passWifiBat);

  // nếu lỗi kết nối chỉ phát chế độ AP
  if (WiFi.waitForConnectResult() != WL_CONNECTED)
  {
    WiFi.softAPdisconnect();
    WiFi.disconnect();
    WiFi.mode(WIFI_AP);
    delay(100);

    if (passWifiPhat.length() >= 8)
    {
      WiFi.softAP(tenWifiPhat, passWifiPhat);
    }
    else
    {
      WiFi.softAP(tenWifiPhat);
    }

    Serial.println(WiFi.softAPIP());
  }
  else
  {
    Serial.print("Ket noi wifi: ");
    Serial.println(tenWifiBat);
    Serial.print("Dia chi IP: http://");
    Serial.println(WiFi.localIP());
  }

  u.setup(&sv); // nạp chương trình qua wifi
}

void startServer()
{
  sv.on("/", []()
        { sv.send(200, "text/html", getFile("index.html")); });

  sv.on("/s", []()
        { sv.send(200, "text/html", getFile("setting.html")); });

  sv.on("/r", []()
        {
          startWifi();
          //  ESP.restart();
        });

  sv.on("/x", []()
        {
          fomatAll();
          sv.send(200,"text/html","Format ok."); });

  sv.on("/w", []()
        { 
          int numberOfNetworks = WiFi.scanNetworks();

          String nd = "{`ip`:`"+WiFi.localIP().toString()+"`,";
          nd = nd+"`wifi`:[";
          for (int i = 0; i < numberOfNetworks; i++)
          {
            nd = nd + "{`" + String(WiFi.SSID(i))+"`:`"+String(WiFi.RSSI(i))+"`},";
          }
          nd = nd.substring(0,nd.length() - 1);
          nd = nd + "]}";

          sv.send(200, "application/json", nd); });

  // Tạo form nhận file
  sv.on(
      "/u", HTTP_ANY, []()
      {   
        Serial.println("u");
          sv.send(200, "text/html", 
          "<html>"
            "<head>"
              "<meta charset='UTF-8'>"
              "<title>"
              "Cập nhật html"
              "</title>"
            "</head>"
            "<body>"
              "<br>"
              "<a href='/'>Trang chủ</a>"
              "<br>"
              "<br>"
              "<a href='/update'>Update Firmware</a>"
              "<br>"
              "<br>"
              "<button onclick='if(confirm(`format`)==true)window.location.href=`/x`'>Format</button>"
              "<br>"
              "<br>"
              "<a href='/s'>Cài đặt</a>"
              "<br>"
              "<br>"
              "<form method='POST' action='/u' enctype='multipart/form-data'>"
                "<input type='file' name='chon file' multiple>"
                "<input type='submit' value='Gửi đi'>"
              "</form>"
            "</body>"
          "</html>"
          ); },
      []()
      {
        HTTPUpload &file = sv.upload();
        if (file.status == UPLOAD_FILE_START)
        {
          Serial.println("ghi file " + file.filename);
          clearFile(file.filename);
        }
        else if (file.status == UPLOAD_FILE_WRITE)
        {
          Serial.println("dang gui");
          saveFile(file.filename, file.buf, file.currentSize);
        }
        else if (file.status == UPLOAD_FILE_END)
        {
          Serial.println("gui file song");
        }
      });

  sv.on("/test", chay);

  sv.onNotFound([]()
                {
                  String uri = sv.uri();
                  String nf = uri.substring(1);
                  String lf = getContentType(nf);
                  if (lf != "")
                  {
                    sv.send(200, lf, getFile(nf));
                  }
                  else
                  {
                    sv.send(404, "text/html", "Error 404 NOT FOUND");
                  } });

  sv.begin();
}

void led()
{
  pinMode(2, OUTPUT);
  digitalWrite(2, digitalRead(2));

  Serial.println(".");
  webSocket.broadcastTXT("."); // send data to all connected clients
}

void setup()
{
  Serial.begin(115200);
  Serial.println();

  startLittleFS();
  startWifi();

  startServer();
  startWebSocket();
  startServo();

  getJsonAPI();
}

void loop()
{
  webSocket.loop();
  sv.handleClient();

  nhay(1000, led);
}
