import { LlmDashboard } from './LlmDashboard';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LLM/AI Dashboard',
  description:
    'LLM and AI dashboard for tracking API usage, model performance, token consumption, and cost analysis. Monitor AI model metrics and optimize resource usage.',
};

export default function Page() {
  return <LlmDashboard />;
}
