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

export interface ProjectDetail {
  projectName: string;
  creator: number;
  description: string;
  categoryId: number;
}

export interface ProjectCategory {
  id: number;
  projectCategoryName: string;
}

export interface UserAsign {
  userId: number;
  projectId: number;
}

export const getProjectsAPI = async () => {
  try {
    const res = await fetcher.get<ApiResponse<ProjectList[]>>(
      "Project/getAllProject"
    );
    return res.data.content;
  } catch (error) {
    console.error("Error fetching project list:", error);
    throw error;
  }
};

export const createProject = async (projectData: ProjectDetail) => {
  try {
    const res = await fetcher.post<ApiResponse<ProjectList>>(
      "Project/createProjectAuthorize",
      projectData
    );
    return res.data.content;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getProjectDetailById = async (id: number) => {
  try {
    const res = await fetcher.get<ApiResponse<ProjectList>>(
      `Project/getProjectDetail?idProject=${id}`
    );
    return res.data.content;
  } catch (error) {
    console.error("Error fetching project detail:", error);
    throw error;
  }
};

export const getCatogories = async () => {
  try {
    const res = await fetcher.get<ApiResponse<{ category: ProjectCategory[] }>>(
      "ProjectCategory"
    );

    return res.data.content;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const deleteProject = async (id: number) => {
  try {
    const res = await fetcher.delete<ApiResponse<{ message: string }>>(
      `Project/deleteProject?projectId=${id}`
    );
    return res.data.content;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const assignUserProject = async (data: UserAsign) => {
  try {
    const res = await fetcher.post<ApiResponse<{ message: string }>>(
      "Project/assignUserProject",
      data
    );
    return res.data.content;
  } catch (error) {
    console.error("Error fetching project list:", error);
    throw error;
  }
};
