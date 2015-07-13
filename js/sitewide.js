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

  addLoadEvent( function() {
    if(document.cookie.indexOf('warned=true') != -1)
      document.getElementById('cookies-warning').style.display = 'none'
  } ) // +addLoadEvent
  hideCookiesWarning = function() {
    var date = new Date()
    date.setTime(date.getTime()+(30*24*60*60*1000))
    document.cookie = 'warned=true; expires='+date.toGMTString()+'; path=/'

    cookieFrame = 0
    for(var i = 1; i < 4; i++)
      window.setTimeout(function() {
                         document.getElementById('cookies-warning').style.height = (6-cookieFrame++*2)+'em'
                                   }, 50*i)
    document.getElementById('cookies-warning').style.border = '0px'
    document.getElementById('cookies-warning').style.padding = '0px'

    window.setTimeout(function() {
                         document.getElementById('cookies-warning').style.display = 'none'
                                   }, 200)
  } // hideCookiesWarning function


