document.addEventListener('DOMContentLoaded', () => {
    init();

    function init() {
        loadClasses();
        attachEventListeners();
    }

    function attachEventListeners() {
        const classFilter = document.getElementById('classFilter');
        const classDateFilter = document.getElementById('classDateFilter');
        const backToRegistrationButton = document.getElementById('backToRegistrationButton');

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
    }

    function loadClasses() {
        const classes = getClassesFromLocalStorage();
        updateClassList(classes);
        updateClassFilter(classes);
    }

    function getClassesFromLocalStorage() {
        return JSON.parse(localStorage.getItem('classes')) || [];
    }

    function updateClassList(classes) {
        const classList = document.getElementById('classList');
        classList.innerHTML = '';

        classes.forEach((classItem) => {
            const listItem = createClassListItem(classItem);
            classList.appendChild(listItem);
        });
    }

    function createClassListItem(classItem) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.textContent = formatClassItem(classItem);

        // Botão de Excluir
        const deleteButton = createButton('Excluir', () => handleDeleteClass(classItem.id));
        const editButton = createButton('Alterar', () => handleEditClass(classItem));

        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        return listItem;
    }

    function formatClassItem(classItem) {
        const totalAttendance = calculateTotalAttendance(classItem.presentStudents, classItem.visits);
        return `${classItem.className} - ${classItem.date} | Matriculados: ${classItem.enrolledStudents} | Ausentes: ${classItem.absentStudents} | Presentes: ${classItem.presentStudents} | Visitas: ${classItem.visits} | Total de Assistência: ${totalAttendance} | Oferta: R$${parseFloat(classItem.orphanStatus).toFixed(2).replace('.', ',')}`;
    }

    function calculateTotalAttendance(presentStudents, visits) {
        return parseInt(presentStudents) + parseInt(visits);
    }

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.className = 'btn btn-danger btn-sm ml-2'; // Classe para o botão de excluir
        button.textContent = text;
        button.onclick = onClick;
        return button;
    }

    function handleDeleteClass(classId) {
        const classes = getClassesFromLocalStorage();
        // Filtra a classe que deve ser excluída
        const updatedClasses = classes.filter(classItem => classItem.id !== classId);
        saveClassesToLocalStorage(updatedClasses);
        loadClasses();
    }

    function saveClassesToLocalStorage(classes) {
        localStorage.setItem('classes', JSON.stringify(classes));
    }

    function handleEditClass(classItem) {
        localStorage.setItem('classToEdit', JSON.stringify(classItem));
        window.location.href = 'cadastro.html';
    }

    function updateClassFilter(classes) {
        const classFilter = document.getElementById('classFilter');
        classFilter.innerHTML = '<option value="">Todas as Turmas</option>';

        const uniqueClasses = [...new Set(classes.map(item => item.className))];

        uniqueClasses.forEach(className => {
            const option = document.createElement('option');
            option.value = className;
            option.textContent = className;
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
