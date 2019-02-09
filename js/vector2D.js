/**
 * A vector for 2d space.
 * @param {integer} x - Center x coordinate.
 * @param {integer} y - Center y coordinate.
 * @param {integer} dx - Change in x.
 * @param {integer} dy - Change in y.
 */

//Asset loader module :
  var assetLoader = (function() {
    
    this.imgs         ={
      'sky'            : 'imgs/sky.png',
      'bckg'           : 'imgs/blue_land.png',
      'frtg'           : 'imgs/colored_grass_1280.png',
      'grass'          : 'imgs/grass.png',
      'avatar'         : 'imgs/spritesheet_players.png',
      'enemies'        :  'imgs/spritesheet_enemies.png',
      'items'          :  'imgs/spritesheet_items.png',
      'tiles'          :  'imgs/spritesheet_tiles.png',
      'platforms'      :  'imgs/spritesheet_ground.png',
      'hud'            :  'imgs/spritesheet_hud.png',
      //TO REMOVE :
      'spikes'         :  'imgs/spikes.png',
      'slime'          :  'imgs/slime.png',
      'water'          :  'imgs/water.png'
      
    };

    var assetsLoaded = 0; //number of loaded assets         
    var numImgs    = Object.keys(this.imgs).length; //total number of png assets
    this.totalAssest = numImgs;             //total number of assets

    //Function to ensure if assets are loaded 

    function assetLoaded(dic, name){
      //exclude loaded assets
      if(this[dic][name].status !== "loading"){
        return;
      }
      this[dic][name].status = "loaded";
      assetsLoaded++;

      if (assetsLoaded === this.totalAssest && typeof this.finished === "function") {
          this.finished();
      }
    }

    this.downloadAll = function() {
      var _this = this;
      var src;

      //load images
      for(var img in this.imgs){
        if(this.imgs.hasOwnProperty(img)) {
          src = this.imgs[img];

          //event binding
          (function(_this, img) {
            _this.imgs[img] = new Image();
                _this.imgs[img].status = "loading";
                _this.imgs[img].name = img;
                _this.imgs[img].onload = function() { assetLoaded.call(_this, "imgs", img) };
                _this.imgs[img].src = src;
          })(_this, img);
        }
      }
    }


  return {
      imgs: this.imgs,
      totalAssest : this.totalAssest,
      downloadAll : this.downloadAll
  };
})(); 
function Vector(x, y, dx, dy) {
  // position
  this.x = x || 0;
  this.y = y || 0;
  // direction
  this.dx = dx || 0;
  this.dy = dy || 0;
}
/**
 * Advance the vectors position by dx,dy
 */
Vector.prototype.advance = function() {
  this.x += this.dx;
  this.y += this.dy;
};
/**
 * Get the minimum distance between two vectors
 * @param {Vector}
 * @return minDist
 */
Vector.prototype.minDist = function(vec) {
  var minDist = Infinity;
  var max     = Math.max( Math.abs(this.dx), Math.abs(this.dy),
                          Math.abs(vec.dx ), Math.abs(vec.dy ) );
  var slice   = 1 / max;
  var x, y, distSquared;
  // get the middle of each vector
  var vec1 = {}, vec2 = {};
  vec1.x = this.x + this.width/2;
  vec1.y = this.y + this.height/2;
  vec2.x = vec.x + vec.width/2;
  vec2.y = vec.y + vec.height/2;
  for (var percent = 0; percent < 1; percent += slice) {
    x = (vec1.x + this.dx * percent) - (vec2.x + vec.dx * percent);
    y = (vec1.y + this.dy * percent) - (vec2.y + vec.dy * percent);
    distSquared = x * x + y * y;

    minDist = Math.min(minDist, distSquared);
  }

  return Math.sqrt(minDist);
};


function alertOne(num){

      console.log(num);


}