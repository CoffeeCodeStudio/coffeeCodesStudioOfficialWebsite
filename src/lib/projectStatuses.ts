export const PROJECT_STATUSES = [
  { value: 'questionnaire', label: 'Projektfrågor' },
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'Att göra' },
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Utveckling' },
  { value: 'testing', label: 'Testning' },
  { value: 'live', label: 'Live' },
  { value: 'completed', label: 'Slutfört' },
  { value: 'archived', label: 'Arkiverat' },
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]['value'];
