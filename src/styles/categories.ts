import { StyleSheet } from 'react-native';

import { colors } from './theme';

export const styles = StyleSheet.create({
  // flexGrow để thông báo rỗng nằm giữa vùng danh sách
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
  },
  separator: {
    height: 12,
  },
  // Một danh mục: biểu tượng, tên + mô tả + số khóa học, hai nút sửa/xóa xếp dọc bên phải
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 6,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  cardIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
  cardText: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 3,
  },
  name: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.ink,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  countChip: {
    marginTop: 3,
    paddingHorizontal: 8,
    paddingVertical: 1,
    overflow: 'hidden',
    borderRadius: 6,
    backgroundColor: colors.chip,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.label,
  },
  // Mỗi nút vùng chạm 44x44
  action: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTile: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  editTile: {
    backgroundColor: colors.primarySoft,
  },
  deleteTile: {
    backgroundColor: colors.dangerSoft,
  },
});
