(function(){

	var Draw = function(canvas){
		var that = this;
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.hasStarted = false;
		this.shapeCollection = ["sketch","rect"];
		//set defaults
		this.strokeStyle = "000000";
		this.shape = "random";
		/*this.context.strokeStyle = 'red';
		this.context.lineWidth = 10;*/
		function canvasCoord(event){
			 if (event.layerX || event.layerX == 0) { // Firefox
			    event._x = event.layerX;
			    event._y = event.layerY;
			  } else if (event.offsetX || event.offsetX == 0) { // Opera
			    event._x = event.offsetX;
			    event._y = event.offsetY;
			  }
		}
	    this.canvas.addEventListener("mousedown",
	        function(e){
	            canvasCoord(e);
	            that.mouseDown(e,that)
         });
	    this.canvas.addEventListener("mousemove",
	        function(e){
				canvasCoord(e);
	            that.mouseMove(e,that)
           });
	    this.canvas.addEventListener("mouseup",
	        function(e){
            	that.mouseUp(e,that)
           });
	}
	Draw.prototype.setColor = function(color){
		this.strokeStyle = color;
	};
	Draw.prototype.setShape = function(shape){
		var shapeList = this.shapeCollection;
		if(shapeList.indexOf(shape)!=-1){
			this.shape = shape;
		}
	};
    Draw.prototype.mouseDown = function(event,context){
		var _this = context,
		    context = this.context;
		_this.hasStarted = true;
        context.beginPath();
        context.moveTo(event._x,event._y);
        
	};
	Draw.prototype.mouseMove = function(event,context){
		var _this = context,
		    context = this.context;
		if(_this.hasStarted){
		    //if drawing gets started
		    context.lineTo(event._x,event._y);
		    context.strokeStyle = "#"+_this.strokeStyle
		    context.stroke();	
		}
		
	};
	Draw.prototype.mouseUp = function(event,context){
		var _this = context,
		    context = this.context;
		_this.hasStarted = false;
	};

	var canvas = document.getElementById('canvas'),
	    colorpicker = document.getElementById('picker'),
	    shapepicker = document.getElementById('shape');
	canvas.draw = new Draw(canvas);
	//setting default canvas shape
	shapepicker.addEventListener('change',function(e){
		canvas.draw.setShape(this.value);
	});
	
	shapepicker.options[0].selected = true;
	//setting default canvas stroke 
	colorpicker.addEventListener('change',function(e){
		canvas.draw.setColor(this.value);
	});
	

}());

