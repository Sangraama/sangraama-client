<!--

function aoihandler() {
	var tiles = new Array();

	var tile = {
		//tileId: '',
		wsIndex: 0, // websocket index that holds this sub-tile
		host: '', // host address
		h: 0, // height of the sub-tile
		w: 0, // width of the sub-tiles
		x: 0, // origin x coordination
		y: 0 // origin y coordination
	};
	var aoi = {
		aoi_w: 200,
		aoi_h: 200
	};
	this.init = function() {

	}
	// Check whether it is inside a subtile
	this.isSubTile = function(x, y) {
		var tile = _.find(tiles, function(val) {
			return (val.x <= x && x <= val.x + val.w && val.y <= y && y <= val.y + val.h) ? true : false;
		});
		if (tile != undefined) {
			return tile.wsIndex;
		} else {
			return -1;
		}
	}
	// Check whether current AIO is fulfill by server, otherwise send details about missing locations
	this.isFulfillAOI = function(x, y) {
		var unFil = new Array();
		// check left down corner
		if (this.isSubTile(x - aoi.aoi_w / 2, y - aoi.aoi_h / 2) < 0) {
			unFil = _.union(unFil, (function() {
				return _.toArray(arguments);
			})({
				x: x - aoi.aoi_w / 2,
				y: y - aoi.aoi_h / 2
			}));
		}
		// check left upper corner
		if (this.isSubTile(x - aoi.aoi_w / 2, y + aoi.aoi_h / 2) < 0) {
			unFil = _.union(unFil, (function() {
				return _.toArray(arguments);
			})({
				x: x - aoi.aoi_w / 2,
				y: y + aoi.aoi_h / 2
			}));
		}
		// check right lower corner
		if (this.isSubTile(x + aoi.aoi_w / 2, y - aoi.aoi_h / 2) < 0) {
			unFil = _.union(unFil, (function() {
				return _.toArray(arguments);
			})({
				x: x + aoi.aoi_w / 2,
				y: y - aoi.aoi_h / 2
			}));
		}
		// check right upper corner
		if (this.isSubTile(x + aoi.aoi_w / 2, y + aoi.aoi_h / 2) < 0) {
			unFil = _.union(unFil, (function() {
				return _.toArray(arguments);
			})({
				x: x + aoi.aoi_w / 2,
				y: y + aoi.aoi_h / 2
			}));
		}

		return unFil;
	}
	// Add set of new tiles
	this.addTiles = function(wsIndex, host, ts) {
		var newTiles = _.map(ts, function(num, key) {
			num.host = host;
			num.wsIndex = wsIndex;
			return num;
		});
		tiles = _.union(tiles, newTiles);
	}
	// Get tile details
	this.getTiles = function() {
		return tiles;
	}
	// Remove set of tiles from the web socket
	this.removeTiles = function(wsIndex) {
		tiles = _.reject(tiles, function(val) {
			return val.wsIndex == wsIndex;
		});
	}
};
// -->