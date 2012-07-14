(function(){

	var Draw = function(canvas){
		this.canvas = canvas;
		if(canvas.nextElementSibling){
			this.canvas_copy = canvas.nextElementSibling;
		}
		this.width = canvas.width;
		this.height = canvas.height;
		this.context = canvas.getContext('2d');
		this.context_copy = this.canvas_copy.getContext('2d');
		this.hasStarted = false;
		this.shapeCollection = ["sketch","rect","circle","line"];
		this.eraseMode = false;
		//set defaults
		this.strokeStyle = "000000";
		this.shape = "sketch";
		/*this.context.strokeStyle = 'red';
		this.context.lineWidth = 10;*/
		this.event_binding();
	}
	Draw.prototype.setColor = function(color/*string*/){
		this.strokeStyle = color;
	};
	Draw.prototype.setLinewidth = function(linewidth/*int*/){
		this.lineWidth = linewidth
	}
	Draw.prototype.setShape = function(shape){
		var shapeList = this.shapeCollection;
		if(shapeList.indexOf(shape)!=-1){
			this.shape = shape;
		}
		else{
			throw("The shape is not presented in the list");
		}
	};
	Draw.prototype.setEraser = function(settings/*obj*/){
		//default width and height is 10
		this.erase_setting = {};
		this.erase_setting['width'] = settings.width || 10;
		this.erase_setting['height'] = settings.height || 10;
	}
	Draw.prototype.toEraseMode = function(){
		this.eraseMode =  true;
	}
	Draw.prototype.toDrawMode = function(){
		if(this.eraseMode){
			this.eraseMode = false;
		}
	}
	Draw.prototype.event_binding = function(){
		var that = this, canvas = this.canvas;
		function canvasCoord(event){
			 if (event.layerX || event.layerX == 0) { // Firefox
			    event._x = event.layerX;
			    event._y = event.layerY;
			  } else if (event.offsetX || event.offsetX == 0) { // Opera
			    event._x = event.offsetX;
			    event._y = event.offsetY;
			  }
		}
	    canvas.addEventListener("mousedown",
	        function(e){
	            canvasCoord(e);
	            that.mouseDown(e,that)
         		});
	    canvas.addEventListener("mousemove",
	        function(e){
				canvasCoord(e);
				if(!that.eraseMode){      //In drawing mode
					that.mouseMove(e,that)
				}
				else{                     //in erase mode
					if(that.erase_setting.width && that.erase_setting.height){
						that.erase(e._x, e._y, that.erase_setting.width, that.erase_setting.height);						
					}
					else{
					    throw 'erase setting is missing';	
					}
				}
	            
          });
	    canvas.addEventListener("mouseup",
	        function(e){
            	that.mouseUp(e,that)
          });
        canvas.addEventListener("mousewheel",
            function(e){
            	//Here I consider implementing the zoomin/zoomout functionalty through mousewheel scrolling
            	//console.log(e)
            });
        
        
	}
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
	Draw.prototype.erase = function(x,y,w,h){
		var _this = this, context = this.context_copy;
	    context.clearRect(x,y,w,h); 
		
	}
	Draw.prototype.mouseMove = function(event,context){
		var _this = context,
		    context = _this.context;
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
		 	    
		 	    context.clearRect(0,0,_this.width,_this.height );
		 	    //x, y, radius, startAngle, endAngle, antiClockwise    
		 	    //context.arc(Math.floor(x),Math.floor(y) , Math.floor(radius), 0 , 2*Math.PI , false);
		 	    context.beginPath();
		 	    context.arc(x,y ,radius, 0 , 2*Math.PI , true);		 	    
		 	    context.stroke();
		 	    break;
		 	case "line" : 
		 	    context.beginPath();
		 	    context.moveTo(_this.startX,_this.startY);
		 	    context.lineTo(event._x,event._y);
		 	    context.clearRect(0,0,_this.width,_this.height);
		 	    context.stroke();
		 		break;
		 	    
		 }	//end of switch
		}		
	};
	Draw.prototype.mouseUp = function(event,context){
		var _this = context;
		_this.hasStarted = false;
	    _this.context.closePath();
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
	    clear = document.getElementById('clear'),
	    eraser = document.getElementById('eraser');
	canvas.draw = new Draw(canvas);
	//setting default canvas shape
	shapepicker.addEventListener('change',function(e){
		canvas.draw.toDrawMode();
		canvas.draw.setShape(this.value);
	});
	eraser.addEventListener('change',function(e){
		var eraser = this,
		    setting = {
				width : eraser.value.split(",")[0],
			    height: eraser.value.split(",")[1]
			};
		canvas.draw.toEraseMode();
		canvas.draw.setEraser(setting);
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

