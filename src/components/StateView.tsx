import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { styles } from '@/styles/stateView';
import { colors } from '@/styles/theme';

// Ba trạng thái dùng chung cho các màn hình lấy dữ liệu từ API: đang tải, lỗi, danh sách rỗng

export function LoadingState() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.hint, styles.loadingHint]}>Đang tải dữ liệu...</Text>
    </View>
  );
}

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.icon, styles.errorIcon]}>
        <Icon name="alert" color={colors.danger} size={36} strokeWidth={1.8} />
      </View>
      <Text style={styles.title}>Không tải được dữ liệu</Text>
      <Text style={styles.hint}>{message}</Text>
      <Pressable
        style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
        onPress={onRetry}
        accessibilityRole="button"
      >
        <Icon name="refresh" color={colors.primary} size={18} />
        <Text style={styles.retryText}>Thử lại</Text>
      </Pressable>
    </View>
  );
}

type EmptyStateProps = {
  icon: IconName;
  title: string;
  hint: string;
};

export function EmptyState({ icon, title, hint }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Icon name={icon} color={colors.primary} size={36} strokeWidth={1.8} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}
