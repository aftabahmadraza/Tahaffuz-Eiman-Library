document.addEventListener("DOMContentLoaded", loadLatestQuestions);

async function loadLatestQuestions() {

    const container = document.getElementById("latestQuestions");

    if (!container) return;

    try {

        const response = await fetch("database/index.json");
        const questions = await response.json();

        container.innerHTML = "";

        questions.forEach(item => {

            container.innerHTML += `

            <div class="question-card">

                <h3>${item.title}</h3>

                <p>Category : ${item.category}</p>

                <a href="question.html?id=${item.id}">
                    View Answer →
                </a>

            </div>

            `;

        });

    }

    catch(error){

        container.innerHTML="<p>Questions could not be loaded.</p>";

        console.log(error);

    }

}
document.getElementById("questionCount").innerHTML="125000+";

document.getElementById("pdfCount").innerHTML="18400+";

document.getElementById("videoCount").innerHTML="12800+";

document.getElementById("audioCount").innerHTML="6400+";
