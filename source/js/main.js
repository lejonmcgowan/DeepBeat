var DIFFICULTY = 2;         //how fast the game gets mor difficult
var ROCK_TIME = 110;        //aprox tick count until a new asteroid gets introduced
var SUB_ROCK_COUNT = 4;     //how many small rocks to make on rock death
var BULLET_TIME = 5;        //ticks between bullets
var BULLET_ENTROPY = 100;   //how much energy a bullet has before it runs out.

var TURN_FACTOR = 7;        //how far the ship turns per frame
var BULLET_SPEED = 17;      //how fast the bullets move

var KEYCODES = {
    "13": "enter",
    "32": "space",
    "38": "up",
    "37": "left",
    "39": "right",
    "87": "up",
    "65": "left",
    "68": "right"
}

var manifest;           // used to register sounds for preloading
var preload;

var canvas;         //Main canvas
var stage;          //Main display stage

var keys = [];
var key;



var shootHeld;          //is the user holding a shoot command
var lfHeld;             //is the user holding a turn left command
var rtHeld;             //is the user holding a turn right command
var fwdHeld;            //is the user holding a forward command

var timeToRock;         //difficulty adjusted version of ROCK_TIME
var nextRock;           //ticks left until a new space rock arrives
var nextBullet;         //ticks left until the next shot is fired

var rockBelt;           //space rock array
var bulletStream;       //bullet array

var ship;           //the actual ship
var alive;          //wheter the player is alive

//register key functions
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function init() {
    createjs.Sound.initializeDefaultPlugins();

    canvas = document.getElementById("gameCanvas");
    stage = new createjs.Stage(canvas);
    key = new createjs.EventDispatcher();

    var assetsPath = "../assets/";
    manifest = [
        {id: "begin", src: "sounds/spawn.ogg"},
        {id: "break", src: "sounds/break.ogg", data: 6},
        {id: "death", src: "sounds/death.ogg"},
        {id: "laser", src: "sounds/shot.ogg", data: 6},
        {id: "music", src: "sounds/music.ogg"},
        {id: "gun", src: "images/switchoff.png"}
    ];

    createjs.Sound.alternateExtensions = ["mp3"];
    preload = new createjs.LoadQueue(true, assetsPath);
    preload.installPlugin(createjs.Sound);
    preload.addEventListener("complete", doneLoading);
    preload.addEventListener("progress", updateLoading);
    preload.loadManifest(manifest);

    
}


function stop() {
    if (preload != null) {
        preload.close();
    }
    createjs.Sound.stop();
}

function updateLoading() {
}

function doneLoading(event) {
    //createjs.Sound.play("music", {interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0.4});
    watchRestart();
}

function watchRestart() {
    //watch for clicks
    stage.update();
    canvas.onclick = handleClick;
}

function handleClick() {
    //prevent extra clicks and hide text
    canvas.onclick = null;

    restart();
}

//reset all game logic
function restart() {
    //hide anything on stage and show the score
    stage.removeAllChildren();

    //new arrays to dump old data
    rockBelt = [];
    bulletStream = [];

    //create the player
    alive = true;
    ship = new Ship();
    ship.x = canvas.width / 2;
    ship.y = canvas.height / 2;

    //log time untill values
    timeToRock = ROCK_TIME;
    nextRock = nextBullet = 0;

    //reset key presses
    shootHeld = lfHeld = rtHeld = fwdHeld = dnHeld = false;

    //ensure stage is blank and add the ship
    stage.clear();
    stage.addChild(ship);

    addObject(new Gun());

    //start game timer
    if (!createjs.Ticker.hasEventListener("tick")) {
        createjs.Ticker.addEventListener("tick", tick);
    }
}

function addObject(obj) {
    stage.addChild(obj);
}

function removeObject(obj) {
    stage.removeChild(obj);
}

function tick(event) {
    handleKey();
    //handle firing
    if (nextBullet <= 0) {
        if (alive && shootHeld) {
            nextBullet = BULLET_TIME;
            fireBullet();
        }
    } else {
        nextBullet--;
    }

    //handle turning
    if (alive && lfHeld) {
        ship.rotation -= TURN_FACTOR;
    } else if (alive && rtHeld) {
        ship.rotation += TURN_FACTOR;
    }

    //handle thrust
    if (alive && fwdHeld) {
        ship.accelerate();
    }

    //handle new spaceRocks
    if (nextRock <= 0) {
        if (alive) {
            timeToRock -= DIFFICULTY;   //reduce spaceRock spacing slowly to increase difficulty with time
            var index = getSpaceRock(SpaceRock.LRG_ROCK);
            rockBelt[index].floatOnScreen(canvas.width, canvas.height);
            nextRock = timeToRock + timeToRock * Math.random();
        }
    } else {
        nextRock--;
    }

    //handle ship looping
    if (alive && outOfBounds(ship, ship.bounds)) {
        placeInBounds(ship, ship.bounds);
    }

    //handle bullet movement and looping
    for (bullet in bulletStream) {
        var o = bulletStream[bullet];
        if (!o || !o.active) {
            continue;
        }
        if (outOfBounds(o, ship.bounds)) {
            placeInBounds(o, ship.bounds);
        }
        o.x += Math.sin(o.rotation * (Math.PI / -180)) * BULLET_SPEED;
        o.y += Math.cos(o.rotation * (Math.PI / -180)) * BULLET_SPEED;

        if (--o.entropy <= 0) {
            stage.removeChild(o);
            o.active = false;
        }
    }

    //handle spaceRocks (nested in one loop to prevent excess loops)
    for (spaceRock in rockBelt) {
        var o = rockBelt[spaceRock];
        if (!o || !o.active) {
            continue;
        }

        //handle spaceRock movement and looping
        if (outOfBounds(o, o.bounds)) {
            placeInBounds(o, o.bounds);
        }
        o.tick(event);

        //handle spaceRock ship collisions
        if (alive && o.hitRadius(ship.x, ship.y, ship.hit)) {
            alive = false;

            stage.removeChild(ship);
            messageField.text = "You're dead:  Click or hit enter to play again";
            stage.addChild(messageField);
            watchRestart();

            //play death sound
            createjs.Sound.play("death", createjs.Sound.INTERRUPT_ANY);
            continue;
        }

        //handle spaceRock bullet collisions
        for (bullet in bulletStream) {
            var p = bulletStream[bullet];
            if (!p || !p.active) {
                continue;
            }

            if (o.hitPoint(p.x, p.y)) {
                var newSize;
                switch (o.size) {
                    case SpaceRock.LRG_ROCK:
                        newSize = SpaceRock.MED_ROCK;
                        break;
                    case SpaceRock.MED_ROCK:
                        newSize = SpaceRock.SML_ROCK;
                        break;
                    case SpaceRock.SML_ROCK:
                        newSize = 0;
                        break;
                }

                //create more
                if (newSize > 0) {
                    var i;
                    var index;
                    var offSet;

                    for (i = 0; i < SUB_ROCK_COUNT; i++) {
                        index = getSpaceRock(newSize);
                        offSet = (Math.random() * o.size * 2) - o.size;
                        rockBelt[index].x = o.x + offSet;
                        rockBelt[index].y = o.y + offSet;
                    }
                }

                //remove
                stage.removeChild(o);
                rockBelt[spaceRock].active = false;

                stage.removeChild(p);
                bulletStream[bullet].active = false;

                // play sound
                createjs.Sound.play("break", {interrupt: createjs.Sound.INTERUPT_LATE, offset: 0.8});
            }
        }
    }

    //call sub ticks
    ship.tick(event);
    stage.update(event);
}

function outOfBounds(o, bounds) {
    //is it visibly off screen
    return o.x < bounds * -2 || o.y < bounds * -2 || o.x > canvas.width + bounds * 2 || o.y > canvas.height + bounds * 2;
}

function placeInBounds(o, bounds) {
    //if its visual bounds are entirely off screen place it off screen on the other side
    if (o.x > canvas.width + bounds * 2) {
        o.x = bounds * -2;
    } else if (o.x < bounds * -2) {
        o.x = canvas.width + bounds * 2;
    }

    //if its visual bounds are entirely off screen place it off screen on the other side
    if (o.y > canvas.height + bounds * 2) {
        o.y = bounds * -2;
    } else if (o.y < bounds * -2) {
        o.y = canvas.height + bounds * 2;
    }
}

function fireBullet() {
    //create the bullet
    var o = bulletStream[getBullet()];
    o.x = ship.x;
    o.y = ship.y;
    o.rotation = ship.rotation;
    o.entropy = BULLET_ENTROPY;
    o.active = true;

    //draw the bullet
    o.graphics.beginStroke("#FFFFFF").moveTo(-1, 0).lineTo(1, 0);

    // play the shot sound
    createjs.Sound.play("laser", createjs.Sound.INTERUPT_LATE);
}

function getSpaceRock(size) {
    var i = 0;
    var len = rockBelt.length;

    //pooling approach
    while (i <= len) {
        if (!rockBelt[i]) {
            rockBelt[i] = new SpaceRock(size);
            break;
        } else if (!rockBelt[i].active) {
            rockBelt[i].activate(size);
            break;
        } else {
            i++;
        }
    }

    if (len == 0) {
        rockBelt[0] = new SpaceRock(size);
    }

    stage.addChild(rockBelt[i]);
    return i;
}

function getBullet() {
    var i = 0;
    var len = bulletStream.length;

    //pooling approach
    while (i <= len) {
        if (!bulletStream[i]) {
            bulletStream[i] = new createjs.Shape();
            break;
        } else if (!bulletStream[i].active) {
            bulletStream[i].active = true;
            break;
        } else {
            i++;
        }
    }

    if (len == 0) {
        bulletStream[0] = new createjs.Shape();
    }

    stage.addChild(bulletStream[i]);
    return i;
}

function handleKey() {
    for (var k in keys) {
        if (keys[k]) {
            key.dispatchEvent("key-" + KEYCODES[k]);
        }
    }
}

//allow for WASD and arrow control scheme
function handleKeyDown(e) {
    if(KEYCODES["" + e.keyCode] && !keys["" + e.keyCode]) {
        key.dispatchEvent(new createjs.Event("keydown-" + KEYCODES["" + e.keyCode], true));
        keys["" + e.keyCode] = true;
        return false;
    }
}

function addKeyHandler(obj, k, func) {
    var handle = function() {
        func.apply(obj);
    };
    key.addEventListener(k, handle);
    obj.on("remove", function() {
        key.removeEventListener(k, handle);
    });
}

function handleKeyUp(e) {
    if(KEYCODES["" + e.keyCode]) {
        key.dispatchEvent("keyup-" + KEYCODES["" + e.keyCode]);
        delete keys["" + e.keyCode];
        return false;
    }
}

