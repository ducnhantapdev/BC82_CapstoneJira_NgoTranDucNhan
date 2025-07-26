import fetcher from "./fetcher";

export interface ProjectList {
  members: Array<object>;
  creator: object;
  id: number;
  projectName: string;
  description: string;
  categoryId: number;
  categoryName: string;
  alias: string;
  deleted: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  content: T;
  dateTime: Date;
  messageConstants: null;
}

export const getProjectsAPI = async () => {
  try {
    const res = await fetcher.get<ApiResponse<ProjectList[]>>(
      "Project/getAllProject",
      {
        headers: {
          TokenCybersoft:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MiIsIkhldEhhblN0cmluZyI6IjE2LzExLzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc2MzI1MTIwMDAwMCIsIm5iZiI6MTczNDMwNzIwMCwiZXhwIjoxNzYzNDI0MDAwfQ.AW3E6NCoEbvlvXPJj53HWqfHPdZa9NXeq3K-0GZPpUI",
        },
      }
    );
    return res.data.content;
  } catch (error) {
    console.error("Error fetching project list:", error);
    throw error;
  }
};
