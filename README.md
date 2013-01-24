jQuery-Pixel-Related-Object-Selection
=====================================

This script is not only working with images, but also working with background-images. If applied on an image it will use the src path, else it will test if data-img or background-image exists and use those instead.

[View Online Demo](http://www.cw-internetdienste.de/pixelselection/)

##Example
*HTML*
```html
<section id="showcase">
  		<div id="element1" class="pixelmap unit hero"></div>
			<img src="fountain.png" id="element2" width="74" height="116" alt="fountain" class="pixelmap" />
			<div id="element3" class="pixelmap unit monster"></div>
			<img src="house.png" id="element4" width="216" height="287" alt="house" class="pixelmap" data-precalc="false" />
		</section>
```

*JavaScript*
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

*CSS*
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
