import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:         r('index.html'),
        organizer:    r('htmls/organizer.html'),
        participants: r('htmls/participants.html'),
        exclusions:   r('htmls/exclusions.html'),
        eventType:    r('htmls/event-type.html'),
        eventDate:    r('htmls/event-date.html'),
        budget:       r('htmls/budget.html'),
        summary:      r('htmls/summary.html'),
        draw:         r('htmls/draw.html'),
      },
    },
  }
});