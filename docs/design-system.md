# Design system triển khai

## Nguồn concept

- `docs/design/homepage-concept.png`
- `docs/design/opportunities-concept.png`
- `docs/design/student-dashboard-concept.png`

## Token

- Primary `#0B5CFF`, primary hover `#0748CC`, primary soft `#EAF2FF`.
- Navy text `#071B44`, body `#344563`, muted `#6B7894`.
- Background thật trắng `#FFFFFF`; supportive background `#F4F8FF`; surface `#FFFFFF`.
- Border `#DCE5F2`; success `#118A5B`; warning `#F59E0B`; error/deadline `#F05252`.
- Radius: 10/14/18/24px; shadow ngắn, khuếch tán nhẹ; spacing base 4px.
- Typography: Inter/system sans, heading đậm vừa với tracking âm nhẹ; control 14–15px.

## Kiến trúc giao diện

- Public: header yên tĩnh, content max-width 1200–1280px, hero chia 2 vùng, rail/card mở.
- Discovery: sidebar 268px + result column; mobile chuyển filter thành drawer.
- Student: sidebar 248px, top bar và main 2 cột; mobile dùng compact header/nav.
- Card cơ hội dùng cùng anatomy: cover, category, title, organization, metadata, tags, deadline, save/action.

## Copy phía trên fold được phép

Brand, bốn nav item, Đăng nhập, Đăng ký, headline “Mở đúng cánh cửa cho hành trình của bạn”, mô tả sản phẩm, “Khám phá cơ hội”, “Dành cho đối tác”, placeholder tìm kiếm. Không thêm eyebrow hoặc metric vào hero.

## Icon và chuyển động

Lucide outline, stroke nhất quán; filled bookmark chỉ cho trạng thái đã lưu. Hover nâng 2px, focus ring cobalt 3px, drawer/modal fade-slide 180–220ms; tôn trọng `prefers-reduced-motion`.
