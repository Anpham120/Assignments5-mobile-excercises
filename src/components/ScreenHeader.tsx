import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { styles } from '@/styles/header';
import { colors } from '@/styles/theme';
import { goBack } from '@/utils/navigation';

type ScreenHeaderProps = {
  title: string;
  // Chữ và nút màu sáng cho màn hình nền đen (xem trailer)
  onStage?: boolean;
};

// Thanh tiêu đề của các màn hình con: nút quay lại + tiêu đề
export function ScreenHeader({ title, onStage = false }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        onPress={goBack}
        accessibilityRole="button"
        accessibilityLabel="Quay lại"
      >
        <Icon name="back" color={onStage ? colors.onStage : colors.ink} size={24} />
      </Pressable>
      <Text style={[styles.title, onStage && styles.titleOnStage]} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}
