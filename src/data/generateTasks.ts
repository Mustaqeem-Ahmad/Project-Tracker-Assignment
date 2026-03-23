import { Task, Priority, Status } from '../types';
import { ASSIGNEES } from './assignees';

const TITLES = [
  'Implement authentication flow',
  'Fix memory leak in dashboard',
  'Write unit tests for billing module',
  'Design new onboarding UI',
  'Migrate database to PostgreSQL',
  'Optimize image loading pipeline',
  'Add dark mode support',
  'Refactor API error handling',
  'Build notification system',
  'Create admin panel layout',
  'Set up CI/CD pipeline',
  'Implement search functionality',
  'Fix mobile responsive issues',
  'Add CSV export feature',
  'Update documentation',
  'Integrate Stripe payments',
  'Build analytics dashboard',
  'Add multi-language support',
  'Implement rate limiting',
  'Fix XSS vulnerability',
  'Create user permissions system',
  'Optimize SQL queries',
  'Build email templates',
  'Add two-factor authentication',
  'Implement file upload',
  'Create REST API endpoints',
  'Set up Redis caching',
  'Build drag-and-drop interface',
  'Add audit logging',
  'Fix pagination bug',
  'Implement OAuth login',
  'Create backup system',
  'Build report generator',
  'Add WebSocket support',
  'Fix memory usage spikes',
  'Implement data validation',
  'Create onboarding wizard',
  'Add keyboard shortcuts',
  'Build activity feed',
  'Fix timezone handling',
  'Implement lazy loading',
  'Create data import tool',
  'Add accessibility features',
  'Build settings page',
  'Fix broken links',
  'Implement caching layer',
  'Create API documentation',
  'Add progress indicators',
  'Build feedback system',
  'Fix login redirect bug',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

function weightedPriority(): Priority {
  const r = Math.random();
  if (r < 0.05) return 'critical';
  if (r < 0.30) return 'high';
  if (r < 0.80) return 'medium';
  return 'low';
}

function weightedStatus(): Status {
  const r = Math.random();
  if (r < 0.30) return 'todo';
  if (r < 0.55) return 'in_progress';
  if (r < 0.75) return 'in_review';
  return 'done';
}

export function generateTasks(count = 500): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: count }, (_, i) => {
    const hasStartDate = Math.random() > 0.15;

    // Mix of overdue, due today, and future tasks
    let dueDaysOffset: number;
    const r = Math.random();
    if (r < 0.20) {
      dueDaysOffset = randomInt(-30, -1); // overdue
    } else if (r < 0.25) {
      dueDaysOffset = 0; // due today
    } else {
      dueDaysOffset = randomInt(1, 60); // future
    }

    const dueDate = addDays(today, dueDaysOffset);
    const startDate = hasStartDate
      ? addDays(dueDate, -randomInt(5, 30))
      : null;

    return {
      id: `task-${i}`,
      title: `${TITLES[i % TITLES.length]} #${Math.floor(i / TITLES.length) + 1}`,
      status: weightedStatus(),
      priority: weightedPriority(),
      assigneeId: ASSIGNEES[i % ASSIGNEES.length].id,
      startDate: startDate ? toISO(startDate) : null,
      dueDate: toISO(dueDate),
      createdAt: toISO(addDays(today, -randomInt(30, 90))),
    };
  });
}
