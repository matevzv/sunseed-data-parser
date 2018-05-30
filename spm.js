#!/usr/bin/env nodejs

var fs = require('fs');
var mqtt = require('mqtt');
var sunseed_parser = require('./sunseed-parser');

var data_file = 'datasets/realspmdatatest';
var sweep = fs.readFileSync(data_file, 'utf8');
var lines = sweep.split(/\r?\n/);
lines.pop();
var gps_time = Math.floor(Date.now() / 1000) - 315964800
var week_id = Math.floor(gps_time / 604800);
var sec_id = Math.floor(gps_time % 604800);

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

serial_emulator = function (callback) {
  var chunk = 50
  var chunks = (lines.length) / chunk;
  var start = Math.floor(Math.random() * chunks);
  console.log("Random chunk: " + start);
  var i = start;
  
  setInterval(function () {
    if (i >= start && i < chunks) {
      for (var j = i*chunk; j < i*chunk+chunk; j++) {
        callback(lines[j]);
      }
      i++;
    } else {
      if (i == chunks) i = 0;
      for (var j = i*chunk; j < i*chunk+chunk; j++) {
        callback(lines[j]);
      }
      i++;
    }
  }, 1000);
}

process_cli(function (machine_id) {
  var topic = "spm/" + machine_id;

  var client  = mqtt.connect('mqtt://127.0.0.1');
  client.on('connect', function () {
    serial_emulator(function (line) {
      sunseed_parser.spm(line, machine_id, week_id, sec_id, function (err, parsed_data) {
        if (err) {
          console.log(err + " Data: " + line);
        }
        else {
          client.publish(topic, parsed_data);
        }
      });
    });
  });
});
