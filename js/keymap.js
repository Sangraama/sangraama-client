var prevKey = 0;

function doKeyDown(evt) {

  switch (evt.keyCode) {
    case 38:
      /* Up arrow was pressed */
      player.v_y = -1;
      player.v_a = 270;
      // if (D)
        console.log('up pressed');
      break;
    case 40:
      /* Down arrow was pressed */
      player.v_y = 1;
      player.v_a = 90;
      // if (D)
        console.log('down pressed');
      break;
    case 37:
      /* Left arrow was pressed */
      player.v_x = -1;
      player.v_a = 180;
      // if (D)
      // console.log('left pressed');
      break;
    case 39:
      /* Right arrow was pressed */
      player.v_x = 1;
      player.v_a = 0;
      // if (D)
      // console.log('right pressed');
      break;
    case 82:
      /* R was pressed */
      player.v_a += 1;
      break;
    case 76:
      /* L was pressed */
      player.v_a += (360 - 1);
      break;
    case 32:
      /* Space was pressed */
      if (D)
        console.log('Player shoot');
      player.s = 1;
      break;
    default:
      //console.log(evt.keyCode);
  }
  // if (prevKey != evt.keyCode) {
  // prevKey = evt.keyCode;
  updateServer();
  // }
}

function doKeyUp(evt) {

  switch (evt.keyCode) {
    case 38:
      /* Up arrow was released */
      player.v_y = 0;
      // player.v_a = 0;
      break;
    case 40:
      /* Down arrow was released */
      player.v_y = 0;
      // player.v_a = 0;
      break;
    case 37:
      /* Left arrow was released */
      player.v_x = 0;
      // player.v_a = 0;
      break;
    case 39:
      /* Right arrow was released */
      player.v_x = 0;
      // player.v_a = 0;
      break;
    case 82:
      /* R was released */
      player.v_a = player.v_a;
      break;
    case 32:
      /* Space was released */
      player.s = 0;
      break;
    case 76:
      /* L was released */
      player.v_a = player.v_a;
      break;
    default:
      //console.log(evt.keyCode);
  }
  updateServer();
//  prevKey = 0;
}

function doMouseDown(evt) {
  switch (evt.which) {
    case 1:
      if (D)
        console.log('Left mouse button pressed');
      break;
    case 2:
      player.v_y = 1;

      if (D)
        console.log('Middle mouse button pressed');
      break;
    case 3:
      if (D)
        console.log('Right mouse button pressed');
      break;
    default:
      if (D)
        console.log('You have a strange mouse');
  }
}

function doMouseUp(evt) {
  switch (evt.which) {
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
  }
}

window.addEventListener('keydown', doKeyDown, true);
window.addEventListener('keyup', doKeyUp, true);
window.addEventListener('mousedown', doMouseDown, true);
window.addEventListener('mouseup', doMouseUp, true);
//-->