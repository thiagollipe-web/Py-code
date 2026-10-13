const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{spawnSync}=require('node:child_process');
const window={};vm.runInNewContext(fs.readFileSync('curriculo.js','utf8'),{window});
const {modules,byId}=window.PyCodeCurriculo;
function run(code){const p=spawnSync('python3',['-c',code],{encoding:'utf8',timeout:5000});assert.equal(p.status,0,p.stderr);return p.stdout;}
const expected={
 inicio:['Olá, mundo!\n','Ana\n','Olá, Ana\n'],
 listas:["['maçã', 'uva', 'banana']\n",'maçã\n','maçã\nuva\nbanana\n'],
 calculos:['7\n','Você passou de fase!\n','1\n2\n3\n4\n5\n'],
 cobrinha:['[(2, 2), (1, 2), (0, 2)]\n','[(3, 2), (2, 2), (1, 2)]\n','Passo 1 [(3, 2), (2, 2), (1, 2)]\nPasso 2 [(4, 2), (3, 2), (2, 2)]\nPasso 3 [(5, 2), (4, 2), (3, 2)]\n'],
 tetris:['[[1, 1], [1, 1]]\n','[0, 1, 0]\n[1, 1, 1]\n','  []  \n[][][]\n'],
 rpg:['Aventureiro tem 10 de vida\n',"Itens: ['mapa', 'espada']\n","Você entrou na floresta.\nItens: ['mapa', 'espada']\n"],
 bot:['Olá! Vamos estudar Python?\n','Use [ ] para criar uma lista.\nOlá, estudante!\nMe conte mais.\n','Você: O que é Python?\nBot: Python é uma linguagem de programação.\nVocê: Deu erro\nBot: Leia a última linha do erro.\n']
};
for(const m of modules.filter(m=>m.id!=='colab'))m.steps.filter(s=>!s.colabOnly).forEach((s,i)=>test(`${m.id}: etapa ${i+1} executa sozinha com saída correta`,()=>{
 const output=run(s.code);if(expected[m.id])assert.equal(output,expected[m.id][i]);
 else if(i===0)assert.equal(output,'1\n');
 else if(i===1)assert.equal(output,'Posição: 5\nDireção: -1\n');
 else assert.equal(output,'Passo 1 posição 3 direção 1\nPasso 2 posição 4 direção 1\nPasso 3 posição 5 direção -1\nPasso 4 posição 4 direção -1\nPasso 5 posição 3 direção -1\nPasso 6 posição 2 direção -1\nPasso 7 posição 1 direção -1\nPasso 8 posição 0 direção 1\nPasso 9 posição 1 direção 1\nPasso 10 posição 2 direção 1\n');
}));
test('Pong: desafio muda a borda e rebate no passo 4',()=>assert.match(run(byId.pong.steps[2].code.replace('limite_direito = 5','limite_direito = 6')),/Passo 4 posição 6 direção -1/));
test('Pong: movimentos maiores que um são contidos nas bordas',()=>{const out=run(byId.pong.steps[2].code.replace('velocidade = 1','velocidade = 3'));for(const line of out.trim().split('\n')){const position=Number(line.split(' ')[3]);assert.ok(position>=0&&position<=5,line)}});
test('LLM: células Python compilam; instalação continua separada',()=>{assert.match(byId.colab.steps[0].code,/^%pip /);for(const s of byId.colab.steps.slice(1))run('compile('+JSON.stringify(s.code)+', "aula", "exec")')});
for(const [id,file] of [['cobrinha','cobrinha'],['tetris','tetris'],['rpg','rpg'],['bot','eliza']])test(`${id}: projeto completo corresponde ao notebook e compila`,()=>{
 const code=fs.readFileSync(`aulas/interativos/${file}.py`,'utf8');
 assert.equal(byId[id].steps.at(-1).code,code);
 const notebook=JSON.parse(fs.readFileSync(`aulas/interativos/${file}.ipynb`,'utf8'));
 assert.equal(notebook.cells.at(-1).source.join(''),code);
 run('compile('+JSON.stringify(code)+', "projeto", "exec")');
});

for(const id of ["cobrinha","tetris","rpg","bot"])test(`${id}: trechos montam exatamente o programa final`,()=>{const m=byId[id];assert.equal(m.steps.filter(s=>s.fragment).map(s=>s.code).join(""),m.steps.at(-1).code);assert.ok(m.steps.filter(s=>s.fragment).every(s=>s.title&&s.question&&s.explain));});
test('jogos do site usam as mesmas classes Python das aulas',()=>{const w={};vm.runInNewContext(fs.readFileSync('games-data.js','utf8'),{window:w});for(const [id,file] of [['cobrinha','cobrinha'],['tetris','tetris'],['rpg','rpg'],['bot','eliza']])assert.equal(w.PyCodeGameSources[id],fs.readFileSync(`aulas/interativos/${file}.py`,'utf8').split('if __name__')[0]);});
