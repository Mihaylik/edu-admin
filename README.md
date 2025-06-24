# 📌 Диплом: Roadmap та основні рішення

## 🧠 Тема дипломної

**Проєкт серверної частини веб-сайту з адміністрування закладу освіти на базі хмарного середовища Microsoft Azure**

---

## ⚙️ Технологічний стек

| Компонент           | Технологія / Сервіс                |
| ------------------- | ---------------------------------- |
| Сервер              | Node.js + Express                  |
| ORM                 | Prisma                             |
| База даних          | Azure SQL Database                 |
| Авторизація         | JWT (без OAuth2 на першому етапі)  |
| API Gateway         | Azure API Management (APIM)        |
| Reverse Proxy + WAF | Azure Application Gateway + WAF    |
| Хостинг             | Azure App Service                  |
| Безпека             | Defender for Cloud, Key Vault, NSG |
| Моніторинг          | App Insights, Azure Monitor        |

---

## 🏗️ Схвалена структура сутностей

| Сутність        | Опис                                                   |
| --------------- | ------------------------------------------------------ |
| `User`          | Усі користувачі (адмін, викладач, студент)             |
| `Course`        | Навчальні курси                                        |
| `StudentCourse` | Запис студента на курс (M:N)                           |
| `Group`         | Група студентів                                        |
| `GroupMember`   | Зв’язок студента з групою                              |
| `Subject`       | Більш загальний предмет (один Subject → кілька Course) |
| `Schedule`      | Розклад занять                                         |
| `Grade`         | Оцінки студентів за курс або предмет                   |
| `Attendance`    | Облік відвідування занять                              |

---

## 🧱 Проєктна архітектура

- API-сервер на Express
- Prisma взаємодіє з Azure SQL через `DATABASE_URL`
- APIM (у подальшому) перевіряє JWT, логування, rate limiting
- WAF фільтрує вхідний трафік
- RBAC реалізовано через middleware `authorizeRole`
- Приватна мережа (VNet), доступ до SQL — через Private Endpoint
- Моніторинг — Defender for Cloud + App Insights

---

## 📊 Аналіз аналогів

- Аналізовано openSIS, Fedena, Edsby, Classter
- Всі мають подібні сутності: Users, Courses, Groups, Grades, Attendance
- Використовують Azure/AD та REST API
- Підтверджено доцільність нашої архітектури

---

## 🧭 Орієнтири в дипломній

- Реалізувати всі запити CRUD для сутностей
- Додати ER-діаграму до додатків
- Підкреслити елементи кібербезпеки (WAF, NSG, JWT)
- Описати архітектуру та рішення в теоретичному розділі

---
