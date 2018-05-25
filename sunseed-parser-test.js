#!/usr/bin/env nodejs

var fs = require('fs');
var sunseed_parser = require('./sunseed-parser');

// commandline args
var process_cli = function (callback) {
  var limit = false;

  process.argv.forEach(function (val, index) {
    if (val == "-h" || val == "--help") {
      console.log("Usage: spm [OPTIONS]\n");
      console.log("The Sunseed data parser.\n");
      console.log("Options:\n");
      console.log("-h, --help          Print usage");
      console.log("-l, --limit         Limit measurement period to 1 second");
      process.exit();
    }
    else if (val == "-l" || val == "--limit") {
      console.log("Measurement period limited to 1 second.");
      limit = true;
    }
    else if (index > 1) {
      console.log("spm: '" + val + "' is not a spm command. See 'spm --help'.");
      process.exit(1);
    }
  });

  callback(limit);
}

pmc_file_name = "/tmp/pmc-data";
spm_file_name = "/tmp/spm-data";

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

device = "pmc"

if (device == "spm") {
  wams = sunseed_parser.spm;
  data_wams = data_spm;
}
else if (device == "pmc") {
  wams = sunseed_parser.pmc_simple;
  data_wams = data_pmc;
}

// test WAMS parser functions
/*/wams(data_wams, "1", function (err, parsed_data) {
  if (err) {
    console.log(err);
  }
  else {
    console.log(parsed_data);
  }
});*/


/*// test PMC and SPM parser functions
sunseed_parser.pmc(data_pmc, function (err, parsed_data) {
  if (err) {
    console.log(err);
  }
  else {
    //data_json = JSON.parse(parsed_data)
    //console.log(data_json.length);
    //short = data_json.splice(0, 6)
    console.log(JSON.parse(parsed_data).splice(3, 3));
  }
});*/

/*process_cli(function (limit) {
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
        if (limit) {
          if (parsed_data.indexOf('"report_n":2') !== -1) {
            console.log("\nSPM data: " + parsed_data);
          }
        } else {
          console.log("\nSPM data: " + parsed_data);
        }
      }
    });
  });
});*/

data_pmc = "PMC1,233.60,233.81,233.47,0.10,0.07,0.08,0.07,49.97,0.00,0.00,36.00,36.00,36.10,0.00,160.10,0.00,-0.10,-0.20,-0.40,-0.20,0.00,0.10,2.20,1.60,1.90,-4.40,-8.20,-18.20,-0.20,-0.20,-0.40,0.00,0.00,-0.10,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.20,0.10,0.30,38.00,1.00,1.00,0.00"

sunseed_parser.pmc(data_pmc, function (err, parsed_data) {
  if (err) {
    console.log(err);
  }
  else {
    var power_data = JSON.parse(parsed_data).splice(16, 3)
    power_data[0].value *= 10
    power_data[1].value *= 10
    power_data[2].value *= 10
    cosfi_data = JSON.parse(parsed_data).splice(25, 3)
    cosfi_data[0].value = (cosfi_data[0].value / 100).toFixed(3)
    cosfi_data[1].value = (cosfi_data[1].value / 100).toFixed(3)
    cosfi_data[2].value = (cosfi_data[2].value / 100).toFixed(3)
    interesting_data = power_data.concat(cosfi_data)
    console.log(JSON.stringify(interesting_data));
  }
});

/*sunseed_parser.spm_long(data_spm, function (err, parsed_data) {
  if (err) {
    console.log(err);
  }
  else {
    fs.writeFileSync(spm_file_name, parsed_data + "\n");
    console.log("SPM file created.");
  }
});

sunseed_parser.toggle([0, 0 ,1], function (err, message) {
  if (err) return console.log(err.message);
  return console.log(message);
});
*/
