$(document).ready(function() {

 var shrinkHeader = 200;
  $(window).scroll(function() {
    var scroll = getCurrentScroll();
      if ( scroll >= shrinkHeader ) {
           $('.header').addClass('shrink');
           $('.name').addClass('shrink');
           $('.nav-opt').addClass('shrink');
           console.log("colocou shrink")
        }
        else {
            $('.header').removeClass('shrink');
            $('.name').removeClass('shrink');
            $('.nav-opt').removeClass('shrink');
            console.log("tirou shrink")
        }
  });
	function getCurrentScroll() {
    	return window.pageYOffset || document.documentElement.scrollTop;
    }

  function onScroll(event) {
  var sections = $('section');
  var navbar = $('.navbar');
  var nav_height = nav.outerHeight();
 
  var cur_pos = $(this).scrollTop();
 
  sections.each(function() {
    var top = $(this).offset().top - nav_height,
        bottom = top + $(this).outerHeight();
 
    if (cur_pos >= top && cur_pos <= bottom) {
      nav.find('a').removeClass('active');
      sections.removeClass('active');
 
      $(this).addClass('active');
      nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
    }
  });
}


  /*function onScroll(event){
    var scrollPos = $(document).scrollTop();
    $('#sidebar a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('#sidebar ul li a').removeClass("active");
            currLink.addClass("active");
        }
        else{
            currLink.removeClass("active");
        }
    });
}*/


  /*$("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });*/



});