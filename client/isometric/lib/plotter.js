(function($, window, document, undefined ){

"use strict";

    var w = window, d = document, namespace = 'Plotter', pluginName = "Plotter", debug = true, $body = $('body');

    var defaults = {};
    var $wrapper = $('#wrapper');

    ////////////////////////////////////////////////////////////////////////////////////////
    //methods
    var methods = {

        //instatiate
        init   : function( params ){
            var data;
            var options;

            console.log(' plotter init ');


            //chainability
            return this.each(function(){

              var $self = $(this);

              var options = $.extend( {}, defaults, params );

              methods.setup( $self, options );

            });

        },

        setup : function ( $self, options ){



          $(d).on('mousedown', function(e){

            console.log(' plotter down', e);

            if( e.inBounds ){
              methods.addPlot( e.pageX, e.pageY, e.offsetX, e.offsetY );
            }


          });


        },

        addPlot : function( x, y, w, h ){

          console.log(' plotter point ');
          var data = $body.data('mouse.listener');

          var yPos = (y) - (h||0);
          var xPos = (x) - (w||0);
          dots++;
          $wrapper.append('<div class="x _ns" id="s'+dots+'" style="left:'+xPos+'px;top:'+yPos+'px;">p'+dots+'('+x+','+y+')</div>');

        }

    };

    ////////////////////////////////////////////////////////////////////////////////////////
    //methods
    function Plotter( method ){

      //methods called through .methods.fn() per best practice
      if( methods[method] ){

          if( debug ){ console.log("plotter."+method); }

          return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));

      }else if( typeof method === "object" || ! method ){

          return methods.init.apply( this, arguments, window );

      }else{

          $.error( "Method " +  method + " does not exist on jQuery.Plotter" );

      }

    };


    ////////////////////////////////////////////////////////////////////////////////////////
    //instance


    $.Plotter = Plotter;
    $.fn.Plotter = $.Plotter;

    ////////////////////////////////////////////////////////////////////////////////////////

  })(jQuery, window, document, undefined);

