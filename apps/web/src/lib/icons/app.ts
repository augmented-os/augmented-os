import {
  Home,
  Settings,
  User,
  Users,
  Bell,
  Search,
  LifeBuoy,
  LogOut,
  PlusCircle,
  Trash,
  Edit,
  Copy,
  Download,
  Upload
} from 'lucide-react';

// Define app icon names
export type AppIconName =
  | 'home'
  | 'settings'
  | 'user'
  | 'users'
  | 'notifications'
  | 'search'
  | 'help'
  | 'logout'
  | 'add'
  | 'delete'
  | 'edit'
  | 'copy'
  | 'download'
  | 'upload';

// Map app icon names to their components
export const appIcons = {
  home: Home,
  settings: Settings,
  user: User,
  users: Users,
  notifications: Bell,
  search: Search,
  help: LifeBuoy,
  logout: LogOut,
  add: PlusCircle,
  delete: Trash,
  edit: Edit,
  copy: Copy,
  download: Download,
  upload: Upload
}; 