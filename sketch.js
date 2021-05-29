//Create variables here
var dog,happyDog,food,foodStock,database,foodS,feed,foodStock,bed,currentTime;
var feedPet,addFood,fedTime,lastFed,foodObj,feedTime,bath,garden,readState,gameState;
var foodS = 20;
function preload(){
	Dog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  garden=loadImage("images/Garden.png");
  bath=loadImage("images/Wash Room.png");
  bed=loadImage("images/Bed Room.png");
}

function setup() {
 createCanvas(700,550);  
  dog = createSprite(310,350,50,50);
  dog.addImage(Dog);
  dog.scale = 0.15; 
  database = firebase.database();
  console.log(database);
  foodStock = database.ref('food');
  foodStock.on("value", readStock);
  food1 = new Food();
  feed = createButton("Feed The Dog");
  feed.position(690,95);
  feed.mousePressed(feedDog);
  readState= database.ref('gameState');
  readState.on("value", function(data){
gameState=data.val();
  })
  addFoodS = createButton("Add Food");
  addFoodS.position(600,95);
  addFoodS.mousePressed(addFood);
}


function draw() { 
   background("lightgreen");
  drawSprites();
  currentTime=hour();
if(currentTime === (lastFed+1)){
  update("Playing");
  food1.garden();
}else if(currentTime === (lastFed+2)){
  update("Sleeping");
  food1.bed();
}else if (currentTime === (lastFed+3)){
  update("Bathing");
  food1.bath();
}else{
  update("Hungry");
   food1.display();   
}

if(gameState!="Hungry"){
  addFoodS.hide();
  feed.hide();
  dog.remove();  
}else{
  addFoodS.show();
  feed.show();
  dog.addImage(Dog); 
}
 dog.addImage(Dog);
feedTime = database.ref('feedTime');
feedTime.on("value",function(data){
  lastFed = data.val();
})

fill(255,255,254);
textSize(15);

if(lastFed>=12){
  text("Last Fed: "+lastFed%12 + "PM",350,30);
}else if(lastFed == 0){
  text("Last Fed:12AM ",350,30);
}else{
  text("Last Fed: "+lastFed + "AM",350,30);
}
drawSprites();
}

function feedDog(){
  dog.addImage(happyDog);
  if(food1.getFoodStock()<= 0){
    food1.updateFoodStock(food1.getFoodStock()*0);
  }else{
    food1.updateFoodStock(food1.getFoodStock()-1);
    dog.addImage(happyDog);
  }
  database.ref('/').update({
    food:food1.getFoodStock(),
    feedTime:hour()
  })
}
function readStock(data){
  foodS = data.val();
  food1.updateFoodStock(foodS);
}

function addFood(){
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}

function showError(){ 
  console.log("Error in writing to the database");
  }
