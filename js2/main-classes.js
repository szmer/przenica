function TextDisplay() {
  this.initialize()
} // TextDisplay class function
TextDisplay.prototype.initialize = function() {
  this.p_rawText = ''
  this.redRGBFactor = -1 // used when calculating the shade of red.
  this.wordN = 0

  this.pageCount = 1 
  this.lineOnPage = 0
  this.columnInLine = 0

  this.currentPage = 1
}
// public methods
TextDisplay.prototype.checkPaging = TextDisplay_checkPaging
TextDisplay.prototype.newInput = TextDisplay_newInput
TextDisplay.prototype.processInput = TextDisplay_processInput
TextDisplay.prototype.progress = TextDisplay_progress
TextDisplay.prototype.setPage = TextDisplay_setPage
TextDisplay.prototype.showInputMode = TextDisplay_showInputMode
TextDisplay.prototype.showPending = TextDisplay_showPending
TextDisplay.prototype.showResultsMode = TextDisplay_showResultsMode
// private methods
TextDisplay.prototype.displayResults = TextDisplay_displayResults
TextDisplay.prototype.formatTextChunk = TextDisplay_formatTextChunk

function WordIndex() {
this.isDisplayed = false
this.isIndexed = false

// Indices are filled from .p_insert method.
this.p_posIndex = { } // posiition of the first char => position of the last (in the original string)
this.p_wordIDIndex = { } // word => array of occurencies (ids) 
this.p_wordPosIndex = { } // as above, occurencies => positions in original string
this.p_wordIDKeys = [ ] // wordIDIndex.keys(), for delaying iteration

this.p_wordCount = 0
this.p_wordDiversity = 0

this.p_soughtFragm = ''
} // WordIndex class function
// public methods
WordIndex.prototype.absorb = WordIndex_absorb
WordIndex.prototype.clear = WordIndex_clear
 // ! .getNumbers() should be used if this.isDisplayed, .getPositions() otherwise.
WordIndex.prototype.getEndPos = function(n) { return (this.p_posIndex[n] || false) }
WordIndex.prototype.getNumbers = WordIndex_getNumbers // gives word-ids instead of positions in the original string
WordIndex.prototype.getPositions = WordIndex_getPositions
WordIndex.prototype.getWordCount = function() { return this.p_wordCount }
WordIndex.prototype.getWordDiversity = function() { return this.p_wordDiversity }
WordIndex.prototype.isRepeatedNearly = WordIndex_isRepeatedNearly
// private methods
WordIndex.prototype.p_clearPosIndex = WordIndex_clearPosIndex // backdoor for TextDisplay
WordIndex.prototype.p_insert = WordIndex_insert
WordIndex.prototype.p_insertID = WordIndex_insertID // backdoor for TextDisplay, replaces position in the original string
WordIndex.prototype.p_markDisplayed = WordIndex_markDisplayed // backdoor for TextDisplay
WordIndex.prototype.p_normalize = WordIndex_normalize
