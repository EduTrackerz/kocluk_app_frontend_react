import axios from 'axios';
import config from '../config'; // Ensure you have a config file with the backend URL

class Student {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    // Static method to fetch a student by ID
    static async getById(id) {
        // console.log("Fetching from:", `${config.backendUrl}/students?id=${id}`);
        try {
            const response = await axios.get(`${config.backendUrl}/students/getbyid`, {
                params: {
                    id: id,
                },
            });

            // Check if the response is empty or status is not 200
            if (response.status === 200) {
                if (response.data && Object.keys(response.data).length > 0) {
                    // If data exists, return student data
                    return new Student(response.data.id, response.data.name);
                } else {
                    // If data is empty, return an empty student object with a flag
                    return new Student(id, "");  // Empty name to indicate missing data
                }
            } else {
                console.error('Failed to fetch student:', response);
                return null;  // Return null if the request fails
            }
        } catch (error) {
            console.error('Error while fetching student:', error);
            return null;  // Return null on error
        }
    }
}

export default Student;
