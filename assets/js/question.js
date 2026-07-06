document.addEventListener("DOMContentLoaded", loadQuestion);

async function loadQuestion() {

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (!id) {

        document.getElementById("questionTitle").innerHTML = "Question Not Found";

        document.getElementById("answerBox").innerHTML = "";

        return;

    }

    try {

        const response = await fetch("database/questions/" + id + ".json");

        const data = await response.json();

        document.title = data.title;

        document.getElementById("questionTitle").innerHTML = data.title;

        document.getElementById("answerBox").innerHTML = `

            <h2>Question</h2>

            <p>${data.question}</p>

            <br>

            <button id="showAnswer">

                Reveal Answer

            </button>

            <div id="answerArea" style="display:none;margin-top:25px;">

                <h2>Answer</h2>

                <p>${data.answer}</p>

            </div>

        `;

        document.getElementById("showAnswer").onclick=function(){

            document.getElementById("answerArea").style.display="block";

            this.style.display="none";

        }

    }

    catch(error){

        document.getElementById("questionTitle").innerHTML="Question Not Found";

        document.getElementById("answerBox").innerHTML="Invalid Question ID";

        console.log(error);

    }

}
