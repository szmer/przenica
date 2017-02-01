function TextDisplay_addPageCounts() {
  for(var i = 1; i < this.pageCount+1; i++) {
    var pageNum = utl.id('pn-'+i).innerHTML
    utl.id('pn-'+i).innerHTML = pageNum + ' ' + lang.dict()['of'] + ' ' + this.pageCount
  }
}

// TextDisplay_checkPaging checks whether to start new page. If it started a new page,
// returns true, and false otherwise.
function TextDisplay_checkPaging() {
  if(this.charOnPage > this.pgChars) { 
    this.pageCount++
    this.charOnPage -= this.pgChars
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

            var stats = "<div id='results-stats'><h2>"+lang.dict()['Document_stats']+"</h2><table><tbody>"+
                        "<tr><th>"+lang.dict()['Character_count']+"</th><td>"+chlonnik.mainIndex.charCount+"</td></tr>"+
                        "<tr><th>"+lang.dict()['Word_count']+"</th><td>"+chlonnik.mainIndex.getWordCount()+"</td></tr>"+
                        "<tr><th>("+lang.dict()['without_duplicates']+")</th><td>"+chlonnik.mainIndex.getWordDiversity()+"</td></tr>"+
                        "<tr><th>"+lang.dict()['Page_count']+" <a id='reflow-link' href='javascript:chlonnik.reflowDialog()'>("+lang.dict()['adjust_pages']+")</a></th>"+
                            "<td id='page-count'>"+display.pageCount+"</td></tr>"+
                        "<tr><th>"+lang.dict()['Paragraph_count']+"</th><td>"+chlonnik.mainIndex.getParagraphCount()+"</td></tr>"+
                        "<tr><th>"+lang.dict()['Words_per_paragraph']+"</th><td>"+Math.round(chlonnik.mainIndex.getWordCount()/chlonnik.mainIndex.getParagraphCount())+"</td></tr>"+
                        "</tbody></table></div>"
            var paging = '<div id="paging">'+display.pagingCode()+'</div>'
            var evaluation = '<div id="evaluation">'+display.evaluationCode()+'</div>'

            utl.id('text-results').innerHTML = "<div id='sidemenu'>"+paging+evaluation+"</div>"+stats+'<div id="results-pages">'+cch.resultText+'</div>'
            cch.resultText = null

            display.addPageCounts()
            utl.id('pgl-1').className = 'current-pg'
            display.currentPage = 1

            setupEvaluationToggler()
            updateEvaluation()

            utl.id('paging-toggler').onclick = chlonnik.togglePagingHandler

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
  this.checkPaging()
  if(this.pageDisplayed != this.pageCount) {
    this.pageDisplayed = this.pageCount
    ret += this.pageStartCode(this.pageCount)
  }

  // Handle numbers, punctuation etc.
  if(index.getEndPos(startpos) === false) { // non-word data
    if(this.p_rawText[startpos] == '\n') {
      this.charOnPage += 37
      return {'html': ret+this.p_rawText[startpos]+"<br>", 'continue_from': startpos}
    }
    this.charOnPage++
    return {'html': ret+this.p_rawText[startpos], 'continue_from': startpos}
  } // if non-word: index.getEndPos(startpos)
          
  var word = this.p_rawText.substr(startpos, (index.getEndPos(startpos)-startpos+1))
  if(!index.isDisplayed)
    var frequency = index.getPositions(word).length 
  else
    var frequency = index.getNumbers(word).length
  var red = frequency * this.redRGBFactor
  if(red > 255)   red = 255
  // var other = 64 // Math.ceil(red / 4)
  var blue = Math.ceil(176 - 136 * (red / 255))
  var html = '<span id=w-' + this.wordN + ' style="color: rgb(' + red + ',' + 96 + ',' + blue + ')'
  if(word.length > 1 && index.isRepeatedNearly(word, startpos, 200))
    html += '; border-bottom: thin dashed #111'
  html += '">' + word + '</span>'
 
  if(!index.isDisplayed)
    index.p_insertID(word, index.getPositions(word).indexOf(startpos), this.wordN)
  this.wordN++
  this.charOnPage += word.length
  startpos = index.getEndPos(startpos)

  return {'html': ret+html, 'continue_from': startpos }
} // _formatTextChunk(chunk)

function TextDisplay_pageStartCode(num) {
  if(this.pageCount == 1)
    var ret = "<div class='first-page-start' id='pg-1'>&nbsp;</div>"
  else
    var ret = "<div class='page-break' id='pg-"+num+"'>&nbsp;</div>"
  return ret + "<div class='page-number' id='pn-"+num+"'>"+lang.dict()['page']+" "+num+"</div>"
}

function TextDisplay_pagingCode() {
  var paging = ''

  // print all tens, then 10n+1's, 10n+2's etc.
  var dist = 1
  if(this.pageCount > 50)
          dist = this.pageCount / 50

  for(var i = 0; i < 10 * dist; i = Math.floor(i + dist)) {
    if(i == 0) {
      var j = Math.floor(10*dist)
      paging += "<span id='paging-toggler'>&#x2397; "+lang.dict()['pages']+"&nbsp;</span>" // instead of 0th page link
    }
    else
      var j = 0

    for(; (j+i) < this.pageCount+1; j += Math.floor(10*dist)) 
      paging += "<a id='pgl-"+(i+j)+"' href='#pg-"+(i+j)+"' style='display:none'>"+(i+j)+"</a> "

    // inject a line break into an anchor, so we can display=none it
    var lastOpening = paging.length - paging.lastIndexOf("<")
    paging = paging.substr(0, paging.length-lastOpening) + "<br>" + paging.substr(-lastOpening)
  }
  return paging
}

function TextDisplay_evaluationCode() {
  return "<a id='evaluation-toggler'>"+lang.dict()['evaluate']+"</a>"
}

function TextDisplay_reflow(pgCount) {
  this.pgChars = (chlonnik.mainIndex.charCount + 36*chlonnik.mainIndex.lineBreaksCount) / pgCount

  // Re-initialize the counters.
  this.charOnPage = 0
  this.pageCount = 1
  this.wordN = 0

  this.displayResults()
  
  return true
} // _reflow(pgCount)

function TextDisplay_showInputMode() {
  chlonnik.mode = 'input'
  utl.id('main-button').innerHTML = lang.dict()['Analyze!']
  utl.id('wd-search').style.display = 'none'
  utl.id('menu').className = '' // remove "stickiness" if present
}

function TextDisplay_showPending() {
  chlonnik.mode = 'pending'
  utl.id('main-button').innerHTML = lang.dict()['...']
}

function TextDisplay_showResultsMode() {
  chlonnik.mode = 'results'
  utl.id('main-button').innerHTML = lang.dict()['Load_another']
  utl.id('wd-search').style.display = 'block'
}
