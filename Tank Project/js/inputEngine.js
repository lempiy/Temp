function InputEngineClass() {
    this.bindings = {};
    this.actions = {};

    this.mouse = {
	    x: 0,
	    y: 0
	};
};

InputEngineClass.prototype.bind = function (key, action) {
    this.bindings[key] = action; 
};

InputEngineClass.prototype.onMouseMove = function(event) {
    gInputEngine.mouse.x = event.clientX;
    gInputEngine.mouse.y = event.clientY;
};

InputEngineClass.prototype.onKeyDown = function(event) {

    var code = event.keyCode;

    var action = gInputEngine.bindings[code];
    if(action) {
        gInputEngine.actions[action] = true;
    }
    console.log(gInputEngine.actions[action])
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

InputEngineClass.prototype.onKeyUp = function(event) {
    var code = event.keyCode;

    var action = gInputEngine.bindings[code];
    if(action) {
        gInputEngine.actions[action] = false;
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

InputEngineClass.prototype.setup = function() {
    // Example usage of bind, where we're setting up
    // the W, A, S, and D keys in that order.
    this.bind(87, 'move-up');
    this.bind(65, 'move-left');
    this.bind(83, 'move-down');
    this.bind(68, 'move-right');

    // Adding the event listeners for the appropriate DOM events.
    document.getElementById('my_canvas').addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
};

var gInputEngine = new InputEngineClass();


