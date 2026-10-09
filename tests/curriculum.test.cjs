const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{spawnSync}=require('node:child_process');
const window={};vm.runInNewContext(fs.readFileSync('ascii-games.js','utf8'),{window});vm.runInNewContext(fs.readFileSync('curriculo.js','utf8'),{window});
const modules=window.PyCodeCurriculo.modules;
const outputs={
 inicio:['Olá, mundo!\n','Ana\n','Olá, Ana\n'],
 listas:["['maçã', 'uva', 'banana']\n",'maçã\n','maçã\nuva\nbanana\n'],
 calculos:['7\n','Você passou de fase!\n','1\n2\n3\n4\n5\n'],
 cobrinha:['+----------+\n|          |\n+----------+\n','|@         |\n'],
 pong:['+------------+\n| |        | |\n| |   O    | |\n| |        | |\n+------------+\n','Direção: -1\n'],
 tetris:['.@.\n@@@\n','Linha completa!\n'],
 rpg:['#######\n#@..KD#\n#######\n','Porta aberta!\n'],
 bot:['Olá! Vamos estudar Python?\n','Use [ ] para criar uma lista.\n','Você: O que é Python?\nBot: Python é uma linguagem de programação.\nVocê: Deu erro\nBot: Leia a última linha do erro.\n']
};
function python(code){const r=spawnSync('python3',['-I','-c',code],{encoding:'utf8',timeout:5000});assert.ifError(r.error);assert.equal(r.status,0,r.stderr);return r.stdout}
for(const mod of modules.filter(m=>m.id!=='colab'))mod.steps.filter(s=>!s.asciiGame).forEach((s,i)=>test(mod.id+' etapa '+(i+1)+' executa isolada com saída esperada',()=>assert.equal(python(s.code),outputs[mod.id][i])));
test('LLM marca dependências de sessão nas etapas 2 e 3',()=>{const steps=modules.find(m=>m.id==='colab').steps;assert.equal(steps[1].requiresPrevious,true);assert.equal(steps[2].requiresPrevious,true)});
test('LLM células Python têm sintaxe válida (não executa download nem inferência)',()=>{for(const s of modules.find(m=>m.id==='colab').steps.slice(1))python('import ast\nast.parse('+JSON.stringify(s.code)+')')});

test('células ASCII são Python válido e notebooks correspondem às aulas',()=>{for(const m of modules.filter(m=>m.steps.some(s=>s.asciiGame))){const code=m.steps[2].code;python('import ast\nast.parse('+JSON.stringify(code)+')');const nb=JSON.parse(fs.readFileSync('notebooks/'+m.id+'-ascii.ipynb','utf8'));assert.equal(nb.cells[1].source.join(''),code);assert.match(code,/jogo = r"""/);assert.match(code,/sandbox="allow-scripts"/);}});
