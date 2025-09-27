import express from "express";
import elasticsearchService from "../services/elasticsearch-service.js";

class BooksController {
  async addBook(req, res) {
    try {
      const { title, author, year } = req.body;
      const result = await elasticsearchService.addBook({ title, author, year });
      await elasticsearchService.refreshBooksIndex();
      res.status(201).json({ result });
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

router.post("/books", (req, res) => booksController.addBook(req, res));
router.get("/books", (req, res) => booksController.searchBooks(req, res));

router.put("/books/:id", (req, res) => booksController.updateBook(req, res));
router.delete("/books/:id", (req, res) => booksController.deleteBook(req, res));

export default router;
