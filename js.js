// Light/dark mode toggle
function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}

// Puzzle Logic
const puzzlePiecesContainer = document.getElementById('puzzle-pieces');
const dropZone = document.getElementById('drop-zone');
const checkPuzzleButton = document.getElementById('check-puzzle-btn');
const timeMessage = document.getElementById('time-message');

// List of puzzle piece image paths (order matters for the correct grid)
const pieces = [
    'piece_0_0.png', 'piece_0_1.png', 'piece_0_2.png',
    'piece_0_3.png', 'piece_0_4.png', 'piece_1_0.png',
    'piece_1_1.png', 'piece_1_2.png', 'piece_1_3.png',
    'piece_1_4.png', 'piece_2_0.png', 'piece_2_1.png',
    'piece_2_2.png', 'piece_2_3.png', 'piece_2_4.png'
];

// Track the start time (when the puzzle is loaded)
let startTime = null; // Start time will be null until the first piece is moved
let timerInterval = null; // Variable to hold the timer interval

// Shuffle pieces randomly but retain the original index
const shuffledPieces = pieces.map((piece, index) => ({
    src: piece,  // the image path
    originalIndex: index  // the original index of the piece
})).sort(() => Math.random() - 0.5);

// Create puzzle pieces and append them to the puzzle-pieces container
shuffledPieces.forEach((pieceData, index) => {
    const img = document.createElement('img');
    img.src = pieceData.src;
    img.draggable = true;
    img.dataset.index = index;  // Store the shuffled index
    img.dataset.originalIndex = pieceData.originalIndex;  // Store the original index for validation
    img.classList.add("puzzle-piece");  // Add class for styling

    img.addEventListener('dragstart', (e) => {
        // Start timer on the first drag start
        if (startTime === null) {
            startTime = Date.now(); // Start the timer when the first piece is moved
            startTimer(); // Start the timer immediately after starting the first drag
        }
        e.dataTransfer.setData('text/plain', pieceData.originalIndex);  // Store the original index in dataTransfer
    });

    puzzlePiecesContainer.appendChild(img);
});

// Create drop zones and append them to the drop-zone container
for (let i = 0; i < pieces.length; i++) {
    const div = document.createElement('div');
    div.dataset.index = i;  // Set the index of each drop zone

    div.addEventListener('dragover', (e) => {
        e.preventDefault();  // Allow the drop
    });

    div.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggedIndex = e.dataTransfer.getData('text/plain');  // Get the original index of the dragged piece
        const draggedPiece = document.querySelector(`[data-original-index="${draggedIndex}"]`);  // Find the dragged piece

        draggedPiece.style.width = '90px';  // Reset any width style (ensure size consistency)
        draggedPiece.style.height = '90px'; // Reset any height style (ensure size consistency)

        // Only allow drop in empty zones and if the piece is in the correct place
        if (!div.hasChildNodes() && draggedPiece.dataset.originalIndex == div.dataset.index) {
            div.appendChild(draggedPiece);  // Append dragged piece to the drop zone
        }
    });

    dropZone.appendChild(div);  // Append the drop zone to the drop-zone container
}

// Function to check if the puzzle is complete
function isPuzzleComplete() {
    const dropZones = dropZone.querySelectorAll('div');
    let isComplete = true;

    dropZones.forEach((zone, index) => {
        const piece = zone.firstChild;
        // Check if each piece is in the correct drop zone based on original index
        if (!piece || piece.dataset.originalIndex !== zone.dataset.index) {
            isComplete = false;
        }
    });

    return isComplete;
}

// Function to stop the timer
function stopTimer() {
    const elapsedTime = (Date.now() - startTime) / 1000; // Time in seconds
    clearInterval(timerInterval);  // Stop the interval if it's running
    timeMessage.textContent = `Puzle salika! Laiks: ${elapsedTime.toFixed(2)} seconds`;
}

// Function to start the timer
function startTimer() {
    if (startTime !== null) {
        timerInterval = setInterval(() => {
            const elapsedTime = (Date.now() - startTime) / 1000;
            timeMessage.textContent = `Time: ${elapsedTime.toFixed(2)} seconds`;
        }, 100); // Update every 100ms
    }
}

// Button click listener to check the puzzle and stop the timer
checkPuzzleButton.addEventListener('click', () => {
    if (isPuzzleComplete()) {
        stopTimer(); // Stop the timer if the puzzle is complete
    } else {
        timeMessage.textContent = "Puzle nav salika!";
    }
});
