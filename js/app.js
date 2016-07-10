var system;
(function(){
    var app = angular.module('iotApp', []);
    app.controller('SystemController', function () {

      var MQTTclient = new Paho.MQTT.Client(config.mqtt_server, config.mqtt_websockets_port, "test");
      this.connectionSystem = false;

      /*this.test = function(){
        console.log("click");
        this.connectionSystem = true;
        this.MQTT_connect();
      };*/

      this.MQTT_connect = function(){
          MQTTclient.connect({
            useSSL: true,
            userName: config.mqtt_user,
            password: config.mqtt_password,
            onSuccess:this.onConnect,
            onFailure: function(e) {
              console.log("MQTT Connection Fail");
              console.log(e);
            }
          });

          MQTTclient.onMessageArrived = function(message) {
            data = JSON.parse(message.payloadString);
            console.log(message.payloadString);
          }
          // called when the client loses its connection
          MQTTclient.onConnectionLost = function(responseObject){
            if (responseObject.errorCode !== 0) {
              console.log("onConnectionLost:"+responseObject.errorMessage);
              lostConnection(responseObject.errorMessage);
            }
          }
      };

      this.onConnect = function() {
        console.log("onConnect");
        MQTTclient.subscribe(config.mqtt_topic);
        this.connectionSystem = true;
      }
      this.lostConnection = function(){
        this.connectionSystem = false;
      }


    });

})(window.angular);
