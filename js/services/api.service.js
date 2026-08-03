class ApiService {
  constructor() {
    this.baseUrl = 'https://openlibrary.org';
  }

  async getRecommendations(page = 1, limit = 4) {
    try {
      // Lấy các cuốn sách chủ đề chung (vd: programming, classic)
      const response = await fetch(`${this.baseUrl}/search.json?q=programming&page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Lỗi khi fetch dữ liệu');
      }
      const data = await response.json();
      
      return data.docs.map(doc => ({
        id: doc.key,
        title: doc.title,
        author: doc.author_name ? doc.author_name[0] : 'Không rõ',
        year: doc.first_publish_year || 'Không rõ',
        cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null
      }));
    } catch (error) {
      console.error('ApiService Error:', error);
      return [];
    }
  }
}

export const apiService = new ApiService();
