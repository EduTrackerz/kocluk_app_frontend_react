import axios from 'axios';
import config from '../config';

class Teacher {
    constructor(id, name, username, branch) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.branch = branch;
    }

    static async getById(id) {
        return await this.fetchTeacher('/teachers/getbyid', { id });
    }

    static async getByUsername(username) {
        return await this.fetchTeacher('/teachers/getbyusername', { username });
    }

    static async register({ username, name, branch }) {
        try {
            const response = await axios.post(`${config.backendUrl}/teachers/register`, {
                username,
                name,
                branch
            });

            if (response.status === 200 || response.status === 201) {
                const { id, name, username, branch } = response.data;
                return new Teacher(id, name, username, branch);
            } else {
                console.warn('Invalid registration response:', response);
                return null;
            }
        } catch (error) {
            console.error("Error while registering teacher:", error);
            return null;
        }
    }

    static async fetchTeacher(endpoint, params) {
        try {
            const response = await axios.get(`${config.backendUrl}${endpoint}`, { params });
            return this.mapResponseToTeacher(response);
        } catch (error) {
            console.error(`Error while fetching teacher from ${endpoint}:`, error);
            return null;
        }
    }

    static mapResponseToTeacher(response) {
        if (response?.status === 200 && response.data && Object.keys(response.data).length > 0) {
            const { id, name, username, branch } = response.data;
            return new Teacher(id, name, username, branch);
        } else {
            console.warn('Empty or invalid teacher data received:', response?.data);
            return new Teacher(-1, 'null', '', null);
        }
    }
}

export default Teacher;
