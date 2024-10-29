document.addEventListener('DOMContentLoaded', () => {
    loadClasses();
    loadStudents();

    document.getElementById('classFilter').addEventListener('change', loadStudents);
    document.getElementById('attendanceDate').addEventListener('change', loadStudents);
    document.getElementById('registerAttendanceButton').addEventListener('click', saveAttendance);
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

function loadStudents() {
    const classFilter = document.getElementById('classFilter').value;
    const attendanceDate = document.getElementById('attendanceDate').value;
    const students = getStudentsFromLocalStorage();
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    const filteredStudents = students.filter(student => !classFilter || student.className === classFilter);

    filteredStudents.forEach(student => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = student.name;

        const classCell = document.createElement('td');
        classCell.textContent = student.className;

        const presenceCell = document.createElement('td');
        const dropdown = document.createElement('select');
        dropdown.id = `presence-${student.id}`;
        dropdown.innerHTML = `
            <option value="">Selecione</option>
            <option value="presente">Presente</option>
            <option value="falta">Falta</option>
            <option value="faltaJustificada">Falta Justificada</option>
        `;

        const existingRecord = checkAttendanceRecord(student.id, attendanceDate);
        if (existingRecord) {
            dropdown.value = existingRecord.status;
            dropdown.disabled = true; // Desabilitar se já houver registro
        }

        presenceCell.appendChild(dropdown);
        row.appendChild(nameCell);
        row.appendChild(classCell);
        row.appendChild(presenceCell);
        studentList.appendChild(row);
    });
}

function getStudentsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('students')) || [];
}

function checkAttendanceRecord(studentId, date) {
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    return attendanceRecords.find(record => record.studentId === studentId && record.date === date);
}

function saveAttendance() {
    const attendanceRecords = [];
    const attendanceDate = document.getElementById('attendanceDate').value;
    const students = getStudentsFromLocalStorage();

    students.forEach(student => {
        const dropdown = document.getElementById(`presence-${student.id}`);
        if (dropdown && dropdown.value) {
            attendanceRecords.push({
                studentId: student.id,
                date: attendanceDate,
                status: dropdown.value
            });
        }
    });

    // Salvar os registros de presença no localStorage
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    alert('Presenças registradas com sucesso!');
}
