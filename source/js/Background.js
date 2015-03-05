(function (window) {

    function Background(size, speed) {
        this.Container_constructor();
        this.addChild(new Planet((Math.random()+0.5)*300,(Math.random()+0.5)*300));
        this.addChild(new Stars());

        this.on("tick", this.tick);
    }

    var p = createjs.extend(Background, createjs.Container);
    window.Background = createjs.promote(Background, "Container");

    p.tick = function() {

    };

}(window));