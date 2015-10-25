// Pong Game
// Developed by Daniel Albu

/* Define Canvas */

var canvas; //Will be linked to the canvas in our index.html page
var stage; //Is the equivalent of stage in AS3 and we'll add "children" to it

var stageWidth = 720;
var stageHeight = 720;

var mouse = {x:0,y:0};
var keys = {left: false, right: false};

// Graphics
//[Background]

var bg; //The background graphic

//[Title View]
 

var title; //The title Background

//[Game View]


var player; //The player paddle graphic
var ground; // TODO
var projectiles = [];

var groundElevation = 0;

//[Score]

var playerScore; //The main player score

// Variables

var xSpeed = 5;
var ySpeed = 5;
var tkr = new Object;

//preloader
var preloader;
var manifest;
var totalLoaded = 0;

var gravity = 0.5;
var maxVelocity = 20;
var playerMoveSpeed = 4;

var rockChair = (function () {
	// base stat in degrees for now
	var LEAN_ACCEL = 0.005;
	var LEAN_LIMIT = 20;
	var LEAN_OVERLEAN = 10;

	function toRad (deg) {
		return deg / 180 * Math.PI;
	}

	function RockChairSystem () {
		// changing stats
		this.lean = LEAN_LIMIT;
		var velocity = 0;

		this.update = function () {
			velocity += -this.lean * LEAN_ACCEL;
			this.lean += velocity;
		}

		//var rightSpeedLeanFactor = rockChair.lean > 0 ? Math.sin(((rockChair.lean + 45) * 3) / 180 * Math.PI) : 0;
		//var leftSpeedLeanFactor = rockChair.lean < 0 ? Math.sin(((rockChair.lean - 45) * 3) / 180 * Math.PI) : 0;

		function toRad(deg) { return deg / 180 * Math.PI; }

		this.getLeftLeanSpeed = function () {
			return velocity < 0 ? -velocity / 2 : velocity / 4;
		}
		this.getRightLeanSpeed = function () {
			return velocity > 0 ? velocity / 2 : -velocity / 4;
		}
		this.getHeightLeanFactor = function () {
			return Math.abs(Math.sin(this.lean / 180 * Math.PI));
		}
	}

	return new RockChairSystem();
})();

function Projectile (isGood) {
    this.vx = 0;
    this.vy = 0;
    this.isGood = isGood;
    this.destroyed = false;
    this.displayObject = null;
}

function spawnProjectile (text, isGood, x, y, vx, vy) {
    var proj = new Projectile(isGood);
    proj.vx = vx || 0;
    proj.vy = vy || 0;
    var projGraphics = new Container();
    projGraphics.x = x || 0;
    projGraphics.y = y || 0;
    proj.displayObject = projGraphics;
    var circle;
    var textShape;
    if (isGood) {
        circle = new Shape();
        circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 10);
        projGraphics.addChild(circle);

        textShape = new Text(text, 'bold 20px Arial', '#dddddd');
        projGraphics.addChild(textShape);
    } else {
        circle = new Shape();
        circle.graphics.beginFill("DarkRed").drawCircle(0, 0, 10);
        projGraphics.addChild(circle);

        textShape = new Text(text, 'bold 20px Arial', '#333333');
        projGraphics.addChild(textShape);
    }

    textShape.x = -textShape.getMeasuredWidth()/2; 
	textShape.y = textShape.getMeasuredLineHeight()/4;

    projectiles.push(proj);
    stage.addChild(projGraphics);
    return proj;
}

var TitleView = new Container();

function Main()
{
    /* Link Canvas */
    
    canvas = document.getElementById('DeathRockStage');
    stage = new Stage(canvas);
        
    stage.mouseEventsEnabled = true;

    manifest = [
                {src:"sky.png", id:"bg"},
                {src:"title.png", id:"title"},
                {src:"startB.png", id:"startB"},
                {src:"player.png", id:"player"}
            ];

    preloader = new PreloadJS();
    preloader.onFileLoad = handleFileLoad;
    preloader.loadManifest(manifest);

    /* Ticker */
    
    Ticker.setFPS(30);
    Ticker.addListener(stage);
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


// Add Title View Function

function addTitleView()
{
    //console.log("Add Title View");
    startB.x = 360 - 31.5;
    startB.y = 415;
    startB.name = 'startB';
    
    title.x = 360 - 139.5;
    title.y = 200;
    
    TitleView.addChild(title, startB);
    stage.addChild(bg, TitleView);
    stage.update();
    
    // Button Listeners
    //startB.onPress = addGameView;
    addGameView();

}

// Add Game View

function addGameView()
{
    // Destroy Menu
    
    stage.removeChild(TitleView);
    TitleView = null;
    
    // Add Game View
    
    player = new Container();

    var img = new Bitmap('player.png');
    img.x = -img.image.width / 2;
    img.y = -img.image.height;
    player.addChild(img);
    player.x = stageWidth / 2;
    player.y = stageHeight;

    stage.addChild(player);
    
    // Score
    stage.update();
    
    // Start Listener 
    
    //bg.onPress = startGame;
    startGame();
}

// Start Game Function
function startGame(e) {
    bg.onPress = null;
    stage.onMouseMove = onMouseMove;
    window.document.onkeydown = onKeyDown;
    window.document.onkeyup = onKeyUp;
    
    Ticker.addListener(tkr, false);
    tkr.tick = update;
}

// Player Movement

function onMouseMove(e) {
    mouse.x = e.stageX;
    mouse.y = e.stageY;
}

function onKeyDown (e) {
	if (e.keyCode === 37) {
		keys.left = true;
	} else if (e.keyCode === 39) {
		keys.right = true;
	}
}

function onKeyUp (e) {
	if (e.keyCode === 37) {
		keys.left = false;
	} else if (e.keyCode === 39) {
		keys.right = false;
	}
}

/* Reset */

function reset()
{
    player.x = stage.width / 2;
    
    stage.onMouseMove = null;
    Ticker.removeListener(tkr);
    bg.onPress = startGame;
}

// Update Function

function update() {

	//spawnProjectile("adsf", Math.random() > 0.5, mouse.x, mouse.y, Math.random()*4 -2,Math.random()*4 -2)

	rockChair.update();
	
    // move player
    if (keys.left) {
    	player.x -= playerMoveSpeed * (rockChair.getLeftLeanSpeed());
    }
    if (keys.right) {
    	player.x += playerMoveSpeed * (rockChair.getRightLeanSpeed());
    }

    updatePlayer(player);

    // constrain player to ground
    player.y = stageHeight - groundElevation + rockChair.getHeightLeanFactor() * -10;

    // rotate player
    player.rotation = rockChair.lean;
    
    // TODO ground redraw graphics based on width and height and elevation

    // update projectiles
    projectiles.map(updateProjectile);

    // clean projectiles
    var toDestroy = projectiles.filter(function (projectile) { return projectile.destroyed; });
    toDestroy.map(function (projectile) { stage.removeChild(toDestroy) });
    // TODO destroy projectiles
    projectiles = projectiles.filter(function (projectile) { return !projectile.destroyed; });

    if (Math.random() < 0.05) {
    	spawnProjectile("asdf", Math.random() > 0.8, Math.random() * stageWidth, -10, Math.random() * 4 - 2, Math.random() * 2);
    }
}

function updatePlayer (player) {

}

function updateProjectile (projectile) {
	projectile.vy += gravity;
	projectile.vy = Math.min(maxVelocity, projectile.vy);
	projectile.displayObject.x += projectile.vx;
	projectile.displayObject.y += projectile.vy;

	// TODO collide player
	// TODO collide ground

	// TODO out of bounds
}
