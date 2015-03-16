var analyserNode; //node to get analysis data from 

var freqFloatData, freqByteData, timeByteData; // different bufffers for analyzer

var circle1, circle2;
var radius = 25;

var FFTSIZE = 64;
window.addEventListener("load", initAnalyser, false);
function initAnalyser()
{
	var context = createjs.Sound.activePlugin.context;

	// create an analyser node
	analyserNode = context.createAnalyser();
	analyserNode.fftSize = FFTSIZE;  //The size of the FFT used for frequency-domain analysis. This must be a power of two
	analyserNode.smoothingTimeConstant = 0.85;  //A value from 0 -> 1 where 0 represents no time averaging with the last analysis frame
	analyserNode.connect(context.destination);  // connect to the context.destination, which outputs the audio

	// attach visualizer node to our existing dynamicsCompressorNode, which was connected to context.destination
	var dynamicsNode = createjs.Sound.activePlugin.dynamicsCompressorNode;
	dynamicsNode.disconnect();  // disconnect from destination
	dynamicsNode.connect(analyserNode);

	// set up the arrays that we use to retrieve the analyserNode data
	freqFloatData = new Float32Array(analyserNode.frequencyBinCount);
	freqByteData = new Uint8Array(analyserNode.frequencyBinCount);
	timeByteData = new Uint8Array(analyserNode.frequencyBinCount);

	//make a test circle
	circle1 = new createjs.Shape();
	circle2 = new createjs.Shape();
}

function addPulseCircle(container)
{
	analyserNode.getFloatFrequencyData(freqFloatData);  // this gives us the dBs
	analyserNode.getByteFrequencyData(freqByteData);  // this gives us the frequency
	analyserNode.getByteTimeDomainData(timeByteData); 
	
	circle1.graphics.clear();
	circle2.graphics.clear();

	circle1.compositeOperation = "lighter";
	circle2.compositeOperation = "lighter";
	var red = parseInt(-freqFloatData[10]) * 2;
	var blue = parseInt(-freqFloatData[20]) * 2;
	var green = parseInt(-freqFloatData[30]) * 2;
	var opacity = 0.5;
	var color = 'rgba(' + red + ',' + blue + ',' + green + ',' + opacity + ')';
	//console.log(color);
	circle1.graphics.beginFill(color).drawCircle(0, 0, radius);
	circle1.scaleX = (blue - radius) / radius;
	//console.log(blue - radius);
	//console.log(circle1.scaleX)

	circle2.graphics.beginFill(color).drawCircle(0, 0, radius);
	circle2.scaleX = (blue - radius) / radius;
	circle2.rotation = circle1.rotation + 90;

	//console.log(blue - radius);
	//console.log(circle1.scaleX)

	container.addChild(circle1);
	container.addChild(circle2);

}