      var mouseDrag = false, mouseOut, mouseDown = false;
      var dragStartX,dragStartY = 0;
      var moveX,moveY = 0;
      var dots = 0;
      var dotClass;

      var iconSrc = 'http://cdn1.iconfinder.com/data/icons/ledicons/hand_point.png';

      var $xpos = $('#xpos span');
      var $ypos = $('#ypos span');

      var $dragging = $('#dragging span');

      var $dxpos = $('#dxpos span');
      var $dypos = $('#dypos span');

      var $canvas = $('#canvas');


      $(document).ready(function(){

        $canvas.on('mousedown',function(e){

          dots++;
          dragStartX = e.pageX;
          dragStartY = e.pageY;


          e.preventDefault();
          //console.warn('canvas clicked');

          $(this).addClass('selected');

          mouseDown = true, mouseOut = false;


          $canvas.one('mousemove',function(e){
            mouseDrag = true;
            $(document).trigger('mousedrag');

          });



        }).on('mouseup',function(e){

          mouseDown = false;
          moveX = e.pageX;
          moveY = e.pageY;

          if( mouseDrag ){
             mouseDrag = false;
             $(document).trigger('mouseundrag');
          }


          var self = this;



          setTimeout( function(){

            $(self).removeClass('selected');
            console.log('canvas cleared');
          }, 500 );

        }).on('mouseout',function(e){

          var self = this;

          if( mouseDrag ){

             mouseOut  = true;
             $(document).trigger('mouseundrag');
          }

          setTimeout( function(){

            $(self).removeClass('selected');
            console.log('canvas cleared!');
          }, 500 );

        });






        $(this).on('mousemove',function(e){

          e.preventDefault();
          $xpos.html(e.pageX);
          $ypos.html(e.pageY);

        });


        $(this).on('mouseundrag',function(e){

          e.preventDefault();
          if( ! mouseOut ){ console.log("[UNDRAG] document saw undrag"); }else{ console.log("[UNDRAG OUT] document saw undrag"); }
            mouseDrag = false;
          $dragging.html('--');

        });


        $(this).on('mousedrag',function(e){

          e.preventDefault();

          console.log("[DRAG] document saw drag");
          $dragging.html('<b>DRAGGING</b>');

        });

        $(document).on('mouseup',function(e){

          e.preventDefault();

        });

      });