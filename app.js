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
function save(){try{localStorage.setItem(KEY,JSON.stringify(data))}catch{toast("Sauvegarde indisponible sur cet appareil")}queueCloudSync()}
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

/* NEO ARCADE V2 — account and cloud progression */
const authModal=$("#auth-modal"), authError=$("#auth-error");
let authMode="signup", supabase=null, currentUser=null, cloudReady=false, syncBusy=false, syncQueued=false;
const config=window.NEO_ARCADE_CONFIG;
function setAuthError(message){authError.textContent=message||""}
function openAuth(){authModal.hidden=false;document.body.style.overflow="hidden";setAuthMode("signup")}
function closeAuth(){authModal.hidden=true;document.body.style.overflow=""}
function setAuthMode(mode){
 authMode=mode;
 $("#auth-tab-signup").classList.toggle("active",mode==="signup");
 $("#auth-tab-login").classList.toggle("active",mode==="login");
 $("#auth-submit").innerHTML=(mode==="signup"?"CRÉER MON COMPTE":"SE CONNECTER")+' <span>→</span>';
 $("#auth-password").autocomplete=mode==="signup"?"new-password":"current-password";
 $("#auth-title").textContent=mode==="signup"?"REJOINDRE L'ARCADE":"BON RETOUR";
 setAuthError("");
}
function showAccount(){
 $("#account-open").hidden=!!currentUser;
 $("#account-name").hidden=!currentUser;
 $("#account-name").textContent=currentUser?("PLAYER / "+(currentUser.user_metadata?.username||"")):"";
 if(currentUser){$("#account-open").textContent="DÉCONNEXION";$("#account-open").hidden=false;$("#account-name").hidden=true;}
 else $("#account-open").textContent="CONNEXION";
}
function usernameEmail(username){return username.toLowerCase()+"@neo-arcade.invalid"}
function mergeProgress(local,cloud){
 const merged={...defaults,...local,bests:{...defaults.bests,...(local.bests||{})},wins:{...defaults.wins,...(local.wins||{})}};
 if(!cloud)return merged;
 merged.xp=Math.max(merged.xp,Number(cloud.xp)||0);
 merged.played=Math.max(merged.played,Number(cloud.games_played)||0);
 const cloudBests=cloud.bests||{};
 for(const game of ["reaction","memory","rush","snake","aim"]){
  const a=merged.bests[game],b=cloudBests[game];
  if(a===null||a===undefined)merged.bests[game]=b??null;
  else if(b!==null&&b!==undefined)merged.bests[game]=Math.min(Number(a),Number(b));
 }
 merged.wins={...merged.wins,...(cloud.wins||{})};
 for(const key of Object.keys(merged.wins))merged.wins[key]=Math.max(Number(merged.wins[key])||0,Number((cloud.wins||{})[key])||0);
 return merged;
}
async function syncProgress(){
 if(!supabase||!currentUser||!cloudReady||syncBusy)return;
 syncBusy=true;
 try{
  const payload={user_id:currentUser.id,xp:data.xp,games_played:data.played,bests:data.bests,wins:data.wins,achievements:achievements.filter(a=>a.test()).map(a=>a.id),updated_at:new Date().toISOString()};
  const {error}=await supabase.from("player_progress").upsert(payload,{onConflict:"user_id"});
  if(error)throw error;
  $("#connection-label").textContent="PROGRESSION SYNCHRONISÉE";
 }catch(error){console.error("Cloud sync:",error);$("#connection-label").textContent="SYNC EN ATTENTE"}
 finally{syncBusy=false;if(syncQueued){syncQueued=false;syncProgress()}}
}
function queueCloudSync(){if(!currentUser||!cloudReady)return;if(syncBusy){syncQueued=true;return}syncProgress()}
async function loadCloudProgress(){
 const {data:cloud,error}=await supabase.from("player_progress").select("*").eq("user_id",currentUser.id).maybeSingle();
 if(error)throw error;
 data=mergeProgress(data,cloud);
 localStorage.setItem(KEY,JSON.stringify(data));
 cloudReady=true;render();await syncProgress();
}
async function submitAuth(){
 if(!supabase){setAuthError("Configuration Supabase absente. Vérifie config.js.");return}
 const username=$("#auth-username").value.trim().toLowerCase();
 const password=$("#auth-password").value;
 if(!/^[a-z0-9_]{3,20}$/.test(username)){setAuthError("Pseudonyme invalide : 3 à 20 caractères, lettres minuscules, chiffres ou _.");return}
 if(password.length<8){setAuthError("Le mot de passe doit contenir au moins 8 caractères.");return}
 const submit=$("#auth-submit");submit.disabled=true;submit.textContent="CONNEXION...";
 setAuthError("");
 try{
  if(authMode==="signup"){
   const {data:result,error}=await supabase.auth.signUp({email:usernameEmail(username),password,options:{data:{username}}});
   if(error)throw error;
   if(!result.session)throw new Error("La confirmation e-mail est encore activée dans Supabase. Désactive Confirm email pour ce prototype, puis réessaie.");
   currentUser=result.user;
  }else{
   const {data:result,error}=await supabase.auth.signInWithPassword({email:usernameEmail(username),password});
   if(error)throw error;
   currentUser=result.user;
  }
  showAccount();await loadCloudProgress();closeAuth();toast("Bienvenue dans NEO ARCADE !");
 }catch(error){
  const msg=error.message||"Une erreur est survenue.";
  setAuthError(msg.includes("already registered")?"Ce pseudonyme est déjà utilisé.":msg);
 }finally{submit.disabled=false;$("#auth-submit").innerHTML=(authMode==="signup"?"CRÉER MON COMPTE":"SE CONNECTER")+' <span>→</span>'}
}
$("#account-open").addEventListener("click",async()=>{
 if(currentUser){
  await supabase.auth.signOut();currentUser=null;cloudReady=false;showAccount();$("#connection-label").textContent=navigator.onLine?"SYSTÈME EN LIGNE":"MODE HORS LIGNE";toast("Déconnexion effectuée");
 }else openAuth();
});
$("#auth-close").addEventListener("click",closeAuth);
authModal.addEventListener("click",e=>{if(e.target===authModal)closeAuth()});
$("#auth-tab-signup").addEventListener("click",()=>setAuthMode("signup"));
$("#auth-tab-login").addEventListener("click",()=>setAuthMode("login"));
$("#auth-submit").addEventListener("click",submitAuth);
$("#auth-password").addEventListener("keydown",e=>{if(e.key==="Enter")submitAuth()});
if(config&&window.supabase?.createClient&&config.SUPABASE_URL&&config.SUPABASE_ANON_KEY&&!config.SUPABASE_URL.includes("YOUR_PROJECT")){
 supabase=window.supabase.createClient(config.SUPABASE_URL,config.SUPABASE_ANON_KEY);
 supabase.auth.getSession().then(async({data:sessionData})=>{
  currentUser=sessionData.session?.user||null;showAccount();
  if(currentUser){try{await loadCloudProgress()}catch(error){console.error(error);$("#connection-label").textContent="ERREUR DE SYNCHRONISATION"}}
 });
 supabase.auth.onAuthStateChange((_event,session)=>{currentUser=session?.user||null;showAccount()});
}else{
 $("#account-open").title="Configure Supabase pour activer les comptes";
}
showAccount();
\nif("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").then(()=>{$("#offline-status").textContent="CACHE HORS LIGNE ACTIVÉ";}).catch(()=>{$("#offline-status").textContent="CACHE HORS LIGNE NON DISPONIBLE"});
$("#connection-label").textContent=navigator.onLine?"SYSTÈME EN LIGNE":"MODE HORS LIGNE";render();
})();