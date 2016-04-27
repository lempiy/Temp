function TiledMapClass(map) {
    this.map = map;
}

TiledMapClass.prototype.parseMapObject = function(obj) {
    var parsedMap = {
        'tileSets': [],

        'numXtiles': obj.width,
        'numYtiles': obj.height,

        'tileSize': {
            'x': obj.tilewidth,
            'y': obj.tileheight
        },

        'totalSize': {
            'x': obj.tilewidth * obj.width,
            'y': obj.tileheight *  obj.height
        }
    }
    parsedMap.loadCounter = 0;
    parsedMap.fullyLoaded = false;
    for (var i = 0; i < map.tilesets.length; i++) {
        var img = new Image();
        img.onload = function(){
            parsedMap.loadCounter++;
            if(parsedMap.loadCounter === map.tilesets.length) {
                parsedMap.fullyLoaded = true;
            }
        };
        img.src = './img/' + map.tilesets[i].image.replace(/^.*[\\\/]/, '');

        var tileSet = {
                "firstgid": map.tilesets[i].firstgid,
                "image": img,
                "imageheight": map.tilesets[i].imageheight,
                "imagewidth": map.tilesets[i].imagewidth,
                "name": map.tilesets[i].name,
                "numXTiles": Math.floor(map.tilesets[i].imagewidth / parsedMap.tileSize.x),
                "numYTiles": Math.floor(map.tilesets[i].imageheight / parsedMap.tileSize.y)
            };

        
        parsedMap.tileSets.push(tileSet);


    }
    return parsedMap;
}
TiledMapClass.prototype.saveMap = function() {
    this.parsedMap = this.parseMapObject(map);
}

TiledMapClass.prototype.getTilePacket = function(tileIndex) {

        var pkt = {
            "img": null,
            "px": 0,
            "py": 0
        };

        var tile = 0;
        for(tile = this.parsedMap.tileSets.length - 1; tile >= 0; tile--) {
            if(this.parsedMap.tileSets[tile].firstgid <= tileIndex) break;
        }

        pkt.img = this.parsedMap.tileSets[tile].image;

        var localIdx = tileIndex - this.parsedMap.tileSets[tile].firstgid;

        var lTileX = Math.floor(localIdx % this.parsedMap.tileSets[tile].numXTiles);
        var lTileY = Math.floor(localIdx / this.parsedMap.tileSets[tile].numXTiles);

        pkt.px = (lTileX * this.parsedMap.tileSize.x);
        pkt.py = (lTileY * this.parsedMap.tileSize.y);


        return pkt;
    }

TiledMapClass.prototype.draw = function(ctx) {
        
        if(!this.parsedMap.fullyLoaded) return;
        
        for(var i = 0; i < map.layers.length; i++) {

            if(map.layers[i].type!=='tilelayer') {

                continue;
            }
            var data = map.layers[i].data;

            for(var n = 0; n < data.length; n++) {
                if(data[n] > 0) {
                    var packetData = this.getTilePacket(data[n]);                 

                    var worldX = Math.floor(n % this.parsedMap.numXtiles) * this.parsedMap.tileSize.x;
                    var worldY = Math.floor(n / this.parsedMap.numXtiles) * this.parsedMap.tileSize.y;
                    ctx.drawImage(packetData.img, packetData.px, packetData.py, this.parsedMap.tileSize.x, this.parsedMap.tileSize.y, worldX, worldY, this.parsedMap.tileSize.x, this.parsedMap.tileSize.y);
                }
            }

        }    
        
}

var gMap = new TiledMapClass(map);
gMap.saveMap();