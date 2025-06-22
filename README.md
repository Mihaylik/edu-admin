# 📌 Диплом: Roadmap та основні рішення

## 🧠 Тема дипломної
**Проєкт серверної частини веб-сайту з адміністрування закладу освіти на базі хмарного середовища Microsoft Azure**

---

## ⚙️ Технологічний стек

| Компонент           | Технологія / Сервіс               |
|---------------------|------------------------------------|
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

| Сутність        | Опис                                                                      |
|-----------------|---------------------------------------------------------------------------|
| `User`          | Усі користувачі (адмін, викладач, студент)                                |
| `Course`        | Навчальні курси                                                           |
| `StudentCourse` | Запис студента на курс (M:N)                                              |
| `Group`         | Група студентів                                                           |
| `GroupMember`   | Зв’язок студента з групою                                                 |
| `Subject`       | Більш загальний предмет (один Subject → кілька Course)                   |
| `Schedule`      | Розклад занять                                                            |
| `Grade`         | Оцінки студентів за курс або предмет                                     |
| `Attendance`    | Облік відвідування занять                                                 |

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

## 🔁 Актуальні етапи реалізації

1. ✅ Ініціалізація проєкту Node.js (`npm init`, залежності)
2. ✅ Ініціалізація Prisma (`npx prisma init`)
3. ✅ Створення бази даних в Azure SQL + `DATABASE_URL`
4. ✅ Створення `.env` + `.env.example`
5. ✅ Опис моделі `schema.prisma` (сутності: User, Course, Subject, Group, StudentCourse, GroupMember)
6. ✅ Підключення до бази даних через Prisma (без `migrate`, з `db push`)
7. ✅ Розроблено базовий API: створення користувача, створення/редагування предметів
8. ✅ Авторизація через JWT (`accessToken`, без `refreshToken`)
9. ✅ Middleware `authenticateToken`, `authorizeRole`
10. ✅ Валідація запитів (`utils/validation.js`)
11. ⏳ Додати API для решти сутностей (`Course`, `Group`, `StudentCourse`)
12. ⏳ Додати ER-діаграму (через dbdiagram.io або dbml)

---

## 📊 Аналіз аналогів

- Аналізовано openSIS, Fedena, Edsby, Classter  
- Всі мають подібні сутності: Users, Courses, Groups, Grades, Attendance  
- Використовують Azure/AD та REST API  
- Підтверджено доцільність нашої архітектури

---

## 🗂️ Статус практичної частини

- ✅ Визначено стек
- ✅ Затверджено модель даних
- ✅ Створено структуру проєкту
- ✅ Реалізовано базову авторизацію
- ✅ Створено перші API для `User` та `Subject`
- ✅ Додано рольову перевірку та валідацію
- ⏳ Реалізовуються решта контролерів та API

---

## 🧭 Орієнтири в дипломній

- Реалізувати всі запити CRUD для сутностей
- Додати ER-діаграму до додатків
- Підкреслити елементи кібербезпеки (WAF, NSG, JWT)
- Описати архітектуру та рішення в теоретичному розділі
- При наявності часу — додати Swagger, refresh токени, фронтенд

---
