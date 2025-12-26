import {
  IconArchive,
  IconArrowDown,
  IconArrowsMoveHorizontal,
  IconCode,
  IconCopy,
  IconDownload,
  IconEye,
  IconFile,
  IconFileCode,
  IconFilePlus,
  IconFileSpreadsheet,
  IconFileText,
  IconFolder,
  IconFolderPlus,
  IconMusic,
  IconPencil,
  IconPhoto,
  IconQuestionMark,
  IconShare,
  IconSlideshow,
  IconTrash,
  IconUpload,
  IconUsers,
  IconVideo,
} from '@tabler/icons-react';

import { IFileType, IFolderType } from '@/app/apps/file-manager/types';

export function resolveFileIcon(fileType: IFileType) {
  const iconMap: Record<IFileType, React.ElementType> = {
    Documents: IconFileText,
    Images: IconPhoto,
    Code: IconFileCode,
    Spreadsheet: IconFileSpreadsheet,
    Presentation: IconSlideshow,
    Text: IconFile,
  };

  return iconMap[fileType] || IconQuestionMark; // Default icon for unknown types
}

type FileAction =
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

export function resolveActionIcon(action: FileAction) {
  const actionIconMap: Record<FileAction, React.ElementType> = {
    Created: IconFilePlus,
    Edited: IconPencil,
    Deleted: IconTrash,
    Viewed: IconEye,
    Renamed: IconFileText,
    Downloaded: IconArrowDown,
    Uploaded: IconUpload,
    Shared: IconShare,
    Moved: IconArrowsMoveHorizontal,
    Copied: IconCopy,
  };

  return actionIconMap[action] || IconQuestionMark; // Default icon for unknown actions
}

export function resolveFolderIcon(folderType: IFolderType) {
  const folderIconMap: Record<IFolderType, React.ElementType> = {
    Documents: IconFolder,
    Images: IconPhoto,
    Videos: IconVideo,
    Music: IconMusic,
    Code: IconCode,
    Downloads: IconDownload,
    Backups: IconArchive,
    Projects: IconFolderPlus,
    Shared: IconUsers,
    Trash: IconTrash,
  };

  return folderIconMap[folderType] || IconQuestionMark; // Default icon for unknown folder types
}
