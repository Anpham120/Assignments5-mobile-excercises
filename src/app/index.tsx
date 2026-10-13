import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getCategories } from '@/api/categories';
import { getErrorMessage } from '@/api/client';
import { getCourses } from '@/api/courses';
import { Icon } from '@/components/Icon';
import { PrimaryButton } from '@/components/PrimaryButton';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateView';
import { Thumbnail } from '@/components/Thumbnail';
import { common } from '@/styles/common';
import { styles } from '@/styles/courseList';
import { colors } from '@/styles/theme';
import type { Category, Course } from '@/types';
import { formatPrice, normalizeText } from '@/utils/format';

function Separator() {
  return <View style={styles.separator} />;
}

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && common.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

type CourseRowProps = {
  course: Course;
  // Tên danh mục tra theo categoryId; undefined = danh mục không còn tồn tại
  categoryName?: string;
  onPress: () => void;
};

// Một khóa học trong danh sách: ảnh bìa, tên, giảng viên, danh mục, học phí
function CourseRow({ course, categoryName, onPress }: CourseRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && common.pressed]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Thumbnail uri={course.thumbnail} style={styles.thumbnail} />
      <View style={styles.rowText}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {course.title}
        </Text>
        <Text style={styles.instructor} numberOfLines={1}>
          {course.instructor}
        </Text>
        <View style={styles.rowMeta}>
          <Text style={styles.categoryChip} numberOfLines={1}>
            {categoryName ?? 'Không rõ danh mục'}
          </Text>
          <Text style={styles.price}>{formatPrice(course.price)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

// Trang 1: danh sách khóa học lấy từ MockAPI, tìm theo tên và lọc theo danh mục
export default function CourseListScreen() {
  const router = useRouter();
  // null = đang tải lần đầu
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>();
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  // Danh mục đang lọc; null = tất cả
  const [filterId, setFilterId] = useState<string | null>(null);

  // Gọi song song hai API: khóa học, và danh mục để tra tên danh mục theo categoryId
  const load = useCallback(
    () =>
      Promise.all([getCourses(), getCategories()])
        .then(([courseList, categoryList]) => {
          setCourses(courseList);
          setCategories(categoryList);
          setError(undefined);
        })
        .catch((err) => setError(getErrorMessage(err))),
    [],
  );

  // Mỗi lần màn hình hiện lại (vd: sau khi thêm/sửa/xóa) thì lấy lại dữ liệu từ backend
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const retry = () => {
    setError(undefined);
    setCourses(null);
    load();
  };

  // Kéo danh sách xuống để tải lại
  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
  // Danh mục đang lọc vừa bị xóa thì coi như đang xem tất cả
  const activeFilter = filterId !== null && categoryNames.has(filterId) ? filterId : null;
  const keyword = normalizeText(query);
  const visibleCourses = (courses ?? [])
    .filter((course) => activeFilter === null || course.categoryId === activeFilter)
    .filter((course) => normalizeText(course.title).includes(keyword))
    // Khóa học mới thêm (id lớn hơn) lên đầu
    .sort((a, b) => Number(b.id) - Number(a.id));

  // Chưa tải xong thì để trống (giữ chỗ) cho tiêu đề không bị nhảy
  let subtitle = ' ';
  if (courses) {
    subtitle =
      visibleCourses.length === courses.length
        ? `${courses.length} khóa học`
        : `Đang hiện ${visibleCourses.length} / ${courses.length} khóa học`;
  }

  return (
    <SafeAreaView style={common.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Khóa học</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.categoriesButton, pressed && common.pressed]}
          onPress={() => router.push('/categories')}
          accessibilityRole="button"
        >
          <Icon name="layers" color={colors.primary} size={18} />
          <Text style={styles.categoriesText}>Danh mục</Text>
        </Pressable>
      </View>

      {!!error && <ErrorState message={error} onRetry={retry} />}
      {!error && !courses && <LoadingState />}
      {!error && courses && (
        <>
          <View style={styles.search}>
            <Icon name="search" color={colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm theo tên khóa học"
              placeholderTextColor={colors.placeholder}
              accessibilityLabel="Tìm theo tên khóa học"
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable
                style={({ pressed }) => [styles.clearButton, pressed && common.pressed]}
                onPress={() => setQuery('')}
                accessibilityRole="button"
                accessibilityLabel="Xóa từ khóa"
              >
                <Icon name="close" color={colors.muted} size={18} />
              </Pressable>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipBar}
            contentContainerStyle={styles.chips}
          >
            <FilterChip label="Tất cả" selected={activeFilter === null} onPress={() => setFilterId(null)} />
            {categories.map((category) => (
              <FilterChip
                key={category.id}
                label={category.name}
                selected={activeFilter === category.id}
                onPress={() => setFilterId(category.id)}
              />
            ))}
          </ScrollView>

          <FlatList
            style={common.flex}
            contentContainerStyle={styles.listContent}
            data={visibleCourses}
            keyExtractor={(course) => course.id}
            ItemSeparatorComponent={Separator}
            renderItem={({ item }) => (
              <CourseRow
                course={item}
                categoryName={categoryNames.get(item.categoryId)}
                onPress={() => router.push({ pathname: '/course/[id]', params: { id: item.id } })}
              />
            )}
            ListEmptyComponent={
              courses.length === 0 ? (
                <EmptyState icon="book" title="Chưa có khóa học" hint="Bấm “Thêm khóa học” để tạo khóa học đầu tiên." />
              ) : (
                <EmptyState icon="search" title="Không tìm thấy khóa học" hint="Thử từ khóa khác hoặc chọn danh mục khác." />
              )
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} tintColor={colors.primary} />
            }
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />

          <View style={common.footer}>
            <PrimaryButton label="Thêm khóa học" icon="plus" onPress={() => router.push('/course-form')} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
