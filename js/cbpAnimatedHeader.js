var cbpAnimatedHeader=function(){function init(){window.addEventListener("scroll",function(){didScroll||(didScroll=!0,setTimeout(scrollPage,250))},!1)}function scrollPage(){var sy=scrollY();sy>=changeHeaderOn?classie.add(header,"navbar-shrink"):classie.remove(header,"navbar-shrink"),didScroll=!1}function scrollY(){return window.pageYOffset||docElem.scrollTop}var docElem=document.documentElement,header=document.querySelector(".navbar-fixed-top"),didScroll=!1,changeHeaderOn=300;init()}();