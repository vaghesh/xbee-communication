var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');
var groveSensor = require('jsupm_grove');


  // Create the temperature sensor object using AIO pin 0
var temp = new groveSensor.GroveTemp(0);


  // Constants for the the hex-numbers of the frame types, command options, status types
var C = xbee_api.constants;
// Set API mode
var xbeeAPI = new xbee_api.XBeeAPI({
api_mode: 1
});


var serialport = new SerialPort("/dev/ttyUSB0", {
  baudrate: 9600,
  parser: xbeeAPI.rawParser()
});



function sendTemperatureData(){
  var celsius = temp.value();
  var fahrenheit = Math.round(celsius * 9.0/5.0 + 32.0);
  console.log('Temperature - ', celsius, '°C or ', fahrenheit,'°F');
  var frame_obj = { // AT Request to be sent to
    type: C.FRAME_TYPE.TX_REQUEST_16, // 0x01: TX (Transmit) Request: 16-bit address (802.15.4)
    id: 0x01, // optional, nextFrameId() is called per default
    destination16: "0000", // MY address of the receiving ZigBee device
    options: 0x00, // optional
    data: fahrenheit.toString() // Convert Temperature value to ASCII
  };
  serialport.write(xbeeAPI.buildFrame(frame_obj)); // Write frame to Serial Port
};

serialport.on("open", function() {
  console.log('serial port opened');
  setInterval(sendTemperatureData, 3000);
});
