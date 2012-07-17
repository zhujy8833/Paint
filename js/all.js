//@Author Jiangyue Zhu
//all.js, manipulate all the behaviours of the drawing page
    var Paint = (function(){
        var canvas = document.getElementById('canvas'),
            colorpicker = document.getElementById('picker'),
            shapepicker = document.getElementById('shape'),
            clear = document.getElementById('clear'),
            eraser = document.getElementById('eraser');
        /*var eraser_image = {
            	eraser : "image/eraser.png",
            	pencil : "image/pen_write_edit.png"
       		 }
        */
        return {
            init : function(){
                canvas.draw = new Draw(canvas);
                //$(canvas).addClass()
                //canvas.style.cursor = eraser_image.pencil;
                return canvas;
            },
            bind : function(){
                //setting default canvas shape
                shapepicker.addEventListener('change',function(e){
                    canvas.draw.toDrawMode();
                    canvas.draw.setShape(this.value);
                    if($(canvas).hasClass('eraser')){
                     	$(canvas).removeClass('eraser');
                    }
                    //change cursor image to pencil
                    //canvas.style.cursor = eraser_image.pencil;
                });
                eraser.addEventListener('change',function(e){
                    var eraser = this,
                        setting = {
                            width : eraser.value.split(",")[0],
                            height: eraser.value.split(",")[1]
                        };
                    canvas.draw.toEraseMode();
                    canvas.draw.setEraser(setting);
                    if(!$(canvas).hasClass('eraser')){
                     	$(canvas).addClass('eraser');
                    }
                   // canvas.style.cursor = eraser_image.eraser;
                });
                shapepicker.options[0].selected = true;
                //setting default canvas stroke
                colorpicker.addEventListener('change',function(e){
                    canvas.draw.setColor(this.value);
                });
                clear.addEventListener('click',function(e){
                    canvas.draw.clear();
                })

            }
        }

    }());



$(document).ready(function(){
    Paint.init();
    Paint.bind();
});
