var mongoose = require('mongoose');
var options = { server: { socketOptions: {connectTimeoutMS: 30000 } }};
mongoose.connect('mongodb://weatherapp:test@ds241395.mlab.com:41395/weatherapp', options, function(err){
  console.log(err);
})

var citylistSchema = mongoose.Schema({
    name: String,
    desc: String,
    tempMax: Number,
    tempMin: Number,
    position: Number,
});

var citytModel = mongoose.model('Cities', citylistSchema);
for (var i=0; i<cityList.length; i++){
  var city = new cityModel({
    name: "cityList[i].name",
    desc: "cityList[i].desc",
    tempMax: "cityList[i].tempMax",
    tempMin: "cityList[i].tempMin",
    position: "i",
  });
}

city.save(function (error, city){ //on est sur de l'asynchrone donc fonction de callback qui sera exécutée lorsque le backend aura fini son boulot!
  console.log(error);
  console.log(city);
});

/*
// Pour afficher les Doe John dans notre BDD
ContactModel.find({name: "Doe", firstName: "John"}, function (err, contactsList){ //pour chercher spécifiquement qq dont le nom est Doe et le first name John.
  for (var i=0; i<contactsList.length; i++){
    console.log(contactsList[i].firstName+ contactsList[i].name+ contactsList[i].age);
  };
});

// Pour modifier l'âge de Doe
ContactModel.update({name: "Doe"}, {age: 4}, function (err, contactsList){ //pour chercher spécifiquement qq dont le nom est Doe et le first name John.
  for (var i=0; i<contactsList.length; i++){
    console.log(contactsList[i].firstName+ contactsList[i].name+ contactsList[i].age);
  };
});

// Pour supprimer un doc
ContactModel.remove({name: "Doe"}, function (err, contactsList){ //pour chercher spécifiquement qq dont le nom est Doe et le first name John.
  for (var i=0; i<contactsList.length; i++){
    console.log("contactsList[i].firstName"+ "contactsList[i].name"+ "contactsList[i].age");
  };
});
*/
