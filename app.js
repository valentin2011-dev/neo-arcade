(() => {
"use strict";
const KEY="neo-arcade-v1";
const $=s=>document.querySelector(s);
const defaults={xp:0,played:0,bests:{reaction:null,memory:null,rush:null},wins:{reaction:0,memory:0,rush:0},sound:true};
let data;
try{data={...defaults,...JSON.parse(localStorage.getItem(KEY)||"{}")};data.bests={...defaults.bests,...(data.bests||{})};data.wins={...defaults.wins,...(data.wins||{})}}catch{data={...defaults,bests:{...defaults.bests},wins:{...defaults.wins}}}
const achievements=[
{id:"first",icon:"✦",name:"FIRST CONTACT",desc:"Termine ta première partie",test:()=>data.played>=1},
{id:"reflex",icon:"⚡",name:"QUICK HANDS",desc:"Réaction sous 300 ms",test:()=>data.bests.reaction!==null&&data.bests.reaction<300},
{id:"memory",icon:"◈",name:"PHOTOGRAPHIC",desc:"Termine une partie Memory",test:()=>data.wins.memory>=1},
{id:"rush",icon:"⌁",name:"SPEEDRUNNER",desc:"Termine Number Rush",test:()=>data.wins.rush>=1},
{id:"ten",icon:"⬡",name:"DEDICATED",desc:"Joue 10 parties",test:()=>data.played>=10},
{id:"xp",icon:"♛",name:"RISING STAR",desc:"Atteins 500 XP",test:()=>data.xp>=500}
];
const level=x=>Math.floor(x/100)+1;
function save(){try{localStorage.setItem(KEY,JSON.stringify(data))}catch{toast("Sauvegarde indisponible sur cet appareil")}}
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2300)}
let audioCtx;
function beep(freq=650,duration=.08){if(!data.sound)return;try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=freq;o.type="sine";g.gain.setValueAtTime(.07,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration)}catch{}}
function render(){
 const lv=level(data.xp),progress=data.xp%100;
 $("#level-number").textContent=lv;$("#xp-total").textContent=data.xp;$("#games-played").textContent=data.played;
 $("#best-score").textContent=[data.bests.reaction,data.bests.memory,data.bests.rush].filter(x=>x!==null).length?Math.max(...[data.bests.reaction,data.bests.memory,data.bests.rush].filter(x=>x!==null)):"—";
 $("#achievement-count").textContent=achievements.filter(a=>a.test()).length+"/6";$("#next-level").textContent=lv+1;$("#xp-progress-label").textContent=progress+" / 100 XP";$("#xp-progress").style.width=progress+"%";
 $("#best-reaction").textContent=data.bests.reaction===null?"—":data.bests.reaction+" ms";$("#best-memory").textContent=data.bests.memory===null?"—":data.bests.memory+" coups";$("#best-rush").textContent=data.bests.rush===null?"—":data.bests.rush+" s";
 $("#achievements").innerHTML=achievements.map(a=>'<div class="achievement '+(a.test()?"unlocked":"")+'"><span class="achievement-icon">'+a.icon+'</span><div><strong>'+a.name+'</strong><small>'+a.desc+'</small></div></div>').join("");
 $("#sound-toggle").textContent=data.sound?"♫":"♪";$("#sound-toggle").style.opacity=data.sound?"1":".5";
}
function award(game,score,xp){const before=achievements.filter(a=>a.test()).length;data.played++;data.wins[game]=(data.wins[game]||0)+1;if(data.bests[game]===null||score<data.bests[game])data.bests[game]=score;data.xp+=xp;save();render();beep(880,.13);const unlocked=achievements.filter(a=>a.test()).length-before;toast("+"+xp+" XP"+(unlocked?" • NOUVEAU SUCCÈS !":""));return xp}
const modal=$("#game-modal"),area=$("#game-area"),message=$("#game-message");
function openGame(game){modal.hidden=false;document.body.style.overflow="hidden";$("#modal-title").textContent=({reaction:"REACTION",memory:"MEMORY",rush:"NUMBER RUSH"})[game];$("#modal-kicker").textContent="GAME SESSION / "+game.toUpperCase();$("#game-hint").textContent="READY PLAYER ONE";$("#game-xp").textContent="XP À GAGNER";message.textContent="";({reaction:startReaction,memory:startMemory,rush:startRush})[game]()}
function closeGame(){modal.hidden=true;document.body.style.overflow="";area.replaceChildren()}
$("#close-modal").addEventListener("click",closeGame);modal.addEventListener("click",e=>{if(e.target===modal)closeGame()});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.hidden)closeGame()});
document.querySelectorAll("[data-game]").forEach(b=>b.addEventListener("click",()=>openGame(b.dataset.game)));
function startReaction(){
 let state="ready",timer=null,start=0,attempt=0;area.innerHTML='<button class="reaction-pad" id="reaction-pad">CLIQUE POUR COMMENCER</button>';const pad=$("#reaction-pad");
 pad.addEventListener("click",()=>{if(state==="ready"){state="waiting";pad.className="reaction-pad waiting";pad.textContent="ATTENDS LE SIGNAL...";message.textContent="Ne clique pas trop tôt.";timer=setTimeout(()=>{state="go";start=performance.now();pad.className="reaction-pad go";pad.textContent="MAINTENANT !";beep(1000)},1000+Math.random()*2800)}else if(state==="waiting"){clearTimeout(timer);state="ready";pad.className="reaction-pad";pad.textContent="TROP TÔT ! RECOMMENCER";message.textContent="Faux départ. Réessaie."}else if(state==="go"){const ms=Math.round(performance.now()-start);attempt++;pad.disabled=true;pad.className="reaction-pad";pad.textContent=ms+" ms";const xp=ms<220?60:ms<300?45:ms<400?30:20;message.textContent="Réflexe "+(ms<220?"surhumain !":ms<300?"excellent !":ms<400?"bien joué !":"continue à t'entraîner.");$("#game-hint").textContent="TENTATIVE "+attempt;$("#game-xp").textContent="+"+xp+" XP";award("reaction",ms,xp);setTimeout(()=>{if(!modal.hidden){pad.disabled=false;state="ready";pad.textContent="REJOUER";pad.className="reaction-pad";message.textContent="Ton score : "+ms+" ms — tente de faire mieux."}},1100)}})
}
function startMemory(){
 const symbols=["✦","◈","⌘","△","◎","✧","⬡","⌁"];let deck=[...symbols,...symbols].sort(()=>Math.random()-.5),first=null,lock=false,moves=0,matched=0;
 area.innerHTML='<div class="memory-board">'+deck.map((_,i)=>'<button class="memory-tile" data-i="'+i+'" aria-label="Carte cachée">?</button>').join("")+'</div>';const tiles=[...area.querySelectorAll("button")];
 tiles.forEach((tile,i)=>tile.addEventListener("click",()=>{if(lock||tile.classList.contains("revealed")||tile.classList.contains("matched"))return;tile.textContent=deck[i];tile.classList.add("revealed");beep(500);if(first===null){first=i;return}moves++;if(deck[first]===deck[i]){tiles[first].classList.add("matched");tile.classList.add("matched");matched+=2;first=null;beep(850);if(matched===deck.length){const xp=Math.max(35,100-Math.max(0,moves-8)*4);message.textContent="Toutes les paires trouvées en "+moves+" coups !";$("#game-hint").textContent=moves+" COUPS";$("#game-xp").textContent="+"+xp+" XP";award("memory",moves,xp);tiles.forEach(t=>t.disabled=true)}}else{lock=true;const prev=first;first=null;setTimeout(()=>{tiles[prev].textContent="?";tile.textContent="?";tiles[prev].classList.remove("revealed");tile.classList.remove("revealed");lock=false},700)}}));
 message.textContent="Trouve les 8 paires. Chaque coup compte.";
}
function startRush(){
 let nums=Array.from({length:16},(_,i)=>i+1).sort(()=>Math.random()-.5),next=1,started=0,done=false;
 area.innerHTML='<div class="rush-board">'+nums.map(n=>'<button class="rush-tile" data-n="'+n+'">'+n+'</button>').join("")+'</div>';const tiles=[...area.querySelectorAll("button")];
 tiles.forEach(tile=>tile.addEventListener("click",()=>{if(done)return;const n=Number(tile.dataset.n);if(n!==next){message.textContent="Cherche le "+next+" !";beep(220);return}if(!started)started=performance.now();tile.disabled=true;next++;beep(650+n*15);message.textContent=(next<=16?"Prochain nombre : "+next:"");if(next===17){done=true;const sec=Math.max(1,Math.round((performance.now()-started)/100)/10);const xp=sec<12?100:sec<20?75:sec<30?55:35;message.textContent="Terminé en "+sec.toFixed(1)+" secondes !";$("#game-hint").textContent=sec.toFixed(1)+" SECONDES";$("#game-xp").textContent="+"+xp+" XP";award("rush",Math.round(sec*10),xp)}}));
 message.textContent="Clique sur les nombres de 1 à 16 dans l'ordre.";
}
$("#sound-toggle").addEventListener("click",()=>{data.sound=!data.sound;save();render();toast(data.sound?"Son activé":"Son coupé")});
$("#reset-data").addEventListener("click",()=>{if(confirm("Effacer tous tes XP, records et succès sur cet appareil ? Cette action est irréversible.")){data={...defaults,bests:{...defaults.bests},wins:{...defaults.wins}};save();render();toast("Données réinitialisées") }});
window.addEventListener("online",()=>{$("#connection-label").textContent="SYSTÈME EN LIGNE"});window.addEventListener("offline",()=>{$("#connection-label").textContent="MODE HORS LIGNE"});
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").then(()=>{$("#offline-status").textContent="CACHE HORS LIGNE ACTIVÉ";}).catch(()=>{$("#offline-status").textContent="CACHE HORS LIGNE NON DISPONIBLE"});
$("#connection-label").textContent=navigator.onLine?"SYSTÈME EN LIGNE":"MODE HORS LIGNE";render();
})();