(function (window) {

    function Blackhole() {
        this.Container_constructor();

        this.collision = new createjs.Bitmap(new Image(5,5));
        this.collision.x = 0;
        this.collision.y = 0;
        this.collision.regX = 2;
        this.collision.regY = 2;
        this.addChild(this.collision);
        

        this.bitmap = new createjs.Bitmap(DeepBeat.preload.getResult("blackhole"));
        this.addChild(this.bitmap);
        this.on("tick", p.tick);
        this.bitmap.regX = 50;
        this.bitmap.regY = 50;
        this.x = DeepBeat.windowWidth/2;
        this.y = DeepBeat.windowHeight/2;
        this.direction = null;

        DeepBeat.addCollisionHandler(this, this.collision, "Enemy", function(other) {
            // TODO add fancy visual effects
            DeepBeat.removeObject(other);
            //DeepBeat.currentLevel.health.decrementHealth(10);
        });

    }
    var p = createjs.extend(Blackhole, createjs.Container);
    window.Blackhole = createjs.promote(Blackhole, "Container")

    p.tick = function (event) {
        this.rotation++;
        addPulseCircle(this);
    }

    window.BlackholeDistortX = function(x, y) {
        var ny = y - DeepBeat.windowHeight / 2;
        var nx = x - DeepBeat.windowWidth / 2;
        var dx = nx / (DeepBeat.windowWidth / 6);
        var dy = ny / (DeepBeat.windowHeight / 6);
        var d = dx * dx + dy * dy;
        //if(d > 5)
        //    return DeepBeat.windowWidth/2+nx * Math.pow(d/5, 3);
        if(d > 1)
            return x;
        return DeepBeat.windowWidth/2+nx*d;
    }

    window.BlackholeDistortY = function(x, y) {
        var ny = y - DeepBeat.windowHeight / 2;
        var nx = x - DeepBeat.windowWidth / 2;
        var dx = nx / (DeepBeat.windowWidth / 6);
        var dy = ny / (DeepBeat.windowHeight / 6);
        var d = dx * dx + dy * dy;
        //if(d > 5)
        //    return DeepBeat.windowHeight/2+ny * Math.pow(d/5, 3);
        if(d > 1)
            return y;
        return DeepBeat.windowHeight/2+ny*d;
    }

}(window));