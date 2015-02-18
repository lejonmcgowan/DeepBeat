(function (window) {

    function Gun() {
        this.Container_constructor();
        this.addChild(new createjs.Bitmap(DeepBeat.preload.getResult("gun")));
        this.on("tick", p.tick);

        DeepBeat.addKeyHandler(this, "key-right", this.test);
        
    }
    var p = createjs.extend(Gun, createjs.Container);
    window.Gun = createjs.promote(Gun, "Container")

    p.tick = function (event) {
        this.x += 3;
        this.y += 3;
    }

    p.test = function (event) {
        this.x -= 5;
        if(this.x > 100) {
            removeObject(this);
            console.log("what");
        }
    }


}(window));