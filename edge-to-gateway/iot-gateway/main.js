var SerialPort = require('serialport');
var xbee_api = require('xbee-api');


var C = xbee_api.constants;
// Set API mode
var xbeeAPI = new xbee_api.XBeeAPI({
api_mode: 1
});

var serialport = new SerialPort("/dev/ttyUSB0", {
baudrate: 9600,
parser: xbeeAPI.rawParser()
});


xbeeAPI.on("frame_object", function(frame) {
var temp_value = frame.data.toString('ascii');
console.log("Temperature: ", temp_value, "F");
});
