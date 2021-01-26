//Create variables here
var dog, happyDog, database, foodS, foodStock;
var Dog, happydog;
var button1,button2,fedTime,lastFed;
var foodObj;
var changeState,readState;
var bedroomimg,gardenimg,washroomimg;
function preload()
{
  //load images here
  Dog=loadImage("dogImg.png");
  happydog=loadImage("dogImg1.png");
  bedroomimg=loadImage("Bed Room.png");
  gardenimg=loadImage("Garden.png");
  washroomimg=loadImage("Wash Room.png");

}

function setup() {
  createCanvas(1000,500);
  dog=createSprite(800,200,10,10);
  dog.addImage(Dog);
  dog.scale=0.15;
  foodObj=new Food();
  feed=createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

database=firebase.database();
foodStock=database.ref('Food');
foodStock.on("value",readStock,showerr);

readState=database.ref('gameState');
readState.on("value",(data)=>{
  gameState=data.val();
});

}


function draw() {  
background(46,139,87);
foodObj.display();

fedTime=database.ref('FeedTime');
fedTime.on("value",(data)=>{
  lastFed=data.val();
})

if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}else{
  feed.show();
  addFood.show();
  dog.addImage(Dog);
  dog.display();
}
currentTime=hour();
if(currentTime==(lastFed+1)){
  update("Playing");
  foodObj.garden();
}else if(currentTime==(lastFed+2)){
  update("Sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2)&&currentTime<(lastFed+4)){
  update("Bathing");
  foodObj.washroom();
}else{
  update("Hungry");
  foodObj.display();
}

fill(255,255,254);
textSize(15);
if(lastFed>=12){
  text("LastFeed : "+lastFed%12 +"PM",350,30);
}else if(lastFed==0){
  text("LastFeed : 12 AM",350,30);
}else{
  text("LastFeed : "+lastFed +"AM",350,30);
}


drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function showerr(){
  console.log("error");
}
function addFoods(){
 foodS++;
 database.ref('/').update({
   Food:foodS
 })
}
function feedDog(){
  dog.addImage(happydog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
    gameState:"Hungry"
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  });
}
