var current_index = 0;
var tab_reader = 0;
var divBetterDisplay = $("<div class='betterDisplayBackground'><div class='betterDisplay'></div>");
var magnifier = false;
var magOn = false;
var switchOn = true;
var readerOn = false;

var prev_elem = null;


var horizontalmovement = "down"; // up
var verticalmovement = "right"; // left, right
var state = "none";  // verticalscan, horizontalscan, none
var interval = null;
/*var keyboard = "off" //on*/
var recentInputArea = null;
/*var caps = "off" //on*/
var cont = 0;
var topPage = 0;
var leftPage = 0;
var previousClass = null;

$(document).ready(function() {

  //activate magnifier feature
  $("#mag_feature_on").click(function() {
    magnification_on();
    magOn = true;
    $(this).blur();
  });

  //deactivate magnifier feature
  $("#mag_feature_off").click(function() {
    magnification_off();
    magOn = false;
    $(this).blur();
  });

  //activate reader feature
  $("#reader_feature_on").click(function() {
    readerOn = true;
    tab_reader = 0;
    current_index = 0;
    /*$("#marina").focus();*/
  });

  //deactivate reader feature
  $("#reader_feature_off").click(function() {
    readerOn = false;
  });

  //activate switch feature
  $("#switch_feature_on").click(function() {
      addScrollButtons();
      switchOn = true;
  });

  //deactivate switch feature
  $("#switch_feature_off").click(function() {
    removeScrollButtons();
    switchOn = false;
  });

  //show items on mobile menu
  $(".navIcon").click(function() {
    document.getElementById("dropdown-items").classList.toggle("show-dropdown-items");
    console.log("aqui")
  });

  //remove items on mobile menu
  $(".dp-items").click(function() {
    document.getElementById("dropdown-items").classList.remove("show-dropdown-items");
  });

  //identify each section during scroll 
  $(document).on("scroll", scrollSection);

  //smooth scroll
  $(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();
    var target = this.hash;
    var header = 0;
    if(target == "#about") {
      header = $("nav").outerHeight()+100;
    }
    target = "#sec-" + target.split('#')[1];;
    $('html, body').animate({
        scrollTop: $(target).offset().top - header
    }, 1500);
  });

  $(document).keydown(function(event) {

    //magnification  
    if (event.keyCode == 32 && magOn) {
      addZoomedDisplay();
    }

    //switch input
    if(switchOn) {
      if(event.key=="b") {
        switchInput();
      }
    }

    //screen reader
    if(readerOn) {
      if(event.key == "Escape") {
        setToPaused();
      }

      //read down = shift + down arrow
      if(event.shiftKey && event.keyCode == 40) {
        /*console.log("--curr " + current_index + "all_elems " + all_elems.length)*/
        if (current_index >= all_elems.length) {
          current_index = 0;
        }
        current_elem = all_elems[current_index];
        readNextText(all_elems);
      }

      //read up = shift + up arrow
      if(event.shiftKey && event.keyCode == 38) {
        /*console.log("up " + current_index)*/
        if(current_index <= 0) {
          current_index = all_elems.length - 1;
        }
        current_elem = all_elems[current_index];
        readPreviousText(all_elems);
      }

      if(event.keyCode == 9) { 
        event.stopPropagation();
        //read previous focusable element = tab + shift
        if(event.shiftKey) {
          /*console.log("**** " + current_index)*/
          if (current_index >= 0) {
            current_elem = all_elems[current_index];
            readPreviousFocusable(all_elems);
          }
        }
        //read next focusable element = tab
        else {
          if(current_index >= all_elems.length) {
            current_index = 0;
          }
          if (current_index == 0) {
            $("#marina").focus();
          }
          current_elem = all_elems[current_index];
          readNextFocusable(all_elems);
        }
      } 
    }
  });

  var shrinkHeader = 200;
  $(window).scroll(function() {
    /* shrink header on scroll */
    var scroll = getCurrentScroll();
    if ( scroll >= shrinkHeader ) {
      $('.header').addClass('shrink');
      $('.name').addClass('shrink');
      $('.nav-opt').addClass('shrink');
      $('.navIcon').addClass('shrink');
    }
    else {
      $('.header').removeClass('shrink');
      $('.name').removeClass('shrink');
      $('.nav-opt').removeClass('shrink');
      $('.navIcon').removeClass('shrink');
    }
  });

  all_elems = $("*");
});

function getCurrentScroll() {
  return window.pageYOffset || document.documentElement.scrollTop;
}

/* updates active menu option on navbar*/
function scrollSection() {
  var nav_height = $('nav').outerHeight()+100;
  var sections = $('section');
  var cur_pos = $(document).scrollTop();

  sections.each(function () {
    var top = $(this).offset().top - nav_height;
    var bottom = top + $(this).outerHeight();
    var sec_id = $(this).attr("id");

    sec_id = sec_id.split('-')[1];
    sec_id = "#" + sec_id + "-id";

    /*if curr position is on section add active mode*/
    if (cur_pos >= top && cur_pos <= bottom) {
      var sec_id = $(this).attr("id");
      sec_id = sec_id.split('-')[1];
      sec_id = "#" + sec_id + "-id";
      $(sec_id).addClass('active');
    }
    else {
      $(sec_id).removeClass('active');
    }
  });
}

//SWICTH INPUT ----------------
/* Adds buttons that permit the user scroll the page up and down*/
function addScrollButtons() {
  $("body").append("<input type='button' class='scroll down' value='down'>");
  $(".scroll.down").click(function() {
    topPage += 150;
    $('html, body').animate({
        scrollTop: $(document).scrollTop()+150
    }, 1000);
  })

  $("body").append("<input type='button' class='scroll up' value='up'>");
  $(".scroll.up").click(function() {
    topPage -= 150;
    $('html, body').animate({
        scrollTop: $(document).scrollTop()-150
    }, 1000);
  })
}

/* Removes buttons that permit the user scroll the page up and down*/
function removeScrollButtons() {
  $(".scroll.down").remove();
  $(".scroll.up").remove();
}

/* Simulates clicks with single switch*/
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
      }
      else if(horizontalmovement=="up") {
        y = y-2; 
      }

      if(y >= $(window).height()) {
        horizontalmovement = "up";
      }
      else if(y <= 0) {
        horizontalmovement = "down";
      }

      console.log("new y is " + y + " " + $(window).height());

      $("#horizontal-scanbar").css("top", y+"px");
    }, 20);
  }
  else if(state=="verticalscan") {
    state = "horizontalscan";
    $("#vertical-scanbar").css("left", 0+"px");
    $("#vertical-scanbar").show();

    // Setting up the vertical scan
    interval = setInterval(function() {
      var offset = $("#vertical-scanbar").offset();
      var x = offset.left - leftPage;

      if(verticalmovement=="right") {
        x = x+2;
      }
      else if(verticalmovement=="left") {
        x = x-2;
      }

      if(x >= $(window).width()) {
        verticalmovement = "left";
      }
      else if(x <= 0) {
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

function magnification_off() {
      $("*:not(body)").hover( function(event) {

      $(".highlight").removeClass("highlight");
      $(this).removeClass("highlight");
    });
}

function magnification_on() {
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
  /*if (tab_reader == 0) {
    current_index = 0;
    tab_reader++;
  }*/
  console.log("total index " + all_elems.length)

  if (findNextReadable(all_elems, "focus")) {

    var elem = all_elems[current_index];
    var tag_name = elem.tagName;

    if (tag_name == "FORM") {
      screen_text = "input"
      speakText(screen_text);
    }
    else {
      /*$(all_elems[current_index]).focus();*/
      speakText($(all_elems[current_index]).text());
      console.log($(all_elems[current_index]).text())
    }
  }
}

function readPreviousFocusable(all_elems) {
  if (current_index == 0) {
    current_index = all_elems.length;
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
  current_index++;
  while (current_index < all_elems.length) {
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
    else {
      return false;
    }
    current_index++;
  }
  return false;
}

function isReadable (elem) {
  console.log("curr " + current_index)
  console.log(all_elems.length)
  var tag_name = elem.tagName;
  console.log(tag_name)
  if (tag_name == "SPAN" || tag_name == "A" || tag_name == "BUTTON") {
    elem.focus();
    console.log("********* " + elem)
    prev_elem = elem;
    speakText("link");
    if($(elem).attr("alt")) {
      speakText($(elem).attr("alt"));
    }
    return true;
  }
  else if (tag_name == "P") {
    prev_elem.blur();
    return true;
  }
  return false;
}

function isFocusable (elem) {
  var tag_name = elem.tagName;
  if (tag_name == "A" || tag_name == "FORM" || tag_name == "BUTTON") {
    elem.focus();
    if($(elem).attr("alt")) {
      speakText($(elem).attr("alt"));
    }
    return true;
  }
  return false;
}

function setToPaused() {
  current_state = "PAUSED";
  speechSynthesis.cancel();
}
/* ---- asg 4 ------ */
