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

            while(this.enemies.length && (position + this.enemies[0].type.prototype.timeToSound()) > this.enemies[0].beat * this.beatRate) {
                this.stage.addChild(new this.enemies[0].type(this.enemies[0].params));
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
        beatRate: 1000,

        enemies: [{
            beat: 6,
            type: Enemy,
            params: []
        }, {
            beat: 7,
            type: Enemy,
            params: []
        }, {
            beat: 10,
            type: Enemy,
            params: []
        }],

        tick: function() {
            this.spawnEnemies();
        }
    });

}(window));