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

        end: function() {}
    };


    //sort enemies by the order they will be spawned, regardless of when they are destroyed.
    var sortEnemies = function(beatRate, enemies) {
        return enemies.sort(function(a, b) {
            return (a.beat * beatRate - a.type.prototype.timeToSound(a.params))
            - (b.beat * beatRate - b.type.prototype.timeToSound(b.params));
        });
    };

    var addDiagonal = function(enemies, beatStart, number, beatIncrement, speed, xDir, yDir, startX, startY, endX, endY) {
        for(var i = 0; i < number; i++) {
            enemies.push({
                beat: beatStart + i * beatIncrement,
                type: Enemy,
                params: [startX + i * (endX - startX) / number, startY + i * (endY - startY) / number, xDir, yDir, speed]
            });
        }
    };
    
    // Converts the BPM to a beat rate (milliseconds between each beat)
    var bpmToBeatRate = function(bpm) {
        // TODO calc beatRate (milliseconds between beats)
        return (1 / bpm) * 60 * 1000;
    }

    window.DeepBeatLevels = {};

    // Define first level
    window.DeepBeatLevels.Level1 = function(stage) {
        Level.apply(this, [stage]);
        stage.addChild(new Gun());
        this.music = createjs.Sound.play("music");
        this.enemies = [];
        /*
        addDiagonal(this.enemies, 15, 5, 1, 0.1, -1, 0, 1024, 50, 1024, 250);
        addDiagonal(this.enemies, 20, 5, 1, 0.2, 1, 0, 0, 50, 0, 250);
        addDiagonal(this.enemies, 25, 5, 1, 0.3, 0, -1, 750, 608, 250, 608);
        addDiagonal(this.enemies, 30, 5, 1, 0.07, 0, 1, 250, 0, 750, 0);
        */
        // Basic generation to test callibration
        for (var i = 1; i < 60; i++) {
            addDiagonal(this.enemies, i * 8, 4, 1, 0.1, -1, 0, 1024, 50, 1024, 250);
        }
        this.enemies = sortEnemies(this.beatRate, this.enemies);
    };

    window.DeepBeatLevels.Level1.prototype = _.extend(new Level(), {
        beatRate: bpmToBeatRate(82.49), // define the BPM of the song here

        tick: function() {
            this.spawnEnemies();
        }
    });

}(window));