function OneWordHelper_clear() {
  if(this.phraseLength)
    for(var i = 0; i < this.locs.length; i++)
      for(var j = 0; j < this.phraseLength; j++)
        utl.id( 'w-'+(this.locs[i] + j) ).className = null
  else
    for(var i = 0; i < this.locs.length; i++)
      utl.id('w-'+this.locs[i]).className = null
  this.p_currentWord = ''
  this.locs = [ ]
  this.selectedID = false
  this.phraseLength = false

  utl.id('bottom-bar').style.display = 'none'
  utl.id('bt-diagram').style.display = 'none'
} // _clear function

// OneWordHelper_higlight highlights all the occurencies of the word (with given ID
// as the main one) and shows bottom bar. 
function OneWordHelper_highlight(word, mainID) {
  this.p_currentWord = word

  this.locs = chlonnik.mainIndex.getNumbers(this.p_currentWord)
  for(var i = 0; i < this.locs.length; i++) {
    utl.id( 'w-'+this.locs[i] ).className = 'highlight'
  } // for i in this.locs

  this.showBar(mainID)
} // _highlight function

// OneWordHelper_higlight highlights all the occurencies of the phrase (with given
// starting-ID as the main one) and shows bottom bar. 
function OneWordHelper_highlightPhrase(mainID) {
  for(var i = 0; i < this.locs.length; i++)
    for(var j = 0; j < this.phraseLength; j++)
      utl.id( 'w-'+(this.locs[i]+j) ).className = 'hl-phrase'
  this.showBar(this.locs, mainID)
} // _highlightPhrase function

function OneWordHelper_phraseAppend(wordID) {
  this.locs.push(parseInt(wordID))
} // _phraseAppend function

function OneWordHelper_startPhrase(mainID, len) {
  this.phraseLength = parseInt(len)
  this.selectedID = parseInt(mainID)
} // _startPhrase

function OneWordHelper_mouseDown(event) {
  if(!chlonnik.mainIndex.isDisplayed)
    return false

  this.clear()

  var target = event.target || event.srcElement
  if(target.id.substr(0,2) != 'w-') // no particular word was clicked
    return false

  var selectedID = target.id.substr(2)
  var word = target.textContent
  this.highlight(word, selectedID)
  this.scrollTo(selectedID, true) // tell that click is directed from the screen, not the bottom bar

  return true
} // _mouseDown function

// OneWordHelper_refreshBarPhrase is used by WordSearch to indicate progress when searching.
function OneWordHelper_refreshBarPhrase() {
  if(this.locs.length > 0)
    this.showBar(this.locs, this.selectedID)
} // _refreshBarPhrase function

// OneWordHelper_scrollTo scrolls to the given ID (assuming it's an occurence of word/phrase which is
// now selected), main-highlights it and clears possible previous main-highlights.
function OneWordHelper_scrollTo(wordID, fromText) {
  wordID = parseInt(wordID)

  // Set the proper "main" highlights.
  if(!this.phraseLength) { // we have just one word
    if(this.selectedID) // set regular highlight
      utl.id("w-"+this.selectedID).className = "highlight"
    utl.id("w-"+wordID).className = "highlight hl-main"
  }
  else { // for multi-word phrases
    if(this.selectedID)
      for(var i = 0; i < this.phraseLength; i++)
        utl.id("w-"+(this.selectedID+i)).className = "hl-phrase"
    for(var i = 0; i < this.phraseLength; i++)
      utl.id("w-"+(wordID+i)).className = "hl-phrase hl-main"
  }
  this.selectedID = wordID

  if(!fromText) {
    var height = window.innerHeight || screen.availHeight
    var wordLoc = utl.id('w-'+wordID).offsetTop
    window.scroll(0, wordLoc - 0.35 * height)

    this.showBar(wordID)
  }
} // _scrollTo function

function OneWordHelper_showBar(mainID) {
  var ids = this.locs

  mainID = parseInt(mainID) // selected ID 
  utl.id('bottom-bar').style.display = 'block'

  // Basic information of number of occurencies.
  if(!ids.length) 
    utl.id('bt-info').innerHTML = 'Brak wystąpień.'
  else {
    var here = 1+ids.indexOf(mainID)
    if (here && here > 0)
      utl.id('bt-info').innerHTML = 'Wystąpienie <b>' + here  +'</b> z ' + ids.length + ':'
    else
      utl.id('bt-info').innerHTML = 'Wystąpień: <b>' + ids.length  +'</b>'
  }

  // The diagram with links.
  utl.id('bt-diagram').style.display = 'inline'
  var diagram = utl.id('bt-diagram')
  var dotVal = 0.025 * chlonnik.mainIndex.getWordCount()
  var html = ''
  for(var i = 0; i < ids[0] / dotVal; i++)
    html += '. '
  for(var i = 0; i < ids.length; i++) {
    var link = '<a href="javascript:chlonnik.barGoTo(' + ids[i] + ')">'
    link += utl.id('w-'+ids[i]).textContent.substr(0,1) + '</a>'
    if(ids[i] == mainID)
      link = '<em>' + link + '</em>'

    html += link

    if(i != ids.length-1) 
      for(var j = 0; j < Math.floor((ids[i+1] - ids[i])/dotVal); j++) 
        html += '. '
    else 
      for(var k = 0; k < Math.floor((chlonnik.mainIndex.getWordCount() - ids[i])/dotVal); k++) 
        html += '. '
  } // for i in ids
  this.locs = ids
  diagram.innerHTML = html
} // _showBar function
