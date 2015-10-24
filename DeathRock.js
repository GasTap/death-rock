// SIT DOWN AND LEAN PREFERABLY ON YOUR CHAIR: DEATH ROCKIN STRAIGHT TO YOUR THEMATIC CONCLUSION OF NOT LIVING

var stage, w, h, loader;
// graphics
var player, title, sky;


function init() {
    stage = new createjs.Stage("DeathRockStage");
    w = stage.canvas.width;
    h = stage.canvas.height;
    
    // images
    manifest = [
        {src:"player.png", id:"player"},
        {src:"sky.png", id:"sky"},
        {src:"title.png", id:"title"}
    ];
    
    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true, "");
    RockChair.testergh();
}

function handleComplete(){
    sky = new createjs.Shape();
    sky.graphics.beginBitmapFill(loader.getResult("sky")).drawRect(0,0,w,h);
    
    //EventDispatcher.initialize(RockChair)
    // stage.addEventListener();
    
    player = new createjs.Shape();
    player.graphics.beginBitmapFill(loader.getResult("player")).drawRect(0,0,127,137);
    player.regX = 127/2;
    player.regY = 137/2;
    player.x = 200;
    player.y = 200;
    stage.addChild(sky, player);
    
    createjs.Ticker.setFPS(60);
    //createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
    sky.y -= 0.1;
    player.rotation+= 5;
    stage.update(event);
}

// original thing which you dodge
function Projectile(){
}

// life throws things at you. err its the Projectile spawner
var Life = (function () {

})()


/* much ado about the player
    
    MECHANICS
    leaning for left and right
    the chair stops leaning after a certain point (you never topple)
    the chair at max lean super quickly "overleans"
    overlean:
        overlean charge not only make the player rotate the other way,
        expelling overlean charge will make the chair slide and have dx
        this is the only way to slide
    when sliding:
        you will only slide so far based on overlean (maybe just 2 tiers of speed)
        you will stop very quickly when you lean the other way
        you do not build overlean in the opposite direction until you stop sliding
        
    it seems you wont leave the ground easily
    it should be easy to discover the overlean technique, so it should be easy to do
    on accident, even.
    
    
    how do i draw and rotate ffffffffffff
*/

function testergh(){
            
        var circle = new createjs.Shape();
        circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 100);
        circle.x = 10;
        circle.y = 10;
        stage.addChild(circle);
        stage.update();
    }
var RockChair = function(){    
    // positive velocity goes right of course
    var START_X = stage.canvas.width / 2;
    var START_Y = stage.canvas.height;

    var lean = 0;    
    var x = START_X;
    var y = START_Y;
    var dx = 0;
    var dy = 0;
    var overlean = 0;
    var rotation = 0;
    var spin = 0;

    // game mechanic constants
    var LEAN_ACCEL = 6;
    var LEAN_LIMIT = 70;
    var LEAN_OVERLEAN = 20;
    var FRICTION = 3;
    var OVERLEAN_MODULO = 10;

    // oh no
    this.testergh = function(){
            
        var circle = new createjs.Shape();
        circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 100);
        circle.x = 10;
        circle.y = 10;
        stage.addChild(circle);
        stage.update();
    };

    // set mode when you hear input
    this.act_left = function(){
        dx = -10;
        spin = -10;     
    };
    this.act_right = function(){
        dx = 10;
        spin = 10;
    };


    this.update = function(){
        x += dx;
        
        //todo keep x coordinate within canvas
        
        if (Math.abs(rotation) <= LEAN_LIMIT + LEAN_OVERLEAN){
            rotation += spin;
        }
        if (Math.abs(rotation) > LEAN_LIMIT){
            overlean += 1;
        }
        
        // currently under assumption ground is flat and never broken
        y += dy;
        if (y < groundHeight){
            y = groundHeight;
        }

        // TODO rotate hitboxes, rotate character
    };
};
