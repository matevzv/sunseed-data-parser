#!/usr/bin/env node

var fs = require('fs');
var mqtt = require('mqtt')
var SerialPort = require('serialport');
var sunseed_parser = require('sunseed-parser');

var client  = mqtt.connect('mqtt://10.122.248.42')

fs.readFile('/etc/machine-id', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var machine_id = data.toString().slice(0, -1);
  var topic = "spm/" + machine_id;
  client.on('connect', function () {
    client.subscribe(topic);
    fs.appendFile("/var/log/spm-error.log",
      err+"\nData: "+data+"\n"+"----------"+"\n");

    var port = new SerialPort('/dev/ttyMFD1', {
      baudRate: 115200,
      parity: 'odd',
      parser: SerialPort.parsers.readline()
    });

    port.on('data', function (data) {
      sunseed_parser.spm(data, function (err, parsed_data) {
        if (err) {
          fs.appendFile("/var/log/spm-error.log",
            err+"\nData: "+data+"\n"+"----------"+"\n");
        }
        else {
          client.publish(topic, parsed_data);
        }
      });
    });
  })
});
