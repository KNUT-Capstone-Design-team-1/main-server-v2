#!/bin/bash
sudo apt update -y

sudo apt install -y nvm
source ~/.bashrc
nvm install 20.12.2
sudo ln -sf "$NVM_DIR/versions/node/$(nvm version)/bin/node" "/usr/local/bin/node"
sudo ln -sf "$NVM_DIR/versions/node/$(nvm version)/bin/npm" "/usr/local/bin/npm"
sudo ln -sf "$NVM_DIR/versions/node/$(nvm version)/bin/npx" "/usr/local/bin/npx"

sudo cp /must_be_madness/what_is_pill/wip-deep-learning-server-v2/system/wip-main-server-v2.service \
     /etc/systemd/system/wip-main-server-v2.service
sudo systemctl enable wip-main-server-v2