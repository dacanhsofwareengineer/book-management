import { STORAGE_KEY } from '../constants.js';

class StorageService {
  getBooks() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Lỗi khi đọc LocalStorage', error);
      return [];
    }
  }

  saveBooks(books) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (error) {
      console.error('Lỗi khi lưu LocalStorage', error);
    }
  }
}

export const storageService = new StorageService();
