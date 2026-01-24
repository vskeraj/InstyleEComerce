import { Client } from '@elastic/elasticsearch';

class ElasticsearchClient {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      auth: process.env.ELASTICSEARCH_PASSWORD ? {
        username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD
      } : undefined
    });
  }

  async indexLog(index: string, logData: any) {
    try {
      await this.client.index({
        index,
        body: {
          ...logData,
          '@timestamp': new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to index log:', error);
    }
  }

  async searchLogs(index: string, query: any) {
    try {
      const result = await this.client.search({
        index,
        body: query
      });
      return result.hits.hits;
    } catch (error) {
      console.error('Failed to search logs:', error);
      return [];
    }
  }
}

export const elasticsearchClient = new ElasticsearchClient();
