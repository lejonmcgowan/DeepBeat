(function (window) {
	var width;
	var height = 180;

 	function DialogBox(text,canvasWidth, time, stage)
 	{
 		console.log("TEXT: " + text);
		this.Container_constructor();

 		this.y = DeepBeat.windowHeight - height;
 		this.removeAllChildren();
 		this.name = "DialogBox";
 		this.alpha = 0;
 		this.setBounds(this.x, this.y, canvasWidth, height);

 		width = canvasWidth;

 		var rectDialogBox = new createjs.Graphics().f("rgba(60,60,175,1.0)").rc(0,0,width, height,50,50,50,50);
 		var rectangle = new createjs.Shape(rectDialogBox); 	

 		var textContainer = new createjs.Container();
 		textContainer.x = 320;
 		textContainer.y = 30;

 		

 		var textInDialog = new createjs.Text(text, "20px Arial", "#ff7700");
        textInDialog.textBaseline = "middle";
        textInDialog.textAlign = "center";
        textInDialog.lineWidth = 560;

 		textContainer.addChild(textInDialog);

 		var dialogWindow = this;
 		createjs.Tween.get(dialogWindow).to({alpha: 1}, 1000);
 		this.addChild(rectangle, textContainer);
 		this.currentTimeCreation = createjs.Ticker.getTime();
 		this.tick =  function(event)
 		{
 			if(createjs.Ticker.getTime() - dialogWindow.currentTimeCreation > time * 1000)
 			{
 				createjs.Tween.get(dialogWindow).to({alpha: 0}, 1000);
 				if(dialogWindow.alpha <= 0)
 				{
 					var success = stage.removeChild(dialogWindow);
 					event.remove();
 				}
 			}
 		}

 		createjs.Ticker.on("tick", this.tick, this);

 	}

 	 var p = createjs.extend(DialogBox, createjs.Container);
     window.DialogBox = createjs.promote(DialogBox, "Container")

}(window));