# @SHOE4SURE App

This README would normally document whatever steps are necessary to get your application up and running.


## Dependencies

* Nodejs v16.x
* NPM v8.x

## Installation

* Run the below commands:

```bash
npm i
```

## Generate environment file:
* Run the below commands:

```bash
cp .env.example .env
```
* Enter your your environment variable in `.env` file
* To get environment variable of GHTK and VNPAY. following these documents:
    * https://docs.giaohangtietkiem.vn/#c-u-h-nh-chung
    * https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html


## Run the following commands at the same time to run the project:

* Running the api:

```bash
npm run start
```

* Running the happy birth day cronjob:

```bash
npm run start:hpbdjob
```

* Running the release voucher schedule cronjob:

```bash
npm run start:release-voucher
```

* Running the expired voucher cronjob:

```bash
npm run start:expired-voucher
```

* Running the remove voucher expired cronjob:

```bash
npm run start:remove-voucher
```

## Deployment

* Enter environment variable in ``` deploy/pm2-app.json ```

* Install pm2

```bash
npm install pm2 -g
```

* Run the whole project

```bash
pm2 start deploy/pm2-app.json
```
