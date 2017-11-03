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
var request = require ('request');
var mongoose = require('mongoose');
var app = express(); // initialisation du serveur
app.set('view engine', 'ejs');
app.use(express.static('public'));

var cityList = [];

var options = { server: { socketOptions: {connectTimeoutMS: 30000 } }};
mongoose.connect('mongodb://weatherapp:test@ds241395.mlab.com:41395/weatherapp', options, function(err){
  console.log(err);
})

var citySchema = mongoose.Schema({
  name: String,
  desc: String,
  icon: String,
  tempMax: String,
  tempMin: String,
  position: Number,
  lat: Number,
  lon: Number,
});

var cityModel = mongoose.model('Cities', citySchema); // lecteur enregistreur prêt, il a les règles à respecter etc.

app.get('/', function(req, res){
  //res.render('Liste', {cityList}); //plus besoin, à la place on met le cityModel.find pour s'affranchir de cityList et plutôt utiliser la BDD
  var query = cityModel.find();
  query.sort({position: 1});
  query.exec(function (err, datas){ //pas de filtre, on veut tout afficher
    res.render('Liste', {cityList: datas});
  });
});

app.get("/add", function(req, res){

  request("http://api.openweathermap.org/data/2.5/weather?APPID=74f8a59f951845ccaeea31a9b0c9ae11&lang=fr&units=metric&q="+req.query.city+"", function(error, response, body){
    body = JSON.parse(body);
    // var newcity = {name: body.name, desc: body.weather[0].description, icon: "http://openweathermap.org/img/w/"+body.weather[0].icon+".png", tempMax: body.main.temp_max, tempMin: body.main.temp_min};
    //cityList.push(newcity);
    // console.log(body);
    /* console.log("http://openweathermap.org/img/w/"+body.weather[0].icon+".png")
    console.log(req.query.city);
    console.log(body.name);
    console.log(body.weather[0].description);
    console.log(body.weather[0].icon);
    console.log(body.main.temp_max);
    console.log(body.main.temp_min); */

    var query = cityModel.find(); // on stocke le find dans query pour pouvoir l'exécuter que plus tard via .exec
    query.sort({position: 1}); // Sort datas par position croissante

    query.exec(function(err,datas){

      var nextPosition = 1 //car si pas de données dans notre BDD, il manque une info pour attribuer la position à notre nouvelle ville
      if (datas.length>0){
        nextPosition = (datas[datas.length-1].position)+1
      }

      var city = new cityModel({ //ordre d'enregistrement
        name: body.name,
        desc: body.weather[0].description,
        icon: "http://openweathermap.org/img/w/"+body.weather[0].icon+".png",
        tempMax: body.main.temp_max +"°C",
        tempMin: body.main.temp_min +"°C",
        position: nextPosition, //-1 car on est dans les tiroirs du tableau, pas dans la position sur la BDD
        lat: body.coord.lat,
        lon: body.coord.lon,
      });

      city.save(function (error, city){ //on est sur de l'asynchrone donc fonction de callback qui sera exécutée lorsque le backend aura fini son boulot!
        console.log(error);
        console.log(city);
        cityModel.find(function (err, datas){ //on refait un find pour que le res.render affiche également les nouvelles entrées
          res.render('Liste', {cityList: datas});
        });
      });

    });
  });
});

app.get("/delete", function(req, res){
  cityModel.remove({_id: req.query.id}, function (err,datas){
    console.log(req.query.id);
    cityModel.find(function (err, datas){
      res.render('Liste', {cityList: datas}); // on déverse datas dans cityList, cityList n'est plus notre var d'avant mais bien cette fois la cityList rendue accessible dans l'EJS via la BDD
    });
  });
});

app.get("/update", function(req,res){
  var updatedcityList = JSON.parse(req.query.listemaj);
  var query = cityModel.find(); // on stocke le find dans query pour pouvoir l'exécuter que plus tard via .exec
  query.exec(function(err,datas){
    //query.update(function(err,datas){
      for (var i=0; i<updatedcityList.length; i++){
        for (var j=0; j<datas.length; j++){
          if (updatedcityList[i] == datas[j].name){
            datas[j].position = i;
            cityModel.update({name: datas[j].name}, {position: i}, function(){});
          }
        };
      //};
    };
  });

  res.send({resultat: true});
});

app.listen(8080, function(){
  console.log('Server listening on port 8080');
});
