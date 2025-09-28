import express from "express";
import elasticsearchService from "../services/elasticsearch-service.js";

class BooksController {
  async addBooks(req, res) {
    try {
      let books = req.body;

      // Normalize: allow sending single object or array
      if (!Array.isArray(books)) {
        books = [books];
      }

      const result = await elasticsearchService.addBooks(books);

      res.status(201).json({
        message: `${books.length} book(s) indexed successfully`,
        result,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchBooks(req, res) {
    try {
      const { title } = req.query;
      const result = await elasticsearchService.searchBooks(title);
      res.json(result.hits.hits);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getBooksMapping(req, res) {
    try {
      const mapping = await elasticsearchService.getBooksMapping();
      res.json(mapping);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateBook(req, res) {
    try {
      const { id } = req.params;
      const { title, author, year } = req.body;
      const result = await elasticsearchService.updateBookById(id, { title, author, year });
      res.json({ result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteBook(req, res) {
    try {
      const { id } = req.params;
      const result = await elasticsearchService.deleteBookById(id);
      res.json({ result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

const booksController = new BooksController();
const router = express.Router();

router.post("/books", (req, res) => booksController.addBooks(req, res));
router.get("/books", (req, res) => booksController.searchBooks(req, res));
router.get("/books/mapping", (req, res) => booksController.getBooksMapping(req, res));

router.put("/books/:id", (req, res) => booksController.updateBook(req, res));
router.delete("/books/:id", (req, res) => booksController.deleteBook(req, res));

export default router;
