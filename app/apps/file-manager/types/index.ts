export type IFileType =
  | 'Documents'
  | 'Images'
  | 'Code'
  | 'Spreadsheet'
  | 'Presentation'
  | 'Text';

export type IFile = {
  id: string;
  name: string;
  type: IFileType;
  size: string;
  created_at: string;
  modified_at: string;
  owner: string;
  path: string;
  permissions: string;
};

export type IFolderType =
  | 'Documents'
  | 'Images'
  | 'Videos'
  | 'Music'
  | 'Code'
  | 'Downloads'
  | 'Backups'
  | 'Projects'
  | 'Shared'
  | 'Trash';

export type IFolder = {
  id: string;
  name: IFolderType;
  icon: IFileType;
  description: string;
  permissions: string;
  created_at: string;
  pinned?: boolean;
  total_files: number;
  estimated_size: string;
};

export type IFileAction =
  | 'Created'
  | 'Edited'
  | 'Deleted'
  | 'Viewed'
  | 'Renamed'
  | 'Downloaded'
  | 'Uploaded'
  | 'Shared'
  | 'Moved'
  | 'Copied';

export type IFileActivity = {
  id: string;
  timestamp: string;
  action: IFileAction;
  file_name: string;
  file_type: IFileType;
  user: string;
};
