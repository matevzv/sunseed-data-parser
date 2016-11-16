#!/usr/bin/env nodejs

var Port = require('serialport');
var parser = require('sunseed-parser');

var port = new Port('/dev/ttyMFD1', {
  baudRate: 115200,
  parity: 'odd'
});

port.on('data', function (data) {
  parser.pmc(data, function (err, parsed_data) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(parsed_data);
    }
  });
});
