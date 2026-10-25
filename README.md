# Pet Grooming Pro（寵物美容預約系統）

概要

本專案為一套寵物美容店的線上預約管理系統，採前後端分離架構。
顧客可透過前端網頁預約美容服務與加購項目，店家可透過後台查詢、編輯、
取消預約，並支援 QR Code 報到（Check-in）流程。

使用技術

| 層級 | 技術 |
| 前端 | Vue 3 + Vite、Vue Router、Pinia（含 persistedstate）、Vuetify、Bootstrap、Axios、qrcode / qrcode.vue、DataTables |
| 後端 | Spring Boot 3.4.4、Spring Data JPA、Thymeleaf（部分頁面）、Lombok |
| 資料庫 | Microsoft SQL Server（@mssql-jdbc@，DB 名稱：@topics@） |
| 開發伺服器 | 前端 Vite dev server（@http://localhost:5173@），後端 REST API 於 @/api@ |

系統架構

後端 (@後端/springboot3demo@)

* *model/bean* — @Appointment@、@Owner@、@Pet@、@Items@、@ItemDetails@、@ServicePackage@、@PackageDetails@：JPA Entity，對應預約、會員、寵物、服務項目、加購套組等資料表
* *model/service* — @AppointmentService@：預約的新增／查詢／更新／刪除／報到／取消核心邏輯；@PricingService@：服務與加購項目的計價；@PetService@：寵物查詢
* *controller* — @AppointmentController@：對外 REST API（@/api/...@），同時也回傳部分 Thymeleaf 頁面（預約結果 / 錯誤頁）

前端 (@前端@)

* *views* — @AppointmentReserve@（預約）、@AppointmentFrontPage@（首頁）、@AppointmentQueryPage@（查詢）、@AppointmentEditPage@（編輯）、@AppointmentList@（清單）、@AppointmentHendlePage@（處理/後台）
* *components* — @CreateAppointmentModal@、@QrCodeDisplay@（產生報到 QR Code）、@CheckinPage@、@ReserveCheck@
* *utils/api.js* — 封裝 Axios 呼叫後端 API

## 主要功能

1. **顧客預約**
   - 選擇會員、寵物、預約日期與時段、服務項目及加購套組。
   - 即時計算預約總價。

2. **查詢個人預約紀錄**
   - 依電話號碼查詢顧客自己的預約紀錄。

3. **查詢已預約時段**
   - 依指定日期查詢已被預約的時段，避免重複預約及時段衝突。

4. **編輯預約**
   - 修改既有預約的日期、時段、服務項目及加購項目。
   - 更新預約資訊及總價。

5. **刪除／取消預約**
   - 依預約 ID 刪除或取消指定預約。

6. **QR Code 報到**
   - 掃描預約 QR Code，呼叫 Check-in API。
   - 將預約狀態更新為「已完成」。

7. **後台預約管理**
   - 依會員及預約狀態查詢預約清單，方便管理人員查看與管理預約資料。
