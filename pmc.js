#!/usr/bin/env nodejs

var fs = require('fs');
var Port = require('serialport');
var sunseed_parser = require('sunseed-parser');

var toggle_file = '/var/pmc/toggle';
var toggle = fs.readFileSync(toggle_file, 'utf8');
var file = toggle;

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
      var content = fs.readFileSync(toggle_file, 'utf8');
      sunseed_parser.toggle(content.split(','), function (err, input, output) {
        if (err) return console.log(err.message);
        if (file == content && toggle != input) {
          fs.writeFileSync(toggle_file, input);
          content = input;
        } else {
          port.write(output);
        }
        toggle = input;
        file = content;
      });
    }
  });
});
