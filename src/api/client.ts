// Địa chỉ API của project MockAPI; muốn dùng project khác thì đổi mã project ở đây
export const API_URL = 'https://6acdf8f5f338359cf1c2c3d9.mockapi.io/api/v1';

// Quá thời gian này mà máy chủ chưa trả lời thì báo lỗi, không để màn hình chờ mãi
const TIMEOUT_MS = 15000;

// Lỗi khi gọi API; message là câu tiếng Việt hiện thẳng cho người dùng
export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Gọi một endpoint của MockAPI và trả về JSON đã parse; body (nếu có) được gửi lên dạng JSON
export async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    // fetch chỉ ném lỗi khi không tới được máy chủ: mất mạng, sai địa chỉ hoặc quá thời gian chờ
    throw new ApiError('Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.');
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 404) throw new ApiError('Không tìm thấy dữ liệu, có thể đã bị xóa.', 404);
  if (!response.ok) throw new ApiError(`Máy chủ báo lỗi (mã ${response.status}). Thử lại sau.`, response.status);
  return (await response.json()) as T;
}

// Lấy cả danh sách. MockAPI trả 404 "Not found" thay vì [] khi không có bản ghi nào, nên coi 404 là danh sách rỗng
export async function requestList<T>(path: string): Promise<T[]> {
  try {
    return await request<T[]>('GET', path);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return [];
    throw error;
  }
}

// Câu báo lỗi để hiện lên màn hình, kể cả với lỗi bất ngờ không phải ApiError
export function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Đã có lỗi xảy ra. Thử lại sau.';
}
