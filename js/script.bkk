(function(){
    var app = angular.module('application', []);
    app.controller('deviceController', function ($scope,$http) {
      $http({
        method : "GET",
        url : "DATA/device.config.json"
      }).then(function mySucces(response) {
        $scope.device = data = response.data;
      }, function myError(response) {
        $scope.device = response.statusText;
      });

      

    });
})(window.angular);

function init(){
  MQTT_connect();
  gageDHT_1 = new JustGage({
    id: "gageDHT_1",
    value: 0,
    decimals: true,
    min: 20,
    max: 50,
    title: "°C",
    label: "อุณหภูมิ"
  });
  gageDHT_2 = new JustGage({
    id: "gageDHT_2",
    value: 0,
    decimals: true,
    min: 20,
    max: 50,
    title: "%",
    label: "ความชื้น"
  });

}
function MQTT_connect(){
  MQTTclient.connect({
    useSSL: true,
    userName: config.mqtt_user,
    password: config.mqtt_password,
    onSuccess: onConnect,
    onFailure: function(e) {
      console.log("MQTT Connection Fail");
      console.log(e);
    }
  });

  MQTTclient.onMessageArrived = function(message) {
    data = JSON.parse(message.payloadString);
    displayData(data);
    console.log(message.payloadString);
  }
  // called when the client loses its connection
  MQTTclient.onConnectionLost = function(responseObject){
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
      lostConnection(responseObject.errorMessage);
    }
  }
}
  // called when the client connects

function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  MQTTclient.subscribe(config.mqtt_topic);
  $("#system_connection").text("System ON").removeClass().addClass("btn btn-success");
  $("#system_detail").text("");
}

function lostConnection(errorMessage){
  $("#system_connection").text("System LOST").removeClass().addClass("btn btn-warning");
  $("#device_connection").text("device LOST").removeClass().addClass("btn btn-warning");
  $("#system_detail").text(errorMessage);
}

//
var myDevice_status;
function displayData(data){
  $("#device01_message").text("temp : "+data.temp+" H:"+data.Hum+" switch_01:"+data.led_01);
  $("#device_connection").text("device ON").removeClass().addClass("btn btn-success");
  gageDHT_1.refresh(data.temp);
  gageDHT_2.refresh(data.Hum);
  clearTimeout(myDevice_status);
  myDevice_status = setTimeout(function(){   $("#device_connection").text("device LOST").removeClass().addClass("btn btn-warning"); }, 20000);
}

function openDevice(){
  message = new Paho.MQTT.Message('{"deviceID":"0001","led_01":1}');
  message.destinationName = "DEVICE/01/command/";
  MQTTclient.send(message);
}

function closedDevice(){
  message = new Paho.MQTT.Message('{"deviceID":"0001","led_01":0}');
  message.destinationName = "DEVICE/01/command/";
  MQTTclient.send(message);
}
