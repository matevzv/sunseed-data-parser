#!/usr/bin/env nodejs

var sunseed_parser = require('./sunseed-parser');
var fs = require('fs');

// simulate PMC data
var pmc_data_length = 50;

var data_pmc = ["PMC"];

for (var i = 0; i < pmc_data_length; i++) {
  data_pmc.push(i);
}

// simulate toggle
data_pmc.push(1)
data_pmc.push(0)
data_pmc.push(1)

wams = sunseed_parser.pmc_simple;
data_wams = data_pmc;

const Influx = require('influx');
const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'telegraf',
  username: 'telegraf',
  password: 'telegraf'
})

var machine_id = fs.readFileSync('/etc/machine-id', 'utf8').trim();

// test WAMS parser functions
function grafana() {
  wams(data_wams, function (err, parsed_data) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(parsed_data);
      influx.writePoints([
      {
        measurement: 'pmc',
        tags: { host: machine_id },
        fields: parsed_data,
        timestamp: new Date()
      }]);
    }
  });
}

setInterval(grafana, 1000);
