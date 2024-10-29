document.addEventListener('DOMContentLoaded', () => { 
    init();

    function init() {
        loadHeader();
        attachEventListeners();
        loadStudents();
    }

    function loadHeader() {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header').innerHTML = data;
            })
            .catch(error => console.error('Erro ao carregar o header:', error));
    }

    function attachEventListeners() {
        const studentForm = document.getElementById('studentForm');
        if (studentForm) {
            studentForm.addEventListener('submit', handleStudentFormSubmit);
        }
    }

    function handleStudentFormSubmit(event) {
        event.preventDefault();
        const newStudent = getFormData();
        const students = getStudentsFromLocalStorage();
        students.push(newStudent);
        saveStudentsToLocalStorage(students);
        resetForm();
        loadStudents(); // Atualiza a lista de alunos
    }

    function getFormData() {
        return {
            name: document.getElementById('studentName').value,
            className: document.getElementById('studentClass').value
        };
    }

    function resetForm() {
        const studentForm = document.getElementById('studentForm');
        if (studentForm) {
            studentForm.reset();
        }
    }

    function getStudentsFromLocalStorage() {
        return JSON.parse(localStorage.getItem('students')) || [];
    }

    function saveStudentsToLocalStorage(students) {
        localStorage.setItem('students', JSON.stringify(students));
    }

    function loadStudents() {
        const students = getStudentsFromLocalStorage();
        const studentsList = document.getElementById('studentsList');
        studentsList.innerHTML = ''; // Limpa a lista atual

        students.forEach(student => {
            const listItem = document.createElement('a');
            listItem.className = 'list-group-item list-group-item-action';
            listItem.textContent = `${student.name} - ${student.className}`;
            studentsList.appendChild(listItem);
        });
    }
});
