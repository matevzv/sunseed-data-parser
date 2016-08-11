var parser = require('./sunseed-parser');

var data = ["PMC"]

for(var i = 0; i < 50; i++) {
  data.push(i);
}

parser.pmc(data, function(err, parsed_data){
  if (err) {
    console.log(err);
  }
  else {
    console.log(parsed_data);
  }
});
