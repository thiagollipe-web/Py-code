const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{spawnSync}=require('node:child_process');
const window={};vm.runInNewContext(fs.readFileSync('curriculo.js','utf8'),{window});
const modules=window.PyCodeCurriculo.modules;
const outputs={
 inicio:['Olá, mundo!\n','Ana\n','Olá, Ana\n'],
 listas:["['maçã', 'uva', 'banana']\n",'maçã\n','maçã\nuva\nbanana\n'],
 calculos:['7\n','Você passou de fase!\n','1\n2\n3\n4\n5\n'],
 cobrinha:['[(2, 2), (1, 2), (0, 2)]\n','[(3, 2), (2, 2), (1, 2)]\n','Passo 1 [(3, 2), (2, 2), (1, 2)]\nPasso 2 [(4, 2), (3, 2), (2, 2)]\nPasso 3 [(5, 2), (4, 2), (3, 2)]\n'],
 pong:['1\n','Direção: -1\n','0 3\n1 4\n2 5\n3 4\n4 3\n5 2\n6 1\n7 0\n8 1\n9 2\n'],
 tetris:['[[1, 1], [1, 1]]\n','[0, 1, 0]\n[1, 1, 1]\n','  []  \n[][][]\n'],
 rpg:['Aventureiro tem 10 de vida\n',"Itens: ['mapa', 'espada']\n",'Você entrou na floresta.\n'],
 bot:['Olá! Vamos estudar Python?\n','Use [ ] para criar uma lista.\n','Você: O que é Python?\nBot: Python é uma linguagem de programação.\nVocê: Deu erro\nBot: Leia a última linha do erro.\n']
};
function python(code){const r=spawnSync('python3',['-I','-c',code],{encoding:'utf8',timeout:5000});assert.ifError(r.error);assert.equal(r.status,0,r.stderr);return r.stdout}
for(const mod of modules.filter(m=>m.id!=='colab'))mod.steps.forEach((s,i)=>test(mod.id+' etapa '+(i+1)+' executa isolada com saída esperada',()=>assert.equal(python(s.code),outputs[mod.id][i])));
test('RPG última etapa fornece inventário antes de adicionar um item',()=>{const c=modules.find(m=>m.id==='rpg').steps[2].code;assert.match(python(c+'\ninventario.append("moeda")\nprint(inventario[-1])'),/moeda\n$/)});
test('LLM marca dependências de sessão nas etapas 2 e 3',()=>{const steps=modules.find(m=>m.id==='colab').steps;assert.equal(steps[1].requiresPrevious,true);assert.equal(steps[2].requiresPrevious,true)});
test('LLM células Python têm sintaxe válida (não executa download nem inferência)',()=>{for(const s of modules.find(m=>m.id==='colab').steps.slice(1))python('import ast\nast.parse('+JSON.stringify(s.code)+')')});
