function WordSearchHelper_search(phrase) {
  chlonnik.h.oneWord.clearHighlight()
  if(phrase.length <= 1) // don't search for one character
    return

  var words = phrase.trim().split(' ')
  var index = chlonnik.mainIndex

  // If the phrase consists of one word, just highlight places where it
  // occurs at least partly.
  if(words.length == 1) {
    index.getNumbers(words[0], function(nums) {
                for(var i = 0; i < nums.length; i++)
                  chlonnik.h.oneWord.highlightPhrase(nums[i], 1)
                chlonnik.h.oneWord.refreshBarPhrase()
                chlonnik.h.oneWord.scrollTo(nums[0], false)
                                              }, 'a' )
    return
  } // if word.length == 1

  // Else, first try words in the middle, supposed to occur in text exactly
  // as they are in the phrase.
  if(words.length > 2) {
    var pool1 = index.getNumbers(words[1])
    for(var n = 0; n < pool1.length; n++)  pool1[n]-- // adjust to the position
                                                     // of the first word
    for(var i = 2; i < words.length - 2; i++) {
      var wpos = index.getNumbers[i]
      for(var n = 0; n < wpos.length; n++)  wpos[n] -= i // adjust as above
      pool1 = utl.intersect(pool1, wpos)
    } // for i from 2 to words.length-1
  } // if words.length > 2

  chlonnik.delays.cache.pool2 = [ ]
  chlonnik.delays.cache.endWord = words[words.length-1]
  chlonnik.delays.cache.wordCount = words.length
  if(pool1) // have we collected data for the words in the middle?
    chlonnik.delays.cache.pool1 = pool1
  else
    chlonnik.delays.cache.pool1 = false

  var startFunc = function(nums) {
    var cache = chlonnik.delays.cache
    cache.pool2 = cache.pool2.concat(nums)
    if(cache.i == index.getWordDiversity()) {
      if(cache.pool1)
        cache.pool1 = utl.intersect(cache.pool1, cache.pool2)
      else
        cache.pool1 = cache.pool2

     if(cache.pool1.length == 0)
        return
     index.getNumbers(cache.endWord, cache.endFunc, 's')
     } // if first search job is done
  } // startFunc function

  chlonnik.delays.cache.endFunc = function(nums) {
    var cache = chlonnik.delays.cache
    var firstOccurence = false
    for(var i = 0; i < nums.length; i++) {
      nums[i] -= cache.wordCount-1 // adjust to the position of the 1st word
      if(cache.pool1.indexOf(nums[i]) != -1) { // check whether the previous
                                             // words are in the pool
        if(!firstOccurence) firstOccurence = nums[i]
        chlonnik.h.oneWord.highlightPhrase(nums[i], cache.wordCount)
      } // if there is match between the pools
    } // for i < nums.length
    if(!firstOccurence)
      return false
    chlonnik.h.oneWord.refreshBarPhrase()
    chlonnik.h.oneWord.scrollTo(firstOccurence, false)
  } // cache.endFunc function

  index.getNumbers(words[0], startFunc, 'e') // look for words containing
                                             // given string at the END
} // _search function
