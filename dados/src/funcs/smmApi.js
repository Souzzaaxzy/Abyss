import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, '..', 'config.json');

class SmmApi {
    constructor() {
        this.config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        this.apiUrl = this.config.smm_api_url || 'https://revisionsmm.com/api/v2';
        this.apiKey = this.config.smm_api_key;
    }

    async request(params) {
        if (!this.apiKey) {
            throw new Error('API Key da SMM não configurada no config.json');
        }

        const searchParams = new URLSearchParams();
        searchParams.append('key', this.apiKey);
        for (const [key, value] of Object.entries(params)) {
            searchParams.append(key, value);
        }

        try {
            const response = await axios.post(this.apiUrl, searchParams.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro na chamada API SMM:', error.message);
            throw error;
        }
    }

    async getServices() {
        return this.request({ action: 'services' });
    }

    async getBalance() {
        return this.request({ action: 'balance' });
    }

    async addOrder(data) {
        return this.request({ action: 'add', ...data });
    }

    async getStatus(orderId) {
        return this.request({ action: 'status', order: orderId });
    }
}

export default new SmmApi();
