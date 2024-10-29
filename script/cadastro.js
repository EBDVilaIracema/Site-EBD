document.addEventListener('DOMContentLoaded', () => {
    init();

    function init() {
        loadHeader();
        loadFooter();
        initializeDateField();
        attachEventListeners();
    }

    function loadHeader() {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header').innerHTML = data;
            })
            .catch(error => console.error('Erro ao carregar o header:', error));
    }

    function loadFooter() {
        fetch('footer.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('footer').innerHTML = data;
            })
            .catch(error => console.error('Erro ao carregar o footer:', error));
    }

    function initializeDateField() {
        const classDateInput = document.getElementById('classDate');
        if (classDateInput) {
            const today = new Date().toISOString().split('T')[0];
            classDateInput.value = today;
        }
    }

    function attachEventListeners() {
        const classForm = document.getElementById('classForm');

        if (classForm) {
            classForm.addEventListener('submit', handleClassFormSubmit);
        }

        // Eventos para calcular automaticamente
        document.getElementById('enrolledStudents').addEventListener('input', updateCounts);
        document.getElementById('absentStudents').addEventListener('input', updateCounts);
        document.getElementById('visits').addEventListener('input', updateCounts);
        document.getElementById('orphanStatus').addEventListener('input', formatCurrency);
    }

    function formatCurrency(event) {
        let value = event.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        if (value) {
            value = (value / 100).toFixed(2).replace('.', ','); // Formata como moeda
            event.target.value = value;
        } else {
            event.target.value = '';
        }
    }

    function updateCounts() {
        const enrolled = parseInt(document.getElementById('enrolledStudents').value) || 0;
        const absent = parseInt(document.getElementById('absentStudents').value) || 0;
        const visits = parseInt(document.getElementById('visits').value) || 0;

        // Calcula o número de alunos presentes
        const totalPresent = enrolled - absent;
        document.getElementById('presentStudents').value = totalPresent < 0 ? 0 : totalPresent;

        // Calcula o total de assistência
        const totalAttendance = totalPresent + visits;
        document.getElementById('attendanceRate').value = totalAttendance;
    }

    function handleClassFormSubmit(event) {
        event.preventDefault();
        const newClass = getFormData();
        const classes = getClassesFromLocalStorage();

        classes.push(newClass);
        saveClassesToLocalStorage(classes);
        resetForm();
    }

    function getFormData() {
        return {
            date: document.getElementById('classDate').value,
            className: document.getElementById('studentClass').value,
            enrolledStudents: document.getElementById('enrolledStudents').value,
            absentStudents: document.getElementById('absentStudents').value,
            presentStudents: document.getElementById('presentStudents').value,
            visits: document.getElementById('visits').value,
            orphanStatus: document.getElementById('orphanStatus').value,
        };
    }

    function resetForm() {
        const classForm = document.getElementById('classForm');
        if (classForm) {
            classForm.reset();
            initializeDateField();
            updateCounts(); // Resetar contagens ao reiniciar o formulário
        }
    }

    function getClassesFromLocalStorage() {
        return JSON.parse(localStorage.getItem('classes')) || [];
    }

    function saveClassesToLocalStorage(classes) {
        localStorage.setItem('classes', JSON.stringify(classes));
    }
});
