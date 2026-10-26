import { AITaskDefinition } from "./types";
import { humanizeTask } from "./humanize";
import { rewriteTasks } from "./rewrite";
import { summarizeTask } from "./summarize";
import { grammarDeepTask } from "./grammarDeep";
import { aiPatternCommentaryTask } from "./aiPatternCommentary";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AI_TASKS: AITaskDefinition<any>[] = [
  humanizeTask,
  ...rewriteTasks,
  summarizeTask,
  grammarDeepTask,
  aiPatternCommentaryTask,
];

const TASKS_BY_ID = new Map(AI_TASKS.map((t) => [t.id, t]));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTaskDefinition(id: string): AITaskDefinition<any> | undefined {
  return TASKS_BY_ID.get(id);
}
