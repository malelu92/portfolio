var current_index = 0;
var tab_reader = 0;
var divBetterDisplay = $("<div class='betterDisplayBackground'><div class='betterDisplay'></div>");
var magnifier = false;
var prev_elem = null;
var horizontalmovement = "down"; // up
var verticalmovement = "right"; // left, right
var state = "none";  // verticalscan, horizontalscan, none
var interval = null;
var topPage = 0;
var readerClicked = false;


$(document).ready(function() {
  /*var magnifier = false;*/

  if(sessionStorage.getItem ('switch') == "true") {
    addScrollButtons();
    $("#switch_feature_on").css("border", "5px solid rgb(0,51,0)");
    $("#switch_feature_off").css("border", "none");
  }

  if(sessionStorage.getItem('magmag') == "true") {
    $("#mag_feature_on").css("border", "5px solid rgb(0,51,0)");
    $("#mag_feature_off").css("border", "none");
    magnification_on();
  }

  if(sessionStorage.getItem('reader') == "true") {
    $("#reader_feature_on").css("border", "5px solid rgb(0,51,0)");
    $("#reader_feature_off").css("border", "none");
  }

  //activate magnifier feature
  $("#mag_feature_on").click(function() {
    magnification_on();
    sessionStorage.setItem('magmag', true);
    $(this).blur();

    $("#mag_feature_on").css("border", "5px solid rgb(0,51,0)");
    $("#mag_feature_off").css("border", "none");
  });

  //deactivate magnifier feature
  $("#mag_feature_off").click(function() {
    magnification_off();
    $(this).blur();
    sessionStorage.setItem('magmag', false);

    $("#mag_feature_off").css("border", "5px solid rgb(102,0,0)");
    $("#mag_feature_on").css("border", "none");
  });

  //activate reader feature
  $("#reader_feature_on").click(function() {
    tab_reader = 0;
    current_index = 0;
    sessionStorage.setItem('reader', true);

    readerClicked = true;
    $("#reader_feature_on").css("border", "5px solid rgb(0,51,0)");
    $("#reader_feature_off").css("border", "none");
  });

  //deactivate reader feature
  $("#reader_feature_off").click(function() {
    sessionStorage.setItem('reader', false);
    $("#reader_feature_off").css("border", "5px solid rgb(102,0,0)");
    $("#reader_feature_on").css("border", "none");
  });

  //activate switch feature
  $("#switch_feature_on").click(function() {
    addScrollButtons();

    $("#switch_feature_on").css("border", "5px solid rgb(0,51,0)");
    $("#switch_feature_off").css("border", "none");

    sessionStorage.setItem('switch', true);
    $('html, body').animate({
      scrollTop: 0
    }, 1500);

  });

  //deactivate switch feature
  $("#switch_feature_off").click(function() {
    removeScrollButtons();
    sessionStorage.setItem('switch', false);

    $("#switch_feature_off").css("border", "5px solid rgb(102,0,0)");
    $("#switch_feature_on").css("border", "none");
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

  $("#button-resume").click(function() {
    location.href = "resume.html";
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
    if (event.keyCode == 32 && ((sessionStorage.getItem('magmag')) == "true")){
      event.preventDefault();
      addZoomedDisplay();
    }

    //switch input
    if(sessionStorage.getItem('switch') == "true") {
      if(event.key=="b") {
        switchInput();
      }
    }

    //screen reader
    if(sessionStorage.getItem('reader') == "true"){
      if(event.key == "Escape") {
        setToPaused();
      }

      //read down = shift + down arrow
      if(event.shiftKey && event.keyCode == 40) {
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
          if(readerClicked) {
            console.log("ANTES " +current_index)
            isReaderOn()
            console.log("DEPOIS " +current_index)
            readerClicked = false;
          }
          /*if (current_index == 0 && readerClicked) {
            $(".name").focus();
            readerClicked == false;
          }*/
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
      $('.navIcon').addClass('shrink');
    }
    else {
      $('.header').removeClass('shrink');
      $('.name').removeClass('shrink');
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

  if($(window).scrollTop() + $(window).height() == $(document).height()) {
    $("#contacts-id").addClass('active');
    $("#work-id").removeClass('active');
  }
  });
}

//SWICTH INPUT ----------------
/* Adds buttons that permit the user scroll the page up and down*/
function addScrollButtons() {
  var scroll = 400;
  $("body").append("<input type='button' class='scroll down' value='down'>");
  $(".scroll.down").click(function() {
    topPage += scroll;
    $('html, body').animate({
        scrollTop: $(document).scrollTop()+scroll
    }, 1000);
  })

  $("body").append("<input type='button' class='scroll up' value='up'>");
  $(".scroll.up").click(function() {
    topPage -= scroll;
    $('html, body').animate({
        scrollTop: $(document).scrollTop()-scroll
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

/*Moves scanbar*/
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

      console.log("offset.top " + offset.top)
      console.log("topPage " + topPage)

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
      var x = offset.left;

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

      /*console.log("new x is " + x + " " + $(window).width());*/

      $("#vertical-scanbar").css("left", x+"px");
    }, 20);
  } 
  else if(state=="horizontalscan") {
    state = "none";
    var offset = $("#vertical-scanbar").offset();
    var x = offset.left + $("#vertical-scanbar").width()/2.0;

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
        /*console.log(elementtoclick)*/
      }
      cont +=1;
    });

    $("#horizontal-scanbar").hide();
    $("#vertical-scanbar").hide();
  }
}

//MAGNIFIER-------------------------

/*Adds and removes magnified text*/
function addZoomedDisplay() {
  if (magnifier == false) {
    $("body").append(divBetterDisplay);
    $(".betterDisplay").text(screen_text);

    /*event.stopPropagation();
    event.preventDefault();*/
    magnifier = true;
  }
  else {
    divBetterDisplay.remove();
    magnifier = false;
  }
}

/*Removes highlight on magnification*/
function magnification_off() {
  $("*:not(body)").hover( function(event) {
    $(".highlight").removeClass("highlight");
    $(this).removeClass("highlight");
  });
}

/*Adds highlight on magnification*/
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

/*Speaks previous text on DOM*/
function readPreviousText(all_elems) {
  if (findPreviousReadable(all_elems, "any_tags")) {
    speakText($(all_elems[current_index]).text());
  }
  else {
    /*if previous element goes to the bottom the page*/
    if (current_index <= 0) {
      current_index = all_elems.length;
      if (findPreviousReadable(all_elems, "any_tags")) {
        speakText($(all_elems[current_index]).text());
      }
    }
  }
}

/*Speaks next text on DOM*/
function readNextText(all_elems) {
  if (findNextReadable(all_elems, "any_tags")) {
    speakText($(all_elems[current_index]).text());
  }
  else {
    /*if next element goes back to top of the page*/
    if (current_index == all_elems.length) {
      current_index = 0;
      if (findNextReadable(all_elems, "any_tags")) {
        speakText($(all_elems[current_index]).text());
      }
    }
  }
}

/*Speaks next tab element on DOM*/
function readNextFocusable(all_elems) {
  /*if (tab_reader == 0) {
    current_index = 0;
    tab_reader++;
  }*/

  if (findNextReadable(all_elems, "focus")) {
    var elem = all_elems[current_index];
    var tag_name = elem.tagName;

    if (tag_name == "FORM") {
      screen_text = "input"
      speakText(screen_text);
    }
    else {
      speakText($(all_elems[current_index]).text());
      console.log($(all_elems[current_index]).text())
    }
  }
}

/*Speaks previous tab element on DOM*/
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

/*Speaks given text*/
function speakText(text) {
  u = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(u); 
}

/*Iterates until identifying previous readable element*/
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
  return false;
}

/*Iterates until identifying next readable element*/
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
    /*else if (type == "on") {
      if (isReaderOn(all_elems[current_index])) {
        return true;
      }
    }*/
    else {
      return false;
    }
    current_index++;
  }
  return false;
}

/*Checks if current element can be spoken aloud*/
function isReadable (elem) {
  console.log("curr " + current_index)
  var tag_name = elem.tagName;
  console.log(tag_name)
  if (tag_name == "SPAN" || tag_name == "A" || tag_name == "BUTTON") {
    console.log("----- " + $(elem).attr("name"))
    if($(elem).attr("class") != "dp-items" && !($(elem).attr("name"))) {
      elem.focus();
      prev_elem = elem;
      speakText("link");
      if($(elem).attr("alt")) {
        speakText($(elem).attr("alt"));
      }
      return true;
    }
  }
  else if (tag_name == "P") {
    prev_elem.blur();
    return true;
  }
  return false;
}

/*Checks if current tab element can be spoken aloud*/
function isFocusable (elem) {
  var tag_name = elem.tagName;
  if (tag_name == "A" || tag_name == "FORM" || tag_name == "BUTTON") {
    if($(elem).attr("class") != "dp-items" && !($(elem).attr("name"))) {
      if($(elem).attr("alt")) {
        speakText($(elem).attr("alt"));
      }
      return true;
    }
  }
  return false;
}

/*Gets first on*/
function isReaderOn() {
  while (current_index < all_elems.length) {
    var elem = all_elems[current_index]
    var tag_name = elem.tagName;
    if (tag_name == "BUTTON") {
      if($(elem).attr("id") == "reader_feature_on") {
        break;
      }
    }
    current_index++;
  }
}

/*Stops speech*/
function setToPaused() {
  current_state = "PAUSED";
  speechSynthesis.cancel();
}






