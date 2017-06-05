var pmc_modbus = function (interval, callback) {
  var ModbusRTU = require("modbus-serial");
  var client = new ModbusRTU();

  client.connectRTUBuffered("/dev/ttyMFD1", { baudrate: 9600,
                                              parity: 'odd'
                                            });
  client.setID(10);

  setInterval(function() {
    client.readInputRegisters(30000, 50, function(err, data) {
      pmc = []
      data.data.forEach(function(value, i){
        if (i < 3 || i == 7) {
          pmc.push(value / 100);
        } else if (i > 2 && i < 7) {
          pmc.push(value / 1000);
        } else {
          pmc.push(value / 10);
          }
      });
      callback(pmc);
    });
  }, interval);
}

exports.pmc_modbus = pmc_modbus;
