import { Task } from '../types';

/**
 * Sample tasks data for testing and development
 */
export const sampleTasks: Task[] = [
  {
    id: 1,
    title: "Review ABC Ventures Term Sheet",
    company: "ABC Ventures",
    priority: "High",
    dueDate: "May 15, 2025",
    status: "Pending",
    flags: ["Non-standard liquidation preference", "Unusual board structure"],
    description: "Term sheet for potential investment in ABC Ventures requires review due to several non-standard terms."
  },
  {
    id: 2,
    title: "Review XYZ Corp Term Sheet",
    company: "XYZ Corp",
    priority: "Medium",
    dueDate: "May 18, 2025",
    status: "Pending",
    flags: ["Vesting schedule concerns"],
    description: "Term sheet from XYZ Corp contains irregular vesting schedule terms."
  },
  {
    id: 3,
    title: "Review Quantum Startup Term Sheet",
    company: "Quantum Startup",
    priority: "Low",
    dueDate: "May 20, 2025",
    status: "Pending",
    flags: ["Unusual IP rights clause"],
    description: "New term sheet submitted by Quantum Startup needs review of IP rights section."
  }
]; 