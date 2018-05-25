#!/usr/bin/env nodejs

var fs = require('fs');
var mqtt = require('mqtt');
var sunseed_parser = require('./sunseed-parser');

// commandline args
var process_cli = function (callback) {
  var machine_id = "";

  if (process.argv.length < 3 || process.argv.length > 5) {
    console.log("Not spm command. See 'spm --help'.");
    process.exit(1);
  }

  process.argv.forEach(function (val, index) {
    if (val == "-h" || val == "--help") {
      console.log("Usage: spm [OPTIONS]\n");
      console.log("The Sunseed data parser.\n");
      console.log("Options:\n");
      console.log("-h, --help          Print usage");
      console.log("-i, --id            Machine ID");
      process.exit();
    }
    else if (val == "-i" || val == "--id") {
      if (process.argv.length != 4) {
        console.log("Not spm command. See 'spm --help'.");
      } else {
        machine_id = process.argv[3];
        console.log("Machine ID: " + machine_id);
      }
    }
  });

  callback(machine_id);
}

process_cli(function (machine_id) {
  var data_file = 'spmonesweep';
  var sweep = fs.readFileSync(data_file, 'utf8');
  var lines = sweep.split(/\r?\n/);
  lines.pop();
  var topic = "spm/" + machine_id;

  var client  = mqtt.connect('mqtt://127.0.0.1');
  client.on('connect', function () {
    setInterval(function () {
      for (let i = 0; i < lines.length; i++) {
        sunseed_parser.spm(lines[i], machine_id, function (err, parsed_data) {
          if (err) {
            console.log(err + " Data: " + lines[i]);
          }
          else {
            setTimeout(function () {
              client.publish(topic, parsed_data);
              //console.log(parsed_data);
            }, 20*i);
          }
        });
      }
    }, 1000);
  });
});
