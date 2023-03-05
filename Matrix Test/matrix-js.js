

/****************************/

'use strict'


var RandomCharacterAnimation = function (options) {

	/**
	 * @default value for each parameters
	 *
	 */

	var defaults = {
		d_element: '',
		d_type: 'char',
		d_min: 10,
		d_max: 100,
		d_kerning: 10,
	}

	this.size;
	this.getLettersArray = [];
	this.getLettersChanges = [];
	this.kerningSize = [];
	this.currentChange = 0;
	this.char = 'abcdefghijklmnopqrstuvwxyz0123456789!?*()@￡$%^&_-+=[]{}:;\'"\\|<>,./~`×';
	this.charArray = [];
	this.requestId;


	// Create options by extending defaults with the passed in arguments
	if (arguments[0] && typeof arguments[0] === "object") {
		this.options = _extendDefaults(defaults, arguments[0]);
	}

}

/**
  * @function _extendDefaults
  * @description set defaults parameters if undefined
  * @param source 		| get defaults parameters
  * @param properties | choose & set the defaults
  * @private
  *
  */

function _extendDefaults(source, properties) {
	var property;
	for (property in properties) {
		if (properties.hasOwnProperty(property)) {
			source[property] = properties[property];
		}
	}
	return source;
}


RandomCharacterAnimation.prototype = {

	// Private functions

	/**
	 * @function _random
	 * @description generate a random number
	 * @param minNb & maxNb 	| allows to generate the number between 20 and 50 for example
	 * @private
	 *
	 */

	_random: function (minNb, maxNb) {
		return Math.floor(Math.random() * (maxNb - minNb) + minNb);
	},

	/**
	 * @function _getElementSize
	 * @description get the length of the DOM element and push in an array
	 * @param minNb & maxNb 	| allows to generate the number between 20 and 50 for example
	 * @private
	 *
	 */

	_getElementSize: function () {
		var i, thisLetter;
		var element_selected = document.querySelector(this.options.d_element).textContent;

		for (i in element_selected) {
			thisLetter = element_selected[i];
			this.getLettersArray.push(thisLetter);
		}
		return this.getLettersArray;

	},

	/**
	 * @function _setStructure
	 * @description display a span for every letter that will allow the animation
	 * @private
	 *
	 */

	_setStructure: function () {
		var element = document.querySelector(this.options.d_element);
		element.innerHTML = '';

		var i, j, characterContainer, thisContainer, array, kerningSize;

		for (i in this.getLettersArray) {
			characterContainer = document.createElement('span');
			array = this.getLettersArray[i];

			// display a whitespace
			if (array === ' ') {
				characterContainer.innerHTML = ' ';
			}

			characterContainer.classList.add('randomCharacter');
			element.appendChild(characterContainer);

			var letter = document.createTextNode(array);

			// ? one mooore hack ?
			characterContainer.appendChild(letter);
			characterContainer.style.opacity = '0';
		}

	},

	/**
	 * @function _setKerning
	 * @description adapt the letter spacing
	 * @description very useful if you're not using a monospace font
	 * @description don't try to delete this function
	 * @description except if you want new eyes
	 * @private
	 *
	 */

	_setKerning: function () {

		var kerning = this.options.d_kerning;
		var elem = document.querySelector(this.options.d_element);

		var i, j, thisContainer, array, kerningSize;

		for (i = 0; i < this.getLettersArray.length; i++) {
			j = i + 1; //hack
			thisContainer = elem.querySelector('.randomCharacter:nth-child(' + j + ')');
			thisContainer.style.padding = '0' + (Math.sqrt(kerning) / thisContainer.offsetWidth) + 'px';
			kerningSize = thisContainer.offsetWidth;
			this.kerningSize.push(kerningSize);
			thisContainer.style.width = kerningSize + 'px';
		}
	},

	/**
	 * @function _convertStringToArray
	 * @description transform every string to an array
	 * @description useful if you want to use your own character to generate the animation
	 * @param charType 	| type of character
	 * @private
	 *
	 */

	_convertStringToArray: function (charType) {
		var i, thisChar;
		for (i = 0; i < this.char.length; i++) {
			thisChar = this.char[i];
			this.charArray.push(thisChar);
		}
	},

	/**
	 * @function _setChange
	 * @description set when each letter will change until the end of the animation
	 * @private
	 *
	 */

	_setChange: function () {
		var i, setChange;

		for (i in this.getLettersArray) {
			setChange = this._random(this.options.d_min, this.options.d_max);
			this.getLettersChanges.push(setChange);
		}
	},

	/**
	 * @function _generateRandomCharacter
	 * @description the core of the animation
	 * @description generate a new character randomly
	 * @descritpion everytime the function is called
	 * @param charType 	| type of character
	 * @private
	 *
	 */

	_generateRandomCharacter: function () {

		var charType = this.options.d_type;
		var elem = document.querySelector(this.options.d_element);

		this.currentChange++;

		var chooseRandomLetter = this._random(0, this.getLettersArray.length);
		var generateContent, setContent, getChar;
		var changesPlaces = elem.querySelector('.randomCharacter:nth-child(' + (chooseRandomLetter + 1) + ')');

		if (charType === 'int') {
			generateContent = this._random(0, 9);
		} else if (charType === 'char') {
			getChar = this._random(0, this.charArray.length);
			generateContent = this.charArray[getChar];
		} else {
			getChar = this._random(0, charType.length);
			generateContent = charType[getChar];
		}

		changesPlaces.innerHTML = generateContent;
		changesPlaces.style.opacity = '1';
		elem.style.opacity = '1'

	},

	/**
	 * @function _checkNbChanges
	 * @description check the current number of changes
	 * @descritpion everytime the function is called
	 * @description and display the original letter asap.
	 * @private
	 *
	 */

	_checkNbChanges: function () {
		var i, j, k, thisChar, setContent, thisContainer;
		var elem = document.querySelector(this.options.d_element);

		for (i = 0; i < this.getLettersArray.length; i++) {
			j = i + 1; //hack
			thisChar = this.getLettersChanges[i];
			thisContainer = elem.querySelector('.randomCharacter:nth-child(' + j + ')');
			setContent = this.getLettersArray[i];

			if (this.currentChange > thisChar) {
				thisContainer.innerHTML = setContent;
			}
		}
	},

	/**
	 * @function _loop
	 * @description requestAnimationFrame
	 * @private
	 *
	 */

	_loop: function () {

		var self = this;

		this.requestId = requestAnimationFrame(function () {
			self._loop();

			if (self.currentChange > self.options.d_max) {
				self.stop();
			}

		});

		self._generateRandomCharacter(self.options.d_type);
		self._checkNbChanges();

	},

	// Public functions

	/**
	 * @function restart
	 * @description allows to restart the animation.
	 * @description useful for hover or else
	 * @param key 	| allows a key to restart the animation
	 * @default 		| false
	 * @public
	 *
	 */

	restart: function () {
		this.currentChange = 0;
		this._setChange();
		this._loop();
	},

	/**
	 * @function start
	 * @description trigger the animation
	 * @public
	 *
	 */

	start: function () {

		this._getElementSize();
		this._setStructure();
		this._setKerning();
		this._setChange();
		this._convertStringToArray();

		this._loop();

	},

	/**
	 * @function stop
	 * @description stop the requestAnimaionFrame #notEnoughObvious ? ?
	 * @public
	 *
	 */

	stop: function () {
		window.cancelAnimationFrame(this.requestId);
	}

};


// Single Usage - If you define the animation only for one element
var title = new RandomCharacterAnimation({
	d_element: '.random',
	d_kerning: 8000,
});

title.start();

/**
 * @example
 * @description usage of the plugin with a list of element in the same level
 *
 */

// Multiple Usage - For example for list
var animations = [
	{
		d_element: '.item-link1',
		d_min: 25,
		d_max: 50,
	},
	{
		d_element: '.item-link2',
		d_min: 25,
		d_max: 50,
	},
	{
		d_element: '.item-link3',
		d_min: 25,
		d_max: 50,
	},
	{
		d_element: '.item-link4',
		d_min: 25,
		d_max: 50,
	},
	{
		d_element: '.item-link5',
		d_min: 25,
		d_max: 50,
	}
]

var obj = [];

for (var optionsAnim in animations) {
	var random = new RandomCharacterAnimation(animations[optionsAnim]);
	random.start();
	obj.push(random);
}

/**
 * @function getIndexOfElementInParent
 * @param element 	| selected node element. best use is like is event.target.parentNode
 * because if you this function it means that most probably there are others same
 * element in the same level
 * @description this function get the index of the selected element
 * @public
 *
 */

function getIndexOfElementInParent(element) {
	var parent = element.parentNode;
	for (var index = 0; index <= parent.children.length - 1; index++) {
		if (parent.children[index] === element) {
			return index;
		}
	}
};

/**
 * @function newEvent
 * @param selected_element_class 	| this is too obvious, and it's a string.
 * @param _event 					| event, for example 'mouseenter'
 * @description this function is just an example. Feel free to
 * create your own function
 * @public
 *
 */

function newEvent(selected_element_class, _event) {
	var items = document.querySelectorAll(selected_element_class);
	for (var i = 0; i <= items.length - 1; i++) {
		items.item(i).addEventListener(_event, function (event) {
			// call getIndexOfElementInParent
			var currentItemIndex = getIndexOfElementInParent(event.target.parentNode)
			obj[currentItemIndex].restart();
		}, false);
	}
};

newEvent('.item-link', 'mouseenter');



/********************************/
var container;
var canvas;
var ctx;

// Keeps track of all x positions that
// are taken
var takenXPos;

// Number of x positions that exist
var numXPos;
// Number of y positions to create above screen
var numYPos;

// Size of each character
var charSize;
// Size of each column
var columnSize;

// Contains the japanese hiragana 
// characters to be used in drops
var CHARACTERS;

// Character fill styles
// 0: white
// 1: gray: rgb(179,178,179)
// 2: gray: rgb(112,111,112)
// 3: white-green: rgb(88,106,94)
// 4: green: rgb(29,98,32)
// 5: -0.2 opacity
// 6: -0.4 opacity
// 7: -0.6 opacity
// 8: -0.8 opacity
// 9: 0 opacity
var FILL_STYLES;

/*----- DROP -----*/
// Number of Chars in each drop; (number of rows in screen * 2) - (number of rows in
// screen * 4)
var dropLength;
// Characters in the drop
var dropChars;
// Char to fade
var fadeIndex;
// Number of characters to fade
var numToFade;
// The x position of the drop
var dropXPos;
// The starting y position of the drop
var initDropYPos;

/*----- CHAR -----*/
// The character of the Char
var char;
// X position of char
var xPos;
// Y position of char
var yPos;
// Char fill style
var fillStyle;
// Char fill style number
var fillStyleIndex;
// Char index in drop
var index;

// Create and initialize canvas
container = document.getElementById("matrix-js");
container.innerHTML = "<canvas id='canvas'></canvas>";
canvas = document.getElementById("canvas");
canvas.width = container.offsetWidth;
canvas.height = container.offsetHeight;
ctx = canvas.getContext("2d");

FILL_STYLES = [];
FILL_STYLES[0] = "rgba(255,255,255,1)";
FILL_STYLES[1] = "rgba(179,178,179,1)";
FILL_STYLES[2] = "rgba(112,111,112,1)";
FILL_STYLES[3] = "rgba(88,106,94,0.8)";
FILL_STYLES[4] = "rgba(29,98,32,0.5)";
FILL_STYLES[5] = "rgba(29,98,32,0.4)";
FILL_STYLES[6] = "rgba(29,98,32,0.3)";
FILL_STYLES[7] = "rgba(29,98,32,0.2)";
FILL_STYLES[8] = "rgba(29,98,32,0.1)";
FILL_STYLES[9] = "rgba(29,98,32,0)";

CHARACTERS = "MMT";

charSize = 15;

numXPos = Math.ceil(canvas.width / charSize);
numYPos = Math.ceil((canvas.height * 3) / charSize);

ctx.font = "bold " + charSize + "px Arial";

takenXPos = [];

rainAnimate();

// Constructor for a single character
function Char(xPosition, yPosition, index) {
	this.char = CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
	this.xPos = xPosition;
	this.yPos = yPosition;
	this.index = index;
	this.fillStyle = FILL_STYLES[0];
	this.fillStyleIndex = 0;
}

// Constructor for a single rain drop
function Drop() {
	// this.dropLength = Math.floor(Math.random() * ((((canvas.height / charSize) * 2) - (canvas.height / charSize)) + 1)) + (canvas.height / charSize);
	this.dropLength = Math.floor(Math.random() * ((((canvas.height / charSize) * 3) - (canvas.height / charSize)) + 1)) + (canvas.height / charSize);
	this.dropChars = [];
	this.fadeIndex = 0;
	this.numToFade = 1;
	this.initDropYPos = 0 - (Math.round(Math.random() * numYPos) * charSize);
	// Generate random x position that is not taken
	this.dropXPos = Math.round(Math.random() * numXPos) * charSize;
	while (isXTaken(this.dropXPos)) {
		this.dropXPos = Math.round(Math.random() * numXPos) * charSize;
	}
	takenXPos.push(this.dropXPos);
}

// Complete rain animation
function rainAnimate() {
	// Contains all drops
	var drops;

	// The minimum number of drops; 80% of the number of
	// x positions
	var minNumDrops;
	// The maximum number of drops; the number of x positions
	var maxNumDrops;
	// The number of drops
	var numDrops;
	var changeInterval;

	minNumDrops = Math.ceil(0.8 * numXPos);
	maxNumDrops = numXPos;

	numDrops = Math.floor(Math.random() * ((maxNumDrops - minNumDrops) + 1)) + minNumDrops;
	drops = [];
	for (var n = 0; n < numDrops; n++) {
		drops[n] = new Drop();
	}

	drawChars(drops);

	// Interval for randomly changing a random character
	// in all drops
	changeInterval = setInterval(function () {
		var indexToChange = [];
		var randomChar = [];

		for (var d = 0; d < drops.length; d++) {
			if (drops[d].dropChars.length == 0) {
				break;
			}
			indexToChange[d] = Math.floor(Math.random() * drops[d].dropChars.length);
			randomChar[d] = CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));

			drops[d].dropChars[indexToChange[d]].char = randomChar[d];
		}
	}, 30);
}

// Draws all drop characters
function drawChars(drops) {
	// Reset canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Iterate through each drop. At each iteration
	// add a new character to the drop. Change the style
	// to add white to green effect in the front, and
	// fading to black tail. Draw all characters then reset
	// every drop whose tail reaches the bottom of the screen
	for (var n = 0; n < drops.length; n++) {
		var drop = drops[n];

		// Add new character
		if (drop.dropChars.length == 0) {
			drop.dropChars[0] = new Char(drop.dropXPos, drop.initDropYPos, 0);
		}
		else {
			var previousChar = drop.dropChars[drop.dropChars.length - 1];
			drop.dropChars[previousChar.index + 1] = new Char(drop.dropXPos, previousChar.yPos + charSize, previousChar.index + 1);
		}

		// Create white fading to green front
		if (drop.dropChars.length > 1) {
			var currentChar;
			var currentFillStyle;
			for (currentChar = drop.dropChars.length - 1, currentFillStyle = 0; currentChar >= 0 && currentFillStyle < 5; currentFillStyle++, currentChar--) {
				drop.dropChars[currentChar].fillStyleIndex = currentFillStyle;
				drop.dropChars[currentChar].fillStyle = FILL_STYLES[currentFillStyle];
			}
		}

		// Fade tail
		if (drop.dropChars.length > drop.dropLength) {
			if (drop.dropChars[drop.fadeIndex].fillStyleIndex > 8) {
				drop.fadeIndex++;
			}

			for (var f = 0; f < drop.numToFade && drop.fadeIndex + f < drop.dropChars.length; f++) {
				drop.dropChars[drop.fadeIndex + f].fillStyleIndex++;
				drop.dropChars[drop.fadeIndex + f].fillStyle = FILL_STYLES[drop.dropChars[drop.fadeIndex + f].fillStyleIndex];
			}
			drop.numToFade++;
		}

		// Draw all chars
		for (var c = 0; c < drop.dropChars.length; c++) {
			ctx.fillStyle = drop.dropChars[c].fillStyle;
			ctx.fillText(drop.dropChars[c].char, drop.dropChars[c].xPos, drop.dropChars[c].yPos);
		}

		// Reset drop
		// Remove from taken x pos when done
		//if (drop.fadeIndex > (canvas.height/ charSize)) {
		if (drop.dropChars[drop.fadeIndex].yPos > canvas.height) {
			var indexOfXPos = takenXPos.indexOf(drop.dropXPos);
			takenXPos.splice(indexOfXPos, 1);

			drops[n] = new Drop();
		}
	}

	// Animate drops
	setTimeout(function () {
		requestAnimationFrame(function () {
			drawChars(drops);
		});
	}, 50);
}

// Checks if x position is taken
function isXTaken(xCheck) {
	if (takenXPos.indexOf(xCheck) != -1) {
		return true;
	}
	else {
		return false;
	}
}
