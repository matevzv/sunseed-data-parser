#!/usr/bin/env nodejs

var fs = require('fs');
var Port = require('serialport');
var sunseed_parser = require('sunseed-parser');

spm_file_name = "/tmp/spm-data";

var port = new Port('/dev/ttyMFD1', {
  baudRate: 115200,
  parity: 'odd'
});

port.on('data', function (data) {
  sunseed_parser.spm_long(data, function (err, parsed_data) {
    if (err) {
      console.log(err);
    }
    else {
      fs.writeFileSync(spm_file_name, parsed_data + "\n");
      console.log("SPM file created.");
      process.exit();
    }
  });
});
