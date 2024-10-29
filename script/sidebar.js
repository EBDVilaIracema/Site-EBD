// sidebar.js
function initSidebar() {
    const menuHtml = `
        <div id="sidebar" class="sidebar">
            <button id="closeSidebar" class="close-btn">&times;</button>
            <h2>Menu</h2>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="cadastro.html">Cadastrar Turma</a></li>
                <li><a href="turmas.html">Lista de Turmas</a></li>
                <li><a href="relatorio.html">Relatórios</a></li>
                <li><a href="cadastroAluno.html">Cadastro Aluno</a></li>
                <li><a href="listaAluno.html">Lista de Alunos</a></li>
                 <li><a href="presAluno.html">Presença de Alunos</a></li>
            </ul>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', menuHtml);

    const openSidebarButton = document.getElementById('openSidebar');
    const closeSidebarButton = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');

    const toggleSidebar = () => {
        if (sidebar.style.display === 'block') {
            sidebar.style.display = 'none';
        } else {
            sidebar.style.display = 'block';
        }
    };

    if (openSidebarButton) {
        openSidebarButton.addEventListener('click', toggleSidebar);
    }

    if (closeSidebarButton) {
        closeSidebarButton.addEventListener('click', () => {
            sidebar.style.display = 'none';
        });
    }

    sidebar.style.display = 'none'; // Oculta o menu inicialmente
}

document.addEventListener('DOMContentLoaded', initSidebar);
