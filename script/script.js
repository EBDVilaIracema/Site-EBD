document.addEventListener('DOMContentLoaded', () => {
    init();

    function init() {
        loadHeader();
        loadFooter();
        initializeDateField();
        loadClasses();
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
        const classFilter = document.getElementById('classFilter');
        const classDateFilter = document.getElementById('classDateFilter');
        const backToRegistrationButton = document.getElementById('backToRegistrationButton');

        if (classForm) {
            classForm.addEventListener('submit', handleClassFormSubmit);
        }

        if (classFilter) {
            classFilter.addEventListener('change', handleClassFilterChange);
        }

        if (classDateFilter) {
            classDateFilter.addEventListener('change', handleClassDateFilterChange);
        }

        if (backToRegistrationButton) {
            backToRegistrationButton.addEventListener('click', () => {
                window.location.href = 'cadastro.html';
            });
        }

        // Eventos para calcular automaticamente
        document.getElementById('enrolledStudents').addEventListener('input', updateCounts);
        document.getElementById('absentStudents').addEventListener('input', updateCounts);
    }

    function updateCounts() {
        const enrolled = parseInt(document.getElementById('enrolledStudents').value) || 0;
        const absent = parseInt(document.getElementById('absentStudents').value) || 0;

        // Calcula o número de alunos presentes
        const totalPresent = enrolled - absent;
        document.getElementById('presentStudents').value = totalPresent < 0 ? 0 : totalPresent;
    }

    function handleClassFormSubmit(event) {
        event.preventDefault();
        const newClass = getFormData();
        const classes = getClassesFromLocalStorage();

        classes.push(newClass);
        saveClassesToLocalStorage(classes);
        resetForm();
        loadClasses();
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

    function loadClasses() {
        const classes = getClassesFromLocalStorage();
        updateClassList(classes);
        updateClassFilter(classes);
    }

    function getClassesFromLocalStorage() {
        return JSON.parse(localStorage.getItem('classes')) || [];
    }

    function saveClassesToLocalStorage(classes) {
        localStorage.setItem('classes', JSON.stringify(classes));
    }

    function updateClassList(classes) {
        const classList = document.getElementById('classList');
        classList.innerHTML = '';

        classes.forEach((classItem, index) => {
            const listItem = createClassListItem(classItem, index);
            classList.appendChild(listItem);
        });
    }

    function createClassListItem(classItem, index) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.textContent = formatClassItem(classItem);

        const deleteButton = createButton('Excluir', () => handleDeleteClass(index));
        const editButton = createButton('Alterar', () => handleEditClass(classItem));

        listItem.appendChild(deleteButton);
        listItem.appendChild(editButton);
        return listItem;
    }

    function formatClassItem(classItem) {
        return `${classItem.className} - ${classItem.date} | Matriculados: ${classItem.enrolledStudents} | Ausentes: ${classItem.absentStudents} | Presentes: ${classItem.presentStudents} | Visitas: ${classItem.visits} | Oferta: R$${classItem.orphanStatus}`;
    }

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.className = 'btn btn-danger btn-sm';
        button.textContent = text;
        button.onclick = onClick;
        return button;
    }

    function handleDeleteClass(index) {
        const classes = getClassesFromLocalStorage();
        classes.splice(index, 1);
        saveClassesToLocalStorage(classes);
        loadClasses();
    }

    function handleEditClass(classItem) {
        localStorage.setItem('classToEdit', JSON.stringify(classItem));
        window.location.href = 'cadastro.html';
    }

    function updateClassFilter(classes) {
        const classFilter = document.getElementById('classFilter');
        classFilter.innerHTML = '<option value="">Todas as Turmas</option>';

        classes.forEach(classItem => {
            const option = document.createElement('option');
            option.value = classItem.className;
            option.textContent = classItem.className;
            classFilter.appendChild(option);
        });
    }

    function handleClassFilterChange() {
        const selectedClass = document.getElementById('classFilter').value;
        const classes = getClassesFromLocalStorage();
        const filteredClasses = classes.filter(classItem => selectedClass === '' || classItem.className === selectedClass);
        updateClassList(filteredClasses);
    }

    function handleClassDateFilterChange() {
        const selectedDate = document.getElementById('classDateFilter').value;
        const classes = getClassesFromLocalStorage();
        const filteredClasses = classes.filter(classItem => {
            return selectedDate === '' || classItem.date === selectedDate;
        });
        updateClassList(filteredClasses);
    }
});
