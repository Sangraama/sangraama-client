<!--
function GraphicEngine(){

	this.clear = function() {
	  ctx.clearRect(0, 0, scanvas.WIDTH, scanvas.HEIGHT);
	}

	this.drawRotatedImage = function(image, player) {
	  ctx.save();
	  ctx.translate(player.dx, player.dy);
	  ctx.rotate(player.da * TO_RADIANS);
	  ctx.drawImage(image, -(image.width / 2), -(image.height / 2));
	  ctx.restore();
	}
	this.drawShootImage = function(image, bullet) {
	  ctx.save();
	  ctx.translate(bullet.dx, bullet.dy);
	  ctx.rotate(bullet.a * TO_RADIANS);
	  ctx.drawImage(image, -(image.width / 2), -(image.height / 2));
	  ctx.restore();
	}
	this.rect = function(x, y, w, h) {
	        ctx.beginPath();
	        ctx.rect(x, y, w, h);
	        ctx.closePath();
	        ctx.fill();
	        ctx.stroke();
	}
};
// -->