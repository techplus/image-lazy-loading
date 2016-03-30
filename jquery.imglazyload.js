(function($){
  'use strict';

  var ImageLoader = function() {};

  ImageLoader.toArray = function(elements) {
      var tempArray = [];
      for (var i = 0; i < elements.length; i++) {
          tempArray.push(elements.eq(i));
      }
      return tempArray;
  }

  ImageLoader.loadImage = function(element, src, failedSrc, callback) {
    var img = $('<img />').attr('src',src);
    img.load(function(){
      element.attr('src',src);
      if(callback)
        callback(false);
    });
    img.error(function(){
      element.attr('src',failedSrc);
      if(callback)
        callback(true);
    });
  }

/**
** show images on load functionality
**/

  ImageLoader.prototype.showOnLoad = function() {
    this.removeClass('hide').show();
  }

  /**
  * show images on pipeline one after another
  **/

  ImageLoader.prototype.pipeline = function(options) {
    var options = $.extend({},ImageLoader.options.loadSequentially,options);
    var css = ImageLoader.options.css
    css['background-image'] = 'url('+options.loaderImg+')';
    this.css(css);
    var srcs = this.map(function(){
      return $(this).attr('src');
    });
    this.attr('src','');
    var pipelineImages = ImageLoader.toArray(this);
    var noOfLoadedImages = 0;
    var startLoading = function() {
      var img = pipelineImages[noOfLoadedImages];
      ImageLoader.loadImage(img,srcs[noOfLoadedImages], options.errorImg,function(hasError){
        if(hasError) {
          if(options.error && typeof options.error == 'function') {
            options.error(img,srcs[noOfLoadedImages],noOfLoadedImages);
          }
        } else {
          if(options.loaded && typeof options.loaded == 'function') {
            options.loaded(img,noOfLoadedImages);
          }
        }
        if(noOfLoadedImages < pipelineImages.length - 1) {
            noOfLoadedImages++;
            startLoading();
        }
      });
    }
    startLoading();
  }


  /**
  * define all jquery fn
  */


  var defaults = {
    loadSequentially: {
      "error": null,
      "loaded": null,
      "loaderImg": "loader.gif",
      "errorImg": "no-image.jpg"
    },
    css:{
      'background-image':'url(loader.gif)',
      'background-color': '#f8f8f8',
      'background-repeat':'no-repeat',
      'background-position':'50%'
    }
  }

  ImageLoader.options = defaults;

  var loader = new ImageLoader;

  $.fn.showOnLoad = loader.showOnLoad;



  $.fn.loadSequentially = loader.pipeline;

  //$(function(){
    // manually show images on load if showOnLoad class is given
    $('.showOnLoad').showOnLoad();
    $('.loadSequentially').loadSequentially();
  //});

})(jQuery);
