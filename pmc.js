var Port = require("serialport");
var parser = require('./sunseed-parser');

var port = new Port("/dev/ttyMFD1", {
  baudRate: 115200
});

port.on('data', function (data) {
  parser.pmc(data, function (err, parsed_data) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(parsed_data);
      parser.toggle([0, 0 ,0], function (err, message) {
        if (err) return console.log(err.message);
        port.write(message);
      });
    }
  });
});
