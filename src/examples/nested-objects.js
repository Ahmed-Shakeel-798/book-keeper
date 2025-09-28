import { Client } from "@elastic/elasticsearch";

const client = new Client({ node: "http://localhost:9200" });

// delete old indexes if exist
await client.indices.delete({ index: "bookstore_object" }, { ignore: [404] });
await client.indices.delete({ index: "bookstore_nested" }, { ignore: [404] });

// OBJECT version (default flattening)
await client.indices.create({
  index: "bookstore_object",
  body: {
    mappings: {
      properties: {
        title: { type: "text" },
        authors: {
          type: "object",   // default if you don’t specify
          properties: {
            name: { type: "keyword" },
            age: { type: "integer" }
          }
        }
      }
    }
  }
});

// NESTED version (preserves relationships)
await client.indices.create({
  index: "bookstore_nested",
  body: {
    mappings: {
      properties: {
        title: { type: "text" },
        authors: {
          type: "nested",
          properties: {
            name: { type: "keyword" },
            age: { type: "integer" }
          }
        }
      }
    }
  }
});

const doc = {
  title: "Novel",
  authors: [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 40 }
  ]
};

await client.index({ index: "bookstore_object", document: doc });
await client.index({ index: "bookstore_nested", document: doc });

// refresh so they’re searchable
await client.indices.refresh({ index: "bookstore_object" });
await client.indices.refresh({ index: "bookstore_nested" });

const wrongResult = await client.search({
  index: "bookstore_object",
  query: {
    bool: {
      must: [
        { term: { "authors.name": "Alice" } },
        { term: { "authors.age": 40 } }
      ]
    }
  }
});

console.log("OBJECT result:", wrongResult.hits.hits);

const correctResult = await client.search({
  index: "bookstore_nested",
  query: {
    nested: {
      path: "authors",
      query: {
        bool: {
          must: [
            { term: { "authors.name": "Alice" } },
            { term: { "authors.age": 40 } }
          ]
        }
      }
    }
  }
});

console.log("NESTED result:", correctResult.hits.hits);