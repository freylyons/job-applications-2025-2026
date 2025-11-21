	$(document).ready(function () {


	  //mobile nav
	  $('.mobile-nav-btn').click(function () {
	    $('#nav-links').toggleClass('open');
	  });
	  $('#close-icon').click(function () {
	    $('#nav-links').removeClass('open');
	  });

	  //NAVIGATION INDICATORS
	  var path = window.location.pathname.split("/").pop();


	  $(".nav-links a").removeClass("active");
	  $("#" + path).addClass("active");


	  //READ MORE

	  // Read more
	  $('.read-more').click(function (event) {
	    event.preventDefault();
	    $(this).closest('.short-content').next('.full-content').slideToggle();
	    $('.profile-details').toggleClass("show-on-phones");
	    $('#cw-intro img').toggleClass("active");


	    if ($(this).html().includes('Read more')) {
	      $(this).html('Read less <em class="chev-right"></em>');
	    } else {
	      $(this).html('Read more <em class="chev-right"></em>');
	    }
	  });

	  $('.read-more-gold').click(function (event) {
	    event.preventDefault(); // Prevent the default link action
	    $(this).closest('.short-content').next('.full-content').slideToggle();

	    // Change the text of the clicked "Read more" button
	    if ($(this).html().includes('Read more')) {
	      $(this).html('Read less <em class="chev-right-gold"></em>');
	    } else {
	      $(this).html('Read more <em class="chev-right-gold"></em>');
	    }
	  });


	  //COLOUR BOX
	  $.ajax({
	    //Change to pick up from Sitecore path
	    url: '/assets/js/images/colorbox/1.6.4/jquery.colorbox.min.js',
	    dataType: 'script',
	    success: function (data) {
	      //Change to pick up from Sitecore path
	      $('head').append($('<link/>').attr('rel', 'stylesheet').attr('href', '/assets/css/colorbox.min.css'));
	      var CbWidth = 95;
	      if (dimensions.tablet) {
	        CbWidth = 80;
	      } else if (dimensions.desktop) {
	        CbWidth = 50;
	      }
	      $('.link-colorbox a').on("click", function (event) {
	        event.preventDefault();
	      }).colorbox({
	        maxHeight: '100%',
	        maxWidth: CbWidth + '%',
	        scalePhotos: true,
	        scrolling: true,
	        onComplete: function () {
	          if (CbWidth == 95) {

	          } else {
	            $(this).colorbox.resize();
	          }
	        },
	        href: function () {
	          return $(this).attr('href') + ' #page_content';
	        }
	      });
	    },
	    error: function (XMLHttpRequest, textStatus, errorThrown) {
	      log(textStatus);
	    }
	  });


	});
