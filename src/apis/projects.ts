import fetcher from "./fetcher";

export interface ProjectMember {
  userId: number;
  name?: string;
  avatar?: string;
}

export interface ProjectCreator {
  id: number;
  name?: string;
  avatar?: string;
}

export interface ProjectList {
  members: ProjectMember[];
  creator: ProjectCreator;
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
  categoryId?: string;
  id?: number;
}

export interface ProjectCategory {
  id: number;
  projectCategoryName: string;
}

export interface UserAsign {
  userId: number;
  projectId: number;
  avatar?: string;
  name?: string;
}

export interface Task {
  statusId: number;
  statusName: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  dueDate?: string;
  lstTaskDeTail?: TaskDetail[];
}

export interface TaskDetail {
  taskId: number;
  taskName: string;
  description?: string;
  priority?: string;
  assignee?: string;
  taskType?: string;
  assigness?: UserAsign[];
  priorityTask?: PriorityTask;
}

export interface PriorityTask {
  priorityId: number;
  priority: string;
}

export interface ProjectUpdate {
  lstTask: Task[];
  members: Array<object>;
  creator: Array<object>;
  id: number;
  projectName: string;
  description: string;
  projectCategory: object;
  categoryId: number;
  alias: string;
}

export interface UpdateStatus {
  taskId: number;
  statusId: number;
}

export interface Priority {
  priorityId: number;
  projectCategoryName: string;
  description: "string";
  deleted: boolean;
  alias: string;
  priority: "tring";
}

export interface Status {
  statusId: number;
  statusName: string;
  alias: string;
  delete: boolean;
}

export interface TaskType {
  id: 2;
  taskType: string;
}

export interface CreateTask {
  listUserAsign?: number[];
  taskName: string;
  description?: string;
  statusId?: number;
  originalEstimate?: number;
  timeTrackingSpent?: number;
  timeTrackingRemaining?: number;
  projectId?: number;
  typeId?: number;
  priorityId: number;
}

export interface Description {
  taskId: number;
  description: "string";
}

export interface Priority {
  taskId: number;
  priorityId: number;
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
    const res = await fetcher.get<ApiResponse<ProjectUpdate>>(
      `Project/getProjectDetail?id=${id}`
    );
    return res.data.content;
  } catch (error) {
    console.error("Error fetching project detail:", error);
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

export const removeUserFromProject = async (data: UserAsign) => {
  try {
    const res = await fetcher.post<ApiResponse<{ message: string }>>(
      "Project/removeUserFromProject",
      data
    );
    return res.data.content;
  } catch (error) {
    console.error("Error fetching project list:", error);
    throw error;
  }
};

export const updateProject = async (id: number, data: ProjectDetail) => {
  try {
    const res = await fetcher.put<ApiResponse<{ message: string }>>(
      `Project/updateProject?projectId=${id}`,
      data
    );
    return res.data.content;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const updateStatus = async (data: UpdateStatus) => {
  try {
    const res = await fetcher.put<ApiResponse<{ message: string }>>(
      `Project/updateStatus`,
      data
    );
    return res.data.content;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const getAllStatus = async () => {
  try {
    const res = await fetcher.get<ApiResponse<ProjectList[]>>("/Status/getAll");
    return res.data.content;
  } catch (error) {
    console.error("Error fetching project list:", error);
    throw error;
  }
};

export const getAllPriority = async () => {
  try {
    const res = await fetcher.get<ApiResponse<ProjectList[]>>(
      "/Priority/getAll"
    );
    return res.data.content;
  } catch (error) {
    console.error("Error fetching status:", error);
    throw error;
  }
};

export const getAllTaskType = async () => {
  try {
    const res = await fetcher.get<ApiResponse<ProjectList[]>>(
      "/TaskType/getAll"
    );
    return res.data.content;
  } catch (error) {
    console.error("Error fetching task type:", error);
    throw error;
  }
};

export const createTask = async (data: CreateTask) => {
  try {
    const res = await fetcher.post<ApiResponse<{ message: string }>>(
      "Project/createTask",
      data
    );
    return res.data.content;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};

export const deleteTask = async (taskId: number) => {
  try {
    const res = await fetcher.delete<ApiResponse<{ message: string }>>(
      `Project/removeTask?taskId=${taskId}`
    );
    return res.data.content;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const updateDescription = async (id: number, data: Description) => {
  try {
    const res = await fetcher.post<ApiResponse<{ message: string }>>(
      `Project/updateDescription?taskId=${id}`,
      data
    );
    return res.data.content;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};

export const updatePriority = async (id: number, data: Priority) => {
  try {
    const res = await fetcher.post<ApiResponse<{ message: string }>>(
      `Project/updatePriority?taskId=${id}`,
      data
    );
    return res.data.content;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};
