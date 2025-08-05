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

export interface editUser {
  id: string;
  passWord: string;
  email: string;
  name: string;
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

export const updateUser = async (id: number, data: editUser) => {
  try {
    const res = await fetcher.put<ApiResponse<{ message: string }>>(
      `Users/editUser?userId=${id}`,
      data
    );
    return res.data.content;
  } catch (error) {
    console.error("Error fetching edit user:", error);
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const res = await fetcher.delete<ApiResponse<{ message: string }>>(
      `Users/deleteUser?id=${id}`
    );
    return res.data.content;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
