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
document.addEventListener("DOMContentLoaded", () => {
    loadLatestQuestions();
});

async function loadLatestQuestions() {

    const container = document.getElementById("latestQuestions");

    if (!container) return;

    try {

        const response = await fetch("../../database/index.json");
        const data = await response.json();

        container.innerHTML = "";

        data.slice(0,6).forEach(item => {

            container.innerHTML += `
            <div class="question-card">

                <div class="question-id">
                    ${item.id}
                </div>

                <h3>${item.title}</h3>

                <div class="question-category">
                    ${item.category}
                </div>

                <a href="question.html?id=${item.id}" class="view-btn">
                    View Answer →
                </a>

            </div>
            `;

        });

    }

    catch (error) {

        console.error(error);

        container.innerHTML = "<h3>Questions could not be loaded.</h3>";

    }

}

