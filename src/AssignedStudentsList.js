import React from 'react';

const AssignedStudentsList = ({ assignedStudents }) => {
    return (
        <div className="assigned-students-list">
            <h3>👨‍🎓 Atanan Öğrenciler</h3>
            {assignedStudents.length > 0 ? (
                <ul>
                    {assignedStudents.map((student) => (
                        <li key={student.id}>
                            {student.name} ({student.username})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>📭 Henüz size atanan öğrenci bulunmamaktadır.</p>
            )}
        </div>
    );
};

export default AssignedStudentsList;