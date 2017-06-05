// create an empty modbus client
var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();

// open connection to a serial port
client.connectRTUBuffered("/dev/ttyMFD1", { baudrate: 9600,
                                            parity: 'odd'
                                          });
client.setID(10);

// read the values of 10 registers starting at address 0
// on device number 1. and log the values to the console.
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
    console.log(pmc.toString());
  });
}, 1000);
