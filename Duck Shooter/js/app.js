var canvas = document.createElement('canvas'),
ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.id = 'my_canvas';
    document.body.appendChild(canvas);

function loadLocalJSON(url) {
    var script = document.createElement("script");
    script.src = url;
    document.body.appendChild(script);
}
loadLocalJSON('./sheet.json');
var sprites = [];
function defSprite (name, x, y, w, h, cx, cy) {
    
    var spt = {
        "id": name,
        "x": x,
        "y": y,
        "w": w,
        "h": h,
        "cx": cx === null ? 0 : cx,
        "cy": cy === null ? 0 : cy
    };
    sprites.push(spt);
}

function parseAtlasDefinition (atlasJSON) {
        var atlas = atlasJSON;
        for(var pic in atlas.frames) {
            var sprite = atlas.frames[pic];
            var cx = -sprite.frame.w * 0.5;
            var cy = -sprite.frame.h * 0.5;
            defSprite(pic, sprite.frame.x, sprite.frame.y, sprite.frame.w, sprite.frame.h, cx, cy);
        }
        
    }
var index = 0;
function animate (){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    var spriteName = index + '';
    
    drawSprite(spriteName, 100, 100)
    index = (index + 1) % sprites.length;
}
var spritesheet = new Image();
    spritesheet.onload = onImageLoad;
    spritesheet.src = 'img/texture.png';
function onImageLoad() {
    parseAtlasDefinition(data);
    console.log('loaded')
    setInterval(function(){
        draw(ctx);
        streakReplay();
    }, 100);
    //setInterval(streakReplay, 100);

}


    

function getStats (name) {
        // For each sprite in the 'sprites' Array...
        for(var i = 0; i < sprites.length; i++) {
            
            // Check if the sprite's 'id' parameter
            // equals the passed in name...
            if(sprites[i].id === name) {
                // and return that sprite if it does.
                return sprites[i];
            }

        }

        // If we don't find the sprite, return null.
        return null;
    }

var streakReplay = (function(){
  var count = 0;
  return function(num){

    var spriteName = count + '';
    
    drawSprite(spriteName, 500, 300)
    count = (count + 1) % sprites.length;      
  }
})();

function drawSprite(spritename, posX, posY) {
    // Walk through all our spritesheets defined in
    // 'gSpriteSheets' and for each sheet...
    for(var sheetName in sprites) {

        // Use the getStats method of the spritesheet
        // to find if a sprite with name 'spritename'
        // exists in that sheet...
        var sheet = sprites[sheetName];
        var sprite = getStats(spritename);

        // If we find the appropriate sprite, call
        // '__drawSpriteInternal' with parameters as
        // described below. Otherwise, continue with
        // the loop...
        if(sprite === null) {
            continue;
        }

        __drawSpriteInternal(sprite, sheet, posX, posY);

        // Once we've called __drawSpriteInternal, we
        // assume there isn't another sprite of the
        // given 'spritename' that we want to draw,
        // so we return.
        // If you make this assumption, make sure
        // your design team doesn't make sprites with
        // the same name!
        return;
    }
}


function __drawSpriteInternal(spt, sheet, posX, posY) {
    if (spt === null || sheet === null) {
        return;
    }
    var hlf = {
        x: spt.cx,
        y: spt.cy
    };
    ctx.drawImage(spritesheet, spt.x, spt.y, spt.w, spt.h, posX + hlf.x, posY + hlf.y, spt.w, spt.h);
}

// MAP

function parseMapObject(obj) {
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
parseMapObject(map);
var parsedMap = parseMapObject(map);
function getTilePacket(tileIndex) {

        var pkt = {
            "img": null,
            "px": 0,
            "py": 0
        };

        var tile = 0;
        for(tile = parsedMap.tileSets.length - 1; tile >= 0; tile--) {
            if(parsedMap.tileSets[tile].firstgid <= tileIndex) break;
        }

        pkt.img = parsedMap.tileSets[tile].image;

        var localIdx = tileIndex - parsedMap.tileSets[tile].firstgid;

        var lTileX = Math.floor(localIdx % parsedMap.tileSets[tile].numXTiles);
        var lTileY = Math.floor(localIdx / parsedMap.tileSets[tile].numXTiles);

        pkt.px = (lTileX * parsedMap.tileSize.x);
        pkt.py = (lTileY * parsedMap.tileSize.y);


        return pkt;
    }

function draw(ctx) {
        
        if(!parsedMap.fullyLoaded) return;
        
        for(var i = 0; i < map.layers.length; i++) {

            if(map.layers[i].type!=='tilelayer') {

                continue;
            }
            var data = map.layers[i].data;

            for(var n = 0; n < data.length; n++) {
                if(data[n] > 0) {
                    var packetData = getTilePacket(data[n]);                 

                    var worldX = Math.floor(n % parsedMap.numXtiles) * parsedMap.tileSize.x;
                    var worldY = Math.floor(n / parsedMap.numXtiles) * parsedMap.tileSize.y;
                    ctx.drawImage(packetData.img, packetData.px, packetData.py, parsedMap.tileSize.x, parsedMap.tileSize.y, worldX, worldY, parsedMap.tileSize.x, parsedMap.tileSize.y);
                }
            }

        }
        
        
}
//gameIngine

function d1raw() {
    // Draw map. Note that we're passing a canvas context
    // of 'null' in. This would normally be our game context,
    // but we don't need to grade this here.
    draw(null);

    // Bucket entities by zIndex
    var fudgeVariance = 128;
    var zIndex_array = [];
    var entities_bucketed_by_zIndex = {};
    entities.forEach(function(entity) {
        //don't draw entities that are off screen
        if(entity.pos.x >= gMap.viewRect.x - fudgeVariance &&
           entity.pos.x < gMap.viewRect.x + gMap.viewRect.w + fudgeVariance &&
           entity.pos.y >= gMap.viewRect.y - fudgeVariance &&
           entity.pos.y < gMap.viewRect.y + gMap.viewRect.h + fudgeVariance) {
            if(zIndex_array.indexOf(entity.zIndex)===-1) {
                zIndex_array.push(entity.zIndex);
                entities_bucketed_by_zIndex[entity.zIndex] = [];
            }
            entities_bucketed_by_zIndex[entity.zIndex].push(entity);
            // Bucket the entities in the entities list by their zindex
            // property.
            // YOUR CODE HERE
        }
    });

    zIndex_array.sort(function(a,b){ 
        return a - b;
    });
    zIndex_array.forEach(function(zIndex){
        entities_bucketed_by_zIndex[zIndex].forEach(function(entity){
            entity.draw(fractionOfNextPhisicsUpdate)
        })
    });

    // Draw entities sorted by zIndex
        
};


// INPUT


//input.js

// ENTITIES


function Entity (posX, posY, sizeX, sizeY, z, sprite) {
    this.pos = {
        x: posX,
        y: posY
    };
    this.size = {
        x: sizeX,
        y: sizeY
    };
    this._killed = false;
    this.currSpriteName = sprite;
    this.zIndex = z;
}
Entity.prototype.update = function () {
    console.log('lol');
}
Entity.prototype.draw = function () {
    if(this.currSpriteName) {
        drawSprite(this.currSpriteName, this.pos.x.round() - (this.size.x/2), this.pos.y.round() - (this.size.y/2));
    }
}
Entity.prototype.init = function() { 

}
/////////////////////GAME ENGINE ///////////////////////////////////
var UPDATES_PER_SEC = 60;

var entities = [];
var factory = {};
var _defferedKill = [];

function se1tap() {
    gPhysicsEngine.create();

    gPhysicsEngine.addContactListener({
        PostSolve: function (bodyA, bodyB, impulse) {
            // TASK #1
            var dataA = bodyA ? bodyA.GetUserData() : null;
            var dataB = bodyB ? bodyB.GetUserData() : null;
            // Call the 'GetUserData' of both 'bodyA'
            // and 'bodyB'. This will return the 'userData'
            // field that we created earlier. Remember,
            // we put a pointer to the actual Entity object
            // inside 'userData' called 'ent', so we should
            // be able to use that entity here.
            //
            if(dataA!==null) {
                if(dataA.ent !== null && dataA.ent.onTouch) {
                    dataA.ent.onTouch(bodyB, null, impulse);
                }
            }
            if(dataB!==null) {
                if(dataB.ent !== null && dataB.ent.onTouch) {
                    dataB.ent.onTouch(bodyA, null, impulse);
                }
            }
            // To take advantage of this, we've created an
            // empty 'onTouch' function in each Entity. This
            // will take care of any game logic we want to
            // process when collisions occur. The 'onTouch'
            // function takes as input the other physics
            // body the Entity is colliding with, the point
            // of collision, and any impulse to impart on
            // the Entity due to the collision.
            //
            // For now, just call each Entity's 'onTouch'
            // method with the colliding physics body, a
            // null position, and the 'impulse' parameter
            // supplied to the 'PostSolve' contact listener.
            //
            // Later, we'll see the 'onTouch' method in action,
            // and fill in the 'onTouch' method of an entity
            // to actually perform game logic.
            //
            // YOUR CODE HERE
            
        }
    });
}

function spawnEntities(typename) { // gameEngine.prototype.spawnEntities //
        var ent = new (factory[typename])();

        entities.push(ent);

        return ent;

}

factory['Landmine'] = LandmineClass; //<- якийсь Конструктор


function up1date() {  // gameEngine.prototype.update //
    for(var i = 0; i < entities.length; i++) {
        var ent = entities[i];
        if(!ent._killed) {
            ent.update();
        } else {
            _defferedKill.push(ent);
        } 
    }
    for(var i = 0; i < _defferedKill.length; i++) {
        entities.erase(_defferedKill[i]);
    }
    _defferedKil = [];

    gPhysicsEngine.update();
}
/////////////////////////////////////////////////////
function LandmineClass (posX, posY, sizeX, sizeY, z, sprite) {
  Entity.call(this, posX, posY, sizeX, sizeY);
  this.lifetime = 100;
}
LandmineClass.prototype = Object.create(Entity.prototype);
LandmineClass.prototype.constructor = LandmineClass;

LandmineClass.prototype.subUpdate = function () {
        // TASK #1
        if(this.lifetime<=0) {
            this.kill();
            return;
        }
        this.lifetime -= 0.05;

        this.update();
        // Subtract 0.05 from lifetime each update call.
        // Once lifetime reaches 0, call 'this.kill' and
        // return.
        //
        // YOUR CODE HERE
}
LandmineClass.prototype.kill = function () {

        // This will remove the Landmine's physics
        // body. Note that we haven't written the
        // Physics Engine yet, so this won't work!
        // 
        // gPhysicsEngine.removeBodyAsObj(this.physBody);
        // this.physBody = null;

        // Tell the Game Engine to destroy me as an
        // entity. We've provided a blank removeEntity
        // method in GameEngineClass that we'll fill
        // in later.
        removeEntity(this);
}

//////////////////////////////////////////////////////////////

//PHYSICS
Vec2 = Box2D.Common.Math.b2Vec2;
BodyDef = Box2D.Dynamics.b2BodyDef;
Body = Box2D.Dynamics.b2Body;
FixtureDef = Box2D.Dynamics.b2FixtureDef;
Fixture = Box2D.Dynamics.b2Fixture;
World = Box2D.Dynamics.b2World;
MassData = Box2D.Collision.Shapes.b2MassData;
PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
CircleShape = Box2D.Collision.Shapes.b2CircleShape;
DebugDraw = Box2D.Dynamics.b2DebugDraw;
RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;


function PhysicsEngineClass() {
    this.world = null;
}
PhysicsEngineClass.prototype.create = function() {
    this.world = new World(new Vec2(0,0), false);
}
PhysicsEngineClass.prototype.update = function () {
    var start = Date.now();
    var PHYSICS_LOOP_HZ = 1.0 / 60.0; //частота

    // Step takes three parameters:
    //
    // A framerate at which to update physics
    // The number of velocity iterations to calculate
    // The number of position iterations to calculate
    //
    // The more iterations, the more accurate the calculations
    gPhysicsEngine.world.Step(
        PHYSICS_LOOP_HZ,
        10,
        10
    );
    this.world.ClearForces();

    return(Date.now() - start);
}
PhysicsEngineClass.prototype.registerBody = function (bodyDef) {
    var body = gPhysicsEngine.world.CreateBody(bodyDef);
    return body;
}
PhysicsEngineClass.prototype.addBody = function (entityDef) {
    // YOUR CODE HERE
    // Create a new BodyDef object
    var bodyDef;

    var id = entityDef.id;


    if(entityDef.type==='static') {
        bodyDef.type = Body.b2_staticBody;
    } else {
        bodyDef.type = Body.b2_dynamicBody;
    }
    // Specify the 'type' member of your
    // BodyDef object as Body.b2_staticBody
    // or Body.b2_dynamicBody based on the
    // 'type' member of the passed-in
    // entityDef object.
        bodyDef.position.x = entityDef.x;
        bodyDef.position.y = entityDef.y;
    // Set the position{x,y} member object
    // of your BodyDef object based on the
    // 'x' and 'y' members of the passed-in
    // entityDef object.
        if(entityDef.userData) {
            bodyDef.userData = entityDef.userData;
        }

    // call registerBody with your BodyDef
    // object to attach it to our world.
        var body = this.registerBody(bodyDef);
    // Create a new FixtureDef object
        var fixtureDef = new FixtureDef();

    if(entityDef.useBouncyFixture) {
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0;
        fixtureDef.restitution = 1.0;
        // Set your FixtureDef object's
        // 'density', 'friction', and
        // 'restitution' members to
        // 1.0, 0, and 1.0 respectively.
    }
        fixtureDef.shape = new PolygonShape();

    // Create a new PolygonShape object, set your
    // FixtureDef object's 'shape' member to this
    // PolygonShape.

        fixtureDef.shape.SetAsBox(entityDef.halfWidth, entityDef.halfHeight);

    // Set the FixtureDef object's shape to a box using
    // the shape's SetAsBox method, which takes half the
    // width and half the height of the box as parameters.
    // You should get these from the passed-in entityDef,
    // which has 'halfWidth' and 'halfHeight' properties
    // that specify this.

    // Call the CreateFixture method of your BodyDef
    // object with your FixtureDef object as a parameter
    // to attach the fixture to your BodyDef object.
        body.CreateFixture(fixtureDef);
        return body;    
    // Return your BodyDef object.
}

PhysicsEngineClass.prototype.removeBody = function (obj) {
    // YOUR CODE HERE
    // Call our world's DestroyBody method
    // with the passed-in 'obj' as a parameter.
    // This will remove obj from our world.
    this.world.DestroyBody(obj);
    
}
PhysicsEngineClass.prototype.addContactListener = function (callbacks) {
    var listener = new Box2D.Dynamics.b2ContactListener();

    if(callbacks.PostSolve) listener.PostSolve = function (contact,impulse) {
        callbacks.PostSolve(contact.getFixtureA().GetBody(),
                            contact.getFixtureB().GetBody(),
                            impulse.normalImpulses[0]);
    }
    this.world.setContactListener(listener);
}
var gPhysicsEngine = new PhysicsEngineClass();

/////////////// Weapon SUBCLASS //////
function WeaponInstanceClass (posX, posY, sizeX, sizeY, z, sprite) {
    Entity.call(posX, posY, sizeX, sizeY, z, sprite);
    this.damageMultiplier = 1.0;
}

WeaponInstanceClass.prototype = Object.create(Entity.prototype);
WeaponInstanceClass.prototype.constructor = WeaponInstanceClass;

WeaponInstanceClass.prototype.initW = function (x, y, settings) {
    this.init(x, y, settings);
}
factory['WeaponInstance'] = WeaponInstanceClass;
///////// Simple Projective sub sub class (of weapon) /////////

function SimpleProjectileClass (posX, posY, sizeX, sizeY, z, sprite) {
    WeaponInstanceClass.call(posX, posY, sizeX, sizeY, z, sprite);
    this.physBody = null;
    this.lifetime = 0;
}
SimpleProjectileClass.prototype = Object.create(WeaponInstanceClass.prototype);
SimpleProjectileClass.prototype.constructor = SimpleProjectileClass;

SimpleProjectileClass.prototype.initS = function (x, y, settings) {
    this.initW(x, y, settings);

    var startPos = settings.pos;

    this.dir = {
            x: settings.dir.x,
            y: settings.dir.y
        };

    this.lifetime = 2;

    // YOUR CODE HERE
    // Create our physics body in the
    // provided entityDef variable.
    // This should contain:
    //
    // a string 'id',
    // a starting 'x' and 'y' position based on
    // startPos, a 'halfHeight' and 'halfWidth'
    // of our box, and an integer 'damping' value.
    //
    // We'll be checking that 'x' and 'y' are set
    // correctly, but we'll just be checking for
    // the existence of the other properties.
    var entityDef = {
        id: 'SimpleProjectile' + guid,
        type: 'dynamic',
        x: startPos.x,
        y: startPos.y,
        halfHeight: 5*0.5,
        halfWidth: 5*0.5,
        damping: 0,
        // YOUR CODE HERE
        // fill the userData object with
        // a unique string 'id' and an
        // 'ent' that contains a pointer
        // to this simple projectile.
        userData: {
            'ent': 'wpnSimpleProjectile' + this,
            'id': guid         
        }
    };


    // Call our physics engine's addBody method
    // with the constructed entityDef.

    if(this.physBody!==null) {
        this.physBody.SetLinearVelocity(new Vec2(
            settings.dir.x * this.speed,
            settings.dir.y * this.speed
        ));
    }

    this.physBody = gPhysicsEngine.addBody(entityDef);
}
SimpleProjectileClass.prototype.updateS = function () {
    this.lifetime -= 0.05;
    if(this.lifetime <= 0) {
        this.kill();
        return;
    }

    // YOUR CODE HERE
    // Use the 'SetLinearVelocity' method of physBody to
    // reboot the projectile's velocity.
    //
    // The SetLinearVelocity method takes a Vec2 as a
    // parameter. Use this.dir and this.speed to calculate
    // what this Vec2 should be.

    if(this.physBody!==null) {
        this.physBody.SetLinearVelocity(new Vec2(
            this.dir.x * this.speed,
            this.dir.y * this.speed
            ));
        this.pos = this.physBody.GetPosition();
    }
    // YOUR CODE HERE
    // Set this simple projectile's pos using
    // the physBody's GetPosition method.

    this.update();
}
SimpleProjectileClass.prototype.onTouch = function (otherBody, point, impulse) {
    if(!this.physBody) return false;

    if(otherBody===null||!otherBody.GetUserData()) {
        return false;
    }

    var physOwner = otherBody.GetUserData().ent;

    //spawn impact visual

    if(this._impactFrameNames) {
        var pPos = this.physBody.GetPosition();
        var efct = gGameEngine.spawnEntities('InstancedEffect', pPos.x, pPos.y);
        efct.onInit({
            x: pPos.x,
            y: pPos.y
        }, {
            playOnce: true,
            similarName: this._impactFrameNames,
            uriToSound: this_impactSound
        });
        gGameEngine.dealDmg(this, physOwner, parseInt(this._dmgAmt * this.damage));
        this.markForDeath = true;

        return true;
    }
}


factory['SimpleProjectile'] = SimpleProjectileClass;


/////////////// ENTITY SUB CLASS //////////////////
function EnergyCanisterClass(posX, posY, sizeX, sizeY, z, sprite) {
    Entity.call(posX, posY, sizeX, sizeY, z, sprite);
    this.physBody = null;
    this._killed = false;
}
EnergyCanisterClass.prototype = Object.create(Entity.prototype);
EnergyCanisterClass.prototype.constructor = EnergyCanisterClass;


EnergyCanisterClass.prototype.init = function (x, y, settings) {
    this.parent(x, y, settings);
    
    var startPos = {
        x: x,
        y: y
    };

    // Create our physics body;
    var entityDef = {
        id: "EnergyCanister",
        type: 'static',
        x: startPos.x,
        y: startPos.y,
        halfHeight: 18 * 0.5,
        halfWidth: 19 * 0.5,
        damping: 0,
        angle: 0,
        categories: ['projectile'],
        collidesWith: ['player'],
        userData: {
            "id": "EnergyCanister",
            "ent": this
        }
    };

    this.physBody = gPhysicsEngine.addBody(entityDef);
    this.physBody.SetLinearVelocity(new Vec2(0, 0));
}

    //-----------------------------------------
EnergyCanisterClass.prototype.kill = function () {
    // Remove my physics body
    gPhysicsEngine.removeBody(this.physBody);
    this.physBody = null;

    // Destroy me as an entity
    this._killed = true;
},

    //-----------------------------------------
EnergyCanisterClass.prototype.onTouch = function (otherBody, point, impulse) {
    if(!this.physBody) return false;
    if(!otherBody.GetUserData()) return false;

    var physOwner = otherBody.GetUserData().ent;
    

    if(physOwner !== null) {
        if(physOwner._killed) return false;

        // Increase the 'energy' property of 'physOwner' by
        // 10 when it touches this EnergyCanister.
        physOwner.energy += 10;
        // YOUR CODE HERE
        

        this.markForDeath = true;
    }

    return true;
}



factory['EnergyCanister'] = EnergyCanisterClass;










