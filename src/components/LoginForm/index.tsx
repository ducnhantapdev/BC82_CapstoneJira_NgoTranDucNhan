import { useState } from "react";
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
  passWord: string;
  rememberMe: boolean;
};

interface LoginResponse {
  content?: {
    accessToken: string;
    user?: {
      userId: number;
      name: string;
      email: string;
      phoneNumber: string;
      avatar?: string;
    };
    userId?: number;
    name?: string;
    email?: string;
    phoneNumber?: string;
    avatar?: string;
    id?: number;
  };
  accessToken?: string;
  user?: {
    userId: number;
    name: string;
    email: string;
    phoneNumber: string;
    avatar?: string;
  };
  userId?: number;
  name?: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  message?: string;
  id?: number;
}

const schema = yup.object({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  passWord: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Vui lòng nhập mật khẩu"),
  rememberMe: yup.boolean().default(false),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: localStorage.getItem("rememberedEmail") || "",
      rememberMe: !!localStorage.getItem("rememberedEmail"),
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      const response = (await loginAuthAPI({
        email: data.email,
        passWord: data.passWord,
      })) as LoginResponse;

      console.log("Response từ API:", response);
      console.log("Response type:", typeof response);
      console.log("Response keys:", Object.keys(response || {}));

      let userData;

      // Debug chi tiết cấu trúc response
      if (response.content) {
        console.log("Có response.content:", response.content);
        console.log(
          "response.content keys:",
          Object.keys(response.content || {})
        );

        userData = {
          accessToken: response.content.accessToken,
          userId: response.content.user?.userId || response.content.userId,
          name: response.content.user?.name || response.content.name,
          email: response.content.user?.email || response.content.email,
          phoneNumber:
            response.content.user?.phoneNumber || response.content.phoneNumber,
          avatar: response.content.user?.avatar || response.content.avatar,
        };
      } else {
        console.log("Không có response.content, sử dụng response trực tiếp");
        console.log("response keys:", Object.keys(response || {}));

        userData = {
          accessToken: response.accessToken,
          userId: response.user?.userId || response.userId,
          name: response.user?.name || response.name,
          email: response.user?.email || response.email,
          phoneNumber: response.user?.phoneNumber || response.phoneNumber,
          avatar: response.user?.avatar || response.avatar,
        };
      }

      console.log("userData sau khi xử lý:", userData);

      if (!userData.accessToken) {
        throw new Error("Không nhận được token từ server");
      }

      if (!userData.userId) {
        console.error("userData.userId không tồn tại:", userData);
        console.error("Response gốc:", response);

        // Thử tìm userId ở các vị trí khác
        const possibleUserId =
          response.content?.user?.userId ||
          response.content?.userId ||
          response.user?.userId ||
          response.userId ||
          response.content?.id ||
          response.id;

        if (possibleUserId) {
          console.log("Tìm thấy userId ở vị trí khác:", possibleUserId);
          userData.userId = possibleUserId;
        } else {
          throw new Error(
            "Không nhận được thông tin user từ server. Vui lòng kiểm tra console để xem cấu trúc response."
          );
        }
      }

      localStorage.setItem("user", JSON.stringify(userData));

      if (data.rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      toast.success("Đăng nhập thành công!");
      console.log("Dữ liệu user đã lưu:", userData);

      reset();

      setTimeout(() => {
        navigate(PATH.HOME);
      }, 1500);
    } catch (error: unknown) {
      console.error("Lỗi đăng nhập:", error);

      let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại!";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (error && typeof error === "object" && "message" in error) {
        const errorWithMessage = error as { message: string };
        errorMessage = errorWithMessage.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToRegister = () => {
    navigate(PATH.REGISTER);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Đăng nhập
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              {...register("passWord")}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.passWord && (
              <p className="text-red-500 text-sm mt-1">
                {errors.passWord.message}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="mr-2"
            />
            <label className="text-sm text-gray-600">Ghi nhớ đăng nhập</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{" "}
            <button
              onClick={handleGoToRegister}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button className="text-gray-500 hover:text-gray-700 text-sm">
            Quên mật khẩu?
          </button>
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
