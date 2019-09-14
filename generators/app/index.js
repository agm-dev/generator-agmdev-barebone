'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

const supportedLicenses = {
  'MIT': 'LICENSE-MIT',
  'GPL-3.0': 'LICENSE-GPL',
}

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Holi!\n\nWelcome to the awesome ${chalk.red('agmdev-barebone')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'projectName',
        message: 'Tell me the name of your new project',
        default: 'PROJECT_NAME',
      },
      {
        type: 'input',
        name: 'projectDescription',
        message: 'Description of your new project',
        default: 'PROJECT_DESCRIPTION',
      },
      {
        type: 'input',
        name: 'githubUsername',
        message: 'Tell me your Github username',
        default: 'agm-dev'
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author of this project',
        default: 'Adrián Gonzalo'
      },
      {
        type: 'list',
        name: 'license',
        message: 'Choose a license for this project',
        choices: Object.keys(supportedLicenses),
        default: 'MIT'
      },
      {
        type: 'input',
        name: 'keywords',
        message: 'Add some keywords separated by comma',
        default: 'node, nodejs',
      },
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    // README.md
    const readme = 'README.md';
    this.fs.copyTpl(
      this.templatePath(readme),
      this.destinationPath(readme),
      {
        projectName: this.props.projectName,
        githubUsername: this.props.githubUsername,
      }
    );

    // LICENSE
    if (this.props.license === 'GPL-3.0') {
      this.fs.copy(
        this.templatePath(supportedLicenses[this.props.license]),
        this.destinationPath('LICENSE')
      );
    } else {
      this.fs.copyTpl(
        this.templatePath(supportedLicenses[this.props.license]),
        this.destinationPath('LICENSE'),
        {
          author: this.props.author,
          year: (new Date()).getFullYear(),
        }
      );
    }

    // index.js
    const indexJs = 'index.js';
    this.fs.copy(
      this.templatePath(indexJs),
      this.destinationPath(indexJs)
    );

    // example.test.js
    const exampleTest = 'tests/example.spec.js';
    this.fs.copy(
      this.templatePath(exampleTest),
      this.destinationPath(exampleTest)
    );

    // src/app.js
    const appJs = 'src/app.js';
    this.fs.copy(
      this.templatePath(appJs),
      this.destinationPath(appJs)
    );

    // src/config/index.js
    const configJs = 'src/config/index.js';
    this.fs.copy(
      this.templatePath(configJs),
      this.destinationPath(configJs)
    );

    // src/domain/index.js
    const empty = 'empty.js';
    this.fs.copy(
      this.templatePath(empty),
      this.destinationPath('src/domain/index.js')
    );

    // src/models/index.js
    this.fs.copy(
      this.templatePath(empty),
      this.destinationPath('src/models/index.js')
    );

    // src/services/index.js
    this.fs.copy(
      this.templatePath(empty),
      this.destinationPath('src/services/index.js')
    );

    // src/utils/index.js
    this.fs.copy(
      this.templatePath(empty),
      this.destinationPath('src/utils/index.js')
    );

    // .gitignore
    const gitIgnore = '.gitignore';
    this.fs.copy(
      this.templatePath(gitIgnore),
      this.destinationPath(gitIgnore)
    );

    // .eslintrc.js
    const eslintRc = '.eslintrc.js';
    this.fs.copy(
      this.templatePath(eslintRc),
      this.destinationPath(eslintRc)
    );

    // writting dev dependencies to package.json
    const packageJson = {
      devDependencies: {
        "codacy-coverage": "^3.4.0",
        eslint: "^6.3.0",
        "eslint-config-airbnb-base": "^14.0.0",
        "eslint-config-prettier": "^6.3.0",
        "eslint-plugin-import": "^2.18.2",
        "eslint-plugin-prettier": "^3.1.0",
        prettier: "^1.18.2",
        jest: "^24.9.0",
        nodemon: "^1.19.2",
        husky: "^3.0.5",
        "lint-staged": "^9.2.5",
      }
    }
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      {
        projectName: this.props.projectName,
        projectDescription: this.props.projectDescription,
        author: this.props.author,
        license: this.props.license,
        keywords: this.props.keywords.split(',').map(i => i.trim().toLowerCase()),
      }
    );
    this.fs.extendJSON(this.destinationPath('package.json'), packageJson);
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false,
    });
  }

  end() {
    this.log(`Aaaand... that's all folks!\n`);
    this.log(`Checking linting rules...`);
    this.spawnCommand('npm', ['run', 'lint']);
    this.spawnCommand('npm', ['run', 'test']);
    this.spawnCommand('git', ['init']);
  }
};
