export interface KanbanTaskDto {
  id: string;
  title: string;
  status: string;
  comments: number;
  users: number;
}

export type TaskStatus = 1 | 2 | 3;

export interface TaskDto extends KanbanTaskDto {}

// Status mapping: 1 = todo, 2 = doing, 3 = done
