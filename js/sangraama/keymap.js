var prevKey = 0;

function doKeyDown(evt) {

  switch (evt.keyCode) {
    case 38:
      /* Up arrow was pressed */
      player.v_y = -1;
      player.a = 270;
      /*if (D)
        console.log('up pressed');*/
      break;
    case 40:
      /* Down arrow was pressed */
      player.v_y = 1;
      player.a = 90;
      /* if (D)
        console.log('down pressed');*/
      break;
    case 37:
      /* Left arrow was pressed */
      player.v_x = -1;
      player.a = 180;
      // if (D)
      // console.log('left pressed');
      break;
    case 39:
      /* Right arrow was pressed */
      player.v_x = 1;
      player.a = 0;
      // if (D)
      // console.log('right pressed');
      break;
    case 82:
      /* R was pressed */
      player.da = 1;
      break;
    case 76:
      /* L was pressed */
      player.da = -1;
      break;
    case 32:
      /* Space was pressed */
      if (D)
        console.log('Player shoot');
      player.s = 1;
      playShoot();
      break;
    default:
      //console.log(evt.keyCode);
  }
  if (prevKey != evt.keyCode) {
    prevKey = evt.keyCode;
    updateServer();
  }
}

function doKeyUp(evt) {

  switch (evt.keyCode) {
    case 38:
      /* Up arrow was released */
      player.v_y = 0;
      // player.a = 0;
      break;
    case 40:
      /* Down arrow was released */
      player.v_y = 0;
      // player.a = 0;
      break;
    case 37:
      /* Left arrow was released */
      player.v_x = 0;
      // player.a = 0;
      break;
    case 39:
      /* Right arrow was released */
      player.v_x = 0;
      // player.a = 0;
      break;
    case 82:
      /* R was released */
      player.da = 0;
      break;
    case 32:
      /* Space was released */
      player.s = 0;
      break;
    case 76:
      /* L was released */
      player.da = 0;
      break;
    default:
      //console.log(evt.keyCode);
  }
  updateServer();
  prevKey = 0;
}

function doMouseDown(evt) {
  switch (evt.which) {
    case 1:
      if (D)
        console.log('Player x:' + player.x + ' y:' + player.y + ' Left mouse button pressed');
      break;
    case 2:
      if (D){
        console.log('Player Virtual point x:' + aoihandler.getVirtualPoint().x_vp + ' y:' + aoihandler.getVirtualPoint().y_vp
          +' AOI w:' + aoihandler.getAOI().aoi_w + ' h:' + aoihandler.getAOI().aoi_h);
        console.log('Corners are '
          +' LD x:' + (aoihandler.getVirtualPoint().x_vp - (aoihandler.getAOI().aoi_w / 2)) + ' y:' + (aoihandler.getVirtualPoint().y_vp - (aoihandler.getAOI().aoi_h / 2))
          +' LU x:' + (aoihandler.getVirtualPoint().x_vp - (aoihandler.getAOI().aoi_w / 2)) + ' y:' + (aoihandler.getVirtualPoint().y_vp + (aoihandler.getAOI().aoi_h / 2))
          +' RD x:' + (aoihandler.getVirtualPoint().x_vp + (aoihandler.getAOI().aoi_w / 2)) + ' y:' + (aoihandler.getVirtualPoint().y_vp - (aoihandler.getAOI().aoi_h / 2))
          +' RU x:' + (aoihandler.getVirtualPoint().x_vp + (aoihandler.getAOI().aoi_w / 2)) + ' y:' + (aoihandler.getVirtualPoint().y_vp + (aoihandler.getAOI().aoi_h / 2)));
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