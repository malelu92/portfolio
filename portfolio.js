$(document).ready(function() {

/* assgn 4 -------------------------*/
  all_elems = $("*");

  $("input, text_area").keydown(function(event) {
    //console.log("1111")
    var key_to_speak = event.key;

    if(/[a-z0-9\s]/i.test(key_to_speak)) {
      setToPaused();
      speakText(key_to_speak);
    }
  });

  $(document).keydown(function(event) {

    if(event.key == "Escape") {
      setToPaused();
    }

    //read down = shift + down arrow
    if(event.shiftKey && event.keyCode == 40) {
      current_index = 0
      current_elem = all_elems[current_index];
      current_state = "READING"
      while (current_state == "READING") {
        readNextForward(all_elems);
        if (current_index >= 268) {
          break;
        }
      }
    }

    //read up = shift + up arrow
    if(event.shiftKey && event.keyCode == 38) {
      current_index = all_elems.length - 1;
      current_elem = all_elems[current_index];
      current_state = "READING"
      while (current_state == "READING") {
        readNextBackward(all_elems);
        if (current_index < 0) {
          break;
        }
      }
    }

    //read next heading = ctrl + h
    if(event.ctrlKey && event.key == "h") {
      if (current_index < 268) {
        current_elem = all_elems[current_index];
        readNextHeader(all_elems);
      }
    }

    //read previous heading = ctrl+ shift + h
    if(event.ctrlKey && event.shiftKey && event.key == "H") {
      if (current_index >= 0) {
        current_elem = all_elems[current_index];
        readPreviousHeader(all_elems);
      }
    }

    //read next focusable element = tab
    if(event.keyCode == 9){ 
      event.stopPropagation();
      if (current_index < 268) {
        current_elem = all_elems[current_index];
        readNextFocusable(all_elems);
      }
    }

    //read previous focusable element = tab + shift
    //if(event.keyCode == 9 && event.shiftKey) {
    if (event.ctrlKey && event.key == "t"){ 
      event.stopPropagation();
      if (current_index >= 0) {
        current_elem = all_elems[current_index];
        readPreviousFocusable(all_elems);
      }
    }
  });
  /* assgn 4 -------------------------*/

  /* assgn 3 -------------------------*/
  /*var screen_text;
  $("*:not(body)").hover(
    function(event) {

      $(".highlight").addClass("highlight");
      $(this).addClass("highlight");

      if (this.tagName == "IMG") {
        if ($(this).attr('title')) {
          screen_text = $(this).attr('title')
        }
        else if ($(this).attr('alt')){
          screen_text = $(this).attr('alt');
        }
        else if ($(this).attr('src')){
          screen_text = $(this).attr('src');
        }
      }
      else {
        screen_text = $(this).text();
      } 

      event.stopPropagation();
    },
    function(event) {

      $(this).removeClass("highlight");
    }
  );
  $(document).keydown(function(event) {

      if (event.keyCode == 32) {
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(screen_text));

      event.preventDefault();
      }
  })*/
  /* asgn 3 --------------------------------------*/

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


/* ---- asg 4 ------ */
function readNextForward(all_elems) {
  current_state = "READING";

  if (findNextReadable(all_elems, "any_tags")) {
    speakText($(all_elems[current_index]).text());
  }
}

function readNextHeader(all_elems) {
  if (findNextReadable(all_elems, "header")) {
    children = $(all_elems[current_index]).children();

    for(i=0;i<children.length;i++) {
      current_index++;
      if(isReadable (all_elems[current_index])) {
        speakText($(all_elems[current_index]).text());
      }
    }
  }
}

function readNextFocusable(all_elems) {
  if (tab_reader == 0) {
    current_index = 0;
    tab_reader++;
  }
  current_state = "READING";

  if (findNextReadable(all_elems, "focus")) {

    var elem = all_elems[current_index];
    var tag_name = elem.tagName;

    if (tag_name == "FORM") {
      screen_text = "input"
      speakText(screen_text);
    }
    else {
      speakText($(all_elems[current_index]).text());
    }
  }
}

function readPreviousHeader(all_elems) {
  if (current_index == 0) {
    current_index = 267;
  }

  if(findPreviousReadable(all_elems, "header")) {
    children = $(all_elems[current_index]).children();

    temp_index = current_index;

    for(i=0;i<children.length;i++) {
      temp_index++;
      if(isReadable(all_elems[temp_index])) {
        speakText($(all_elems[temp_index]).text());
      }
    }
  }
}

function readNextBackward(all_elems) {
  if (current_index == 0) {
    current_index = 267;
  }
  current_state = "READING";

  if (findPreviousReadable(all_elems, "any_tags")) {
    speakText($(all_elems[current_index]).text());
  }
}

function readPreviousFocusable(all_elems) {
  if (current_index == 0) {
    current_index = 267;
  }
  current_state = "READING";

  if (findPreviousReadable(all_elems, "focus")) {

    var elem = all_elems[current_index];
    var tag_name = elem.tagName;

    if (tag_name == "FORM") {
      screen_text = "input"
      speakText(screen_text);
    }
    else {
      speakText($(all_elems[current_index]).text());
    }
  }
}

function speakText(text) {
  u = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(u); 
}

function findPreviousReadable(all_elems, type) {
  while (current_index >= 0) {
    current_index--;
    if (current_index < 0) {
      return false;
    }
    console.log("---- " + current_index)

    if (type == "any_tags") {
      if (isReadable(all_elems[current_index])) {
        return true;
      }
    }
    else if (type == "header") {
      if (isHeader(all_elems[current_index])) {
      return true;
      }
    }
    else if (type == "focus") {
      if (isFocusable(all_elems[current_index])) {
        return true;
      }
    }
  }
}

function findNextReadable(all_elems, type) {
  while (current_index < all_elems.length) {
    current_index++;
    if (current_index >= 268) {
      return false;
    }
    console.log("---- " + current_index)

    if (type == "any_tags") {
      if (isReadable(all_elems[current_index])) {
        return true;
      }
    }
    else if (type == "header") {
      if (isHeader(all_elems[current_index])) {
        return true;
      }
    }
    else if (type == "focus") {
      if (isFocusable(all_elems[current_index])) {
        return true;
      }
    }
  }
  return false;
}

function isReadable (elem) {
  var tag_name = elem.tagName;
  if (tag_name == "SPAN" || tag_name == "A") {
    return true;
  }
  return false;
}

function isHeader (elem) {
  var tag_name = elem.tagName;
  if (tag_name == "H1" || tag_name == "H2" || tag_name == "H3" || tag_name == "H4" || tag_name == "H5" || tag_name == "H6") {
    console.log(elem.tagName)
    return true;
  }
  return false;
}

function isFocusable (elem) {
  var tag_name = elem.tagName;
  if (tag_name == "A" || tag_name == "FORM") {
    return true;
  }
  return false;
}

function setToPaused() {
  current_state = "PAUSED";
  speechSynthesis.cancel();
}
/* ---- asg 4 ------ */
