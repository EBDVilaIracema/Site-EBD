document.addEventListener('DOMContentLoaded', () => { 
    const reportDateInput = document.getElementById('reportDate');

    // Define a data atual no campo de data
    if (reportDateInput) {
        const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
        reportDateInput.value = today; // Preenche o campo com a data atual

        reportDateInput.addEventListener('change', generateReport);
        generateReport(); // Gera o relatório inicial com a data atual
    }

    function generateReport() {
        const selectedDate = reportDateInput.value;
        const classes = getClassesFromLocalStorage();

        // Filtra classes pela data selecionada
        const filteredClasses = classes.filter(classItem => classItem.date === selectedDate);

        // Calcula os totais
        const totals = calculateTotals(filteredClasses);

        // Exibe os resultados
        displayReport(totals, filteredClasses.length === 0);
    }

    function getClassesFromLocalStorage() {
        return JSON.parse(localStorage.getItem('classes')) || [];
    }

    function calculateTotals(classes) {
        return classes.reduce((acc, classItem) => {
            acc.enrolledStudents += parseInt(classItem.enrolledStudents);
            acc.absentStudents += parseInt(classItem.absentStudents);
            acc.presentStudents += parseInt(classItem.presentStudents);
            acc.visits += parseInt(classItem.visits);
            acc.totalAttendance += calculateTotalAttendance(classItem.presentStudents, classItem.visits);
            acc.orphanStatus += parseFloat(classItem.orphanStatus);
            return acc;
        }, {
            enrolledStudents: 0,
            absentStudents: 0,
            presentStudents: 0,
            visits: 0,
            totalAttendance: 0,
            orphanStatus: 0
        });
    }

    function calculateTotalAttendance(presentStudents, visits) {
        return parseInt(presentStudents) + parseInt(visits);
    }

    function displayReport(totals, noReports) {
        const reportResults = document.getElementById('reportResults');

        if (noReports) {
            reportResults.innerHTML = `<p>Não há relatórios disponíveis para a data selecionada.</p>`;
        } else {
            reportResults.innerHTML = `
                <p>Alunos Matriculados: ${totals.enrolledStudents}</p>
                <p>Alunos Ausentes: ${totals.absentStudents}</p>
                <p>Alunos Presentes: ${totals.presentStudents}</p>
                <p>Visitas: ${totals.visits}</p>
                <p>Total de Assistência: ${totals.totalAttendance}</p>
                <p>Oferta: R$${totals.orphanStatus.toFixed(2).replace('.', ',')}</p>
            `;
        }
    }
});
