$(function() { //permet de temporiser l'exécution car sinon on ferait appel à des éléments html qui n'existent même pas encore
  $("#sortable").sortable();
  $("#sortable").disableSelection();

  $("#sortable").on("sortupdate", function(event, ui) { // on n'exploite pas event et placeholder ici donc on peut même les enlever en fait! et habituellement on met ui plutôt que placeholder
    var sortedIDs = $("#sortable").sortable("toArray"); // to array: nécessite de donner IDs uniques à nos éléments
    console.log(sortedIDs);
    var updatedcityListString = JSON.stringify(sortedIDs);
    // console.log(updatedcityListString); //nouvel ordre des villes (ou bien nouvelle position si id = i)

    $.getJSON("/update?listemaj="+updatedcityListString, function(data) {
      if(data.result == true){
        $(".list-group-item").each(function(index){ //index donne le num du li sur lequel on se trouve & each: fonction de jquery = à for mais plus simple
      //  $(this).attr("id", index); //on boucle dans les li, this = moi, le li sur lequel on se trouve ; après "id" = nouvelle valeur à donner : seulement nécessaire quand id=i
          $(this).find("a").attr("href", "/delete?position="+index ) //car sinon bug sur le bouton supprimer qui supprimait l'ancienne position associée
        });
      }
    });
  });

/*  $("#city").keypress(function(){
    var entree = $("#city");
    console.log("Entrée détectée: "+ entree);
  });

  $("#city").on("keypress", function(event){
    console.log("Entrée: "+ event.which);
  }); */

});

var autocomplete
function initAutocomplete() { //Google n'accepte qu'une fonction de rappel dans l'url (cf ejs) donc on a tout mis dans une seule fonction, on aurait pu changer le nom genre autocompleteandmap
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /* @type {!HTMLInputElement} */(document.getElementById('city')),
  );

  var Paris = {lat: 48.866667, lng: 2.333333};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: Paris,
  });

  $("li").each(function(){
    var lat = $(this).data("lat");
    var lon = $(this).data("lon");
    var location = {lat: lat, lng: lon};
    var marker = new google.maps.Marker({
      position: location,
      map: map,
    });
      map.panTo(location);
      $(this).click(function(){
      map.panTo(location);
    })
  //  map.panTo(location);
  });
};


// https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyALD-Dfvhh3rW5r6twUYDyz_T75QMHsDcU&components=country:fr&input=pa
