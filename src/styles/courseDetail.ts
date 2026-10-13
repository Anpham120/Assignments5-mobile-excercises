import { StyleSheet } from 'react-native';

import { colors } from './theme';

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  // Ảnh bìa theo tỉ lệ 16:9
  cover: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 20,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginTop: 18,
    paddingHorizontal: 10,
    paddingVertical: 4,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  title: {
    marginTop: 10,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: colors.ink,
  },

  // Bảng thông tin: mỗi dòng một biểu tượng, nhãn và giá trị
  info: {
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  infoRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  infoIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: colors.muted,
  },
  infoValue: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.ink,
  },

  trailerButton: {
    marginTop: 18,
  },
  sectionTitle: {
    marginTop: 26,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.ink,
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 23,
    color: colors.label,
  },

  // Thanh dưới cùng: nút Sửa và Xóa nằm cạnh nhau
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderWidth: 1.5,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  editButton: {
    borderColor: colors.primary,
  },
  deleteButton: {
    borderColor: colors.danger,
  },
  editText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
  },
});
