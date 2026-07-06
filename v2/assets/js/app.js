/* =======================================
Tahaffuz-E-Iman Library V2
Main JavaScript
======================================= */

document.addEventListener("DOMContentLoaded",()=>{

console.log("Tahaffuz-E-Iman Library V2 Loaded");

initCounters();

initTheme();

});

/* ============================
Animated Counter
============================ */

function initCounters(){

const counters=document.querySelectorAll(".stat-card h2");

counters.forEach(counter=>{

const target=counter.innerText.replace("+","");

let current=0;

const speed=Math.ceil(target/100);

const update=()=>{

current+=speed;

if(current>=target){

counter.innerText=target+"+";

return;

}

counter.innerText=current+"+";

requestAnimationFrame(update);

}

update();

});

}

/* ============================
Theme
============================ */

function initTheme(){

const btn=document.querySelector(".themeBtn");

if(!btn) return;

btn.addEventListener("click",()=>{

document.body.classList.toggle("dark");

});

}

/* ===========================
Latest Questions
=========================== */

loadLatestQuestions();

async function loadLatestQuestions(){

const container=document.getElementById("latestQuestions");

if(!container) return;

try{

const response=await fetch("../database/index.json");

const questions=await response.json();

container.innerHTML="";

questions.slice(0,6).forEach(item=>{

container.innerHTML+=`

<div class="question-card">

<h3>${item.title}</h3>

<p>Category : ${item.category}</p>

<a href="../question.html?id=${item.id}">

View Answer →

</a>

</div>

`;

});

}

catch(error){

container.innerHTML="<h3>Questions could not be loaded.</h3>";

console.log(error);

}

}
