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

  if(!doc)
    return this.blow('Niestety, twój plik .docx wygląda na nieprawidłowy i Przenica nie może go wczytać. (kod msw3)')
  doc = utl.create('div', { 'innerHTML': zip.files[doc].asText() })
  var docBody = doc.getElementsByTagName("w:body")[0]
  if(!docBody)
    return this.blow('Niestety, twój plik .docx wygląda na nieprawidłowy i Przenica nie może go wczytać. (kod msw4)')
  docBody.innerHTML = docBody.innerHTML.split('</w:p>').join('\n</w:p>')

  if(chlonnik.mode == 'results') // switch mode to input if needed
    chlonnik.mainButtonHandler()
  var content = docBody.textContent
  utl.id('text-input').value = content
  chlonnik.mainButtonHandler() // start processing
  chlonnik.fileButtonHandler() // hide loading dialog
} // _docx(data)
