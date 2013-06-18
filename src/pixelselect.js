/*! jQuery Pixel Select - v0.5.5 - 2013-06-18
* https://github.com/Bahlor/jQuery-Pixel-Related-Object-Selection
* Copyright (c) 2013 Christian Weber; Licensed MIT */
/*jshint devel:true */
;(function ($, window, document, undefined) {
	"use strict";

    // Default
    var pluginName = "Pixelselect";
    var defaults = {
        over:		null,
        out:		null,
        click:		null,
        ready:		null,
        type:		'img',
        precalc:	true,
        sublayers:	false,
        maxsubs:	5,
        tolerance:	40,
        debug:		false
    };

    // The actual plugin constructor
    function Pixelselect(element, options) {
		/*jshint validthis:true */
		this.element = element;

        this.options	=	$.extend({}, defaults, options);
        this._defaults	=	defaults;
        this._name		=	pluginName;
        this.pixelmap	=	[];
        this.image		=	new Image();
        this.ctx		=	null;
        this.init();
    }

    Pixelselect.prototype = {
        init: function () {
            // check if canvas exists, if not... go no further
            var cv = document.createElement('canvas');
            if(!cv.getContext) {
				console.log('Error: browser does not support canvas');
				return;      
            }
            
            // does the current element overwrite precalc via data attribute?
            if($(this.element).data('precalc') !== undefined) {
				this.options['precalc']	=	($(this.element).data('precalc') === true)	?	true:false;
            }
            
            // does the current element overwrite precalc via data attribute?
            if($(this.element).data('sublayers') !== undefined) {
				this.options['sublayers']	=	($(this.element).data('sublayers') === true)	?	true:false;
            }
            
            // does the current element overwrite tolerance via data attribute?
            if($(this.element).data('tolerance') !== undefined && parseInt($(this.element).data('tolerance'),null) >= 0) {
				this.options['tolerance']	=	parseInt($(this.element).data('tolerance'),null);
            }
            
            // does the current element overwrite the maximum of sublayers via data attribute?
            if($(this.element).data('maxsubs') !== undefined && parseInt($(this.element).data('maxsubs'),null) >= 0) {
				this.options['maxsubs']	=	parseInt($(this.element).data('maxsubs'),null);
            }
            
            this.checkSrcType();
        },
        checkSrcType:	function() {
			var el	=	$(this.element);
			// check for src
			if(el.attr('src') !== undefined && el.attr('src') !== '') {
				this.image.src	=	el.attr('src');
			} else {
				// check for data-img
				if(el.data('img') && el.data('img').length > 4) {
					this.image.src	=	el.data('img');
				} else {
					// check for background-image
					if(el.css('background-image') && el.css('background-image') !== '') {
						this.options['type']	=	'bg';
						this.image.src	=	el.css('background-image').replace('url(','').replace(')','');
					}
				}
			}
			// launch pixel map generation after image has been loaded
			if(this.image.src !== '') {
				this.image.onload	=	this.generatePixelMap();
			}
		},
		getCanvasRenderer:function() {
			// TODO 
			// check if image has been loaded already and reuse pixelmap
			// instead of recalculating
			
			// create background canvas
			var canvas		=	document.createElement('canvas');
			canvas.width	=	this.image.width;
			canvas.height	=	this.image.height;
			// get rendering object for canvas
			var ctx			=	canvas.getContext('2d');
			// draw image on canvas
			ctx.drawImage(this.image,0,0);
			// if debug is activated attach canvas to body
			if(this.options['debug'] === true) {
				$(canvas).appendTo('body');
			}
			// return pixeldata of the whole image
			return	ctx;
		},
		generatePixelMap: function () {
			// prevent generating of pixels if image is not yet loaded
			// occured a few times even with onload function of Image
			
			if(!this.image.complete) {
				var _this	=	this;
				setTimeout(function() { _this.generatePixelMap(); },500);
				return;
			}
			// fetch the canvas renderer
			this.ctx	=	this.getCanvasRenderer();

			// precalculate pixelmap?
			if(this.options['precalc'] === true) {
				var _start	=	(new Date()).getTime();
				// loop through pixels and fill pixelmap array
				for(var x=0;x<this.image.width;x++) {
					for(var y=0;y<this.image.height;y++) {
						// get image data of x/y pixel
						var _pixeldata	=	this.ctx.getImageData(x,y,1,1);
						// if pixel is not transparent, add it to our pixelmap
						if(_pixeldata.data[3] > this.options['tolerance']) {
							if(this.pixelmap[x] === undefined) {
								this.pixelmap[x]	=	[];
							}
							this.pixelmap[x][y]	=	true;
						}
					}
				}
				var _end	=	(new Date()).getTime();
				if(this.options['debug'] === true) {
					console.log('Pixel map of '+this.image.src+' generated in '+(_end-_start)+' ms');
				}
			}
            
			// exec callback function if it exists
			if(this.options['ready'] !== null) {
				// callback function(element)
				this.options['ready']($(this.element));
			}
            
			this.attachEvents();
		},
		checkPixel:		function(x,y) {
			// get position of current element
			var pos	=	$(this.element).offset();

			// get the position of mouse on the current element
			x	=	x-pos.left,
			y	=	y-pos.top;

			// if this element is using precalc, get data from array, else use canvas
			if(this.options['precalc'] === true) {
				return (this.pixelmap[x] !== undefined && this.pixelmap[x][y] !== undefined && this.pixelmap[x][y] === true) ? true:false;
			} else {
				// outside of possible range? break
				if(x === undefined || x <= 0 || y === undefined || y <= 0 || x > this.image.width || y > this.image.height) {	return false; }
				// get pixeldata of position
				var _data	=	this.ctx.getImageData(x,y,1,1);
				return (_data.data[3] > this.options['tolerance']) ? true:false;
			}
		},
		checkSubLayers:		function(x,y,ev,event) {
			// hide this element so its not been found by the elementfrompoint function
			$(this.element).hide();
			// build array of sublayers
			var sublayers	=	[],
				lastSub		=	false,
				subs		=	0;
			// loop through sublayers
			while(lastSub===false) {
				// find elements by coordinates
				var el	=	document.elementFromPoint(x,y);

				// trigger subcheck event
				var returned	=	$(el).triggerHandler('subcheck', [ x,y ]);

				// is a valid return?
				if(returned !== undefined) {
					// not on transparent area or no more valid sublayer existent?
					lastSub	=	returned;
					// add element to sublayer array
					sublayers.push(el);
				}

				// prevent endloss loop, if maximum is reached, break loop
				if(lastSub !== true && subs >= this.options['maxsubs']) {
					lastSub = true;
				}
				// count loops up
				subs++;
			}
			// if sublayers exists, trigger event on last sublayer
			if(sublayers.length > 0) {
				$(sublayers[sublayers.length-1]).trigger(event,[x,y]);
			}

			// return element to its normal state
			$(this.element).show();
		},
		subcheckSubLayers:	function(ev,x,y) {
			// check if it is a hit
			var hit	=	this.checkPixel(x,y);
			// we got a hit? search no further
			if(hit	===	false)	{	return false;	}

			// hide this element so its not been found by the elementfrompoint function
			$(this.element).hide();
			// get the element of the current cursor point
			// and trigger the subcheck event
			var elements	=	document.elementFromPoint(x,y),
				_returned	=	$(elements).triggerHandler('subcheck',[x,y]);
			// return element to its normal state
			$(this.element).show();
			// return the value of subcheck event
			return (_returned !== undefined && _returned !== false) ? true:false;
		},
		attachEvents:	function() {
			var el		=	$(this.element),
				_this	=	this;

			// attach click event
			el.on('click', function(ev,x,y)			{	_this._click(ev,x,y);					});

			// attach hover event
			el.on('mousemove', function(ev,x,y)		{	_this._over(ev,x,y);					});
			el.on('mouseout', function(ev,x,y)		{	_this._out(ev,x,y);						});

			// attach special event to check if a sublayer of a sublayer exists
			el.on('subcheck', function(ev,x,y)		{	return _this.subcheckSubLayers(ev,x,y);	});
		},
		// events
		_click:			function(ev,_x,_y) {
			console.log(this.image.src+' was clicked',ev);
			var x	=	(_x===undefined) ? ev.pageX:_x,
				y	=	(_y===undefined) ? ev.pageY:_y,
				hit = this.checkPixel(x,y,ev);
			// if transparent pixel and sublayers is active, 
			// check whether or not objects are behind this object
			if(hit!==true && this.options['sublayers']	===	true) {
				this.checkSubLayers(x,y,ev,'click');
			}

			// exec callback function if it exists
			if(this.options['click'] !== null) {
				// callback function(event, element, hit)
				this.options['click'](ev,$(this.element),hit);
			}
			
			ev.preventDefault();
		},
		_over:			function(ev,_x,_y) {
			var x	=	(_x===undefined) ? ev.pageX:_x,
				y	=	(_y===undefined) ? ev.pageY:_y,
				hit = this.checkPixel(x,y,ev);
			// if transparent pixel and sublayers is active, 
			// check whether or not objects are behind this object
			if(hit!==true && this.options['sublayers']	===	true) {
				this.checkSubLayers(x,y,ev,'mousemove');
			}

			// exec callback function if it exists
			if(this.options['over'] !== null) {
				// callback function(event, element, hit)
				this.options['over'](ev,$(this.element),hit);
			}
			
			ev.preventDefault();
		},
		_out:			function(ev,_x,_y) {
			var x	=	(_x===undefined) ? ev.pageX:_x,
				y	=	(_y===undefined) ? ev.pageY:_y,
				hit	=	this.checkPixel(x,y,ev);

			if(hit!==true && this.options['sublayers']	===	true) {
				this.checkSubLayers(x,y,ev,'mouseout');
			}

			// exec callback function if it exists
			if(this.options['out'] !== null) {
				// callback function(event, element, hit)
				this.options['out'](ev,$(this.element),hit);
			}
			
			ev.preventDefault();
		}
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Pixelselect(this, options));
			}
		});
	};

})(jQuery, window, document);