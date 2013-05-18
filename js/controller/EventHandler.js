var prevCode = 0;
var msg = new function(){
		this.v_x = 0;
		this.v_y = 0;
}

$(document.documentElement).keydown(function(event) {
	console.log("Key Down");
	if (event.keyCode != prevCode) {
		// handle cursor keys
		if (event.keyCode == 37) {
			console.log("Left");
			msg.v_x = -1;
		} else if (event.keyCode == 39) {
			console.log("Right");
			msg.v_x = 1;
		} else if (event.keyCode == 40) {
			console.log("Down");
			msg.v_y = -1;
		} else if (event.keyCode == 38) {
			console.log("Up");
			msg.v_y = -1;
		}
		prevCode = event.keyCode;
		if(ws != null){
			ws.send($.toJSON(msg));
		}
	}
});

$(document.documentElement).keyup(function(event) {
	console.log("Key Up");
	//if (event.keyCode != prevCode) {
		// handle cursor keys
		if (event.keyCode == 37) {
			console.log("Left");
			msg.v_x = 0;
		} else if (event.keyCode == 39) {
			console.log("Right");
			msg.v_x = 0;
		} else if (event.keyCode == 40) {
			console.log("Down");
			msg.v_y = 0;
		} else if (event.keyCode == 38) {
			console.log("Up");
			msg.v_y = 0;
		}
		prevCode = 0;
		if(ws != null){
			ws.send($.toJSON(msg));
		}
	//}
});