(function(){

	var Draw = function(canvas){
		var that = this;
		this.canvas = canvas;
		if(canvas.nextElementSibling){
			this.canvas_copy = canvas.nextElementSibling;
		}
		this.width = canvas.width;
		this.height = canvas.height;
		this.context = canvas.getContext('2d');
		this.context_copy = this.canvas_copy.getContext('2d');
		this.hasStarted = false;
		this.shapeCollection = ["sketch","rect","circle"];
		//set defaults
		this.strokeStyle = "000000";
		this.shape = "sketch";
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
		else{
			throw("The shape is not presented in the list");
		}
	};
    Draw.prototype.mouseDown = function(event,context){
    	//Here, if users use left mouse button, then draw
    	//if users use right mouse button, then clear what he is drawing 
		var _this = context,
		    context = this.context,right_click;
	    if(event.which){
	    	right_click = (event.which===3);
	    }
	    else if(event.button){
	        right_click = (event.button===2);
	    }
	    
        if(!right_click){
			_this.hasStarted = true;
	        context.beginPath();
	        _this.startX = event._x;
	        _this.startY = event._y;
	        switch(_this.shape){
	        	case "sketch" : 
	        		context.moveTo(event._x,event._y);
	        		break;
	            case "rect" : 
	            	break;
	            case "circle": 
	                break;
	        }
       }
       else{
       	  _this.cancel();
       }
        
	};
	Draw.prototype.mouseMove = function(event,context){
		var _this = context,
		    context = this.context;
		if(_this.hasStarted){
		    //if drawing gets started
		 context.strokeStyle = "#"+_this.strokeStyle;
		 switch(_this.shape){
		 	case "sketch":
		 		context.lineTo(event._x,event._y);
		 		context.stroke();	
		 		break;
		 	case "rect":
		 	    /*calculation of x,y,w,h*/
		 	    var x = Math.min(_this.startX,event._x),
		 	        y = Math.min(_this.startY,event._y),
		 	        w = Math.abs(_this.startX - event._x),
		 	        h = Math.abs(_this.startY - event._y);
		 	        
		 	    context.clearRect(0,0,_this.width,_this.height);
		 	    context.strokeRect(x,y,w,h);
		 	   // context.clearRect(0,0,_this.width,_this.height);
		 	    break;
		 	case "circle" :
		 	    var x = Math.abs(event._x + _this.startX)/2,
		 	        y = Math.abs(event._y + _this.startY)/2,
		 	        _x = Math.abs(x - _this.startX),
		 	        _y = Math.abs(y - _this.startY),
		 	        radius = Math.sqrt(_x*_x + _y*_y);
		 	    context.arc(Math.floor(x),Math.floor(y) , Math.floor(radius), 0 , 2*Math.PI , true);
		 	    context.clearRect(0 , 0 , _this.width , _this.height );
		 	    context.stroke();
		 	    break;
		 	    
		 }	//end of switch
		}		
	};
	Draw.prototype.mouseUp = function(event,context){
		var _this = context,
		    context = this.context;
		_this.hasStarted = false;
		_this.context_copy.drawImage(_this.canvas,0,0);
		_this.context.clearRect(0,0,_this.width,_this.height);
	};
    Draw.prototype.cancel = function(){
    	var context= this.context;
    	context.clearRect(0,0,this.width,this.height);
    }
    Draw.prototype.clear = function(){
    	var bg_context = this.context_copy;
    	bg_context.clearRect(0,0,this.width,this.height);
    }    
    /*******************************************************/
	var canvas = document.getElementById('canvas'),
	    colorpicker = document.getElementById('picker'),
	    shapepicker = document.getElementById('shape'),
	    clear = document.getElementById('clear');
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
	clear.addEventListener('click',function(e){
		canvas.draw.clear();
	})
	

}());

