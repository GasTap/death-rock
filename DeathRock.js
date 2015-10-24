// SIT DOWN AND LEAN PREFERABLY ON YOUR CHAIR: DEATH ROCKIN STRAIGHT TO YOUR THEMATIC CONCLUSION OF NOT LIVING

// With some starting code from Daniel Albu's "Pong Game" create.js tutorial

// can we get this by canvas id?
var CANVAS_WIDTH = 720;
var CANVAS_HEIGHT = 830;

// the only static level variable. implement antiGround for broken terrain later
var groundHeight = 0;

// the top level objects
var canvas;
var stage; 
var player = new RockChair;

// to load graphics assets
var img_player; 
var img_sky; 
var img_title;

function init() {
    stage = new createjs.Stage("DeathRockStage");
    stage.mouseEventsEnabled = true;
    
    // test circle
    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);
    stage.update();
    
    // images
    /*
    manifest = [
                {src:'player.png', id:'img_player'},
                {src:'sky.png', id:'img_sky'},
                {src:'title.png', id:'img_title'}
                ];
    preloader = new PreloadJS();
    preloader.onProgress = handleProgress;
    preloader.onComplete = handleComplete;
    preloader.onFileLoad = handleFileLoad;
    preloader.loadManifest(manifest);
    */
    // ticker does timestep
    Ticker.setFPS(60);
    Ticker.addListener(stage);
    
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
    var START_X = CANVAS_WIDTH/2;
    var START_Y = groundHeight;
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

/*
// file loading

function handleProgress(event)
{
    //use event.loaded to get the percentage of the loading
}

function handleComplete(event) {
         
}

function handleFileLoad(event) {

            
    switch(event.type)
    {
        case PreloadJS.IMAGE:
        //image loaded
         var img = new Image();
         img.src = event.src;
         img.onload = handleLoadComplete;
         window[event.id] = new Bitmap(img);
        break;

        case PreloadJS.SOUND:
        //sound loaded
        handleLoadComplete();
        break;
    }
}

 function handleLoadComplete(event) 
 {

    totalLoaded++;
    
    if(manifest.length==totalLoaded)
    {
        addTitleView();
    }
 }
 */