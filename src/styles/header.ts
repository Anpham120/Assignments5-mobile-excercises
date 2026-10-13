import { StyleSheet } from 'react-native';

import { colors } from './theme';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 12,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
    color: colors.ink,
  },
  // Màn hình trailer nền đen
  titleOnStage: {
    color: colors.onStage,
  },
  pressed: {
    opacity: 0.7,
  },
});
