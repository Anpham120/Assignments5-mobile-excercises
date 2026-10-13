import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createCategory, getCategories, updateCategory } from '@/api/categories';
import { ApiError, getErrorMessage } from '@/api/client';
import { AlertDialog } from '@/components/AlertDialog';
import { Field } from '@/components/FormField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ErrorState, LoadingState } from '@/components/StateView';
import { common } from '@/styles/common';
import { styles } from '@/styles/form';
import type { Category } from '@/types';
import { goBack } from '@/utils/navigation';
import {
  errorMessages,
  hasErrors,
  toCategoryInput,
  validateCategoryForm,
  type CategoryFormValues,
} from '@/utils/validation';

// Thêm danh mục (không có tham số id) hoặc sửa danh mục (id của danh mục cần sửa)
export default function CategoryFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  // Các danh mục hiện có: để điền sẵn khi sửa và kiểm tra trùng tên; null = đang tải
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loadError, setLoadError] = useState<string>();
  const [values, setValues] = useState<CategoryFormValues>({ name: '', description: '' });
  // Chưa bấm Lưu thì chưa báo lỗi; bấm rồi thì lỗi cập nhật ngay khi gõ
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  // Nội dung hộp thoại báo lỗi giữ lại sau khi đóng để lúc mờ dần không bị trống
  const [alert, setAlert] = useState({ title: '', messages: [] as string[] });
  const [alertVisible, setAlertVisible] = useState(false);

  const load = useCallback(
    () =>
      getCategories()
        .then((list) => {
          if (id) {
            // Đề bài chỉ có GET /categories (không có GET /categories/{id}) nên tìm danh mục cần sửa trong danh sách
            const current = list.find((category) => category.id === id);
            if (!current) throw new ApiError('Không tìm thấy danh mục, có thể đã bị xóa.', 404);
            setValues({ name: current.name, description: current.description });
          }
          setCategories(list);
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
  const update = (field: keyof CategoryFormValues) => (text: string) =>
    setValues((current) => ({ ...current, [field]: text }));

  // Tên các danh mục khác (khi sửa thì bỏ chính danh mục đang sửa) để kiểm tra trùng tên
  const otherNames = (categories ?? []).filter((category) => category.id !== id).map((category) => category.name);
  const errors = submitted ? validateCategoryForm(values, otherNames) : {};

  const showAlert = (title: string, messages: string[]) => {
    setAlert({ title, messages });
    setAlertVisible(true);
  };

  const handleSave = async () => {
    setSubmitted(true);
    Keyboard.dismiss();
    const result = validateCategoryForm(values, otherNames);
    if (hasErrors(result)) {
      showAlert('Thông tin chưa hợp lệ', errorMessages(result));
      return;
    }

    setSaving(true);
    try {
      const input = toCategoryInput(values);
      if (id) await updateCategory(id, input);
      else await createCategory(input);
      // Màn hình danh mục tự tải lại khi hiện ra
      goBack();
    } catch (err) {
      setSaving(false);
      showAlert(id ? 'Không lưu được thay đổi' : 'Không thêm được danh mục', [getErrorMessage(err)]);
    }
  };

  return (
    <SafeAreaView style={common.safeArea}>
      <KeyboardAvoidingView style={common.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScreenHeader title={id ? 'Sửa danh mục' : 'Thêm danh mục'} />

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
                label="Tên danh mục"
                placeholder="VD: Lập trình Mobile"
                value={values.name}
                onChangeText={update('name')}
                error={errors.name}
              />
              <Field
                label="Mô tả"
                placeholder="VD: Android, Flutter, React Native"
                value={values.description}
                onChangeText={update('description')}
                multiline
                textAlignVertical="top"
                style={styles.textArea}
                error={errors.description}
              />
            </ScrollView>

            <View style={common.footer}>
              <PrimaryButton label={id ? 'Lưu thay đổi' : 'Thêm danh mục'} onPress={handleSave} loading={saving} />
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
