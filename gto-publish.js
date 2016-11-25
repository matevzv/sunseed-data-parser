var SerialPort = require('serialport');
var sunseed_parser = require('sunseed-parser');
var machine_id = fs.readFileSync('/etc/machine-id', 'utf8');

if (topic == "spm") {
  wams = sunseed_parser.spm;
}
else if (topic == "pmc") {
  wams = sunseed_parser.pmc_simple;
}

var port = new SerialPort('/dev/ttyMFD1', {
  baudRate: 115200,
  parity: 'odd',
  parser: SerialPort.parsers.readline()
});

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
