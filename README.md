# Depencies
* mongodb 5.0.5
* .env

# mongodb install
```
sudo apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-5.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-5.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-5.0.gpg ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/5.0 multiverse" | \
sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org=5.0.5 mongodb-org-database=5.0.5 mongodb-org-server=5.0.5 mongodb-org-shell=5.0.5 mongodb-org-mongos=5.0.5 mongodb-org-tools=5.0.5
sudo systemctl enable mongod
sudo systemctl daemon-reload
sudo systemctl start mongod
```