export class Pagination {
  constructor(items, containerId, onPageChange) {
    this.items = items;
    this.container = document.getElementById(containerId);
    this.onPageChange = onPageChange;
    this.currentPage = 1;
    this.itemsPerPage = this.getItemsPerPage();

    // Listen for resize to update items per page
    window.addEventListener('resize', () => {
      const newItemsPerPage = this.getItemsPerPage();
      if (this.itemsPerPage !== newItemsPerPage) {
        this.itemsPerPage = newItemsPerPage;
        this.currentPage = 1; // Reset to first page
        this.render();
        this.onPageChange(this.getCurrentPageItems());
      }
    });

    // Initial render when pagination is created
    this.render();
    this.onPageChange(this.getCurrentPageItems());
  }

  getItemsPerPage() {
    const width = window.innerWidth || document.documentElement.clientWidth;
    if (width >= 1440) return 6; // Desktop
    if (width >= 768) return 4; // Tablet
    return 2; // Mobile
  }

  updateItems(newItems) {
    this.items = newItems;
    this.currentPage = 1;
    this.render();
    this.onPageChange(this.getCurrentPageItems());
  }

  getCurrentPageItems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.items.slice(start, end);
  }

  getTotalPages() {
    return Math.ceil(this.items.length / this.itemsPerPage) || 1;
  }

  goToPage(page) {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.render();
      this.onPageChange(this.getCurrentPageItems());
    }
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    const totalPages = this.getTotalPages();

    if (totalPages <= 1) return; // Hide pagination if only 1 page

    // Prev button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn--icon';
    prevBtn.innerHTML = '&lt;';
    prevBtn.disabled = this.currentPage === 1;
    prevBtn.onclick = () => this.goToPage(this.currentPage - 1);
    this.container.appendChild(prevBtn);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `btn btn--icon ${i === this.currentPage ? 'active' : ''}`;
      pageBtn.textContent = i;
      pageBtn.onclick = () => this.goToPage(i);
      this.container.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn--icon';
    nextBtn.innerHTML = '&gt;';
    nextBtn.disabled = this.currentPage === totalPages;
    nextBtn.onclick = () => this.goToPage(this.currentPage + 1);
    this.container.appendChild(nextBtn);
  }
}
