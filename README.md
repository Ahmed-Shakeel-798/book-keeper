# Elasticsearch Books API

This project is a Node.js REST API for managing a collection of books using Elasticsearch as the backend search engine. It follows an MVC-like structure with class-based services and controllers.

## Project Structure

- `src/services/elasticsearch-service.js`: Singleton class for connecting to Elasticsearch and handling all index/document operations.
- `src/routes/books.js`: Class-based controller and Express routes for CRUD operations on books.
- `src/index.js`: Express server setup and route registration.
- `src/package.json`: Project dependencies and scripts.
- `elasticsearch-docker-compose.yml`: Docker Compose file for running an Elasticsearch instance locally.

## Features

- Add, update, delete, and search books by title.
- All Elasticsearch logic is encapsulated in a singleton service class.
- API endpoints are organized in a class-based controller.

## API Endpoints

- `POST /api/books` — Add a new book
- `GET /api/books?title=...` — Search books by title
- `PUT /api/books/:id` — Update a book by ID
- `DELETE /api/books/:id` — Delete a book by ID

## Running Elasticsearch with Docker

The `elasticsearch-docker-compose.yml` file allows you to quickly start an Elasticsearch server locally using Docker. This is required for the API to function.

**To start Elasticsearch:**

```powershell
# In the project root directory
docker-compose -f elasticsearch-docker-compose.yml up
```

This will start an Elasticsearch instance on `http://localhost:9200`.

## Getting Started

1. Start Elasticsearch using Docker as described above.
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the API server:
   ```powershell
   npm run start
   ```
4. Use Postman or cURL to interact with the API endpoints.

## Notes
- Ensure Docker is installed and running on your machine.
- The API expects Elasticsearch to be available at `http://localhost:9200`.
- All book documents are stored in the `books` index in Elasticsearch.

---

Feel free to extend the API with more features or integrate with a frontend!
