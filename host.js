// State management
let participants = [];

// DOM Elements
const participantForm = document.getElementById('participant-form');
const nameInput = document.getElementById('participant-name');
const scoreInput = document.getElementById('participant-score');
const participantsList = document.getElementById('participants-list');
const resetBtn = document.getElementById('reset-btn');
const modal = document.getElementById('modal');
const confirmResetBtn = document.getElementById('confirm-reset');
const cancelResetBtn = document.getElementById('cancel-reset');

// Initialize app
function init() {
    participants = loadFromLocalStorage();
    sortParticipants(participants);
    setupEventListeners();
    renderHostView();
}

// Event Listeners
function setupEventListeners() {
    // Form submission
    participantForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addOrUpdateParticipant();
    });

    // Reset button
    resetBtn.addEventListener('click', () => {
        showModal();
    });

    // Modal actions
    confirmResetBtn.addEventListener('click', () => {
        resetLeaderboard();
        hideModal();
    });

    cancelResetBtn.addEventListener('click', () => {
        hideModal();
    });

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });
}

// Add or update participant
function addOrUpdateParticipant() {
    const name = nameInput.value.trim();
    const score = parseInt(scoreInput.value);

    if (!name || isNaN(score)) {
        return;
    }

    // Check if participant exists
    const existingIndex = participants.findIndex(
        p => p.name.toLowerCase() === name.toLowerCase()
    );

    if (existingIndex !== -1) {
        // Update existing participant
        participants[existingIndex].score = score;
    } else {
        // Add new participant
        participants.push({ name, score });
    }

    // Sort by score (highest first)
    sortParticipants(participants);

    // Save and render
    saveToLocalStorage(participants);
    renderHostView();

    // Clear form
    nameInput.value = '';
    scoreInput.value = '';
    nameInput.focus();
}

// Reset leaderboard
function resetLeaderboard() {
    participants = [];
    saveToLocalStorage(participants);
    renderHostView();
}

// Render host view
function renderHostView() {
    if (participants.length === 0) {
        participantsList.innerHTML = '<div class="empty-state">No participants yet. Add one above!</div>';
        return;
    }

    participantsList.innerHTML = participants.map((participant, index) => `
        <div class="participant-item">
            <div class="participant-info">
                <div class="participant-rank">#${index + 1}</div>
                <div class="participant-name">${escapeHtml(participant.name)}</div>
            </div>
            <div class="participant-score">${participant.score}</div>
        </div>
    `).join('');
}

// Modal functions
function showModal() {
    modal.classList.add('active');
}

function hideModal() {
    modal.classList.remove('active');
}

// Save to localStorage
function saveToLocalStorage(participants) {
    try {
        localStorage.setItem('quizLeaderboard', JSON.stringify(participants));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

// Load from localStorage
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('quizLeaderboard');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error('Error loading from localStorage:', e);
    }
    return [];
}

// Sort participants by score
function sortParticipants(participants) {
    participants.sort((a, b) => b.score - a.score);
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
