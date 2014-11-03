Application Folder contents
---------------
-----
* **package.json**   
lists build dependencies for npm, installed when npm install is run  
* **bower.json**  
lists runtime dependencies for the web application, installed by bower and bundled with the application  
* **Gruntfile.js**  
Defines grunt() tasks, automated build steps or arbitrary tasks to run on the project 
* **karma.conf.js** 
Testing config 
* **.slugignore** 
Exlcude files from slug?
* **.bowerrc** 
Bower config
* **.csslintrc** 
CSS Lint config
* **.jshintrc** 
JS Hint, javascript static analysis

* **.travis.yml** 
Configuration for Travis CI (Continuous Integration server)
* **Dockerfile** 
Docker application container configuration
* **fig.yml** 
Config for Fig, related to Docker?

-----
* **app**  
Back end code, controllers, models, routes, views, tests

* **config**  
Configuration for each module, hopefully shouldn't change?

* **public**  
Front end js, css, html, Angular code
organized by modules
/lib folder is bower dependencies