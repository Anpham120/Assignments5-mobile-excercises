// Kiểm tra dữ liệu form khóa học và form danh mục trước khi gửi lên MockAPI.
// Mỗi hàm trả về câu báo lỗi để hiện dưới ô nhập, hợp lệ thì trả về undefined.

import type { CategoryInput, CourseInput } from '@/types';

// Giá trị các ô của form khóa học; học phí và thời lượng vẫn là chữ người dùng gõ
export type CourseFormValues = {
  title: string;
  categoryId: string;
  instructor: string;
  price: string;
  duration: string;
  thumbnail: string;
  trailerUrl: string;
  description: string;
};

export type CourseFormErrors = Partial<Record<keyof CourseFormValues, string>>;

export type CategoryFormValues = {
  name: string;
  description: string;
};

export type CategoryFormErrors = Partial<Record<keyof CategoryFormValues, string>>;

// Link bắt đầu bằng http:// hoặc https://, tên miền có dấu chấm, không chứa dấu cách
const URL_PATTERN = /^https?:\/\/[^\s/]+\.[^\s/]+(\/\S*)?$/i;
// Link YouTube là trang web chứ không phải file video nên trình phát không mở được
const YOUTUBE_PATTERN = /^https?:\/\/([\w-]+\.)*(youtube\.com|youtu\.be)(\/|$)/i;

// Bỏ dấu cách ở hai đầu và gộp nhiều dấu cách liền nhau thành một
export function collapseSpaces(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

export function isHttpUrl(text: string): boolean {
  return URL_PATTERN.test(text.trim());
}

// Học phí tính bằng đồng nên không có phần lẻ: dấu chấm, phẩy, cách chỉ là phân cách hàng nghìn (500.000 = 500000)
export function parsePrice(text: string): number | undefined {
  const digits = text.trim().replace(/[.,\s]/g, '');
  return /^-?\d+$/.test(digits) ? Number(digits) : undefined;
}

// Thời lượng (giờ) có thể lẻ, nhận cả dấu phẩy thập phân (1,5 = 1.5)
export function parseDuration(text: string): number | undefined {
  const value = text.trim().replace(',', '.');
  return /^-?\d+(\.\d+)?$/.test(value) ? Number(value) : undefined;
}

function validateRequired(text: string, message: string): string | undefined {
  return text.trim().length === 0 ? message : undefined;
}

export function validatePrice(text: string): string | undefined {
  if (text.trim().length === 0) return 'Nhập học phí';
  const price = parsePrice(text);
  if (price === undefined) return 'Học phí chỉ gồm chữ số (VNĐ)';
  if (price < 0) return 'Học phí không được âm';
  return undefined;
}

export function validateDuration(text: string): string | undefined {
  if (text.trim().length === 0) return 'Nhập thời lượng';
  const duration = parseDuration(text);
  if (duration === undefined) return 'Thời lượng phải là số giờ';
  if (duration <= 0) return 'Thời lượng phải lớn hơn 0';
  return undefined;
}

// MockAPI không có khóa ngoại nên ứng dụng tự kiểm tra categoryId có trong danh sách danh mục lấy từ API
export function validateCategoryId(categoryId: string, categoryIds: string[]): string | undefined {
  if (categoryId.length === 0) return 'Chọn danh mục';
  if (!categoryIds.includes(categoryId)) return 'Danh mục không còn tồn tại, hãy chọn lại';
  return undefined;
}

export function validateUrl(text: string, emptyMessage: string): string | undefined {
  if (text.trim().length === 0) return emptyMessage;
  if (!isHttpUrl(text)) return 'Link không hợp lệ, phải bắt đầu bằng http:// hoặc https://';
  return undefined;
}

export function validateTrailerUrl(text: string): string | undefined {
  const error = validateUrl(text, 'Nhập link video trailer');
  if (error) return error;
  if (YOUTUBE_PATTERN.test(text.trim())) return 'Chưa hỗ trợ link YouTube, hãy dùng link video MP4 trực tiếp';
  return undefined;
}

// Thứ tự lỗi theo thứ tự các ô trên form
export function validateCourseForm(values: CourseFormValues, categoryIds: string[]): CourseFormErrors {
  return {
    title: validateRequired(values.title, 'Nhập tên khóa học'),
    categoryId: validateCategoryId(values.categoryId, categoryIds),
    instructor: validateRequired(values.instructor, 'Nhập tên giảng viên'),
    price: validatePrice(values.price),
    duration: validateDuration(values.duration),
    thumbnail: validateUrl(values.thumbnail, 'Nhập link ảnh bìa'),
    trailerUrl: validateTrailerUrl(values.trailerUrl),
    description: validateRequired(values.description, 'Nhập mô tả khóa học'),
  };
}

// otherNames: tên các danh mục khác (khi sửa thì không tính chính danh mục đang sửa)
export function validateCategoryName(text: string, otherNames: string[]): string | undefined {
  const name = collapseSpaces(text).toLowerCase();
  if (name.length === 0) return 'Nhập tên danh mục';
  // Trùng tên (không phân biệt hoa thường) thì ô lọc theo danh mục sẽ có hai lựa chọn giống nhau
  if (otherNames.some((other) => collapseSpaces(other).toLowerCase() === name)) return 'Đã có danh mục trùng tên';
  return undefined;
}

export function validateCategoryForm(values: CategoryFormValues, otherNames: string[]): CategoryFormErrors {
  return {
    name: validateCategoryName(values.name, otherNames),
    description: validateRequired(values.description, 'Nhập mô tả danh mục'),
  };
}

export function hasErrors(errors: CourseFormErrors | CategoryFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}

// Các câu báo lỗi theo thứ tự trên form, để liệt kê trong hộp thoại
export function errorMessages(errors: CourseFormErrors | CategoryFormErrors): string[] {
  return Object.values(errors).filter((message): message is string => !!message);
}

// Chuyển dữ liệu form (đã hợp lệ) sang đúng kiểu của API: học phí, thời lượng thành số
export function toCourseInput(values: CourseFormValues, createdAt: string): CourseInput {
  return {
    title: collapseSpaces(values.title),
    description: values.description.trim(),
    categoryId: values.categoryId,
    instructor: collapseSpaces(values.instructor),
    price: parsePrice(values.price) ?? 0,
    duration: parseDuration(values.duration) ?? 0,
    thumbnail: values.thumbnail.trim(),
    trailerUrl: values.trailerUrl.trim(),
    createdAt,
  };
}

export function toCategoryInput(values: CategoryFormValues): CategoryInput {
  return {
    name: collapseSpaces(values.name),
    description: values.description.trim(),
  };
}
