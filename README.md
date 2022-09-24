# Clothes Store API

本專案為前後分離協作，此API提供給 [clothingStore](https://github.com/JiangShuuu/vue3-clothingStore-ts) 使用。

[後端入口DEMO](https://express.jiangshuuu.com/)  
[專案成品DEMO](https://profile.jiangshuuu.com/)  
[API 文件](https://express.jiangshuuu.com/api-docs)

## 產品功能
- 訪客能創建/登入帳戶(含第三方登入)
- 訪客能收尋商品
- 訪客能分享連結
- 會員能將商品加入購物車
- 會員能新增/刪除訂單
- 管理者能新增/刪除/修改商品、類別
- 管理者能管理訂單
- 管理者能瀏覽用戶

## 環境
### 使用技術
- node + express + MySQL
### 部署
- Oracle + Docker 部署

## 安裝流程
此安裝流程為本地端(local)使用。

### 專案建立
1. 打開你的終端機(terminal)，Clone 此專案至本機電腦

```
git clone https://github.com/JiangShuuu/express-clothing-store.git
```

2. 進入至專案資料夾

```
cd express-clothing-store
```

3. 安裝 npm 相關套件

```
npm install
```

4. 新增 .env：為了確保使用順利，請複製.env.example檔內容並更名為.env，內容如下：IMGUR_CLIENT_ID為IMGUR提供客戶端的API Client ID、JWT_SECRET為指定本地端要用JWT所要驗證的密鑰、PORT為指定本專案下所要使用的port號碼
```
IMGUR_CLIENT_ID = Your client ID
JWT_SECRET = Your key
PORT = Your port
```

5. 設定 MySQL 連線資訊：打開 ./config/config.json，並依據開發情況來更改development、test版本的資料庫資訊(如username、password、database、host)，請務必確保與自身的MySQL Server資訊一致，詳情請見下列範例(此為./config/config.json內容)

```
  "development": {
    "username": "root",
    "password": "<your_mysql_workbench_password>",
    "database": "clothing_store",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "<your_mysql_workbench_password>",
    "database": "clothing_store",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
```

範例為如下：假設自己的MySQL伺服器位置是127.0.0.1，且指定一個名為clothing_store和名為clothing_store的資料庫來給予本專案下的開發版本以及測試版本來進行，最後帳密分別設定為root和password，那麼config/config.json內容會是如下
```
{
  "development": {
    "username": "root",
    "password": "password",
    "database": "clothing_store",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "password",
    "database": "clothing_store",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
  .
  .
}
```

6. 建立MySQL資料庫：請打開MySQL Workbench，並在登入後，新增SQL File後，於內文輸入如下，即建立clothing_store、clothing_store_test。

```
drop database if exists clothing_store;
create database clothing_store;
drop database if exists clothing_store_test;
create database clothing_store_test;
```


7. 建立資料庫table：回到終端機介面，輸入下列指令，建立資料庫table

```
npx sequelize db:migrate
```

8. 載入種子資料：回到終端機介面，輸入下列指令，建立種子資料

```
npx sequelize db:seed:all
```

9. 啟動專案：

```
npm run start 
```
或執行下列指令來啟動
```
npm run dev
```

10. 當終端機(terminal)出現以下字樣，代表執行成功，其中PORT是你指定在.env的port號碼

```
Example app listening on port <PORT>
```

11. 使用時請參照API文件來搭配POSTMAN來使用

## 開發前置需求
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/en/)
- [Express](https://www.npmjs.com/package/express)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [MySQL](https://www.mysql.com/)
- [MySQL Workbench](https://dev.mysql.com/downloads/mysql/)