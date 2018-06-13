const fs = require('fs');
const Influx = require('influx');
const SerialPort = require('serialport');
const Readline = require('parser-readline');
const sunseed_parser = require('sunseed-parser');

var toggle_file = '/var/pmc/toggle';
var toggle = fs.readFileSync(toggle_file, 'utf8').trim();

var machine_id = fs.readFileSync('/etc/machine-id', 'utf8').trim();

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'pmc',
  username: 'pmc',
  password: 'pmc'
});

const port = new SerialPort('/dev/ttyMFD1', {
  baudRate: 115200,
  parity: 'odd'
});

const parser = port.pipe(new Readline());

parser.on('data', function (serial_data) {
  sunseed_parser.pmc_simple(serial_data, function (err, parsed_data) {
    if (err) {
      console.log(err + " Data: " + serial_data);
    }
    else {
      influx.writePoints([
      {
        measurement: 'pmc_data',
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
