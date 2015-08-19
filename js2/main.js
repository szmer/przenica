chlonnik = {
  h : {
      oneWord: new OneWordHelper(),
      wordSearch: new WordSearchHelper()
    },
  textDisplay: new TextDisplay(),
  mainIndex: new WordIndex(),
  mode: 'input',
  delays : { // to be used when function splits a long process into steps
      delay : 50,
      timeout : 100,
      nextCallback: null,
      cache: { },
      intervalID: null
    },
 barGoTo: function(id) { // used by bottom (searching) bar
    var words = this.h.oneWord
    words.scrollTo(id, false)
    words.showBar(id)
 },
 mainButtonHandler: function() {
    switch(chlonnik.mode) {
     case 'input':
      chlonnik.textDisplay.showPending()
      // Force browser not to "optimize out" the indication above (so user won't feel that app "freezed").
      window.setTimeout(function() { chlonnik.textDisplay.processInput() }, 100)
      break
     case 'results':
      chlonnik.textDisplay.newInput()
      chlonnik.textDisplay.showInputMode()
      break
    } // switch
  }, // mainButtonHandler
  reflowDialog: function() {
    utl.id('page-count').innerHTML = '<input id="new-page-count" value="'+chlonnik.textDisplay.pageCount+'">'+
                                     ' <a href="javascript:chlonnik.reflowOK()">(zatwierdź)</a>'
    utl.id('reflow-link').blur()
    utl.id('reflow-link').style.display = 'none'
  },
  reflowOK: function() {
    var newNum = utl.id('new-page-count').value
    utl.id('page-count').innerHTML = newNum
    utl.id('reflow-link').style.display = 'inline'
  },
  scrollHandler: function() {
      var docHeight = document.body.offsetHeight || window.document.documentElement.scrollHeight
      var winheight = window.innerHeight || document.documentElement.clientHeight
      var scrollpoint = window.scrollY || window.document.documentElement.scrollTop
      if ((scrollpoint + winheight) >= docHeight) // ignore while in the bottom of the page to avoid infin loop 
        return

      var menu = utl.id('menu')
      var search = utl.id('wd-search')

      if(menu.getBoundingClientRect().top < 0 && !menu.className) {
         menu.className = 'sticky-menu'
         search.className = 'sticky-wd-search' 
         if(chlonnik.mode == 'results' &&
                 utl.id("main-button").getBoundingClientRect().left < utl.id("wd-search").getBoundingClientRect().right)
            utl.id("main-button").innerHTML = "usuń"
      }

      else if( (utl.id('text-input').getBoundingClientRect().top > 0
               || utl.id('text-results').getBoundingClientRect().top > 0)
             && menu.className) {
        menu.className = ''
        search.className = 'base-wd-search'
        if(chlonnik.mode == 'results') // clean low-red optimization (see above)
          utl.id('main-button').innerHTML = 'Inny/Kolejna wersja'
      } // elsei if

      // Set current page (from the center of screen).
      var ctrElem = document.elementFromPoint(document.documentElement.clientWidth/2,
                                              document.documentElement.clientHeight/2)
      while(ctrElem.id) {
        if(ctrElem.id.substr(0,3) == 'pg-')
          chlonnik.textDisplay.setPage(parseInt(ctrElem.id.substr(3)))
        ctrElem = ctrElem.parentNode
      } // while ctrElem.id
  } // scrollHandler
} // chlonnik object

// Event bindings on initialization.
addLoadEvent( function() {

  Mousetrap.bind(['command+;', 'ctrl+;'], chlonnik.mainButtonHandler)

  utl.id('main-button').onclick = chlonnik.mainButtonHandler

  utl.id('text-results').onmousedown = function(event) { chlonnik.h.oneWord.mouseDown(event) }
  document.body.onmousedown = function(event) { 
          if(chlonnik.mode == 'results' && (event.target == document.body
                                            || event.srcElement == document.body))
            chlonnik.h.oneWord.mouseDown(event)
        }

  utl.id('wd-search-input').onkeyup = function(event) { chlonnik.h.wordSearch.search(utl.id('wd-search-input').value) }

  window.onscroll = function() { window.setTimeout(chlonnik.scrollHandler, 500) }
} ) // +addLoadEvent
