# Tóm tắt yêu cầu sản phẩm

## Mục tiêu sản phẩm

Student Opportunity Hub là bảng tin điện tử tập trung, chuẩn hóa và có kiểm duyệt cho các cơ hội dành cho sinh viên. Sản phẩm giúp sinh viên tìm đúng cơ hội trong tối đa ba phút, nhận biết rõ nguồn, điều kiện và hạn đăng ký; đồng thời cung cấp cho nhà trường và đối tác một quy trình đăng, duyệt và đo lường thống nhất.

## Phạm vi MVP

- Bảng tin web responsive cho 7 nhóm cơ hội: thực tập, việc làm startup, cuộc thi đổi mới sáng tạo, hackathon, học bổng, quỹ đầu tư và chương trình ươm tạo.
- Tìm kiếm, lọc nhiều tiêu chí, sắp xếp, phân trang/tải thêm và trang chi tiết chuẩn hóa.
- Đăng ký/đăng nhập, xác minh email, quên mật khẩu và phân quyền theo vai trò.
- Hồ sơ sở thích sinh viên, lưu/bỏ lưu, theo dõi và nhắc hạn.
- Cổng đối tác tạo nháp, xem trước, gửi duyệt, sửa và theo dõi trạng thái.
- Hàng đợi kiểm duyệt, quyết định duyệt/yêu cầu sửa/từ chối, báo cáo nội dung và nhật ký.
- Quản trị người dùng, vai trò, danh mục, cấu hình, dashboard và báo cáo cơ bản.

## Nhóm người dùng

1. Guest: xem, tìm kiếm và lọc nội dung công khai.
2. Student: lưu, theo dõi, nhận thông báo, quản lý hồ sơ và sở thích.
3. Partner: tạo và quản lý bài đăng thuộc tổ chức.
4. Moderator: kiểm duyệt bài, xử lý báo cáo và quản lý vòng đời nội dung.
5. Administrator: quản lý người dùng, quyền, danh mục, cấu hình, nhật ký và báo cáo.

## Danh sách chức năng

- Khám phá cơ hội: bảng tin, tìm kiếm, bộ lọc, sort, chi tiết, chia sẻ, điều hướng đăng ký ngoài hệ thống.
- Cá nhân hóa: hồ sơ quan tâm, cơ hội đã lưu, lịch sử xem và gợi ý cơ bản.
- Thông báo: nhắc hạn, thay đổi bài đã lưu, cơ hội mới phù hợp, đọc/chưa đọc và tùy chọn đồng ý.
- Nội dung đối tác: draft, preview, submit, revision, close request và thống kê tổng hợp.
- Kiểm duyệt: review queue, decision reason, hide/remove, report handling và cảnh báo trùng.
- Quản trị/vận hành: user/role/category, audit log, dashboard, lifecycle và export trong giai đoạn sau.

## Business rules

- Mỗi cơ hội có đúng một loại chính nhưng có thể có nhiều lĩnh vực, kỹ năng và thẻ.
- Bài thiếu dữ liệu bắt buộc không được công khai; bài đối tác phải qua kiểm duyệt.
- Hạn đăng ký không trước ngày công bố; qua hạn chuyển `EXPIRED` và không còn ở danh sách đang mở.
- `DRAFT` và `PENDING_REVIEW` không công khai; thay đổi quan trọng cần lưu phiên bản.
- Guest xem nội dung công khai; đăng nhập bắt buộc cho lưu, theo dõi và thông báo.
- Mỗi user chỉ lưu một lần cho một opportunity; thao tác thử lại phải tránh tạo trùng.
- Bài hết hạn/đã đóng không thể đăng ký; nút đăng ký chỉ mở nguồn chính thức và phải cảnh báo rời hệ thống.
- Không tự động xóa bài nghi trùng; quyết định thuộc kiểm duyệt viên.
- Quyết định duyệt, ẩn, gỡ, khóa phải lưu tác nhân, thời gian và lý do.
- Dữ liệu đối tác chỉ là tổng hợp, không công khai danh tính sinh viên.

## Không thuộc MVP

- Nộp CV nội bộ, phỏng vấn, chấm ứng viên hoặc quy trình tuyển dụng hoàn chỉnh.
- Thanh toán, giải ngân học bổng/quỹ, hợp đồng lao động.
- Quản lý học tập, điểm số hoặc hồ sơ học vụ.
- Ứng dụng mobile native và crawler tự do từ website ngoài.

## Open Questions

- OQ-01: dùng SSO/email trường hay tài khoản độc lập?
- OQ-02: đối tác tự đăng ký hay do quản trị mời/tạo?
- OQ-03: mốc nhắc hạn mặc định là bao nhiêu ngày?
- OQ-04: khách có xem lịch sử bài hết hạn không?
- OQ-05: MVP chỉ tiếng Việt hay song ngữ?
- OQ-06: thời hạn lưu nhật ký và dữ liệu tài khoản?
- OQ-07: KPI chính thức sau thử nghiệm?
- Chính sách nào khiến thay đổi trên bài `OPEN` bắt buộc duyệt lại?
- Quy tắc mở lại bài hết hạn/đã đóng và ai có quyền cuối cùng?
