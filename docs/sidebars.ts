import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: ['intro', 'quickstart', 'authentication'],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: false,
      items: ['concepts/jobs', 'concepts/profiles', 'concepts/workflows'],
    },
    {
      type: 'category',
      label: 'Capabilities',
      collapsed: false,
      items: [
        'capabilities/generate',
        'capabilities/identity',
        'capabilities/editing',
        'capabilities/background',
        'capabilities/branding',
        'capabilities/upscale',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: ['reference/errors', 'reference/compliance'],
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: ['api'],
    },
  ],
};

export default sidebars;
