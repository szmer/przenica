function setupEvaluationToggler() {
  utl.id('evaluation-toggler').onclick = function() {
          if (utl.id('evaluation-window').style.display != 'block')
                utl.id('evaluation-window').style.display = 'block'
  }
}

function updateEvaluation() {
  var funcSpecTxt = utl.id('evaluation-function-spec').value
  var funcFormulationBound = funcSpecTxt.indexOf('#')
  var funcVarsBound = 0
  if (funcFormulationBound == -1) 
    funcFormulationBound = funcVarsBound = funcSpecTxt.length
  else
    funcVarsBound = funcSpecTxt.indexOf('\n', funcFormulationBound) + 1

  var funcFormulation = funcSpecTxt.substr(0, funcFormulationBound)

  var funcVars = {} // will contain a scope for math.js

  // Add the builtin variables.
  funcVars['c'] = chlonnik.mainIndex.charCount
  funcVars['w'] = chlonnik.mainIndex.getWordCount()
  funcVars['u'] = chlonnik.mainIndex.getWordDiversity()
  funcVars['p'] = chlonnik.mainIndex.getParagraphCount()

  // Collect the user-defined variables.
  var funcVarsTxt = funcSpecTxt.substr(funcVarsBound)
  var currentPair = ['', '']
  var parseMode = 'name'
  for (var i = 0; i < funcVarsTxt.length; i++) {
    if (funcVarsTxt.charAt(i) == '/') {
      if (parseMode == 'name') parseMode = 'desc'
      else if (parseMode == 'desc') parseMode = 'val'
      continue
    }
    if (funcVarsTxt.charAt(i) == '\n' && parseMode == 'val') {
      parseMode = 'name'
      currentPair[1] = Number(currentPair[1])
      funcVars[currentPair[0].trim()] = currentPair[1]
      currentPair = ['', '']
      continue
    }
    if (parseMode == 'name')
      currentPair[0] += funcVarsTxt[i]
    else if (parseMode == 'val')
      currentPair[1] += funcVarsTxt[i]
  } 
  if (!isNaN(Number(currentPair[1])))
      funcVars[currentPair[0].trim()] = Number(currentPair[1])

  var result = math.eval(funcFormulation, funcVars)
  utl.id('evaluation-score-score').innerHTML = result.toString().replace(/[\]\[]/g, '')

  updateEvaluationChart(result)
}

function updateEvaluationChart(newScore) {
  chlonnik.h.scoreHistory.push({ x: new Date(), y: newScore.entries[0] }) // kludge on math.js

  var ctx = utl.id('evaluation-score-chart')
  var chart = new Chart(ctx, {
      type: 'line',
      data: {
          datasets: [{
              backgroundColor: "#afdde9",
              borderColor: "#5fbcd3",
              label: lang.dict()['Evaluation_chart_label'],
              data: chlonnik.h.scoreHistory
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
                  xAxes: [{
                          type: 'time',
                          time: {
                                  min: chlonnik.h.scoreHistory[0].x,
                                  max: chlonnik.h.scoreHistory[chlonnik.h.scoreHistory.length-1].x,
                                  displayFormats: { minute: 'H:mm' },
                                  unit: 'minute'
                          } }],
                  yAxes: [{ ticks: { beginAtZero: true} }] 
                  }
      }
  })
}

// Setup the evaluation window.
addLoadEvent( function() {
  utl.id('evaluation-window-close').onclick = function() { utl.id('evaluation-window').style.display = 'none' }
  utl.id('evaluation-recalculate').onclick = updateEvaluation
  utl.id('evaluation-reset').onclick = function() {
                  utl.id('evaluation-function-spec').value = lang.dict()['Evaluation_function_default']
                  updateEvaluation()
          }

  utl.id('evaluation-window-close').textContent = lang.dict()['window_close']
  utl.id('evaluation-header').textContent = lang.dict()['Evaluation_header']
  utl.id('evaluation-score-label').textContent = lang.dict()['Evaluation_score']
  utl.id('evaluation-function-label').textContent = lang.dict()['Evaluation_function']
  utl.id('evaluation-function-spec').textContent = lang.dict()['Evaluation_function_default']
  utl.id('evaluation-function-builtins').textContent = lang.dict()['Evaluation_function_builtins']
  utl.id('evaluation-recalculate').textContent = lang.dict()['Evaluation_recalculate']
  utl.id('evaluation-reset').textContent = lang.dict()['Evaluation_reset']

  // What follows is mostly copypasta from interact.js docs.
  interact('.draggable').draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      var textEl = event.target.querySelector('p')

      textEl && (textEl.textContent =
        'moved a distance of '
        + (Math.sqrt(event.dx * event.dx +
                     event.dy * event.dy)|0) + 'px')
    }
  }).ignoreFrom('textarea')
} ) // +addLoadEvent

function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    if(target.nodeName == 'TEXTAREA') // don't drag on textareas
        return

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)'

    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
  }

window.dragMoveListener = dragMoveListener
