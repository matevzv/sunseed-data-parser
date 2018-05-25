var fs = require('fs');

var data_file = 'spmonesweep';
var sweep = fs.readFileSync(data_file, 'utf8');

var emulator = function () {
  
  lines = sweep.split(/\r?\n/)
  lines.forEach(function(line) {
    console.log("LINE: " + line);
  })
  console.log("------------------------------------");
}

setInterval(emulator, 1000);
