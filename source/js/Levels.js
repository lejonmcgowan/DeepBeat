(function (window) {

    var Level = function(stage) {
        this.stage = stage;
        this.lastTime = 0;
    };

    Level.prototype = {
        spawnEnemies: function() {

            var position = this.music.getPosition();
            DeepBeat.dt = position - this.lastTime;
            this.lastTime = position;

            while(this.enemies.length &&
             (position + this.enemies[0].type.prototype.timeToSound(this.enemies[0].params)) > this.enemies[0].beat * this.beatRate) {
                this.stage.addChild(new this.enemies[0].type(this.enemies[0].params));
                this.enemies.splice(0,1);
            }
        },

        stage: null,
        enemies: [],
        music: null,
        beatRate: 1000,

        tick: function() {},

        end: function() {},

        lostLevel: function() {}
    };


    //sort enemies by the order they will be spawned, regardless of when they are destroyed.
    var sortEnemies = function(beatRate, enemies) {
        return enemies.sort(function(a, b) {
            return (a.beat * beatRate - a.type.prototype.timeToSound(a.params))
            - (b.beat * beatRate - b.type.prototype.timeToSound(b.params));
        });
    };

    /*
    var addDiagonal = function(enemies, beatStart, number, beatIncrement, speed, xDir, yDir, startX, startY, endX, endY) {
        for(var i = 0; i < number; i++) {
            enemies.push({
                beat: beatStart + i * beatIncrement,
                type: Enemy,
                params: [startX + i * (endX - startX) / number, startY + i * (endY - startY) / number, xDir, yDir, speed]
            });
        }
    };
    */
    
    var addEnemy = function(enemies, phrase, measure, beat, speed, xDir, yDir, type) {
        enemies.push({
            beat: phrase*(4*8) + measure*4 + beat,
            type: Enemy,
            params: [
                xDir == 0 ? DeepBeat.windowWidth/2 : (xDir == 1 ? 0 : DeepBeat.windowWidth), //startX
                yDir == 0 ? DeepBeat.windowHeight/2 : (yDir == 1 ? 0 : DeepBeat.windowHeight),  //startY
                xDir, yDir, speed,
                type]
        });
    };
    
    var addEnemyGroup = function(enemies, phraseStart, measureStart, beatStart, number, beatIncr, speed, xDir, yDir, type) {
        for (var i = 0; i < number; i++) {
            var beat = (phraseStart*(4*8) + measureStart*4 + beatStart) + i*beatIncr;
            addEnemy(enemies, 0, 0, beat, speed, xDir, yDir, type);
        }
    }
    
    // Converts the BPM to a beat rate (milliseconds between each beat)
    var bpmToBeatRate = function(bpm) {
        return (1 / bpm) * 60 * 1000;
    }
    
    var randBool = function() {
        return Math.random()<.5;
    }
    
    // Randomly generate enemies
    var randomDesign = function(enemies) {
        var xDir;
        var yDir;
        this.changeDirs = function() {
            xDir = randBool() ? (randBool() ? -1 : 1) : 0;
            yDir = xDir == 0 ? (randBool() ? -1 : 1) : 0;
        }
        
        for (var phrase = 1; phrase < 15; phrase++) {
            var speed = Math.log(phrase)*0.1 + 0.1;
            
            for (var measure = 0; measure < 8; measure++) {
                var type = Math.random()*15<phrase
                    ? (randBool() ? DeepBeat.enemyType.spiral : DeepBeat.enemyType.wave)
                    : DeepBeat.enemyType.linear;
                type = DeepBeat.enemyType.wave; 
                var beatIncr = Math.random()*10<phrase ? ((randBool() && phrase>8) ? 0.5 : 1) : 2;
                changeDirs();
                
                for (var beat = 0; beat < 4; beat+=beatIncr) {
                    if (phrase>4 && beatIncr >= 1) {
                        changeDirs();
                    } else if (beatIncr < 1 && beat%2 == 1) {
                        changeDirs();
                    }
                    addEnemy(enemies, phrase, measure, beat, speed, xDir, yDir, type);
                }
            }
        }
    }

    window.DeepBeatLevels = {};

    window.DeepBeatLevels.MainMenu = function(stage) {
        DeepBeat.canvas.style.backgroundColor = "black";
        Level.apply(this, [stage]);
        stage.addChild(new Menu([{
            text: "Play Game",
            level: window.DeepBeatLevels.Level1
        }, {
            text: "Help",
            level: window.DeepBeatLevels.HelpMenu
        }]));
    };
    window.DeepBeatLevels.MainMenu.prototype = _.extend(new Level(), {});

    window.DeepBeatLevels.LoseMenu = function(stage) {
        Level.apply(this, [stage]);
        stage.addChild(new Menu([{
            text: "Back to Main Menu",
            level: window.DeepBeatLevels.MainMenu
        }]));
        var text = new createjs.Text("The space station collapsed.\n\nYou survived for " + Math.floor(DeepBeat.timeSurvived/60) + " minutes and "+Math.round(DeepBeat.timeSurvived%60)+" seconds.", "24px Verdana", "#FFFFFF");
        text.maxWidth = 1000;
        text.textAlign = "center";
        text.textBaseline = "middle";
        text.x = DeepBeat.windowWidth / 2;
        text.y = 100;
        stage.addChild(text);
    };
    window.DeepBeatLevels.LoseMenu.prototype = _.extend(new Level(), {});

    window.DeepBeatLevels.HelpMenu = function(stage) {
        Level.apply(this, [stage]);
        stage.addChild(new Menu([{
            text: "Back",
            level: window.DeepBeatLevels.MainMenu
        }]));
        var text = new createjs.Text("Use the arrow keys to shoot your laser!\n\nShoot objects before they damage\nyour space station!\n\n\n\n\n\n\n\n\n\nCredits\n\nDaniel Johnson\nLeJon McGowan\nChris Williams", "24px Verdana", "#FFFFFF");
        text.maxWidth = 1000;
        text.textAlign = "center";
        text.textBaseline = "middle";
        text.x = DeepBeat.windowWidth / 2;
        text.y = 100;
        stage.addChild(text);
    };
    window.DeepBeatLevels.HelpMenu.prototype = _.extend(new Level(), {});

    // Define first level
    window.DeepBeatLevels.Level1 = function(stage) {
        Level.apply(this, [stage]);
        this.health = new HealthBar();

        this.objects = new createjs.Container();
        this.objects.alpha = 0;

        this.objects.addChild(new Gun());
        this.objects.addChild(new SpaceStation());

        stage.addChild(this.objects);
       
        
        stage.addChild(this.health);
        this.music = createjs.Sound.play("level1Music");
        this.enemies = [];
        
        randomDesign(this.enemies);

        this.enemies = sortEnemies(this.beatRate, this.enemies);
    };

    window.DeepBeatLevels.Level1.prototype = _.extend(new Level(), {
        beatRate: bpmToBeatRate(165), // define the BPM of the song here
        
        tick: function() {
            this.spawnEnemies();
            if(this.objects.alpha < 1) {
                this.objects.alpha += DeepBeat.dt / 1000;
            }
        },

        lostLevel: function() {
            DeepBeat.timeSurvived = Math.round(this.music.getPosition() / 1000);
            DeepBeat.setLevel(DeepBeatLevels.LoseMenu);
        }
    });

}(window));