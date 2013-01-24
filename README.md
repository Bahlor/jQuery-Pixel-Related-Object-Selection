![Plugin Header](http://www.cw-internetdienste.de/pixelselection/header.jpg)
jQuery-Pixel-Related-Object-Selection
=====================================

This script is not only working with images, but also working with background-images. If applied on an image it will use the src path, else it will test if data-img or background-image exists and use those instead.

[View Online Demo](http://www.cw-internetdienste.de/pixelselection/)  

*Possible Use Cases*  

* Games
* Complex GUIs with non rectangular buttons
* Image Effects

##Example
**HTML**
```html
<section id="showcase">
  		<div id="element1" class="pixelmap unit hero"></div>
			<img src="fountain.png" id="element2" width="74" height="116" alt="fountain" class="pixelmap" />
			<div id="element3" class="pixelmap unit monster"></div>
			<img src="house.png" id="element4" width="216" height="287" alt="house" class="pixelmap" data-precalc="false" />
		</section>
```

**JavaScript**
```javascript
$(function() {  	
		switchBoundingBox	=	function(ev) {
			$('.pixelmap').toggleClass('bounding-box');
			ev.preventDefault();
		};
		
		elemHovered			=	function(ev,elem,hit) {
			if(hit==true) {
	        	if(!elem.hasClass('hover')) {
		        	elem.addClass('hover');
	        	}
        	} else {
	        	elem.removeClass('hover');
        	}

			ev.preventDefault();	
		};
		
		elemOut				=	function(ev,elem,hit) {
			console.log('out callback');
			elem.removeClass('hover');	
		};
		
		elemClicked			=	function(ev,elem,hit) {
			if(hit===true) {
				elem.toggleClass('active');
			}
			ev.preventDefault();	
		};
		
		elemReady			=	function(el) {
			console.log('ready callback');
		};
				
		$('.pixelmap').pixelselect({
			over:		elemHovered,
			out:		elemOut,
			click:		elemClicked,
			ready:		elemReady,
			sublayers:	true,
			debug: 		false
		});
		
	});
```

**CSS**
```css
#showcase {
  position: relative;
	margin: 20px 0px;
	height: 250px;
	width: 920px;
	background: transparent url('bg.jpg') top left no-repeat;
	overflow: hidden;
}

table {
	width: 100%;
}

table th {
	text-align: center;
	font-weight: bold;
	border-bottom: 1px solid #333;
}

table td {
	border-bottom: 1px solid #CCC;
	text-align: center;
	padding: 4px;
}

table tr:last-child td {
	border-bottom: 0px;
}

table td.desc{
	text-align: left;
}

/* units etc */

.pixelmap {
	position: absolute;
	z-index: 2;
}

.unit {
	width: 38px;
	height: 52px;
	background: transparent url('sprites.png') top left no-repeat;
	background-position: 0px 0px;
}

.hero {
	background-position: -72px 0px;
}

.monster {
	background-position: -300px 0px;
}

/* positions */
#element1 { z-index: 2; top: 110px; right: 280px;	}
#element2 { z-index: 4; top: 90px; right: 310px;	}
#element3 { z-index: 3; top: 140px; right: 260px;	}
#element4 { z-index: 1; top: -150px; right: 180px;	}

.bounding-box {
	border: 1px solid #ff3800;
	margin-top: -1px;
	margin-right: -1px;
}

.hover {
	opacity: 0.5;
}

.active {
	background-color: rgba(255,66,66,0.75);
}
```

##Configuration parameters
==========================

Beside the parameters that can be assigned during initialization, it is possible to assign a few parameters as data-attribute to overwrite the global options.

**Argument:** 		click	  
**Default:** 		null	  
**Data-Attribute:** 	-	  
**Description:** 	This is the callback for the click event. Callback has 3 callback variables <i>function(event,element,hits)</i>. Event is the click event, element is the clicked element as jquery object and hits indicated whether or not a pixel was hit.

**Argument:** 		debug  
**Default:**		false  
**Data-Attribute:**	-  
**Description:**	Displays the time that the calculation of the pixelmap used in the console log.

**Argument:**		out  
**Default:**		null  
**Data-Attribute:**	-  
**Description:**	This is the callback for the mouseout event. Callback has 3 callback variables <i>function(event,element,hits)</i>. Event is the mouseout event, element is the mouseout element as jquery object and hits indicated whether or not a pixel was hit.

**Argument:**		over  
**Default:**		null  
**Data-Attribute:**	-  
**Description:**	This is the callback for the mouseover event. Callback has 3 callback variables <i>function(event,element,hits)</i>. Event is the mouseover event, element is the mouseover element as jquery object and hits indicated whether or not a pixel was hit.

**Argument:**		precalc  
**Default:**		true  
**Data-Attribute:**	data-precalc  
**Description:**	If enabled the pixelmap will be generated before initialization. This will boost performance with many objects, but will take a few ms for to calculate. If deactivated, the script will check each pixel at runtime.

**Argument:**		ready  
**Default:**		null  
**Data-Attribute:**	-  
**Description:**	This is the callback for the onready event of the object. Callback has 1 callback variable <i>function(element)</i>. Element is a jquery object of the parsed html element.  

**Argument:**		sublayers  
**Default:**		false  
**Data-Attribute:**	data-sublayers  
**Description:**	If enabled the script will check if a object is behind a transparent area and trigger the object, if it exists  

**Argument:**		tolerance  
**Default:**		40  
**Data-Attribute:**	data-tolerance  
**Description:**	A value from 0-255 where 0 is transparent and 255 totally visible / filled  

**Argument:**		type  
**Default:**		img  
**Data-Attribute:**	-  
**Description:**	Normally this will be automatically calculated. Can either be 'img' or 'bg' for a css background-image instead of img tag.  
