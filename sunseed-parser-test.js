var parser = require('./sunseed-parser');

// simulate PMC an SPM data
var pmc_data_length = 50;
var spm_data_length = 20;

var data_pmc = ["PMC"];
var data_spm = ["SPM"];

for (var i = 0; i < pmc_data_length; i++) {
  data_pmc.push(i);
  if (i < spm_data_length) {
    data_spm.push(i);
  }
}

// simulate toggle
data_pmc.push(1)
data_pmc.push(0)
data_pmc.push(1)

data_pmc.push(data_pmc.pop() + "\n");
data_spm.push(data_spm.pop() + "\n");

// test PMC and SPM parser functions
parser.pmc(data_pmc, function (err, parsed_data) {
  if (err) {
    console.log(err);
  }
  else {
    console.log("PMC data: " + parsed_data);
  }
});

parser.spm_simple(data_spm, function (err, parsed_data) {
  if (err) {
    console.log(err);
  }
  else {
    console.log("\nSPM data: " + parsed_data);
  }
});

/*parser.toggle([0, 0 ,1], function (err, message) {
  if (err) return console.log(err.message);
  return console.log(message);
});*/
