export class Validator {
  constructor(formId) {
    this.form = document.getElementById(formId);
  }

  validate() {
    let isValid = true;
    const title = this.form.querySelector('#book-title');
    const author = this.form.querySelector('#book-author');
    const year = this.form.querySelector('#book-year');
    const status = this.form.querySelector('#book-status');

    if (!title.value.trim()) {
      this.showError('title', 'Vui lòng nhập tên sách');
      isValid = false;
    } else {
      this.clearError('title');
    }

    if (!author.value.trim()) {
      this.showError('author', 'Vui lòng nhập tác giả');
      isValid = false;
    } else {
      this.clearError('author');
    }

    if (!year.value.trim() || isNaN(year.value)) {
      this.showError('year', 'Vui lòng nhập năm xuất bản hợp lệ');
      isValid = false;
    } else {
      this.clearError('year');
    }

    if (!status.value) {
      this.showError('status', 'Vui lòng chọn trạng thái');
      isValid = false;
    } else {
      this.clearError('status');
    }

    return isValid;
  }

  showError(field, message) {
    const errorElement = this.form.querySelector(`#error-${field}`);
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  clearError(field) {
    const errorElement = this.form.querySelector(`#error-${field}`);
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  clearAllErrors() {
    const errorElements = this.form.querySelectorAll('.form__error');
    errorElements.forEach(el => el.textContent = '');
  }
}
