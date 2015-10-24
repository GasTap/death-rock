/*
you need to make the chair rock
you need to make it collide with the ground and have gravity
you need hard rock to make chair shift AND lean

the chair will never VISUALLY lean past its limit and thus never topple
but any hard enough accel past the limit+overlean makes the chair also slide
*/

// TODO: do we lean and chair follows or is body and chair one?

// TODO check canvas for this 
var CANVAS_WIDTH = 720;
var CANVAS_HEIGHT = 830;

var groundHeight = 0;
// probably could just make the cracks and gaps another object
var groundWidth = 0;

function main() {
   // test
  var stage = new createjs.Stage("demoCanvas");
  var circle = new createjs.Shape();
  circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
  circle.x = 100;
  circle.y = 100;
  stage.addChild(circle);
  stage.update();

   // make ticker

   // make whatever objects and then ticker will update them

}

// make copies of projectile each with words and effects
// projectiles such as heart attack might be defeated by its anti-version low cholestrol
var Projectile = (function () {

})()

// life has no visible form and is the projectile spawner
// life throws things at you.
var Life = (function () {

})()


// player. listens to, moves hitboxes
var RockChair = (function () {
   // base stat in degrees for now
   var LEAN_ACCEL = 6;
   var LEAN_LIMIT = 70;
   var LEAN_OVERLEAN = 10;
   var START_X = CANVAS_WIDTH/2;
   var START_Y = 30;

   // changing stats
   var lean = 0;
   var x = START_X;
   var y = START_Y;
   var dx = 0;
   var dy = 0;

   function update(){
      x += dx;
      y += dy;
      if (y < groundHeight){
         y = groundHeight;
      }
      // TODO rotate hitboxes, rotate character
   }

})()

// the stage. updates the ground that rises and crumbles.
var Stage = (function(){


})()
