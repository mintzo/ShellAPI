ShellAPI
========

Shell Api Server, running echo and grep like a boss
### API routes are currently at V1, and available under /apiV1/
Install
-------
run in directory shell:
```
npm i
```` 

Running
---
* running with docker-compose (recommended):
*requires docker and docker-compose installed*
```
 docker-compose up
```
* running without docker:
*requires node 9V + installed*
```
 npm run start
```

Usage And Documentation
-----------------------
after running the server goto `localhost:10010/` ( or `localhost:3000/` , with docker-compose, note testing the api works only on 10010 )

the servers API documentation will be loaded via swagger UI

### **the API can be tested with the UI**
under each route there is a 'try it out' button

after pressing the 'try it out' button an interface to test the route will be shown


server structure
-----------------
the server is structure by node-swagger framework.

- route code found in `/api/controllers`
- swagger file can be found in `/api/swagger/swagger.yaml`
- folder that contains file to run commands on is `/filesToUseCommandsOn/`, currently contains these files 
    - file1.txt
    - file2.txt
    - file3.txt
    - emptyFile.txt


Running Tests
-------
* run tests:
```
npm run test
```
* Performance Tests
```
npm run preformanceTest
```

logging
-------
logs can be found in the server directory

error.logs for error logs and combined.logs for regular logs 

future improvement ideas
------------------------
* CI/CD connection
* monitoring and alerting system
* external logging service
* message queue
* https