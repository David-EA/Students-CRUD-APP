# Students-CRUD-APP

## Setup and Run Instructions

1. **Clone the repository:**
   ```
   git clone https://github.com/David-EA/Students-CRUD-APP.git
   cd Students-CRUD-APP
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Set up environment variables:**
   - fill in your MongoDB connection string and other values like your port.

4. **Run the application:**
   ```
   **install nodemon**
    npm install -g nodemon
   **start your server**
    nodemon index.js
   ```
   The server will start on the port specified in your `.env` file (default: 3000).

---

## Importing and Executing the Postman Collection

1. Open Postman.
2. Click `Import` and select the provided `Students DB.postman_collection.json` file.
3. Use the collection to send requests to the API endpoints.
4. To run all requests and tests, use the "Runner" feature in Postman.

---

## Assumptions and Design Decisions

- Used MongoDB with Mongoose for data storage.
- Email field is unique and validated in both the schema and controller.
- Pagination defaults to 10 items per page if not specified.
- No authentication is implemented for simplicity.
- Error handling returns appropriate HTTP status codes and messages.
- Filtering by `lastName` is supported via query parameters.