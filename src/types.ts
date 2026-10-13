// Danh mục khóa học (resource "categories" trên MockAPI)
export type Category = {
  // Mã do MockAPI tự sinh
  id: string;
  name: string;
  description: string;
};

// Khóa học (resource "courses"); mỗi khóa học thuộc đúng một danh mục qua categoryId = Category.id
export type Course = {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  instructor: string;
  // Học phí (VNĐ)
  price: number;
  // Thời lượng (giờ)
  duration: number;
  // Link ảnh bìa
  thumbnail: string;
  // Link video trailer (MP4)
  trailerUrl: string;
  // Ngày tạo dạng YYYY-MM-DD
  createdAt: string;
};

// Dữ liệu gửi lên khi thêm/sửa, không có id vì MockAPI tự sinh
export type CategoryInput = Omit<Category, 'id'>;
export type CourseInput = Omit<Course, 'id'>;
