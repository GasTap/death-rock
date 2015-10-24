// Pong Game
// Developed by Daniel Albu

/* Define Canvas */

var canvas; //Will be linked to the canvas in our index.html page
var stage; //Is the equivalent of stage in AS3 and we'll add "children" to it

// Graphics
//[Background]

var bg; //The background graphic

//[Title View]
 

var title; //The title Background

//[Game View]


var player; //The player paddle graphic
var ball; //The ball graphic
var win; //The winning popup
var lose; //The losing popup

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

//[Title View Group]

var TitleView = new Container();

// Main Function

function Main()
{
	/* Link Canvas */
	
	canvas = document.getElementById('DeathRockStage');
  	stage = new Stage(canvas);
  		
  	stage.mouseEventsEnabled = true;
  	
  	
	/* Set The Flash Plugin for browsers that don't support SoundJS */
  	SoundJS.FlashPlugin.BASE_PATH = "assets/";
    if (!SoundJS.checkPlugin(true)) {
      alert("Error!");
      return;
    }

  	manifest = [
				{src:"sky.png", id:"bg"},
				{src:"title.png", id:"title"},
				{src:"startB.png", id:"startB"},
				{src:"player.png", id:"player"},
				{src:"ball.png", id:"ball"},
				{src:"win.png", id:"win"},
				{src:"lose.png", id:"lose"},
				{src:"playerScore.mp3|playerScore.ogg", id:"playerScore"},
				{src:"hit.mp3|hit.ogg", id:"hit"},
				{src:"wall.mp3|wall.ogg", id:"wall"}
			];



  	preloader = new PreloadJS();
  	preloader.installPlugin(SoundJS);
    preloader.onProgress = handleProgress;
    preloader.onComplete = handleComplete;
    preloader.onFileLoad = handleFileLoad;
    preloader.loadManifest(manifest);

	/* Ticker */
	
	Ticker.setFPS(30);
	Ticker.addListener(stage);
}

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
	startB.onPress = addGameView;

}

// Add Game View

function addGameView()
{
	// Destroy Menu
	
	stage.removeChild(TitleView);
	TitleView = null;
	
	// Add Game View
	
	player.x = 360 - 63.5;
	player.y = 640;
	ball.x = 240 - 15;
	ball.y = 160 - 15;
	
	// Score
	
	playerScore = new Text('0', 'bold 20px Arial', '#A3FF24');
	playerScore.x = 211;
	playerScore.y = 20;
	
	stage.addChild(playerScore, player, ball);
	stage.update();
	
	// Start Listener 
	
	bg.onPress = startGame;
}

// Start Game Function
function startGame(e)
{
	bg.onPress = null;
	stage.onMouseMove = movePaddle;
	
	Ticker.addListener(tkr, false);
	tkr.tick = update;
}

// Player Movement

function movePaddle(e)
{
	// Mouse Movement
	player.x = e.stageX;
}



/* Reset */

function reset()
{
	ball.x = 240 - 15;
	ball.y = 160 - 15;
	player.y = 640;
	
	stage.onMouseMove = null;
	Ticker.removeListener(tkr);
	bg.onPress = startGame;
}

// Update Function

function update()
{
	// Ball Movement 

	ball.x = ball.x + xSpeed;
	ball.y = ball.y + ySpeed;
	
	// Wall Collision 

	if((ball.y) < 0) { ySpeed = -ySpeed; SoundJS.play('wall'); };//Up
	if((ball.y + (30)) > 320) { ySpeed = -ySpeed; SoundJS.play('wall');};//down
	
	/* Player Score */
	
	if((ball.x + (30)) > 480)
	{
		xSpeed = -xSpeed;
		playerScore.text = parseInt(playerScore.text + 1);
		reset();
		SoundJS.play('playerScore');
	}
	
	/* Player collision */
	
	if(ball.x <= player.x + 22 && ball.x > player.x && ball.y >= player.y && ball.y < player.y + 75)
	{
		xSpeed *= -1;
		SoundJS.play('hit');
	}
	
	/* Stop Player from going out of canvas (NOT REALLY ANYMORE)*/
	
	if(player.y >= 640)
	{
		player.y = 640;
	}
	
	/* Check for Win */
	
	if(playerScore.text == '10')
	{
		alert('win');
	}
	
	/* Check for Game Over */
	
}

function alert(e)
{
	Ticker.removeListener(tkr);
	stage.onMouseMove = null;
	bg.onPress = null
	
	if(e == 'win')
	{
		win.x = 140;
		win.y = -90;
	
		stage.addChild(win);
		Tween.get(win).to({y: 115}, 300);
	}
	else
	{
		lose.x = 140;
		lose.y = -90;
	
		stage.addChild(lose);
		Tween.get(lose).to({y: 115}, 300);
	}
}
