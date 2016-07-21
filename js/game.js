$(document).ready(function() {
loopsChange();
});

var gameAPI = "http://www.dragonsofmugloar.com/api/game/"
var weatherAPI = "http://www.dragonsofmugloar.com/weather/api/report/"
var loopy;
var gameData = {};
var code;
var loopCount;
var loopMax;
var loopy;
var victories = 0;
var defeats = 0;
var ratio;
var dragonData = {
  dragon:{
    scaleThickness: 0,
    clawSharpness: 0,
    wingStrength: 0,
    fireBreath: 0
  }
};


function getPlayAPI(gameId){
  return gameAPI + gameData.gameId + "/solution";
}

function getWeatherAPI(){
  return  weatherAPI + gameData.gameId
}

function loopIt(times){
    loopCount = 0;
    loopMax = times;
    if (times == -1){
      loopMax = document.getElementById('loops').value;
    }
    loopy=setInterval(getGame,400);
}
function loopsChange(){
  $('.loops').html("Run " + document.getElementById('loops').value + " Games");
}
function stopLoop(){
  clearInterval(loopy);
}
function getGame(){
  if ( loopCount == loopMax-1) {
    stopLoop();
  }
  loopCount++;
  clearData();


  $.ajax({
    url: gameAPI
  })
  .then(function(game) {
    dragonData = {
      dragon:{
        scaleThickness: 0,
        clawSharpness: 0,
        wingStrength: 0,
        fireBreath: 0
      }
    };
    $('.game-id').html("Game ID: " + game.gameId);
    $('.knight-name').html(game.knight.name);
    $('.knight-attack').html(game.knight.attack);
    $('.knight-armor').html(game.knight.armor);
    $('.knight-agility').html(game.knight.agility);
    $('.knight-endurance').html(game.knight.endurance);
    gameData = game;
  })
  .done(function(){
    return getWeather();
  })
  .done(function(){

    //while(code===""){}
    getDragon();
  })
  .done(function(dragon){
    if(code == "SRO"){
      $('.dragon-scales').html("N/A");
      $('.dragon-claws').html("N/A");
      $('.dragon-wings').html("N/A");
      $('.dragon-breath').html("N/A");
    }
    else{
      while(dragonData.dragon == undefined){
        console.log("potty-training dragon...");
        getDragon();
      };
    $('.dragon-scales').html(dragonData.dragon.scaleThickness);
    $('.dragon-claws').html(dragonData.dragon.clawSharpness);
    $('.dragon-wings').html(dragonData.dragon.wingStrength);
    $('.dragon-breath').html(dragonData.dragon.fireBreath);
     }
    playGame();
  })
}



function getWeather(){

  wAPI=getWeatherAPI();
  $.ajax({
    url: wAPI,
    async: false
  })
  .success(function(weather){

    code = weather.getElementsByTagName("code")[0].innerHTML;
    $('.weather-text').html(weather.getElementsByTagName("message")[0]);
  })
  .error(function(error){
    console.log(error);
  })
}

function playGame(){
  var playAPI = getPlayAPI();

  var dragonString = JSON.stringify(dragonData);

  $.ajax({
    type: 'PUT',
    url: playAPI,
    contentType: 'application/json',
    dataType: 'json',
    data: dragonString
  })
  .then(function(result) {
    console.log(playAPI);
    console.log(dragonString);
    console.log(code);
    code="";
    console.log(result.status);
    if (result.status == "Victory"){
      victories++;
    }
    if (result.status == "Defeat"){
      defeats++;
    }
    if (victories == 0){
      ratio = 0
    }
    else if (defeats == 0){
      ratio = 100;
    }
    else{
      ratio = victories/(victories+defeats)*100;
    }
    console.log("Victories: "+victories+" Defeats: "+defeats+" Ratio: "+ratio+"%");
    $('.result').html(result.status + ": " + result.message);
  });
}

function getDragon(){

 if(code == "NMR"){
   $('.weather').html("Normal");
   chooseDragon();
 }
 else if(code == "HVA"){
   $('.weather').html("Flood");
   dragonData = {
     "dragon":{
       "scaleThickness": 0,
       "clawSharpness": 10,
       "wingStrength": 10,
       "fireBreath": 0
     }
   };
   //return;
 }
 else if (code == "SRO"){
   $('.weather').html("Storm" + " (Dragon will stay home)");
   dragonData={};
   //return;
 }

 else if(code == "T E"){
   $('.weather').html("Drought");
   dragonData = {
     "dragon":{
       "scaleThickness": 5,
       "clawSharpness": 5,
       "wingStrength": 5,
       "fireBreath": 5
     }
   };
   //return;
 }
 else if(code == "FUNDEFINEDG"){
   dragonData = {
     "dragon":{
       "scaleThickness": 5,
       "clawSharpness": 5,
       "wingStrength": 5,
       "fireBreath": 5
     }
   };
  // return;
 }



}

function chooseDragon(){

  var freepoints = 20;

  if(gameData.knight.attack > 5 && gameData.knight.attack >= gameData.knight.armor
    && gameData.knight.attack >= gameData.knight.agility && gameData.knight.attack >= gameData.knight.endurance){
    while (dragonData.dragon.scaleThickness < gameData.knight.attack+2 && freepoints){
      freepoints--;
      dragonData.dragon.scaleThickness++;
    }
  }
  else{
    while (dragonData.dragon.scaleThickness < gameData.knight.attack-1 && freepoints){
      freepoints--;
      dragonData.dragon.scaleThickness++;
    }
  }

  if (gameData.knight.armor > 5 && gameData.knight.armor >= gameData.knight.agility && gameData.knight.armor >= gameData.knight.endurance && gameData.knight.armor > gameData.knight.attack){
    while (dragonData.dragon.clawSharpness < gameData.knight.armor+2 && freepoints){
      freepoints--;
      dragonData.dragon.clawSharpness++;
    }
  }
  else {
    while (dragonData.dragon.clawSharpness < gameData.knight.armor-1 && freepoints){
      freepoints--;
      dragonData.dragon.clawSharpness++;
    }
  }


  if (gameData.knight.agility > 5 && gameData.knight.agility > gameData.knight.endurance
     && gameData.knight.agility > gameData.knight.attack && gameData.knight.agility > gameData.knight.armor){
    while (dragonData.dragon.wingStrength < gameData.knight.agility+2 && freepoints){
      freepoints--;
      dragonData.dragon.wingStrength++;
    }
  }
  else {
    while (dragonData.dragon.wingStrength < gameData.knight.agility-1 && freepoints){
      freepoints--;
      dragonData.dragon.wingStrength++;
    }
  }

  while (freepoints && dragonData.dragon.fireBreath < 10){
    freepoints--;
    dragonData.dragon.fireBreath++;
  }
  while(freepoints){
    dragonData.dragon.scaleThickness++;
    freepoints--;
  }

}

function clearData(){
  code="";
  $('.weather').html("");
  $('.dragon-scales').html("");
  $('.dragon-claws').html("");
  $('.dragon-wings').html("");
  $('.dragon-breath').html("");
}
