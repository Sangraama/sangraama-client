var prevCode = 0;
var msg = new function(){
		this.v_x = 0;
		this.v_y = 0;
}
var D = false;

$(document.documentElement).keydown(function(event) {
	if(D) console.log("Key Down");
	if (event.keyCode != prevCode) {
		// handle cursor keys
		if (event.keyCode == 37) {
			if(D) console.log("Left");
			msg.v_x = -1;
		} else if (event.keyCode == 39) {
			if(D) console.log("Right");
			msg.v_x = 1;
		} else if (event.keyCode == 40) {
			if(D) console.log("Down");
			msg.v_y = -1;
		} else if (event.keyCode == 38) {
			if(D) console.log("Up");
			msg.v_y = -1;
		}
		prevCode = event.keyCode;
		if(ws != null){
			ws.send($.toJSON(msg));
		}
	}
});

$(document.documentElement).keyup(function(event) {
	if(D) console.log("Key Up");
	//if (event.keyCode != prevCode) {
		// handle cursor keys
		if (event.keyCode == 37) {
			if(D) console.log("Left");
			msg.v_x = 0;
		} else if (event.keyCode == 39) {
			if(D) console.log("Right");
			msg.v_x = 0;
		} else if (event.keyCode == 40) {
			if(D) console.log("Down");
			msg.v_y = 0;
		} else if (event.keyCode == 38) {
			if(D) console.log("Up");
			msg.v_y = 0;
		}
		prevCode = 0;
		if(ws != null){
			ws.send($.toJSON(msg));
		}
	//}
});