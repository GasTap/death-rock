// TODO elevation
// TODO interludes
// TODO collisions
// TODO refine player movement
// TODO music
// TODO sounds
// TODO intro and outro

var canvas; //Will be linked to the canvas in our index.html page
var stage; //Is the equivalent of stage in AS3 and we'll add "children" to it

var stageWidth = 720;
var stageHeight = 720;

var mouse = {x:0,y:0};
var keys = {};
for (var i = 0; i < 255; i ++) {
	keys[i] = false;
}

var LEFT_KEY = 37;
var RIGHT_KEY = 39;

var mainGameObjects = [];

// Graphics
//[Background]

var bg; //The background graphic

//[Title View]
 

var title; //The title Background

//[Game View]


var player; //The player paddle graphic
var ground; // TODO
var TitleView = new Container();
var projectiles = [];

var groundElevation = 0;
var elevationStep = 10;

//[Score]

var playerScore; //The main player score

// Variables

var tkr = new Object;

var currentInterlude = null;

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
	var LEAN_LIMIT = 30;
	var LEAN_OVERLEAN = 10;
    
    var LEAN = 4;
    var OVERLEAN = 0.5;
    var MAX_ANGLE = 16;
    var MAX_OVERLEAN = 21;
    var SPEED = 10;
    var FRICTION = 0.1;

	function RockChairSystem () {
		// changing stats
		this.lean = LEAN_LIMIT;
        this.overlean = 0;
		this.velocity = 0;

		this.update = function () {
            if(keys[LEFT_KEY]){
                if(-this.lean < MAX_ANGLE){
                    this.lean -= LEAN;
                } else if(-this.lean < MAX_OVERLEAN){
                    this.lean -= OVERLEAN;
                    this.overlean -= OVERLEAN;
                }
                if(this.overlean > 0){
                    this.velocity = -this.overlean * SPEED;
                    this.overlean += this.overlean * - 0.01;
                }
                if(this.lean < 0){
                    this.overlean += this.overlean * - 0.3;
                }
            }
            if(keys[RIGHT_KEY]){
                if(this.lean < MAX_ANGLE){
                    this.lean += LEAN;
                } else if(this.lean < MAX_OVERLEAN){
                    this.lean += OVERLEAN;
                    this.overlean += OVERLEAN;
                }
                if(this.overlean < 0){
                    this.velocity = -this.overlean * SPEED;
                    this.overlean += this.overlean * - 0.01;
                }
                if(this.overlean > 0){
                    this.overlean += this.overlean * - 0.3;
                }
            }
            this.lean += this.lean * - 0.01;
            if (this.velocity > 0){
                this.velocity -= FRICTION;
            }
            if (this.velocity < 0){
                this.velocity += FRICTION;
            }
			//velocity += -this.lean * LEAN_ACCEL;
			//this.lean += velocity;
		}
        
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

function cleanProjectiles () {
	var toDestroy = projectiles.filter(function (projectile) { return projectile.destroyed; });
    toDestroy.map(function (projectile) { stage.removeChild(projectile.displayObject) });
    // TODO destroy projectiles
    projectiles = projectiles.filter(function (projectile) { return !projectile.destroyed; });
}

function projectileColliding (projectile) {
	return dist(player,projectile.displayObject) < 90;
}

function Main() {
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

    ground = new Container();
    stage.addChild(ground);
    
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
	keys[e.keyCode] = true;
}

function onKeyUp (e) {
	keys[e.keyCode] = false;
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
function dist(a,b) { return Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y - b.y, 2));}

function update() {

	//spawnProjectile("adsf", Math.random() > 0.5, mouse.x, mouse.y, Math.random()*4 -2,Math.random()*4 -2)

	// if we're in an interlude, update that instead
	if (currentInterlude !== null) {
		currentInterlude.update(stage);
		return;
	}

	for (var i = 0; i < projectiles.length; i++) {
		if (projectileColliding(projectiles[i])) {
			groundElevation += elevationStep;
			projectiles[i].destroyed = true;
			cleanProjectiles();
			//return switchToInterlude(Interlude1);
		}
	}

	rockChair.update();
    
    /*
    // move player
    if (keys.left) {
        player.x -= playerMoveSpeed * (rockChair.getLeftLeanSpeed());
    }
    if (keys.right) {
        player.x += playerMoveSpeed * (rockChair.getRightLeanSpeed());
    if (keys[LEFT_KEY]) {
    	player.x -= playerMoveSpeed * (rockChair.getLeftLeanSpeed());
    }
    if (keys[RIGHT_KEY]) {
    	player.x += playerMoveSpeed * (rockChair.getRightLeanSpeed());
    }
    */
    player.x += rockChair.velocity;
    
    // constrain player to ground
    player.y = stageHeight - groundElevation + rockChair.getHeightLeanFactor() * -10;
    
    // rotate player
    player.rotation = rockChair.lean;
    
    updatePlayer(player);
    
    // TODO ground redraw graphics based on width and height and elevation

    // update projectiles
    projectiles.map(updateProjectile);

    // clean projectiles
    cleanProjectiles();

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

	if (projectile.displayObject.y > stageHeight + 20) {
		projectile.destroyed = true;
	}
}

function switchToInterlude (InterludeClass) {
	// TODO save scene and load interlude

	// remove player and all projectiles
	mainGameObjects = [player, ground].concat(projectiles.map(function(projectile){ return projectile.displayObject; }));
	mainGameObjects.forEach(function (displayObject) {
		stage.removeChild(displayObject);
	});

	currentInterlude = new InterludeClass();
	currentInterlude.add(stage);
}

function returnFromInterlude () {
	mainGameObjects.forEach(function (displayObject) {
		stage.addChild(displayObject);
	})
	currentInterlude = null;
}
