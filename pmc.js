var port = require("serialport");
var parser = require('./sunseed-parser');

var port = new SerialPort("/dev/ttyMFD1", {
	baudRate: 115200
});

port.on('data', function(data) {
	formater.pmc(data, function(err, parsed_data){
		if (err) {
			console.log(err);
		}
		else {
			console.log(parsed_data);
	  }
	});
});
