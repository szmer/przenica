// TextDisplay_checkPaging checks whether to start new page. If it started a new page,
// returns true, and false otherwise.
function TextDisplay_checkPaging() {
  if(this.columnInLine > 60) {
    this.lineOnPage++
    this.columnInLine = this.columnInLine - 60
  }

  if((this.lineOnPage == 30 && this.columnInLine > 50)
      || this.lineOnPage > 30) {
    this.pageCount++
    this.lineOnPage = 0
    this.columnInLine = 0
    return true
  }

  return false
} // _checkPaging()

function TextDisplay_newInput() {
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
            for(; cch.i < display.p_rawText.length; cch.i++) {
              if((Date.now() - stepStart) > chlonnik.delays.timeout) {
               window.setTimeout(function() { chlonnik.delays.nextCallback(chlonnik.delays.cache) }, chlonnik.delays.delay)
               display.progress(0.3 + cch.i / display.p_rawText.length * 0.7)
               return false
              } // if timeout'ed
          
              var f = display.formatTextChunk(cch.i)
              cch.resultText += f.html
              // Skip the remaining chars in the word.
              cch.i = f.continue_from
            } // for characters in raw text
          
            display.showResultsMode()
            utl.id('text-results').innerHTML = cch.resultText
            cch.resultText = null
            chlonnik.mainIndex.p_markDisplayed()
            return true
        } // step function (delays.nextCallback)
        display.redRGBFactor = Math.floor(
                                 1 / (Math.pow(display.p_rawText.length, 1.5) / 210 / chlonnik.mainIndex.getWordDiversity())
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
    ret += "<div class='results-page'><div class='page-number'>"+this.pageCount+"</div>"
  else
    // For the preceding (supposedly) whitespace.
    this.columnInLine++

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
        return {'html': ret+'</div>', 'continue_from': startpos}
      } // if this.checkPaging()

      return {'html': ret+this.p_rawText[startpos], 'continue_from': startpos}
    }
  }
          
  var word = this.p_rawText.substr(startpos, (index.getEndPos(startpos)-startpos+1))
  var frequency = index.getPositions(word).length
  var red = frequency * this.redRGBFactor
  if(red > 255)   red = 255
  // var other = 64 // Math.ceil(red / 4)
  var blue = Math.ceil(176 - 136 * (red / 255))
  var html = '<span id=w-' + this.wordN + ' style="color: rgb(' + red + ',' + 96 + ',' + blue + ')">' + word + '</span>'
  if(word.length > 1 && index.isRepeatedNearly(word, startpos, 200))
    html = '<u>' + html + '</u>'
 
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
