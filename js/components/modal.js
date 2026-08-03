export class Modal {
  constructor(modalId, overlayId, onSave) {
    this.modal = document.getElementById(modalId);
    this.overlay = document.getElementById(overlayId);
    this.onSave = onSave;
    
    this.form = this.modal.querySelector('form');
    this.title = this.modal.querySelector('.modal__title');
    
    // Form inputs
    this.inputId = document.getElementById('book-id');
    this.inputTitle = document.getElementById('book-title');
    this.inputAuthor = document.getElementById('book-author');
    this.inputYear = document.getElementById('book-year');
    this.inputCover = document.getElementById('book-cover');
    this.inputDesc = document.getElementById('book-desc');
    this.inputStatus = document.getElementById('book-status');
    this.submitBtn = this.modal.querySelector('button[type="submit"]');

    this.bindEvents();
  }

  bindEvents() {
    this.overlay.addEventListener('click', () => this.close());
    
    // Handle cancel button if exists
    const btnCancel = this.modal.querySelector('#btn-cancel-modal, #btn-cancel-delete');
    if (btnCancel) {
      btnCancel.addEventListener('click', () => this.close());
    }

    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.onSave(this.getFormData());
      });
    }
  }

  open(book = null) {
    if (book) {
      // Edit mode
      if (this.title) this.title.textContent = 'Chỉnh sửa sách';
      if (this.submitBtn) this.submitBtn.textContent = 'Lưu';
      if (this.inputId) this.inputId.value = book.id;
      if (this.inputTitle) this.inputTitle.value = book.title;
      if (this.inputAuthor) this.inputAuthor.value = book.author;
      if (this.inputYear) this.inputYear.value = book.year;
      if (this.inputCover) this.inputCover.value = book.cover || '';
      if (this.inputDesc) this.inputDesc.value = book.description || '';
      if (this.inputStatus) this.inputStatus.value = book.status;
    } else {
      // Add mode
      if (this.form) {
        if (this.title) this.title.textContent = 'Thêm sách';
        if (this.submitBtn) this.submitBtn.textContent = '+ Thêm sách';
        this.form.reset();
        if (this.inputId) this.inputId.value = '';
      }
    }
    
    this.modal.classList.add('is-active');
  }

  close() {
    this.modal.classList.remove('is-active');
    if (this.form) {
      this.form.reset();
      // Clear errors (if any)
      const errors = this.form.querySelectorAll('.form__error');
      errors.forEach(el => el.textContent = '');
    }
  }

  getFormData() {
    return {
      id: this.inputId.value,
      title: this.inputTitle.value,
      author: this.inputAuthor.value,
      year: this.inputYear.value,
      cover: this.inputCover.value,
      description: this.inputDesc.value,
      status: this.inputStatus.value
    };
  }
}
