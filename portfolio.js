$(document).ready(function() {

  var shrinkHeader = 200;

  var sections = $('section');
  var navbar = $('nav');
  var nav_height = navbar.outerHeight();

  $(window).scroll(function() {

    /* shrink header */
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
 
    /* bar under active link */
    var cur_pos = $(this).scrollTop();
 
    sections.each(function() {
      console.log("entrou")
      var top = $(this).offset().top - nav_height;
      var bottom = top + $(this).outerHeight();
 
      console.log("cur pos " + cur_pos)
      console.log("top " + top)
      console.log("bottom " + bottom)
      if (cur_pos >= top && cur_pos <= bottom) {
        navbar.find('a').removeClass('active');
        sections.removeClass('active');
 
        $(this).addClass('active');
        console.log($(this).attr('id'))
        navbar.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
      }
    });
  });
});

	function getCurrentScroll() {
    	return window.pageYOffset || document.documentElement.scrollTop;
    }
