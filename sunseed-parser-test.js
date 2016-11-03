var fs = require('fs');
var sunseed_parser = require('./sunseed-parser');

// simulate PMC an SPM data
var pmc_data_length = 50;
var spm_data_length = 20;
var demo_data_length = 6;

var data_pmc = ["PMC"];
var data_spm = ["SPM"];
var data_demo = ["UW1"];

for (var i = 0; i < pmc_data_length; i++) {
  data_pmc.push(i);
  if (i < spm_data_length) {
    data_spm.push(i);
  }
  if (i < demo_data_length) {
    data_demo.push(i);
  }
}

// simulate toggle
data_pmc.push(1)
data_pmc.push(0)
data_pmc.push(1)

// test PMC and SPM parser functions
sunseed_parser.pmc(data_pmc, function (err, parsed_data) {
  if (err) {
    console.log(err);
  }
  else {
    console.log("PMC data: " + parsed_data);
  }
});

fs.readFile('/etc/machine-id', function (err, file_data) {
  if (err) {
    return console.log(err);
  }
  machine_id = file_data.toString().slice(0, -1);
  sunseed_parser.spm(data_spm, machine_id, function (err, parsed_data) {
    if (err) {
      console.log(err + " Data: " + data_spm);
    }
    else {
      console.log("\nSPM data: " + parsed_data);
    }
  });
});

sunseed_parser.demo(data_demo, 1, function (err, parsed_data) {
  console.log(data_demo);
  if (err) {
    console.log(err);
  }
  else {
    console.log("DEMO data: " + parsed_data);
  }
});

/*sunseed_parser.toggle([0, 0 ,1], function (err, message) {
  if (err) return console.log(err.message);
  return console.log(message);
});*/
