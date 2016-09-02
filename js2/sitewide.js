function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
      window.onload = func;
    } // if window.onload is empty
    else {
      window.onload = function() {
        if (oldonload) {
          oldonload();
        } // if oldonload
        func();
      } // window.onload
    } // else
  } // addLoadEvent()
