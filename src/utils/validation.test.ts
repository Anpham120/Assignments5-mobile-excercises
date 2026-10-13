import {
  hasErrors,
  parseDuration,
  parsePrice,
  toCategoryInput,
  toCourseInput,
  validateCategoryForm,
  validateCategoryId,
  validateCategoryName,
  validateCourseForm,
  validateDuration,
  validatePrice,
  validateTrailerUrl,
  validateUrl,
  type CourseFormValues,
} from './validation';

const VALID_COURSE: CourseFormValues = {
  title: 'Lập trình Android cơ bản',
  categoryId: '1',
  instructor: 'Nguyễn Văn A',
  price: '500000',
  duration: '30',
  thumbnail: 'https://picsum.photos/id/1/800/450',
  trailerUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  description: 'Xây dựng ứng dụng Android với Kotlin',
};

describe('parsePrice / validatePrice', () => {
  it.each([
    ['500000', 500000],
    ['500.000', 500000],
    ['1,250,000', 1250000],
    ['1 250 000', 1250000],
    [' 0 ', 0],
  ])('đọc "%s" thành %i', (text, value) => {
    expect(parsePrice(text)).toBe(value);
    expect(validatePrice(text)).toBeUndefined();
  });

  it.each(['', '   '])('báo thiếu khi "%s" là rỗng', (text) => {
    expect(validatePrice(text)).toBe('Nhập học phí');
  });

  it.each(['abc', '12a', '1e5', '5-00'])('"%s" không phải số', (text) => {
    expect(parsePrice(text)).toBeUndefined();
    expect(validatePrice(text)).toBe('Học phí chỉ gồm chữ số (VNĐ)');
  });

  it.each(['-1', '-500.000'])('"%s" là học phí âm', (text) => {
    expect(validatePrice(text)).toBe('Học phí không được âm');
  });
});

describe('parseDuration / validateDuration', () => {
  it.each([
    ['30', 30],
    ['1.5', 1.5],
    ['1,5', 1.5],
  ])('đọc "%s" thành %d giờ', (text, value) => {
    expect(parseDuration(text)).toBe(value);
    expect(validateDuration(text)).toBeUndefined();
  });

  it('báo thiếu khi rỗng', () => {
    expect(validateDuration('')).toBe('Nhập thời lượng');
  });

  it.each(['abc', '1.2.3', '2h'])('"%s" không phải số giờ', (text) => {
    expect(validateDuration(text)).toBe('Thời lượng phải là số giờ');
  });

  it.each(['0', '0.0', '-3'])('"%s" không lớn hơn 0', (text) => {
    expect(validateDuration(text)).toBe('Thời lượng phải lớn hơn 0');
  });
});

describe('validateCategoryId', () => {
  const ids = ['1', '2', '3'];

  it('chấp nhận danh mục có trong danh sách lấy từ API', () => {
    expect(validateCategoryId('2', ids)).toBeUndefined();
  });

  it('báo khi chưa chọn', () => {
    expect(validateCategoryId('', ids)).toBe('Chọn danh mục');
  });

  it('báo khi categoryId không tồn tại', () => {
    expect(validateCategoryId('99', ids)).toBe('Danh mục không còn tồn tại, hãy chọn lại');
  });
});

describe('validateUrl / validateTrailerUrl', () => {
  it.each(['https://picsum.photos/id/1/800/450', 'http://example.com/a.jpg', ' https://cdn.site.vn/x.png?w=800 '])(
    'chấp nhận "%s"',
    (url) => {
      expect(validateUrl(url, 'Nhập link')).toBeUndefined();
    },
  );

  it('báo thiếu khi rỗng', () => {
    expect(validateUrl('  ', 'Nhập link ảnh bìa')).toBe('Nhập link ảnh bìa');
  });

  it.each(['picsum.photos/id/1', 'ftp://example.com/a.mp4', 'https://example com/a.mp4', 'https://localhost', 'https://'])(
    '"%s" không phải link http/https hợp lệ',
    (url) => {
      expect(validateUrl(url, 'Nhập link')).toBe('Link không hợp lệ, phải bắt đầu bằng http:// hoặc https://');
    },
  );

  it('chấp nhận link MP4 trực tiếp', () => {
    expect(validateTrailerUrl(VALID_COURSE.trailerUrl)).toBeUndefined();
  });

  it.each([
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
  ])('từ chối link YouTube "%s"', (url) => {
    expect(validateTrailerUrl(url)).toBe('Chưa hỗ trợ link YouTube, hãy dùng link video MP4 trực tiếp');
  });
});

describe('validateCourseForm / hasErrors', () => {
  it('không có lỗi khi mọi ô hợp lệ', () => {
    const errors = validateCourseForm(VALID_COURSE, ['1', '2', '3']);
    expect(errors).toEqual({});
    expect(hasErrors(errors)).toBe(false);
  });

  it('báo lỗi đúng từng ô', () => {
    const errors = validateCourseForm(
      { title: ' ', categoryId: '9', instructor: '', price: '-1', duration: '0', thumbnail: 'abc', trailerUrl: '', description: '' },
      ['1', '2', '3'],
    );
    expect(errors).toEqual({
      title: 'Nhập tên khóa học',
      categoryId: 'Danh mục không còn tồn tại, hãy chọn lại',
      instructor: 'Nhập tên giảng viên',
      price: 'Học phí không được âm',
      duration: 'Thời lượng phải lớn hơn 0',
      thumbnail: 'Link không hợp lệ, phải bắt đầu bằng http:// hoặc https://',
      trailerUrl: 'Nhập link video trailer',
      description: 'Nhập mô tả khóa học',
    });
    expect(hasErrors(errors)).toBe(true);
  });
});

describe('toCourseInput', () => {
  it('gộp dấu cách thừa và đổi học phí, thời lượng sang số', () => {
    expect(
      toCourseInput(
        { ...VALID_COURSE, title: '  Flutter   cơ bản ', instructor: ' Lê  Thị C ', price: '650.000', duration: '1,5' },
        '2026-10-13',
      ),
    ).toEqual({
      ...VALID_COURSE,
      title: 'Flutter cơ bản',
      instructor: 'Lê Thị C',
      price: 650000,
      duration: 1.5,
      createdAt: '2026-10-13',
    });
  });
});

describe('validateCategoryName / validateCategoryForm', () => {
  const others = ['Lập trình Mobile', 'Trí tuệ nhân tạo'];

  it('chấp nhận tên mới', () => {
    expect(validateCategoryName('Thiết kế đồ họa', others)).toBeUndefined();
  });

  it('báo thiếu khi rỗng', () => {
    expect(validateCategoryName('   ', others)).toBe('Nhập tên danh mục');
  });

  it.each(['Lập trình Mobile', 'lập TRÌNH mobile', '  Lập   trình Mobile '])('báo trùng tên với "%s"', (name) => {
    expect(validateCategoryName(name, others)).toBe('Đã có danh mục trùng tên');
  });

  it('báo thiếu mô tả', () => {
    expect(validateCategoryForm({ name: 'Thiết kế', description: '' }, others)).toEqual({
      description: 'Nhập mô tả danh mục',
    });
  });

  it('toCategoryInput gộp dấu cách thừa', () => {
    expect(toCategoryInput({ name: ' Thiết  kế ', description: ' UI/UX ' })).toEqual({
      name: 'Thiết kế',
      description: 'UI/UX',
    });
  });
});
