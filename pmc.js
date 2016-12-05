#!/usr/bin/env nodejs

var fs = require('fs');
var mqtt = require('mqtt');
var SerialPort = require('serialport');
var sunseed_parser = require('sunseed-parser');

var toggle_file = '/var/pmc/toggle';
var toggle = fs.readFileSync(toggle_file, 'utf8');

fs.readFile('/etc/machine-id', function (err, file_data) {
  if (err) {
    return console.log(err);
  }
  var machine_id = file_data.toString().slice(0, -1);
  var topic = "pmc/" + machine_id;

  var client  = mqtt.connect('mqtt://10.122.248.42');
  client.on('connect', function () {
    var port = new SerialPort('/dev/ttyMFD1', {
      baudRate: 115200,
      parity: 'odd'
    });

    port.on('data', function (serial_data) {
      sunseed_parser.pmc_simple(serial_data, machine_id, function (err, parsed_data) {
        if (err) {
          console.log(err + " Data: " + serial_data);
        }
        else {
          client.publish(topic, parsed_data);
          var file = fs.readFileSync(toggle_file, 'utf8');
          sunseed_parser.toggle(file.split(','), function (err, input, output) {
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
  });
});
