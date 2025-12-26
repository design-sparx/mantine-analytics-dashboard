import { IUser } from './user';

export interface IProject {
  id: string;
  title: string | null;
  description: string | null;
  status: number;
  createdDate: string;
  startDate: string | null;
  dueDate: string | null;
  completedDate: string | null;
  ownerId: string;
  owner: IUser;
  statusText: string;
  completionPercentage: number;
}

// Alias for consistency with other DTOs
export type ProjectDto = IProject;
