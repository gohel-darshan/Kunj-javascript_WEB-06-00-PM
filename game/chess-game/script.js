document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.chess-board');
    const newGameBtn = document.getElementById('newGameBtn');
    const undoBtn = document.getElementById('undoBtn');
    const flipBoardBtn = document.getElementById('flipBoardBtn');
    const playerTurnDisplay = document.querySelectorAll('.player-turn');
    const timerDisplay = document.querySelector('.timer');

    let gameState = {
        board: [],
        currentPlayer: 'white',
        selectedPiece: null,
        validMoves: [],
        moveHistory: [],
        capturedPieces: { white: [], black: [] },
        isFlipped: false,
        cursorPosition: { row: 0, col: 0 }
    };

    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyPress);

    // Initialize the game
    function initGame() {
        createBoard();
        setupPieces();
        updatePlayerTurn();
        startTimer();
    }

    // Create the chess board
    function createBoard() {
        board.innerHTML = '';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                square.addEventListener('click', handleSquareClick);
                board.appendChild(square);
            }
        }
        // Add initial cursor
        const initialSquare = document.querySelector(`.square[data-row="0"][data-col="0"]`);
        if (initialSquare) {
            initialSquare.classList.add('cursor');
        }
    }

    // Set up initial piece positions
    function setupPieces() {
        const initialBoard = [
            ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
            ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
            ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
        ];

        gameState.board = initialBoard.map((row, rowIndex) => 
            row.map((piece, colIndex) => {
                if (piece) {
                    const color = rowIndex < 2 ? 'black' : 'white';
                    return { type: piece, color };
                }
                return null;
            })
        );

        renderBoard();
    }

    // Render the current board state
    function renderBoard() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.innerHTML = '';
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            const piece = gameState.board[row][col];

            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.className = `piece ${piece.color} ${piece.type}`;
                square.appendChild(pieceElement);
            }
        });
    }

    // Handle square clicks
    function handleSquareClick(e) {
        const square = e.currentTarget;
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const piece = gameState.board[row][col];

        // If a piece is selected and this is a valid move
        if (gameState.selectedPiece && gameState.validMoves.some(move => 
            move.row === row && move.col === col)) {
            movePiece(gameState.selectedPiece.row, gameState.selectedPiece.col, row, col);
            return;
        }

        // If clicking on a piece of the current player's color
        if (piece && piece.color === gameState.currentPlayer) {
            selectPiece(row, col);
        }
    }

    // Select a piece and show valid moves
    function selectPiece(row, col) {
        // Clear previous selection
        document.querySelectorAll('.square').forEach(sq => {
            sq.classList.remove('selected', 'valid-move');
        });

        gameState.selectedPiece = { row, col };
        gameState.validMoves = calculateValidMoves(row, col);

        // Highlight selected piece and valid moves
        const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
        square.classList.add('selected');

        gameState.validMoves.forEach(move => {
            const moveSquare = document.querySelector(
                `.square[data-row="${move.row}"][data-col="${move.col}"]`
            );
            moveSquare.classList.add('valid-move');
        });
    }

    // Calculate valid moves for a piece
    function calculateValidMoves(row, col) {
        const piece = gameState.board[row][col];
        if (!piece) return [];

        const moves = [];
        // Basic move calculations (simplified for this example)
        switch (piece.type) {
            case 'pawn':
                const direction = piece.color === 'white' ? -1 : 1;
                // Forward move
                if (isValidSquare(row + direction, col) && !gameState.board[row + direction][col]) {
                    moves.push({ row: row + direction, col });
                }
                // Capture moves
                [-1, 1].forEach(offset => {
                    const newRow = row + direction;
                    const newCol = col + offset;
                    if (isValidSquare(newRow, newCol) && 
                        gameState.board[newRow][newCol]?.color !== piece.color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                });
                break;
            // Add other piece movements here
        }
        return moves;
    }

    // Check if a square is within the board
    function isValidSquare(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    // Move a piece
    function movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = gameState.board[fromRow][fromCol];
        const capturedPiece = gameState.board[toRow][toCol];

        if (capturedPiece) {
            gameState.capturedPieces[piece.color].push(capturedPiece);
            updateCapturedPieces();
        }

        gameState.board[toRow][toCol] = piece;
        gameState.board[fromRow][fromCol] = null;
        gameState.moveHistory.push({ fromRow, fromCol, toRow, toCol, piece, capturedPiece });

        // Clear selection and valid moves
        gameState.selectedPiece = null;
        gameState.validMoves = [];
        document.querySelectorAll('.square').forEach(sq => {
            sq.classList.remove('selected', 'valid-move');
        });

        // Switch player
        gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
        updatePlayerTurn();
        renderBoard();
    }

    // Update the player turn display
    function updatePlayerTurn() {
        playerTurnDisplay.forEach(display => {
            display.textContent = `${gameState.currentPlayer.charAt(0).toUpperCase() + 
                gameState.currentPlayer.slice(1)}'s Turn`;
        });
    }

    // Update captured pieces display
    function updateCapturedPieces() {
        const whiteCaptured = document.querySelector('.white-captured');
        const blackCaptured = document.querySelector('.black-captured');

        whiteCaptured.innerHTML = gameState.capturedPieces.white
            .map(piece => `<div class="piece ${piece.color} ${piece.type}"></div>`)
            .join('');

        blackCaptured.innerHTML = gameState.capturedPieces.black
            .map(piece => `<div class="piece ${piece.color} ${piece.type}"></div>`)
            .join('');
    }

    // Timer functionality
    function startTimer() {
        let seconds = 0;
        setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // Event listeners
    newGameBtn.addEventListener('click', initGame);
    undoBtn.addEventListener('click', () => {
        if (gameState.moveHistory.length > 0) {
            const lastMove = gameState.moveHistory.pop();
            gameState.board[lastMove.fromRow][lastMove.fromCol] = lastMove.piece;
            gameState.board[lastMove.toRow][lastMove.toCol] = lastMove.capturedPiece;
            
            if (lastMove.capturedPiece) {
                gameState.capturedPieces[lastMove.piece.color].pop();
                updateCapturedPieces();
            }

            gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
            updatePlayerTurn();
            renderBoard();
        }
    });

    flipBoardBtn.addEventListener('click', () => {
        gameState.isFlipped = !gameState.isFlipped;
        board.style.transform = gameState.isFlipped ? 'rotate(180deg)' : 'none';
        document.querySelectorAll('.piece').forEach(piece => {
            piece.style.transform = gameState.isFlipped ? 'rotate(180deg)' : 'none';
        });
    });

    function handleKeyPress(e) {
        const { row, col } = gameState.cursorPosition;
        let newRow = row;
        let newCol = col;

        switch(e.key) {
            case 'ArrowUp':
                newRow = Math.max(0, row - 1);
                break;
            case 'ArrowDown':
                newRow = Math.min(7, row + 1);
                break;
            case 'ArrowLeft':
                newCol = Math.max(0, col - 1);
                break;
            case 'ArrowRight':
                newCol = Math.min(7, col + 1);
                break;
            case 'Enter':
                const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
                if (square) {
                    handleSquareClick({ currentTarget: square });
                }
                return;
            case 'Escape':
                // Clear selection
                gameState.selectedPiece = null;
                gameState.validMoves = [];
                document.querySelectorAll('.square').forEach(sq => {
                    sq.classList.remove('selected', 'valid-move');
                });
                return;
        }

        // Update cursor position
        if (newRow !== row || newCol !== col) {
            // Remove previous cursor highlight
            const prevSquare = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
            if (prevSquare) {
                prevSquare.classList.remove('cursor');
            }

            // Add cursor highlight to new position
            const newSquare = document.querySelector(`.square[data-row="${newRow}"][data-col="${newCol}"]`);
            if (newSquare) {
                newSquare.classList.add('cursor');
            }

            gameState.cursorPosition = { row: newRow, col: newCol };
        }
    }

    // Initialize the game
    initGame();
}); 