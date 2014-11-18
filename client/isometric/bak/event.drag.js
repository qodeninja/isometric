(function($){

  //drag debug elements

  var dragStartX,dragStartY,dragStopX,dragStopY = 0;

  $.event.special.drag = {

//http://benalman.com/news/2010/03/jquery-special-events/#api-default

    setup: function( data, namespaces ) {
      // code
      var self = this,
      $this = $(this);

      $(this).on('mousedown.drag', $.event.special.drag.dragProxy);

      console.log( '[DRAG:SETUP]' , this );

    },

    teardown: function( namespaces ) {
      $(this).off('.drag', $.event.special.drag.dragProxy);
    },

    add: function( handlerObj ) {
      // code
    },

    remove: function( handlerObj ) {
      // code
    },

    _default: function( e ) {
      // code
    },

    dragProxy : function( e ){

      if( e.button == 2 ) { return false; }

      console.log( '[DRAG:PROXY]' );

      var self = this,
      $this = $(this);


      if( e.type === 'mousedown' ){

        //$.event.special.drag.dragStart( e );

        $(this).one('mousemove.drag', $.event.special.drag.dragStart);

      }else if( e.type == 'mouseup' ){

        $(this).off('mousemove.drag', $.event.special.drag.dragStart);

      }


    },

    dragStart : function( e ){

      var self = this,
      $this = $(this);

      dragStartX = e.pageX;
      dragStartY = e.pageY;

      $this.addClass('selected');

      console.log( '[DRAG:START]' + e.type + ' '  + dragStartX + ' ' + dragStartY , this );

    },


    dragStop : function( e ){

      var self = this,
      $this = $(this);

      dragStopX = e.pageX;
      dragStopY = e.pageY;

      $this.addClass('selected');

      console.log( '[DRAG:STOP]' + e.type + ' '  + dragStartX + ' ' + dragStartY , this );

    },
  };

})(jQuery);
