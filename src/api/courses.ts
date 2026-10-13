import type { Course, CourseInput } from '@/types';

import { request, requestList } from './client';

// GET /courses: danh sách khóa học
export function getCourses() {
  return requestList<Course>('/courses');
}

// GET /courses/{id}: chi tiết khóa học
export function getCourse(id: string) {
  return request<Course>('GET', `/courses/${id}`);
}

// POST /courses: thêm khóa học, MockAPI trả về khóa học kèm id vừa sinh
export function createCourse(input: CourseInput) {
  return request<Course>('POST', '/courses', input);
}

// PUT /courses/{id}: sửa khóa học
export function updateCourse(id: string, input: CourseInput) {
  return request<Course>('PUT', `/courses/${id}`, input);
}

// DELETE /courses/{id}: xóa khóa học
export function deleteCourse(id: string) {
  return request<Course>('DELETE', `/courses/${id}`);
}
