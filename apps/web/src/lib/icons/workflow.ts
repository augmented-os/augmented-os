import { 
  CircleCheck, 
  SendHorizontal, 
  Database, 
  Workflow, 
  Code, 
  ExternalLink,
  Layers,
  ListChecks,
  MessageSquare,
  Split,
  UserPen,
  Timer,
  Cable,
  Clock,
  FileText,
  GitBranch,
  ArrowUpFromLine,
  ArrowDownFromLine,
  Brain,
  LogIn,
  LogOut
} from 'lucide-react';

// Define workflow icon names
export type WorkflowIconName = 
  | 'task'
  | 'trigger'
  | 'database'
  | 'workflow'
  | 'code'
  | 'connector'
  | 'layer'
  | 'list'
  | 'message'
  | 'gitmerge'
  | 'user'
  | 'timer'
  | 'clock'
  | 'file'
  | 'gitbranch'
  | 'output'
  | 'input'
  | 'brain'
  | 'server';

// Map workflow icon names to their components
export const workflowIcons = {
  task: CircleCheck,
  trigger: SendHorizontal,
  database: Database,
  workflow: Workflow,
  code: Code,
  connector: ExternalLink,
  layer: Layers,
  list: ListChecks,
  message: MessageSquare,
  gitmerge: Split,
  user: UserPen,
  timer: Timer,
  clock: Clock,
  file: FileText,
  gitbranch: GitBranch,
  output: LogOut,
  input: LogIn,
  brain: Brain,
  server: Cable
}; 