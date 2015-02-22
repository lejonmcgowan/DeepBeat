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
}(window));