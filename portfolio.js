var current_index = 0;
var tab_reader = 0;
var divBetterDisplay = $("<div class='betterDisplayBackground'><div class='betterDisplay'></div>");
var magnifier = false;
var magOn = false;
var switchOn = false;


var horizontalmovement = "down"; // up
var verticalmovement = "right"; // left, right
var state = "none";  // verticalscan, horizontalscan, none
var interval = null;
var keyboard = "off" //on
var recentInputArea = null;
var caps = "off" //on
var cont = 0;
var topPage = 0;
var leftPage = 0;
var previousClass = null;




$(document).ready(function() {

  $("#mag_feature").click(function() {
    console.log(mag_feature)
    if (magOn == false) {
      // magnifier
      magnification();
      magOn = true;
    }
    else {
      magOn = false;
      $(this).addClass('no-hover');
    }
  });

  $("#reader_feature").click(function() {
    alert("lala")
  });
  
  $("#switch").click(function() {
    // Single switch input
    if (switchOn == false) {
      addScrollButtons();
      switchOn = true;
    }
    else {
      removeScrollButtons();
      switchOn = false;
    }
  });

/* assgn 4 -------------------------*/
  all_elems = $("*");

  $(document).keydown(function(event) {

    //magnification  
    if (event.keyCode == 32 && magOn) {
      addZoomedDisplay();
    }

    //switch input
    if(event.key=="b") {
      switchInput();
    }

    //screen reader
    if(event.key == "Escape") {
      setToPaused();
    }

    //read down = shift + down arrow
    if(event.shiftKey && event.keyCode == 40) {
      console.log("entrou1")
      if (current_index >= 100) {
        current_index = 0;
      }
      current_elem = all_elems[current_index];
      readNextText(all_elems);
    }

    //read up = shift + up arrow
    if(event.shiftKey && event.keyCode == 38) {
      console.log("entrou2")
      if(current_index == 0) {
        current_index = all_elems.length - 1;
      }
      current_elem = all_elems[current_index];
      readPreviousText(all_elems);
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
      console.log("entrou3")
      event.stopPropagation();
      if (current_index >= 0) {
        current_elem = all_elems[current_index];
        readPreviousFocusable(all_elems);
      }
    }
  });
  /* assgn 4 -------------------------*/

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

//SWICTH INPUT ----------------
function addScrollButtons() {
  $("body").append("<input type='button' class='scroll down' value='down'>");
  $(".scrolldown").click(function() {
    topPage += 150;
    $('html, body').animate({
        scrollTop: $(document).scrollTop()+150
    }, 1000);
  })

  $("body").append("<input type='button' class='scroll up' value='up'>");
  $(".scrollup").click(function() {
    topPage -= 150;
    $('html, body').animate({
        scrollTop: $(document).scrollTop()-150
    }, 1000);
  })

  $("body").append("<input type='button' class='scroll right' value='right'>");
  $(".scrollright").click(function() {
    leftPage += 150;
    $('html, body').animate({
        scrollLeft: $(document).scrollLeft()+150
    }, 1000);
  })

  $("body").append("<input type='button' class='scroll left' value='left'>");
  $(".scrollleft").click(function() {
    leftPage -= 150;
    $('html, body').animate({
        scrollLeft: $(document).scrollLeft()-150
    }, 1000);
  })
}

function removeScrollButtons() {
  $(".scroll.down").remove();

  $(".scroll.up").remove();

  $(".scroll.right").remove();

  $(".scroll.left").remove();
}

function simulateClick(element) {
  if (!element) return;
  var dispatchEvent = function (elt, name) {
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent(name, true, true);
    elt.dispatchEvent(clickEvent);
  };
  dispatchEvent(element, 'mouseover');
  dispatchEvent(element, 'mousedown');
  dispatchEvent(element, 'click');
  dispatchEvent(element, 'mouseup');
};

function switchInput(){
        clearInterval(interval);

      if(state=="none") {

        state = "verticalscan";
        $("#horizontal-scanbar").css("top", 0+"px");
        $("#horizontal-scanbar").show();

        // Setting up the vertical scan
        interval = setInterval(function() {
          var offset = $("#horizontal-scanbar").offset();
          var y = offset.top - topPage;

          if(horizontalmovement=="down") {
            console.log("somou 2")
            y = y+2;
          } else if(horizontalmovement=="up") {
            y = y-2; 
          }

          if(y >= $(window).height()) {
            horizontalmovement = "up";
          } else if(y <= 0) {
            horizontalmovement = "down";
          }

          console.log("new y is " + y + " " + $(window).height());

          $("#horizontal-scanbar").css("top", y+"px");
        }, 20);
      } else if(state=="verticalscan") {
        state = "horizontalscan";
        $("#vertical-scanbar").css("left", 0+"px");
        $("#vertical-scanbar").show();

        // Setting up the vertical scan
        interval = setInterval(function() {
          var offset = $("#vertical-scanbar").offset();
          var x = offset.left - leftPage;

          if(verticalmovement=="right") {
            x = x+2;
          } else if(verticalmovement=="left") {
            x = x-2;
          }

          if(x >= $(window).width()) {
            verticalmovement = "left";
          } else if(x <= 0) {
            verticalmovement = "right";
          }

          console.log("new x is " + x + " " + $(window).width());

          $("#vertical-scanbar").css("left", x+"px");
        }, 20);
      } 
      else if(state=="horizontalscan") {
        state = "none";
        var offset = $("#vertical-scanbar").offset();
        var x = offset.left - leftPage + $("#vertical-scanbar").width()/2.0;

        var offset = $("#horizontal-scanbar").offset();
        var y = offset.top - topPage + $("#horizontal-scanbar").height()/2.0;


        $("body").append("<div class='click'></div>");

        $(".click").css("left", x+"px");
        $(".click").css("top", y+"px");

        cont = 0;

        $(".click").animate({
          width: "+=25",
          height: "+=25",
          left: "-=12.5",
          top: "-=12.5",
          "border-radius": "+=12"
        }, 800, function() {
          if (cont == 0) {
          $(".click").hide();
          var elementtoclick = document.elementFromPoint(x, y);
          simulateClick(elementtoclick);
          console.log(elementtoclick)

          if($(elementtoclick).is("input[type=\"text\"],textarea")) {
            recentInputArea = elementtoclick;
          }

          if($(elementtoclick).attr('class') == "key letter") {
            var letter = $.trim($(elementtoclick).text());
            letter = String(letter);
            if (caps == "off") { 
              letter = letter.toString().toLowerCase();
            }
            $(recentInputArea).val($(recentInputArea).val() + letter);
            previousClass = "key letter";
          }

          if($(elementtoclick).attr('class') == "key caps") {
            if (caps == "off") {
              caps = "on";
            }
            else {
              caps = "off";
            }
            previousClass = "key caps";
          }

          if($(elementtoclick).attr('class') == "key backspace") {
            var text = $(recentInputArea).val();
            if (text.length > 1) {
              text = text.slice(0, text.length - 1);
            }
            else {
              text = "";
            }
            $(recentInputArea).val(text);
            previousClass = "key backspace";
          }

          if($(elementtoclick).attr('class') == "key num dual") {
            var num_dial = $.trim($(elementtoclick).text());
            if(previousClass != "key shift left") {
              var num = num_dial.slice(1,2)
              $(recentInputArea).val($(recentInputArea).val() + num);
            }
            else {
              var dial = num_dial.slice(0,1);
              $(recentInputArea).val($(recentInputArea).val() + dial);
            }
            previousClass = "key num dual";
          }

          if ($(elementtoclick).attr('class') == "key shift left") {
            previousClass = "key shift left";
          }
        }
        cont +=1;

        });

        $("#horizontal-scanbar").hide();
        $("#vertical-scanbar").hide();
      }
}

//MAGNIFIER-------------------------

function addZoomedDisplay() {
      if (magnifier == false) {
        $("body").append(divBetterDisplay);
        $(".betterDisplay").text(screen_text);

        event.stopPropagation();
        event.preventDefault();
        magnifier = true;
      }
      else {
        divBetterDisplay.remove();
        magnifier = false;
      }
}

function magnification() {
$("*:not(body)").hover( function(event) {

  $(".highlight").addClass("highlight");
  $(this).addClass("highlight");
  screen_text = $(this).text();

  event.stopPropagation();
  },
  function(event) {
    $(this).removeClass("highlight");
  }
);
}

/* ---- asg 4 ------ */

function readPreviousText(all_elems) {
  if (findPreviousReadable(all_elems, "any_tags")) {
    speakText($(all_elems[current_index]).text());
  }
}

function readNextText(all_elems) {
  if (findNextReadable(all_elems, "any_tags")) {
    speakText($(all_elems[current_index]).text());
  }
}

function readNextFocusable(all_elems) {
  if (tab_reader == 0) {
    current_index = 0;
    tab_reader++;
  }

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
  console.log(tag_name)
  if (tag_name == "SPAN" || tag_name == "A") {
    speakText("link");
    return true;
  }
  else if (tag_name == "P") {
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
