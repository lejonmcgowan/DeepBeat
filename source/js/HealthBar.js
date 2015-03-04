(function (window) {

    function HealthBar() {
        this.Container_constructor();

        // Point of rotation (center of image)
        this.x = 50;
        this.y = 50;

        

        this.bar = new createjs.Shape();
        this.addChild(this.bar);

        this.setHealth(100);
    }

    var p = createjs.extend(HealthBar, createjs.Container);
    window.HealthBar = createjs.promote(HealthBar, "Container")

    p.tick = function (event) {
    }

    p.setHealth = function(health) {
        this.health = health;
        if(this.health <= 0) {
            DeepBeat.currentLevel.lostLevel();
            return;
        }
        this.bar.graphics.clear();
        this.bar.graphics.beginFill("rgba("+parseInt((100-health)*2.55)+","+parseInt((health)*2.55)+",0,1)");
        this.bar.graphics.drawRect(0,0,health,20);
    }

    p.decrementHealth = function(dh) {
        this.setHealth(this.health - dh);
    }

    p.incrementHealth = function(dh) {
        var incr = Math.min(100, this.health + dh);
        this.setHealth(incr);
    }

}(window));