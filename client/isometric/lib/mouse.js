(function($, window, document, undefined ){

"use strict";

    var w = window, d = document, namespace = 'Mouse', pluginName = "Mouse", debug = true, $body = $('body');

    var defaults = {}, dots = 0;

    var status = '';
    var boundry = '';

    var getSelf = function(){
      var $self = $body.data('mouse.listener.current');
      return $self;
    };

    //Mouse Status
    //100 drag 10 down 1 move

    ////////////////////////////////////////////////////////////////////////////////////////
    //methods
    var methods = {

        addListeners : function(){

          var $self = getSelf();



          $(d).on('mouseready', function(e){
            console.log("Document heard that Mouse is Ready!",e);
          });


          $(d).on('mousestop', function(e){

          });

          $(d).on('mousemove', function(e){

            methods.moveHandler( e );

          });



          $(d).on('mousedown', function(e){

            methods.downHandler( e );

          });

          $(d).on('mouseup', function(e){

            if( status === 'drag'){

               methods.triggerEvent('mousedrop');

            }else if( status !== 'drop'){
               status = 'click';
            }


            //console.log( status );


          });


          $(d).on('mousedrag', function(e){
            status = 'drag';
          });

          $(d).on('mousedrop', function(e){
            status = 'drop';
          });


          $self.on('mousedimensions', function(e){
            //console.log("I got my dims",e);
          });

          $self.on('mouseready', function(e){
            //console.log("Im Ready said Mouse!",e);
          });

          $self.on('mouseinbound', function(e){
            //console.log("Mouse is Local!",e);

            boundry = true;


          });

          $self.on('mouseoutbound', function(e){
            //console.log("Mouse is Remote!",e);
            status = 'stop';
            boundry = false;

            if( e.customData ){
              if( e.customData.xx ){ console.log('X[max] Boundry'); methods.triggerEvent('mouseoutbound.xx'); }
              if( e.customData.x0 ){ console.log('X[min] Boundry'); methods.triggerEvent('mouseoutbound.x0');}
              if( e.customData.y0 ){ console.log('Y[min] Boundry'); methods.triggerEvent('mouseoutbound.y0');}
              if( e.customData.yy ){ console.log('Y[max] Boundry'); methods.triggerEvent('mouseoutbound.yy');}
            }

          });


        },


        checkBounds : function( x, y ){


          var $self = getSelf();
          var data = $self.data('mouse.listener');
          var dim  = data.dimensions;

          var limit = {
           xx : ( x > ( dim.w + dim.x ) ? true : false ),
           yy : ( y > ( dim.h + dim.y ) ? true : false ),
           x0 : ( x <= ( 0 + dim.x ) ? true : false ),
           y0 : ( y <= ( 0 + dim.y ) ? true : false )
          };

          if( limit.xx || limit.x0 || limit.yy || limit.y0  ){

            if( !data.isOutofBounds ){
              data.isOutofBounds = true;
              data.newEvent = true;
            }

            //console.log("Out Bounds");

          }else{

            if( data.isOutofBounds ){
              data.isOutofBounds = false;
              data.newEvent = true;
            }

            //console.log("In Bounds");

          }


          $self.data('mouse.listener', data);

          if( data.newEvent ){
            methods.triggerEvent( 'mouse' + ( data.isOutofBounds ? 'outbound' : 'inbound' ), limit );
          }

          if( data.isOutofBounds ){
           return false;
          }

          return true;
        },

        addPlot : function( x, y, w, h ){
          var $self = getSelf();
          var yPos = (y) - (h||0);
          var xPos = (x) - (w||0);
          dots++;
          $self.append('<div class="x _ns" id="s'+dots+'" style="left:'+xPos+'px;top:'+yPos+'px;">p'+dots+'('+x+','+y+')</div>');
          //console.log(dots);
        },

        moveCrossHair : function( x, y, w, h ){

        },

        moveLast : function(){},
        moveStop : function(){},

        moveHandler : function( e ){

          var $self = getSelf();
          var inBounds = methods.checkBounds( e.pageX, e.pageY );

          if( !inBounds ){
            //console.log("not in bounds!",e);
            return false;
          }

          var $data = $self.data('mouse.listener');
          var $dim  = $data.dimensions;

          if( status === 'move' ){
             //

          }else if( status === 'down'){

             methods.triggerEvent('mousedrag');

          }else if( status !== 'drag'){
             status = 'move';
          }

          //console.log( status );
          methods.moveCrossHair( e.pageX, e.pageY, $dim.x, $dim.y );


        },

        downHandler : function( e ){

          var $self = getSelf();

          var inBounds = methods.checkBounds( e.pageX, e.pageY );

          if( !inBounds ){
            //console.log("not in bounds!",e);
            status = 'stop';
            return false;
          }

          var $data = $self.data('mouse.listener');
          var $dim  = $data.dimensions;


          methods.activeLayer( e.pageX, e.pageY );
          methods.addPlot( e.pageX, e.pageY, $dim.x, $dim.y );


          if( status === 'move' ){

             methods.triggerEvent('mousedrag');

          }else if( status !== 'drag'){
             status = 'down';
          }

          //console.log( status );

        },

        triggerEvent : function( customEvent, customEventData ){

           var $self = getSelf();
           var data = $self.data('mouse.listener');

           var mouseEvent = jQuery.Event( customEvent, { customData : customEventData } );

           mouseEvent.inBounds = boundry;
           mouseEvent.state = status;

           if( data ){
             mouseEvent.offsetX = data.dimensions.x;
             mouseEvent.offsetY = data.dimensions.y;
           }

           if( data && data.newEvent ){
             delete(data.newEvent);
             //console.log(  customEventData );
           }

           //console.log( "Trigger:" + mouseEvent.type );
           $self.trigger(mouseEvent);

        },

        setDimensions : function( ){

            var $self = getSelf();

            var offset = $self.offset();

            console.info( 'dimensions:', $self.width(), $self.height(), offset.left, offset.top  );

            methods.triggerEvent('mousedimensions');

            return ({ w: $self.width(), h : $self.height(), x : offset.left, y : offset.top  });

        },



        activeLayer : function( x, y ){


          var clickX = x
              ,clickY = y
              ,list
              ,$list
              ,offset
              ,range
              ,$bodyParent = $('body').parents().andSelf();

          var nodeName;

          $list = $('body *').filter(function() {
              offset = $(this).offset();
              nodeName = this.nodeName;

              range = {
                  x: [ offset.left,
                      offset.left + $(this).outerWidth() ],
                  y: [ offset.top,
                      offset.top + $(this).outerHeight() ]
              };
              var isOK = ( nodeName && clickX && clickY ) &&  (clickX >= range.x[0] && clickX <= range.x[1]) && (clickY >= range.y[0] && clickY <= range.y[1] && nodeName !== 'SCRIPT' && nodeName !== 'HTML');

              //console.log( nodeName, ( isOK ? 'ok' : 'x' ) );

              return isOK;
          });

          $list = $list.add($bodyParent);

          list = $list.map(function() {
              return this.nodeName + ' #' + this.id + ' .' + this.className
          }).get();

          console.log(list);

          $body.data('mouse.activelayers', list);

          return false;

        },

        //instatiate
        init   : function( params ){


          //chainability
          return this.each(function(){

            var options, $self = $(this);

            var data = $self.data('mouse.listener');


            if( !data ){

              $body.data('mouse.listener.current', $self);

              options = $.extend( {}, defaults, params );

              methods.addListeners();

              $self.data('mouse.listener', {
                target: $self,
                options: options,
                dimensions : methods.setDimensions()
              });


            }


            methods.triggerEvent('mouseready');
            methods.checkBounds();



          });

        },

        destroy : function(){

          return this.each(function(){

            var $self = $(this);


          });

        }

    };

    ////////////////////////////////////////////////////////////////////////////////////////
    //methods
    function Mouse( method ){

      //methods called through .methods.fn() per best practice
      if( methods[method] ){

          if( debug ){ console.log("mouse."+method); }

          return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));

      }else if( typeof method === "object" || ! method ){

          return methods.init.apply( this, arguments, window );

      }else{

          $.error( "Method " +  method + " does not exist on jQuery.Mouse" );

      }

    };


    ////////////////////////////////////////////////////////////////////////////////////////
    //instance


    $.Mouse = Mouse;
    $.fn.Mouse = $.Mouse;

    ////////////////////////////////////////////////////////////////////////////////////////

  })(jQuery, window, document, undefined);

