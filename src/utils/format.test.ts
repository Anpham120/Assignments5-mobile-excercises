import { formatDate, formatDuration, formatPrice, normalizeText, todayString } from './format';

describe('formatPrice', () => {
  it.each([
    [500000, '500.000đ'],
    [1250000, '1.250.000đ'],
    [999, '999đ'],
    [0, 'Miễn phí'],
  ])('%i -> "%s"', (price, text) => {
    expect(formatPrice(price)).toBe(text);
  });
});

describe('formatDuration', () => {
  it.each([
    [30, '30 giờ'],
    [1.5, '1,5 giờ'],
  ])('%d -> "%s"', (hours, text) => {
    expect(formatDuration(hours)).toBe(text);
  });
});

describe('formatDate', () => {
  it.each([
    ['2026-10-13', '13/10/2026'],
    ['2026-10-13T08:30:00.000Z', '13/10/2026'],
    ['hôm qua', 'hôm qua'],
  ])('"%s" -> "%s"', (value, text) => {
    expect(formatDate(value)).toBe(text);
  });
});

describe('todayString', () => {
  it('có dạng YYYY-MM-DD, tháng và ngày luôn đủ 2 chữ số', () => {
    expect(todayString(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('normalizeText', () => {
  it('bỏ dấu tiếng Việt, kể cả chữ đ', () => {
    expect(normalizeText('Lập Trình Đa Nền Tảng')).toBe('lap trinh da nen tang');
  });

  it('gộp dấu cách thừa', () => {
    expect(normalizeText('  Trí   tuệ  ')).toBe('tri tue');
  });
});
