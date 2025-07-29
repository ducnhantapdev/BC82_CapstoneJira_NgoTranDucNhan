import fetcher from "./fetcher";

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  content: T;
  dateTime: Date;
  messageConstants: null;
}

export interface User {
  userId: number;
  name: string;
  avatar: string;
  email: string;
  phoneNumber: string;
}

export const getUsersAPI = async () => {
  try {
    const res = await fetcher.get<ApiResponse<User[]>>("Users/getUser");
    return res.data.content;
  } catch (error) {
    console.error("Error fetching project list:", error);
    throw error;
  }
};

export const getUserById = async (id: number) => {
  try {
    const res = await fetcher.get<ApiResponse<User[]>>(
      `getUserByProjectId?idProject=${id}`
    );
    return res.data.content;
  } catch (error) {
    console.error("Error fetching project detail:", error);
    throw error;
  }
};
