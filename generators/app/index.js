"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

const supportedLicenses = {
  MIT: "LICENSE-MIT",
  "GPL-3.0": "LICENSE-GPL"
};

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('name', {
      type: String,
      required: true,
      desc: 'Defines the name of the package'
    })
  }

  prompting() {
    // Have Yeoman greet the user.
    const generatorName = this.options.name || "agmdev-barebone";
    this.log(
      yosay(
        `Holi!\n\nWelcome to the awesome ${chalk.red(
          generatorName
        )} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "projectName",
        message: "Tell me the name of your new project",
        default: "PROJECT_NAME"
      },
      {
        type: "input",
        name: "projectDescription",
        message: "Description of your new project",
        default: "PROJECT_DESCRIPTION"
      },
      {
        type: "input",
        name: "githubUsername",
        message: "Tell me your Github username",
        default: "agm-dev"
      },
      {
        type: "input",
        name: "author",
        message: "Author of this project",
        default: "Adrián Gonzalo"
      },
      {
        type: "list",
        name: "license",
        message: "Choose a license for this project",
        choices: Object.keys(supportedLicenses),
        default: "MIT"
      },
      {
        type: "input",
        name: "keywords",
        message: "Add some keywords separated by comma",
        default: "node, nodejs"
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.log(`Initializing git repository...`);
      this.spawnCommand("git", ["init"]);
    });
  }

  writing() {
    // README.md
    const readme = "README.md";
    this.fs.copyTpl(this.templatePath(readme), this.destinationPath(readme), {
      projectName: this.props.projectName,
      githubUsername: this.props.githubUsername
    });

    // LICENSE
    if (this.props.license === "GPL-3.0") {
      this.fs.copy(
        this.templatePath(supportedLicenses[this.props.license]),
        this.destinationPath("LICENSE")
      );
    } else {
      this.fs.copyTpl(
        this.templatePath(supportedLicenses[this.props.license]),
        this.destinationPath("LICENSE"),
        {
          author: this.props.author,
          year: new Date().getFullYear()
        }
      );
    }

    // Index.js
    const indexJs = "index.js";
    this.fs.copy(this.templatePath(indexJs), this.destinationPath(indexJs));

    // Example.test.js
    const exampleTest = "tests/example.spec.js";
    this.fs.copy(
      this.templatePath(exampleTest),
      this.destinationPath(exampleTest)
    );

    // Src/app.js
    const appJs = "src/app.js";
    this.fs.copy(this.templatePath(appJs), this.destinationPath(appJs));

    // Src/config/index.js
    const configJs = "src/config/index.js";
    this.fs.copy(this.templatePath(configJs), this.destinationPath(configJs));

    // Src/domain/index.js
    const empty = "empty.js";
    this.fs.copy(
      this.templatePath(empty),
      this.destinationPath("src/domain/index.js")
    );

    // Src/models/index.js
    this.fs.copy(
      this.templatePath(empty),
      this.destinationPath("src/models/index.js")
    );

    // Src/services/index.js
    this.fs.copy(
      this.templatePath(empty),
      this.destinationPath("src/services/index.js")
    );

    // Src/utils/index.js
    this.fs.copy(
      this.templatePath(empty),
      this.destinationPath("src/utils/index.js")
    );

    // .gitignore
    this.fs.copy(this.templatePath("ignoregit"), this.destinationPath(".gitignore"));

    // .eslintrc.js
    const eslintRc = ".eslintrc.js";
    this.fs.copy(this.templatePath(eslintRc), this.destinationPath(eslintRc));

    // Writting dev dependencies to package.json
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
        "lint-staged": "^9.2.5"
      },
      keywords: this.props.keywords.split(",").map(i => i.trim().toLowerCase())
    };
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
      {
        projectName: this.props.projectName,
        projectDescription: this.props.projectDescription,
        author: this.props.author,
        license: this.props.license,
        githubUsername: this.props.githubUsername
      }
    );
    this.fs.extendJSON(this.destinationPath("package.json"), packageJson);
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    });
  }

  end() {
    this.log(`Aaaand... that's all folks!\n`);

    this.log(`Checking linting rules...`);
    this.spawnCommand("npm", ["run", "lint"]);

    this.log(`Running tests...`);
    this.spawnCommand("npm", ["run", "test"]);

    this.log(`Commit files...`);
    this.spawnCommand("git", ["add", "."]);
    this.spawnCommand("git", ["commit", "-m", "initial commit"]);
  }
};
