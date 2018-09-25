var fs = require('fs');
var mqtt = require('mqtt');
var SerialPort = require('serialport');
var sunseed_parser = require('sunseed-parser');

var toggle_file = '/var/pmc/toggle';
var toggle = fs.readFileSync(toggle_file, 'utf8').trim();

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

var parsers = SerialPort.parsers;
var parser = new parsers.Readline();
port.pipe(parser);

parser.on('data', function (serial_data) {
    sunseed_parser.pmc_simple(serial_data, machine_id,  function (err, parsed_data) {
        if (err) {
            console.log(err + " Data: " + serial_data);
        }
        else {
            client.publish(topic, parsed_data);
            var file = fs.readFileSync(toggle_file, 'utf8').trim();
            sunseed_parser.toggle(file.split(','), function (err,input,output) {
                if (err) return console.log(err.message);
                if (file == toggle) {
                fs.writeFileSync(toggle_file, input);
                file = input;
                } else {
                port.write(output);
                }
                toggle = file;
            });
        }
    });
});
