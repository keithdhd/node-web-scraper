var express  = require('express');
var cheerio  = require('cheerio');
var fs       = require('fs');
var request  = require('request');
var app      = express();

app.get('/', function(req, res){
  res.send("Welcome");
})


app.get('/scrape', function(req, res){

  url = 'http://www.imdb.com/title/tt0068646';

  request(url, function(error, response, html){

    if(!error){

      var $ = cheerio.load(html);

      var title, release, rating;
      var json = {title: '', release: '', rating: ''};
      

      $('.header').filter(function(){
        var data = $(this);
        
        json.title = data.children().first().text();
        json.release = data.children().last().children().text();

      });

      $('.star-box-giga-star').filter(function(){
        json.rating = $(this).text();
      });

    }

    fs.writeFile('output.json', JSON.stringify(json), function(err){

      if(err){ 
        console.log('Woops! There was an error: ' + err);
      }else{
        console.log('File successfully written! - Check your project directory for the output.json file');
      }
    })

    res.send(JSON.stringify(json));

  });

})

app.listen('8000');
console.log('The magic is all happening on port 8000');
exports = module.exports = app;