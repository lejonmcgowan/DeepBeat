(function (window) {

    var Level = function(stage) {
        this.stage = stage;
        this.lastTime = 0;

    };

    Level.prototype = {
        spawnEnemies: function() {

            var position = this.music.getPosition();
            DeepBeat.time = position;
            DeepBeat.dt = position - this.lastTime;
            if(!DeepBeat.dt || DeepBeat.dt > 100) {
                DeepBeat.dt = 17;
            }
            this.lastTime = position;

            if(position > this.music.getDuration() - 5000 && !this.won) {
                this.musicDone();
                this.won = true;
            }

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

        getTimeToBeat: function() {
            return Math.min(this.music.getPosition() % this.beatRate, this.beatRate - this.music.getPosition() % this.beatRate);
        },

        tick: function() {},

        end: function() {},

        lostLevel: function() {},

        musicDone: function() {},
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
    
    var addEnemy = function(enemies, phrase, measure, beat, speed, xPos, yPos, xDir, yDir, type) {
        enemies.push({
            beat: phrase*(4*8) + measure*4 + beat,
            type: Enemy,
            params: [
                xPos, yPos, xDir, yDir, speed,
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
    var randomDesign = function(enemies, difficulty) {
        var xDir;
        var yDir;
        var xPos;
        var yPos;
        var type;
        
        this.changeDirs = function() {
            xDir = randBool() ? (randBool() ? -1 : 1) : 0;
            yDir = xDir == 0 ? (randBool() ? -1 : 1) : 0;
            xPos = xDir == 0 ? DeepBeat.windowWidth/2 : (xDir == 1 ? 0 : DeepBeat.windowWidth);
            yPos = yDir == 0 ? DeepBeat.windowHeight/2 : (yDir == 1 ? 0 : DeepBeat.windowHeight);
            
            if (type == DeepBeat.enemyType.diagonal) {
                if (xDir == 0) {
                    xDir = randBool() ? 0.3 : -0.3;
                    xPos = (xDir > 0) ? DeepBeat.windowWidth/3 : 2*DeepBeat.windowWidth/3;
                } else {
                    yDir = randBool() ? 0.3 : -0.3;
                    yPos = (yDir > 0) ? DeepBeat.windowHeight/3 : 2*DeepBeat.windowHeight/3;
                }
            }
        }
        
        for (var phrase = 1; phrase < 15; phrase++) {
            var time = phrase + 4*(difficulty-1);
            
            var speed = Math.log(time)*0.05 + 0.1;
            
            for (var measure = 0; measure < 8; measure++) {
                type = Math.random()*15<time
                    ? (randBool() ? (randBool() ? DeepBeat.enemyType.creeper : DeepBeat.enemyType.wave) : DeepBeat.enemyType.spiral)
                    : (Math.random()*8<time ? DeepBeat.enemyType.diagonal : DeepBeat.enemyType.linear);
                var beatIncr = Math.random()*6<time ? ((randBool() && time>8) ? 0.5 : 1) : 2;
                if (difficulty == 3) {
                    beatIncr = 1;
                }
                changeDirs();
                
                for (var beat = 0; beat < 4; beat+=beatIncr) {
                    if (difficulty != 3 && beatIncr <= 1 && Math.random()<.5) {
                        continue;
                    }
                
                    if (time>4 && beatIncr >= 1) {
                        changeDirs();
                    } else if (beatIncr < 1 && beat%2 == 1) {
                        if (randBool()) {
                            continue;
                        }
                        changeDirs();
                    }
                    addEnemy(enemies, phrase, measure, beat, speed, xPos, yPos, xDir, yDir, type);
                }
            }
        }
    }
    
    // Generate enemies for tutorial level
    var tutorialDesign = function(enemies) {
        var phrase = 1;
        var measure = 0;
        var beat = 0;
        var speed = 0.1;
        var xPos;
        var yPos;
        var xDir;
        var yDir;
        var type = DeepBeat.enemyType.linear;
        
        this.changeDirs = function(pxDir, pyDir, pxPos, pyPos) {
            xDir = (pxDir == 0 && pyDir == 0) ? (randBool() ? (randBool() ? -1 : 1) : 0) : pxDir;
            yDir = (pxDir == 0 && pyDir == 0) ? (xDir == 0 ? (randBool() ? -1 : 1) : 0) : pyDir;
            xPos = xDir == 0 ? DeepBeat.windowWidth/2 : (xDir == 1 ? 0 : (xDir == -1 ? DeepBeat.windowWidth : pxPos));
            yPos = yDir == 0 ? DeepBeat.windowHeight/2 : (yDir == 1 ? 0 : (yDir == -1 ? DeepBeat.windowHeight : pyPos));
        }
        
        changeDirs(-1, 0, 0, 0);
        for (var i = 0; i < 8; i++) {
            addEnemy(enemies, phrase, measure, beat, speed, xPos, yPos, xDir, yDir, type);
            beat += 2;
        }
        
        changeDirs(0, 1, 0, 0);
        for (var i = 0; i < 2; i++) {
            addEnemy(enemies, phrase, measure, beat, speed, xPos, yPos, xDir, yDir, type);
            beat += 2;
        }
        changeDirs(1, 0, 0, 0);
        for (var i = 0; i < 2; i++) {
            addEnemy(enemies, phrase, measure, beat, speed, xPos, yPos, xDir, yDir, type);
            beat += 2;
        }
        changeDirs(0, -1, 0, 0);
        for (var i = 0; i < 2; i++) {
            addEnemy(enemies, phrase, measure, beat, speed, xPos, yPos, xDir, yDir, type);
            beat += 2;
        }
        changeDirs(-1, 0, 0, 0);
        for (var i = 0; i < 2; i++) {
            addEnemy(enemies, phrase, measure, beat, speed, xPos, yPos, xDir, yDir, type);
            beat += 2;
        }
    }

    window.DeepBeatLevels = {};

    window.DeepBeatLevels.MainMenu = function(stage) {
        var logo = new createjs.Bitmap(DeepBeat.preload.getResult("logo"));
        stage.addChild(logo);
        logo.x = 100;
        logo.y = 50;
        DeepBeat.canvas.style.backgroundColor = "black";
        Level.apply(this, [stage]);
        stage.addChild(new DialogBox("Use the Arrow keys to select a level. Press enter to start the level.asfasdfadsfadsfasdfasdfasdfasdfasdfasdfasdfasdfadsfasdfasdfasdf adsfadsfadsf adsfasdf adsfads fadsf asdfasdf adsfadsf adsfadsfsadf sadfsadf adsfsadfads adsfasdfads fsadf adsfasdf adsfds fsdf adsfadsf adsfasdfasd f",640, 3));
        stage.addChild(new Menu([{
            text: "Tutorial",
            level: window.DeepBeatLevels.Tutorial
        }, {
            text: "Level 1",
            level: window.DeepBeatLevels.Level1
        }, {
            text: "Level 2",
            level: window.DeepBeatLevels.Level2
        }, {
            text: "Level 3",
            level: window.DeepBeatLevels.Level3
        }, {
            text: "Bonus",
            level: window.DeepBeatLevels.Bonus
        }, {
            text: "Credits",
            level: window.DeepBeatLevels.HelpMenu
        }]));
    };
    window.DeepBeatLevels.MainMenu.prototype = _.extend(new Level(), {});

    window.DeepBeatLevels.LoseMenu = function(stage) {
        Level.apply(this, [stage]);
        stage.addChild(new Menu([{
            text: "Back to Main Menu",
            level: window.DeepBeatLevels.MainMenu,
            esc: true
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

    window.DeepBeatLevels.WinMenu = function(stage) {
        Level.apply(this, [stage]);
        stage.addChild(new Menu([{
            text: "Back to Main Menu",
            level: window.DeepBeatLevels.MainMenu,
            esc: true
        }]));
        var text = new createjs.Text("Level Complete", "24px Verdana", "#FFFFFF");
        text.maxWidth = 1000;
        text.textAlign = "center";
        text.textBaseline = "middle";
        text.x = DeepBeat.windowWidth / 2;
        text.y = 100;
        stage.addChild(text);
    };
    window.DeepBeatLevels.WinMenu.prototype = _.extend(new Level(), {});

    window.DeepBeatLevels.HelpMenu = function(stage) {
        Level.apply(this, [stage]);
        stage.addChild(new Menu([{
            text: "Back to Main Menu",
            level: window.DeepBeatLevels.MainMenu,
            esc: true
        }]));
        var text = new createjs.Text("Credits\n\nDaniel Johnson\nLeJon McGowan\nChris Williams", "24px Verdana", "#FFFFFF");
        text.maxWidth = 1000;
        text.textAlign = "center";
        text.textBaseline = "middle";
        text.x = DeepBeat.windowWidth / 2;
        text.y = 100;
        stage.addChild(text);
        
        var songs = new createjs.Text("Level 1: Phazd by tobycreed\nLevel 2: Heaven by Envy\nLevel 3: Chaoz Fantasy by ParagonX9\nBonus: Faded by Zhu", "24px Verdana", "#FFFFFF");
        songs.maxWidth = 1000;
        songs.textAlign = "center";
        songs.textBaseline = "middle";
        songs.x = DeepBeat.windowWidth / 2;
        songs.y = 420;
        stage.addChild(songs);
    };
    window.DeepBeatLevels.HelpMenu.prototype = _.extend(new Level(), {});

    function goToWinMenu(event) {
        DeepBeat.setLevel(DeepBeatLevels.WinMenu);
    }
    
    // Define tutorial level
    window.DeepBeatLevels.Tutorial = function(stage) {
        Level.apply(this, [stage]);
        var lev = this;
        this.health = new HealthBar();

        this.objects = new createjs.Container();
        this.objects.alpha = 0;
        this.alphaDir = 1;
        this.won = false;

        this.objects.addChild(new Gun());
        this.objects.addChild(new SpaceStation());

        stage.addChild(this.objects);
       
        
        stage.addChild(this.health);
        this.music = createjs.Sound.play("tutorialMusic");
        this.musicDone = function() {
            lev.alphaDir = -1;
        };
        this.enemies = [];
        
        tutorialDesign(this.enemies);

        this.enemies = sortEnemies(this.beatRate, this.enemies);
    };

    window.DeepBeatLevels.Tutorial.prototype = _.extend(new Level(), {
        beatRate: bpmToBeatRate(127), // define the BPM of the song here
        
        tick: function() {
            this.spawnEnemies();
            if(this.objects.alpha < 1 && this.alphaDir == 1) {
                this.objects.alpha += DeepBeat.dt / 1000;
            }
            if(this.alphaDir == -1) {
                if(this.objects.alpha > 0) {
                    this.objects.alpha -= DeepBeat.dt / 2000;
                    this.music.setVolume(this.objects.alpha);
                } else {
                    goToWinMenu();
                }
            }
        },

        lostLevel: function() {
            DeepBeat.timeSurvived = Math.round(this.music.getPosition() / 1000);
            DeepBeat.setLevel(DeepBeatLevels.LoseMenu);
        },

        end: function() {
            this.objects.removeAllChildren();
        }
    });
    
    // Define first level
    window.DeepBeatLevels.Level1 = function(stage) {
        Level.apply(this, [stage]);
        var lev = this;
        this.health = new HealthBar();

        this.objects = new createjs.Container();
        this.objects.alpha = 0;
        this.alphaDir = 1;
        this.won = false;

        this.objects.addChild(new Gun());
        this.objects.addChild(new SpaceStation());

        stage.addChild(this.objects);
       
        
        stage.addChild(this.health);
        this.music = createjs.Sound.play("level1Music");
        this.musicDone = function() {
            lev.alphaDir = -1;
        };
        this.enemies = [];
        
        randomDesign(this.enemies, 1);

        this.enemies = sortEnemies(this.beatRate, this.enemies);
    };

    window.DeepBeatLevels.Level1.prototype = _.extend(new Level(), {
        beatRate: bpmToBeatRate(165), // define the BPM of the song here
        
        tick: function() {
            this.spawnEnemies();
            if(this.objects.alpha < 1 && this.alphaDir == 1) {
                this.objects.alpha += DeepBeat.dt / 1000;
            }
            if(this.alphaDir == -1) {
                if(this.objects.alpha > 0) {
                    this.objects.alpha -= DeepBeat.dt / 2000;
                    this.music.setVolume(this.objects.alpha);
                } else {
                    goToWinMenu();
                }
            }
        },

        lostLevel: function() {
            DeepBeat.timeSurvived = Math.round(this.music.getPosition() / 1000);
            DeepBeat.setLevel(DeepBeatLevels.LoseMenu);
        },

        end: function() {
            this.objects.removeAllChildren();
        }
    });

    // Define second level
    window.DeepBeatLevels.Level2 = function(stage) {
        Level.apply(this, [stage]);
        var lev = this;
        this.health = new HealthBar();

        this.objects = new createjs.Container();
        this.objects.alpha = 0;
        this.alphaDir = 1;
        this.won = false;

        this.objects.addChild(new Gun());
        this.objects.addChild(new SpaceStation());

        stage.addChild(this.objects);
       
        
        stage.addChild(this.health);
        this.music = createjs.Sound.play("level2Music");
        this.musicDone = function() {
            lev.alphaDir = -1;
        };
        this.enemies = [];
        
        randomDesign(this.enemies, 2);

        this.enemies = sortEnemies(this.beatRate, this.enemies);
    };

    window.DeepBeatLevels.Level2.prototype = _.extend(new Level(), {
        beatRate: bpmToBeatRate(150.5), // define the BPM of the song here
        
        tick: function() {
            this.spawnEnemies();
            if(this.objects.alpha < 1 && this.alphaDir == 1) {
                this.objects.alpha += DeepBeat.dt / 1000;
            }
            if(this.alphaDir == -1) {
                if(this.objects.alpha > 0) {
                    this.objects.alpha -= DeepBeat.dt / 2000;
                    this.music.setVolume(this.objects.alpha);
                } else {
                    goToWinMenu();
                }
            }
        },

        lostLevel: function() {
            DeepBeat.timeSurvived = Math.round(this.music.getPosition() / 1000);
            DeepBeat.setLevel(DeepBeatLevels.LoseMenu);
        },

        end: function() {
            this.objects.removeAllChildren();
        }
    });    

    // Define third level
    window.DeepBeatLevels.Level3 = function(stage) {
        Level.apply(this, [stage]);
        var lev = this;
        this.health = new HealthBar();

        this.objects = new createjs.Container();
        this.objects.alpha = 0;
        this.alphaDir = 1;
        this.won = false;

        this.objects.addChild(new Gun());
        this.objects.addChild(new SpaceStation());

        stage.addChild(this.objects);
       
        
        stage.addChild(this.health);
        this.music = createjs.Sound.play("level3Music");
        this.musicDone = function() {
            lev.alphaDir = -1;
        };
        this.enemies = [];
        
        randomDesign(this.enemies, 3);

        this.enemies = sortEnemies(this.beatRate, this.enemies);
    };

    window.DeepBeatLevels.Level3.prototype = _.extend(new Level(), {
        beatRate: bpmToBeatRate(162.32), // define the BPM of the song here
        
        tick: function() {
            this.spawnEnemies();
            if(this.objects.alpha < 1 && this.alphaDir == 1) {
                this.objects.alpha += DeepBeat.dt / 1000;
            }
            if(this.alphaDir == -1) {
                if(this.objects.alpha > 0) {
                    this.objects.alpha -= DeepBeat.dt / 2000;
                    this.music.setVolume(this.objects.alpha);
                } else {
                    goToWinMenu();
                }
            }
        },

        lostLevel: function() {
            DeepBeat.timeSurvived = Math.round(this.music.getPosition() / 1000);
            DeepBeat.setLevel(DeepBeatLevels.LoseMenu);
        },

        end: function() {
            this.objects.removeAllChildren();
        }
    });
    
    // Define bonus level
    window.DeepBeatLevels.Bonus = function(stage) {
        Level.apply(this, [stage]);
        var lev = this;
        this.health = new HealthBar();

        this.objects = new createjs.Container();
        this.objects.alpha = 0;
        this.alphaDir = 1;
        this.won = false;

        this.objects.addChild(new Gun());
        this.objects.addChild(new SpaceStation());

        stage.addChild(this.objects);
       
        
        stage.addChild(this.health);
        this.music = createjs.Sound.play("bonusMusic");
        this.musicDone = function() {
            lev.alphaDir = -1;
        };
        this.enemies = [];
        
        randomDesign(this.enemies, 4);

        this.enemies = sortEnemies(this.beatRate, this.enemies);
    };

    window.DeepBeatLevels.Bonus.prototype = _.extend(new Level(), {
        beatRate: bpmToBeatRate(125.27), // define the BPM of the song here
        
        tick: function() {
            this.spawnEnemies();
            if(this.objects.alpha < 1 && this.alphaDir == 1) {
                this.objects.alpha += DeepBeat.dt / 1000;
            }
            if(this.alphaDir == -1) {
                if(this.objects.alpha > 0) {
                    this.objects.alpha -= DeepBeat.dt / 2000;
                    this.music.setVolume(this.objects.alpha);
                } else {
                    goToWinMenu();
                }
            }
        },

        lostLevel: function() {
            DeepBeat.timeSurvived = Math.round(this.music.getPosition() / 1000);
            DeepBeat.setLevel(DeepBeatLevels.LoseMenu);
        },

        end: function() {
            this.objects.removeAllChildren();
        }
    });

}(window));