import axios from 'axios';
import config from '../config';

class Teacher {
    constructor(id, name, username) {
        this.id = id;
        this.name = name;
        this.username = username;
    }

    // Get teacher by ID
    static async getById(id) {
        return await this.fetchTeacher('/teachers/getbyid', { id });
    }

    // Get teacher by username
    static async getByUsername(username) {
        return await this.fetchTeacher('/teachers/getbyusername', { username });
    }

    // Register new teacher
    static async register({ username, name }) {
        try {
            const response = await axios.post(`${config.backendUrl}/teachers/register`, {
                username,
                name
            });

            if (response.status === 200 || response.status === 201) {
                const { id, name, username } = response.data;
                return new Teacher(id, name, username);
            } else {
                console.warn('Invalid registration response:', response);
                return null;
            }
        } catch (error) {
            console.error("Error while registering teacher:", error);
            return null;
        }
    }

    // Private method to fetch teacher data and map it
    static async fetchTeacher(endpoint, params) {
        try {
            const response = await axios.get(`${config.backendUrl}${endpoint}`, { params });
            return this.mapResponseToTeacher(response);
        } catch (error) {
            console.error(`Error while fetching teacher from ${endpoint}:`, error);
            return null;
        }
    }

    // Maps API response to a Teacher instance
    static mapResponseToTeacher(response) {
        if (response?.status === 200 && response.data && Object.keys(response.data).length > 0) {
            const { id, name, username } = response.data;
            return new Teacher(id, name, username);
        } else {
            console.warn('Empty or invalid teacher data received:', response?.data);
            return new Teacher(-1, 'null', '');  // Use empty string as fallback username
        }
    }
}

export default Teacher;
