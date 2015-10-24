// SIT DOWN AND LEAN PREFERABLY ON YOUR CHAIR: DEATH ROCKIN STRAIGHT TO YOUR THEMATIC CONCLUSION OF NOT LIVING

var canvas, stage; 

var w, h;
var groundHeight;

// to load graphics assets
var img_player, img_sky, img_title;

var player;

function init() {
    stage = new createjs.Stage("DeathRockStage");
    stage.mouseEventsEnabled = true;
    w = stage.canvas.width;
    h = stage.canvas.height;
    
    // test circle
    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 10);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);
    stage.update();
    
    // images
    manifest = [
        {src:'player.png', id:'img_player'},
        {src:'sky.png', id:'img_sky'},
        {src:'title.png', id:'img_title'}
    ];
    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true, ".");
    
    RockChair.testergh();
    
    // ticker does timestep
    Ticker.setFPS(60);
    Ticker.addEventListener("tick", tick);
    
}

function handleComplete(){
    img_player = new Shape();
    img_player.graphics.beginBitmapFill(loader.getResult("img_player")).drawRect(0,0,200,200);
    stage.addChild(img_player);
    
    var test = loader.getResult("img_player");
    player = new createjs.Shape();
    player.graphics.beginBitmapFill(test).drawRect(0,0,w+100, h+100);
    
    
    stage.update();
}

// original thing which you dodge
var Projectile = (function () {

})()

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
var RockChair = (function () {
    
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

    function testergh(){
            
        var circle = new createjs.Shape();
        circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 100);
        circle.x = 10;
        circle.y = 10;
        stage.addChild(circle);
        stage.update();
    }

    function act_left(){
        dx = -10;
        spin = -10;     
    }
    function act_right(){
        dx = 10;
        spin = 10;
    }

    function update(){
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
    }

})()
