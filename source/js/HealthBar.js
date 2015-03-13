(function (window) {

    function HealthBar() {
        this.Container_constructor();

        // Point of rotation (center of image)
        this.x = 50;
        this.y = 50;

        

        this.bar = new createjs.Shape();
        //this.addChild(this.bar);

        this.setHealth(100);

        this.explosion = null;
        this.explosionTimer = 0;
        this.nextExplosion = 0;
        this.explosions = [];

        this.on("tick", this.tick);
    }

    var p = createjs.extend(HealthBar, createjs.Container);
    window.HealthBar = createjs.promote(HealthBar, "Container")

    p.tick = function (event) {
        if(this.explosion) {
            this.nextExplosion -= DeepBeat.dt;
            if(this.nextExplosion<0) {
                this.explosion = new Explosion(DeepBeat.windowWidth/2,DeepBeat.windowHeight/2,DeepBeat.windowWidth,2000);
                DeepBeat.addObject(this.explosion);
                this.explosions.push(this.explosion);
                this.nextExplosion = 200;
            }
            this.explosionTimer -= DeepBeat.dt;
            if(this.explosionTimer < 0) {
                DeepBeat.currentLevel.lostLevel();
                // add the explosions back on top of the menu after losing
                for(var i = 0; i < this.explosions.length; i++) {
                    if(!this.explosions[i].dead) {
                        DeepBeat.addObject(this.explosions[i]);
                    }
                }
            }
            if(DeepBeat.currentLevel.music) {
                DeepBeat.currentLevel.music.setVolume(this.explosionTimer/2000);
            }
        }
    }

    p.setHealth = function(health) {
        this.health = health;
        if(this.health <= 0 && !this.explosion && !DeepBeat.currentLevel.won) {
            this.explosion = new Explosion(DeepBeat.windowWidth/2,DeepBeat.windowHeight/2,DeepBeat.windowWidth,2000);
            DeepBeat.addObject(this.explosion);
            this.explosions.push(this.explosion);
            this.explosionTimer = 2000;
            this.nextExplosion = 200;
        }

        //this.bar.graphics.clear();
        //this.bar.graphics.beginFill("rgba("+parseInt((100-health)*2.55)+","+parseInt((health)*2.55)+",0,1)");
        //this.bar.graphics.drawRect(0,0,health,20);
    }

    p.decrementHealth = function(dh) {
        this.setHealth(this.health - dh);
    }

    p.incrementHealth = function(dh) {
        var incr = Math.min(100, this.health + dh);
        this.setHealth(incr);
    }

}(window));