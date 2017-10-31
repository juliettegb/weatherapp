// npm intit et git init
// npm install express --save
// npm install ejs --save
// res.send = res.write mais dans univers express ; permet d'envoyer des chaînes de caractères (et si pas chaîne de caractère, ça le transforme)
// res.write = récupère fichier, ouvre son contenu et le "traduit" en string pour l'envoyer

// Ajouter les icônes !
// city = name dans code Noël
//cityList[i].icon à modifier aussi dans ejs
//city = name, tempMax = temp_max et temp_min???
// ajouter les routes dans le EJS dans le form action: "/route" et si besoin de JS on pense à <%= blabla %>


var express = require('express'); // pour importer le module
var app = express(); // initialisation du serveur
app.set('view engine', 'ejs');
app.use(express.static('public'));
var request = require ("request");

var cityList = [];

  app.get('/', function(req, res){
    res.render('Liste', {cityList}); // ou {cities: cityList} et dans ce cas il faut appeler cities dans le doc ejs
  });

  app.get("/add", function(req, res){

    request("http://api.openweathermap.org/data/2.5/weather?APPID=74f8a59f951845ccaeea31a9b0c9ae11&lang=fr&units=metric&q="+req.query.city+"", function(error, response, body){
      var body = JSON.parse(body);
      var newcity = {name: body.name, desc: body.weather[0].description, icon: "http://openweathermap.org/img/w/"+body.weather[0].icon+".png", tempMax: body.main.temp_max, tempMin: body.main.temp_min};
      cityList.push(newcity);

      console.log("http://openweathermap.org/img/w/"+body.weather[0].icon+".png")
      console.log(req.query.city);
      console.log(body.name);
      console.log(body.weather[0].description);
      console.log(body.weather[0].icon);
      console.log(body.main.temp_max);
      console.log(body.main.temp_min);
      res.render('Liste', {cityList});
    });

  });

  app.get("/delete", function(req, res){
    cityList.splice(req.query.position, 1);
    res.render('Liste', {cityList});
  });

  app.get("/update", function(req, res){
    var updatedcityList = req.query.listemaj;
    console.log(updatedcityList);
  });

app.listen(8080, function(error, response, body){
  console.log('Server listening on port 8080');
});
