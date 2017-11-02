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
});

var cityModel = mongoose.model('Cities', citySchema); // lecteur enregistreur prêt, il a les règles à respecter etc.

var cityList = [];

app.get('/', function(req, res){
  //res.render('Liste', {cityList}); //plus besoin, à la place on met le cityModel.find pour s'affranchir de cityList et plutôt utiliser la BDD
  cityModel.find(function (err, datas){ //pas de filtre, on veut tout afficher
    res.render('Liste', {cityList: datas});
  });
});

app.get("/add", function(req, res){

  request("http://api.openweathermap.org/data/2.5/weather?APPID=74f8a59f951845ccaeea31a9b0c9ae11&lang=fr&units=metric&q="+req.query.city+"", function(error, response, body){
    body = JSON.parse(body);
    var newcity = {name: body.name, desc: body.weather[0].description, icon: "http://openweathermap.org/img/w/"+body.weather[0].icon+".png", tempMax: body.main.temp_max, tempMin: body.main.temp_min};
    //cityList.push(newcity);
    console.log(body);
    /* console.log("http://openweathermap.org/img/w/"+body.weather[0].icon+".png")
    console.log(req.query.city);
    console.log(body.name);
    console.log(body.weather[0].description);
    console.log(body.weather[0].icon);
    console.log(body.main.temp_max);
    console.log(body.main.temp_min); */
    var city = new cityModel({ //ordre d'enregistrement
    name: body.name,
    desc: body.weather[0].description,
    icon: "http://openweathermap.org/img/w/"+body.weather[0].icon+".png",
    tempMax: body.main.temp_max +"°C",
    tempMin: body.main.temp_min +"°C",
  });

  city.save(function (error, city){ //on est sur de l'asynchrone donc fonction de callback qui sera exécutée lorsque le backend aura fini son boulot!
  console.log(error);
  console.log(city);
  cityModel.find(function (err, datas){ //pas de filtre, on veut tout afficher
    res.render('Liste', {cityList: datas});
  });
});
});

});

app.get("/delete", function(req, res){
  cityModel.remove({_id: req.query.id}, function (err,datas){
    console.log(req.query.id);
    cityModel.find(function (err, datas){
      res.render('Liste', {cityList: datas});
    });
  });
});

// Pb de la solution avec id = nom de ville, si j'ai deux fois le même nom l'ordre va en être affecté ! Voir autre solution avec id = position ou autre id unique avec timestamp (?)
app.get("/update", function(req, res){
  var updatedcityList = JSON.parse(req.query.listemaj); // pour "annuler" le JSON.stringify & pour info on aurait pu mettre var updatedcityList = JSON.parse(req.query.listemaj)
  console.log(updatedcityList);
  var cityListTmp = []; // Liste temporaire à laquelle j'ajoute la valeur du tiroir que je viens de tirer
  for (var i=0; i<updatedcityList.length; i++){
    for (var j=0; j<cityList.length; j++){
      if (updatedcityList[i] == cityList[j].name){
        cityListTmp.push(cityList[j]);
      }
    }
  }

  cityList = cityListTmp; // pour écraser l'ancien ordre de la liste
  res.send({result : true}); // on met juste un "ok" car on n'exploite pas le ajax ici donc c'est plus léger de juste envoyer ça
});


app.listen(8080, function(){
  console.log('Server listening on port 8080');
});
