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
        <div class="participant-item" data-index="${index}">
            <div class="participant-info">
                <div class="participant-rank">#${index + 1}</div>
                <div class="participant-name">${escapeHtml(participant.name)}</div>
            </div>
            <div class="participant-actions">
                <div class="participant-score">${participant.score}</div>
                <button class="btn-edit" onclick="editParticipantScore(${index})" title="Edit score">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
            </div>
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

// Edit participant score
function editParticipantScore(index) {
    const participantItem = participantsList.querySelector(`[data-index="${index}"]`);
    const participant = participants[index];
    const actionsDiv = participantItem.querySelector('.participant-actions');
    
    // Create inline edit input
    actionsDiv.innerHTML = `
        <input 
            type="number" 
            class="edit-score-input" 
            value="${participant.score}" 
            min="0"
            id="edit-score-${index}"
            autofocus>
        <button class="btn-save" onclick="saveParticipantScore(${index})" title="Save">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </button>
        <button class="btn-cancel" onclick="cancelEditScore()" title="Cancel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
    
    // Focus and select the input
    const input = document.getElementById(`edit-score-${index}`);
    input.focus();
    input.select();
    
    // Allow Enter key to save
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveParticipantScore(index);
        } else if (e.key === 'Escape') {
            cancelEditScore();
        }
    });
}

// Save edited participant score
function saveParticipantScore(index) {
    const input = document.getElementById(`edit-score-${index}`);
    const newScore = parseInt(input.value);
    
    if (isNaN(newScore) || newScore < 0) {
        alert('Please enter a valid score (0 or greater)');
        return;
    }
    
    // Update the score
    participants[index].score = newScore;
    
    // Sort by score (highest first)
    sortParticipants(participants);
    
    // Save and render
    saveToLocalStorage(participants);
    renderHostView();
}

// Cancel editing score
function cancelEditScore() {
    renderHostView();
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
