import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="page-container py-16 md:py-24">
      <div className="max-w-3xl">
        <h1 className="text-4xl leading-tight font-black tracking-[-0.045em] md:text-6xl">
          Một nơi đáng tin cậy để sinh viên nhìn thấy con đường phía trước.
        </h1>
        <p className="text-muted-500 mt-6 text-lg leading-8">
          Student Opportunity Hub tập trung thông tin đang phân tán, chuẩn hóa dữ liệu và giúp mỗi
          cơ hội trở nên dễ tìm, dễ hiểu, dễ theo dõi hơn.
        </p>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        <div className="surface-card p-7">
          <Sparkles className="text-primary-500" />
          <h2 className="mt-6 text-xl font-extrabold">Sinh viên là trung tâm</h2>
          <p className="text-muted-500 mt-3 leading-7">
            Khách có thể khám phá tự do; đăng nhập chỉ khi cần lưu và cá nhân hóa.
          </p>
        </div>
        <div className="surface-card p-7">
          <ShieldCheck className="text-primary-500" />
          <h2 className="mt-6 text-xl font-extrabold">Tin cậy có kiểm soát</h2>
          <p className="text-muted-500 mt-3 leading-7">
            Nguồn, hạn, điều kiện và người chịu trách nhiệm luôn được làm rõ.
          </p>
        </div>
        <div className="surface-card p-7">
          <CheckCircle2 className="text-primary-500" />
          <h2 className="mt-6 text-xl font-extrabold">Thông tin chuẩn hóa</h2>
          <p className="text-muted-500 mt-3 leading-7">
            Bảy nhóm cơ hội cùng một cấu trúc để sinh viên dễ so sánh.
          </p>
        </div>
      </div>
      <div className="bg-primary-500 mt-14 rounded-[22px] p-8 text-white md:flex md:items-center md:justify-between md:p-12">
        <div>
          <h2 className="text-2xl font-extrabold">Sẵn sàng tìm cơ hội tiếp theo?</h2>
          <p className="text-primary-100 mt-2">
            Bắt đầu bằng một từ khóa hoặc một nhóm cơ hội bạn quan tâm.
          </p>
        </div>
        <Link className="btn text-primary-600 mt-6 bg-white md:mt-0" to="/opportunities">
          Khám phá ngay
        </Link>
      </div>
    </div>
  );
}
