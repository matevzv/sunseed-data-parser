#!/usr/bin/env nodejs

var Port = require('serialport');
var sunseed_parser = require('sunseed-parser');

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
      var toogle = fs.readFileSync('/var/pmc/toggle', 'utf8');
      parser.toggle(toogle.split(','), function (err, message) {
        if (err) return console.log(err.message);
        port.write(message);
      });
    }
  });
});
