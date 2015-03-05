(function (window) {

    function Stars(size, speed) {
        this.Container_constructor();
        
        this.stars = [];
        for(var i = 0; i < 25; i++) {
            var star = new createjs.Shape();
            star.graphics.clear();
            star.graphics.beginFill("#ffffff");
            star.graphics.drawCircle(0,0,Math.random()*5);
            this.addChild(star);
            this.stars.push(star);
            star.alpha = Math.random();
            star.sd = Math.random() + 1;
            star.sx = Math.random() * DeepBeat.windowWidth;
            star.sy = Math.random() * DeepBeat.windowHeight;
            this.time = 0;
        }

        this.on("tick", this.tick);
    }

    var p = createjs.extend(Stars, createjs.Container);
    window.Stars = createjs.promote(Stars, "Container");

    p.tick = function() {
        this.time += DeepBeat.dt / 5000;
        var x = Math.cos(this.time) * 100;
        var y = Math.sin(this.time) * 100;

        for(var i = 0; i < this.stars.length; i++) {
            this.stars[i].x = (this.stars[i].sd * x) + this.stars[i].sx;
            this.stars[i].y = (this.stars[i].sd * y) + this.stars[i].sy;
        }
    };

}(window));