# Depencies
* res/drug_permission
  - data excel file (의약품 허가 데이터)
* res/pill_recognition
  - data excel file (의약품 낱알 식별 정보 데이터)
* res/config.json
```
{
  "detailSearch": {
    "url": "API url for detail search",
    "encServiceKey": "API encrypt service key for detail search",
    "decServiceKey": "API decrypt service key for detail search"
  },
  "imageSearch": {
    "devUrl": "deep learning server address for develop mode",
    "prodUrl": "deep learning server address for product mode"
  },
  "essentialModels": ["PillRecognitionDataModel", "DrugPermissionDataModel"]
}

```

# Execute
```
yarn install
yarn start
```