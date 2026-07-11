// assets/js/question.js - NEEDS TO BE CREATED

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const questionId = params.get("id") || "AQ000001";
  
  try {
    // Fetch question data
    const response = await fetch(`database/questions/${questionId}.json`);
    const [questionData] = await response.json();
    
    // Populate question hero
    document.getElementById("badgeID").textContent = questionData.id;
    document.getElementById("badgeCategory").textContent = questionData.category;
    document.getElementById("questionTitle").textContent = questionData.title;
    document.getElementById("questionCategory").textContent = questionData.category;
    
    // Populate answer
    document.getElementById("questionAnswer").innerHTML = questionData.answer;
    
    // Load book references
    if (questionData.references?.length) {
      loadBookReferences(questionData.references);
    }
    
    // Load evidence gallery
    if (questionData.evidence?.length) {
      loadEvidenceGallery(questionData.evidence);
    }
    
    // Load related questions
    if (questionData.related?.length) {
      loadRelatedQuestions(questionData.related);
    }
  } catch (error) {
    console.error("Question load error:", error);
    document.getElementById("questionTitle").textContent = "❌ Question Not Found";
  }
});

async function loadBookReferences(references) {
  const container = document.getElementById("bookReferenceCards");
  container.innerHTML = "";
  
  references.forEach(ref => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <div>
        <h4>${ref.book}</h4>
        <p>Author: ${ref.author}</p>
        <p>Page: ${ref.page}, Line: ${ref.line}</p>
        <div style="display:flex; gap:10px; margin-top:10px;">
          ${ref.scan ? `<a href="${ref.scan}" target="_blank" class="view-btn" style="padding:8px 14px;">📸 Scan</a>` : ''}
          ${ref.pdf ? `<a href="${ref.pdf}" target="_blank" class="view-btn" style="padding:8px 14px;">📄 PDF</a>` : ''}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

async function loadEvidenceGallery(evidence) {
  const container = document.getElementById("evidenceGallery");
  container.innerHTML = "";
  
  evidence.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "gallery-card";
    
    if (item.type.includes("scan") || item.type === "highlight") {
      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" onclick="openEvidenceViewer('${item.image}', '${item.title}')">
      `;
    } else if (item.type === "pdf") {
      card.innerHTML = `<div style="padding:20px; text-align:center;">📄 ${item.title}<br><a href="${item.file}" target="_blank">Open PDF</a></div>`;
    }
    container.appendChild(card);
  });
}

async function loadRelatedQuestions(relatedIds) {
  const container = document.getElementById("relatedQuestions");
  container.innerHTML = "";
  
  try {
    const indexResponse = await fetch("database/index.json");
    const allQuestions = await indexResponse.json();
    
    relatedIds.forEach(id => {
      const q = allQuestions.find(x => x.id === id);
      if (q) {
        container.innerHTML += `
          <a href="question.html?id=${q.id}" class="related-card">
            <h3>${q.title}</h3>
            <span>${q.id} • ${q.category}</span>
          </a>
        `;
      }
    });
  } catch (error) {
    console.error("Related questions load error:", error);
  }
}

function openEvidenceViewer(src, title) {
  const modal = document.getElementById("evidenceModal");
  document.getElementById("viewerImage").src = src;
  document.getElementById("viewerTitle").textContent = title;
  modal.style.display = "flex";
}

document.getElementById("closeViewer")?.addEventListener("click", () => {
  document.getElementById("evidenceModal").style.display = "none";
});
