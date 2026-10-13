import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      {/* Ẩn header mặc định, mỗi màn hình tự vẽ tiêu đề và nút quay lại */}
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
