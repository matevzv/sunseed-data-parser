var fs = require('fs');
var SerialPort = require('serialport');
var sunseed_parser = require('sunseed-parser');

var publish = function (client, topic) {
  var machine_id = fs.readFileSync('/etc/machine-id', 'utf8').trim();

  var serial_settings = {
    baudRate: 115200,
    parity: 'odd'
  };

  if (topic.indexOf("spm") > -1 && topic.indexOf(machine_id) > -1) {
    serial_settings.parser = SerialPort.parsers.readline();
    wams = sunseed_parser.spm;
  }
  else if (topic.indexOf("pmc") > -1 && topic.indexOf(machine_id) > -1) {
    wams = sunseed_parser.pmc_simple;
  } else {
    console.log("Wrong mqtt topic: " + topic);
    process.exit(1);
  }

  var port = new SerialPort('/dev/ttyMFD1', serial_settings);

  port.on('data', function (serial_data) {
    wams(serial_data, machine_id, function (err, parsed_data) {
      if (err) {
        console.log(err + " Data: " + serial_data);
      }
      else {
        client.publish(topic, parsed_data);
      }
    });
  });
}

exports.publish = publish;
