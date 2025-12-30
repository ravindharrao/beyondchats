import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.LARAVEL_API_URL || 'http://localhost:8000/api';

class ApiService {
    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async getArticles() {
        try {
            const response = await this.client.get('/articles');
            return response.data;
        } catch (error) {
            console.error('Error fetching articles:', error.message);
            throw error;
        }
    }

    async getArticle(id) {
        try {
            const response = await this.client.get(`/articles/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching article ${id}:`, error.message);
            throw error;
        }
    }

    async updateArticle(id, data) {
        try {
            const response = await this.client.put(`/articles/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating article ${id}:`, error.message);
            throw error;
        }
    }
}

export default new ApiService();

