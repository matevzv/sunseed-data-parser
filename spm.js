#!/usr/bin/env nodejs

var fs = require('fs');
var mqtt = require('mqtt');
var SerialPort = require('serialport');
var sunseed_parser = require('sunseed-parser');

// commandline args
var process_cli = function (callback) {
  var limit = false;

  process.argv.forEach(function (val, index) {
    if (val == "-h" || val == "--help") {
      console.log("Usage: spm [OPTIONS]\n");
      console.log("The Sunseed data parser.\n");
      console.log("Options:\n");
      console.log("-h, --help          Print usage");
      console.log("-l, --limit         Limit measurement period to 1 second");
      process.exit();
    }
    else if (val == "-l" || val == "--limit") {
      console.log("Measurement period limited to 1 second.");
      limit = true;
    }
    else if (index > 1) {
      console.log("spm: '" + val + "' is not a spm command. See 'spm --help'.");
      process.exit(1);
    }
  });

  callback(limit);
}

process_cli(function (limit) {
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
            if (limit) {
              if (parsed_data.indexOf('"report_n":49') !== -1) {
                client.publish(topic, parsed_data);
              }
            }
            else {
              client.publish(topic, parsed_data);
            }
          }
        });
      });
    })
  });
});
