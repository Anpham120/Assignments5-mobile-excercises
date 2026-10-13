import { StyleSheet } from 'react-native';

// Dùng chung cho form khóa học và form danh mục
export const styles = StyleSheet.create({
  // flexGrow: nội dung cao ít nhất bằng vùng cuộn; gap giữa các ô nhập
  content: {
    flexGrow: 1,
    gap: 18,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  // Học phí và thời lượng nằm cạnh nhau, mỗi ô một nửa
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  // Ô nhập link ảnh và khung xem trước đi liền nhau
  thumbnailGroup: {
    gap: 10,
  },
  preview: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 14,
  },
  textArea: {
    height: 128,
    paddingTop: 14,
    paddingBottom: 14,
  },
});
