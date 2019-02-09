var player = (function(player) {


  // add properties directly to the player imported object
  player.width     = 128;
  player.height    = 256;
  player.speed     = 6;
  player.canDash   = true;
  // jumping
  player.gravity   = 2;
  player.dy        = 0;
  player.dx        = 0;
  player.jumpDy    = -20;
  player.dashDx    = 15;
  player.isFalling = false;
  player.isJumping = false;
  // spritesheets
  player.jumps = 0;


  var walkFrames ;
  walkFrames    = [50 , 58];
  //Create a spritesheet from given png file a
  player.sheet     = new SpriteSheet("imgs/spritesheet_players.png", player.width, player.height);
  player.walkAnim  = new Animation(player.sheet, 10, 0 , 0 ,walkFrames);
  player.jumpAnim  = new Animation(player.sheet, 15, 54, 54);
  player.fallAnim  = new Animation(player.sheet, 15, 35, 35);
  player.anim      = player.walkAnim;

  Vector.call(player, 0, 0, player.dx, player.dy);
  var jumpCounter = 0;  // how long the jump button can be pressed down
  /**
   * Update the player's position and animation
   */
  player.update = function() {
    // jump if not currently jumping or falling
    if (KEY_STATUS.space && player.dy === 0 && !player.isJumping ) {
      player.jumps++;
      player.dy = player.jumpDy;
      jumpCounter = 12;
      if(player.jumps >= 2){

        player.isJumping = true;
      }
    }
    // jump higher if the space bar is continually pressed
    if (KEY_STATUS.space && jumpCounter ) {
      player.dy = player.jumpDy;
      console.log("jumping");
    }

    //Press X to dash
    if(KEY_STATUS.x &&  player.canDash){

      player.canDash = false;

      
      player.dx = player.dashDx;
      var speed = player.speed;
      player.speed =player.speed * 3;

      var back_position_x = player.x;
      //back_position_x -=player.dashDx;


      this.advance();

      setTimeout(function(){ player.canDash = true }, 3000);
      

      //after 0.4 seconds player goes back to original x postion 
      setTimeout(function(){player.speed = speed *1.25 ;player.dx = (-player.dashDx) ; this.advance }, 600);

      //Stop at original position
      setTimeout(function(){player.speed =speed ;player.dx = 0 ; this.advance }, 1200);



      //loop to block
      
      
      
    }



    jumpCounter = Math.max(jumpCounter-1, 0);
    this.advance();
    // add gravity
    if (player.isFalling || player.isJumping) {
      player.dy += player.gravity;
    }
    // change animation if falling
    if (player.dy > 0) {
      player.anim = player.fallAnim;
    }
    // change animation is jumping
    else if (player.dy < 0) {
      player.anim = player.jumpAnim;
    }
    else {
      player.anim = player.walkAnim;
    }

    player.anim.update();
  };

  /**
   * Draw the player at it's current position
   */
  player.draw = function() {
    player.anim.draw(player.x, player.y);
  };

  /**
   * Reset the player's position
   */
  player.reset = function() {
    player.x = 64;
    player.y = 250;
  };

  return player;
})(Object.create(Vector.prototype));

/**
 * Keep track of the spacebar events
 */
var KEY_CODES = {
  32: "space",
  88: "x"
};
var KEY_STATUS = {};
for (var code in KEY_CODES) {
  if (KEY_CODES.hasOwnProperty(code)) {
     KEY_STATUS[KEY_CODES[code]] = false;
  }
}
document.onkeydown = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
};
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
};




