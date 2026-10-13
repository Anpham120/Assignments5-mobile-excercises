import { Modal, Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { styles } from '@/styles/dialog';
import { colors } from '@/styles/theme';

type AlertDialogProps = {
  visible: boolean;
  title: string;
  messages: string[];
  onClose: () => void;
};

// Hộp thoại báo lỗi (nhập sai, gọi API thất bại, không được xóa): mỗi ý một dòng, bấm "Đã hiểu" để đóng
export function AlertDialog({ visible, title, messages, onClose }: AlertDialogProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      // Nút Back của Android (Esc trên web) cũng đóng hộp thoại
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Icon name="alert" color={colors.danger} size={28} />
          </View>
          <Text style={[styles.title, styles.alertTitle]}>{title}</Text>
          <View style={styles.alertMessages}>
            {messages.map((message) => (
              <View key={message} style={styles.alertRow}>
                <Text style={styles.alertBullet}>•</Text>
                <Text style={styles.alertMessage}>{message}</Text>
              </View>
            ))}
          </View>
          <Pressable
            style={({ pressed }) => [styles.alertButton, pressed && styles.pressed]}
            onPress={onClose}
            accessibilityRole="button"
          >
            <Text style={styles.confirmText}>Đã hiểu</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
