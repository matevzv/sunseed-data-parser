#!/usr/bin/env nodejs

var fs = require('fs');
var sunseed_parser = require('./sunseed-parser');

// commandline args
var process_cli = function (callback) {
  var limit = false;

  process.argv.forEach(function (val, index) {
    if (val == "-h" || val == "--help") {
      console.log("Usage: spm [OPTIONS] [arg...]\n");
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

// simulate PMC an SPM data
var pmc_data_length = 50;
var spm_data_length = 20;

var data_pmc = ["PMC"];
var data_spm = ["SPM"];

for (var i = 0; i < pmc_data_length; i++) {
  data_pmc.push(i);
  if (i < spm_data_length) {
    data_spm.push(i);
  }
}

// simulate toggle
data_pmc.push(1)
data_pmc.push(0)
data_pmc.push(1)

// test PMC and SPM parser functions
sunseed_parser.pmc(data_pmc, function (err, parsed_data) {
  if (err) {
    console.log(err);
  }
  else {
    console.log("PMC data: " + parsed_data);
  }
});

process_cli(function (limit) {
  fs.readFile('/etc/machine-id', function (err, file_data) {
    if (err) {
      return console.log(err);
    }
    machine_id = file_data.toString().slice(0, -1);
    sunseed_parser.spm(data_spm, machine_id, function (err, parsed_data) {
      if (err) {
        console.log(err + " Data: " + data_spm);
      }
      else {
        if (limit) {
          if (parsed_data.indexOf('"report_n":2') !== -1) {
            console.log("\nSPM data: " + parsed_data);
          }
        } else {
          console.log("\nSPM data: " + parsed_data);
        }
      }
    });
  });
});

sunseed_parser.toggle([0, 0 ,1], function (err, message) {
  if (err) return console.log(err.message);
  return console.log(message);
});
