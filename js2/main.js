chlonnik = {
  h : {
      file: new FileHelper(),
      oneWord: new OneWordHelper(),
      wordSearch: new WordSearchHelper()
    },
  textDisplay: new TextDisplay(),
  mainIndex: new WordIndex(),
  mode: 'input',
  delays : { // to be used when function splits a long process into steps
      delay : 20,
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
 fileButtonHandler: function() {
   if(utl.id('load-file-area').style.display == 'none') {
     utl.id('file-button').innerHTML = lang.dict()['Abort_upload']
     utl.id('load-file-area').style.display = 'block'
     chlonnik.h.file.clearFileInput()
   }
   else {
     utl.id('file-button').innerHTML = lang.dict()['Upload_file']
     utl.id('load-file-area').style.display = 'none'
     utl.id('load-file-error').style.display = 'none'
     utl.id('load-file-error').innerHTML = ''
   }
 },
 loadFileHandler: function(event) {
   if(!event.target.files.length)
     return
   var f = event.target.files[0]
   // Validate MIME file type.
   if(f.type != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') 
     return chlonnik.h.file.blow(lang.dict()['Docx_only'])
   var fread = new FileReader()
   fread.onload = function(event) { chlonnik.h.file.feedDocx(event.target.result) }
   fread.readAsBinaryString(f)
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
    utl.id('page-count').innerHTML = '<input id="new-page-count" value="'+this.textDisplay.pageCount+'">'+
                                     ' <a href="javascript:chlonnik.reflowOK()">('+lang.dict()['confirm']+')</a>'
    utl.id('reflow-link').blur()
    utl.id('reflow-link').style.display = 'none'
  },
  reflowOK: function() {
    var newNum = utl.id('new-page-count').value
    if(this.textDisplay.reflow(newNum)) {
      // leave page to be updated by the display func
      utl.id('reflow-link').style.display = 'inline'
    }
    else {
      utl.id('page-count').innerHTML = this.textDisplay.pageCount
      utl.id('reflow-link').style.display = 'inline'
      utl.log('Couldn\'t reflow text to '+newNum+' pages')
    }
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
            utl.id("main-button").innerHTML = lang.dict()['remove']
      }

      else if( (utl.id('text-input').getBoundingClientRect().top > 0
               || utl.id('text-results').getBoundingClientRect().top > 0)
             && menu.className) {
        menu.className = ''
        search.className = 'base-wd-search'
        if(chlonnik.mode == 'results') // clean low-red optimization (see above)
          utl.id('main-button').innerHTML = lang.dict()['Load_another']
      } // elsei if

      // Set current page (from the center of screen).
      var pixel = {x: document.documentElement.clientWidth/2, y: document.documentElement.clientHeight/2}
      var pages = utl.id('results-pages')
      for(var i = 0; i < 5; i++) {
        var ctrElem = document.elementFromPoint(pixel.x, pixel.y)
	if(ctrElem.offsetTop < pages.offsetTop) { // elements of interfaces on top of the page
          chlonnik.textDisplay.setPage(1)
	  break
	}
        if(ctrElem.nodeName == "SPAN") { // calculating position is possible
          var guessPage = Math.floor(chlonnik.textDisplay.pageCount
                                    * (ctrElem.offsetTop - pages.offsetTop) / pages.offsetHeight)
          if(guessPage > chlonnik.textDisplay.pageCount)
            guessPage = chlonnik.textDisplay.pageCount
          var ok = false
          for(var j = 0; j < 5; j++) {
            if(utl.id('pn-'+guessPage).offsetTop > ctrElem.offsetTop) {
              guessPage--
              continue
            }
            if(guessPage < chlonnik.textDisplay.pageCount
               && utl.id('pn-'+(guessPage+1)).offsetTop < ctrElem.offsetTop) {
              guessPage++
              continue
            }
            ok = true
            break
          }
          if(ok)
            chlonnik.textDisplay.setPage(guessPage)
          return
        }
        pixel.x = pixel.x + Math.random() * 60 - 30
        pixel.y = pixel.y + Math.random() * 60 - 30
      } // while true
  }, // scrollHandler
  togglePagingHandler: function() {
    var pgLinks = utl.id('paging').getElementsByTagName('a')

    if(chlonnik.textDisplay.pagingVisible) {
      for (var a in pgLinks)
        pgLinks.item(a).style.display = 'none'
      utl.id('paging-toggler').innerHTML = '&#x2398;'+lang.dict()['pages']
      chlonnik.textDisplay.pagingVisible = false
    }

    else {
      for (var a in pgLinks)
        pgLinks.item(a).style.display = 'inline'
      utl.id('paging-toggler').innerHTML = '&#x2397;'
      chlonnik.textDisplay.pagingVisible = true
    } // else (== ! chlonnik.textDisplay.pagingVisible)
  } // togglePagingHandler
} // chlonnik object

// Event bindings on initialization.
addLoadEvent( function() {

  Mousetrap.bind(['command+;', 'ctrl+;'], chlonnik.mainButtonHandler)

  utl.id('text-input').placeholder = lang.dict()['app_hint']
  utl.id('wd-search-input').placeholder = lang.dict()['find_hint']

  utl.id('main-button').onclick = chlonnik.mainButtonHandler

  utl.id('text-results').onmousedown = function(event) { chlonnik.h.oneWord.mouseDown(event) }
  document.body.onmousedown = function(event) { 
          if(chlonnik.mode == 'results' && (event.target == document.body
                                            || event.srcElement == document.body))
            chlonnik.h.oneWord.mouseDown(event)
        }

  utl.id('load-file').addEventListener('change', chlonnik.loadFileHandler, false)
  utl.id('wd-search-input').onkeyup = function(event) { chlonnik.h.wordSearch.search(utl.id('wd-search-input').value) }

  window.onscroll = function() { window.setTimeout(chlonnik.scrollHandler, 500) }
} ) // +addLoadEvent
