(function (window) {

    function Planet(size, speed) {
        this.Container_constructor();

        this.size = size;
        this.speed = speed;
        this.circleX = 0;
        this.circleY = 0;
        this.time = 0;
        this.alpha = 0.3;

        this.circles = [];
        for(var a = 0; a < size; a += 50) {
            var circle = new createjs.Shape();
            circle.graphics.clear();
            var s = Math.sqrt((size)*(size) - (a*a));
            circle.graphics.beginFill("rgba("+60+","+60+","+Math.round(60+127*a/size)+", 0.1)");
            circle.graphics.drawEllipse((size - s)/2, (size - s)/2, s, s);
            circle.graphics.beginStroke("rgb("+60+","+60+","+Math.round(60+127*a/size)+")");
            circle.graphics.setStrokeStyle(2);
            circle.graphics.drawEllipse((size - s)/2, (size - s)/2, s, s);
            this.addChild(circle);
            this.circles.push(circle);
            circle.x = DeepBeat.windowWidth / 2;
            circle.y = DeepBeat.windowHeight / 2;
            circle.regX = size / 2;
            circle.regY = size / 2;
        }

        this.on("tick", this.tick);
    }

    var p = createjs.extend(Planet, createjs.Container);
    window.Planet = createjs.promote(Planet, "Container");

    p.tick = function() {

        this.time += DeepBeat.dt/50000;

        this.circleX = DeepBeat.windowWidth*Math.sin(this.time*2.6)*Math.cos(this.time);
        this.circleY = DeepBeat.windowWidth*Math.sin(this.time*2.6)*Math.sin(this.time);

        for(var i = 0; i < this.circles.length; i++) {
            this.circles[i].x = DeepBeat.windowWidth / 2 + this.circleX * (i + 40) / 50;
            this.circles[i].y = DeepBeat.windowHeight / 2 + this.circleY * (i + 40) / 50;
        }
    };

}(window));