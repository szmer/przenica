function TextDisplay() {
  this.initialize()
} // TextDisplay class function
TextDisplay.prototype.initialize = function() {
  this.p_rawText = ''

  this.redRGBFactor = -1 // used when calculating the shade of red.
  this.wordN = 0

  this.pageCount = 1 
  this.charOnPage = 0 // counter used for page breaking
  this.pgChars = 1800 // typewriter page
  this.pageDisplayed = 0 // last page for which starting HTML code was added

  this.currentPage = 1

  this.pagingVisible = false
}
// public methods
TextDisplay.prototype.addPageCounts = TextDisplay_addPageCounts
TextDisplay.prototype.checkPaging = TextDisplay_checkPaging
TextDisplay.prototype.newInput = TextDisplay_newInput
TextDisplay.prototype.pageStartCode = TextDisplay_pageStartCode
TextDisplay.prototype.pagingCode = TextDisplay_pagingCode
TextDisplay.prototype.evaluationCode = TextDisplay_evaluationCode
TextDisplay.prototype.processInput = TextDisplay_processInput
TextDisplay.prototype.progress = TextDisplay_progress
TextDisplay.prototype.reflow = TextDisplay_reflow
TextDisplay.prototype.setPage = TextDisplay_setPage
TextDisplay.prototype.showInputMode = TextDisplay_showInputMode
TextDisplay.prototype.showPending = TextDisplay_showPending
TextDisplay.prototype.showResultsMode = TextDisplay_showResultsMode
// private methods
TextDisplay.prototype.displayResults = TextDisplay_displayResults
TextDisplay.prototype.formatTextChunk = TextDisplay_formatTextChunk

function WordIndex() {
  this.initialize()
}
WordIndex.prototype.initialize = function() {
this.isDisplayed = false
this.isIndexed = false

// Indices are filled from .p_insert method.
this.p_posIndex = { } // posiition of the first char => position of the last (in the original string)
this.p_wordIDIndex = { } // word => array of occurencies (ids) 
this.p_wordPosIndex = { } // as above, occurencies => positions in original string
this.p_wordIDKeys = [ ] // wordIDIndex.keys(), for delaying iteration

this.charCount = 0
this.paragraphCount = 0
this.lineBreaksCount = 0
this.p_wordCount = 0
this.p_wordDiversity = 0

this.p_soughtFragm = ''
this.repeatedNearly = [] // word-ids
} // WordIndex class function
// public methods
WordIndex.prototype.absorb = WordIndex_absorb
WordIndex.prototype.clear = WordIndex_clear
 // ! .getNumbers() should be used if this.isDisplayed, .getPositions() otherwise.
WordIndex.prototype.getEndPos = function(n) {
  if(this.p_posIndex[n] === undefined)
    return false
  return this.p_posIndex[n]
}
WordIndex.prototype.getNumbers = WordIndex_getNumbers // gives word-ids instead of positions in the original string
WordIndex.prototype.getPositions = WordIndex_getPositions
WordIndex.prototype.getWordCount = function() { return this.p_wordCount }
WordIndex.prototype.getWordDiversity = function() { return this.p_wordDiversity }
WordIndex.prototype.getParagraphCount = function() { return this.paragraphCount }
WordIndex.prototype.isRepeatedNearly = WordIndex_isRepeatedNearly
// private methods
WordIndex.prototype.p_clearPosIndex = WordIndex_clearPosIndex // backdoor for TextDisplay
WordIndex.prototype.p_insert = WordIndex_insert
WordIndex.prototype.p_insertID = WordIndex_insertID // backdoor for TextDisplay, replaces position in the original string
WordIndex.prototype.p_markDisplayed = WordIndex_markDisplayed // backdoor for TextDisplay
WordIndex.prototype.p_normalize = WordIndex_normalize
