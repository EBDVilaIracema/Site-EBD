document.addEventListener('DOMContentLoaded', () => {
    loadClasses(); // Carrega as turmas
    loadAttendanceRecords(); // Carrega os registros de presença

    document.getElementById('classFilter').addEventListener('change', loadAttendanceRecords);
    document.getElementById('dateFilter').addEventListener('change', loadAttendanceRecords);
});

function loadClasses() {
    const students = getStudentsFromLocalStorage();
    const classFilter = document.getElementById('classFilter');
    
    const uniqueClasses = [...new Set(students.map(student => student.className))];
    uniqueClasses.forEach(className => {
        const option = document.createElement('option');
        option.value = className;
        option.textContent = className;
        classFilter.appendChild(option);
    });
}

function loadAttendanceRecords() {
    const attendanceRecords = getAttendanceRecordsFromLocalStorage();
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';

    const selectedClass = document.getElementById('classFilter').value;
    const selectedDate = document.getElementById('dateFilter').value;

    // Se não houver filtros, usar todos os registros
    const filteredRecords = attendanceRecords.filter(record => {
        const matchesClass = !selectedClass || getStudentClassById(record.studentId) === selectedClass;
        const matchesDate = !selectedDate || record.date === selectedDate;
        return matchesClass && matchesDate;
    });

    // Se não houver registros filtrados, mostrar mensagem
    if (filteredRecords.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3;
        cell.textContent = 'Nenhum registro encontrado.';
        row.appendChild(cell);
        attendanceList.appendChild(row);
        return;
    }

    // Agrupando as presenças por aluno
    const studentRecords = groupAttendanceByStudent(filteredRecords);

    for (const [studentId, records] of Object.entries(studentRecords)) {
        const studentName = getStudentNameById(studentId);
        
        records.forEach(record => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = studentName;

            const dateCell = document.createElement('td');
            dateCell.textContent = record.date;

            const statusCell = document.createElement('td');
            statusCell.textContent = formatAttendanceStatus(record.status);

            row.appendChild(nameCell);
            row.appendChild(dateCell);
            row.appendChild(statusCell);
            attendanceList.appendChild(row);
        });
    }
}

function getAttendanceRecordsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('attendanceRecords')) || [];
}

function getStudentsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('students')) || [];
}

function groupAttendanceByStudent(records) {
    return records.reduce((acc, record) => {
        if (!acc[record.studentId]) {
            acc[record.studentId] = [];
        }
        acc[record.studentId].push(record);
        return acc;
    }, {});
}

function getStudentNameById(studentId) {
    const students = getStudentsFromLocalStorage();
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Desconhecido';
}

function getStudentClassById(studentId) {
    const students = getStudentsFromLocalStorage();
    const student = students.find(s => s.id === studentId);
    return student ? student.className : 'Desconhecido';
}

function formatAttendanceStatus(status) {
    switch (status) {
        case 'presente':
            return 'Presente';
        case 'falta':
            return 'Falta';
        case 'faltaJustificada':
            return 'Falta Justificada';
        default:
            return 'Desconhecido';
    }
}
