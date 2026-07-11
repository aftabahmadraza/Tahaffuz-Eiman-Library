/* =====================================
Tahaffuz-E-Iman Library
Question Detail Page Engine V2.0
Complete Implementation with All Features - FIXED
===================================== */

console.log("📖 Question Engine Loaded");

/* =====================================
GLOBAL STATE
===================================== */
let currentQuestion = null;
let allQuestions = [];
let currentQuestionIndex = -1;

/* =====================================
INITIALIZE ON PAGE LOAD
===================================== */
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🕌 Initializing Question Detail Page");
  
  // Get question ID from URL
  const params = new URLSearchParams(window.location.search);
  const questionId = params.get("id") || "AQ000001";
  
  console.log("📍 Loading question:", questionId);
  
  try {
    // Load all questions first for navigation
    const indexResponse = await fetch("database/index.json");
    if (!indexResponse.ok) {
      throw new Error(`Failed to load index.json: ${indexResponse.status}`);
    }
    allQuestions = await indexResponse.json();
    console.log("✅ Index loaded:", allQuestions.length, "questions");
    
    currentQuestionIndex = allQuestions.findIndex(q => q.id === questionId);
    console.log("📌 Question index:", currentQuestionIndex);
    
    if (currentQuestionIndex === -1) {
      throw new Error(`Question ${questionId} not found in index`);
    }
    
    // Get question from index (no need to fetch separately)
    currentQuestion = allQuestions[currentQuestionIndex];
    console.log("✅ Question loaded:", currentQuestion.id, currentQuestion.title);
    
    // Populate all sections
    populateQuestionHero();
    await populateAnswer();
    await populateBookReferences();
    await populateEvidenceGallery();
    await populateRelatedQuestions();
    setupNavigation();
    initializeFloatingActions();
    initializeEvidenceViewer();
    updatePageMeta();
    
    // Track page view
    if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
      window.TahaffuzUtils.Analytics.track("question_viewed", {
        question_id: currentQuestion.id,
        category: currentQuestion.category
      });
    }
    
    console.log("✨ Question page fully loaded");
    
  } catch (error) {
    console.error("❌ Question load error:", error);
    console.error("Error details:", error.message);
    handleError(error);
  }
});

/* =====================================
POPULATE QUESTION HERO SECTION
===================================== */
function populateQuestionHero() {
  if (!currentQuestion) return;

  document.getElementById("badgeID").textContent = currentQuestion.id;
  document.getElementById("badgeCategory").textContent = currentQuestion.category;
  document.getElementById("badgeStatus").textContent = "✔ " + (currentQuestion.status || "Verified");
  document.getElementById("questionTitle").textContent = currentQuestion.title;
  document.getElementById("questionCategory").textContent = currentQuestion.category;
  document.getElementById("questionID").textContent = currentQuestion.id;
  
  console.log(`📝 Question hero populated: ${currentQuestion.id}`);
}

/* =====================================
POPULATE ANSWER SECTION
===================================== */
async function populateAnswer() {
  const container = document.getElementById("questionAnswer");
  
  if (!currentQuestion.answer || currentQuestion.answer.trim() === "") {
    container.innerHTML = `
      <div style="padding: 30px; background: #f0f9f7; border-radius: 12px; color: #666; border-left: 4px solid #0f7b4d;">
        <p style="margin: 0; font-size: 16px;">📝 <strong>Detailed Answer Coming Soon</strong></p>
        <p style="margin: 10px 0 0; font-size: 14px;">This question is being researched and will be answered with authentic sources soon.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = currentQuestion.answer;
  
  // Add click tracking to answer content
  container.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
        window.TahaffuzUtils.Analytics.track("answer_link_clicked", {
          question_id: currentQuestion.id,
          link: e.target.href
        });
      }
    }
  });
}

/* =====================================
POPULATE BOOK REFERENCES
===================================== */
async function populateBookReferences() {
  const container = document.getElementById("bookReferenceCards");
  
  if (!currentQuestion.references || currentQuestion.references.length === 0) {
    container.innerHTML = `
      <div style="padding: 30px; text-align: center; color: #999; grid-column: 1/-1;">
        📚 No book references available yet.
      </div>
    `;
    return;
  }
  
  container.innerHTML = "";
  const fragment = document.createDocumentFragment();
  
  currentQuestion.references.forEach((ref, index) => {
    const card = document.createElement("div");
    card.className = "book-card";
    
    let actions = ``;
    if (ref.scan) {
      actions += `
        <button class="ref-btn" onclick="openEvidenceViewer('${ref.scan}', '${ref.book} - Page ${ref.page} Scan')" title="View book scan">
          📸 Scan
        </button>
      `;
    }
    if (ref.highlight) {
      actions += `
        <button class="ref-btn" onclick="openEvidenceViewer('${ref.highlight}', '${ref.book} - Highlighted Text')" title="View highlighted portion">
          🖍️ Highlight
        </button>
      `;
    }
    if (ref.pdf) {
      actions += `
        <button class="ref-btn" onclick="window.open('${ref.pdf}', '_blank')" title="Download PDF">
          📄 PDF
        </button>
      `;
    }
    
    card.innerHTML = `
      <div style="flex: 1;">
        <h4 style="margin: 0 0 10px; color: #0f7b4d; font-size: 18px; font-weight: 700;">${escapeHtml(ref.book)}</h4>
        <p style="margin: 5px 0; color: #666; font-size: 14px;"><strong>Author:</strong> ${escapeHtml(ref.author)}</p>
        <p style="margin: 5px 0; color: #666; font-size: 14px;"><strong>Publisher:</strong> ${escapeHtml(ref.publisher)}</p>
        <p style="margin: 5px 0; color: #666; font-size: 14px;"><strong>Volume:</strong> ${ref.volume} | <strong>Page:</strong> ${ref.page}</p>
        <p style="margin: 5px 0; color: #666; font-size: 14px;"><strong>Lines:</strong> ${ref.line} | <strong>Edition:</strong> ${ref.edition}</p>
        <p style="margin: 5px 0; color: #999; font-size: 13px;">Language: ${ref.language}</p>
        <div style="display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap;">
          ${actions}
        </div>
      </div>
    `;
    
    // Track book reference clicks
    card.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
          window.TahaffuzUtils.Analytics.track("book_reference_viewed", {
            question_id: currentQuestion.id,
            book: ref.book,
            action: e.target.textContent.trim()
          });
        }
      }
    });
    
    fragment.appendChild(card);
  });
  
  container.appendChild(fragment);
}

/* =====================================
POPULATE EVIDENCE GALLERY
===================================== */
async function populateEvidenceGallery() {
  const container = document.getElementById("evidenceGallery");
  
  if (!currentQuestion.evidence || currentQuestion.evidence.length === 0) {
    container.innerHTML = `
      <div style="padding: 30px; text-align: center; color: #999; grid-column: 1/-1;">
        🖼️ No evidence gallery available yet.
      </div>
    `;
    return;
  }
  
  container.innerHTML = "";
  const fragment = document.createDocumentFragment();
  
  currentQuestion.evidence.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "gallery-card";
    
    if (item.type.includes("scan") || item.type === "highlight" || item.type === "book_scan") {
      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" 
             style="cursor: pointer; width: 100%; height: 220px; object-fit: cover;" 
             onclick="openEvidenceViewer('${item.image}', '${item.title}')"
             loading="lazy">
        <div style="padding: 10px; background: #f9f9f9; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 13px; color: #666;">${escapeHtml(item.title)}</p>
        </div>
      `;
    } else if (item.type === "pdf") {
      card.innerHTML = `
        <div style="padding: 40px 20px; text-align: center; background: linear-gradient(135deg, #f0f9f7, #e8f7f3); border-radius: 18px; cursor: pointer; height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center;" 
             onclick="window.open('${item.file}', '_blank')">
          <div style="font-size: 48px; margin-bottom: 10px;">📄</div>
          <p style="margin: 0; font-weight: 600; color: #0f7b4d; font-size: 14px;">${escapeHtml(item.title)}</p>
          <p style="margin: 5px 0 0; font-size: 12px; color: #999;">Page ${item.page}</p>
        </div>
      `;
    } else if (item.type === "video") {
      card.innerHTML = `
        <div style="padding: 40px 20px; text-align: center; background: linear-gradient(135deg, #fff0f0, #ffe8e8); border-radius: 18px; cursor: pointer; height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center;" 
             onclick="window.open('${item.url}', '_blank')">
          <div style="font-size: 48px; margin-bottom: 10px;">🎥</div>
          <p style="margin: 0; font-weight: 600; color: #d32f2f; font-size: 14px;">${escapeHtml(item.title)}</p>
          <p style="margin: 5px 0 0; font-size: 12px; color: #999;">YouTube Video</p>
        </div>
      `;
    } else if (item.type === "audio") {
      card.innerHTML = `
        <div style="padding: 20px; text-align: center; background: linear-gradient(135deg, #f0f5ff, #e8ecff); border-radius: 18px; height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="font-size: 48px; margin-bottom: 10px;">🎵</div>
          <p style="margin: 0 0 10px; font-weight: 600; color: #1976d2; font-size: 14px;">${escapeHtml(item.title)}</p>
          <audio controls style="width: 100%;">
            <source src="${item.url}" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
        </div>
      `;
    }
    
    // Track evidence views
    card.addEventListener("click", () => {
      if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
        window.TahaffuzUtils.Analytics.track("evidence_viewed", {
          question_id: currentQuestion.id,
          evidence_type: item.type
        });
      }
    });
    
    fragment.appendChild(card);
  });
  
  container.appendChild(fragment);
}

/* =====================================
POPULATE RELATED QUESTIONS
===================================== */
async function populateRelatedQuestions() {
  const container = document.getElementById("relatedQuestions");
  
  if (!currentQuestion.related || currentQuestion.related.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: #999; grid-column: 1/-1;">No related questions.</p>`;
    return;
  }
  
  container.innerHTML = "";
  const fragment = document.createDocumentFragment();
  
  currentQuestion.related.forEach(relatedId => {
    const q = allQuestions.find(x => x.id === relatedId);
    if (q) {
      const link = document.createElement("a");
      link.className = "related-card";
      link.href = `question.html?id=${q.id}`;
      link.innerHTML = `
        <h3 style="margin: 0 0 10px; color: #333; font-size: 16px;">${escapeHtml(q.title)}</h3>
        <span style="color: #0f7b4d; font-weight: 600; font-size: 13px;">${q.id} • ${q.category}</span>
      `;
      
      // Track related question clicks
      link.addEventListener("click", () => {
        if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
          window.TahaffuzUtils.Analytics.track("related_question_clicked", {
            from_question: currentQuestion.id,
            to_question: q.id
          });
        }
      });
      
      fragment.appendChild(link);
    }
  });
  
  if (fragment.childNodes.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: #999; grid-column: 1/-1;">No related questions found.</p>`;
  } else {
    container.appendChild(fragment);
  }
}

/* =====================================
SETUP NAVIGATION (PREVIOUS/NEXT)
===================================== */
function setupNavigation() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  
  if (prevBtn) {
    if (currentQuestionIndex > 0) {
      prevBtn.onclick = () => {
        const prevId = allQuestions[currentQuestionIndex - 1].id;
        window.location.href = `question.html?id=${prevId}`;
      };
    } else {
      prevBtn.disabled = true;
      prevBtn.style.opacity = "0.5";
      prevBtn.style.cursor = "not-allowed";
    }
  }
  
  if (nextBtn) {
    if (currentQuestionIndex < allQuestions.length - 1) {
      nextBtn.onclick = () => {
        const nextId = allQuestions[currentQuestionIndex + 1].id;
        window.location.href = `question.html?id=${nextId}`;
      };
    } else {
      nextBtn.disabled = true;
      nextBtn.style.opacity = "0.5";
      nextBtn.style.cursor = "not-allowed";
    }
  }
}

/* =====================================
EVIDENCE VIEWER MODAL
===================================== */
function openEvidenceViewer(src, title) {
  const modal = document.getElementById("evidenceModal");
  const img = document.getElementById("viewerImage");
  const titleEl = document.getElementById("viewerTitle");
  
  img.src = src;
  titleEl.textContent = title;
  modal.style.display = "flex";
  
  // Reset zoom
  img.style.transform = "scale(1)";
  img.dataset.zoom = 1;
  
  // Prevent body scroll
  document.body.style.overflow = "hidden";
}

function initializeEvidenceViewer() {
  const closeBtn = document.getElementById("closeViewer");
  const modal = document.getElementById("evidenceModal");
  const zoomInBtn = document.getElementById("zoomIn");
  const zoomOutBtn = document.getElementById("zoomOut");
  const fullScreenBtn = document.getElementById("fullScreen");
  const img = document.getElementById("viewerImage");
  
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    });
  }
  
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }
  
  if (zoomInBtn && img) {
    zoomInBtn.addEventListener("click", () => {
      let zoom = parseFloat(img.dataset.zoom) || 1;
      zoom = Math.min(zoom + 0.2, 3);
      img.dataset.zoom = zoom;
      img.style.transform = `scale(${zoom})`;
    });
  }
  
  if (zoomOutBtn && img) {
    zoomOutBtn.addEventListener("click", () => {
      let zoom = parseFloat(img.dataset.zoom) || 1;
      zoom = Math.max(zoom - 0.2, 0.5);
      img.dataset.zoom = zoom;
      img.style.transform = `scale(${zoom})`;
    });
  }
  
  if (fullScreenBtn && img) {
    fullScreenBtn.addEventListener("click", () => {
      if (img.requestFullscreen) {
        img.requestFullscreen().catch(err => console.error("Fullscreen error:", err));
      }
    });
  }
  
  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (modal && modal.style.display === "flex") {
      if (e.key === "Escape") {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      } else if (e.key === "+") {
        zoomInBtn?.click();
      } else if (e.key === "-") {
        zoomOutBtn?.click();
      }
    }
  });
}

/* =====================================
FLOATING ACTION BUTTONS
===================================== */
function initializeFloatingActions() {
  const shareBtn = document.getElementById("share-btn");
  const copyBtn = document.getElementById("copy-btn");
  const printBtn = document.getElementById("print-btn");
  const scrollTopBtn = document.getElementById("scroll-top-btn");
  
  if (shareBtn) {
    shareBtn.addEventListener("click", () => shareQuestion());
  }
  
  if (copyBtn) {
    copyBtn.addEventListener("click", () => copyQuestionLink());
  }
  
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }
  
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      scrollTopBtn.style.display = window.scrollY > 300 ? "flex" : "none";
    });
    
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* =====================================
SHARE QUESTION
===================================== */
function shareQuestion() {
  const url = window.location.href;
  const title = currentQuestion.title;
  
  if (navigator.share) {
    navigator.share({
      title: "Tahaffuz-E-Iman Library",
      text: title,
      url: url
    }).catch(err => console.error("Share failed:", err));
  } else {
    copyQuestionLink();
  }
  
  if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
    window.TahaffuzUtils.Analytics.track("question_shared", {
      question_id: currentQuestion.id
    });
  }
}

/* =====================================
COPY QUESTION LINK
===================================== */
function copyQuestionLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    if (window.TahaffuzUtils && window.TahaffuzUtils.showNotification) {
      window.TahaffuzUtils.showNotification("Link copied to clipboard!", "success");
    }
  }).catch(err => console.error("Copy failed:", err));
}

/* =====================================
UPDATE PAGE META TAGS
===================================== */
function updatePageMeta() {
  if (!currentQuestion) return;

  document.title = `${currentQuestion.title} - Tahaffuz-E-Iman Library`;
  
  // Update meta description
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.content = currentQuestion.description || currentQuestion.title;
  }
  
  // Update OG tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = currentQuestion.title;
  
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.content = currentQuestion.description || currentQuestion.title;
  
  // Update canonical
  const canonical = document.getElementById("canonicalLink");
  if (canonical) canonical.href = window.location.href;
}

/* =====================================
ERROR HANDLING
===================================== */
function handleError(error) {
  const titleEl = document.getElementById("questionTitle");
  const answerEl = document.getElementById("questionAnswer");
  
  if (titleEl) {
    titleEl.textContent = "❌ Question Not Found";
  }
  
  if (answerEl) {
    answerEl.innerHTML = `
      <div style="padding: 30px; background: #ffebee; border-radius: 12px; color: #c62828; border-left: 4px solid #f44336;">
        <p style="margin: 0; font-size: 16px;"><strong>Error Loading Question</strong></p>
        <p style="margin: 10px 0 0; font-size: 14px;">${error.message}</p>
        <a href="index.html" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #f44336; color: white; border-radius: 6px; text-decoration: none; font-weight: 600;">← Back to Home</a>
      </div>
    `;
  }
}

/* =====================================
UTILITY FUNCTION - ESCAPE HTML
===================================== */
function escapeHtml(text) {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/* =====================================
EXPORT FUNCTIONS GLOBALLY
===================================== */
window.openEvidenceViewer = openEvidenceViewer;
window.shareQuestion = shareQuestion;
window.copyQuestionLink = copyQuestionLink;

console.log("✅ Question Engine - All functions initialized");
