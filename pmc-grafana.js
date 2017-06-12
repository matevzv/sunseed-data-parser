var fs = require('fs');
const Influx = require('influx');
var SerialPort = require('serialport');
var sunseed_parser = require('sunseed-parser');

var toggle_file = '/var/pmc/toggle';
var toggle = fs.readFileSync(toggle_file, 'utf8').trim();

var machine_id = fs.readFileSync('/etc/machine-id', 'utf8').trim();

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'telegraf',
  username: 'telegraf',
  password: 'telegraf'
});

var port = new SerialPort('/dev/ttyMFD1', {
  baudRate: 115200,
  parity: 'odd'
});

port.on('data', function (serial_data) {
  sunseed_parser.pmc_simple(serial_data, function (err, parsed_data) {
    if (err) {
      console.log(err + " Data: " + serial_data);
    }
    else {
      influx.writePoints([
      {
        measurement: 'pmc',
        tags: { host: machine_id },
        fields: parsed_data,
        timestamp: new Date()
      }]);
      var file = fs.readFileSync(toggle_file, 'utf8').trim();
      sunseed_parser.toggle(file.split(','), function (err, input, output) {
        if (err) return console.log(err.message);
        if (file == toggle) {
          fs.writeFileSync(toggle_file, input);
          file = input;
        } else {
          port.write(output);
        }
        toggle = file;
      });
    }
  });
});