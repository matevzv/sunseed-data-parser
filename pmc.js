#!/usr/bin/env nodejs

var fs = require('fs');
var Port = require('serialport');
var sunseed_parser = require('sunseed-parser');

var toggle_file = '/var/pmc/toggle';
var toggle = fs.readFileSync(toggle_file, 'utf8');

var port = new Port('/dev/ttyMFD1', {
  baudRate: 115200,
  parity: 'odd'
});

port.on('data', function (data) {
  sunseed_parser.pmc(data, function (err, parsed_data) {
    if (err) {
      console.log(err);
    }
    else {
      file = fs.readFileSync(toggle_file, 'utf8').split(',');
      sunseed_parser.toggle(file, function (err, input, output) {
        if (err) return console.log(err.message);
        if (toggle != input) {
          fs.writeFileSync(toggle_file, input);
        } else {
          port.write(output);
        }
        toggle = input;
      });
    }
  });
});
