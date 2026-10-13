import { StyleSheet } from 'react-native';

import { colors } from './theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.stage,
  },
  // Video nằm giữa phần còn lại của màn hình
  stage: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 44,
  },
  videoFrame: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  // Vòng quay lúc đang tải video; không chặn thao tác bấm vào trình phát
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  error: {
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
    color: colors.onStage,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: colors.onStageMuted,
  },
});
