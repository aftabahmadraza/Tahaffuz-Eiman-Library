/* =====================================
Tahaffuz-Eiman Smart Search V1.1 (Optimized)
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  initSearch();
});

async function initSearch() {
  const input = document.getElementById("searchInput");
  const suggestions = document.getElementById("searchSuggestions");
  const button = document.getElementById("searchBtn");

  if (!input || !suggestions) return;

  let questions = [];

  try {
    const response = await fetch("database/index.json");
    if (!response.ok) throw new Error("Search Index Not Found");
    questions = await response.json();
  } catch (e) {
    console.error("Search Index Error", e);
    return;
  }

  input.addEventListener("input", () => {
    const keyword = input.value.trim().toLowerCase();
    suggestions.innerHTML = "";

    if (keyword.length < 2) {
      suggestions.style.display = "none";
      return;
    }

    const result = questions.filter(item =>
      item.id.toLowerCase().includes(keyword) ||
      item.title.toLowerCase().includes(keyword) ||
      (item.category || "").toLowerCase().includes(keyword)
    ).slice(0, 10);

    if (result.length === 0) {
      suggestions.innerHTML = "<div class='suggest-item'>No Result Found</div>";
      suggestions.style.display = "block";
      return;
    }

    const fragment = document.createDocumentFragment();

    result.forEach(item => {
      const div = document.createElement("div");
      div.className = "suggest-item";
      div.innerHTML = `<b>${item.id}</b><br><span>${item.title}</span>`;
      div.onclick = () => location.href = `question.html?id=${item.id}`;
      fragment.appendChild(div);
    });

    suggestions.appendChild(fragment);
    suggestions.style.display = "block";
  });

  button.addEventListener("click", () => {
    const keyword = input.value.trim().toLowerCase();
    const result = questions.find(item =>
      item.id.toLowerCase() === keyword ||
      item.title.toLowerCase() === keyword
    );
    if (result) location.href = `question.html?id=${result.id}`;
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".hero-search")) {
      suggestions.style.display = "none";
    }
  });
}
