export interface ITodoApiTask {
  id: string;
  name: string;
  completed: boolean;
}

export interface ITodoApiItem {
  id: string;
  name: string;
  tasks: ITodoApiTask[];
}

export interface ICreateTodoPayload {
  name: string;
}

export interface ICreateTaskPayload {
  name: string;
}

export interface IUpdateTaskPayload {
  name: string;
  completed: boolean;
}
