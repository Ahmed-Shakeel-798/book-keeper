import express from "express";
import booksRouter from "./routes/books.js";
import elasticsearchService from "./services/elasticsearch-service.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", booksRouter);

app.get("/", (req, res) => {
  res.send("Elasticsearch Books API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  (async () => {
    await elasticsearchService.ping();
    await elasticsearchService.ensureIndex();
  })();
});
