var converter = new Showdown.converter();
var blur = true;

$(window).resize(function(){resizeTextarea()});

function resizeTextarea() {
  var margins = $(window).height()/10;
  $('.editable, .preview').css("height", $(window).height()-2*margins);
  $('.editable, .preview').css("margin-top", margins);
}

resizeTextarea();

if(!localStorage.getItem("files")){
  localStorage.setItem("files", "[]");
}  

// A litle always focused hack ;)
$(".editable").blur(function(){
    var that = this;
    if (blur)
      setTimeout(function() { that.focus(); },0);
});

$(".row").click(function(){
  $(".popover").hide();
});


if (localStorage.getItem("exists")) { 
  $(".openFile").removeClass("hide");
}

$(".editable").keydown(function(e) {
  if(e.keyCode === 9) {
    var start = this.selectionStart;
    var end = this.selectionEnd;

    var $this = $(this);
    var value = $this.val();

    $this.val(value.substring(0, start)
              + "\t"
              + value.substring(end));

    this.selectionStart = this.selectionEnd = start + 1;
    e.preventDefault();
  }
});

$(".editable").keyup(function(){
  $(".charCount").text(""+$(this).val().length);
  $(".wordCount").text(""+$(this).val().split(/\s/).length);
});


/*---------------------------------
  ~Buttons Events
---------------------------------*/

// Home //

// Create new file Button //
$(".newFile").click(function() {
  $(".header").fadeOut(300).delay(1).queue(function(next){
    $(this).addClass("hide");
    $("footer").addClass("hide");
    $(".app").removeClass("hide");
    $(".editable").text("").focus();
    next();
  });
}); 

// Open file Button //
var openFile = false;
$(".openFile").click(function() {
  if (openFile) {
    $(".openFileName").val();
    $(".fileName").html($(".openFileName").val()+" &bull; ");
    $(".name").val($(".openFileName").val());
    openFile = false;
    $(".header").fadeOut(300).delay(1).queue(function(next){
      $(this).addClass("hide");
      $("footer").addClass("hide");
      $(".app").removeClass("hide");
      $(".editable").text(localStorage.getItem($(".openFileName").val())).focus();
      $(".charCount").text(""+$(".editable").val().length);
      $(".wordCount").text(""+$(".editable").val().split(/\s/).length);
      next();
    });
  }
  else {
    $(this).addClass("active");
    $(".openFileName").removeClass("hide");
    var files = JSON.parse(localStorage.getItem("files"));
    for (var i in files) {
      $(".openFileName").append($('<option>', files[i] ).text(files[i]));
    }
    openFile = true;
  }
}); 

// App //

// Change Theme Button //
/*$(".changeColors").click(function() {
  $("body").toggleClass("inverted");
  $(".bot, .top, .popover").toggleClass("dark");
});*/

// Preview Markdown Button //
$(".markDown").click(function() {
  $(".preview").html(converter.makeHtml($(".editable").val())).toggleClass("hide");
  $(".editable").toggleClass("hide");
  $(this).toggleClass("active");
});

// Save File Button //
$(".saveFile").click(function() {
  console.log("key: "+$(".name").val() + " value:" + converter.makeHtml($(".editable").val()));
  $(".fileName").html($(".name").val()+" &bull; ");
  $(".editable").focus();

  localStorage.setItem("exists", "true");

  if (localStorage.getItem($(".name").val()) == null) {
    var files = JSON.parse(localStorage.getItem("files"));
    files.push($(".name").val());
    localStorage.setItem("files", JSON.stringify(files));
  }

  localStorage.setItem($(".name").val(), $(".editable").val());

  //close popover
  $(this).parent().hide();

});


$(".fullScreen").click(function() {

  $(".popover").hide();

  var e = document.documentElement;
  if (e.requestFullscreen) {
    if (document.fullScreen){
      document.cancelFullScreen();
    }
    else {
      e.requestFullScreen();
    }
  }
  else if (e.mozRequestFullScreen) {
    if (document.mozFullScreen){
      document.mozCancelFullScreen();
    }
    else {
      e.mozRequestFullScreen();
    }
  }
  else if (e.webkitRequestFullScreen) {
    if (document.webkitIsFullScreen){
      document.webkitCancelFullScreen();
      $(".editable").focus();
    }
    else {
      e.webkitRequestFullScreen(e.ALLOW_KEYBOARD_INPUT);
      $(".editable").focus();
    }
  }
});

$(".settings, .save").click(function (){

  if(blur)
    blur =false;
  else
    blur = true;

  //get the object to activate!
  var pop = $("#"+$(this).data("value"));
  $(".popover").not(pop).hide();

  //First we get the top and right
  var top = $(this).position().top + 60; //It's a popover so needs to be down the actual button

  var right = $(window).width() - $(this).position().left - $(this).width()/2 - pop.outerWidth()/2;

  $("#"+$(this).data("value")).css({top: top, right: right}).toggle();
});