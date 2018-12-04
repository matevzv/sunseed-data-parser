var fs = require('fs');
var mqtt = require('mqtt');
var SerialPort = require('serialport');
var sunseed_parser = require('sunseed-parser');

var machine_id = fs.readFileSync('/etc/machine-id', 'utf8').trim();
var topic = "pmc/" + machine_id;

var url = 'mqtt://localhost'
var client  = mqtt.connect(url);
client.on('connect', function () {
    console.log("Connected to " + url)
});

var port = new SerialPort('/dev/ttyMFD1', {
    baudRate: 115200,
    parity: 'odd'
});

var parser = port.pipe(new SerialPort.parsers.Readline());

parser.on('data', function (serial_data) {
    sunseed_parser.pmc_simple(serial_data, machine_id, function (err, parsed_data) {
        if (err) {
            console.log(err + " Data: " + serial_data);
        }
        else {
            client.publish(topic, parsed_data);
        }
    });
});
