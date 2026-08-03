import { DEFAULT_COVER, STATUS } from '../constants.js';
import { escapeHTML } from '../utils.js';

export class Render {
  static dashboard(stats) {
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-read').textContent = stats.read;
    document.getElementById('stat-unread').textContent = stats.unread;
  }

  static bookCard(book) {
    const coverUrl = book.cover || DEFAULT_COVER;
    const statusClass = book.status === STATUS.READ ? 'badge--read' : 'badge--unread';
    const statusText = book.status === STATUS.READ ? 'Đã đọc' : 'Chưa đọc';
    const actionText = book.status === STATUS.READ ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc';

    return `
        <article class="book-card" data-id="${book.id}">
            <img src="${escapeHTML(coverUrl)}" alt="Bìa sách ${escapeHTML(book.title)}" class="book-card__cover" onerror="this.src='${DEFAULT_COVER}'">
            <div class="menu-dropdown">
                <button class="menu-dropdown__btn" aria-label="Tùy chọn">⋮</button>
                <div class="menu-dropdown__content">
                    <button class="menu-dropdown__item action-toggle">${actionText}</button>
                    <button class="menu-dropdown__item action-edit">Chỉnh sửa</button>
                    <button class="menu-dropdown__item menu-dropdown__item--danger action-delete">Xóa</button>
                </div>
            </div>
            <div class="book-card__content">
                <h3 class="book-card__title" title="${escapeHTML(book.title)}">${escapeHTML(book.title)}</h3>
                <p class="book-card__author" title="${escapeHTML(book.author)}">${escapeHTML(book.author)}</p>
                <p class="book-card__year">${escapeHTML(book.year)}</p>
                <div class="book-card__footer">
                    <span class="badge ${statusClass}">${statusText}</span>
                </div>
            </div>
        </article>
    `;
  }

  static myBooks(books) {
    const container = document.getElementById('my-books-grid');
    if (!container) return;
    
    if (books.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">Không tìm thấy sách nào.</p>';
      return;
    }
    
    container.innerHTML = books.map(book => this.bookCard(book)).join('');
  }

  static recommendedBookCard(book) {
    const coverUrl = book.cover || DEFAULT_COVER;
    return `
        <article class="book-card">
            <img src="${escapeHTML(coverUrl)}" alt="Bìa sách ${escapeHTML(book.title)}" class="book-card__cover" onerror="this.src='${DEFAULT_COVER}'">
            <div class="book-card__content">
                <h3 class="book-card__title" title="${escapeHTML(book.title)}">${escapeHTML(book.title)}</h3>
                <p class="book-card__author" title="${escapeHTML(book.author)}">${escapeHTML(book.author)}</p>
                <p class="book-card__year">${escapeHTML(book.year)}</p>
            </div>
        </article>
    `;
  }

  static recommendations(books, append = false) {
    const container = document.getElementById('recommendations-grid');
    if (!container) return;

    const html = books.map(book => this.recommendedBookCard(book)).join('');
    
    if (append) {
      container.insertAdjacentHTML('beforeend', html);
    } else {
      container.innerHTML = html;
    }
  }
}
