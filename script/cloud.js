document.addEventListener("DOMContentLoaded", function() {
    const cloud = document.createElement("div");
    cloud.className = "cloud";
    cloud.style.display = "none"; // Inicialmente oculta
    document.body.appendChild(cloud);

    const style = document.createElement("style");
    style.innerHTML = `
        .cloud {
            position: absolute;
            top: 10%;
            left: 50%; /* Centraliza horizontalmente */
            transform: translateX(-50%);
            animation: float 6s ease-in-out infinite;
            z-index: 1;
            transition: transform 3s ease, opacity 3s ease; /* Transição para separação e desaparecimento */
        }

        .puff {
            position: absolute;
            background: linear-gradient(145deg, #444, #222);
            border-radius: 50%;
        }

        .puff1 { width: 100px; height: 100px; top: 20px; left: -20px; }
        .puff2 { width: 140px; height: 140px; top: 0px; left: 30px; }
        .puff3 { width: 100px; height: 100px; top: 25px; left: 120px; }

        @keyframes float {
            0% { transform: translate(-50%) translateY(0); }
            50% { transform: translate(-50%) translateY(-20px); }
            100% { transform: translate(-50%) translateY(0); }
        }

        .drop {
            position: absolute;
            background: rgba(0, 0, 255, 0.7);
            border-radius: 50%;
            width: 5px;
            height: 15px;
            animation: fall 1s linear infinite;
        }

        @keyframes fall {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(100px); opacity: 0; }
        }

        .lightning {
            position: absolute;
            width: 4px; /* Largura do relâmpago */
            height: 250px; /* Aumentado para 250px */
            background: rgba(255, 255, 0, 0.9);
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
            z-index: 2;
            box-shadow: 0 0 10px rgba(255, 255, 0, 0.8);
            clip-path: polygon(50% 0%, 60% 20%, 40% 20%, 50% 50%, 30% 50%, 40% 100%, 50% 80%);
        }

        @keyframes flash {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    const puff1 = document.createElement("div");
    puff1.className = "puff puff1";
    cloud.appendChild(puff1);

    const puff2 = document.createElement("div");
    puff2.className = "puff puff2";
    cloud.appendChild(puff2);

    const puff3 = document.createElement("div");
    puff3.className = "puff puff3";
    cloud.appendChild(puff3);

    let raindropInterval;
    let lightningInterval;
    let stormActive = false;

    function createRaindrop() {
        const drop = document.createElement("div");
        drop.className = "drop";
        const cloudRect = cloud.getBoundingClientRect();
        drop.style.left = `${cloudRect.left + Math.random() * cloudRect.width}px`;
        drop.style.top = `${cloudRect.top + 80}px`;
        document.body.appendChild(drop);
        drop.addEventListener('animationend', () => {
            drop.remove();
        });
    }

    function createLightning() {
        const lightning = document.createElement("div");
        lightning.className = "lightning";

        const cloudRect = cloud.getBoundingClientRect();
        const offsetX = Math.random() * cloudRect.width - 2;

        lightning.style.left = `${cloudRect.left + offsetX}px`;
        lightning.style.top = `${cloudRect.top + 30}px`;
        lightning.style.opacity = 0;

        const randomRotation = Math.random() * 10 - 5; // Rotação aleatória
        lightning.style.transform = `rotate(${randomRotation}deg)`;

        document.body.appendChild(lightning);

        lightning.style.animation = "flash 0.2s ease-in-out forwards";
        setTimeout(() => {
            lightning.style.opacity = 0;
            setTimeout(() => {
                lightning.remove();
            }, 200);
        }, 100);
    }

    // Função para fazer as nuvens se separarem e desaparecerem
    function endStorm() {
        clearInterval(raindropInterval);
        clearInterval(lightningInterval);
        document.querySelectorAll('.drop').forEach(drop => drop.remove());
        cloud.style.transform = "translateX(-200%)"; // Separa as nuvens
        cloud.style.opacity = "0"; // Desaparece
        setTimeout(() => {
            cloud.style.display = "none"; // Esconde a nuvem após a animação
        }, 3000);
    }

    // Adiciona o evento de clique na nuvem para removê-la
    cloud.addEventListener("click", function() {
        endStorm();
    });

    // Ativa a tempestade quando o mouse passa por uma área específica
    let mouseOverCount = 0;

    function mouseOverArea() {
        mouseOverCount++;
        if (mouseOverCount === 3) {
            cloud.style.display = "block"; // Mostra a nuvem
            cloud.style.opacity = "1"; // Garante que a nuvem está visível
            if (!stormActive) {
                raindropInterval = setInterval(createRaindrop, 300);
                lightningInterval = setInterval(createLightning, 1000);
                stormActive = true;
            }
        }
    }

    document.addEventListener("mousemove", (event) => {
        if (event.clientX < 100 && event.clientY < 100) {
            mouseOverArea();
        } else {
            mouseOverCount = 0; // Reseta o contador se o mouse sair da área
        }
    });
});
