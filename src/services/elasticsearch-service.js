import { Client } from "@elastic/elasticsearch";

class ElasticsearchService {
    static instance;
    client;

    constructor() {
        if (ElasticsearchService.instance) {
            return ElasticsearchService.instance;
        }
        this.client = new Client({
            node: "http://localhost:9200",
            apiVersion: "8.0"
        });
        ElasticsearchService.instance = this;
    }

    async ping() {
        try {
            await this.client.ping();
            console.log("Connected to Elasticsearch successfully.");
            return true;
        } catch (err) {
            console.error("Failed to connect to Elasticsearch:", err.message);
            return false;
        }
    }

    async ensureIndex() {
        try {
            const response = await this.client.indices.create(
                {
                    index: "books",
                    settings: {
                        number_of_shards: 3,
                        number_of_replicas: 1,
                    },
                },
                { ignore: [400] }
            );
            if (response.acknowledged) {
                console.log("Index 'books' is available.");
            } else {
                console.log("Index 'books' already exists or could not be created.");
            }
        } catch (err) {
            console.error("Error ensuring index 'books':", err.message);
        }
    }

    async addBook({ title, author, year }) {
        return this.client.index({
            index: "books",
            document: { title, author, year },
        });
    }

    async refreshBooksIndex() {
        return this.client.indices.refresh({ index: "books" });
    }

    async searchBooks(title) {
        return this.client.search({
            index: "books",
            query: {
                match: { title: title || "" },
            },
        });
    }

    async deleteBookById(id) {
        try {
            const result = await this.client.delete({
                index: "books",
                id,
            });
            return result;
        } catch (err) {
            throw err;
        }
    }

    async updateBookById(id, { title, author, year }) {
        try {
            const result = await this.client.update({
                index: "books",
                id,
                doc: { title, author, year },
            });
            return result;
        } catch (err) {
            throw err;
        }
    }
}

const elasticsearchService = new ElasticsearchService();
export default elasticsearchService;
