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

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("/World");
  message = new Paho.MQTT.Message("Hello");
  message.destinationName = "/World";
  client.send(message);
}
