import type { Preview } from '@storybook/react';

// import { withThemeByClassName } from '@storybook/addon-styling';

/* TODO: update import to your tailwind styles file. If you're using Angular, inject this through your angular.json config instead */
import '@library-frontend/ui/dist/style.css';
import '@package-frontend/noto-emoji';
import '@package-frontend/pretendard';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    docs: {
      source: {
        code: null,
      },
    },
  },
};

export default preview;
