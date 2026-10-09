(function(){
'use strict';
const $=id=>document.getElementById(id),catalog=window.PyCodeCurriculo,modules=catalog.modules,tutor=window.PyCodeTutor.create();
const STORE='pycode-guided-v40';
let active='inicio',step=0,done={},drafts={},returnFocus=null,toastTimer;
try{const saved=JSON.parse(localStorage.getItem(STORE)||'null');if(saved&&typeof saved==='object'){if(catalog.byId[saved.active])active=saved.active;if(Number.isInteger(saved.step))step=Math.max(0,Math.min(saved.step,catalog.byId[active].steps.length-1));if(saved.done&&typeof saved.done==='object'&&!Array.isArray(saved.done))done=saved.done;if(saved.drafts&&typeof saved.drafts==='object'&&!Array.isArray(saved.drafts))drafts=saved.drafts}}catch(_){}
function save(){try{localStorage.setItem(STORE,JSON.stringify({active,step,done,drafts}))}catch(_){}}
function toast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3500)}
function bot(text,user=false){const div=document.createElement('div');div.className='message'+(user?' user':'');const who=document.createElement('strong');who.textContent=user?'VOCÊ':'PY · PROFESSORA';const content=document.createElement('div');content.textContent=text;div.append(who,content);$('messages').append(div);while($('messages').childElementCount>80)$('messages').firstChild.remove();$('messages').scrollTop=$('messages').scrollHeight}
function openBot(){if($('assistant').hidden)returnFocus=document.activeElement;$('assistant').hidden=false;$('botFab').setAttribute('aria-expanded','true');$('mascotBubble').hidden=true;$('chatInput').focus()}
function closeBot(){$('assistant').hidden=true;$('botFab').setAttribute('aria-expanded','false');$('mascotBubble').hidden=false;if(returnFocus&&returnFocus.isConnected)returnFocus.focus()}
function ask(text){bot(text,true);bot(tutor.respond(text))}
const marks=['>_','[ ]','x+y','~','↔','▦','?','{ }','ai'];
function isDone(id){return catalog.byId[id].steps.every((_,i)=>done[id+':'+i]===true)}
function navigation(){
 $('nav').replaceChildren();$('cards').replaceChildren();
 modules.forEach((m,i)=>{
  const nav=document.createElement('button');nav.type='button';nav.className=m.id===active?'active':'';nav.setAttribute('aria-current',m.id===active?'step':'false');const number=document.createElement('span');number.className='nav-number';number.textContent=isDone(m.id)?'✓':String(i+1).padStart(2,'0');nav.append(number,document.createTextNode(m.name));nav.onclick=()=>select(m.id);$('nav').append(nav);
  const card=document.createElement('button');card.type='button';card.className='card'+(m.id===active?' active':'');card.setAttribute('aria-label','Estudar '+m.name);const icon=document.createElement('span');icon.className='card-icon';icon.textContent=marks[i];icon.setAttribute('aria-hidden','true');const title=document.createElement('b');title.textContent=m.name;const sub=document.createElement('small');sub.textContent=m.subtitle;const meta=document.createElement('span');meta.className='card-bottom';meta.textContent=isDone(m.id)?'ETAPAS CONCLUÍDAS':m.steps.length+' ETAPAS · '+(i<3?'FUNDAMENTOS':i<7?'CRIAR E EXPLORAR':'INTELIGÊNCIA ARTIFICIAL');const arrow=document.createElement('span');arrow.className='card-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');card.append(icon,title,sub,meta,arrow);card.onclick=()=>select(m.id);$('cards').append(card);
 });
 const count=modules.filter(m=>isDone(m.id)).length;$('progressLabel').textContent=count+' / '+modules.length;$('progressBar').value=count;$('progressBar').setAttribute('aria-label',count+' de '+modules.length+' trilhas concluídas');
}
function render(){
 const manual=document.getElementById('manualCopy');if(manual)manual.remove();
 const mod=catalog.byId[active],s=mod.steps[step];tutor.setLesson(active,step);$('lessonTitle').textContent=mod.name;$('lessonTag').textContent=mod.tag;$('lessonCounter').textContent='Etapa '+(step+1)+' de '+mod.steps.length;$('intro').textContent=mod.intro;$('explain').textContent=s.explain;$('exampleCode').textContent=s.code;$('challenge').textContent=mod.challenge;$('chatContext').textContent='Estudando: '+mod.name+' · etapa '+(step+1);$('checkQuestion').textContent='Explique o objetivo desta etapa e preveja o resultado antes de executar no Colab.';$('reflection').value=typeof drafts[active+':'+step]==='string'?drafts[active+':'+step]:'';
 $('gameNotebook').hidden=!(s.asciiGame||s.interactiveBot);
 $('gameNotebook').textContent=s.interactiveBot?'Abrir ELIZA no Colab':'Abrir jogo no Colab';
 $('copy').textContent=s.asciiGame?'Copiar jogo completo':s.interactiveBot?'Copiar ELIZA completa':'Copiar exercício';
 $('gameNotebook').href='https://colab.research.google.com/github/thiagollipe-web/Py-code/blob/main/notebooks/'+(s.interactiveBot?'eliza.ipynb':active+'-ascii.ipynb');
 $('executionNote').textContent=s.interactiveBot?'Cole a célula inteira no Colab, execute e digite sua mensagem no campo Você. Digite sair para encerrar.':s.asciiGame?'Jogo ASCII jogável: copie a célula completa ou abra o notebook. O jogo começa automaticamente. Clique no desenho para usar as setas. Python exibe a saída; JavaScript controla o jogo.':s.requiresPrevious?'Esta célula depende das etapas anteriores na MESMA sessão do Colab. Copie a sequência abaixo se estiver começando em um notebook vazio.':s.colabOnly?'Execute esta instalação em uma célula de código do Colab e aguarde terminar. As próximas etapas usam a mesma sessão.':'Copie o exemplo inteiro para uma célula vazia do Colab, preservando os espaços no início das linhas. Este exemplo funciona sozinho. Nas trilhas de jogos, a etapa 3 traz a versão ASCII jogável.';
 $('copySequence').hidden=!s.requiresPrevious;
 $('previous').disabled=step===0;$('next').textContent=step===mod.steps.length-1?'Marcar trilha como concluída ✓':'Entendi, próximo passo →';$('lessonStatus').textContent=done[active+':'+step]===true?'Você marcou esta etapa como entendida.':'';
 $('stepTabs').replaceChildren();mod.steps.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.textContent=(mod.defaultStep===2?(i===2?'Programa completo':'Aprender '+(i+1)):'Etapa '+(i+1))+(done[active+':'+i]===true?' ✓':'');b.className=i===step?'active':'';b.setAttribute('aria-label','Etapa '+(i+1));b.setAttribute('aria-current',i===step?'step':'false');b.onclick=()=>{step=i;render();save()};$('stepTabs').append(b)});
 $('lineNotes').classList.toggle('game-notes',!!s.asciiGame);$('lineNotes').replaceChildren();s.code.split('\n').forEach((line,i)=>{if(!line.trim())return;const row=document.createElement('div');row.className='line-note';const number=document.createElement('span');number.textContent=String(i+1).padStart(2,'0');row.append(number,document.createTextNode(window.PyCodeTutor.explainLine(line)));$('lineNotes').append(row)});
 navigation();$('continue').textContent=Object.keys(done).length?'Continuar minha jornada →':'Começar a aprender →';
}
function scrollLesson(){$('lesson').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});$('lesson').focus({preventScroll:true})}
function select(id){active=id;step=catalog.byId[id].defaultStep||0;render();save();bot('Vamos estudar '+catalog.byId[id].name+'. '+catalog.byId[id].steps[step].explain+' Quer uma explicação ou uma pista?');scrollLesson()}
$('continue').onclick=scrollLesson;$('openBot').onclick=openBot;$('botFab').onclick=openBot;$('closeBot').onclick=closeBot;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('assistant').hidden)closeBot()});
$('previous').onclick=()=>{if(step>0){step--;render();save()}};
$('next').onclick=()=>{done[active+':'+step]=true;if(step<catalog.byId[active].steps.length-1){step++;render();save();scrollLesson()}else{render();save();toast('Trilha marcada como concluída. Escolha sua próxima descoberta!');bot('Você concluiu as etapas de '+catalog.byId[active].name+'. Agora teste seu desafio no Colab: '+catalog.byId[active].challenge);openBot()}};
$('hint').onclick=()=>{openBot();bot(tutor.hint())};$('colabHelp').onclick=()=>{openBot();ask('Como usar o Colab?')};
$('reflection').addEventListener('input',()=>{drafts[active+':'+step]=$('reflection').value;save()});
$('discuss').onclick=()=>{const text=$('reflection').value.trim();openBot();if(text){bot(text,true);bot('Sua explicação ficou registrada nesta etapa. Vamos conferir pela prática: '+catalog.byId[active].steps[step].explain+'\nQual saída no Colab confirmaria o que você explicou?')}else bot('Tente descrever o que esta etapa faz com suas palavras. Pode começar com “Primeiro o programa…”; não precisa usar termos técnicos.')};
$('chatForm').addEventListener('submit',e=>{e.preventDefault();const text=$('chatInput').value.trim();if(text){ask(text);$('chatInput').value='';$('chatInput').focus()}});
$('chatInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();$('chatForm').requestSubmit()}});
['Explique esta etapa','Não entendi','Uma pista','Deu erro no Colab'].forEach((text,i)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=()=>ask(['explique esta etapa','não entendi','dica','deu erro'][i]);$('suggestions').append(b)});
async function copyExample(text,sequence=false){
 try{
  if(!navigator.clipboard)throw new Error('Clipboard indisponível');
  await navigator.clipboard.writeText(text);
  toast(sequence?'Sequência copiada. Cole numa célula do Colab e aguarde as etapas terminarem.':'Exemplo copiado. Cole em uma célula do Colab.');
 }catch(_){
  // Keep the exact text selectable even for a sequence that is not on screen.
  const old=document.getElementById('manualCopy');if(old)old.remove();
  const box=document.createElement('div');box.id='manualCopy';
  const label=document.createElement('label');label.htmlFor='manualCopyText';label.textContent='Cópia automática indisponível. Selecione e copie este conteúdo:';
  const field=document.createElement('textarea');field.id='manualCopyText';field.readOnly=true;field.value=text;field.rows=6;field.style.width='100%';
  const close=document.createElement('button');close.className='text-button';close.textContent='Fechar área de cópia';close.onclick=()=>{box.remove();$('copy').focus()};
  box.append(label,field,close);$('exampleCode').closest('.example').after(box);field.focus();field.select();
  toast('Conteúdo selecionado. Use Copiar no navegador.');
 }
}
$('copy').onclick=()=>copyExample(catalog.byId[active].steps[step].code);
$('copySequence').onclick=()=>copyExample(catalog.byId[active].steps.slice(0,step+1).map(s=>s.code).join('\n\n'),true);

render();bot('Olá! Eu sou a Py, sua cobrinha professora. Você cria seus programas no Colab; eu ajudo a entender cada passo aqui.\nEstamos em '+catalog.byId[active].name+'. Pergunte sobre uma linha, peça uma dica ou cole um erro do Colab.');
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).catch(()=>{});
})();
