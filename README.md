# Chat Web

## Instructions

### With Docker

1. Be sure you have installed docker and docker-compose
2. In backend directory exists a file called `.env.example`, you need to copy it and rename the copy with `.env`, then fill it with the correct information, a example of this file is:
    ```
    MYSQL_HOST=db
    MYSQL_USER=root
    MYSQL_PASSWORD=pa55w0rd11
    MYSQL_DATABASE=chatweb
    MYSQL_TEST_DATABASE=test
    MYSQL_TEST_HOST=192.168.99.100
    JWT_SECRET=53cr3t
    ```
    As you can see the `MYSQL_HOST` its called `db`, it means that in non test environment the backend use the network attached in docker-compose, in this case is `db`.

    `MYSQL_PASSWORD` is configured in `docker-compose.yml` you can set it if you want.

    `MYSQL_DATABASE` and `MYSQL_TEST_DATABASE` i sugest that use the same names because the sql files are configurated with that names, or if you want to change it, you can change all the entries in files `/backend/sql/db_schema.sql` and `/backend/sql/db_schema_test.sql`.

    `MYSQL_TEST_HOST` is a special case, becasue if you are using `docker toolbox` on windows (im not sure if works in the same way in Mac), you need to put the IP address provided with `Docker quickstart terminal`, generally is the same everywhere (`192.168.99.100`); if you are in linux (or another SO that runs docker nativelly) you can set this value with `localhost`. This is because the tests are runned on the host machine and not in the container, in the host you don't have access to `db` network.

    In `JWT_SECRET` you can set it with any string.
3. In  the frontend directory you need to configure the host of the backend endpoint, to do it, edit the file called `/frontend/src/settings.js` the port `8080` is configured in `docker-compose.yml`, y ou can change it if you want, but be aware to modify it in both files.

4. Networks and endpoints configured, we need to install front and backend dependencies, move to the frontend and backend, then run `npm install`. After front end dependencies are installed, run `npm run build`

    **Extra step if you are using a unix based SO:** you may need to give execution permissions to a file located in `/backend/wait-for-it.sh` running `chmod +x /backend/wait-for-it.sh` on the root of the repository.

5. Now, we have front and backend ready to start, move to the root of the repository (chat-web) and run `docker-compose up`, now you can access to the frontend using `HOST:9000` and backend `HOST:8080`

### Without Docker

Following the same example as the docker instructions, you just replace the host and db ip adadress with localhost.

### Run tests

Only the backend has tests (i have no time for frontend :c). For run backend test just move to the backend directory and run `npm test`. 

**WARNING:** Database must be up, if you are using docker, run `docker-compose up` before run tests.

## Database model

![Database model](https://github.com/Dario0117/chat-web/blob/master/db-model.png)