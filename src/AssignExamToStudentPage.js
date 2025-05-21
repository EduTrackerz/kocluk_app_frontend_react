import React from 'react';
import { useParams } from 'react-router-dom';
import AssignExamToStudent from './AssignExamToStudent';

const AssignExamToStudentPage = () => {
    const { id: teacherId } = useParams();

    return (
        <div className="assign-exam-page">
            <h2>📘 Sınav Atama Sayfası</h2>
            <AssignExamToStudent teacherId={teacherId} />
        </div>
    );
};

export default AssignExamToStudentPage;