import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { deleteCategory, getCategories } from '@/api/categories';
import { getErrorMessage } from '@/api/client';
import { getCourses } from '@/api/courses';
import { AlertDialog } from '@/components/AlertDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Icon } from '@/components/Icon';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateView';
import { styles } from '@/styles/categories';
import { common } from '@/styles/common';
import { colors } from '@/styles/theme';
import type { Category, Course } from '@/types';

// Đếm số khóa học của từng danh mục: { [categoryId]: số khóa học }
function countByCategory(courses: Course[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const course of courses) {
    counts[course.categoryId] = (counts[course.categoryId] ?? 0) + 1;
  }
  return counts;
}

function Separator() {
  return <View style={styles.separator} />;
}

type CategoryRowProps = {
  category: Category;
  courseCount: number;
  onEdit: () => void;
  onDelete: () => void;
};

// Một danh mục: tên, mô tả, số khóa học; hai nút bên phải để sửa và xóa
function CategoryRow({ category, courseCount, onEdit, onDelete }: CategoryRowProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardIcon}>
        <Icon name="layers" color={colors.primary} />
      </View>
      <View style={styles.cardText}>
        <Text style={styles.name}>{category.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {category.description}
        </Text>
        <Text style={styles.countChip}>{courseCount} khóa học</Text>
      </View>
      <View>
        <Pressable
          style={({ pressed }) => [styles.action, pressed && common.pressed]}
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={`Sửa danh mục ${category.name}`}
        >
          <View style={[styles.actionTile, styles.editTile]}>
            <Icon name="edit" color={colors.primary} />
          </View>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.action, pressed && common.pressed]}
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel={`Xóa danh mục ${category.name}`}
        >
          <View style={[styles.actionTile, styles.deleteTile]}>
            <Icon name="trash" color={colors.danger} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

// Trang 4: quản lý danh mục (xem, thêm, sửa, xóa)
export default function CategoriesScreen() {
  const router = useRouter();
  // null = đang tải lần đầu
  const [categories, setCategories] = useState<Category[] | null>(null);
  // Số khóa học của từng danh mục: để hiển thị và chặn xóa danh mục đang có khóa học
  const [courseCounts, setCourseCounts] = useState<Record<string, number>>({});
  const [error, setError] = useState<string>();
  const [refreshing, setRefreshing] = useState(false);
  // Danh mục đang chọn để xóa; giữ lại sau khi đóng hộp thoại để lúc mờ dần nội dung không bị trống
  const [target, setTarget] = useState<Category | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [blockedVisible, setBlockedVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();

  // Cần cả danh sách khóa học để biết mỗi danh mục đang có bao nhiêu khóa học
  const load = useCallback(
    () =>
      Promise.all([getCategories(), getCourses()])
        .then(([categoryList, courseList]) => {
          setCategories(categoryList);
          setCourseCounts(countByCategory(courseList));
          setError(undefined);
        })
        .catch((err) => setError(getErrorMessage(err))),
    [],
  );

  // Mỗi lần màn hình hiện lại (vd: sau khi thêm/sửa danh mục) thì lấy lại dữ liệu từ backend
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const retry = () => {
    setError(undefined);
    setCategories(null);
    load();
  };

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  // Danh mục đang có khóa học thì báo không xóa được, ngược lại hỏi xác nhận
  const askDelete = (category: Category) => {
    setTarget(category);
    if ((courseCounts[category.id] ?? 0) > 0) {
      setBlockedVisible(true);
      return;
    }
    setDeleteError(undefined);
    setConfirmVisible(true);
  };

  const handleDelete = async () => {
    if (!target) return;
    setDeleting(true);
    setDeleteError(undefined);
    try {
      // MockAPI không có khóa ngoại nên không tự chặn; kiểm tra lại bằng dữ liệu mới nhất ngay trước khi xóa
      const courses = await getCourses();
      const count = courses.filter((course) => course.categoryId === target.id).length;
      if (count > 0) {
        setCourseCounts(countByCategory(courses));
        setDeleteError(`Danh mục vừa có ${count} khóa học nên không thể xóa.`);
        return;
      }
      await deleteCategory(target.id);
      setConfirmVisible(false);
      await load();
    } catch (err) {
      setDeleteError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView style={common.safeArea}>
      <ScreenHeader title="Quản lý danh mục" />

      {!!error && <ErrorState message={error} onRetry={retry} />}
      {!error && !categories && <LoadingState />}
      {!error && categories && (
        <>
          <FlatList
            style={common.flex}
            contentContainerStyle={styles.listContent}
            data={categories}
            keyExtractor={(category) => category.id}
            ItemSeparatorComponent={Separator}
            renderItem={({ item }) => (
              <CategoryRow
                category={item}
                courseCount={courseCounts[item.id] ?? 0}
                onEdit={() => router.push({ pathname: '/category-form', params: { id: item.id } })}
                onDelete={() => askDelete(item)}
              />
            )}
            ListEmptyComponent={
              <EmptyState icon="layers" title="Chưa có danh mục" hint="Bấm “Thêm danh mục” để tạo danh mục đầu tiên." />
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} tintColor={colors.primary} />
            }
          />

          <View style={common.footer}>
            <PrimaryButton label="Thêm danh mục" icon="plus" onPress={() => router.push('/category-form')} />
          </View>
        </>
      )}

      {target && (
        <>
          <ConfirmDialog
            visible={confirmVisible}
            title="Xóa danh mục?"
            message="Danh mục sẽ bị xóa khỏi hệ thống và không khôi phục được."
            subject={target.name}
            busy={deleting}
            error={deleteError}
            onConfirm={handleDelete}
            onCancel={() => setConfirmVisible(false)}
          />
          <AlertDialog
            visible={blockedVisible}
            title="Không thể xóa danh mục"
            messages={[
              `“${target.name}” đang có ${courseCounts[target.id] ?? 0} khóa học.`,
              'Hãy chuyển các khóa học này sang danh mục khác hoặc xóa chúng trước.',
            ]}
            onClose={() => setBlockedVisible(false)}
          />
        </>
      )}
    </SafeAreaView>
  );
}
