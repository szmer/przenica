function WordIndex_absorb(text) {
  var index = this
  chlonnik.delays.nextCallback = function(cch) {
      if(index.isIndexed) return true
      var stepStart = Date.now()
      for(; cch.i < text.length; cch.i++) {
        if((Date.now() - stepStart) > chlonnik.delays.timeout) {
          window.setTimeout(function() { chlonnik.delays.nextCallback(chlonnik.delays.cache) }, chlonnik.delays.delay)
          chlonnik.textDisplay.progress(cch.i/text.length * 0.3)
          return false
        } // if timeout'ed
        var chr = text.charAt(cch.i)
        var chrCode = chr.charCodeAt(0)
        // Skip over non-word characters.
        if(   chr != '\'' // other than alphabetic chars
           && chr != '-'
           && (   chrCode < 65
               || (chrCode > 90 && chrCode < 97)
               || (chrCode > 172 && chrCode <= 176)
               || chr == '„' || chr == '”'
              ) // &&
          ) { // (end of if condition)
    
          if(chr == '\n')
            index.lineBreaksCount++
          if(cch.word != cch.strInit) { // word boundary
            index.p_insert(cch.word, cch.startPos, cch.i-1)
            cch.word = cch.strInit
          } // if word isn't empty
          continue
        } // if character is a one of the non-word chars - white, punctuation, numbers etc.
        if(cch.word === cch.strInit)
          cch.startPos = cch.i
        cch.word += chr
      } // for - iterate through text

      // Index remaining text if necessary.
      if(cch.word != cch.strInit) {
        index.p_insert(cch.word, cch.startPos, cch.i)
        cch.word = cch.strInit
      } // if word isn't empty
      index.charCount = text.length
      index.isIndexed = true
      return true
    } // step function (chlonnik.delays.nextCallback)

  chlonnik.delays.cache = {
      strInit: '', // just empty for now, room for optimization maybe?
      word: '',
      startPos: 0,
      i: 0
    }

  chlonnik.delays.nextCallback(chlonnik.delays.cache)
} // WordIndex_absorb function

function WordIndex_clear() {
  this.initialize()
}

function WordIndex_clearPosIndex() {
  this.p_wordPosIndex = { }
}

function WordIndex_getNumbers(word, callback, position) {
  // If callback is given, function will return entries from desired posi-
  // tion ('s'tart, 'e'nd, 'a'ny ).
  // Callback will be fired after each iteration of search.

  word = this.p_normalize(word)

  // Normal procedure, return the answer from index.
  if(!callback) {
    if(this.p_wordIDIndex[word])
      return this.p_wordIDIndex[word].slice(0) 
    else return false
  }

  // Otherwise, treat the string as a fragment of a word.
  this.p_soughtFragm = word
  if(!position) // use 'any' position in index entry
                // as default value
    position = 'a'

  if(position != 's' && position != 'a' && position != 'e')
    return console.log('GetNumbers: Bad search direction argument')

  chlonnik.delays.nextCallback = function(cache) {
    var stepStart = Date.now()
    var idx = chlonnik.mainIndex
    if(word != idx.p_soughtFragm) // abort if we've already started another
                                  // search
      return

    var ids = [ ] // here all matching entries will be merged
    for(; chlonnik.delays.cache.i < idx.p_wordIDKeys.length;
                                           chlonnik.delays.cache.i++) {
      var entry = idx.p_wordIDKeys[chlonnik.delays.cache.i]
      var fail = false // set to true when entry doesn't match the word

      if(position == 's')
        for(var j = 0; j < word.length; j++)
          if(entry.charAt(j) != word.charAt(j)) { fail = true; break }

      if(position == 'e') {
        for(var j = 0; j < word.length; j++)
          if(entry.charAt(entry.length-1-j) != word.charAt(word.length-1-j))
            { fail = true; break }
      } // if position == 'e'

      if(position == 'a')
        if(entry.indexOf(word) == -1)
          fail = true

      if(!fail)
        ids = ids.concat( idx.p_wordIDIndex[entry] )
      if((Date.now() - stepStart) > 0.8 * chlonnik.delays.timeout) {
        chlonnik.delays.cache.i++
        window.setTimeout(function() {
                   chlonnik.delays.nextCallback(chlonnik.delays.cache)
                                     }, chlonnik.delays.delay)
        callback(ids) // send data to callback given by the caller
        return false
      } // if timeouted
    } // for entries in index
    callback(ids)
    return true
  } // chlonnik.delays.nextCallback
  chlonnik.delays.cache.i = 0
  chlonnik.delays.nextCallback(chlonnik.delays.cache)
} // WordIndex_getPositions function

function WordIndex_getPositions(word) {
  return (this.p_wordPosIndex[ this.p_normalize(word) ] || false)
} // WordIndex_getPositions function

function WordIndex_insert(word, startPos, endPos) {
  this.p_wordCount++
  word = this.p_normalize(word)
  this.p_posIndex[startPos] = endPos

  if(this.p_wordPosIndex.hasOwnProperty(word))
    this.p_wordPosIndex[word].push(startPos)
  else {
    this.p_wordPosIndex[word] = [ startPos ]
    this.p_wordDiversity++
  } // else
} // WordIndex_insert function

function WordIndex_insertID(word, occurence, id) {
  if(!this.p_wordIDIndex.hasOwnProperty(this.p_normalize(word)))
    this.p_wordIDIndex[this.p_normalize(word)] = []
  this.p_wordIDIndex[this.p_normalize(word)][occurence] = id
} // WordIndex_insertID function

function WordIndex_isRepeatedNearly(word, pos, dist) {
  if(this.isDisplayed) {
    if(this.repeatedNearly.indexOf(pos) > 0)
      return true
    return false
  }

  var positions = this.getPositions(this.p_normalize(word))
  if(!positions) {
    utl.log('Can\'t find word in index: ' + word)
    return false
  }
  var ind = positions.indexOf(pos)
  if(!positions || positions.length == 1
    || (  (ind === 0 || (pos - this.getEndPos(positions[ind-1])) > dist) // look back and forward
       && ((ind+1) == positions.length || (positions[ind+1] - pos) > dist)
       ) )
     return false
  this.repeatedNearly.push(pos)
  return true
} // WordIndex_isRepeatedNearly

function WordIndex_markDisplayed() {
  this.p_clearPosIndex()
  this.isDisplayed = true
  this.p_wordIDKeys = Object.keys(this.p_wordIDIndex)
} // ,markDisplayed()

function WordIndex_normalize(word) {
  if(!word)
    return ''

  var word = word.toLowerCase()

  return word
} // function WordIndex_normalize
