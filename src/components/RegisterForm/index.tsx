import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUserAPI } from "../../apis/users";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../routes/path";

type RegisterForm = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phoneNumber: string;
};

interface RegisterResponse {
  content: unknown;
  [key: string]: unknown;
}

const schema = yup.object({
  name: yup
    .string()
    .required("Vui lòng nhập họ tên")
    .min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  phoneNumber: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(
      /^(0|\+84)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/,
      "Số điện thoại không đúng định dạng Việt Nam"
    ),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Vui lòng nhập mật khẩu"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
});

export default function RegisterForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      const response = (await registerUserAPI({
        email: data.email,
        passWord: data.password,
        name: data.name,
        phoneNumber: data.phoneNumber,
      })) as unknown as RegisterResponse;

      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      console.log("Đăng ký thành công:", response);

      reset();

      setTimeout(() => {
        navigate(PATH.LOGIN);
      }, 2000);
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);

      let errorMessage = "Đăng ký thất bại. Vui lòng thử lại!";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate(PATH.LOGIN);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Đăng ký tài khoản
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Họ tên"
              {...register("name")}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

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
              type="tel"
              placeholder="Số điện thoại"
              {...register("phoneNumber")}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phoneNumber.message}
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

          {/* Xác nhận mật khẩu */}
          <div>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              {...register("confirmPassword")}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Nút đăng ký */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        {/* Link chuyển về đăng nhập */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Đã có tài khoản?{" "}
            <button
              onClick={handleGoToLogin}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Đăng nhập ngay
            </button>
          </p>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
