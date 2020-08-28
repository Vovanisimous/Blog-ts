const ghpages = require('gh-pages');

ghpages.publish("build", {
    branch: "deploy",
    repo: "https://github.com/Vovanisimous/Blog-ts.git"
}, (msg) => console.log(msg));