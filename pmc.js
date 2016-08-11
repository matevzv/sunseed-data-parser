var port = require("serialport");
var parser = require('./sunseed-parser');

var serialPort = new SerialPort("/dev/ttyMFD1", {
	baudRate: 115200
});

serialPort.on('data', function(data) {
	formater.pmc(data, function(err, parsed_data){
		if (err) {
			console.log(err);
		}
		else {
			console.log(parsed_data);
	  }
	});
});
