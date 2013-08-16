var mapArray = new Array();
mapMinX = 0;
mapMinY = 0;
var mapMaxX = 0;
var mapMaxY = 0;
var pix32 = 32;
mapWidth = 0;
mapHeight = 0;
loadMap = function () {
    $.get('assert/map/worldMap.tmx',{},function(xml){
    $('layer', xml).each(function (h) {
        if ($(this).attr('name') == 'TileLayer') {
            mapWidth = parseInt($(this).attr('width'), 10);
            mapHeight = parseInt($(this).attr('height'), 10);
            mapMaxX = mapWidth*pix32;
            mapMaxY = mapHeight*pix32;
             console.log('mytest'+mapMaxX);  
        }
    });

    var imageWidth =80;
    var imageHeight = 50;
    var xCoordinate = 0;
    var yCoordinate = 0;
    var tileCount = 0;
    var imgX = 0;
    var imgRow = 0;
    var imgColumn = 0;
    var imgY = 0;
    var canvasX = 0;
    var canvasY = 0;
   
    console.log('start'+new Date().getTime());
    $('data', xml).each(function (i) {
        $('tile', this).each(function (j) {
            var imgId = $(this).attr('gid');
            mapArray[tileCount] = imgId;
            tileCount++;
        });
    });
});
   
}
drawMap = function(x,y){
    var screenHeight = canvas.getAttribute('height');
    var screenWidth = canvas.getAttribute('width');
    var width = screenWidth/2;
    var height = screenHeight/2;
    var xOffset = 0;
    var yOffset = 0;
    var currentTile = 0;
    var xLastOffset = 0;
    var yLastOffset = 0;
    var lastTile = 0;
    var xTilePosition = 0;
    var noOfXTiles = parseInt(screenWidth/pix32,10)+1;
    var xCoordinate = 0;
    var yCoordinate = 0;
    var canvasX = 0;
    var canvasY = 0;
    var tileCount = 1;
    
    if(((x-width) <= mapMinX) && ((x+width) < mapMaxX) && ((y-height) <= mapMinY) && ((y+height) < mapMaxY)){
        xOffset = 0;
        yOffset = 0;
        currentTile = yOffset*mapWidth + xOffset;
        xLastOffset = parseInt((screenWidth)/pix32,10);
        yLastOffset = parseInt((screenHeight)/pix32,10)-1;
        lastTile = yLastOffset*mapWidth + xLastOffset;
                
    }else if(((x-width) > mapMinX) && ((x+width) < mapMaxX) && ((y-height) <= mapMinY) && ((y+height) < mapMaxY)){
        xOffset = parseInt(((x-width)/pix32),10);
        yOffset = 0;
        currentTile = yOffset*mapWidth + xOffset;
        xLastOffset = xOffset + parseInt((screenWidth)/pix32,10);
        yLastOffset = yOffset + parseInt((screenHeight)/pix32,10);
        lastTile = yLastOffset*mapWidth + xLastOffset;
    }else if(((x-width) > mapMinX) && ((x+width) >= mapMaxX) && ((y-height) <= mapMinY) && ((y+height) < mapMaxY)){
        yOffset = 0;
        xLastOffset = mapWidth;
        yLastOffset = yOffset + parseInt((screenHeight)/pix32,10);
        xOffset = xLastOffset - parseInt(((screenWidth)/pix32),10);
        currentTile = yOffset*mapWidth + xOffset;
        lastTile = yLastOffset*mapWidth + xLastOffset;
    }else if(((x-width) <= mapMinX) && ((x+width) < mapMaxX) && ((y-height) > mapMinY) && ((y+height) < mapMaxY)){
        xOffset = 0;
        yOffset = parseInt(((y-height)/pix32),10);
        currentTile = yOffset*mapWidth + xOffset;
        xLastOffset = xOffset + parseInt((screenWidth)/pix32,10);
        yLastOffset = yOffset + parseInt((screenHeight)/pix32,10);
        lastTile = yLastOffset*mapWidth + xLastOffset;
    }else if(((x-width) > mapMinX) && ((x+width) < mapMaxX) && ((y-height) > mapMinY) && ((y+height) < mapMaxY)){
        xOffset = parseInt(((x-width)/pix32),10);
        yOffset = parseInt(((y-height)/pix32),10);
        currentTile = yOffset*mapWidth + xOffset;
        xLastOffset = xOffset + parseInt((screenWidth)/pix32,10);
        yLastOffset = yOffset + parseInt((screenHeight)/pix32,10);
        lastTile = yLastOffset*mapWidth + xLastOffset;
    }else if(((x-width) > mapMinX) && ((x+width) >= mapMaxX) && ((y-height) > mapMinY) && ((y+height) < mapMaxY)){
        yOffset = parseInt(((y-height)/pix32),10);
        xLastOffset = mapWidth;
        yLastOffset = yOffset + parseInt((screenHeight)/pix32,10);
        xOffset = xLastOffset - parseInt(((screenWidth)/pix32),10);
        currentTile = yOffset*mapWidth + xOffset;
        lastTile = yLastOffset*mapWidth + xLastOffset;
    }else if(((x-width) <= mapMinX) && ((x+width) < mapMaxX) && ((y-height) > mapMinY) && ((y+height) >= mapMaxY)){
        xOffset = 0;
        yLastOffset = mapHeight;
        yOffset = mapHeight - parseInt(((screenHeight)/pix32),10);
        currentTile = yOffset*mapWidth + xOffset;
        xLastOffset = xOffset + parseInt((screenWidth)/pix32,10);
        lastTile = yLastOffset*mapWidth + xLastOffset;
    }else if(((x-width) > mapMinX) && ((x+width) < mapMaxX) && ((y-height) > mapMinY) && ((y+height) >= mapMaxY)){
        xOffset = parseInt(((x-width)/pix32),10);
        yLastOffset = mapHeight;
        yOffset = mapHeight - parseInt(((screenHeight)/pix32),10);
        currentTile = yOffset*mapWidth + xOffset;
        xLastOffset = xOffset + parseInt((screenWidth)/pix32,10);
        lastTile = yLastOffset*mapWidth + xLastOffset;
    }else if(((x-width) > mapMinX) && ((x+width) >= mapMaxX) && ((y-height) > mapMinY) && ((y+height) >= mapMaxY)){
        xLastOffset = mapWidth;
        yLastOffset = mapHeight;
        xOffset = mapWidth - parseInt(((screenWidth)/pix32),10);
        yOffset = mapHeight - parseInt(((screenHeight)/pix32),10);
        currentTile = yOffset*mapWidth + xOffset;
        lastTile = yLastOffset*mapWidth + xLastOffset;
    }

    while(currentTile<=lastTile){
            canvasX = pix32 * xCoordinate;
            canvasY = pix32 * yCoordinate;
           if ((tileCount % noOfXTiles) == 0) {
                xCoordinate = 0;
               yCoordinate++;
            } else {
                xCoordinate++;
            }
            
            tileCount++;
            if(xTilePosition == noOfXTiles){
               xTilePosition = 0;
               yOffset++;
                currentTile = yOffset*mapWidth + xOffset;
            }   
              drawTile(currentTile,canvasX,canvasY);
              xTilePosition++;
              currentTile++;
    } 
}
   

drawTile = function(currentTile,canvasX,canvasY){

    var imageWidth =80;
    var imgId = mapArray[currentTile];
    var imgRow = 0;
    var imgColumn = 0;
    // var canvasX = 0;
    // var canvasY = 0;
    // canvasX = (currentTile%mapWidth)*pix32;
    // canvasY = parseInt(currentTile/mapWidth,10)*pix32;
    imgRow = parseInt(imgId / imageWidth, 10);
    
    if ((imgId % imageWidth) == 0) {
        imgColumn = imageWidth;
    } else {
        imgColumn = imgId % imageWidth;
    }
    imgX = (imgColumn - 1) * pix32;
    imgY = imgRow * pix32;
    // console.log(imgId+'ami'+canvasX+'t'+canvasY+'t'+imgX+'t'+imgY);
    ctx2.drawImage(mapImage, imgX, imgY,pix32,pix32,canvasX,canvasY,pix32,pix32);
}