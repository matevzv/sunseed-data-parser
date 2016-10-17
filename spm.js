#!/usr/bin/env nodejs

var fs = require('fs');
var mqtt = require('mqtt')
var SerialPort = require('serialport');
var sunseed_parser = require('sunseed-parser');

fs.readFile('/etc/machine-id', function (err, file_data) {
  if (err) {
    return console.log(err);
  }
  var machine_id = file_data.toString().slice(0, -1);
  var topic = "spm/" + machine_id;

  var client  = mqtt.connect('mqtt://10.122.248.42');
  client.on('connect', function () {
    var port = new SerialPort('/dev/ttyMFD1', {
      baudRate: 115200,
      parity: 'odd',
      parser: SerialPort.parsers.readline()
    });

    port.on('data', function (serial_data) {
      sunseed_parser.spm(serial_data, machine_id, function (err, parsed_data) {
        if (err) {
          console.log(err + " Data: " + serial_data);
        }
        else {
          client.publish(topic, parsed_data);
        }
      });
    });
  })
});
