var analyserNode; //node to get analysis data from 

var freqFloatData, freqByteData, timeByteData; // different bufffers for analyzer

var circle;

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
	circle = new createjs.Shape();
}

function addPulseCircle(container)
{
	analyserNode.getFloatFrequencyData(freqFloatData);  // this gives us the dBs
	analyserNode.getByteFrequencyData(freqByteData);  // this gives us the frequency
	analyserNode.getByteTimeDomainData(timeByteData); 
	
	circle.graphics.clear();

	circle.compositeOperation = "lighter";
	var red = parseInt(-freqFloatData[10]) * 2;
	var blue = parseInt(-freqFloatData[20]) * 2;
	var green = parseInt(-freqFloatData[30]) * 2;
	var opacity = 0.5;
	var color = 'rgba(' + red + ',' + blue + ',' + green + ',' + opacity + ')';
	console.log(color);
	circle.graphics.beginFill(color).drawCircle(0, 0, 25);

	container.addChild(circle);

}