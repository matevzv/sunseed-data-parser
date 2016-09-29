var Port = require('serialport');
var parser = require('./sunseed-parser');

var port = new Port('/dev/ttyMFD1', {
  baudRate: 115200,
  parity: 'odd'
});

port.on('data', function (data) {
  parser.spm(data, function (err, parsed_data) {
    if (err) {
      console.log(err);
    }
    else {
      setTimeout(function() { process.exit(); }, 1000);
    }
  });
});
