(function (window) {

    var spawnEnemies = function(enemies, time, stage) {
        if(enemies.length && time > enemies[0].time) {
            stage.addChild(new enemies[0].type());
            enemies.splice(0,1);
        }
    };

    window.DeepBeatLevels = {
        level1: {
            start: function(stage) {
                this.stage = stage;
                stage.addChild(new Gun());
            },

            end: function() {},

            time: 0,

            tick: function() {
                this.time++;
                spawnEnemies(this.enemies, this.time, this.stage);
            },

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

            music: null,
            musicData: null
        }
    };
}(window));