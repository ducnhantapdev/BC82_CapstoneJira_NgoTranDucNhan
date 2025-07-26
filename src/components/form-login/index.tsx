import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginAuthAPI } from "../../apis/auth";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../routes/path";

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
      navigate(PATH.HOME); // Chuyển đến trang Home sau khi đăng nhập thành công
    } catch (error) {
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
      console.error("Lỗi đăng nhập:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Mật khẩu"
            {...register("password")}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Đăng nhập
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
