function MapLoader() {
  var mapArray;
  var canvas2;
  var ctx2;

  var mapMinX = 0;
  var mapMinY = 0;
  var mapMaxX = 0;
  var mapMaxY = 0;
  var pix32 = 32;
  var mapWidth = 0;
  var mapHeight = 0;
  var xAbs = -1;
  var yAbs = -1;
  var xDir = -1;
  

  this.getMinX = function() {
    return mapMinX;
  }
  this.getMinY = function() {
    return mapMinY;
  }
  this.getMaxX = function() {
    return mapMaxX;
  }
  this.getMaxY = function() {
    return mapMaxY;
  }
  this.init = function(width, height) {
    canvas2 = document.getElementById('layer1');
    ctx2 = canvas2.getContext("2d");
    canvas2.setAttribute('width', width);
    canvas2.setAttribute('height', height);

  }

  this.loadMap = function() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "assert/map/worldMap.tmx", false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;
    mapArray = xmlDoc.getElementsByTagName("tile");

    $.get('assert/map/worldMap.tmx', {}, function(xml) {
      $('layer', xml).each(function(h) {
        if ($(this).attr('name') == 'TileLayer') {
          mapWidth = parseInt($(this).attr('width'), 10);
          mapHeight = parseInt($(this).attr('height'), 10);
          mapMaxX = mapWidth * pix32;
          mapMaxY = mapHeight * pix32;
        }
      });

      var tileCount = 0;
      /*$('data', xml).each(function(i) {
        $('tile', xml).each(function(j) {
          console.log('$$$' + j);
          var imgId = $(this).attr('gid');
          mapArray[tileCount] = imgId;
          tileCount++;
        });
      });*/
    });
  }

  this.drawMap = function(x, y) {
    var screenHeight = canvas2.getAttribute('height');
    var screenWidth = canvas2.getAttribute('width');
    var width = screenWidth / 2;
    var height = screenHeight / 2;
    var xOffset = 0;
    var yOffset = 0;
    var currentTile = 0;
    var xLastOffset = 0;
    var yLastOffset = 0;
    var lastTile = 0;
    var xTilePosition = 0;
    var noOfXTiles = parseInt(screenWidth / pix32, 10);
    var noOfYTiles = parseInt(screenHeight / pix32, 10);
    var xCoordinate = 0;
    var yCoordinate = 0;
    var canvasX = 0;
    var canvasY = 0;
    var tileCount = 1;
    // if ((parseInt(x / screenWidth, 10) != xAbs) || (parseInt(y / screenHeight, 10) != yAbs)) {
    xAbs = parseInt(x / screenWidth, 10);
    yAbs = parseInt(y / screenHeight, 10);
    var widthOffset = parseInt(x % screenWidth, 10);
    var heightOffset = parseInt(y % screenHeight, 10);
    var origin = gEngine.getOriginOfCanvas();
    xOffset = parseInt(((origin.x) / pix32), 10);
    yOffset = parseInt(((origin.y) / pix32), 10);
    currentTile = yOffset * mapWidth + xOffset;
    xLastOffset = xOffset + noOfXTiles;
    yLastOffset = yOffset + noOfYTiles;
    lastTile = yLastOffset * mapWidth + xLastOffset;
    console.log('xOffset:' + xOffset + ' yOffset:' + yOffset + ' currentTile:' + currentTile + ' xLastOffset:' + xLastOffset +
      ' yLastOffset:' + yLastOffset + ' lastTile:' + lastTile);
    while (currentTile <= lastTile) {
      canvasX = pix32 * xCoordinate;
      canvasY = pix32 * yCoordinate;
      if ((tileCount % (noOfXTiles + 1)) == 0) {
        xCoordinate = 0;
        yCoordinate++;
      } else {
        xCoordinate++;
      }
      tileCount++;

      if (xTilePosition == (noOfXTiles + 1)) {
        xTilePosition = 0;
        yOffset++;
        currentTile = yOffset * mapWidth + xOffset;
      }

      this.drawTile(currentTile, canvasX, canvasY);

      xTilePosition++;
      currentTile++;
    }
    // }
  }

  this.drawTile = function(currentTile, canvasX, canvasY) {
    var imageWidth = 83;
    var imgId = mapArray[currentTile].getAttribute("gid");
    var imgRow = 0;
    var imgColumn = 0;
    imgRow = parseInt(imgId / imageWidth, 10);

    if ((imgId % imageWidth) == 0) {
      imgColumn = imageWidth;
    } else {
      imgColumn = imgId % imageWidth;
    }
    var imgX = (imgColumn - 1) * pix32;
    var imgY = imgRow * pix32;
    ctx2.drawImage(mapImage, imgX, imgY, pix32, pix32, canvasX, canvasY, pix32, pix32);

  }
}