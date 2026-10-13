import type { Category, CategoryInput } from '@/types';

import { request, requestList } from './client';

// GET /categories: danh sách danh mục
export function getCategories() {
  return requestList<Category>('/categories');
}

// POST /categories: thêm danh mục
export function createCategory(input: CategoryInput) {
  return request<Category>('POST', '/categories', input);
}

// PUT /categories/{id}: sửa danh mục
export function updateCategory(id: string, input: CategoryInput) {
  return request<Category>('PUT', `/categories/${id}`, input);
}

// DELETE /categories/{id}: xóa danh mục (màn hình danh mục kiểm tra không còn khóa học nào trước khi gọi)
export function deleteCategory(id: string) {
  return request<Category>('DELETE', `/categories/${id}`);
}
