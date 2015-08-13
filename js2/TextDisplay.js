function TextDisplay_newInput() {
  this.p_rawText = ''
  chlonnik.mainIndex.clear() // drop longer unncessary data from memory
  chlonnik.h.oneWord.clear()

  utl.id('text-input').value = ''
  utl.id('text-results').innerHTML = ''
  utl.id('text-input').style.display = 'block'
  utl.id('text-results').style.display = 'none'
}

function TextDisplay_processInput() {
  this.p_rawText = utl.id('text-input').value
  chlonnik.mainIndex.absorb( this.p_rawText )

  this.p_displayResults()
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
          
              if(!cch.index.getEndPos(cch.i)) { // falsey value = non-word data
                if(display.p_rawText[cch.i] == '\n')
                  cch.resultText += '<br>'
                else
                  cch.resultText += display.p_rawText[cch.i]
                continue
              }
          
              var word = display.p_rawText.substr(cch.i, (cch.index.getEndPos(cch.i)-cch.i+1))
              var frequency = cch.index.getPositions(word).length
              var red = frequency * cch.redRGBFactor
              if(red > 255)   red = 255
              // var other = 64 // Math.ceil(red / 4)
              var blue = Math.ceil(176 - 136 * (red / 255))
              var html = '<span id=w-' + cch.wordN + ' style="color: rgb(' + red + ',' + 96 + ',' + blue + ')">' + word + '</span>'
              if(word.length > 1 && cch.index.isRepeatedNearly(word, cch.i, 200))
                html = '<u>' + html + '</u>'
              cch.resultText = cch.resultText + html
          
              cch.index.p_insertID(word, cch.index.getPositions(word).indexOf(cch.i), cch.wordN)
              cch.wordN++
              // Skip the remaining chars in the word.
              cch.i = cch.index.getEndPos(cch.i)
            } // for characters in raw text
          
            display.showResultsMode()
            utl.id('text-results').innerHTML = cch.resultText
            cch.resultText = null
            chlonnik.mainIndex.p_markDisplayed()
            return true
        } // step function (delays.nextCallback)
        chlonnik.delays.cache = {
          index : chlonnik.mainIndex,
            /// Some vars needed before looping through text.
          resultText: '',
             // Used to calculate the shade of red.
          redRGBFactor: Math.floor(1
                                   / (Math.pow(display.p_rawText.length, 1.5) / 210 / chlonnik.mainIndex.getWordDiversity())
                                   * 255),
          wordN: 0, // word number (consecutive)
          i: 0
        } // chlonnik.delays.cache object
        chlonnik.delays.nextCallback(chlonnik.delays.cache)
      } // else (mainIndex's done its job)
    } // wait function
  wait()
} // TextDisplay_displayResults function         

function TextDisplay_showInputMode() {
  chlonnik.mode = 'input'
  utl.id('main-button').innerHTML = 'Sprawdź tekst!'
  utl.id('wd-search').style.display = 'none'
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
