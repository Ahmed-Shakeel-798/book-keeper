import { Client } from "@elastic/elasticsearch";

const client = new Client({ node: "http://localhost:9200" });

async function run() {
  // 1. Delete index if it already exists (for clean re-runs)
  try {
    await client.indices.delete({ index: "books" });
  } catch (e) {
    // ignore if not exists
  }

  // 2. Create index with manual mapping
  await client.indices.create({
    index: "books_count_docs",
    body: {
      mappings: {
        properties: {
          title: {
            type: "text",
            fields: {
                keyword: { type: "keyword" }
            }
        },
        author: { type: "keyword" },          // exact match field
        year: { type: "integer" }             // numeric field
        }
      }
    }
  });

  console.log("Index created with mapping ✅");

  // 3. Insert some documents
  await client.index({
    index: "books",
    document: { title: "Alice in Wonderland", author: "Carroll", year: 1865 }
  });

  await client.index({
    index: "books",
    document: { title: "Bob and Alice Adventures", author: "Smith", year: 2005 }
  });

  await client.index({
    index: "books",
    document: { title: "The Rabbit Hole", author: "Jones", year: 2010 }
  });

  // Make docs searchable
  await client.indices.refresh({ index: "books" });

  console.log("Documents inserted ✅");

  // 4. Count all documents
  let res = await client.count({
    index: "books",
    query: { match_all: {} }
  });
  console.log("Total books:", res.count);

  // 5. Count docs containing the word "Alice"
  res = await client.count({
    index: "books",
    query: { match: { title: "Alice" } }
  });
  console.log("Books with 'Alice' in title:", res.count);

  // 6. Count docs with exact title (keyword match)
  res = await client.count({
    index: "books",
    query: { term: { "title.keyword": "Alice in Wonderland" } }
  });
  console.log("Books with exact title 'Alice in Wonderland':", res.count);

  // 7. Count docs published after year 2000
  res = await client.count({
    index: "books",
    query: { range: { year: { gte: 2000 } } }
  });
  console.log("Books published after 2000:", res.count);

  // 8. Count docs that have Alice in title AND year >= 2000
  res = await client.count({
    index: "books",
    query: {
      bool: {
        must: [
          { match: { title: "Alice" } },
          { range: { year: { gte: 2000 } } }
        ]
      }
    }
  });
  console.log("Books with 'Alice' in title AND year >= 2000:", res.count);
}

run().catch(console.error);
