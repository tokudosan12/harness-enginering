import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { AppProviders } from '@/app/providers';
import '@/styles/global.css';
import '@/styles/layout.css';
import '@/styles/opportunity.css';
import '@/styles/home.css';
import '@/styles/discovery.css';
import '@/styles/detail.css';
import '@/styles/auth.css';
import '@/styles/student.css';
import '@/styles/student-forms.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
