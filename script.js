document.addEventListener('DOMContentLoaded', () => {
    const gameCanvas = document.getElementById('game-canvas');
    const livesDisplay = document.getElementById('lives-display');
    const storyBox = document.getElementById('story-box');

    let player = document.createElement('div');
    player.classList.add('player');
    gameCanvas.appendChild(player);

    let playerPosition = { x: 50, y: 350 };
    let lives = 3;
    let obstacleSpeed = 2;
    let gameActive = true; // Nuevo: Controla si el juego está activo

    // Las mismas configuraciones de obstáculos y elementos
    const obstacles = [
        { x: 200, y: 150 },
        { x: 400, y: 300 },
        { x: 100, y: 50 }
    ];
    const obstacleElements = [];
    obstacles.forEach(obstaclePos => {
        let obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.left = `${obstaclePos.x}px`;
        obstacle.style.top = `${obstaclePos.y}px`;
        gameCanvas.appendChild(obstacle);
        obstacleElements.push(obstacle);
    });

    // Nuevo: Posición del hermano (condición de victoria)
    const brotherPosition = { x: 500, y: 50 };

    let brother = document.createElement('div');
    brother.classList.add('player'); // Puedes usar otra clase para diferenciarlo visualmente
    brother.style.left = `${brotherPosition.x}px`;
    brother.style.top = `${brotherPosition.y}px`;
    gameCanvas.appendChild(brother);

    // Funciones de movimiento y colisión
    function updatePlayerPosition() {
        if (!gameActive) return; // Si el juego no está activo, no permite el movimiento
        player.style.left = `${playerPosition.x}px`;
        player.style.top = `${playerPosition.y}px`;
        checkCollision();
        checkWinCondition();
    }

    function moveObstacles() {
        if (!gameActive) return; // Si el juego no está activo, los obstáculos se detienen
        obstacles.forEach((obstaclePos, index) => {
            obstaclePos.x += obstacleSpeed;
            if (obstaclePos.x > 600) {
                obstaclePos.x = -50;
            }
            obstacleElements[index].style.left = `${obstaclePos.x}px`;
        });
        requestAnimationFrame(moveObstacles);
    }

    function checkCollision() {
        const playerRect = player.getBoundingClientRect();
        
        obstacles.forEach(obstaclePos => {
            const obstacleRect = {
                left: obstaclePos.x,
                top: obstaclePos.y,
                right: obstaclePos.x + 50,
                bottom: obstaclePos.y + 50
            };

            if (playerRect.left < obstacleRect.right &&
                playerRect.right > obstacleRect.left &&
                playerRect.top < obstacleRect.bottom &&
                playerRect.bottom > obstacleRect.top) {
                
                loseLife();
                playerPosition = { x: 50, y: 350 };
                updatePlayerPosition();
            }
        });
    }

    // Nuevo: Revisa si el jugador ha llegado a la posición de su hermano
    function checkWinCondition() {
        const distanceX = Math.abs(playerPosition.x - brotherPosition.x);
        const distanceY = Math.abs(playerPosition.y - brotherPosition.y);
        
        // Si el jugador está lo suficientemente cerca del hermano
        if (distanceX < 20 && distanceY < 20) {
            storyBox.textContent = "¡Felicidades! ¡Has encontrado a tu hermano!";
            stopGame(); // Detiene el juego
        }
    }

    function loseLife() {
        lives--;
        livesDisplay.textContent = lives;
        if (lives <= 0) {
            storyBox.textContent = "¡GAME OVER! No pudiste encontrar a tu hermano.";
            stopGame(); // Detiene el juego al quedarse sin vidas
        } else {
            storyBox.textContent = `¡Te golpeaste! Vidas restantes: ${lives}.`;
        }
    }

    // Nuevo: Función para detener el juego
    function stopGame() {
        gameActive = false;
        storyBox.style.color = '#ff0000'; // Opcional: Cambia el color del texto a rojo
    }

    // Lógica de la historia y dificultad
    const story = [
        "Has llegado a la isla. La densa selva te rodea.",
        "Un camino escondido te lleva más adentro. Es hora de explorar.",
        "Escuchas un crujido en los arbustos. ¿Será tu hermano?",
        "Ten cuidado, el camino por delante es traicionero."
    ];

    function updateStory() {
        if (storyIndex < story.length) {
            storyBox.textContent = story[storyIndex];
        }
    }

    function increaseDifficulty() {
        if (!gameActive) return; // Si el juego no está activo, no aumenta la dificultad
        obstacleSpeed += 0.5;
        storyBox.textContent = `¡La dificultad ha aumentado!`;
    }

    // Eventos y llamadas iniciales
    let storyIndex = 0;
    document.addEventListener('keydown', (e) => {
        const step = 10;
        if (!gameActive) return; // Si el juego no está activo, no responde a las teclas
        switch(e.key) {
            case 'ArrowUp': playerPosition.y -= step; break;
            case 'ArrowDown': playerPosition.y += step; break;
            case 'ArrowLeft': playerPosition.x -= step; break;
            case 'ArrowRight': playerPosition.x += step; break;
        }
        updatePlayerPosition();
    });

    moveObstacles();
    setInterval(increaseDifficulty, 10000);
    updateStory();
    updatePlayerPosition();
});