/*properties
    Mouse, MouseBuddy, addClass, apply, bindCanvas, bindMouse, call, clickFrom,
    clickTo, clientHeight, clientWidth, crosshair, css, curr, dimensions,
    documentElement, down, dragFrom, dragTo, each, elementFromPoint, error, exec,
    extend, fn, getQuadrant, h, hasBoundEvents, hide, highlight, html, init,
    checkMove, isStop, jqueryDebug, keyCode, keydown, last, log, move, moveFrom,
    moveLast, moveStop, moveTo, off, on, pageX, pageY, preventDefault, prototype,
    removeClass, screen, setup, show, showCrossHair, slice, status, time,
    timeEnd, trigger, unbindCanvas, unbindMouse, viewport, w, x, x1, y, y1
*/


(function($, window, document ){

"use strict";

    var w = window, d = document, namespace = 'MouseBuddy', pluginName = "MouseBuddy", debug = true;

    var $xpos,$ypos,$move,$down,$drag,$drop,$stop,$click,$gridon,$bounds;

    var $mouse, $mousePos, $wrapper, $crossX, $crossY, $canvas, $gamebox, $cell, $crossHairs;

    var moveInterval = null;

    var dots = 0;
    var dotClass;

    var defaults = {};

    var ScreenStatus = { };

    var MouseStatus = {

      screen : {
        w : 800,
        h : 400
      },

      offsetX : 5 + 1,
      offsetY : 5 + 1,

      curr : {
       x : 0,
       y : 0
      },

      last : {
       x : 0,
       y : 0
      },

      moveFrom : {
       x : 0,
       y : 0
      },

      moveTo : {
       x : 0,
       y : 0
      },

      dragFrom : {
       x : 0,
       y : 0
      },

      dragTo : {
       x : 0,
       y : 0
      },

      clickFrom : {
       x1 : 0,
       y1 : 0
      },

      clickTo : {
       x1 : 0,
       y1 : 0
      },

      viewport : {
        w : function(){ return document.documentElement.clientWidth},
        h : function(){ return document.documentElement.clientHeight}
      }

    };

    function Mouse() {
      if (!(this && this instanceof Mouse)) { return; }
      //this.status = MouseStatus;

    }

    Mouse.prototype.showCrossHair  = false;
    Mouse.prototype.hasBoundEvents = true;
    Mouse.prototype.isOutofBounds  = false;
    Mouse.prototype.isStop = true;
    Mouse.prototype.isDrag = false;

    Mouse.prototype.status = MouseStatus;

    Mouse.prototype.x = 0;
    Mouse.prototype.y = 0;

    Mouse.prototype.checkMove = function (){
      //console.log( '[isMoving] last ' + this.status.last.x + ',' + this.status.last.y + ' | curr ' + this.status.curr.x + ',' + this.status.curr.y );
      return ( this.status.last.x !== this.status.curr.x || this.status.last.y !== this.status.curr.y );
    };


    Mouse.prototype.highlight = function( x, y ){

        var yPos = (y-0);
        var xPos = (x-5);



        $cell.css( 'top', yPos+'px' ).css( 'left', xPos+'px');

    };

    Mouse.prototype.crosshair = function( x, y ){

        if( this.showCrossHair ){

          var yPos = (y - 5);
          var xPos = (x);

          $mousePos.html( '(' + x + ', ' + y + ')' );

          $mouse.css( 'top', yPos+'px' ).css( 'left', xPos+'px');
          $crossX.css( 'left',(xPos)+'px' );
          $crossY.css( 'top', (yPos)+'px');

        }
    };

    Mouse.prototype.addPlot = function( x, y ){

      var yPos = (y) - this.status.offsetY;
      var xPos = (x) - this.status.offsetX;
      dots++;
      $wrapper.append('<div class="x _ns" id="s'+dots+'" style="left:'+xPos+'px;top:'+yPos+'px;">p'+dots+'('+x+','+y+')</div>');

    };

    Mouse.prototype.addEdge = function( x, y ){


    };

    Mouse.prototype.checkBounds = function( x, y ){

        if(  x > this.status.screen.w || ( x <= this.status.offsetX || x <= 0  ) || y > this.status.screen.h || ( y <= this.status.offsetY || y <= 0 )  ){

          if( !this.isOutofBounds ){
            console.error('[BOUNDRY] Out of Bounds', x, y );
            this.isOutofBounds = true;
            $(d).trigger('boundryout');
          }

        }else{

          if( this.isOutofBounds ){
            this.isOutofBounds = false;
            console.info('[BOUNDRY] Back in Bounds', x, y);
            $(d).trigger('boundryin');
          }
        }

        if( this.isOutofBounds ){

          return false;

        }

        return true;

    };


    Mouse.prototype.drag = function ( x, y ) {



      if( !this.isDrag && !this.isStop ){

        this.isDrag = true;
        console.log( '[mousedrag]' );

      }else{


      }

    };

    Mouse.prototype.drop = function ( x, y ) {

      if( this.isDrag ){



        this.isDrag = false;
        this.isDrop = true;

      }

    };

    Mouse.prototype.move = function ( x, y ) {

        var self = this;




        this.status.curr.x = x;
        this.status.curr.y = y;

        this.x = x;
        this.y = y;

        if( !this.checkBounds( x, y ) ){
          return false;
        }

        if( this.showCrossHair ){
          this.crosshair( x, y );
        }

        $xpos.html( x );
        $ypos.html( y );
        $move.addClass('on');

        this.isStop = false;

        //ie compat with closure
        setTimeout( function(){ $.Mouse.moveLast( x, y, self ); }, 200 );


    };

    Mouse.prototype.moveLast = function ( x, y, self ) {

        if( !this.isStop ){

          self.status.last.x = x;
          self.status.last.y = y;


          if( !self.checkMove() ){
            self.moveStop();
          }

        }

    };


    Mouse.prototype.moveStop = function (  ) {


      if( !this.isStop ){

        //stopped

        $(d).trigger( 'mousestop' );


        this.isStop = true;

      }


    };

    Mouse.prototype.getQuadrant = function (  ){

    };

    Mouse.prototype.down = function ( x, y ) {


        if( this.checkBounds( x, y ) ){

           this.getActiveLayers( x, y );
           this.addPlot( x, y );
        }


    };


    Mouse.prototype.getActiveLayers = function ( x, y ){

        var clickX = x
            ,clickY = y
            ,list
            ,$list
            ,offset
            ,range
            ,$body = $('body').parents().andSelf();

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

        $list = $list.add($body);

        list = $list.map(function() {
            return this.nodeName + ' #' + this.id + ' .' + this.className
        }).get();

        console.log(list);

        return false;

    };


    ////////////////////////////////////////////////////////////////////////////////////////
    //methods
    var methods = {

        //instatiate
        init   : function( params ){
            var data;
            var options;

            methods.jqueryDebug();

            //chainability
            return this.each(function(){

              var $self = $(this);

              var options = $.extend( {}, defaults, params );

              if(options.exec){


              }else{

                methods.setup( $self, options );

              }

            });

        },

        jqueryDebug : function(){

           console.log('[DEBUG] Start ');

           $xpos = $('#xpos span');
           $ypos = $('#ypos span');
           $move = $('#mousemove');
           $down = $('#mousedown');
           $drag = $('#mousedrag');
           $drop = $('#mousedrop');
           $stop = $('#mousestop');
           $click = $('#mouseclick');
           $gridon = $('#mousegrid');
           $bounds = $('#mousebound');

           $mouse = $('#mouse');

           $crossX = $('#crossX');
           $crossY = $('#crossY');
           $crossHairs = $('#crossX,#crossY');

           $canvas = $('#canvas');
           $gamebox = $('#gamebox');
           $cell = $('#selectedCell');
           $mousePos = $( 'span', $mouse );
           $wrapper = $('#wrapper');

        },

        //setup elements and listeners
        bindMouse : function( ){

          $(d).on( 'mousemove' , function( e ){

            if( $.Mouse.isStop ){

              $stop.removeClass('on');
              $drop.removeClass('on');
            }


             // console.log( 'move ');
            $.Mouse.move( e.pageX, e.pageY );

          });

          $(d).on( 'mousedown' , function( e ){

             if( e.which === 1 ){

               $.Mouse.down( e.pageX, e.pageY );

               $down.addClass('on');

               //var elementAtPoint =  document.elementFromPoint(e.pageX, e.pageY);

               //console.log( 'down', elementAtPoint, e );
               $(d).one( 'mousemove', function(){
                 $(d).trigger( 'mousedrag' );
               });

             }

          });

          $(d).on( 'mousedrag' , function mouseDragHandler( e ){

            $.Mouse.drag( e.pageX, e.pageY );

            $drag.addClass('on');


          });


          $(d).on( 'mousedrop' , function mouseDragHandler( e ){

            $.Mouse.drop( e.pageX, e.pageY );

            $drop.addClass('on');


          });

          $(d).on( 'mouseup' , function mouseUpHandler( e ){

             //console.log( 'up' );
              $down.removeClass('on');

              if( $.Mouse.isDrag ){
                $drag.removeClass('on');
                $(d).trigger( 'mousedrop' );
              }
          });

          $(d).on( 'mousestop' , function( e ){

             //console.log( 'up' );
             console.log( '[movestop]' );

             $move.removeClass('on');
             $stop.addClass('on');



          });

          $(d).on( 'click' , function( e ){

             $click.addClass('on');
             setTimeout( function(){
              $click.removeClass('on');
             }, 500 );

             //console.log('click');

          });

          $(d).on( 'boundryin' , function( e ){

             //console.log( 'up' );
              $bounds.addClass('on');
              $canvas.addClass('selected');
              $crossHairs.removeClass('disabled');
          });

          $(d).on( 'boundryout' , function( e ){

             //console.log( 'up' );
             $bounds.removeClass('on');
             $canvas.removeClass('selected');
             $crossHairs.addClass('disabled');

             $(d).trigger('mousestop');

          });

          $cell.on('mousedown',function( e ){

            $cell.addClass('click');

            var dx = $(this).offset().left;
            var dy = $(this).offset().top;
            var cx = e.pageX - dx;
            var cy = e.pageY - dy;
            console.info( '> ' + 'p( ' + e.pageX + ', ' +  e.pageY +  ' )' + ' q( ' + cx + ', ' + cy + ' ) d( ' + dx  + ', ' + dy + ' )' );

             setTimeout( function(){
              $cell.removeClass('click');
             }, 120 );

          });

          $cell.on('mouseup',function(){

             setTimeout( function(){
              $cell.removeClass('click');
             }, 120 );

          });

        },

        unbindMouse : function( ){
          $(d).off('mousemove');
          $(d).off('mousedown');
          $(d).off('mouseup');
        },

        bindCanvas : function(){



        },

        unbindCanvas : function(){
          $canvas.off('mousemove');
          $canvas.off('mousedown');
          $canvas.off('mouseup');
          $canvas.off('mouseout');
        },




        setup  : function( ){

          methods.bindMouse();
          methods.bindCanvas();

          $(d).keydown(function(e) {
            if (e.keyCode === 13) { console.log('enter'); }     // enter
            if (e.keyCode === 71) { $.Mouse.showCrossHair = (!$.Mouse.showCrossHair);

              if( $.Mouse.showCrossHair ){

                $gridon.addClass('on');
                $mouse.show();
                $crossX.show();
                $crossY.show();

              }else{

                $gridon.removeClass('on');
                $mouse.hide();
                $crossX.hide();
                $crossY.hide();

              }

            }     // g key
            if (e.keyCode === 27) {
              $.Mouse.hasBoundEvents = !$.Mouse.hasBoundEvents;

              if( $.Mouse.hasBoundEvents ){
                methods.bindMouse(); console.log('escape!');   // esc
              }else{
                methods.unbindMouse(); console.log('escape!');   // esc
              }
            }

            //console.log( e.keyCode );
          });

          $mouse.hide();
          $crossX.hide();
          $crossY.hide();



          $(w).on( 'resize' , function( e ){


          });


          $('a.tag').on('click', function(e){

             //e.preventDefault();
            return false;
          });


        },

        dimensions : function(){


        }


    };


    ////////////////////////////////////////////////////////////////////////////////////////
    //instance

    $.MouseBuddy = function( method ){

      //methods called through .methods.fn() per best practice
      if( methods[method] ){

          if( debug ){ console.log("mousebuddy."+method); }

          return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));

      }else if( typeof method === "object" || ! method ){

          return methods.init.apply( this, arguments, window );

      }else{

          $.error( "Method " +  method + " does not exist on jQuery.MouseBuddy" );

      }

    };

    $.Mouse = new Mouse();

    $.fn.MouseBuddy = $.MouseBuddy;

    ////////////////////////////////////////////////////////////////////////////////////////

  })(jQuery, window, document);


