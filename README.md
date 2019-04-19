sudo systemctl stop nginx
pm2 restart app

sudo systemctl start nginx

yarn test
