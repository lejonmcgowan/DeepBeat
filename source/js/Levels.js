(function (window) {

    var Level = function(stage) {
        this.stage = stage;
    };

    Level.prototype = {
        spawnEnemies: function() {
            if(this.enemies.length && this.music.getPosition() > this.enemies[0].time) {
                this.stage.addChild(new this.enemies[0].type());
                this.enemies.splice(0,1);
            }
        },

        stage: null,
        enemies: [],
        music: null,

        tick: function() {},

        end: function() {}
    }

    window.DeepBeatLevels = {};

    window.DeepBeatLevels.Level1 = function(stage) {
        Level.apply(this, [stage]);
        stage.addChild(new Gun());
        this.music = createjs.Sound.play("music");
    };

    window.DeepBeatLevels.Level1.prototype = _.extend(new Level(), {
        enemies: [{
            time: 0,
            type: Enemy
        }, {
            time: 100,
            type: Enemy
        }, {
            time: 400,
            type: Enemy
        }],

        tick: function() {
            this.spawnEnemies();
        }
    });

}(window));