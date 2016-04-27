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



function GameEngineClass() {
	this.move_dir = new Vec2(0,0);
    this.dirVec = new Vec2(0,0);

    this.gPlayer0 = {
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
};

GameEngineClass.prototype.setup = function() {
    // Call our input setup method to bind
    // our keys to actions and set the
    // event listeners.
    gInputEngine.setup();
};

GameEngineClass.prototype.update = function() {

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

    if (gInputEngine.actions['move-up']) {
        // TASK #1
        // adjust the move_dir by 1 in the
        // y direction. Remember, in our
        // coordinate system, up is the
        // negative-y direction, and down
        // is the positive-y direction!
        //
        this.move_dir.y -= 1;
        
    }
    if (gInputEngine.actions['move-down']) {
        // TASK #2
        // adjust the move_dir by 1 in the
        // y direction. Remember, in our
        // coordinate system, up is the
        // negative-y direction, and down
        // is the positive-y direction!
        //
        this.move_dir.y += 1;
        
    }
    if (gInputEngine.actions['move-left']) {
        // TASK #3
        // adjust the move_dir by 1 in the
        // x direction.
        //
        this.move_dir.x -= 1;
        
    }
    if (gInputEngine.actions['move-right']) {
        // TASK #4
        // adjust the move_dir by 1 in the
        // x direction.
        //
        this.move_dir.x += 1;
        
    }

    // After modifying the move_dir above, we check
    // if the vector is non-zero. If it is, we adjust
    // the vector length based on the player's walk
    // speed.
    if (this.move_dir.LengthSquared()) {
        // First set 'move_dir' to a unit vector in
        // the same direction it's currently pointing.
        this.move_dir.Normalize();

        // Next, multiply 'move_dir' by the player's
        // set 'walkSpeed'. We do this in case we might
        // want to change the player's walk speed due
        // to a power-up, etc.
        this.move_dir.Multiply(this.gPlayer0.walkSpeed);
    }

    this.gPlayer0.mpPhysBody.setLinearVelocity(this.move_dir.x, this.move_dir.y);

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

var gGameEngine = new GameEngineClass();