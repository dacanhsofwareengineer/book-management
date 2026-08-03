# Quản Lý Sách

## Giới thiệu

Web App quản lý sách (Single Page Application) giúp người dùng quản lý bộ sưu tập sách cá nhân, theo dõi trạng thái đọc và khám phá sách mới. Giao diện được thiết kế hiện đại, thân thiện và hỗ trợ đầy đủ trên Desktop, Tablet và Mobile.

## Chức năng

- **CRUD**: Thêm, xem, sửa, xóa sách.
- **Search**: Tìm kiếm realtime theo tên sách và tác giả.
- **Filter**: Lọc sách theo trạng thái (Tất cả, Đã đọc, Chưa đọc).
- **Sort**: Sắp xếp sách theo năm xuất bản (Mới nhất, Cũ nhất).
- **Pagination**: Phân trang danh sách sách động theo từng thiết bị (Desktop: 6, Tablet: 4, Mobile: 2).
- **LocalStorage**: Dữ liệu sách được lưu trữ trong trình duyệt, khôi phục đầy đủ sau khi tải lại trang.
- **Fetch API**: Lấy sách đề xuất từ Open Library API, hỗ trợ tải thêm (Load more).
- **Responsive**: Giao diện thích ứng với kích thước màn hình 375px, 768px, 1440px.

## Công nghệ

- HTML5
- CSS3
- SCSS
- JavaScript (ES6+, Modules)
- Fetch API
- LocalStorage

## Cấu trúc thư mục

- `assets/`: Chứa các tài nguyên tĩnh.
  - `scss/`: Mã nguồn SCSS được chia thành các module (variables, mixins, layout, components).
  - `css/`: CSS sau khi biên dịch.
- `js/`: Chứa mã nguồn JavaScript.
  - `components/`: Các module UI (Modal, Pagination, Render, Validator).
  - `services/`: Các module xử lý logic (ApiService, BookService, StorageService).
  - `app.js`: Entry point chính, khởi tạo và kết nối các thành phần.
  - `constants.js`: Các hằng số cấu hình.
  - `utils.js`: Các hàm tiện ích.
- `index.html`: Giao diện chính của ứng dụng.

## Hướng dẫn clone

```bash
git clone https://github.com/dacanhsofwareengineer/book-management.git
cd book-management-app
```

## Hướng dẫn chạy

Dự án yêu cầu `yarn` để cài đặt dependencies và chạy script biên dịch SCSS.

```bash
yarn install
yarn dev
```

Sau đó truy cập `http://127.0.0.1:8081` trên trình duyệt.

## Open Library API

Dự án sử dụng Open Library Search API (`https://openlibrary.org/search.json`) để lấy danh sách đề xuất. Dữ liệu được fetch bất đồng bộ, trích xuất thông tin cần thiết (Tiêu đề, Tác giả, Năm xuất bản, Ảnh bìa) và hiển thị lên giao diện.
