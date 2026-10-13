// Định dạng dữ liệu từ API để hiển thị, và chuẩn hóa chữ để tìm kiếm

// 500000 -> "500.000đ"; khóa học 0 đồng hiện "Miễn phí"
export function formatPrice(price: number): string {
  if (price === 0) return 'Miễn phí';
  return `${String(Math.round(price)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ`;
}

// 30 -> "30 giờ", 1.5 -> "1,5 giờ" (dấu phẩy thập phân kiểu Việt Nam)
export function formatDuration(hours: number): string {
  return `${String(hours).replace('.', ',')} giờ`;
}

// "2026-10-13" (hoặc dạng ISO có cả giờ) -> "13/10/2026"; chuỗi không đúng dạng thì giữ nguyên
export function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}

// Ngày hôm nay theo giờ máy, cùng dạng YYYY-MM-DD với dữ liệu mẫu trên MockAPI
export function todayString(date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// Bỏ dấu, viết thường, gộp dấu cách để gõ "lap trinh" vẫn tìm ra "Lập trình"
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim();
}
