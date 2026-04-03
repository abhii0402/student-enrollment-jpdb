# JsonPowerDB Student Enrollment Form

## Description
This project is a micro-project assigned during the JSONPowerDB (JPDB) training. It implements a complete Student Enrollment Form utilizing HTML, Vanilla CSS, and JavaScript. The objective of the application is to capture detailed student data and securely interface it with JsonPowerDB as the backend using REST APIs. It ensures data consistency automatically by providing state-aware Save, Update, and Reset functionality depending on whether a student's `Roll-No` already exists in the database.

## Benefits of using JsonPowerDB
- **Serverless API:** JsonPowerDB is built to work flawlessly over REST API without having to implement complex server-side middleware.
- **High Performance:** It is a real-time, high-performing, lightweight database that provides a blazingly fast response due to indexing and in-memory capabilities.
- **Multiple Data Types:** Handles multiple data types efficiently. It minimizes developer effort and reduces time to market.
- **NoSQL Architecture:** The schema-free nature enables seamless addition of newer features compared to rigid relational databases.
- **Cost Effective:** It drastically reduces maintenance and infrastructure budgets compared to maintaining your own persistent relational database layer.

## Release History
- **v1.0.0 (Latest)**: Initial release of the JS logic binding to `SCHOOL-DB` -> `STUDENT-TABLE` and modern glassmorphism UI layout.

## Scope of Functionalities
- Automatic validation check if the user exists via JPDB's `GET_BY_KEY` API.
- Live population of form data for modifying existing student profiles.
- Secure HTTP AJAX routing to read/write records.
- Input data sanitation prevents submission of empty fields.

## Examples of Use
1. A front desk administrator needs to enter `Roll-No` of a student.
2. If the interface detects it's a new roll number, it permits capturing details (`Name`, `Class`, etc.) and seamlessly executes the `PUT` endpoint to save data into JPDB.
3. If the administrator enters a `Roll-No` that is already in JPDB, the UI automatically populates their demographics and enables the `UPDATE` button to alter their record in the database.

## Project status
- **Completed:** Form logic and UI design fulfilled the micro-project requirements. 

## Sources
- [JsonPowerDB API Documentation](http://login2explore.com/work/)
- Styling inspirations: Apple Glassmorphism layouts.
