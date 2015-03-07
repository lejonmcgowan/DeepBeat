(function (window) {

    function Background(size, speed) {
        this.Container_constructor();
        this.addChild(new Stars());
        this.addChild(new Planet((Math.random()+0.8)*160,(Math.random()+0.8)*160));
        this.addChild(new Planet((Math.random()+0.8)*300,(Math.random()+0.8)*300));
        this.time = 0;

        this.on("tick", this.tick);
    }

    var p = createjs.extend(Background, createjs.Container);
    window.Background = createjs.promote(Background, "Container");

    p.tick = function() {
        this.time += DeepBeat.dt/5000;
        if(DeepBeat.currentLevel.health) {
            if(DeepBeat.currentLevel.health.health < 40) {
                this.setOverlayColor("rgb("+Math.round(Math.cos(this.time*30)*50 + 50)+",0,0)");
            } else {// if(DeepBeat.currentLevel.health.health < 60) {
                this.setOverlayColor("rgb(0,0,0)");
            }// else {
            //    this.setOverlayColor("rgb(20,"+Math.round(Math.sin(this.time)*20+20)+","+Math.round(Math.cos(this.time)*20+20)+")");
            //}
        }

    };

    p.setOverlayColor = function(color) {
        DeepBeat.canvas.style.backgroundColor = color;
    };

}(window));