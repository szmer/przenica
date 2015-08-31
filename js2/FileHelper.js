function FileHelper_blow(errmsg) {
  utl.id('load-file-form').reset()
  utl.id('load-file-error').style.display = 'block'
  utl.id('load-file-error').innerHTML = errmsg
  // Let's do some flickering, so the user will notice.
  window.setTimeout(function() { utl.id('load-file-error').style.visibility = 'hidden' }, 200)
  window.setTimeout(function() { utl.id('load-file-error').style.visibility = 'visible' }, 400)
  window.setTimeout(function() { utl.id('load-file-error').style.visibility = 'hidden' }, 600)
  window.setTimeout(function() { utl.id('load-file-error').style.visibility = 'visible' }, 800)
}

function FileHelper_feedDocx(data) {
  var zip = new JSZip()
  try { zip.load(data) }
  catch(err) { 
    return this.blow('Niestety, twój plik .docx wygląda na nieprawidłowy i Przenica nie może go wczytać. (kod msw1)')
  }

  // Find the main document part.
  var rels = utl.create('div', { innerHTML: zip.files['_rels/.rels'].asText() })
  rels = rels.getElementsByTagName('Relationship')
  if(!rels)
    return this.blow('Niestety, twój plik .docx wygląda na nieprawidłowy i Przenica nie może go wczytać. (kod msw2)')
  var doc = false
  for(var i = 0; i < rels.length; i++)
    if(rels[i].getAttribute('Type') == 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument') {
      doc = rels[i].getAttribute('Target')
      break
    }

  // Load the main document part.
  if(!doc)
    return this.blow('Niestety, twój plik .docx wygląda na nieprawidłowy i Przenica nie może go wczytać. (kod msw3)')
  var docBody = utl.create('div', { 'innerHTML': zip.files[doc].asText() })
  docBody = docBody.getElementsByTagName("w:body")[0]
  if(!docBody)
    return this.blow('Niestety, twój plik .docx wygląda na nieprawidłowy i Przenica nie może go wczytać. (kod msw4)')
  docBody.innerHTML = docBody.innerHTML.split('</w:p>').join('\n</w:p>')
  // Handle foot/endnotes references.
  if(utl.id('load-notes').checked) {
    var refs = docBody.getElementsByTagName('w:footnoteReference')
    for(var i = 0; i < refs.length; i++)
      refs[i].innerHTML = '('+(i+1)+')'
    var refs = docBody.getElementsByTagName('w:endnoteReference')
    for(var i = 0; i < refs.length; i++)
      refs[i].innerHTML = '['+(i+1)+']'
  } // if we're to load foot/endnotes

  // Prepare text content to feed.
  if(chlonnik.mode == 'results') // switch mode to input if needed
    chlonnik.mainButtonHandler()
  var content = docBody.textContent

  // Any footnotes, endnotes?
  if(utl.id('load-notes').checked) {
    for(var i = doc.length-1; doc[i] != '/'; i--);
    var docPath = doc.substr(0,i), docName = doc.substr(i+1)
    rels = zip.files[docPath+'/_rels/'+docName+'.rels']
    if(rels && rels.asText) {
      rels = utl.create('div', { innerHTML: rels.asText() })
      rels = rels.getElementsByTagName('Relationship')
      for(var i = 0; i < rels.length; i++) {
        var relType = rels[i].getAttribute('Type')
        if(relType.substr(relType.length-24) == "/relationships/footnotes"
           || relType.substr(relType.length-23) == '/relationships/endnotes') {
          var target = rels[i].getAttribute('Target')
          if(target.charAt(0) == '/') // absolute path
            var notes = zip.files[target]
          else
            var notes = zip.files[docPath+'/'+target]
          if(!notes) continue
          notes = utl.create('div', { innerHTML: notes.asText() })
          content += '\n'
          if(relType.substr(relType.length-24) == "/relationships/footnotes") {
            notes = notes.getElementsByTagName('w:footnote')
            for(var j = 0, k = 1; j < notes.length; j++) {
              if(notes[j].textContent)
                content += '('+(k++)+') '+notes[j].textContent+'\n'
            } // for footnote entries
          } // if relType is footnotes
          else {
            notes = notes.getElementsByTagName('w:endnote')
            for(var j = 0, k = 1; j < notes.length; j++) {
              if(notes[j].textContent)
                content += '['+(k++)+'] '+notes[j].textContent+'\n'
            } // for endnote entries
          } // else - if relType is not footnotes (=endnotes)
        } // if it has footnotes relationship
      } // for relationship entries
    } // if main document part rels are reachable
  } // if we're to load foot/endnotes

  utl.id('text-input').value = content
  chlonnik.mainButtonHandler() // start processing
  chlonnik.fileButtonHandler() // hide loading dialog
} // _docx(data)
