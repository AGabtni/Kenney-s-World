
var ctx = canvas.getContext("2d");
var platformWidth = 128;


//Create a sprite and draw at x,y position
function Sprite(x, y, type,spritesheet,frame) {
  this.x      = x;
  this.y      = y;
  this.width  = platformWidth;
  this.height = platformWidth;
  this.type   = type;
  Vector.call(this, x, y, 0, 0);
  /**
   * Update the Sprite's position by the player's speed
   */
  this.update = function() {
    this.dx = -player.speed;
    this.advance();
  };
  /**
   * Draw the sprite at it's current position
   */
  this.draw = function() {
    if(spritesheet == undefined){
      ctx.drawImage(assetLoader.imgs[this.type], this.x, this.y);
    }
    else{

       // get the row and col of the frame
      var row = Math.floor(frame / spritesheet.framesPerRow);
      var col = Math.floor(frame % spritesheet.framesPerRow);
      ctx.drawImage(
          spritesheet.image,
          col * spritesheet.frameWidth, row * spritesheet.frameHeight,
          spritesheet.frameWidth, spritesheet.frameHeight,
          this.x,this.y,
          spritesheet.frameWidth, spritesheet.frameHeight);

    }
  };
}
Sprite.prototype = Object.create(Vector.prototype);

//Function to create a spritehseet given the size of each frame
function SpriteSheet(path, frameWidth, frameHeight) {
    this.image = new Image();
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    // calculate the number of frames in a row after the image loads
    var self = this;
    this.image.onload = function() {
      self.framesPerRow = Math.floor(self.image.width / self.frameWidth);
    };


  this.image.src = path;
}

function Animation(spritesheet, frameSpeed, startFrame, endFrame,sequence) {
  var animationSequence = [];  // array holding the order of the animation
  var currentFrame = 0;        // the current frame to draw
  var counter = 0;             // keep track of frame rate
  // start and end range for frames

  if(sequence == undefined){

    for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++)
      animationSequence.push(frameNumber);

  }else if(sequence.length != 0) {
    sequence.forEach(function(frame){
      animationSequence.push(frame);
    });

  }else{
        console.log('No sequence');

  }
    
    //Update animation
  this.update = function() {
    
      // update to the next frame if it is time
      if (counter == (frameSpeed - 1))
          currentFrame = (currentFrame + 1) % animationSequence.length;
      
      // update the counter
      counter = (counter + 1) % frameSpeed;
    };

    /**
      * Draw the current frame
      * @param {integer} x - X position to draw
      * @param {integer} y - Y position to draw
    */
    this.draw = function(x, y) {
      // get the row and col of the frame
      var row = Math.floor(animationSequence[currentFrame] / spritesheet.framesPerRow);
      var col = Math.floor(animationSequence[currentFrame] % spritesheet.framesPerRow);
      ctx.drawImage(
          spritesheet.image,
          col * spritesheet.frameWidth, row * spritesheet.frameHeight,
          spritesheet.frameWidth, spritesheet.frameHeight,
          x, y,
          spritesheet.frameWidth, spritesheet.frameHeight);
    };
}