var bindings = {};

// A dictionary mapping actions that might be taken in our
// game to a boolean value indicating whether that action
// is currently being performed.
var actions = {};

var mouse =  {
    x: 0,
    y: 0
};

//-----------------------------
function setup() {
    // Example usage of bind, where we're setting up
    // the W, A, S, and D keys in that order.
    bind(87, 'move-up');
    bind(65, 'move-left');
    bind(83, 'move-down');
    bind(68, 'move-right');

    // Adding the event listeners for the appropriate DOM events.
    document.getElementById('my_canvas').addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
};
setup();
//-----------------------------
function onMouseMove(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
};

//-----------------------------
function onKeyDown(event) {

    var code = event.keyCode;

    var action = bindings[code];
    if(action) {
        actions[action] = true;
    }
    // TASK #2
    // Grab the keyID property of the event object parameter,
    // then set the equivalent element in the 'actions' object
    // to true.
    // 
    // You'll need to use the bindings object you set in 'bind'
    // in order to do this.
    //
    // YOUR CODE HERE
};

//-----------------------------
function onKeyUp(event) {
    var code = event.keyCode;

    var action = bindings[code];
    if(action) {
        actions[action] = false;
    }
    // TASK #3
    // Grab the keyID property of the event object parameter,
    // then set the equivalent element in the 'actions' object
    // to false.
    // 
    // You'll need to use the bindings object you set in 'bind'
    // in order to do this.
    //
    // YOUR CODE HERE
};

// TASK #1
// The bind function takes an ASCII keycode
// and a string representing the action to
// take when that key is pressed.
// 
// Fill in the bind function so that it
// sets the element at the 'key'th value
// of the 'bindings' object to be the
// provided 'action'.
function bind(key, action) {
    bindings[key] = action; 

};

//Moving

    var move_dir = new Vec2(0,0);
    var dirVec = new Vec2(0,0);

    var gPlayer0 = {
        pos: {
            x: 100,
            y: 100
        },

        walkSpeed: 1,

        // This is hooking into the Box2D Physics
        // library. We'll be going over this in
        // more detail later.
        mpPhysBody: new BodyDef()
    };

    //-----------------------------
function setup () {
    // Call our input setup method to bind
    // our keys to actions and set the
    // event listeners.
    setup();
};

function update () {

    // move_dir is a Vec2 object from the Box2d
    // physics library, which is of the form
    // {
    //     x: 0,
    //     y: 0
    // }
    // 
    // We'll be going more into Box2D later in
    // the course. The Vec2 constructor takes
    // an initial x and y value to set the
    // vector to.

    if (actions['move-up']) {
        // TASK #1
        // adjust the move_dir by 1 in the
        // y direction. Remember, in our
        // coordinate system, up is the
        // negative-y direction, and down
        // is the positive-y direction!
        //
        move_dir.y -= 1;
        
    }
    if (actions['move-down']) {
        // TASK #2
        // adjust the move_dir by 1 in the
        // y direction. Remember, in our
        // coordinate system, up is the
        // negative-y direction, and down
        // is the positive-y direction!
        //
        move_dir.y += 1;
        
    }
    if (actions['move-left']) {
        // TASK #3
        // adjust the move_dir by 1 in the
        // x direction.
        //
        move_dir.x -= 1;
        
    }
    if (actions['move-right']) {
        // TASK #4
        // adjust the move_dir by 1 in the
        // x direction.
        //
        move_dir.x += 1;
        
    }

    // After modifying the move_dir above, we check
    // if the vector is non-zero. If it is, we adjust
    // the vector length based on the player's walk
    // speed.
    if (move_dir.LengthSquared()) {
        // First set 'move_dir' to a unit vector in
        // the same direction it's currently pointing.
        move_dir.Normalize();

        // Next, multiply 'move_dir' by the player's
        // set 'walkSpeed'. We do this in case we might
        // want to change the player's walk speed due
        // to a power-up, etc.
        move_dir.Multiply(gGameEngine.gPlayer0.walkSpeed);
    }

    gGameEngine.gPlayer0.mpPhysBody.setLinearVelocity(gGameEngine.move_dir.x, gGameEngine.move_dir.y);

    // Keyboard based facing & firing direction
    if (gInputEngine.actions.fire0 || gInputEngine.actions.fire1) {

        // Grab the player's screen position in space. We've provided
        // the 'gRenderEngine.getScreenPosition' method for this.
        // It returns an object of the form:
        // 
        // { x, y }
        // 
        // Pass the player's position to this method and store the
        // resulting value.
        var playerInScreenSpace = {
            x: gRenderEngine.getScreenPosition(this.gPlayer0.pos).x,
            y: gRenderEngine.getScreenPosition(this.gPlayer0.pos).y
        };

        // Set the dirVec property to the difference between the
        // current mouse position and the player's position in
        // screen space.
        var dirVec = new Vec2(0,0);
        dirVec.x = gInputEngine.mouse.x - playerInScreenSpace.x;
        dirVec.y = gInputEngine.mouse.y - playerInScreenSpace.y;

        dirVec.normalize();
    }

        
}