import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { styles } from '@/styles/field';
import { colors } from '@/styles/theme';
import type { Category } from '@/types';

type CategorySelectProps = {
  // Danh mục lấy từ API categories
  categories: Category[];
  // id danh mục đang chọn; rỗng = chưa chọn
  value: string;
  onChange: (categoryId: string) => void;
  invalid?: boolean;
};

// Ô chọn danh mục kiểu dropdown: bấm vào mở danh sách danh mục, chọn một dòng thì đóng lại
export function CategorySelect({ categories, value, onChange, invalid = false }: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const selected = categories.find((category) => category.id === value);

  const choose = (categoryId: string) => {
    onChange(categoryId);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.input, styles.select, invalid && styles.inputError, pressed && styles.pressed]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Chọn danh mục"
      >
        <Text style={selected ? styles.selectText : styles.selectPlaceholder} numberOfLines={1}>
          {selected ? selected.name : 'Chọn danh mục'}
        </Text>
        <Icon name="chevronDown" color={colors.muted} />
      </Pressable>

      <Modal
        transparent
        visible={open}
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.backdrop}>
          <Pressable style={styles.backdropTouch} onPress={() => setOpen(false)} accessibilityLabel="Đóng" />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Chọn danh mục</Text>
            <ScrollView>
              {categories.map((category) => {
                const isSelected = category.id === value;
                return (
                  <Pressable
                    key={category.id}
                    style={({ pressed }) => [styles.option, isSelected && styles.optionSelected, pressed && styles.pressed]}
                    onPress={() => choose(category.id)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <View style={styles.optionText}>
                      <Text style={styles.optionName}>{category.name}</Text>
                      <Text style={styles.optionDescription} numberOfLines={1}>
                        {category.description}
                      </Text>
                    </View>
                    {isSelected && <Icon name="check" color={colors.primary} />}
                  </Pressable>
                );
              })}
              {categories.length === 0 && (
                <Text style={styles.optionsEmpty}>Chưa có danh mục nào. Hãy thêm ở màn hình Danh mục.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
