function OneWordHelper() {
this.p_currentWord = ''
this.p_phraseLocs = [ ]
this.p_phraseSelected = -1
this.p_phraseLength = 0
} // OneWordHelper class function
// public methods
OneWordHelper.prototype.clearHighlight = OneWordHelper_clearHighlight
OneWordHelper.prototype.getCurrentWord = function() { return this.p_currentWord }
OneWordHelper.prototype.highlight = OneWordHelper_highlight
OneWordHelper.prototype.highlightPhrase = OneWordHelper_highlightPhrase
OneWordHelper.prototype.mouseDown = OneWordHelper_mouseDown
OneWordHelper.prototype.refreshBarPhrase = OneWordHelper_refreshBarPhrase
OneWordHelper.prototype.scrollTo = OneWordHelper_scrollTo
// private methods
OneWordHelper.prototype.p_showBar = OneWordHelper_showBar

function WordSearchHelper() {
}
WordSearchHelper.prototype.search = WordSearchHelper_search
