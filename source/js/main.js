DeepBeat = {
    manifest: null,
    preload: null,

    canvas: null,
    stage: null,

    keysDown: {},
    keysEventDispatcher: null,

    currentLevel: null,
    firstLevel: null,

    collisionTypes: {
        "Enemy": []
    },

    collisionFroms: [],

    KEYCODES: {
        "13": "enter",
        "32": "space",
        "38": "up",
        "37": "left",
        "39": "right",
        "40": "down",
        "87": "up",
        "65": "left",
        "68": "right",
        "83": "down",
        "109": "mute",
        "77": "mute"
    },

    init: function(level) {
        var game = this;
        this.firstLevel = level;

        document.onkeydown = function(e){game.handleKeyDown(e);}
        document.onkeyup = function(e){game.handleKeyUp(e);};

        createjs.Sound.initializeDefaultPlugins();

        this.canvas = document.getElementById("gameCanvas");
        this.stage = new createjs.Stage(this.canvas);
        this.keysEventDispatcher = new createjs.EventDispatcher();
        
        // Loading message
		this.messageField = new createjs.Text("Loading", "bold 24px Arial", "#FFFFFF");
		this.messageField.maxWidth = 1000;
		this.messageField.textAlign = "center";
		this.messageField.textBaseline = "middle";
		this.messageField.x = this.canvas.width / 2;
		this.messageField.y = this.canvas.height / 2;
		this.stage.addChild(this.messageField);
        this.stage.update();

        // Preload the following assets
        var assetsPath = "../assets/";
        this.manifest = [
            {id: "music", src: "audio/music.mp3"},
            {id: "gun", src: "images/switchoff.png"}
        ];
        
        this.preload = new createjs.LoadQueue(true, assetsPath);
        this.preload.installPlugin(createjs.Sound);
        this.preload.addEventListener("complete", function(){game.doneLoading();});
        this.preload.addEventListener("progress", function(){game.updateLoading();});
        this.preload.loadManifest(this.manifest);
    },

    stop: function() {
        if (this.preload != null) {
            this.preload.close();
        }
        createjs.Sound.stop();
    },
    
    updateLoading: function() {
        // TODO fancy ass 3D circle loader... maybe
    },
    doneLoading: function() {
		// Remove loading message
        this.stage.removeChild(this.messageField);
        
        var game = this;
        this.setLevel(this.firstLevel);
        createjs.Ticker.interval = 17;
        createjs.Ticker.addEventListener("tick", function(){game.tick();});
        // Play music after it was preloaded
        createjs.Sound.play("music");
    },

    setLevel: function(level) {
        if(this.currentLevel) {
            level.end();
        }
        this.stage.removeAllChildren();
        this.currentLevel = level;
        this.currentLevel.start(this.stage);
    },

    tick: function(event) {
        this.handleKeys();
        this.handleCollisions();
        this.stage.update(event);
        this.currentLevel.tick();
    },

    handleKeys: function() {
        for (var key in this.keysDown) {
            if (this.keysDown[key]) {
                this.keysEventDispatcher.dispatchEvent("key-" + this.KEYCODES[key]);
            }
        }
    },

    handleKeyDown: function(e) {
        if(this.KEYCODES["" + e.keyCode] && !this.keysDown["" + e.keyCode]) {
            this.keysEventDispatcher.dispatchEvent(new createjs.Event("keydown-" + this.KEYCODES["" + e.keyCode], true));
            this.keysDown["" + e.keyCode] = true;
            return false;
        }
    },

    handleKeyUp: function(e) {
        if(this.KEYCODES["" + e.keyCode]) {
            this.keysEventDispatcher.dispatchEvent(new createjs.Event("keyup-" + this.KEYCODES["" + e.keyCode], true));
            delete this.keysDown["" + e.keyCode];
            return false;
        }
    },

    addKeyHandler: function(obj, k, func) {
        var game = this;
        var handle = function() {
            func.apply(obj);
        };
        this.keysEventDispatcher.addEventListener(k, handle);
        obj.on("removed", function() {
            game.keysEventDispatcher.removeEventListener(k, handle);
        });
    },

    addCollisionType: function(obj, typeString) {
        var game = this;
        obj.on("added", function() {
            game.collisionTypes[typeString].push(obj);
        });
        obj.on("removed", function() {
            game.collisionTypes[typeString].splice(game.collisions[typeString].indexOf(obj), 1);
        });
    },

    addCollisionHandler: function(obj, sprite, typeString, func) {
        var game = this;

        var info = {
            from: sprite,
            to: typeString,
            func: func,
            obj: obj
        };

        obj.on("added", function() {
            game.collisionFroms.push(info);
        });
        obj.on("removed", function() {
            game.collisionFroms.splice(game.collisionFroms.indexOf(info), 1);
        });
    },

    handleCollisions: function() {
        for(var i in this.collisionFroms) {
            for(var j in this.collisionTypes[this.collisionFroms[i].to]) {
                if(ndgmr.checkRectCollision(this.collisionFroms[i].from, this.collisionTypes[this.collisionFroms[i].to][j])) {
                    this.collisionFroms[i].func.apply(this.collisionFroms[i].obj);
                }
            }
        }
    }
};

