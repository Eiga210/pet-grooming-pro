# springboot3demo

## 資料庫連線設定

`spring.datasource.username` / `spring.datasource.password` 已改為從環境變數讀取，
執行前請先設定：

```sh
export DB_USERNAME=你的SQL Server帳號
export DB_PASSWORD=你的SQL Server密碼
```

或在 IDE 的 Run Configuration 中加入這兩個環境變數。

連線目標為本機 SQL Server，資料庫名稱為 `topics`
（見 `src/main/resources/application.properties` 的 `spring.datasource.url`）。
