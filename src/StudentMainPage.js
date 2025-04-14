import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Student from './entities/Student'; // Import the Student class

function StudentMainPage() {
    const { id } = useParams(); // Get the student ID from URL params
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            const fetchedStudent = await Student.getById(id); // Fetch student using the ID
            console.log("Fetched student on main page:", fetchedStudent);
            setStudent(fetchedStudent);
            setLoading(false);
        };

        fetchStudent();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!student) {
        return <div>Student not found</div>;
    }

    return (
        <div>
            <p>ID: {student.id}</p>
            <h2>{student.name || "İsimsiz Öğrenci"}</h2>
        </div>
    );
}

export default StudentMainPage;
