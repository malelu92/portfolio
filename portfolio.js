$(document).ready(function() {

 var shrinkHeader = 200;
  $(window).scroll(function() {
    var scroll = getCurrentScroll();
      if ( scroll >= shrinkHeader ) {
           $('.header').addClass('shrink');
           console.log("colocou shrink")
        }
        else {
            $('.header').removeClass('shrink');
            console.log("tirou shrink")
        }
  });
function getCurrentScroll() {
    return window.pageYOffset || document.documentElement.scrollTop;
    }
});