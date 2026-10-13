# Course Manager – Quản lý khóa học

Ứng dụng di động quản lý khóa học trực tuyến (bài tập 5), dùng [MockAPI](https://mockapi.io/) làm backend. Viết bằng React Native (Expo SDK 57, Expo Router, TypeScript); ảnh bìa tải bằng `expo-image`, video trailer phát bằng `expo-video`.

## MockAPI

Base URL: `https://6acdf8f5f338359cf1c2c3d9.mockapi.io/api/v1`

- Danh mục: <https://6acdf8f5f338359cf1c2c3d9.mockapi.io/api/v1/categories>
- Khóa học: <https://6acdf8f5f338359cf1c2c3d9.mockapi.io/api/v1/courses>

Dữ liệu mẫu gồm 3 danh mục và 10 khóa học. Ảnh bìa lấy từ `picsum.photos`, trailer là file MP4 trực tiếp.

| Method | Endpoint | Dùng ở |
|---|---|---|
| GET | `/categories` | danh sách khóa học (lọc, tra tên danh mục), form khóa học (ô chọn danh mục), quản lý danh mục |
| POST | `/categories` | thêm danh mục |
| PUT | `/categories/{id}` | sửa danh mục |
| DELETE | `/categories/{id}` | xóa danh mục |
| GET | `/courses` | danh sách khóa học, đếm số khóa học của từng danh mục |
| GET | `/courses/{id}` | chi tiết khóa học, nạp form sửa |
| POST | `/courses` | thêm khóa học |
| PUT | `/courses/{id}` | sửa khóa học |
| DELETE | `/courses/{id}` | xóa khóa học |

Muốn dùng project MockAPI khác: sửa `API_URL` trong [src/api/client.ts](src/api/client.ts) (cần 2 resource `categories` và `courses` đúng các trường như đề bài).

## Chạy ứng dụng

Yêu cầu: Node.js và npm (đã chạy thử với Node 24).

```bash
npm install
npm run web        # chạy trên trình duyệt
npm start          # menu Expo: quét QR bằng Expo Go, hoặc bấm a để mở Android emulator
npm run android    # mở thẳng trên Android emulator / thiết bị
```

Khi chạy bằng Expo Go, bản Expo Go trên máy phải hỗ trợ SDK 57 (nếu Expo Go mới chỉ hỗ trợ SDK cao hơn thì cài bản tương thích SDK 57, hoặc dùng `npm run web`).

Kiểm tra mã nguồn:

```bash
npm test             # test các hàm kiểm tra dữ liệu và định dạng
npm run lint
npx tsc --noEmit     # kiểm tra kiểu TypeScript
```

## Chức năng

| Màn hình | Nội dung |
|---|---|
| Danh sách khóa học (`/`) | Ảnh bìa, tên, giảng viên, danh mục, học phí. Tìm theo tên (gõ không dấu vẫn tìm được), lọc theo danh mục, kéo xuống để tải lại. Bấm vào một khóa học để xem chi tiết. |
| Chi tiết khóa học (`/course/[id]`) | Đầy đủ thông tin, ảnh bìa, tên danh mục. Nút **Xem trailer**, nút **Sửa**, nút **Xóa** (hỏi xác nhận trước khi xóa). |
| Trailer (`/trailer`) | Phát video MP4 ngay trong ứng dụng, có điều khiển và toàn màn hình. |
| Thêm / sửa khóa học (`/course-form`) | Ô chọn danh mục lấy từ API, xem trước ảnh bìa theo link, nhập link trailer, kiểm tra dữ liệu trước khi lưu. |
| Quản lý danh mục (`/categories`, `/category-form`) | Xem (kèm số khóa học), thêm, sửa, xóa danh mục. Không cho xóa danh mục đang có khóa học. |

Mọi màn hình lấy dữ liệu đều xử lý ba trạng thái: đang tải, lỗi kết nối (có nút **Thử lại**) và danh sách rỗng.

## Gọi API và xử lý dữ liệu

- [src/api/client.ts](src/api/client.ts): hàm `request` dùng `fetch`, gửi và nhận JSON, giới hạn 15 giây, đổi lỗi mạng hoặc mã HTTP lỗi thành câu báo lỗi tiếng Việt (`ApiError`).
- [src/api/courses.ts](src/api/courses.ts), [src/api/categories.ts](src/api/categories.ts): mỗi endpoint một hàm.
- MockAPI trả `404` thay vì `[]` khi không còn bản ghi nào, nên `requestList` coi `404` của một danh sách là danh sách rỗng.
- Mỗi màn hình gọi lại API mỗi khi hiện ra (`useFocusEffect`), nên sau khi thêm, sửa, xóa danh sách luôn khớp với backend.
- Tên danh mục luôn tra từ API `categories` theo `categoryId`; trong code không có danh sách danh mục hay khóa học viết sẵn.
- MockAPI không có khóa ngoại nên ứng dụng tự kiểm tra:
  - `categoryId` phải có trong danh sách danh mục; danh sách được lấy lại ngay trước khi lưu khóa học.
  - Danh mục chỉ xóa được khi không còn khóa học nào; số khóa học được lấy lại ngay trước khi xóa.

## Kiểm tra dữ liệu nhập

Khóa học:

- Tên, giảng viên, mô tả: bắt buộc.
- Danh mục: bắt buộc chọn và phải còn tồn tại.
- Học phí: là số, không âm (dấu chấm, phẩy, cách chỉ là phân cách hàng nghìn, nên `500.000` = 500000).
- Thời lượng: số giờ lớn hơn 0 (nhận cả `1,5`).
- Link ảnh bìa và link trailer: bắt đầu bằng `http://` hoặc `https://`.
- Link trailer phải là file video trực tiếp (MP4); link YouTube bị từ chối vì là trang web chứ không phải file video.

Danh mục: tên bắt buộc và không trùng tên danh mục khác (không phân biệt hoa thường), mô tả bắt buộc.

## Cấu trúc thư mục

```
src/
  api/         gọi MockAPI (client, courses, categories)
  app/         các màn hình (Expo Router)
  components/  thành phần dùng chung: ô nhập, hộp thoại, ảnh, trạng thái tải/lỗi/rỗng
  styles/      style tách riêng cho từng màn hình và thành phần
  utils/       kiểm tra dữ liệu, định dạng, điều hướng (kèm test)
  types.ts     kiểu Category, Course
```
