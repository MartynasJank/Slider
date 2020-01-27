$(function(){
    var currentWidth = 0;
    var windowWidth = $(window).width();
    var invertalTime = 5000;
    var slideSpeed = 800;
    var appearSpeed = 400;
    var index = 0;
    var elemHeight = 0;
    var buttonHeight = 0;
    var autoslide = false;
    
    var touchstartX = 0;
    var touchendX = 0;
    var gesuredZone = document.getElementById("slides");
    
    var slideCount = $("li.slide");
    var slides = $(".slides");
    var width = $(window).width() * (slideCount.length+1);
    
    var first = slideCount.filter(':first');
    var last = slideCount.filter(':last');
    first.before(last.clone(true)); 
    last.after(first.clone(true));
    
    slides.css("width", width);

    //BULLET NUMBER ACCORDING TO PICTURES
    for(var i = 0; i < slideCount.length; i++){
        $(".bullets").append('<div class="bullet"><img src="images/bullet.png"></div>');
    }
    $(".bullet").eq(index).addClass('active');
    
    //RESIZE
    $(window).resize(function(){
        windowWidth = $(window).width();
        width = windowWidth * (slideCount.length+1);
        slides.css("width", width);
        if(index == slideCount.length){
            index = 0;
        }
        currentWidth = -windowWidth * index;
        slides.css('marginLeft', currentWidth);
    });
    
    elemHeight = $("li.slide h2").eq(index).height();
    buttonHeight = $("li.slide button").eq(index).innerHeight();
    
    $("li.slide button").css('bottom', -elemHeight);
    $("li.slide h6").css('bottom', elemHeight);
    
    $("li.slide button").animate({
        opacity: 1,
        bottom: -buttonHeight -20
    }, appearSpeed);

    $("li.slide h6").animate({
        opacity: 1,
        bottom: elemHeight +10
    }, appearSpeed);
    
    //INTERVALAS
    if(autoslide){
        var autoplay = setInterval(right, invertalTime);
    }
    
    //EVENTS//
    //BUTTONS
    $('.arrowRight').click(function(){
        right();
    });
    
    $('.arrowLeft').click(function(){
        left();
    });
    
    //BULLETS
    $(".bullet").click(function(){
        currentWidth = -($(this).index() * $(window).width());
        index = $(this).index();
        slideAnimation(slideSpeed, appearSpeed);
    });
    
    //SWIPES
    gesuredZone.addEventListener('touchstart', function(event) {
        touchstartX = event.changedTouches[0].screenX;;
    }, false);
    
    gesuredZone.addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;;
        handleGesure();
    }, false); 
    
    function handleGesure() {
        if (touchendX < touchstartX) {
            right();
        }
        if (touchendX > touchstartX) {
            left();
        }
    }
    
    //FUNCTIONS
    function right(){
        if(index >= slideCount.length-1){
            index = 0;
        } else {
            index++;
        }
        if(currentWidth == -windowWidth * slideCount.length){
            currentWidth = -windowWidth;
            slideAnimation(slideSpeed, appearSpeed);
        } else {
            currentWidth -= windowWidth;
            slideAnimation(slideSpeed, appearSpeed);
        }
        if(currentWidth <= -width + windowWidth){
            currentWidth = 0;
            slideAnimation(0, 0);
        }
        console.log(index);
    }

    function left(){
        if(index <= 0){
            index = slideCount.length-1;
        } else { 
            index--;
        }
        if(currentWidth >= 0){
            currentWidth = -width + $(window).width();
            slideAnimation(0, 0);
        }
        currentWidth += windowWidth;
        slideAnimation(slideSpeed, appearSpeed);
        console.log(index);
    }

    function slideAnimation(slideTime, opacityTime){
        resetAnimation();
        elemHeight = $("li.slide h2").eq(index).height();            
        buttonHeight =  $("li.slide button").eq(index).innerHeight();
        if(autoslide){
            clearInterval(autoplay);
            autoplay = setInterval(right, invertalTime);
        }
        slides.animate({
                marginLeft: currentWidth,
        }, slideTime, function(){
            $("li.slide h2").animate({
                opacity: 1
            }, opacityTime, function(){
                $("li.slide button").animate({
                    opacity: 1,
                    bottom: -buttonHeight -20
                }, opacityTime);

                $("li.slide h6").eq(index).animate({
                    opacity: 1,
                    bottom: elemHeight +10
                }, opacityTime);
            });
        });
        $('.bullet').removeClass('active');
        $('.bullet').eq(index).addClass('active');
    }

    function resetAnimation(){
        $("li.slide h2").stop(true, true).css({"opacity": 0});
        $("li.slide button").stop(true, true).css({
            "opacity": 0,
            "bottom": -elemHeight
        });
        $("li.slide h6").stop(true, true).css({
            "opacity": 0,
            "bottom": +elemHeight
        });
    }
});