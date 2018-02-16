
showInfo('info_start');


var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  console.log(start_button)
  start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
    showInfo('info_speak_now');
    start_img.src = 'mic-animate.gif';
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      start_img.src = 'mic.gif';
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      start_img.src = 'mic.gif';
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    start_img.src = 'mic.gif';
    if (!final_transcript) {
      showInfo('info_start');
      return;
    }
    showInfo('');
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    var speech = '';
    final_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
        speech += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);
    getText(final_span.innerHTML.trim())
  };
}

function upgrade() {
  start_button.style.visibility = 'hidden';
  showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = 'en-US'; //select_dialect.value;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  start_img.src = 'mic-slash.gif';
  showInfo('info_allow');
  start_timestamp = event.timeStamp;
}

function showInfo(s) {
  if (s) {
    for (var child = info.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == s ? 'inline' : 'none';
      }
    }
    info.style.visibility = 'visible';
  } else {
    info.style.visibility = 'hidden';
  }
}

function getText(speech) {

  var potential_command = speech;

  var re = /^(click|scroll|enter)\s(.*)/i;
  var result = re.exec(potential_command);

  if(result) {
    var verb = result[1].toLowerCase();
    var arg = result[2]

    console.log("verb: " + verb + ", args: " + arg)
    /*document.getElementById("demo").innerHTML = "";*/

    switch(verb) {
      case "click":
        clickLink(arg);
        break;
      case "scroll":
        if(arg == "down") {
          scrollDown();
        }
        else if (arg=="up"){
          scrollUp();
        }
        break;
      default:
        error_message = "sorry, that is not a recognized command";
        document.getElementById("demo").innerHTML = error_message;
    }
  }
  else if(speech != ""){
    error_message = "sorry, that is not a recognized command";
    document.getElementById("demo").innerHTML = error_message;
  }
  speech=null;
}


function clickLink(text) {
  var valid_command = false;
  var stringpieces = text.split(/\s/);

  console.log("text: " + text)

  $("a,input,button").each(function() {
    if($(this)[0].tagName == "INPUT") {
      console.log("---")
      console.log("entrou input")
      console.log($(this).text())
      for(var i=0; i<stringpieces.length;i++) {
        console.log("string pieces " + stringpieces[i])
        console.log("string pieces complete" + stringpieces)
        if(stringpieces[i] == $(this).attr("value") && $(this).attr("type") == "button") {
          valid_command = true;
        }
      }
    }
    else if($(this)[0].tagName == "A") {
      console.log("entrou a")
      console.log($(this).text().toLowerCase())
      if(text == $(this).text().toLowerCase()) {
        console.log("ENTROU")
        console.log($(this).attr("href"))
        window.location.href = $(this).attr("href");
        valid_command = true;
      }
      for(var i=0; i<stringpieces.length;i++) {
        console.log("---")
        console.log("string pieces " + stringpieces[i])
        console.log("string pieces complete" + stringpieces)
        if(stringpieces[i] == $(this).text().toLowerCase()) {
          window.location.href = $(this).attr("href");
          valid_command = true;
        }
      }
    }
    else{ //button
      console.log("entrou button")
      for(var i=0; i<stringpieces.length;i++) {
        if(stringpieces[i] == $(this).text()) {
          if(stringpieces[i] == "tennis") {
            goTennis();
          }
          valid_command = true;
        }
      }
    }
  })
  if(valid_command == false) {
    error_message = "sorry, that is not a recognized command";
    document.getElementById("demo").innerHTML = error_message;
  }
}

function scrollDown() {
  var scroll = 400;
  $('html, body').animate({
    scrollTop: $(document).scrollTop()+scroll
  }, 1000);
}

function scrollUp() {
  var scroll = 400;
  $('html, body').animate({
    scrollTop: $(document).scrollTop()-scroll
  }, 1000);
}
