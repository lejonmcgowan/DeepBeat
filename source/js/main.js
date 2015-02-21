DeepBeat = {
    manifest: null,
    preload: null,

    canvas: null,
    stage: null,

    keysDown: {},
    keysEventDispatcher: null,

    currentLevel: null,
    firstLevel: null,

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
        "83": "down"
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

        // Preload the following assets
        var assetsPath = "../assets/";
        this.manifest = [
            {id: "gun", src: "images/switchoff.png"},
            {id: "music", src: "audio/music.mp3"}
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

    updateLoading: function() {},
    doneLoading: function() {
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
        var handle = function() {
            func.apply(obj);
        };
        this.keysEventDispatcher.addEventListener(k, handle);
        obj.on("remove", function() {
            this.keysEventDispatcher.removeEventListener(k, handle);
        });
    }
};

