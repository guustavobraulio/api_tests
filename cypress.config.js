const { defineConfig } = require("cypress");
const fs = require('fs'); // ✅ Adicione isso no topo
const path = require('path'); // ✅ Adicione isso no topo

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        fileExists(path) {
          return fs.existsSync(path);
        }
      });
  }
  }
});
