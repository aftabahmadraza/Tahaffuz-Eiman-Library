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

<!-- ==========================================
ANSWER SECTION
========================================== -->

<section class="answer-section" id="answerSection">

<div class="container">

<div class="section-card">

<div class="section-title">

📝 Detailed Answer

</div>

<div id="questionAnswer" class="answer-content">

<p>

Loading answer...

</p>

</div>

</div>

</div>

</section>


/* =====================================
BOOKS
===================================== */

function renderBooks(data){

    const container=document.getElementById("bookReferenceCards");

    if(!container) return;

    container.innerHTML="";

    if(!data.referenceBooks || data.referenceBooks.length===0){

        container.innerHTML="<p>No Book Reference Found.</p>";

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

<b>Author</b>

<br>

${book.author}

</div>

<div>

<b>Volume</b>

<br>

${book.volume}

</div>

<div>

<b>Page</b>

<br>

${book.page}

</div>

<div>

<b>Line</b>

<br>

${book.line}

</div>

</div>

<div class="book-buttons">

<button
class="view-scan"
data-image="${book.scan}"
data-title="${book.bookName}"
>

📷 View Scan

</button>

<a href="${book.pdf}" target="_blank">

📄 Open PDF

</a>

<button class="copy-reference"

data-reference="${book.bookName}, Vol. ${book.volume}, Page ${book.page}, Line ${book.line}">

📋 Copy Citation

</button>

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
GALLERY
===================================== */

function renderGallery(data){

    const container=document.getElementById("evidenceGallery");

    if(!container) return;

    container.innerHTML="";

    if(!data.evidence || data.evidence.length===0){

        container.innerHTML="<p>No Evidence Available.</p>";

        return;

    }

    data.evidence.forEach(item=>{

        if(item.type==="book_scan" || item.type==="highlight" || item.type==="image"){

            container.innerHTML+=`

<div class="gallery-card">

<img src="${item.file}" alt="${item.title}">

<div class="gallery-info">

<h4>${item.title}</h4>

<span>${item.type}</span>

</div>

</div>

`;

        }

    });

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

document.addEventListener("click",(e)=>{

if(e.target.classList.contains("copy-reference")){

navigator.clipboard.writeText(

e.target.dataset.reference

);

alert("Citation Copied");

}

});

/* =====================================
EVIDENCE VIEWER
===================================== */

let zoomLevel = 1;

document.addEventListener("click", function(e){

    if(e.target.classList.contains("view-scan")){

        e.preventDefault();

        document.getElementById("evidenceModal").style.display="flex";

        document.getElementById("viewerImage").src=e.target.dataset.image;

        document.getElementById("viewerTitle").innerText=e.target.dataset.title;

        zoomLevel=1;

        document.getElementById("viewerImage").style.transform="scale(1)";

    }

});

document.getElementById("closeViewer").onclick=function(){

document.getElementById("evidenceModal").style.display="none";

};

document.getElementById("zoomIn").onclick=function(){

zoomLevel+=0.2;

document.getElementById("viewerImage").style.transform=`scale(${zoomLevel})`;

};

document.getElementById("zoomOut").onclick=function(){

if(zoomLevel>0.4){

zoomLevel-=0.2;

}

document.getElementById("viewerImage").style.transform=`scale(${zoomLevel})`;

};

document.getElementById("fullScreen").onclick=function(){

document.getElementById("viewerImage").requestFullscreen();

};
