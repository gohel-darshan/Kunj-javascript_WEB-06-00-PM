document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');

    // Game settings
    const gridSize = 20;
    const tileCount = 20;
    canvas.width = gridSize * tileCount;
    canvas.height = gridSize * tileCount;

    // Game state
    let snake = [];
    let food = {};
    let direction = 'right';
    let nextDirection = 'right';
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameInterval;
    let isPaused = false;
    let isGameOver = true;

    // Initialize game
    function initGame() {
        snake = [
            { x: 5, y: 10 },
            { x: 4, y: 10 },
            { x: 3, y: 10 }
        ];
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        scoreElement.textContent = score;
        highScoreElement.textContent = highScore;
        generateFood();
        isGameOver = false;
    }

    // Generate food at random position
    function generateFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        // Make sure food doesn't appear on snake
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                generateFood();
                break;
            }
        }
    }

    // Game loop
    function gameLoop() {
        if (isGameOver || isPaused) return;

        // Move snake
        direction = nextDirection;
        const head = { ...snake[0] };

        switch (direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }

        // Check collision with walls
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }

        // Check collision with self
        for (let segment of snake) {
            if (head.x === segment.x && head.y === segment.y) {
                gameOver();
                return;
            }
        }

        // Add new head
        snake.unshift(head);

        // Check if food is eaten
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreElement.textContent = score;
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('snakeHighScore', highScore);
            }
            generateFood();
        } else {
            // Remove tail if no food eaten
            snake.pop();
        }

        // Draw game
        drawGame();
    }

    // Draw game
    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        ctx.fillStyle = '#2c3e50';
        snake.forEach((segment, index) => {
            if (index === 0) {
                // Draw head
                ctx.fillStyle = '#3498db';
            } else {
                ctx.fillStyle = '#2c3e50';
            }
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        });

        // Draw food
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
    }

    // Game over
    function gameOver() {
        isGameOver = true;
        clearInterval(gameInterval);
        alert(`Game Over! Score: ${score}`);
    }

    // Start game
    function startGame() {
        if (gameInterval) {
            clearInterval(gameInterval);
        }
        initGame();
        gameInterval = setInterval(gameLoop, 100);
    }

    // Pause game
    function togglePause() {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
    }

    // Event listeners
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    });

    // Mobile controls
    upBtn.addEventListener('click', () => {
        if (direction !== 'down') nextDirection = 'up';
    });
    downBtn.addEventListener('click', () => {
        if (direction !== 'up') nextDirection = 'down';
    });
    leftBtn.addEventListener('click', () => {
        if (direction !== 'right') nextDirection = 'left';
    });
    rightBtn.addEventListener('click', () => {
        if (direction !== 'left') nextDirection = 'right';
    });

    // Touch controls for mobile
    let touchStartX = 0;
    let touchStartY = 0;

    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && direction !== 'left') nextDirection = 'right';
            else if (dx < 0 && direction !== 'right') nextDirection = 'left';
        } else {
            if (dy > 0 && direction !== 'up') nextDirection = 'down';
            else if (dy < 0 && direction !== 'down') nextDirection = 'up';
        }
    });

    // Initial draw
    drawGame();
}); 