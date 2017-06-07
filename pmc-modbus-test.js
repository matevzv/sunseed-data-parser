#!/usr/bin/env nodejs

var fs = require('fs');
var pmc_modbus = require('pmc-modbus');
var sunseed_parser = require('sunseed-parser');

var toggle_file = '/var/pmc/toggle';
var toggle = fs.readFileSync(toggle_file, 'utf8').trim();

var id = fs.readFileSync("/etc/machine-id", 'utf8').trim();

pmc_modbus.get_data(1000, function(err, data_pmc) {
  pmc_modbus.get_toggle_status(function(err, status) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(status);
      sunseed_parser.pmc_simple_modbus(data_pmc, status, id, function (err, parsed_data) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("PMC data: " + parsed_data);
          var file = fs.readFileSync(toggle_file, 'utf8').trim();
          sunseed_parser.toggle(file.split(','), function (err, input, output) {
            if (err) return console.log(err.message);
            if (file == toggle) {
              fs.writeFileSync(toggle_file, input);
              file = input;
            } else {
              out = output.trim();
              out = out.split(",");
              out.shift();
              console.log(out.map(Number));
              pmc_modbus.toggle(out.map(Number), function (err, outout) {
                if (err) {
                  console.log(err);
                }
                else {
                  console.log(outout);
                }
              });
            }
            toggle = file;
          });
        }
      });
    }
  });
});
