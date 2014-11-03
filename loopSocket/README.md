## LoopSocket
-------------

## Before You Begin 
* MEAN.JS [Offical Documentation](http://meanjs.org/docs.html)
* MongoDB - [MongoDB Official Website](http://mongodb.org/) [Official Manual](http://docs.mongodb.org/manual/)
* Express - [Official Website](http://expressjs.com/), [The Express Guide](http://expressjs.com/guide.html); [StackOverflow Thread](http://stackoverflow.com/questions/8144214/learning-express-for-node-js)
* AngularJS - [Official Website](http://angularjs.org/) [Thinkster Popular Guide](http://www.thinkster.io/), [Egghead Videos](https://egghead.io/)
* Node.js - [Node.js Official Website](http://nodejs.org/) [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js)


## Prerequisites
Make sure you have installed all these prerequisites on your development machine.
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and NPM
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).

* [Bower Package Manager](http://bower.io/)
$ npm install -g bower

* [Grunt Task Runner](http://gruntjs.com/)
$ sudo npm install -g grunt-cli

### Yo Generator 
Set up using [Official Yo Generator](http://meanjs.org/generator.html)


## Quick Install

```
$ npm install
$ grunt
```
(?)./node_modules/.bin/forever -m 5 server.js 

Go to [http://localhost:3000](http://localhost:3000)


## Development and deployment With Docker

* Install [Docker](http://www.docker.com/)
* Install [Fig](https://github.com/orchardup/fig)

* Local development and testing with fig: 
```bash
$ fig up
```

* Local development and testing with just Docker:
```bash
$ docker build -t mean .
$ docker run -p 27017:27017 -d --name db mongo
$ docker run -p 3000:3000 --link db:db_1 mean
$
```

* To enable live reload forward 35729 port and mount /app and /public as volumes:
```bash
$ docker run -p 3000:3000 -p 35729:35729 -v /Users/mdl/workspace/mean-stack/mean/public:/home/mean/public -v /Users/mdl/workspa/mean-stack/mean/app:/home/mean/app --link db:db_1 mean
```


## Live Example
Browse the live MEAN.JS example on [http://meanjs.herokuapp.com](http://meanjs.herokuapp.com).