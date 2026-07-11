/* =====================================
Tahaffuz-E-Iman Library
Latest Questions Module V2.0 - FIXED
Dynamic Question Loading & Display
===================================== */

console.log("🆕 Latest Questions Module Loaded");

/* State Management */
const LatestQuestionsState = {
  allQuestions: [],
  displayedQuestions: [],
  totalQuestions: 0,
  itemsPerPage: 6,
  currentPage: 1
};

/* =====================================
LOAD LATEST QUESTIONS ON PAGE LOAD
===================================== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("📖 Starting to load latest questions...");
  loadLatestQuestions();
  initializePagination();
});

/* =====================================
MAIN FUNCTION - LOAD LATEST QUESTIONS
===================================== */
async function loadLatestQuestions() {
  const container = document.getElementById("latestQuestions");
  if (!container) {
    console.warn("⚠️ latestQuestions container not found");
    return;
  }

  try {
    // Show loading state
    container.innerHTML = `
      <div style="grid-column: 1/-1; padding: 40px; text-align: center; color: #999;">
        <p style="font-size: 18px; margin: 0;">⏳ Loading latest questions...</p>
      </div>
    `;

    console.log("📡 Fetching database/index.json...");
    
    // Fetch questions
    const response = await fetch("database/index.json");
    console.log("📊 Response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Data loaded successfully:", data.length, "questions");
    
    // Store data
    LatestQuestionsState.allQuestions = data;
    LatestQuestionsState.totalQuestions = data.length;

    if (data.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; padding: 40px; text-align: center; color: #999;">
          <p style="font-size: 18px; margin: 0;">📚 No questions available</p>
        </div>
      `;
      return;
    }

    // Sort by ID to show latest (reverse order)
    const sorted = [...data].reverse();

    // Display first batch
    displayQuestions(sorted.slice(0, LatestQuestionsState.itemsPerPage));

    // Track event
    if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
      window.TahaffuzUtils.Analytics.track("latest_questions_loaded", {
        total_questions: data.length
      });
    }

  } catch (error) {
    console.error("❌ Error loading latest questions:", error);
    console.error("Error details:", error.message);
    
    const container = document.getElementById("latestQuestions");
    if (container) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; padding: 40px; text-align: center; color: #f44336;">
          <p style="font-size: 18px; margin: 0; font-weight: 600;">❌ Failed to load latest questions</p>
          <p style="font-size: 14px; margin: 10px 0 0; color: #999;">Error: ${error.message}</p>
          <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
            🔄 Retry Loading
          </button>
        </div>
      `;
    }
  }
}

/* =====================================
DISPLAY QUESTIONS FUNCTION
===================================== */
function displayQuestions(questions) {
  const container = document.getElementById("latestQuestions");
  if (!container) return;

  console.log("🎨 Displaying", questions.length, "questions");

  // Clear container
  container.innerHTML = "";

  // Handle no questions
  if (questions.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; padding: 40px; text-align: center; color: #999;">
        <p style="font-size: 18px; margin: 0;">📚 No questions available</p>
      </div>
    `;
    return;
  }

  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();

  questions.forEach((question, index) => {
    const card = document.createElement("div");
    card.className = "question-card";
    
    // Add animation delay
    card.style.animation = `fadeIn 0.5s ease-out ${index * 0.05}s backwards`;

    // Get category color
    const categoryColor = getCategoryColor(question.category);

    const description = question.description || "Authentic answer with references";
    const title = question.title || "Untitled Question";

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
        <div class="question-id">${question.id}</div>
        <span style="background: ${categoryColor}; color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">
          ${question.category}
        </span>
      </div>
      <h3 style="margin: 0 0 12px; line-height: 1.4; color: #1f2937;">${escapeHtml(title)}</h3>
      <p style="margin: 0 0 15px; color: #666; font-size: 14px; min-height: 40px;">
        ${escapeHtml(description)}
      </p>
      <div style="display: flex; gap: 10px; align-items: center;">
        <a href="question.html?id=${question.id}" class="view-btn" style="flex: 1; text-align: center;">
          View Answer →
        </a>
        <button class="bookmark-btn" onclick="toggleBookmark('${question.id}')" 
                style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #0f7b4d; background: white; color: #0f7b4d; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s;"
                title="Save this question">
          🔖
        </button>
      </div>
    `;

    fragment.appendChild(card);
  });

  container.appendChild(fragment);

  // Add animation keyframes if not exists
  if (!document.querySelector("style[data-animation='fadeIn']")) {
    const style = document.createElement("style");
    style.setAttribute("data-animation", "fadeIn");
    style.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  console.log("✅ Questions displayed successfully");
}

/* =====================================
GET CATEGORY COLOR
===================================== */
function getCategoryColor(category) {
  const colors = {
    "Aqeedah": "#0f7b4d",
    "Fiqh": "#2563eb",
    "Tasawwuf": "#d946ef",
    "Bidah": "#dc2626",
    "Quran": "#059669",
    "Hadith": "#7c3aed",
    "History": "#ea580c"
  };
  return colors[category] || "#0f7b4d";
}

/* =====================================
PAGINATION
===================================== */
function initializePagination() {
  // This can be extended for paginated loading
  // Currently loads first 6 items
}

function loadMoreQuestions() {
  const container = document.getElementById("latestQuestions");
  if (!container) return;

  const startIndex = LatestQuestionsState.currentPage * LatestQuestionsState.itemsPerPage;
  const endIndex = startIndex + LatestQuestionsState.itemsPerPage;
  
  const moreQuestions = LatestQuestionsState.allQuestions.slice(startIndex, endIndex);

  if (moreQuestions.length === 0) {
    console.log("No more questions to load");
    return;
  }

  displayQuestions(moreQuestions);
  LatestQuestionsState.currentPage++;

  // Track event
  if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
    window.TahaffuzUtils.Analytics.track("more_questions_loaded", {
      page: LatestQuestionsState.currentPage
    });
  }
}

/* =====================================
BOOKMARK FUNCTIONALITY
===================================== */
function toggleBookmark(questionId) {
  const bookmarks = getBookmarks();
  const index = bookmarks.indexOf(questionId);

  if (index > -1) {
    // Remove bookmark
    bookmarks.splice(index, 1);
    console.log(`🔖 Bookmark removed: ${questionId}`);
  } else {
    // Add bookmark
    bookmarks.push(questionId);
    console.log(`🔖 Bookmark added: ${questionId}`);
  }

  // Save to localStorage
  if (window.TahaffuzUtils && window.TahaffuzUtils.Storage) {
    window.TahaffuzUtils.Storage.set("tahaffuz_bookmarks", bookmarks);
  }

  // Update UI
  updateBookmarkButton(questionId);

  // Show notification
  if (window.TahaffuzUtils && window.TahaffuzUtils.showNotification) {
    const isBookmarked = index === -1;
    window.TahaffuzUtils.showNotification(
      isBookmarked ? "Question bookmarked!" : "Bookmark removed",
      "success"
    );
  }

  // Track event
  if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
    window.TahaffuzUtils.Analytics.track("question_bookmarked", {
      question_id: questionId,
      action: index === -1 ? "added" : "removed"
    });
  }
}

function getBookmarks() {
  if (window.TahaffuzUtils && window.TahaffuzUtils.Storage) {
    return window.TahaffuzUtils.Storage.get("tahaffuz_bookmarks") || [];
  }
  return [];
}

function updateBookmarkButton(questionId) {
  const bookmarks = getBookmarks();
  const button = document.querySelector(`button[onclick="toggleBookmark('${questionId}')"]`);
  
  if (button) {
    if (bookmarks.includes(questionId)) {
      button.style.background = "#0f7b4d";
      button.style.color = "white";
    } else {
      button.style.background = "white";
      button.style.color = "#0f7b4d";
    }
  }
}

/* =====================================
FILTER BY CATEGORY
===================================== */
function filterByCategory(category) {
  const filtered = category
    ? LatestQuestionsState.allQuestions.filter(q => q.category === category)
    : LatestQuestionsState.allQuestions;

  displayQuestions(filtered.slice(0, LatestQuestionsState.itemsPerPage));

  // Track event
  if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
    window.TahaffuzUtils.Analytics.track("questions_filtered", {
      category: category || "all"
    });
  }
}

/* =====================================
SEARCH IN LATEST QUESTIONS
===================================== */
function searchLatestQuestions(query) {
  const lowerQuery = query.toLowerCase();
  const filtered = LatestQuestionsState.allQuestions.filter(q =>
    q.id.toLowerCase().includes(lowerQuery) ||
    q.title.toLowerCase().includes(lowerQuery)
  );

  displayQuestions(filtered.slice(0, LatestQuestionsState.itemsPerPage));

  // Track event
  if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
    window.TahaffuzUtils.Analytics.track("questions_searched", {
      query: query,
      results: filtered.length
    });
  }
}

/* =====================================
SORT QUESTIONS
===================================== */
function sortQuestions(sortBy) {
  let sorted = [...LatestQuestionsState.allQuestions];

  switch (sortBy) {
    case "newest":
      sorted.sort((a, b) => b.id.localeCompare(a.id));
      break;
    case "oldest":
      sorted.sort((a, b) => a.id.localeCompare(b.id));
      break;
    case "a-z":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "z-a":
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
    default:
      break;
  }

  displayQuestions(sorted.slice(0, LatestQuestionsState.itemsPerPage));

  // Track event
  if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
    window.TahaffuzUtils.Analytics.track("questions_sorted", {
      sort_by: sortBy
    });
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
SHARE QUESTION
===================================== */
function shareQuestion(questionId, title) {
  const url = `${window.location.origin}/Tahaffuz-E-Iman-Library/question.html?id=${questionId}`;
  const text = `Check out this question: ${title}`;

  if (navigator.share) {
    navigator.share({
      title: "Tahaffuz-E-Iman",
      text: text,
      url: url
    }).catch(err => console.error("Share failed:", err));
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      if (window.TahaffuzUtils && window.TahaffuzUtils.showNotification) {
        window.TahaffuzUtils.showNotification("Link copied to clipboard!", "success");
      }
    });
  }

  // Track event
  if (window.TahaffuzUtils && window.TahaffuzUtils.Analytics) {
    window.TahaffuzUtils.Analytics.track("question_shared", {
      question_id: questionId
    });
  }
}

/* =====================================
EXPORT FUNCTIONS GLOBALLY
===================================== */
window.toggleBookmark = toggleBookmark;
window.filterByCategory = filterByCategory;
window.searchLatestQuestions = searchLatestQuestions;
window.sortQuestions = sortQuestions;
window.shareQuestion = shareQuestion;
window.loadMoreQuestions = loadMoreQuestions;

console.log("✅ Latest Questions Module - All functions initialized");
