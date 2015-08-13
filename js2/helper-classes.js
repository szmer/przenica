function OneWordHelper() {
this.p_currentWord = ''
this.locs = [ ]
this.selectedID = false
this.p_phraseSelected = -1
this.phraseLength = false
} // OneWordHelper class function
// public methods
OneWordHelper.prototype.clear = OneWordHelper_clear
OneWordHelper.prototype.getCurrentWord = function() { return this.p_currentWord }
OneWordHelper.prototype.highlight = OneWordHelper_highlight
OneWordHelper.prototype.highlightPhrase = OneWordHelper_highlightPhrase
OneWordHelper.prototype.mouseDown = OneWordHelper_mouseDown
OneWordHelper.prototype.phraseAppend = OneWordHelper_phraseAppend
OneWordHelper.prototype.refreshBarPhrase = OneWordHelper_refreshBarPhrase
OneWordHelper.prototype.scrollTo = OneWordHelper_scrollTo
OneWordHelper.prototype.showBar = OneWordHelper_showBar
OneWordHelper.prototype.startPhrase = OneWordHelper_startPhrase

function WordSearchHelper() {
}
WordSearchHelper.prototype.search = WordSearchHelper_search
