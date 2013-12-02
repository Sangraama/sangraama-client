var prevKey = 0;
var D = true;

function doKeyDown(evt) {
    console.log('$'+prevKey+'#'+evt.keyCode)
  if (prevKey != evt.keyCode) {
    switch (evt.keyCode) {
      case 38:
        /* Up arrow was pressed */
        player.setV_y(-1);
        /*if (D)
        console.log('up pressed');*/
        break;
      case 40:
        /* Down arrow was pressed */
        player.setV_y(1);
        /* if (D)
        console.log('down pressed');*/
        break;
      case 37:
        /* Left arrow was pressed */
        player.setV_x(-1);
        // if (D)
        // console.log('left pressed');
        break;
      case 39:
        /* Right arrow was pressed */
        player.setV_x(1);
        // if (D)
        // console.log('right pressed');
        break;
      case 65:
        /* A was pressed */
        player.rotateR();
        break;
      case 68:
        /* D was pressed */
        player.rotateL();
        break;
      case 83:
        /* S was pressed */
        if (D)
          console.log('Player shoot');
        player.shoot();
        playShoot();
        break;
      case 13:
        sangraama.play();
        break;
      default:
        console.log(evt.keyCode);
    }
    prevKey = evt.keyCode;
    sangraama.triggerEvent();
  }
}

function doKeyUp(evt) {

  switch (evt.keyCode) {
    case 38:
      /* Up arrow was released */
      player.resetV_y();
      break;
    case 40:
      /* Down arrow was released */
      player.resetV_y();
      break;
    case 37:
      /* Left arrow was released */
      player.resetV_x();
      break;
    case 39:
      /* Right arrow was released */
      player.resetV_x();
      break;
    case 65:
      /* A was released */
      player.resetRotate();
      break;
    case 83:
      /* S was released */
      // Auto Reset
      break;
    case 68:
      /* D was released */
      player.resetRotate();
      break;
    default:
      //console.log(evt.keyCode);
  }
  sangraama.triggerEvent();
  prevKey = 0;
}

function doMouseDown(evt) {
  switch (evt.which) {
    case 1:
      if (D)
        console.log('Player x:' + player.getX() + ' y:' + player.getY() + ' Left mouse button pressed');
      break;
    case 2:
      if (D) {
        console.log('Player Virtual point x:' + aoihandler.getVirtualPoint().x_vp + ' y:' + aoihandler.getVirtualPoint().y_vp + ' AOI w:' + aoihandler.getAOI().aoi_w + ' h:' + aoihandler.getAOI().aoi_h);
        console.log('Corners are ' + ' LD x:' + (aoihandler.getVirtualPoint().x_vp - (aoihandler.getAOI().aoi_w / 2)) + ' y:' + (aoihandler.getVirtualPoint().y_vp - (aoihandler.getAOI().aoi_h / 2)) + ' LU x:' + (aoihandler.getVirtualPoint().x_vp - (aoihandler.getAOI().aoi_w / 2)) + ' y:' + (aoihandler.getVirtualPoint().y_vp + (aoihandler.getAOI().aoi_h / 2)) + ' RD x:' + (aoihandler.getVirtualPoint().x_vp + (aoihandler.getAOI().aoi_w / 2)) + ' y:' + (aoihandler.getVirtualPoint().y_vp - (aoihandler.getAOI().aoi_h / 2)) + ' RU x:' + (aoihandler.getVirtualPoint().x_vp + (aoihandler.getAOI().aoi_w / 2)) + ' y:' + (aoihandler.getVirtualPoint().y_vp + (aoihandler.getAOI().aoi_h / 2)));
      }
      break;
    case 3:
      if (D)
        console.log('Right clicked');
      break;
    default:
      if (D)
        console.log('You have a strange mouse');
  }
}

function doMouseUp(evt) {
  /*switch (evt.which) {
    case 1:
      if (D)
        console.log('Left mouse button released');
      break;
    case 2:
      if (D)
        console.log('Middle mouse button released');
      break;
    case 3:
      if (D)
        console.log('Right mouse button released');
      break;
    default:
      if (D)
        console.log('You have a strange mouse');
  }*/
}

function playShoot() {
  clickSound.play();
}
window.addEventListener('keydown', doKeyDown, true);
window.addEventListener('keyup', doKeyUp, true);
window.addEventListener('mousedown', doMouseDown, true);
window.addEventListener('mouseup', doMouseUp, true);
//-->