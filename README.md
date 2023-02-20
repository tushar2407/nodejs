# Nodejs Projects
Steps to start a nodejs+express project
```bash
$ npm i express --save
$ npm i body-parser --save
$ npm i mongoose --save
```
Start `node` server: `node server.js`

To restart node server automatically:
```bash
$ npm i nodemon -g
# Next, go to package.json and add the following:
# "scripts": {
#     "devStart": "nodemon server.js",
#     "start": "node server.js"
#   }
# Then, run the following command
$ npm run devStart
```

To start the existing project:
```bash
# Got to the preferred directory
$ npm i
$ npm run devStart
```