
export NODE_ENV=test
sudo cp loopsocket.conf /etc/init/
sudo service apache2 restart
sudo service loopsocket restart
cd loopSocket
grunt mongoimport
grunt build