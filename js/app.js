import { bookService } from './services/book.service.js';
import { apiService } from './services/api.service.js';
import { Render } from './components/render.js';
import { Pagination } from './components/pagination.js';
import { Modal } from './components/modal.js';
import { Validator } from './components/validator.js';
import { debounce } from './utils.js';
import { STATUS, SORT } from './constants.js';

class App {
  constructor() {
    this.pagination = null;
    this.bookModal = null;
    this.deleteModal = null;
    this.validator = new Validator('book-form');
    this.deleteBookId = null;
    
    // Recommendations state
    this.recPage = 1;
    this.isFetchingRecs = false;

    this.init();
  }

  init() {
    bookService.loadBooks();
    this.initModals();
    this.bindEvents();
    this.updateDashboard();
    this.updateBookList();
    this.loadRecommendations();
  }

  initModals() {
    this.bookModal = new Modal('book-modal', 'modal-overlay', (formData) => {
      if (this.validator.validate()) {
        if (formData.id) {
          bookService.updateBook(formData.id, formData);
        } else {
          bookService.addBook(formData);
        }
        this.bookModal.close();
        this.refreshUI();
      }
    });

    this.deleteModal = new Modal('confirm-modal', 'confirm-overlay');
    document.getElementById('btn-confirm-delete').addEventListener('click', this.handleDelete.bind(this));
  }

  handleDelete() {
    if (this.deleteBookId) {
      bookService.deleteBook(this.deleteBookId);
      this.deleteBookId = null;
      this.deleteModal.close();
      this.refreshUI();
    }
  }

  bindEvents() {
    // Toolbar - Add book
    document.getElementById('btn-add-book').addEventListener('click', () => {
      this.validator.clearAllErrors();
      this.bookModal.open();
    });

    // Toolbar - Search
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', debounce(() => {
      this.updateBookList();
    }, 300));

    // Toolbar - Filter
    document.getElementById('filter-status').addEventListener('change', () => {
      this.updateBookList();
    });

    // Toolbar - Sort
    document.getElementById('sort-year').addEventListener('change', () => {
      this.updateBookList();
    });

    // Book list delegation (Menu actions)
    document.getElementById('my-books-grid').addEventListener('click', (e) => {
      const btn = e.target.closest('.menu-dropdown__btn');
      if (btn) {
        // Close other open menus
        document.querySelectorAll('.menu-dropdown__content.is-active').forEach(menu => {
          if (menu !== btn.nextElementSibling) {
            menu.classList.remove('is-active');
          }
        });
        const content = btn.nextElementSibling;
        content.classList.toggle('is-active');
        return;
      }

      const card = e.target.closest('.book-card');
      if (!card) return;
      const bookId = card.dataset.id;

      if (e.target.closest('.action-toggle')) {
        bookService.toggleStatus(bookId);
        this.refreshUI();
      } else if (e.target.closest('.action-edit')) {
        const book = bookService.getAll().find(b => b.id === bookId);
        if (book) {
          this.validator.clearAllErrors();
          this.bookModal.open(book);
        }
      } else if (e.target.closest('.action-delete')) {
        this.deleteBookId = bookId;
        this.deleteModal.open();
      }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.menu-dropdown')) {
        document.querySelectorAll('.menu-dropdown__content').forEach(menu => {
          menu.classList.remove('is-active');
        });
      }
    });

    // Recommendations load more
    // We'll create a load more button dynamically
    const recSection = document.querySelector('.recommendations');
    const loadMoreContainer = document.createElement('div');
    loadMoreContainer.className = 'load-more-container';
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.className = 'btn btn--secondary';
    loadMoreBtn.textContent = 'Tải thêm sách đề xuất';
    loadMoreBtn.id = 'btn-load-more';
    loadMoreBtn.addEventListener('click', () => this.loadRecommendations(true));
    loadMoreContainer.appendChild(loadMoreBtn);
    recSection.appendChild(loadMoreContainer);
  }

  refreshUI() {
    this.updateDashboard();
    this.updateBookList();
  }

  updateDashboard() {
    const stats = bookService.getStats();
    Render.dashboard(stats);
  }

  updateBookList() {
    const searchQuery = document.getElementById('search-input').value;
    const filterStatus = document.getElementById('filter-status').value;
    const sortYear = document.getElementById('sort-year').value;

    const processedBooks = bookService.getProcessedBooks(searchQuery, filterStatus, sortYear);

    if (!this.pagination) {
      this.pagination = new Pagination(processedBooks, 'pagination', (itemsToRender) => {
        Render.myBooks(itemsToRender);
      });
    } else {
      this.pagination.updateItems(processedBooks);
    }
  }

  async loadRecommendations(append = false) {
    if (this.isFetchingRecs) return;
    this.isFetchingRecs = true;

    const loadMoreBtn = document.getElementById('btn-load-more');
    const container = document.getElementById('recommendations-grid');
    
    if (loadMoreBtn) {
      loadMoreBtn.textContent = 'Đang tải...';
      loadMoreBtn.disabled = true;
    }

    if (!append && container) {
      container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Đang tải dữ liệu từ Open Library...</p>';
    }

    try {
      const books = await apiService.getRecommendations(this.recPage, 6);
      
      // Remove loading message if not appending
      if (!append && container && container.querySelector('p')) {
        container.innerHTML = '';
      }

      if (books.length > 0) {
        Render.recommendations(books, append);
        this.recPage++;
      } else if (!append && container) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Không tìm thấy sách đề xuất.</p>';
      }
    } catch (error) {
      if (container) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: red;">Lỗi khi tải sách đề xuất. Vui lòng thử lại sau.</p>';
      }
    } finally {
      this.isFetchingRecs = false;
      if (loadMoreBtn) {
        loadMoreBtn.textContent = 'Tải thêm sách đề xuất';
        loadMoreBtn.disabled = false;
      }
    }
  }
}

// Khởi tạo app khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
