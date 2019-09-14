"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-agmdev-barebone:app", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({ someAnswer: true });
  });

  it("creates files", () => {
    assert.file(["README.md"]);
    assert.file(["package.json"]);
    assert.file(["LICENSE"]);
    assert.file(["index.js"]);
    assert.file([".gitignore"]);
    assert.file([".eslintrc.js"]);
    assert.file(["tests/example.spec.js"]);
    assert.file(["src/app.js"]);
    assert.file(["src/utils/index.js"]);
    assert.file(["src/services/index.js"]);
    assert.file(["src/models/index.js"]);
    assert.file(["src/domain/index.js"]);
    assert.file(["src/config/index.js"]);
  });
});
