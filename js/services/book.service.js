import { storageService } from './storage.service.js';
import { generateId } from '../utils.js';
import { SORT, STATUS } from '../constants.js';

class BookService {
  constructor() {
    this.loadBooks();
  }

  loadBooks() {
    this.books = storageService.getBooks();
  }

  getAll() {
    return this.books;
  }

  getStats() {
    const total = this.books.length;
    const read = this.books.filter(b => b.status === STATUS.READ).length;
    const unread = total - read;
    return { total, read, unread };
  }

  addBook(bookData) {
    const newBook = {
      ...bookData,
      id: generateId(),
      createdAt: Date.now()
    };
    this.books.unshift(newBook);
    this.save();
    return newBook;
  }

  updateBook(id, bookData) {
    const index = this.books.findIndex(b => b.id === id);
    if (index !== -1) {
      this.books[index] = { ...this.books[index], ...bookData };
      this.save();
      return this.books[index];
    }
    return null;
  }

  deleteBook(id) {
    this.books = this.books.filter(b => b.id !== id);
    this.save();
  }

  toggleStatus(id) {
    const book = this.books.find(b => b.id === id);
    if (book) {
      book.status = book.status === STATUS.READ ? STATUS.UNREAD : STATUS.READ;
      this.save();
    }
  }

  save() {
    storageService.saveBooks(this.books);
  }

  getProcessedBooks(searchQuery, filterStatus, sortYear) {
    let result = [...this.books];

    // 1. Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(query) || 
        b.author.toLowerCase().includes(query)
      );
    }

    // 2. Filter
    if (filterStatus !== STATUS.ALL) {
      result = result.filter(b => b.status === filterStatus);
    }

    // 3. Sort by Year
    result.sort((a, b) => {
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      if (sortYear === SORT.NEWEST) {
        return yearB - yearA;
      } else {
        return yearA - yearB;
      }
    });

    return result;
  }
}

export const bookService = new BookService();
