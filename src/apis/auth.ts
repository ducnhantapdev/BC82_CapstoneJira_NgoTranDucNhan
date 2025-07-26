import fetcher from "./fetcher";

interface LoginRequest {
  email: string;
  passWord: string;
}

export const loginAuthAPI = async (data: LoginRequest) => {
  try {
    const response = await fetcher.post("Users/signin", data);
    console.log("data đăng nhập", response.data);
    return response.data;
  } catch (error) {
    throw Error(`Login failed: ${error}`);
  }
};
