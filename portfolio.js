$(document).ready(function() {

 var shrinkHeader = 200;
  $(window).scroll(function() {
    var scroll = getCurrentScroll();
      if ( scroll >= shrinkHeader ) {
           $('.header').addClass('shrink');
           $('.name').addClass('shrink');
           console.log("colocou shrink")
        }
        else {
            $('.header').removeClass('shrink');
            $('.name').removeClass('shrink');
            console.log("tirou shrink")
        }
  });
	function getCurrentScroll() {
    	return window.pageYOffset || document.documentElement.scrollTop;
    }

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