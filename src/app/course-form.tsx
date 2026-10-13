import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getCategories } from '@/api/categories';
import { getErrorMessage } from '@/api/client';
import { createCourse, getCourse, updateCourse } from '@/api/courses';
import { AlertDialog } from '@/components/AlertDialog';
import { CategorySelect } from '@/components/CategorySelect';
import { Field, FieldGroup } from '@/components/FormField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ErrorState, LoadingState } from '@/components/StateView';
import { Thumbnail } from '@/components/Thumbnail';
import { common } from '@/styles/common';
import { styles } from '@/styles/form';
import type { Category } from '@/types';
import { todayString } from '@/utils/format';
import { goBack } from '@/utils/navigation';
import {
  errorMessages,
  hasErrors,
  isHttpUrl,
  toCourseInput,
  validateCategoryId,
  validateCourseForm,
  type CourseFormValues,
} from '@/utils/validation';

const EMPTY_FORM: CourseFormValues = {
  title: '',
  categoryId: '',
  instructor: '',
  price: '',
  duration: '',
  thumbnail: '',
  trailerUrl: '',
  description: '',
};

// Trang 3: thêm khóa học (không có tham số id) hoặc sửa khóa học (id của khóa học cần sửa)
export default function CourseFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  // Danh mục cho ô chọn, lấy từ API; null = đang tải
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loadError, setLoadError] = useState<string>();
  const [values, setValues] = useState(EMPTY_FORM);
  // Link ảnh đang hiện ở khung xem trước (cập nhật chậm hơn ô nhập, xem effect bên dưới)
  const [preview, setPreview] = useState('');
  // Ngày tạo: thêm mới là hôm nay, sửa thì giữ nguyên ngày cũ
  const [createdAt, setCreatedAt] = useState(todayString);
  // Chưa bấm Lưu thì chưa báo lỗi; bấm rồi thì lỗi cập nhật ngay khi gõ
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  // Nội dung hộp thoại báo lỗi giữ lại sau khi đóng để lúc mờ dần không bị trống
  const [alert, setAlert] = useState({ title: '', messages: [] as string[] });
  const [alertVisible, setAlertVisible] = useState(false);

  // Sửa: lấy cùng lúc danh mục và khóa học cần sửa để điền sẵn vào form
  const load = useCallback(
    () =>
      Promise.all([getCategories(), id ? getCourse(id) : undefined])
        .then(([categoryList, course]) => {
          if (course) {
            setValues({
              title: course.title,
              categoryId: course.categoryId,
              instructor: course.instructor,
              price: String(course.price),
              duration: String(course.duration),
              thumbnail: course.thumbnail,
              trailerUrl: course.trailerUrl,
              description: course.description,
            });
            setCreatedAt(course.createdAt);
          }
          setCategories(categoryList);
        })
        .catch((err) => setLoadError(getErrorMessage(err))),
    [id],
  );

  useEffect(() => {
    load();
  }, [load]);

  const retry = () => {
    setLoadError(undefined);
    load();
  };

  // Hàm cập nhật một ô của form
  const update = (field: keyof CourseFormValues) => (text: string) =>
    setValues((current) => ({ ...current, [field]: text }));

  // Ảnh xem trước: chờ ngừng gõ 0,5 giây và link đúng dạng mới tải, tránh tải thử từng ký tự lúc đang gõ
  useEffect(() => {
    const timer = setTimeout(() => setPreview(isHttpUrl(values.thumbnail) ? values.thumbnail.trim() : ''), 500);
    return () => clearTimeout(timer);
  }, [values.thumbnail]);

  const categoryIds = (categories ?? []).map((category) => category.id);
  const errors = submitted ? validateCourseForm(values, categoryIds) : {};

  const showAlert = (title: string, messages: string[]) => {
    setAlert({ title, messages });
    setAlertVisible(true);
  };

  const handleSave = async () => {
    setSubmitted(true);
    Keyboard.dismiss();
    const result = validateCourseForm(values, categoryIds);
    if (hasErrors(result)) {
      // Báo lỗi bằng hộp thoại, mỗi lỗi một dòng (dưới từng ô vẫn hiện lỗi để biết ô nào sai)
      showAlert('Thông tin chưa hợp lệ', errorMessages(result));
      return;
    }

    setSaving(true);
    try {
      // Lấy lại danh mục ngay trước khi lưu: danh mục đã chọn có thể vừa bị xóa ở nơi khác
      const latest = await getCategories();
      setCategories(latest);
      const categoryError = validateCategoryId(
        values.categoryId,
        latest.map((category) => category.id),
      );
      if (categoryError) {
        setSaving(false);
        showAlert('Thông tin chưa hợp lệ', [categoryError]);
        return;
      }

      const input = toCourseInput(values, createdAt);
      if (id) await updateCourse(id, input);
      else await createCourse(input);
      // Quay về màn hình trước; màn đó tự gọi lại API nên dữ liệu hiển thị khớp với backend
      goBack();
    } catch (err) {
      setSaving(false);
      showAlert(id ? 'Không lưu được thay đổi' : 'Không thêm được khóa học', [getErrorMessage(err)]);
    }
  };

  return (
    <SafeAreaView style={common.safeArea}>
      <KeyboardAvoidingView style={common.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScreenHeader title={id ? 'Sửa khóa học' : 'Thêm khóa học'} />

        {!!loadError && <ErrorState message={loadError} onRetry={retry} />}
        {!loadError && !categories && <LoadingState />}
        {!loadError && categories && (
          <>
            <ScrollView
              style={common.flex}
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
              <Field
                label="Tên khóa học"
                placeholder="VD: Lập trình Android cơ bản"
                value={values.title}
                onChangeText={update('title')}
                error={errors.title}
              />
              <FieldGroup label="Danh mục" error={errors.categoryId}>
                <CategorySelect
                  categories={categories}
                  value={values.categoryId}
                  onChange={update('categoryId')}
                  invalid={!!errors.categoryId}
                />
              </FieldGroup>
              <Field
                label="Giảng viên"
                placeholder="VD: Nguyễn Văn A"
                value={values.instructor}
                onChangeText={update('instructor')}
                autoCapitalize="words"
                error={errors.instructor}
              />
              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <Field
                    label="Học phí (VNĐ)"
                    placeholder="VD: 500000"
                    value={values.price}
                    onChangeText={update('price')}
                    keyboardType="numeric"
                    error={errors.price}
                  />
                </View>
                <View style={styles.rowItem}>
                  <Field
                    label="Thời lượng (giờ)"
                    placeholder="VD: 30"
                    value={values.duration}
                    onChangeText={update('duration')}
                    keyboardType="numeric"
                    error={errors.duration}
                  />
                </View>
              </View>
              <View style={styles.thumbnailGroup}>
                <Field
                  label="Link ảnh bìa"
                  placeholder="https://..."
                  value={values.thumbnail}
                  onChangeText={update('thumbnail')}
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={errors.thumbnail}
                />
                <Thumbnail uri={preview} style={styles.preview} iconSize={32} showStatus />
              </View>
              <Field
                label="Link video trailer (MP4)"
                placeholder="https://.../trailer.mp4"
                value={values.trailerUrl}
                onChangeText={update('trailerUrl')}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.trailerUrl}
              />
              <Field
                label="Mô tả"
                placeholder="Nội dung chính của khóa học"
                value={values.description}
                onChangeText={update('description')}
                multiline
                textAlignVertical="top"
                style={styles.textArea}
                error={errors.description}
              />
            </ScrollView>

            <View style={common.footer}>
              <PrimaryButton label={id ? 'Lưu thay đổi' : 'Thêm khóa học'} onPress={handleSave} loading={saving} />
            </View>
          </>
        )}
      </KeyboardAvoidingView>

      <AlertDialog
        visible={alertVisible}
        title={alert.title}
        messages={alert.messages}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
}
