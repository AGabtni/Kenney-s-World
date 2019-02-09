Edit in JSFiddle
JavaScript
HTML
CSS
Result
(function() {
    var ctx = canvas.getContext('2d');

    /**
     * A complex button background.
     * @param {integer} x     - X coordinate of the button.
     * @param {integer} y     - Y coordinate of the button.
     * @param {integer} w     - Width of the button.
     * @param {integer} h     - Height of the button.
     * @param {object} colors - The colors of the button.
     * @param {string} colors.background - The background color.
     * @param {string} colors.top - Top particle color.
     * @param {string} colors.bottom - Bottom particle color.
     */
    function Button(x, y, w, h, colors) {
      var halfHeight = h / 2;

      ctx.save();

      // draw the button
      ctx.fillStyle = colors.background;

      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.rect(x, y, w, h);
      ctx.fill();
      ctx.clip();

      // light gradient
      var grad = ctx.createLinearGradient(
        x, y,
        x, y + halfHeight
      );
      grad.addColorStop(0, 'rgb(221,181,155)');
      grad.addColorStop(1, 'rgb(22,13,8)');
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(x, y, w, h);

      // draw the top half of the button
      ctx.fillStyle = colors.top;

      // draw the top and bottom particles
      for (var i = 0; i < h; i += halfHeight) {

        ctx.fillStyle = (i === 0 ? colors.top : colors.bottom);

        for (var j = 0; j < 50; j++) {
          // get random values for particle
          var partX = x + Math.random() * w;
          var partY = y + i + Math.random() * halfHeight;
          var width = Math.random() * 10;
          var height = Math.random() * 10;
          var rotation = Math.random() * 360;
          var alpha = Math.random();

          ctx.save();

          // rotate the canvas by 'rotation'
          ctx.translate(partX, partY);
          ctx.rotate(rotation * Math.PI / 180);
          ctx.translate(-partX, -partY);

          // set alpha transparency to 'alpha'
          ctx.globalAlpha = alpha;

          ctx.fillRect(partX, partY, width, height);

          ctx.restore();
        }
      }

      ctx.restore();
    }

    // draw the 3 states: default, hover, active
    var defaultButton = new Button(0, 0, 100, 50, {
      'background': '#1879BD',
      'top': '#43A4BD',
      'bottom': '#084D79'
    });

    var hoverButton = new Button(100, 0, 100, 50, {
      'background': '#093905',
      'top': '#88A964',
      'bottom': '#678834'
    });

    var activeButton = new Button(200, 0, 100, 50, {
      'background': '#A80000',
      'top': '#FCFC15',
      'bottom': '#EB7723'
    });

    // save the canvas as an image
    var dataURI = canvas.toDataURL();

    // create a new stylesheet to add the rule to
    var sheet = (function() {
      var style = document.createElement('style');

      document.head.appendChild(style);

      return style.sheet;
    })();

    // set a stylesheet rule to use the dataURI
    sheet.insertRule('.button { background-image: url(' + dataURI + '); }', 0);
})();