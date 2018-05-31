var fs = require('fs');
var mqtt = require('mqtt');
var sleep = require('sleep');
var sunseed_parser = require('./sunseed-parser');

var data_file = 'datasets/realspmdatatest';
var sweep = fs.readFileSync(data_file, 'utf8');
var lines = sweep.split(/\r?\n/);
lines.pop()

/*var i,j,temparray,chunk = 50;
for (i = 0,j = lines.length; i < j; i+=chunk) {
    temparray = lines.slice(i,i+chunk);
    console.log("-----------------------: " + i);
    for (var k = 0; k < chunk; k++) {
      console.log(temparray[k]);
    }  
}*/

var chunk = 50
var chunks = (lines.length) / chunk;
console.log(chunks);
var start = Math.floor(Math.random() * chunks);

var i = start;

setInterval(function () {
  if (i == chunks) i = 0;
  console.log("-----------------------: " + i);
  for (var j = i*chunk; j < i*chunk+chunk; j++) {
    console.log(lines[j]);
  }
  i++;
}, 1000);
