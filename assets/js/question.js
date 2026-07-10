/* =====================================
Tahaffuz-E-Iman Library
Question Engine V1
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadQuestion();

});

/* =====================================
LOAD QUESTION
===================================== */

async function loadQuestion() {

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (!id) {

        showError("Question ID Missing");

        return;

    }

    try {

        const response = await fetch(`database/questions/${id}.json`);

        if (!response.ok) {

            throw new Error("Question JSON Not Found");

        }

        const data = await response.json();

        renderHero(data);

        renderAnswer(data);

        renderBooks(data);
        
        renderGallery(data);

    }

    catch(error){

        console.error(error);

        showError(error.message);

    }

}

/* =====================================
HERO
===================================== */

function renderHero(data){

    setText("questionTitle",data.title);

    setText("questionCategory",data.category);

    setText("questionID",data.id);

    setText("badgeID",data.id);

    setText("badgeCategory",data.category);

    setText("badgeStatus",data.status);

}

/* =====================================
ANSWER
===================================== */

function renderAnswer(data){

    const answer=document.getElementById("questionAnswer");

    if(answer){

        answer.innerHTML=data.answer || "<p>No Answer Found.</p>";

    }

}

/* =====================================
BOOKS
===================================== */

function renderBooks(data){

    const container=document.getElementById("bookReferenceCards");

    if(!container) return;

    container.innerHTML="";

    if(!data.referenceBooks || data.referenceBooks.length===0){

        container.innerHTML="<p>No Book References.</p>";

        return;

    }

    data.referenceBooks.forEach(book=>{

        container.innerHTML+=`

<div class="book-card">

<div class="book-cover">

📖

</div>

<div class="book-info">

<h3>${book.bookName}</h3>

<div class="book-meta">

<div>

<strong>Author</strong><br>

${book.author}

</div>

<div>

<strong>Volume</strong><br>

${book.volume}

</div>

<div>

<strong>Page</strong><br>

${book.page}

</div>

<div>

<strong>Line</strong><br>

${book.line}

</div>

</div>

<div class="book-buttons">

<a href="${book.scan}" target="_blank">

📷 Scan

</a>

<a href="${book.pdf}" target="_blank">

📄 PDF

</a>

</div>

</div>

</div>

`;

    });

}

/* =====================================
HELPERS
===================================== */

function setText(id,text){

    const el=document.getElementById(id);

    if(el){

        el.textContent=text;

    }

}

/* =====================================
ERROR
===================================== */

function showError(message){

    document.body.innerHTML=`

<div style="padding:80px;text-align:center;font-family:Arial">

<h1>⚠️ Question Not Found</h1>

<p>${message}</p>

<p>

Please check Question ID.

</p>

<a href="index.html">

⬅ Back To Homepage

</a>

</div>

`;

}
