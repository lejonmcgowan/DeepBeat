(function (window) {

    function SpaceStation() {
        this.Container_constructor();

        this.collision = new createjs.Bitmap(new Image(5,5));
        this.collision.x = 0;
        this.collision.y = 0;
        this.collision.regX = 2;
        this.collision.regY = 2;
        this.addChild(this.collision);
        
        this.x = DeepBeat.windowWidth/2;
        this.y = DeepBeat.windowHeight/2;

        DeepBeat.addCollisionHandler(this, this.collision, "Enemy", function(other) {
            DeepBeat.removeObject(other);
            DeepBeat.currentLevel.health.decrementHealth(10);
        });

    }
    var p = createjs.extend(SpaceStation, createjs.Container);
    window.SpaceStation = createjs.promote(SpaceStation, "Container")

    p.tick = function (event) {
        this.rotation++;
        //addPulseCircle(this);
    }

}(window));