import axios from 'axios';
import config from '../config';

class Admin {
    constructor(id, name, username) {
        this.id = id;
        this.name = name;
        this.username = username;
    }

    // Get admin by ID
    static async getById(id) {
        return await this.fetchAdmin('/admins/getbyid', { id });
    }

    // Get admin by username
    static async getByUsername(username) {
        return await this.fetchAdmin('/admins/getbyusername', { username });
    }

    // Register new admin
    static async register({ username, name }) {
        try {
            const response = await axios.post(`${config.backendUrl}/admins/register`, {
                username,
                name
            });

            if (response.status === 200 || response.status === 201) {
                const { id, name, username } = response.data;
                return new Admin(id, name, username);
            } else {
                console.warn('Invalid registration response:', response);
                return null;
            }
        } catch (error) {
            console.error("Error while registering admin:", error);
            return null;
        }
    }

    // Private method to fetch admin data and map it
    static async fetchAdmin(endpoint, params) {
        try {
            const response = await axios.get(`${config.backendUrl}${endpoint}`, { params });
            return this.mapResponseToAdmin(response);
        } catch (error) {
            console.error(`Error while fetching admin from ${endpoint}:`, error);
            return null;
        }
    }

    // Maps API response to a Admin instance
    static mapResponseToAdmin(response) {
        if (response?.status === 200 && response.data && Object.keys(response.data).length > 0) {
            const { id, name, username } = response.data;
            return new Admin(id, name, username);
        } else {
            console.warn('Empty or invalid admin data received:', response?.data);
            return new Admin(-1, 'null', '');  // Use empty string as fallback username
        }
    }
}

export default Admin;
