/* ==========================================
Tahaffuz-Eiman Library
Book Viewer Engine
Version 1.1 (Optimized)
========================================== */

function renderBooks(data) {
  const container = document.getElementById("bookReferenceCards");
  if (!container) return;

  container.innerHTML = "";

  if (!data.references || data.references.length === 0) {
    container.innerHTML = "<p>No References Found.</p>";
    return;
  }

  // Use DocumentFragment for performance
  const fragment = document.createDocumentFragment();

  data.references.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
      <div class="book-cover">📖</div>
      <div class="book-info">
        <h3>${book.book}</h3>
        <p><b>Author :</b> ${book.author}</p>
        <p><b>Publisher :</b> ${book.publisher}</p>
        <p><b>Language :</b> ${book.language}</p>
        <div class="book-meta">
          <span>Volume ${book.volume}</span>
          <span>Page ${book.page}</span>
          <span>Line ${book.line}</span>
        </div>
        <div class="book-buttons">
          <button class="view-scan" data-image="${book.scan}" data-title="${book.book}">📷 View Scan</button>
          <button class="view-highlight" data-image="${book.highlight}" data-title="${book.book}">🟨 Highlight</button>
          <button class="open-pdf" data-file="${book.pdf}">📄 PDF</button>
          <button class="copy-reference" 
            data-reference="${book.book}, Volume ${book.volume}, Page ${book.page}, Line ${book.line}">
            📋 Copy Citation
          </button>
        </div>
      </div>
    `;

    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}
