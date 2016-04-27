var canvas = document.createElement('canvas'),
ctx = canvas.getContext('2d');

    canvas.width = 1280;
    canvas.height = 576;
    canvas.id = 'my_canvas';
    document.body.appendChild(canvas);


setInterval(function(){
        gMap.draw(ctx);
        drawSprite('0', 350, 100);
    }, 100);

gGameEngine.setup();
//-----------------------------------------
// External-facing function for drawing sprites based
// on the sprite name (ie. "chaingun.png", and the
// position on the canvas to draw to.
function drawSprite(spritename, posX, posY) {
    // Walk through all our spritesheets defined in
    // 'gSpriteSheets' and for each sheet...
    for(var sheetName in gSpriteSheets) {

        // Use the getStats method of the spritesheet
        // to find if a sprite with name 'spritename'
        // exists in that sheet...
        var sheet = gSpriteSheets[sheetName];
        var sprite = sheet.getStats(spritename);

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

//-----------------------------------------
// External-facing function for drawing sprites based
// on the sprite object stored in the 'sprites Array,
// the 'SpriteSheetClass' object stored in the
// 'gSpriteSheets' dictionary, and the position on
// canvas to draw to.
function __drawSpriteInternal(spt, sheet, posX, posY) {
    // First, check if the sprite or sheet objects are
    // null.
    if (spt === null || sheet === null) {
        return;
    }

    // Call the drawImage method of our canvas context
    // using the full drawImage API. drawImage takes,
    // in order:
    //
    // 1) the Image object to draw, this is our entire
    //    spritesheet.
    //
    // 2) the x-coordinate we are drawing from in the
    //    spritesheet.
    //
    // 3) the y-coordinate we are drawing from in the
    //    spritesheet.
    //
    // 4) the width of the sprite we are drawing from
    //    our spritesheet.
    //
    // 5) the height of the sprite we are drawing from
    //    our spritesheet.
    //
    // 6) the x-coordinate we are drawing to in our
    //    canvas.
    //
    // 7) the y-coordinate we are drawing to in our
    //    canvas.
    //
    // 8) the width we are drawing in our canvas. This
    //    is in case we want to scale the image we are
    //    drawing to the canvas. In our case, we don't.
    //
    // 9) the height we are drawing in our canvas. This
    //    is in case we want to scale the image we are
    //    drawing to the canvas. In our case, we don't.

    var hlf = {
        x: spt.cx,
        y: spt.cy
    };

    ctx.drawImage(sheet.img, spt.x, spt.y, spt.w, spt.h, posX + hlf.x, posY + hlf.y, spt.w, spt.h);
}