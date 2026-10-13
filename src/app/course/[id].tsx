import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getCategories } from '@/api/categories';
import { getErrorMessage } from '@/api/client';
import { deleteCourse, getCourse } from '@/api/courses';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Icon, type IconName } from '@/components/Icon';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ErrorState, LoadingState } from '@/components/StateView';
import { Thumbnail } from '@/components/Thumbnail';
import { common } from '@/styles/common';
import { styles } from '@/styles/courseDetail';
import { colors } from '@/styles/theme';
import type { Course } from '@/types';
import { formatDate, formatDuration, formatPrice } from '@/utils/format';
import { goBack } from '@/utils/navigation';

type InfoRowProps = {
  icon: IconName;
  label: string;
  value: string;
  // Kẻ đường phân cách phía trên (mọi dòng trừ dòng đầu)
  bordered?: boolean;
};

function InfoRow({ icon, label, value, bordered = false }: InfoRowProps) {
  return (
    <View style={[styles.infoRow, bordered && styles.infoRowBorder]}>
      <View style={styles.infoIcon}>
        <Icon name={icon} color={colors.primary} size={18} />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

// Trang 2: chi tiết khóa học
export default function CourseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  // Tên danh mục tra từ API categories theo categoryId; undefined = danh mục không còn tồn tại
  const [categoryName, setCategoryName] = useState<string>();
  const [error, setError] = useState<string>();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();

  // Lấy chi tiết khóa học và danh sách danh mục cùng lúc
  const load = useCallback(
    () =>
      Promise.all([getCourse(id), getCategories()])
        .then(([detail, categories]) => {
          setCourse(detail);
          setCategoryName(categories.find((category) => category.id === detail.categoryId)?.name);
          setError(undefined);
        })
        .catch((err) => setError(getErrorMessage(err))),
    [id],
  );

  // Mỗi lần màn hình hiện lại (vd: sau khi sửa) thì lấy lại chi tiết mới nhất
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const retry = () => {
    setError(undefined);
    setCourse(null);
    load();
  };

  const askDelete = () => {
    setDeleteError(undefined);
    setConfirmVisible(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(undefined);
    try {
      await deleteCourse(id);
      setConfirmVisible(false);
      // Danh sách tự tải lại khi hiện ra nên khóa học vừa xóa sẽ biến mất
      goBack();
    } catch (err) {
      setDeleteError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  if (error || !course) {
    return (
      <SafeAreaView style={common.safeArea}>
        <ScreenHeader title="Chi tiết khóa học" />
        {error ? <ErrorState message={error} onRetry={retry} /> : <LoadingState />}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={common.safeArea}>
      <ScreenHeader title="Chi tiết khóa học" />
      <ScrollView style={common.flex} contentContainerStyle={styles.content}>
        <Thumbnail uri={course.thumbnail} style={styles.cover} iconSize={40} />
        <Text style={styles.categoryChip}>{categoryName ?? 'Không rõ danh mục'}</Text>
        <Text style={styles.title}>{course.title}</Text>

        <View style={styles.info}>
          <InfoRow icon="user" label="Giảng viên" value={course.instructor} />
          <InfoRow icon="creditCard" label="Học phí" value={formatPrice(course.price)} bordered />
          <InfoRow icon="clock" label="Thời lượng" value={formatDuration(course.duration)} bordered />
          <InfoRow icon="calendar" label="Ngày tạo" value={formatDate(course.createdAt)} bordered />
        </View>

        <PrimaryButton
          label="Xem trailer"
          icon="play"
          style={styles.trailerButton}
          onPress={() => router.push({ pathname: '/trailer', params: { url: course.trailerUrl, title: course.title } })}
        />

        <Text style={styles.sectionTitle}>Mô tả khóa học</Text>
        <Text style={styles.description}>{course.description}</Text>
      </ScrollView>

      <View style={[common.footer, styles.footerButtons]}>
        <Pressable
          style={({ pressed }) => [styles.footerButton, styles.editButton, pressed && common.pressed]}
          onPress={() => router.push({ pathname: '/course-form', params: { id: course.id } })}
          accessibilityRole="button"
        >
          <Icon name="edit" color={colors.primary} size={18} />
          <Text style={styles.editText}>Sửa</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.footerButton, styles.deleteButton, pressed && common.pressed]}
          onPress={askDelete}
          accessibilityRole="button"
        >
          <Icon name="trash" color={colors.danger} size={18} />
          <Text style={styles.deleteText}>Xóa</Text>
        </Pressable>
      </View>

      <ConfirmDialog
        visible={confirmVisible}
        title="Xóa khóa học?"
        message="Khóa học sẽ bị xóa khỏi hệ thống và không khôi phục được."
        subject={course.title}
        thumbnail={course.thumbnail}
        busy={deleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={() => setConfirmVisible(false)}
      />
    </SafeAreaView>
  );
}
