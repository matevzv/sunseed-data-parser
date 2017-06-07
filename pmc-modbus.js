var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();

client.connectRTUBuffered("/dev/ttyMFD1", { baudrate: 9600,
                                            parity: 'odd'
                                          });
client.setID(10);

var get_data = function (interval, callback) {
  setInterval(function() {
    client.readInputRegisters(30000, 50, function(err, data) {
      pmc = []
      if (data) {
        data.data.forEach(function(value, i) {
          if (i < 3 || i == 7) {
            pmc.push(value / 100);
          } else if (i > 2 && i < 7) {
            pmc.push(value / 1000);
          } else {
            pmc.push(value / 10);
          }
        });
        return callback(err, pmc);
      }
    });
  }, interval);
}

var get_toggle_status = function (callback) {
  client.readDiscreteInputs(10000, 3).then(function(data) {
    if (data) {
      toggle = [];
      toggle.push(+data.data[0]);
      toggle.push(+data.data[1]);
      toggle.push(+data.data[2]);
      return callback(null, toggle);
    } else {
      return callback(new Error('No status!'));
    }
  });
}

var toggle = function (toggle, callback) {
  client.writeCoils(0, toggle).then(function() {
    client.readCoils(0, 3, function(err, data) {
      if (data) {
        toggle = [];
        toggle.push(+data.data[0]);
        toggle.push(+data.data[1]);
        toggle.push(+data.data[2]);
        return callback(null, toggle);
      } else {
        return callback(new Error('No toggle!'));
      }
    });
  });
}

exports.toggle = toggle;
exports.get_data = get_data;
exports.get_toggle_status = get_toggle_status;
