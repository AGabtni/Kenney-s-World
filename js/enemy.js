function Enemy(x,y) {

  this.x      = x;
  this.y      = y;
  this.width  = 128;
  this.height = 128;
  this.speed     = 6;
  this.gravity   = 2;
  this.dy        = 0;
  this.dx        = 0;
  this.alive = true;
  this.walkSpeed  = 2;

  var walkFrames;
  walkFrames    = [1 , 6];
  
  //Create a spritesheet from given png file a
  this.sheet     = new SpriteSheet("imgs/spritesheet_enemies.png", this.width, this.height);
  this.walkAnim  = new Animation(this.sheet, 10, 1,3 );
  this.deathAnim  = new Animation(this.sheet, 15, 2, 2);
  
  this.anim      = this.walkAnim;
  Vector.call(this, this.x, this.y, this.dx, this.dy);

  this.update = function() {

    if (!this.alive) {
      this.anim = this.deathAnim;
    }else{
      this.dx = this.walkSpeed;
      this.advance();
      this.anim = this.walkAnim;
    }
    this.anim.update();
  };

  this.death = function(){
    this.alive = false;
  }
  /**
   * Draw the enemy at it's current position
   */
  this.draw = function() {
    this.anim.draw(this.x, this.y);
  };


}
Enemy.prototype = Object.create(Vector.prototype);
