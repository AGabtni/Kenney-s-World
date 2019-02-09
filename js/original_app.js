//Immediately invoked function expression


(function ($) {
  

  /**
   * Request Animation Polyfill
   */
  var requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback, element){
            window.setTimeout(callback, 1000 / 60);
          };
})();
  // define variables
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var score, stop, ticker;
  var ground = [], items = [] ,water = [], enemies = [], environment = [];

  //Platform variables :

  var platformHeight, platformLength, gapLength;
  var platformWidth = 128;
  var platformBase = canvas.height - platformWidth; // top line of platform position relative to bot canvas
  var platformSpace = 128;
  
  //Create spritesheets :
  var platforms_sheet     = new SpriteSheet("imgs/spritesheet_ground.png", 128, 128);
  var enemies_sheet       = new SpriteSheet("imgs/spritesheet_enemies.png", 128, 128);
  var items_sheet         = new SpriteSheet("imgs/spritesheet_items.png", 128,128);
  var tiles_sheet         = new SpriteSheet("imgs/spritesheet_tiles.png", 128, 128);


  //Generate random number
  function rand(low,high){
    return Math.floor(Math.random() * (high-low + 1)+low);
  }

  //interval variation lock
  function bound(num, low, high)  {

    return Math.max( Math.min(num, high), low);

  }
  /**
 * Get the type of a platform based on platform height
 * @return Type of platform
 */
 function getSpriteSheet() {
    var sheet;
    switch (platformHeight) {
      case 0:
      case 1:
        sheet = platforms_sheet;
        break;
      case 2:
        sheet = platforms_sheet;
        break;
      case 3:
        sheet = tiles_sheet;
        break;
      case 4:
        sheet = tiles_sheet;
        break;
    }
    if (platformLength === 1 && platformHeight < 3 && rand(0, 3) === 0) {
      sheet = platforms_sheet;
    }

    return sheet;
  }

  function getFrameNumber() {
    var frame;
    switch (platformHeight) {
      case 0:
      case 1:
        frame = 42;
        break;
      case 2:
        frame = 48;
        break;
      case 3:
        frame = 4;
        break;
      case 4:
        frame = Math.random() > 0.5 ? 0 : 8;
        break;
    }
    if (platformLength === 1 && platformHeight < 3 && rand(0, 3) === 0) {
      frame = 34;
    }

    return frame;
  }


  //update position of player and draw

  function updatePlayer() {
    player.update();
    player.draw();

    // game over
    if (player.y + player.height >= canvas.height) {
      gameOver();
    }
  }

  function spawnEnvironmentSprites() {
    if (score > 40 && rand(0, 20) === 0 && platformHeight < 3) {
      if (Math.random() > 0.5) {
        environment.push(new Sprite(
          canvas.width + platformWidth % player.speed,
          platformBase - platformHeight * platformSpace - platformWidth,
          null,tiles_sheet,10
        ));
      }
      else if (platformLength > 2) {
        environment.push(new Sprite(
          canvas.width + platformWidth % player.speed,
          platformBase - platformHeight * platformSpace - platformWidth,
          null, tiles_sheet,  33
        ));
        environment.push(new Sprite(
          canvas.width + platformWidth % player.speed + platformWidth,
          platformBase - platformHeight * platformSpace - platformWidth,
          null,tiles_sheet, 42
        ));
      }
    }
  }

    //update and draw water position
  function updateEnvironment() {
    // animate environment
    for (var i = 0; i < environment.length; i++) {
      environment[i].update();
      environment[i].draw();
    }

    // remove environment that have gone off screen
    if (environment[0] && environment[0].x < -platformWidth) {
      environment.splice(0, 1);
    }
  }


  //update all ground position and draw:
  //Check for collision with player too
  function updateGround(){

    //animate ground :
    player.isFalling = true;
    player.isGrounded = false;
    for(var i= 0 ; i<ground.length; i++)  {

      ground[i].update();
      ground[i].draw();
    

      //landing player on top of platform
      var angle;
      if (player.minDist(ground[i]) <= player.height/2 + platformWidth/2 &&
          (angle = Math.atan2(player.y - ground[i].y, player.x - ground[i].x) * 180/Math.PI) > -130 &&
          angle < -50) {
        player.isJumping = false;
        player.jumps=0;
        player.isFalling = false;
        player.isGrounded = true;
        player.y = ground[i].y - player.height + 5;
        player.dy = 0;
      }
    }

    //remove off screen ground : 
    if (ground[0] && ground[0].x < -platformWidth) {
      ground.splice(0, 1);
    }
  }




  //Update the water position and draw :
  //object pool water sprites

  function updateWater() {
    // animate water
    for (var i = 0; i < water.length; i++) {
      water[i].update();
      water[i].draw();
    }

    // remove water that has gone off screen
    if (water[0] && water[0].x < -platformWidth) {
      var w = water.splice(0, 1)[0];
      w.x = water[water.length-1].x + platformWidth;
      water.push(w);
    }
  }



  function spawnEnemySprites() {
    if (score > 10 && Math.random() > 0.4 && enemies.length < 3 && platformLength > 5 &&
        (enemies.length ? canvas.width - enemies[enemies.length-1].x >= platformWidth * 3 ||
         canvas.width - enemies[enemies.length-1].x < platformWidth : true)) {
        enemies.push(new Enemy(
        canvas.width + platformWidth % player.speed,
        platformBase - platformHeight * platformSpace - platformWidth
      ));
    }
  }

  //Update all enemies position and draw :
  function updateEnemies(){

    //animate enemies :
    for(var i=0; i<enemies.length;i++){
      enemies[i].update();
      enemies[i].draw();
      //player ran into enemy
      if(player.minDist(enemies[i]) <= player.width - platformWidth/2){
        console.log("Killed by enemies");
        gameOver();
      }
    }

    //remove enemies gone off screen :
    if (enemies[0] && enemies[0].x < -platformWidth) {
      
      enemies.splice(0 ,1);
    }
  }

  //Spawn new sprites off screen
  function spawnSprites() {

    score++;
 
    //gap between platforms :
    if(gapLength > 0 ){

      gapLength -=1;
    }//Create ground
    else if(platformLength > 0 ){

      var sheet = getSpriteSheet();
      var frame = getFrameNumber();

      ground.push(new Sprite(
        canvas.width + platformWidth % player.speed,
        platformBase - platformHeight * platformSpace,
        null, sheet, frame
      ));
      platformLength -=1;

      //add random environment sprites
      spawnEnvironmentSprites();


      //add random enemies
      spawnEnemySprites();


      }
    else{

      //increase gap length every speed increase of 4
      gapLength = rand(player.speed - 4,player.speed-2);

      //only allow a ground to increase by 1 
      platformHeight = bound(rand(0, platformHeight + rand(0, 2)), 0 , 4);
      platformLength = rand(Math.floor(player.speed/2), player.speed * 4);

    }
  }

  //

 

  assetLoader.finished = function(){
	mainMenu();
}


//Create parallax background
var background = (function() {
	  
	var sky   = {};
	var bckg = {};
	var frtg = {};
	/**
	* Draw the backgrounds to the screen at different speeds
	*/
	this.draw = function() {

	    // Pan background
	    sky.x -= sky.speed;
	    //bckg.x -= bckg.speed;
	    frtg.x -= frtg.speed;
	    // draw images side by side to loop
	    

	    //ctx.drawImage(assetLoader.imgs.bckg, bckg.x, bckg.y);
	    //ctx.drawImage(assetLoader.imgs.bckg, bckg.x + canvas.width, bckg.y);
	    
	    ctx.drawImage(assetLoader.imgs.frtg, frtg.x, frtg.y);
	    ctx.drawImage(assetLoader.imgs.frtg, frtg.x + canvas.width, frtg.y);

      ctx.drawImage(assetLoader.imgs.sky, sky.x, sky.y);
      ctx.drawImage(assetLoader.imgs.sky, sky.x + canvas.width, sky.y);
	    
	    // If the image scrolled off the screen, reset
	    if (sky.x + assetLoader.imgs.sky.width <= 0)
	      sky.x = 0;
	    //if (bckg.x + assetLoader.imgs.bckg.width <= 0)
	    //  bckg.x = 0;
	    if (frtg.x + assetLoader.imgs.frtg.width <= 0)
	      frtg.x = 0;
  	};
  	/**
   	* Reset background to zero
   	*/
	this.reset = function()  {
	    sky.x = 0;
	    sky.y = 0;
	    sky.speed = 0.2;
	    //bckg.x = 0;
	    //bckg.y = 0;
	    //bckg.speed = 0.4;
	    frtg.x = 0;
	    frtg.y = 0;
	    frtg.speed = 0.6;
	}
	
	return {
	    draw: this.draw,
	    reset: this.reset
	};
})();

function gameOver() {
  stop = true;
  $('#HUD').hide();
  $('#finalScore').html(score);
  $('#game-over').show();
  //assetLoader.sounds.bg.pause();
  //assetLoader.sounds.gameOver.currentTime = 0;
  //assetLoader.sounds.gameOver.play();
}





/*afunction startGame() {
 
  for (i = 0, length = Math.floor(canvas.width / platformWidth) + 1; i < length; i++) {
    ground[i] = {"x": i * platformWidth, "y": platformHeight};
  }


  player.reset();


  background.reset();
  animate();
}*/

function startGame() {
  //document.getElementById('game-over').style.display = 'none';
  ground = [];
  water = [];
  environment = [];
  enemies = [];
  player.reset();
  ticker = 0;
  stop = false;
  score = 0;
  platformHeight = 2;
  platformLength = 15;
  gapLength = 0;

  console.log(player.speed);
  ctx.font = '32px Kenny Future, sans-serif';

  for (var i = 0; i < 30; i++) {
    ground.push(new Sprite(i * (platformWidth-3), platformBase - platformHeight * platformSpace, null, platforms_sheet, 9));
  }

  for (i = 0; i < canvas.width / 32 + 2; i++) {
    water.push(new Sprite(i * platformWidth, platformBase, null, tiles_sheet, 1));
  }

  background.reset();

  animate();

  //assetLoader.sounds.gameOver.pause();
  //assetLoader.sounds.bg.currentTime = 0;
  //assetLoader.sounds.bg.loop = true;
  //assetLoader.sounds.bg.play();
}


/**
 * Game loop
 */
function animate() {
  /*requestAnimFrame( animate );
  background.draw();
  for (i = 0; i < ground.length; i++) {
    ground[i].x -= player.speed;
    ctx.drawImage(assetLoader.imgs.grass, ground[i].x, ground[i].y);
  }
  if (ground[0].x <= -platformWidth) {
    ground.shift();
    ground.push({"x": ground[ground.length-1].x + platformWidth, "y": platformHeight});
  }
  player.anim.update();
  player.anim.draw(64, 260);
}*/

  $('#score').html(score);
  if(!stop){
    requestAnimFrame(animate);

    
    ctx.clearRect(0,0,canvas.width,canvas.height);

  

    background.draw();

    updateWater();
    updateEnvironment();
    updatePlayer();
    updateGround();
    updateEnemies();


    // draw the score
    //ctx.fillText('Score: ' + score + 'm', canvas.width - 140, 30);

    // spawn a new Sprite
    if (ticker % Math.floor(platformWidth / player.speed) === 0) {
      spawnSprites();
    }

    // increase player speed only when player is jumping
    if (ticker > (Math.floor(platformWidth / player.speed) * player.speed * 20) && player.dy !== 0) {
      player.speed = bound(++player.speed, 0, 15);
      player.walkAnim.frameSpeed = Math.floor(platformWidth / player.speed) - 1;

      // reset ticker
      ticker = 0;

      // spawn a platform to fill in gap created by increasing player speed
      if (gapLength === 0) {
        var sheet = getSpriteSheet();
        var frame = getFrameNumber();
        ground.push(new Sprite(
          canvas.width + platformWidth % player.speed,
          platformBase - platformHeight * platformSpace,
          null,sheet ,frame
        ));
        platformLength--;
      } 
    }

    ticker++;
  }
}

//CLICK HANDLERS
$('.play').click(function() {
  $('#menu').hide();
  startGame();
});

$('.pause').click(function() {
    stop = true;
    $('#HUD').hide();
    $('#pause-screen').show();
});

$('.back').click(function() {
    stop = false;

    $('#pause-screen').hide();
    $('#HUD').show();
    requestAnimFrame(animate);

});

$('.home').click(function() {
  $('#pause-screen').hide();
  $('#game-over').hide();
  $('#HUD').show();
  $('#menu').show();

});

$('.restart').click(function() {
  $('#pause-screen').hide();
  $('#game-over').hide();
  $('#HUD').show();
  startGame();
});




function mainMenu() {
  $('#main').show();
  $('#menu').addClass('main');
}


assetLoader.downloadAll();

})(jQuery);

