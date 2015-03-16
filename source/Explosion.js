(function (window) {

    function Explosion(x, y, size, time) {
        this.Container_constructor();

        // Point of rotation (center of image)
        this.x = x;
        this.y = y;

        this.maxSize = size;
        this.size = 0;
        this.time = time;

        this.shape = new createjs.Shape();

        this.addChild(this.shape);

        this.on("tick", this.tick);
        this.dead = false;
    }

    var p = createjs.extend(Explosion, createjs.Container);
    window.Explosion = createjs.promote(Explosion, "Container")

    p.tick = function (event) {
        this.size += this.maxSize / this.time * DeepBeat.dt;
        this.shape.graphics.clear().beginFill("rgba(255,"+Math.round(this.size/this.maxSize*255)+",0,"+(1-this.size/this.maxSize)+")");
        this.shape.graphics.drawCircle(0,0,this.size);
        if(this.size > this.maxSize) {
            this.dead = true;
            DeepBeat.removeObject(this);
        }
    }


}(window));