/*http://www.amaslo.com/2012/06/drawing-diagonal-line-in-htmlcssjs-with.html*/
$('#origin-point').click(function() {
    var linkLine = $('<div id="new-link-line"></div>').appendTo('body');

    linkLine
        .css('top', $('#origin-point').offset().top + $('#origin-point').outerWidth() / 2)
        .css('left', $('#origin-point').offset().left + $('#origin-point').outerHeight() / 2);

    $(document).mousemove(linkMouseMoveEvent);

    // Cancel on right click
    $(document).bind('mousedown.link', function(event) {
        if(event.which == 3) {
            endLinkMode();
        }
    });

    $(document).bind('keydown.link', function(event) {
        // ESCAPE key pressed
        if(event.keyCode == 27) {
            endLinkMode();
        }
    });
});

function linkMouseMoveEvent(event) {
    if($('#new-link-line').length > 0) {
        var originX = $('#origin-point').offset().left + $('#origin-point').outerWidth() / 2;
        var originY = $('#origin-point').offset().top + $('#origin-point').outerHeight() / 2;

        var length = Math.sqrt((event.pageX - originX) * (event.pageX - originX)
            + (event.pageY - originY) * (event.pageY - originY));

        var angle = 180 / 3.1415 * Math.acos((event.pageY - originY) / length);
        if(event.pageX > originX)
            angle *= -1;

        $('#new-link-line')
            .css('height', length)
            .css('-webkit-transform', 'rotate(' + angle + 'deg)')
            .css('-moz-transform', 'rotate(' + angle + 'deg)')
            .css('-o-transform', 'rotate(' + angle + 'deg)')
            .css('-ms-transform', 'rotate(' + angle + 'deg)')
            .css('transform', 'rotate(' + angle + 'deg)');
    }
}

function endLinkMode() {
    $('#new-link-line').remove();
    $(document).unbind('mousemove.link').unbind('click.link').unbind('keydown.link');
}?