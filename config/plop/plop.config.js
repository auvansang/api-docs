module.exports = (plop) => {
  plop.setWelcomeMessage('React Stater Kit - Generator'),
    plop.setGenerator('com', {
      description: 'Create a reusable component',
      prompts: [
        {
          // Raw text input
          type: 'input',
          // Variable name for this input
          name: 'name',
          // Prompt to display on command line
          message: 'What is your component name?',
        },
        {
          // Raw text input
          type: 'input',
          // Variable name for this input
          name: 'path',
          // Prompt to display on command line
          message: 'Where is your component location?',
        },
      ],
      actions: [
        {
          // Add a new file
          type: 'add',
          // Path for the new file
          path: '../../src/components/{{dashCase path}}/{{pascalCase name}}.tsx',
          // Handlebars template used to generate content of new file
          templateFile: 'templates/component/Component.tsx.hbs',
        },
        {
          type: 'add',
          path: '../../src/components/{{dashCase path}}/index.ts',
          templateFile: 'templates/component/index.ts.hbs',
          skipIfExists: true,
        },
        {
          // Action type 'append' injects a template into an existing file
          type: 'append',
          path: '../../src/components/{{dashCase path}}/index.ts',
          template: `export { default as {{pascalCase name}} } from './{{pascalCase name}}';`,
        },
        {
          type: 'add',
          path: '../../src/locales/en/components/{{dashCase path}}/{{dashCase name}}.json',
          templateFile: 'templates/component/locale.json.hbs',
          skipIfExists: true,
        },
      ],
    });

  plop.setGenerator('page', {
    description: 'Create a page',
    prompts: [
      {
        // Raw text input
        type: 'input',
        // Variable name for this input
        name: 'name',
        // Prompt to display on command line
        message: 'What is your page name?',
      },
      {
        // Raw text input
        type: 'input',
        // Variable name for this input
        name: 'path',
        // Prompt to display on command line
        message: 'Where is your component location?',
      },
    ],
    actions: [
      {
        // Add a new file
        type: 'add',
        // Path for the new file
        path: '../../src/pages/{{dashCase path}}/{{pascalCase name}}.tsx',
        // Handlebars template used to generate content of new file
        templateFile: 'templates/page/Page.tsx.hbs',
      },
      {
        type: 'add',
        path: '../../src/locales/en/pages/{{dashCase path}}/{{dashCase name}}.json',
        templateFile: 'templates/page/locale.json.hbs',
        skipIfExists: true,
      },
    ],
  });
};
