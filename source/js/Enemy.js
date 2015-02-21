(function (window) {

    function Enemy() {
        this.Container_constructor();

        this.addChild(new createjs.Bitmap(DeepBeat.preload.getResult("gun")));
        this.on("tick", p.tick);
        this.x = 1024;
        this.y = Math.random() * 600;

        DeepBeat.addCollisionType(this, "Enemy");
    }
    var p = createjs.extend(Enemy, createjs.Container);
    window.Enemy = createjs.promote(Enemy, "Container")

    p.tick = function (event) {
        this.x -= 3;
    }
    
}(window));