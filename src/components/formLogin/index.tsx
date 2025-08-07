import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginAuthAPI } from "../../apis/auth";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../routes/path";

import { Link } from "react-router-dom";

type LoginForm = {
  email: string;
  password: string;
};

interface LoginResponse {
  content: unknown;
  [key: string]: unknown;
}

const schema = yup.object({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: yup
    .string()
    .min(6, "Tối thiểu 6 ký tự")
    .required("Vui lòng nhập mật khẩu"),
});

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = (await loginAuthAPI({
        email: data.email,
        passWord: data.password,
      })) as LoginResponse;
      toast.success("Đăng nhập thành công");
      console.log(response.content);
      localStorage.setItem("user", JSON.stringify(response.content));
      navigate(PATH.HOME);
    } catch (error) {
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
      console.error("Lỗi đăng nhập:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Mật khẩu"
              {...register("password")}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Đăng nhập
          </button>
        </form>

        {/* Link chuyển đến đăng ký */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              to={PATH.REGISTER}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
