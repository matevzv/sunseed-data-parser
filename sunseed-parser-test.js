var parser = require('./sunseed-parser');

var data_pmc = ["PMC"]
var data_spm = ["SPM"]

for (var i = 0; i < 50; i++) {
  data_pmc.push(i);
  if (i < 14) {
    data_spm.push(i);
  }
}

parser.pmc(data_pmc, function (err, parsed_data) {
  if (err) {
    console.log(err);
  }
  else {
    console.log("PMC data: " + parsed_data);
  }
});

parser.spm(data_spm, function (err, parsed_data) {
  if (err) {
    console.log(err);
  }
  else {
    console.log("SPM data: " + parsed_data);
  }
});
