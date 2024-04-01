# Depencies
* mongodb 7.0.7
* .env
* 식의약 데이터 포털 - 의약품 낱알식별정보 데이터 (https://data.mfds.go.kr/OPCAC01F05?srchSrvcKorNm=%EC%9D%98%EC%95%BD%ED%92%88%20%EB%82%B1%EC%95%8C%EC%8B%9D%EB%B3%84%EC%A0%95%EB%B3%B4%20%EB%8D%B0%EC%9D%B4%ED%84%B0)
* 식의약 데이터 포털 - 완제 의약품 허가 상세 데이터 (https://data.mfds.go.kr/OPCAC01F05/search?loginCk=false&aplyYn=&taskDivsCd=&srchSrvcKorNm=%EC%99%84%EC%A0%9C+%EC%9D%98%EC%95%BD%ED%92%88+%ED%97%88%EA%B0%80+%EC%83%81%EC%84%B8+%EB%8D%B0%EC%9D%B4%ED%84%B0)

# mongodb install
```bash
sudo apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl daemon-reload
sudo systemctl start mongod
```

# require environment
```bash
MAIN_SERVER_PORT='Server port number'
DBMS_ADDRESS='MongoDB address'
NODE_ENV='Node mode'
ENC_SERVICE_KEY='Drug permission search API encode key'
DEC_SERVICE_KEY='Drug permission search API decode key'
DL_SERVER_ADDRESSESS='Deep learning server address'
DL_SERVER_PORT='Deep learning server port number'
DL_SERVER_PILL_RECOGNITION_API_URL_PATH='Deep learning server image recognition path'
PILL_RECOGNITION_RESOURCE_PATH='Pill recognition data files location'
DRUG_PERMISSION_RESOURCE_PATH='Drug permission data files location'
```