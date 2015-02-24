(function (window) {

    function Blackhole() {
        this.Container_constructor();

        // Point of rotation (center of image)
        this.regX = 50;
        this.regY = 50;

        this.bitmap = new createjs.Bitmap(DeepBeat.preload.getResult("blackhole"));
        this.addChild(this.bitmap);
        this.on("tick", p.tick);
        this.x = DeepBeat.windowWidth/2;
        this.y = DeepBeat.windowHeight/2;
        this.direction = null;

        DeepBeat.addCollisionHandler(this, this.bitmap, "Enemy", function(other) {
            // TODO add fancy visual effects
            DeepBeat.removeObject(other);
        });
    }
    var p = createjs.extend(Blackhole, createjs.Container);
    window.Blackhole = createjs.promote(Blackhole, "Container")

    p.tick = function (event) {
        this.rotation++;
    }

    window.BlackholeDistortX = function(x, y) {
        var ny = y - DeepBeat.windowHeight / 2;
        var nx = x - DeepBeat.windowWidth / 2;
        var dx = nx / (DeepBeat.windowWidth / 6);
        var dy = ny / (DeepBeat.windowHeight / 6);
        var d = dx * dx + dy * dy;
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
        if(d > 1)
            return y;
        return DeepBeat.windowHeight/2+ny*d;
    }

}(window));