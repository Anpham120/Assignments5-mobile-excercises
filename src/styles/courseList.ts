import { StyleSheet } from 'react-native';

import { colors } from './theme';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.ink,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: colors.muted,
  },
  // Nút sang màn hình quản lý danh mục
  categoriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
  },
  categoriesText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },

  // Ô tìm kiếm theo tên khóa học
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    marginHorizontal: 16,
    paddingLeft: 14,
    paddingRight: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.ink,
  },
  clearButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Hàng chip lọc theo danh mục, cuộn ngang; flexGrow 0 để hàng chip không giãn ra chiếm chỗ danh sách
  chipBar: {
    flexGrow: 0,
  },
  chips: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chip: {
    height: 38,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 19,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.label,
  },
  chipTextSelected: {
    color: colors.surface,
  },

  // flexGrow để thông báo rỗng nằm giữa vùng danh sách
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  separator: {
    height: 12,
  },
  // Một khóa học: ảnh bìa bên trái, thông tin bên phải
  row: {
    flexDirection: 'row',
    gap: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  thumbnail: {
    width: 112,
    height: 84,
    borderRadius: 12,
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  courseTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.ink,
  },
  instructor: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  // Danh mục và học phí luôn nằm dưới cùng
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 'auto',
  },
  categoryChip: {
    flexShrink: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
    borderRadius: 6,
    backgroundColor: colors.chip,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.label,
  },
  price: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.primary,
  },
});
