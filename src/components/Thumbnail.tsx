import { Image } from 'expo-image';
import { useState } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors } from '@/styles/theme';
import { styles } from '@/styles/thumbnail';

type ThumbnailProps = {
  // Link ảnh bìa; rỗng hoặc tải lỗi thì hiện biểu tượng ảnh thay thế
  uri: string;
  // Kích thước, bo góc của khung ảnh
  style: StyleProp<ViewStyle>;
  iconSize?: number;
  // Hiện thêm dòng chữ dưới biểu tượng (ô xem trước trong form) để biết vì sao chưa có ảnh
  showStatus?: boolean;
};

// Ảnh bìa tải từ link bằng expo-image: có cache, hiện mờ dần khi tải xong
export function Thumbnail({ uri, style, iconSize = 24, showStatus = false }: ThumbnailProps) {
  // Nhớ link đã tải lỗi; đổi sang link khác thì tự thử tải lại
  const [failedUri, setFailedUri] = useState<string>();
  const failed = uri === failedUri;

  return (
    <View style={[styles.box, style]}>
      {uri && !failed ? (
        <Image
          source={{ uri }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          onError={() => setFailedUri(uri)}
        />
      ) : (
        <>
          <Icon name="image" color={colors.primaryMuted} size={iconSize} strokeWidth={1.8} />
          {showStatus && (
            <Text style={styles.status}>{failed ? 'Không tải được ảnh từ link này' : 'Ảnh xem trước'}</Text>
          )}
        </>
      )}
    </View>
  );
}
