var fs = require('fs');
var SerialPort = require('serialport');
var sunseed_parser = require('sunseed-parser');

var publish = function (client, topic) {
  var machine_id = fs.readFileSync('/etc/machine-id', 'utf8').trim();

  var serial_settings = {
    baudRate: 115200,
    parity: 'odd'
  };

  if (topic == "spm") {
    serial_settings.parser = SerialPort.parsers.readline();
    wams = sunseed_parser.spm;
  }
  else if (topic == "pmc") {
    wams = sunseed_parser.pmc_simple;
  }

  var port = new SerialPort('/dev/ttyMFD1', serial_settings);

  port.on('data', function (serial_data) {
    wams(serial_data, machine_id, function (err, parsed_data) {
      if (err) {
        console.log(err + " Data: " + serial_data);
      }
      else {
        client.publish(topic + "/" + machine_id, parsed_data);
      }
    });
  });
}

exports.publish = publish;
