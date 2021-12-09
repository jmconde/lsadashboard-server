# lsa-leaderboard

```
mongodump --host=******** --port=37017 --username=*** --password=***** --db=lsa_leaderboard --out=d:/temp/mongodumpfiles --authenticationDatabase=***
```

```
mongorestore --host=*** --port=37017 --username=*** --password=***** --db=lsa_leaderboard --dir=d:/temp/mongodumpfiles/lsa_leaderboard --authenticationDatabase=admin --drop
```