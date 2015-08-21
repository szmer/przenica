function TextDisplay_addPageCounts() {
  for(var i = 1; i < this.pageCount+1; i++) {
    var pageNum = utl.id('pn-'+i).innerHTML
    utl.id('pn-'+i).innerHTML = pageNum + " z " + this.pageCount
  }
}

// TextDisplay_checkPaging checks whether to start new page. If it started a new page,
// returns true, and false otherwise.
function TextDisplay_checkPaging() {
  if(this.columnInLine > this.pgCols) {
    this.lineOnPage++
    this.columnInLine = 0
    //this.columnInLine = this.columnInLine - this.pgCols
  }

  if((this.lineOnPage == this.pgRows && this.columnInLine > this.pgCols * 0.8)
      || this.lineOnPage > this.pgRows) {
    this.pageCount++
    this.lineOnPage = 0
    this.columnInLine = 0
    return true
  }

  return false
} // _checkPaging()

function TextDisplay_newInput() {
  chlonnik.h.oneWord.clear()

  this.initialize()

  chlonnik.mainIndex.clear() // drop not longer needed data from the memory

  utl.id('text-input').value = ''
  utl.id('text-results').innerHTML = ''
  utl.id('text-input').style.display = 'block'
  utl.id('text-results').style.display = 'none'
}

function TextDisplay_processInput() {
  this.p_rawText = utl.id('text-input').value
  chlonnik.mainIndex.absorb( this.p_rawText )

  this.displayResults()
} // textDisplay_processInput function

function TextDisplay_progress(fract) {
  utl.id('main-button').innerHTML = Math.floor(fract*100) + '%'
}

function TextDisplay_setPage(num) {
  if(utl.id("pgl-"+this.currentPage))
    utl.id("pgl-"+this.currentPage).className = ''
  utl.id("pgl-"+num).className = 'current-pg'
  this.currentPage = num
} // _setPage(num)

function TextDisplay_displayResults() {
  var display = this
  var wait = function() {
      if(!chlonnik.mainIndex.isIndexed)
        window.setTimeout(wait, chlonnik.delays.delay)
      else {
        utl.id('text-input').style.display = 'none'
        utl.id('text-results').style.display = 'block'
        chlonnik.delays.nextCallback = function(cch) {
            var stepStart = Date.now()
            for(; cch.i < chlonnik.mainIndex.charCount; cch.i++) {
              if((Date.now() - stepStart) > chlonnik.delays.timeout) {
               window.setTimeout(function() { chlonnik.delays.nextCallback(chlonnik.delays.cache) }, chlonnik.delays.delay)
               display.progress(0.3 + cch.i / chlonnik.mainIndex.charCount * 0.7)
               return false
              } // if timeout'ed
          
              var f = display.formatTextChunk(cch.i)
              cch.resultText += f.html
              // Skip the remaining chars in the word.
              cch.i = f.continue_from
            } // for characters in raw text
          
            display.showResultsMode()

            var stats = "<div id='results-stats'><h2>Statystyka dokumentu</h2><table><tbody>"+
                        "<tr><th>Liczba znaków</th><td>"+chlonnik.mainIndex.charCount+"</td></tr>"+
                        "<tr><th>Liczba słów</th><td>"+chlonnik.mainIndex.getWordCount()+"</td></tr>"+
                        "<tr><th>(nie licząc powtórzeń)</th><td>"+chlonnik.mainIndex.getWordDiversity()+"</td></tr>"+
                        "<tr><th>Liczba stron <a id='reflow-link' href='javascript:chlonnik.reflowDialog()'>(zmień)</a></th>"+
                            "<td id='page-count'>"+display.pageCount+"</td></tr>"+
                        "</tbody></table></div>"
            var paging = '<div id="paging">'+display.pagingCode()+'</div>'

            utl.id('text-results').innerHTML = paging+stats+'<div id="results-pages">'+cch.resultText+'</div>'
            cch.resultText = null

            display.addPageCounts()
            utl.id('pgl-1').className = 'current-pg'

            chlonnik.mainIndex.p_markDisplayed()
            return true
        } // step function (delays.nextCallback)
        display.redRGBFactor = Math.floor(
                                 1 / (Math.pow(chlonnik.mainIndex.charCount, 1.5) / 210 / chlonnik.mainIndex.getWordDiversity())
                                   * 255)
        chlonnik.delays.cache = {
          index : chlonnik.mainIndex,
          resultText: '',
          i: 0
        } // chlonnik.delays.cache object
        chlonnik.delays.nextCallback(chlonnik.delays.cache)
      } // else (mainIndex's done its job)
    } // wait function
  wait()
} // TextDisplay_displayResults function         

function TextDisplay_formatTextChunk(startpos) {
  var index = chlonnik.mainIndex

  ret = ""
  if(this.lineOnPage == 0 && this.columnInLine == 0)
    ret += this.pageStartCode(this.pageCount) 

  // Handle numbers, punctuation etc.
  if(! index.getEndPos(startpos)) { // falsey value = non-word data
    if(this.p_rawText[startpos] == '\n') {
      this.lineOnPage++
      this.columnInLine = 0
      if(this.checkPaging())
        return {'html': ret+'</div>', 'continue_from': startpos}
      return {'html': ret+'<br>', 'continue_from': startpos}
    }
    else {
      this.columnInLine++

      if    (this.checkPaging()) {
        // Include all non-whitespace chars in the present page
        var ch = this.p_rawText[startpos]
        while(!ch.match(/^\s*$/)) {
          startpos++
          ret += ch
          ch = this.p_rawText[startpos]
        }
        while(ch == ' ') { // trim spaces too
          startpos++
          ch = this.p_rawText[startpos]
        }
        return {'html': ret+'</div>', 'continue_from': startpos}
      } // if this.checkPaging()

      return {'html': ret+this.p_rawText[startpos], 'continue_from': startpos}
    }
  }
          
  var word = this.p_rawText.substr(startpos, (index.getEndPos(startpos)-startpos+1))
  var frequency = index.getPositions(word).length || index.getNumbers(word).length
  var red = frequency * this.redRGBFactor
  if(red > 255)   red = 255
  // var other = 64 // Math.ceil(red / 4)
  var blue = Math.ceil(176 - 136 * (red / 255))
  var html = '<span id=w-' + this.wordN + ' style="color: rgb(' + red + ',' + 96 + ',' + blue + ')">'
  if(word.length > 1 && index.isRepeatedNearly(word, startpos, 200))
    html += '<u>' + word + '</u></span>'
  else
    html += word + '</span>'
 
  if(!index.isDisplayed)
    index.p_insertID(word, index.getPositions(word).indexOf(startpos), this.wordN)
  this.wordN++
  this.columnInLine += word.length
  startpos = index.getEndPos(startpos)

  if(this.checkPaging()) {
    ch = this.p_rawText[++startpos]
    while(!ch.match(/^\s*$/)) {
      html += ch
      startpos++
      ch = this.p_rawText[startpos]
    }
    startpos-- // return to this whitespace next time
    html += "</div>"
  }

  return {'html': ret+html, 'continue_from': startpos }
} // _formatTextChunk(chunk)

function TextDisplay_pageStartCode(num) {
 return "<div class='results-page' id='pg-"+num+"'><div class='page-number' id='pn-"+
           num+"'>strona "+num+"</div>"
}

function TextDisplay_pagingCode() {
  var paging = ''
  for(var i = 0; i < 10; i++) {
    if(i == 0) {
      var j = 10
      paging += "&nbsp;&nbsp;&nbsp;"
    }
    else
      var j = 0
    for(; (j+i) < this.pageCount+1; j+=10)
      paging += "<a id='pgl-"+(i+j)+"' href='#pg-"+(i+j)+"'>"+(i+j)+"</a> "
    paging += "<br>"
  }
  return paging
}

function TextDisplay_reflow(pgCount) {
  var chCount = chlonnik.mainIndex.charCount

  if(pgCount == 0 || pgCount > chCount / 10)
    return false

  if(pgCount == 1)
    var guessCharsPerPage = chCount
  else
    var guessCharsPerPage = chCount / (pgCount - 1)

  // Columns should be twice as many as rows, so we're looking for a such that a*2a = chars_per_page.
  this.pgRows = Math.floor(Math.sqrt(guessCharsPerPage / 2))
  this.pgCols = this.pgRows * 2

  // Re-initialize the counters.
  this.lineOnPage = 0
  this.columnInLine = 0
  this.pageCount = 1

  this.displayResults()
  
  return true
/*
  // Re-initialize the counters.
  this.lineOnPage = 0
  this.columnInLine = 0
  var oldPageCount = this.pageCount
  this.pageCount = 1

  var newText = ''

  chlonnik.delays.cache = { }
  chlonnik.delays.nextCallback = function() {
    var stepStart = Date.now()
    var cch = this.cache
    var display = chlonnik.textDisplay
    if(!cch.i)
      cch.i = 1
    for(; cch.i < oldPageCount+1; cch.i++) {
      if((Date.now() - stepStart) > chlonnik.delays.timeout) {
        window.setTimeout(function() { chlonnik.delays.nextCallback(chlonnik.delays.cache) }, chlonnik.delays.delay)
        return false
      } // if timeout'ed
      var pg = utl.id('pg-'+cch.i)
      pg.removeChild(utl.id('pn-'+cch.i))
      //var pnt = 1

      var pnt = 0
      while(pnt+1 < pg.innerHTML.length) { // while on OLD page
      //while(pnt < pg.innerHTML.length) { // while on OLD page
        if(display.lineOnPage == 0 && display.columnInLine == 0) // begin NEW page
          newText += display.pageStartCode(display.pageCount)
        var nextPnt = pg.innerHTML.indexOf('<span', pnt+1) // +1 to avoid keeping finding 
                                                           // the same occurence
        //var nextPnt = pg.innerHTML.indexOf('<span', pnt)

        if(!nextPnt)
          utl.log('Bad pointer when reflowing page '+cch.i)
        else if(nextPnt < 0)
          nextPnt = pg.innerHTML.length-1

        var chunk = pg.innerHTML.substr(pnt, nextPnt-pnt)
        //var chunk = pg.innerHTML.substr(pnt-1, nextPnt-pnt+1)
        newText += chunk 
        var dummyDiv = utl.create('div')
        dummyDiv.innerHTML = chunk
        display.columnInLine += dummyDiv.textContent.length

        if(display.checkPaging()) // end NEW page?
          newText += '</div>'
        pnt = nextPnt
        //pnt = nextPnt + 1
      } // while pointer doesn't exceed page boundary
    } // for displayed pages

    utl.id('results-pages').innerHTML = newText
    display.addPageCounts()
    utl.id('paging').innerHTML = display.pagingCode()
    utl.id('pgl-1').className = 'current-pg'
    utl.id('page-count').innerHTML = display.pageCount
    return true
  } // chlonnik.delays.nextCallback
  chlonnik.delays.nextCallback()
  return true*/
} // _reflow(pgCount)

function TextDisplay_showInputMode() {
  chlonnik.mode = 'input'
  utl.id('main-button').innerHTML = 'Sprawdź tekst!'
  utl.id('wd-search').style.display = 'none'
  utl.id('menu').className = '' // remove "stickiness" if present
}

function TextDisplay_showPending() {
  chlonnik.mode = 'pending'
  utl.id('main-button').innerHTML = '...'
}

function TextDisplay_showResultsMode() {
  chlonnik.mode = 'results'
  utl.id('main-button').innerHTML = 'Inny/Kolejna wersja'
  utl.id('wd-search').style.display = 'block'
}
