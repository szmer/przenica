function OneWordHelper_clearHighlight() {
  var ids = chlonnik.mainIndex.getNumbers(this.p_currentWord)
  for(var i = 0; i < ids.length; i++)
    utl.id( 'w-'+ids[i] ).className = null
  this.p_currentWord = ''

  for(var i = 0; i < this.p_phraseLocs.length; i++)
    for(var j = 0; j < this.p_phraseLength; j++)
      utl.id( 'w-'+(this.p_phraseLocs[i] + j) ).className = null
  this.p_phraseLocs = [ ]
  this.p_phraseLength = -1
  this.p_phraseSelected = -1

  utl.id('bottom-bar').style.display = 'none'
  utl.id('bt-diagram').style.display = 'none'
} // _clearHighlight function

function OneWordHelper_highlight(word, mainID) {
  this.p_currentWord = word

  var ids = chlonnik.mainIndex.getNumbers(this.p_currentWord)
  for(var i = 0; i < ids.length; i++) {
    if(ids[i] == mainID)
      utl.id( 'w-'+ids[i] ).className = 'highlight hl-main'
    else 
      utl.id( 'w-'+ids[i] ).className = 'highlight'
  } // for i in ids

  this.p_showBar(chlonnik.mainIndex.getNumbers(word), mainID)
} // _highlight function

function OneWordHelper_highlightPhrase(startWID, len) {
  startWID = parseInt(startWID)
  len = parseInt(len)
  this.p_phraseLength = len
  this.p_phraseLocs.push(startWID) // track highlights so we'll be able to clear them 

  if(this.p_phraseSelected == -1)
    this.p_phraseSelected = startWID

  if(len == 1) {
    utl.id( 'w-'+startWID ).className = 'hl-phrase'
    return
  }

  if(this.p_phraseSelected == startWID)
    for(var i = 0; i < len; i++)
      utl.id( 'w-'+(startWID+i) ).className = 'hl-phrase hl-main'
  else for(var i = 0; i < len; i++)
    utl.id( 'w-'+(startWID+i) ).className = 'hl-phrase'

  return
} // _highlightPhrase function

function OneWordHelper_mouseDown(event) {
  if(!chlonnik.mainIndex.isDisplayed)
    return false

  this.clearHighlight()

  var target = event.target || event.srcElement
  if(target.id.substr(0,2) != 'w-') // no particular word was clicked
    return false

  var selectedID = target.id.substr(2)
  var word = target.textContent
  this.highlight(word, selectedID)
  this.scrollTo(selectedID, true) // tell that click is directed from the screen, not the bottom bar

  return true
} // _mouseDown function

function OneWordHelper_refreshBarPhrase() {
  if(this.p_phraseLocs.length > 0)
    this.p_showBar(this.p_phraseLocs, this.p_phraseSelected)
} // _refreshBarPhrase function

function OneWordHelper_scrollTo(wordID, fromText) {
  wordID = parseInt(wordID)
  if(fromText) { // check where the click came from (here from results area)
    var word = this.p_currentWord
    this.clearHighlight()
    this.highlight(word, wordID)
  } // if fromText

  else { // click is from the bottom bar or search
    if(this.p_phraseLocs.length > 0) {
      if(this.p_phraseSelected != -1)
        for(var i = 0; i < this.p_phraseLength; i++)
          utl.id('w-' + (this.p_phraseSelected + i)).className = 'hl-phrase'
      this.p_phraseSelected = wordID
      for(var i = 0; i < this.p_phraseLength; i++)
        utl.id('w-' + (wordID + i)).className = 'hl-phrase hl-main'
      this.refreshBarPhrase()
    } // if multiword phrase is concerned
    else { // if one word is clicked from the bar
      var word = this.p_currentWord
      this.clearHighlight()
      this.highlight(word, wordID)
    }
  } // if not fromText
 
  var height = window.innerHeight || screen.availHeight
  var wordLoc = utl.id('w-'+wordID).offsetTop
  if(!fromText)
    window.scroll(0, wordLoc - 0.35 * height)
} // _scrollTo function

function OneWordHelper_showBar(ids, slID) {
  slID = parseInt(slID)
  utl.id('bottom-bar').style.display = 'block'
  if(slID > 0)
    utl.id('bt-info').innerHTML = 'Wystąpienie <b>' + (1+ids.indexOf(slID))  +'</b> z ' + ids.length + ':'
  else
    utl.id('bt-info').innerHTML = 'Wystąpień: <b>' + ids.length  +'</b>'

  utl.id('bt-diagram').style.display = 'inline'
  var diagram = utl.id('bt-diagram')
  var dotVal = 0.025 * chlonnik.mainIndex.getWordCount()
  var html = ''
  for(var i = 0; i < ids[0] / dotVal; i++)
    html += '. '
  for(var i = 0; i < ids.length; i++) {
    var link = '<a href="javascript:chlonnik.h.oneWord.scrollTo(' + ids[i] + ')">' + utl.id('w-'+ids[i]).textContent.substr(0,1) + '</a>'
    if(ids[i] == slID) link = '<em>' + link + '</em>'
    html += link

    if(i != ids.length-1) 
      for(var j = 0; j < Math.floor((ids[i+1] - ids[i])/dotVal); j++) 
        html += '. '
    else 
      for(var k = 0; k < Math.floor((chlonnik.mainIndex.getWordCount() - ids[i])/dotVal); k++) 
        html += '. '
  } // for i in ids
  diagram.innerHTML = html
} // _showBar function
