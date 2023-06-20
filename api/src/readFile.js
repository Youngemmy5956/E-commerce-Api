// var fs = require('fs');
// var stream = fs.createReadStream('./data.txt');

// stream.on("data", function(data){
//     var chunk = data.toString();
//     console.log(chunk);
// });



// write to file
var fs = require("fs");

var data = "New File Contents";

fs.writeFile("temp.txt", data, (err) =>{
    if(err) console.log(err);
    console.log('Write successful')
})

// read file

var fs = require("fs");

fs.readFile("./temp.txt", (err, data) =>{
    console.log(data.toString());
})