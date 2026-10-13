import { useEvent } from 'expo';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors } from '@/styles/theme';
import { styles } from '@/styles/trailer';

// Phát trailer ngay trong ứng dụng bằng expo-video (link video MP4 trực tiếp)
export default function TrailerScreen() {
  const { url, title } = useLocalSearchParams<{ url: string; title?: string }>();
  // Trình phát video; rời màn hình thì tự được giải phóng
  const player = useVideoPlayer(url);
  // Tự phát khi mở màn hình. Gọi sau khi VideoView đã gắn vào vì bản web chỉ phát được video đã gắn
  useEffect(() => {
    player.play();
  }, [player]);
  // Theo dõi trạng thái trình phát: đang tải, sẵn sàng hay lỗi
  const { status, error } = useEvent(player, 'statusChange', { status: player.status });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScreenHeader title={title ?? 'Trailer'} onStage />

      <View style={styles.stage}>
        <View style={styles.videoFrame}>
          <VideoView
            style={styles.video}
            player={player}
            nativeControls
            contentFit="contain"
            // Bấm toàn màn hình thì xoay ngang cho dễ xem
            fullscreenOptions={{ enable: true, orientation: 'landscape' }}
          />
          {status === 'loading' && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={colors.onStage} />
            </View>
          )}
        </View>

        {status === 'error' && (
          <View style={styles.error}>
            <Icon name="alert" color={colors.dangerOnStage} size={28} />
            <Text style={styles.errorTitle}>Không phát được video</Text>
            <Text style={styles.errorText}>Link trailer không phải video hợp lệ hoặc mạng đang lỗi.</Text>
            {!!error?.message && <Text style={styles.errorText}>({error.message})</Text>}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
