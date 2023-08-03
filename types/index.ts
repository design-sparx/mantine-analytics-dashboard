export type Id = string | number;

export type KanbanColumn = {
    id: Id;
    title: string;
};

export type KanbanTask = {
    id: Id;
    columnId: Id;
    content: string;
    title?: string;
    status?: "to do" | "in progress" | "done" | "unassigned" | string;
    comments?: number;
    users?: number;
};
