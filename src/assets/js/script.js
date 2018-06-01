$(document).ready(function () {

  $.magneticScroll({
    'selector': '.section',
    'easing': 'linear'
  });

  const players = Array.from(document.querySelectorAll('.js-player'))
    .map(player => new Plyr(player, {
      controls: [
        'play-large',
        'play',
        'progress',
        'mute',
        'volume',
        'fullscreen'
      ],
      tooltips: {
        seek: false
      },
      displayDuration: false,
      showPosterOnEnd: true
    })
  );

  var slider = new Swiper ('.swiper-container', {
    preloadImages: false,
    lazy: {
      loadPrevNext: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    simulateTouch: false,
    on: {
      slideChange: function () {
        pausePlayers();
      }
    }
  });

  function pausePlayers() {
    $.each(players, function() {
      this.pause();
    });
  }

  $("audio").on("play", function(){
    pausePlayers();
  });

  $('.sound-player').mediaPlayer();

  $(".simple-sound-player").each(function (i, val) {
    var label = $(val).attr("data-label");
    var play = $(val).attr("data-play");
    var pause = $(val).attr("data-pause");
    $(val).append("<span class=\"label\">" + label + "</span>");
    $(val).append("<span class=\"play\" style=\"opacity: 0\">" + play + "</span>");
    $(val).append("<span class=\"pause\" style=\"opacity: 0\">" + pause + "</span>");
  });

  $(".simple-sound-player").on("click", function(){
    var isPlayed = $( this ).hasClass("played");
    $(".simple-sound-player").removeClass("played");
    if (isPlayed) {
      var audio = $("#simple-sound-player")[0];
      audio.pause();
    } else {
      var src = $( this ).attr("data-src");
      $("#simple-sound-player").attr({
        'src': src,
        'volume':0.5
      });
      var audio = $("#simple-sound-player")[0];
      audio.play();
      $( this ).addClass("played");
    }
  });

  $("#simple-sound-player").on("ended", function() {
    $(".simple-sound-player").removeClass("played");
  });

  $( "#main-anchors > div, #main-menu li" ).on( "click", function(event) {
    event.stopPropagation();
    var sectionId = $( this ).attr('data-id');
    if (jQuery.inArray( sectionId, ['fm', 'tm', 'am']) > -1) {
      sectionId +=  '-1';
    }
    $("#main-menu").removeClass("show");
    scrollTo(sectionId);
  });

});

function scrollTo(id) {
  $('html, body').animate({
    scrollTop: $('#' + id).offset().top
  }, 500);
}

function setActiveMainAnchor(active) {
  //set active
  var selected = $('#main-anchors div.active').attr('data-id');
  if(selected !== active) {
    $('#main-anchors div').removeClass('active');
    $('#main-anchors div[data-id="' + active + '"]').addClass('active');
  }
}

function setActiveMenu(active) {
  //set active
  var selected = $('#main-menu li.active').attr('data-id');
  if(selected !== active) {
    $('#main-menu li').removeClass('active');
    if (active.startsWith("am-")) {
      $('#main-menu li[data-id="am"]').addClass('active');
    } else {
      $('#main-menu li[data-id="' + active + '"]').addClass('active');
    }
  }
}

function setAnchorsColor() {

  function getCurrentSectionId(anchorOffset) {
    var $currSection = $('.section').filter(function() {
      var $this = $(this);
      var offset = $this.offset().top;
      return anchorOffset >= offset && offset + $this.outerHeight() >= anchorOffset;
    });
    return $currSection[0].id;
  }

  function setAnchorColor(anchor, shift) {
    var offset = anchor.offset().top + shift;
    var currentSectionId = getCurrentSectionId(offset);
    var isDark = $('#' + currentSectionId).hasClass('dark');
    if (isDark && !anchor.hasClass('dark')) {
      anchor.addClass('dark');
    } else if (!isDark && anchor.hasClass('dark')) {
      anchor.removeClass('dark');
    }
  }

  $('#main-anchors > div').each(function() {
    setAnchorColor($(this), 27);
  });

  $('#left-menu .bottom > div').each(function() {
    setAnchorColor($(this), 15);
  });

}

function getCurrentActiveSectionId(view, scrollTop){
  var $currSection = $('.section').filter(function() {
    var $this = $(this);
    var offset = $this.offset().top;

    return scrollTop >= offset - view && offset + ($this.outerHeight() - view) >= scrollTop;
  });
  return $currSection[0].id;
}

$(window).on('scroll', function() {
  var scrollTop = $(window).scrollTop();
  var winHeight = $(window).height();
  var docHeight = $(document).height();
  var view = winHeight / 2;
  var activeId = getCurrentActiveSectionId(view, scrollTop);
  var activeMainAnchor = activeId.split('-')[0];

  setActiveMainAnchor(activeMainAnchor);
  setActiveMenu(activeId);
  setAnchorsColor();

  if(scrollTop + winHeight > docHeight - 50) {
    $('body').addClass('site-end');
  } else {
    $('body').removeClass('site-end');
  }

  didScroll = true;

});

var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('.header').outerHeight();

setInterval(function() {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 250);

function hasScrolled() {
  var st = $(this).scrollTop();

  // Make sure they scroll more than delta
  if(Math.abs(lastScrollTop - st) <= delta)
    return;

  if (st >= 80) {
    $('.header').addClass('sticky');
  } else {
    $('.header').removeClass('sticky');
  }

  // If they scrolled down and are past the navbar, add class .nav-up.
  // This is necessary so you never see what is "behind" the navbar.
  if (st > lastScrollTop && st > navbarHeight){
    // Scroll Down
    $('.header').removeClass('nav-down').addClass('nav-up');
  } else {
    // Scroll Up
    if(st + $(window).height() < $(document).height()) {
      $('.header').removeClass('nav-up').addClass('nav-down');
    }
  }

  lastScrollTop = st;
}
