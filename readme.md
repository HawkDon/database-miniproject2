## Database setup for docker:

Mongodb:
docker run -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password -e MONGO_INITDB_DATABASE=movies --name mongodb -d mongo

Redis:
docker run --name redis -p 6379:6379 -d redis

## Performance Measurement

### Create

Redis takes: 3 milliseconds to find the data
MongoDB takes: 6 milliseconds to find the data

### Read

It took redis: 2 milliseconds to put data into the store
It took MongoDB: 4 milliseconds to put data into the database

### Update

It took redis: 9 milliseconds to update data into the store
It took MongoDB: 11 milliseconds to update data into the database

### Delete

It took redis: 14 milliseconds to delete data from the store
It took MongoDB: 15 milliseconds to delete data from the database

### Storage usages

Redis takes up: 8.37 MB from your RAMs
MongoDB takes up: 1,978368 MB from your harddisk
