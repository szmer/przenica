function FileHelper_blow(e){this.clearFileInput(),utl.id("load-file-error").style.display="block",utl.id("load-file-error").innerHTML=e,window.setTimeout(function(){utl.id("load-file-error").style.visibility="hidden"},200),window.setTimeout(function(){utl.id("load-file-error").style.visibility="visible"},400),window.setTimeout(function(){utl.id("load-file-error").style.visibility="hidden"},600),window.setTimeout(function(){utl.id("load-file-error").style.visibility="visible"},800)}function FileHelper_clearFileInput(){var e=utl.id("load-file");e.value="",e.value&&(e.type="text",e.type="file")}function FileHelper_feedDocx(e){var t=new JSZip;try{t.load(e)}catch(n){return this.blow("Niestety, twój plik .docx wygląda na nieprawidłowy i Przenica nie może go wczytać. (kod msw1)")}var i=utl.create("div",{innerHTML:t.files["_rels/.rels"].asText()});if(i=i.getElementsByTagName("Relationship"),!i)return this.blow("Niestety, twój plik .docx wygląda na nieprawidłowy i Przenica nie może go wczytać. (kod msw2)");for(var o=!1,r=0;r<i.length;r++)if("http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"==i[r].getAttribute("Type")){o=i[r].getAttribute("Target");break}if(!o)return this.blow("Niestety, twój plik .docx wygląda na nieprawidłowy i Przenica nie może go wczytać. (kod msw3)");var l=utl.create("div",{innerHTML:t.files[o].asText()});if(l=l.getElementsByTagName("w:body")[0],!l)return this.blow("Niestety, twój plik .docx wygląda na nieprawidłowy i Przenica nie może go wczytać. (kod msw4)");if(l.innerHTML=l.innerHTML.split("</w:p>").join("\n</w:p>"),utl.id("load-notes").checked){for(var s=l.getElementsByTagName("w:footnoteReference"),r=0;r<s.length;r++)s[r].innerHTML="("+(r+1)+")";for(var s=l.getElementsByTagName("w:endnoteReference"),r=0;r<s.length;r++)s[r].innerHTML="["+(r+1)+"]"}"results"==chlonnik.mode&&chlonnik.mainButtonHandler();var a=l.textContent;if(utl.id("load-notes").checked){for(var r=o.length-1;"/"!=o[r];r--);var d=o.substr(0,r),h=o.substr(r+1);if(i=t.files[d+"/_rels/"+h+".rels"],i&&i.asText){i=utl.create("div",{innerHTML:i.asText()}),i=i.getElementsByTagName("Relationship");for(var r=0;r<i.length;r++){var c=i[r].getAttribute("Type");if("/relationships/footnotes"==c.substr(c.length-24)||"/relationships/endnotes"==c.substr(c.length-23)){var p=i[r].getAttribute("Target");if("/"==p.charAt(0))var u=t.files[p];else var u=t.files[d+"/"+p];if(!u)continue;if(u=utl.create("div",{innerHTML:u.asText()}),a+="\n","/relationships/footnotes"==c.substr(c.length-24)){u=u.getElementsByTagName("w:footnote");for(var y=0,f=1;y<u.length;y++)u[y].textContent&&(a+="("+f++ +") "+u[y].textContent+"\n")}else{u=u.getElementsByTagName("w:endnote");for(var y=0,f=1;y<u.length;y++)u[y].textContent&&(a+="["+f++ +"] "+u[y].textContent+"\n")}}}}}utl.id("text-input").value=a,chlonnik.mainButtonHandler(),chlonnik.fileButtonHandler()}function FileHelper(){}function OneWordHelper(){this.p_currentWord="",this.locs=[],this.selectedID=!1,this.p_phraseSelected=-1,this.phraseLength=!1}function WordSearchHelper(){}function TextDisplay(){this.initialize()}function WordIndex(){this.initialize()}function OneWordHelper_clear(){if(this.phraseLength)for(var e=0;e<this.locs.length;e++)for(var t=0;t<this.phraseLength;t++)utl.id("w-"+(this.locs[e]+t)).className=null;else for(var e=0;e<this.locs.length;e++)utl.id("w-"+this.locs[e]).className=null;this.p_currentWord="",this.locs=[],this.selectedID=!1,this.phraseLength=!1,utl.id("bottom-bar").style.display="none",utl.id("bt-diagram").style.display="none"}function OneWordHelper_highlight(e,t){this.p_currentWord=e,this.locs=chlonnik.mainIndex.getNumbers(this.p_currentWord);for(var n=0;n<this.locs.length;n++)utl.id("w-"+this.locs[n]).className="highlight";this.showBar(t)}function OneWordHelper_highlightPhrase(e){for(var t=0;t<this.locs.length;t++)for(var n=0;n<this.phraseLength;n++)utl.id("w-"+(this.locs[t]+n)).className="hl-phrase";this.showBar(this.locs,e)}function OneWordHelper_phraseAppend(e){this.locs.push(parseInt(e))}function OneWordHelper_startPhrase(e,t){this.phraseLength=parseInt(t),this.selectedID=parseInt(e)}function OneWordHelper_mouseDown(e){if(!chlonnik.mainIndex.isDisplayed)return!1;this.clear();var t=e.target||e.srcElement;if("w-"!=t.id.substr(0,2))return!1;var n=t.id.substr(2),i=t.textContent;return this.highlight(i,n),this.scrollTo(n,!0),!0}function OneWordHelper_refreshBarPhrase(){this.locs.length>0&&this.showBar(this.locs,this.selectedID)}function OneWordHelper_scrollTo(e,t){if(e=parseInt(e),this.phraseLength){if(this.selectedID)for(var n=0;n<this.phraseLength;n++)utl.id("w-"+(this.selectedID+n)).className="hl-phrase";for(var n=0;n<this.phraseLength;n++)utl.id("w-"+(e+n)).className="hl-phrase hl-main"}else this.selectedID&&(utl.id("w-"+this.selectedID).className="highlight"),utl.id("w-"+e).className="highlight hl-main";if(this.selectedID=e,!t){var i=window.innerHeight||screen.availHeight,o=utl.id("w-"+e).offsetTop;window.scroll(0,o-.35*i),this.showBar(e)}}function OneWordHelper_showBar(e){var t=this.locs;if(e=parseInt(e),utl.id("bottom-bar").style.display="block",t.length){var n=1+t.indexOf(e);n&&n>0?utl.id("bt-info").innerHTML="Wystąpienie <b>"+n+"</b> z "+t.length+":":utl.id("bt-info").innerHTML="Wystąpień: <b>"+t.length+"</b>"}else utl.id("bt-info").innerHTML="Brak wystąpień.";utl.id("bt-diagram").style.display="inline";for(var i=utl.id("bt-diagram"),o=.025*chlonnik.mainIndex.getWordCount(),r="",l=0;l<t[0]/o;l++)r+=". ";for(var l=0;l<t.length;l++){var s='<a href="javascript:chlonnik.barGoTo('+t[l]+')">';if(s+=utl.id("w-"+t[l]).textContent.substr(0,1)+"</a>",t[l]==e&&(s="<em>"+s+"</em>"),r+=s,l!=t.length-1)for(var a=0;a<Math.floor((t[l+1]-t[l])/o);a++)r+=". ";else for(var d=0;d<Math.floor((chlonnik.mainIndex.getWordCount()-t[l])/o);d++)r+=". "}this.locs=t,i.innerHTML=r}function addLoadEvent(e){var t=window.onload;"function"!=typeof window.onload?window.onload=e:window.onload=function(){t&&t(),e()}}function TextDisplay_addPageCounts(){for(var e=1;e<this.pageCount+1;e++){var t=utl.id("pn-"+e).innerHTML;utl.id("pn-"+e).innerHTML=t+" z "+this.pageCount}}function TextDisplay_checkPaging(){return this.charOnPage>this.pgChars?(this.pageCount++,this.charOnPage-=this.pgChars,!0):!1}function TextDisplay_newInput(){chlonnik.h.oneWord.clear(),this.initialize(),chlonnik.mainIndex.clear(),utl.id("text-input").value="",utl.id("text-results").innerHTML="",utl.id("text-input").style.display="block",utl.id("text-results").style.display="none"}function TextDisplay_processInput(){this.p_rawText=utl.id("text-input").value,chlonnik.mainIndex.absorb(this.p_rawText),this.displayResults()}function TextDisplay_progress(e){utl.id("main-button").innerHTML=Math.floor(100*e)+"%"}function TextDisplay_setPage(e){utl.id("pgl-"+this.currentPage)&&(utl.id("pgl-"+this.currentPage).className=""),utl.id("pgl-"+e).className="current-pg",this.currentPage=e}function TextDisplay_displayResults(){var e=this,t=function(){chlonnik.mainIndex.isIndexed?(utl.id("text-input").style.display="none",utl.id("text-results").style.display="block",chlonnik.delays.nextCallback=function(t){for(var n=Date.now();t.i<chlonnik.mainIndex.charCount;t.i++){if(Date.now()-n>chlonnik.delays.timeout)return window.setTimeout(function(){chlonnik.delays.nextCallback(chlonnik.delays.cache)},chlonnik.delays.delay),e.progress(.3+t.i/chlonnik.mainIndex.charCount*.7),!1;var i=e.formatTextChunk(t.i);t.resultText+=i.html,t.i=i.continue_from}e.showResultsMode();var o="<div id='results-stats'><h2>Statystyka dokumentu</h2><table><tbody><tr><th>Liczba znaków</th><td>"+chlonnik.mainIndex.charCount+"</td></tr><tr><th>Liczba słów</th><td>"+chlonnik.mainIndex.getWordCount()+"</td></tr><tr><th>(nie licząc powtórzeń)</th><td>"+chlonnik.mainIndex.getWordDiversity()+"</td></tr><tr><th>Liczba stron <a id='reflow-link' href='javascript:chlonnik.reflowDialog()'>(zmień)</a></th><td id='page-count'>"+e.pageCount+"</td></tr></tbody></table></div>",r='<div id="paging">'+e.pagingCode()+"</div>";return utl.id("text-results").innerHTML=r+o+'<div id="results-pages">'+t.resultText+"</div>",t.resultText=null,e.addPageCounts(),utl.id("pgl-1").className="current-pg",e.currentPage=1,chlonnik.mainIndex.p_markDisplayed(),!0},e.redRGBFactor=Math.floor(1/(Math.pow(chlonnik.mainIndex.charCount,1.5)/210/chlonnik.mainIndex.getWordDiversity())*255),chlonnik.delays.cache={index:chlonnik.mainIndex,resultText:"",i:0},chlonnik.delays.nextCallback(chlonnik.delays.cache)):window.setTimeout(t,chlonnik.delays.delay)};t()}function TextDisplay_formatTextChunk(e){var t=chlonnik.mainIndex;if(ret="",this.checkPaging(),this.pageDisplayed!=this.pageCount&&(this.pageDisplayed=this.pageCount,ret+=this.pageStartCode(this.pageCount)),!t.getEndPos(e))return"\n"==this.p_rawText[e]?(this.charOnPage+=37,{html:ret+this.p_rawText[e]+"<br>",continue_from:e}):(this.charOnPage++,{html:ret+this.p_rawText[e],continue_from:e});var n=this.p_rawText.substr(e,t.getEndPos(e)-e+1);if(t.isDisplayed)var i=t.getNumbers(n).length;else var i=t.getPositions(n).length;var o=i*this.redRGBFactor;o>255&&(o=255);var r=Math.ceil(176-136*(o/255)),l="<span id=w-"+this.wordN+' style="color: rgb('+o+",96,"+r+')">';return l+=n.length>1&&t.isRepeatedNearly(n,e,200)?"<u>"+n+"</u></span>":n+"</span>",t.isDisplayed||t.p_insertID(n,t.getPositions(n).indexOf(e),this.wordN),this.wordN++,this.charOnPage+=n.length,e=t.getEndPos(e),{html:ret+l,continue_from:e}}function TextDisplay_pageStartCode(e){if(1==this.pageCount)var t="<div class='first-page-start' id='pg-1'>&nbsp;</div>";else var t="<div class='page-break' id='pg-"+e+"'>&nbsp;</div>";return t+"<div class='page-number' id='pn-"+e+"'>strona "+e+"</div>"}function TextDisplay_pagingCode(){for(var e="",t=0;10>t;t++){if(0==t){var n=10;e+="&nbsp;&nbsp;&nbsp;"}else var n=0;for(;n+t<this.pageCount+1;n+=10)e+="<a id='pgl-"+(t+n)+"' href='#pg-"+(t+n)+"'>"+(t+n)+"</a> ";e+="<br>"}return e}function TextDisplay_reflow(e){return this.pgChars=(chlonnik.mainIndex.charCount+36*chlonnik.mainIndex.lineBreaksCount)/e,this.charOnPage=0,this.pageCount=1,this.wordN=0,this.displayResults(),!0}function TextDisplay_showInputMode(){chlonnik.mode="input",utl.id("main-button").innerHTML="Sprawdź tekst!",utl.id("wd-search").style.display="none",utl.id("menu").className=""}function TextDisplay_showPending(){chlonnik.mode="pending",utl.id("main-button").innerHTML="..."}function TextDisplay_showResultsMode(){chlonnik.mode="results",utl.id("main-button").innerHTML="Inny/Kolejna wersja",utl.id("wd-search").style.display="block"}function WordIndex_absorb(e){var t=this;chlonnik.delays.nextCallback=function(n){if(t.isIndexed)return!0;for(var i=Date.now();n.i<e.length;n.i++){if(Date.now()-i>chlonnik.delays.timeout)return window.setTimeout(function(){chlonnik.delays.nextCallback(chlonnik.delays.cache)},chlonnik.delays.delay),chlonnik.textDisplay.progress(n.i/e.length*.3),!1;var o=e.charAt(n.i),r=o.charCodeAt(0);"'"!=o&&"-"!=o&&(65>r||r>90&&97>r||r>172&&176>=r||"„"==o||"”"==o)?("\n"==o&&t.lineBreaksCount++,n.word!=n.strInit&&(t.p_insert(n.word,n.startPos,n.i-1),n.word=n.strInit)):(n.word===n.strInit&&(n.startPos=n.i),n.word+=o)}return n.word!=n.strInit&&(t.p_insert(n.word,n.startPos,n.i),n.word=n.strInit),t.charCount=e.length,t.isIndexed=!0,!0},chlonnik.delays.cache={strInit:"",word:"",startPos:0,i:0},chlonnik.delays.nextCallback(chlonnik.delays.cache)}function WordIndex_clear(){this.initialize()}function WordIndex_clearPosIndex(){this.p_wordPosIndex={}}function WordIndex_getNumbers(e,t,n){return e=this.p_normalize(e),t?(this.p_soughtFragm=e,n||(n="a"),"s"!=n&&"a"!=n&&"e"!=n?console.log("GetNumbers: Bad search direction argument"):(chlonnik.delays.nextCallback=function(i){var o=Date.now(),r=chlonnik.mainIndex;if(e==r.p_soughtFragm){for(var l=[];chlonnik.delays.cache.i<r.p_wordIDKeys.length;chlonnik.delays.cache.i++){var s=r.p_wordIDKeys[chlonnik.delays.cache.i],a=!1;if("s"==n)for(var d=0;d<e.length;d++)if(s.charAt(d)!=e.charAt(d)){a=!0;break}if("e"==n)for(var d=0;d<e.length;d++)if(s.charAt(s.length-1-d)!=e.charAt(e.length-1-d)){a=!0;break}if("a"==n&&-1==s.indexOf(e)&&(a=!0),a||(l=l.concat(r.p_wordIDIndex[s])),Date.now()-o>.8*chlonnik.delays.timeout)return chlonnik.delays.cache.i++,window.setTimeout(function(){chlonnik.delays.nextCallback(chlonnik.delays.cache)},chlonnik.delays.delay),t(l),!1}return t(l),!0}},chlonnik.delays.cache.i=0,void chlonnik.delays.nextCallback(chlonnik.delays.cache))):this.p_wordIDIndex[e]?this.p_wordIDIndex[e].slice(0):!1}function WordIndex_getPositions(e){return this.p_wordPosIndex[this.p_normalize(e)]||!1}function WordIndex_insert(e,t,n){this.p_wordCount++,e=this.p_normalize(e),this.p_posIndex[t]=n,this.p_wordPosIndex.hasOwnProperty(e)?this.p_wordPosIndex[e].push(t):(this.p_wordPosIndex[e]=[t],this.p_wordDiversity++)}function WordIndex_insertID(e,t,n){this.p_wordIDIndex.hasOwnProperty(this.p_normalize(e))||(this.p_wordIDIndex[this.p_normalize(e)]=[]),this.p_wordIDIndex[this.p_normalize(e)][t]=n}function WordIndex_isRepeatedNearly(e,t,n){if(this.isDisplayed)return this.repeatedNearly.indexOf(t)>0?!0:!1;var i=this.getPositions(this.p_normalize(e));if(!i)return utl.log("Can't find word in index: "+e),!1;var o=i.indexOf(t);return!i||1==i.length||(0===o||t-this.getEndPos(i[o-1])>n)&&(o+1==i.length||i[o+1]-t>n)?!1:(this.repeatedNearly.push(t),!0)}function WordIndex_markDisplayed(){this.p_clearPosIndex(),this.isDisplayed=!0,this.p_wordIDKeys=Object.keys(this.p_wordIDIndex)}function WordIndex_normalize(e){if(!e)return"";var e=e.toLowerCase();return e}function WordSearchHelper_search(e){if(chlonnik.h.oneWord.clear(),!(e.trim().length<=1)){var t=e.trim().split(" "),n=chlonnik.mainIndex;if(1==t.length){var i=!1;return void n.getNumbers(t[0],function(e){e&&!i&&(chlonnik.h.oneWord.startPhrase(e[0],1),i=!0);for(var t=0;t<e.length;t++)chlonnik.h.oneWord.phraseAppend(e[t]);chlonnik.h.oneWord.refreshBarPhrase(),0!=e.length&&(chlonnik.h.oneWord.highlightPhrase(e[0]),chlonnik.h.oneWord.scrollTo(e[0],!1))},"a")}if(t.length>2){for(var o=n.getNumbers(t[1]),r=0;r<o.length;r++)o[r]--;for(var l=2;l<t.length-2;l++){for(var s=n.getNumbers[l],r=0;r<s.length;r++)s[r]-=l;o=utl.intersect(o,s)}}chlonnik.delays.cache.pool2=[],chlonnik.delays.cache.endWord=t[t.length-1],chlonnik.delays.cache.wordCount=t.length,o?chlonnik.delays.cache.pool1=o:chlonnik.delays.cache.pool1=!1;var a=function(e){var t=chlonnik.delays.cache;if(t.pool2=t.pool2.concat(e),t.i==n.getWordDiversity()){if(t.pool1?t.pool1=utl.intersect(t.pool1,t.pool2):t.pool1=t.pool2,0==t.pool1.length)return;n.getNumbers(t.endWord,t.endFunc,"s")}};chlonnik.delays.cache.endFunc=function(e){for(var t=chlonnik.delays.cache,n=!1,i=0;i<e.length;i++)e[i]-=t.wordCount-1,-1!=t.pool1.indexOf(e[i])&&(n||(n=e[i],chlonnik.h.oneWord.startPhrase(e[i],t.wordCount)),chlonnik.h.oneWord.phraseAppend(e[i]));return n?(chlonnik.h.oneWord.refreshBarPhrase(),void chlonnik.h.oneWord.scrollTo(n,!1)):!1},n.getNumbers(t[0],a,"e")}}FileHelper.prototype.blow=FileHelper_blow,FileHelper.prototype.clearFileInput=FileHelper_clearFileInput,FileHelper.prototype.feedDocx=FileHelper_feedDocx,OneWordHelper.prototype.clear=OneWordHelper_clear,OneWordHelper.prototype.getCurrentWord=function(){return this.p_currentWord},OneWordHelper.prototype.highlight=OneWordHelper_highlight,OneWordHelper.prototype.highlightPhrase=OneWordHelper_highlightPhrase,OneWordHelper.prototype.mouseDown=OneWordHelper_mouseDown,OneWordHelper.prototype.phraseAppend=OneWordHelper_phraseAppend,OneWordHelper.prototype.refreshBarPhrase=OneWordHelper_refreshBarPhrase,OneWordHelper.prototype.scrollTo=OneWordHelper_scrollTo,OneWordHelper.prototype.showBar=OneWordHelper_showBar,OneWordHelper.prototype.startPhrase=OneWordHelper_startPhrase,WordSearchHelper.prototype.search=WordSearchHelper_search,TextDisplay.prototype.initialize=function(){this.p_rawText="",this.redRGBFactor=-1,this.wordN=0,this.pageCount=1,this.charOnPage=0,this.pgChars=1800,this.pageDisplayed=0,this.currentPage=1},TextDisplay.prototype.addPageCounts=TextDisplay_addPageCounts,TextDisplay.prototype.checkPaging=TextDisplay_checkPaging,TextDisplay.prototype.newInput=TextDisplay_newInput,TextDisplay.prototype.pageStartCode=TextDisplay_pageStartCode,TextDisplay.prototype.pagingCode=TextDisplay_pagingCode,TextDisplay.prototype.processInput=TextDisplay_processInput,TextDisplay.prototype.progress=TextDisplay_progress,TextDisplay.prototype.reflow=TextDisplay_reflow,TextDisplay.prototype.setPage=TextDisplay_setPage,TextDisplay.prototype.showInputMode=TextDisplay_showInputMode,TextDisplay.prototype.showPending=TextDisplay_showPending,TextDisplay.prototype.showResultsMode=TextDisplay_showResultsMode,TextDisplay.prototype.displayResults=TextDisplay_displayResults,TextDisplay.prototype.formatTextChunk=TextDisplay_formatTextChunk,WordIndex.prototype.initialize=function(){this.isDisplayed=!1,this.isIndexed=!1,this.p_posIndex={},this.p_wordIDIndex={},this.p_wordPosIndex={},this.p_wordIDKeys=[],this.charCount=0,this.lineBreaksCount=0,this.p_wordCount=0,this.p_wordDiversity=0,this.p_soughtFragm="",this.repeatedNearly=[]},WordIndex.prototype.absorb=WordIndex_absorb,WordIndex.prototype.clear=WordIndex_clear,WordIndex.prototype.getEndPos=function(e){return this.p_posIndex[e]||!1},WordIndex.prototype.getNumbers=WordIndex_getNumbers,WordIndex.prototype.getPositions=WordIndex_getPositions,WordIndex.prototype.getWordCount=function(){return this.p_wordCount},WordIndex.prototype.getWordDiversity=function(){return this.p_wordDiversity},WordIndex.prototype.isRepeatedNearly=WordIndex_isRepeatedNearly,WordIndex.prototype.p_clearPosIndex=WordIndex_clearPosIndex,WordIndex.prototype.p_insert=WordIndex_insert,WordIndex.prototype.p_insertID=WordIndex_insertID,WordIndex.prototype.p_markDisplayed=WordIndex_markDisplayed,WordIndex.prototype.p_normalize=WordIndex_normalize,chlonnik={h:{file:new FileHelper,oneWord:new OneWordHelper,wordSearch:new WordSearchHelper},textDisplay:new TextDisplay,mainIndex:new WordIndex,mode:"input",delays:{delay:20,timeout:100,nextCallback:null,cache:{},intervalID:null},barGoTo:function(e){var t=this.h.oneWord;t.scrollTo(e,!1),t.showBar(e)},fileButtonHandler:function(){"none"==utl.id("load-file-area").style.display?(utl.id("file-button").innerHTML="Zrezygnuj z wgrania",utl.id("load-file-area").style.display="block",chlonnik.h.file.clearFileInput()):(utl.id("file-button").innerHTML="Wgraj z dysku",utl.id("load-file-area").style.display="none",utl.id("load-file-error").style.display="none",utl.id("load-file-error").innerHTML="")},loadFileHandler:function(e){if(e.target.files.length){var t=e.target.files[0];if("application/vnd.openxmlformats-officedocument.wordprocessingml.document"!=t.type)return chlonnik.h.file.blow("Niestety, Przenica obsługuje w tej chwili tylko pliki .docx!");var n=new FileReader;n.onload=function(e){chlonnik.h.file.feedDocx(e.target.result)},n.readAsBinaryString(t)}},mainButtonHandler:function(){switch(chlonnik.mode){case"input":chlonnik.textDisplay.showPending(),window.setTimeout(function(){chlonnik.textDisplay.processInput()},100);break;case"results":chlonnik.textDisplay.newInput(),chlonnik.textDisplay.showInputMode()}},reflowDialog:function(){utl.id("page-count").innerHTML='<input id="new-page-count" value="'+this.textDisplay.pageCount+'"> <a href="javascript:chlonnik.reflowOK()">(zatwierdź)</a>',utl.id("reflow-link").blur(),utl.id("reflow-link").style.display="none"},reflowOK:function(){var e=utl.id("new-page-count").value;this.textDisplay.reflow(e)?utl.id("reflow-link").style.display="inline":(utl.id("page-count").innerHTML=this.textDisplay.pageCount,utl.id("reflow-link").style.display="inline",utl.log("Couldn't reflow text to "+e+" pages"))},scrollHandler:function(){var e=document.body.offsetHeight||window.document.documentElement.scrollHeight,t=window.innerHeight||document.documentElement.clientHeight,n=window.scrollY||window.document.documentElement.scrollTop;if(!(n+t>=e)){var i=utl.id("menu"),o=utl.id("wd-search");i.getBoundingClientRect().top<0&&!i.className?(i.className="sticky-menu",o.className="sticky-wd-search","results"==chlonnik.mode&&utl.id("main-button").getBoundingClientRect().left<utl.id("wd-search").getBoundingClientRect().right&&(utl.id("main-button").innerHTML="usuń")):(utl.id("text-input").getBoundingClientRect().top>0||utl.id("text-results").getBoundingClientRect().top>0)&&i.className&&(i.className="",o.className="base-wd-search","results"==chlonnik.mode&&(utl.id("main-button").innerHTML="Inny/Kolejna wersja"));for(var r={x:document.documentElement.clientWidth/2,y:document.documentElement.clientHeight/2},l=utl.id("results-pages"),s=0;5>s;s++){var a=document.elementFromPoint(r.x,r.y);if(a.offsetTop<l.offsetTop){chlonnik.textDisplay.setPage(1);break}if("SPAN"==a.nodeName){var d=Math.floor(chlonnik.textDisplay.pageCount*(a.offsetTop-l.offsetTop)/l.offsetHeight);d>chlonnik.textDisplay.pageCount&&(d=chlonnik.textDisplay.pageCount);for(var h=!1,c=0;5>c;c++)if(utl.id("pn-"+d).offsetTop>a.offsetTop)d--;else{if(!(d<chlonnik.textDisplay.pageCount&&utl.id("pn-"+(d+1)).offsetTop<a.offsetTop)){h=!0;break}d++}return void(h&&chlonnik.textDisplay.setPage(d))}r.x=r.x+60*Math.random()-30,r.y=r.y+60*Math.random()-30}}}},addLoadEvent(function(){Mousetrap.bind(["command+;","ctrl+;"],chlonnik.mainButtonHandler),utl.id("main-button").onclick=chlonnik.mainButtonHandler,utl.id("text-results").onmousedown=function(e){chlonnik.h.oneWord.mouseDown(e)},document.body.onmousedown=function(e){"results"!=chlonnik.mode||e.target!=document.body&&e.srcElement!=document.body||chlonnik.h.oneWord.mouseDown(e)},utl.id("load-file").addEventListener("change",chlonnik.loadFileHandler,!1),utl.id("wd-search-input").onkeyup=function(e){chlonnik.h.wordSearch.search(utl.id("wd-search-input").value)},window.onscroll=function(){window.setTimeout(chlonnik.scrollHandler,500)}}),addLoadEvent(function(){-1!=document.cookie.indexOf("warned=true")&&(document.getElementById("cookies-warning").style.display="none")}),hideCookiesWarning=function(){var e=new Date;e.setTime(e.getTime()+2592e6),document.cookie="warned=true; expires="+e.toGMTString()+"; path=/",cookieFrame=0;for(var t=1;4>t;t++)window.setTimeout(function(){document.getElementById("cookies-warning").style.height=6-2*cookieFrame++ +"em"},50*t);document.getElementById("cookies-warning").style.border="0px",document.getElementById("cookies-warning").style.padding="0px",window.setTimeout(function(){document.getElementById("cookies-warning").style.display="none"},200)},utl={create:function(e,t){var n=document.createElement(e);for(i in t)n[i]=t[i];return n},id:function(e){return document.getElementById(e)},log:function(e){console.log(e)},intersect:function(e,t){for(var n=0,i=0,o=new Array;n<e.length&&i<t.length;)e[n]<t[i]?n++:e[n]>t[i]?i++:(o.push(e[n]),n++,i++);return o}},Object.keys||(Object.keys=function(){"use strict";var e=Object.prototype.hasOwnProperty,t=!{toString:null}.propertyIsEnumerable("toString"),n=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],i=n.length;return function(o){if("object"!=typeof o&&("function"!=typeof o||null===o))throw new TypeError("Object.keys called on non-object");var r,l,s=[];for(r in o)e.call(o,r)&&s.push(r);if(t)for(l=0;i>l;l++)e.call(o,n[l])&&s.push(n[l]);return s}}()),Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){var n;if(null==this)throw new TypeError('"this" is null or not defined');var i=Object(this),o=i.length>>>0;if(0===o)return-1;var r=+t||0;if(Math.abs(r)===1/0&&(r=0),r>=o)return-1;for(n=Math.max(r>=0?r:o-Math.abs(r),0);o>n;){if(n in i&&i[n]===e)return n;n++}return-1});