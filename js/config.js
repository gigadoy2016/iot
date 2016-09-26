/*==========================================================
 *          MQTT Connect
 ===========================================================*/
var config = {
        mqtt_server         : "m11.cloudmqtt.com",
        mqtt_websockets_port: 35507,
        mqtt_user           : "monitor",
        mqtt_password       : "123456789",
        mqtt_topic          : "DEVICE/01/status/"
      };
var MQTTclient = new Paho.MQTT.Client(config.mqtt_server, config.mqtt_websockets_port, "test");

function MQTT_connect(){
  MQTTclient.connect({
    useSSL      : true,
    userName    : config.mqtt_user,
    password    : config.mqtt_password,
    onSuccess   : onConnect,
    onFailure: function(e) {
      lostConnection(e.errorMessage);
      console.log(e);
    }
  });

  MQTTclient.onMessageArrived = function(message) {
    data = (typeof message =='object')?JSON.parse(message.payloadString):message.payloadString;
    console.log(data);
  }
  
  MQTTclient.onConnectionLost = function(responseObject){           // called when the client loses its connection
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
      lostConnection(responseObject.errorMessage);
    }
  }
}

function onConnect() {                      // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  MQTTclient.subscribe(config.mqtt_topic);
  $("#system_connection").text("System ON").removeClass().addClass("btn btn-success");
}

function lostConnection(errorMessage){
  $("#system_connection").text("System LOST").removeClass().addClass("btn btn-warning");
  $("#device_connection").text("device LOST").removeClass().addClass("btn btn-warning");
  let text = "<div>Error:"+errorMessage+"</div><div><button>Reload</button></div>";
  $("#system_info").text(errorMessage);
}

function displaySubscription(data){
    console.log(data);
}

function mqttSend(ID,topic, msg) {
    var message = new Paho.MQTT.Message(`{"ID":"${ID}","status":${msg}}`);
    message.destinationName = topic;
    MQTTclient.send(message); 
}



/*========================================================
*   Config Chart for Display
* ========================================================*/
var temperatureData = {
    type: 'line',
    data: {
        labels: ["10.48", "10.50", "10.52", "10.54", "10.56", "10.58", "11.00"],
        datasets: [{
            label: "DHT22 (°C)",
            data: [25, 26.2, 25.3, 25.3, 25.2, 25.1, 25.3],
            borderColor : 'rgba(241, 196, 15, 1)',
            backgroundColor : 'rgba(241, 196, 15, 0.5)'
        }, {
            label: 'Mainborad (°C)',
            data: [26, 26, 26, 26.5, 26.8, 27, 26.5],
            borderColor : 'rgba(20, 90, 50, 1)',
            backgroundColor : 'rgba(20, 90, 50, 0.5)'
        }]
    },
    options: {
        responsive: true,
        tooltips: {
            mode: 'label',
        },
        hover: {
            mode: 'dataset'
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    show: true,
                    labelString: 'Month'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    show: true,
                    labelString: 'Value'
                },
                ticks: {
                    suggestedMin: 22,
                    suggestedMax: 28,
                }
            }]
        }
    }
};

const sensors = [
    { id:0, type:"thermometer"  , name:"temperature-(DHT22)"    , max:100   , min:0 },
    { id:1, type:"humidity"     , name:"humidity-(DHT22)"       , max:100   , min:0 },
    { id:2, type:"lighting"     , name:"Lighting-(LDR)"         , max:5     , min:0 },
    { id:3, type:"humidity"     , name:"humidity-(Ground)"      , max:100   , min:0 },
    { id:4, type:"thermometer"  , name:"temperature-(System)"   , max:100   , min:0 }
]

var humidityData = {
    type: 'line',
    data: {
        labels: ["10.48", "10.50", "10.52", "10.54", "10.56", "10.58", "11.00"],
        datasets: [{
            label: "DHT22 (hum %)",
            data: [50, 40, 45, 43, 43, 40, 39],
            borderColor : 'rgba(26, 82, 118, 1)',
            backgroundColor : 'rgba(26, 82, 118, 0.5)'
        }, {
            label: 'Ground (hum %)',
            data: [50, 50, 52, 51, 51, 51, 51],
            borderColor : 'rgba(40, 116, 166, 1)',
            backgroundColor : 'rgba(40, 116, 166, 0.5)'
        }]
    }
};

var lightingData = {
    type: 'line',
    data: {
        labels      : ["10.48", "10.50", "10.52", "10.54", "10.56", "10.58", "11.00"],
        datasets    : [
                        {
                            label           : "Level",
                            "fill"          : "false",
                            yAxisID         : "y-axis-0",
                            data            : [50, 40, 45, 43, 43, 40, 39],
                            borderColor     : 'rgba(241, 196, 15, 1)',
                            backgroundColor : 'rgba(241, 196, 15, 0.5)'
                        }
                      ]
        }
};

/* ==========================================================================
   |  inint script
   ==========================================================================*/
window.onload = function() {
    var ctx_1     = document.getElementById("temperature-monitor").getContext("2d");
    var ctx_2     = document.getElementById("humidity-monitor").getContext("2d");
    var ctx_3     = document.getElementById("lighting-monitor").getContext("2d");
    window.myLine = new Chart(ctx_1, temperatureData);
    window.myLine = new Chart(ctx_2, humidityData);
    window.myLine = new Chart(ctx_3, lightingData);
    

    gage_DHT22_temperature = new JustGage({
        id      : "gage_DHT22_temperature",
        value   : SENSOR.DHT22.temperature,
        decimals: true,
        min     : 20,
        max     : 50,
        title   : "อุณหภูมิ(DHT22)",
        label   : "°C"
    });

    gage_DHT22_humidity = new JustGage({
        id      : "gage_DHT22_humidity",
        value   : SENSOR.DHT22.humidity,
        decimals: true,
        min     : 20,
        max     : 70,
        title   : "humidity(DHT22)",
        label   : "%"
    });

    gage_LDT = new JustGage({
        id      : "gage_LDT",
        value   : SENSOR.LDR.value,
        decimals: true,
        min     : 0,
        max     : 4,
        title   : "Lighting LDT sensor",
        label   : "%"
    });

    gage_ground_humidity = new JustGage({
        id      : "gage_ground_humidity",
        value   : SENSOR.SoilMoisture.value,
        decimals: true,
        min     : 0,
        max     : 4,
        title   : "humidity(Ground)",
        label   : "%"
    });

    $('.limitSensor').keydown(function(e){
        ans = -1!==$.inArray(e.keyCode,[46,8,9,27,13,110,190])||/65|67|86|88/.test(e.keyCode)&&(!0===e.ctrlKey||!0===e.metaKey)||35<=e.keyCode&&40>=e.keyCode||(e.shiftKey||48>e.keyCode||57<e.keyCode)&&(96>e.keyCode||105<e.keyCode)&&e.preventDefault()
        //console.log(ans);
    });

    /* ============================================
    |  Script for screen.
    ==============================================*/
    //show_Openning_Dialog();
    startTime(); 
    MQTT_connect();
    let STATUS = DATA.embedded_01.output.relay;
    //relay[0].setStatus(1);
    //relay[1].setStatus(1);
    //relay[2].setStatus(1);
    //relay[3].setStatus(1);
};

function show_Openning_Dialog(){
    $.blockUI({ 
        message: $('#content-hidden-01'),
        css: {
            border                  : 'none', 
            padding                 : '15px', 
            backgroundColor         : '#000', 
            '-webkit-border-radius' : '10px', 
            '-moz-border-radius'    : '10px', 
            opacity: .9, 
            color: '#fff'
        }
    });
    //setTimeout($.unblockUI, 1000);
    MQTT_connect();
}

function startTime() {
    var today1  = new Date();
    var h       = today1.getHours();
    var m       = today1.getMinutes();
    var s       = today1.getSeconds();
    m           = checkTime(m);
    s           = checkTime(s);
    document.getElementById('time_system').innerHTML =h + ":" + m + ":" + s;
    today       = today1;
    var t       = setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

function dataFeed(data){
    lightingData.data.datasets[0].data = [50, 50, 50, 50, 50, 50, 50];
    window.myLine.update();
    console.log("dataFeed");
}
