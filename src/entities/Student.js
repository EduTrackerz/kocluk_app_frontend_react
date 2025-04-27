import axios from 'axios';
import config from '../config';

class Student {
    constructor(id, name, username) {
        this.id = id;
        this.name = name;
        this.username = username;
    }

    // Get student by ID
    static async getById(id) {
        return await this.fetchStudent('/students/getbyid', { id });
    }

    // Get student by username
    static async getByUsername(username) {
        return await this.fetchStudent('/students/getbyusername', { username });
    }

    // Register new student
    static async register({ username, name }) {
        try {
            const response = await axios.post(`${config.backendUrl}/students/register`, {
                username,
                name
            });

            if (response.status === 200 || response.status === 201) {
                const { id, name, username } = response.data;
                return new Student(id, name, username);
            } else {
                console.warn('Invalid registration response:', response);
                return null;
            }
        } catch (error) {
            console.error("Error while registering student:", error);
            return null;
        }
    }

    // Private method to fetch student data and map it
    static async fetchStudent(endpoint, params) {
        console.log("Fetching student from:", `${config.backendUrl}${endpoint}`);
        console.log("With params:", params);
        try {
            const response = await axios.get(`${config.backendUrl}${endpoint}`, { params });
            console.log("Raw API response:", response);
            return this.mapResponseToStudent(response);
        } catch (error) {
            console.error(`Error while fetching student from ${endpoint}:`, error);
            console.error("Error details:", error.response?.data || error.message);
            return null;
        }
    }

    // Maps API response to a Student instance
    static mapResponseToStudent(response) {
        if (response?.status === 200 && response.data && Object.keys(response.data).length > 0) {
            const { id, name, username } = response.data;
            return new Student(id, name, username);
        } else {
            console.warn('Empty or invalid student data received:', response?.data);
            return new Student(-1, 'null', '');  // Use empty string as fallback username
        }
    }
}

export default Student;
