// Shared utility functions and state management

// Save to localStorage
function saveToLocalStorage(participants) {
    try {
        localStorage.setItem('quizLeaderboard', JSON.stringify(participants));
        // Trigger storage event for cross-window communication
        window.dispatchEvent(new Event('leaderboardUpdate'));
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
    return participants.sort((a, b) => b.score - a.score);
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
    sortParticipants();

    // Save and render
    saveToLocalStorage();
    renderHostView();
    renderAudienceView();

    // Clear form
    nameInput.value = '';
    scoreInput.value = '';
    nameInput.focus();
}

// Sort participants by score
function sortParticipants() {
    participants.sort((a, b) => b.score - a.score);
}

// Reset leaderboard
function resetLeaderboard() {
    participants = [];
    saveToLocalStorage();
    renderHostView();
    renderAudienceView();
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

// Render audience view (bar chart)
function renderAudienceView() {
    if (participants.length === 0) {
        chartContainer.innerHTML = '<div class="empty-state">No data to display</div>';
        return;
    }

    // Calculate max score for scaling
    const maxScore = Math.max(...participants.map(p => p.score));
    const minBarWidth = 10; // Minimum bar width percentage

    chartContainer.innerHTML = participants.map((participant, index) => {
        // Calculate bar width (minimum 10%, maximum 100%)
        const barWidth = maxScore > 0 
            ? Math.max(minBarWidth, (participant.score / maxScore) * 100)
            : minBarWidth;

        return `
            <div class="chart-bar">
                <div class="bar-rank">#${index + 1}</div>
                <div class="bar-content">
                    <div class="bar-header">
                        <div class="bar-name">${escapeHtml(participant.name)}</div>
                        <div class="bar-score">${participant.score}</div>
                    </div>
                    <div class="bar-visual" style="width: ${barWidth}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

// Modal functions
function showModal() {
    modal.classList.add('active');
}

function hideModal() {
    modal.classList.remove('active');
}

// LocalStorage functions
function saveToLocalStorage() {
    try {
        localStorage.setItem('quizLeaderboard', JSON.stringify(participants));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('quizLeaderboard');
        if (saved) {
            participants = JSON.parse(saved);
            sortParticipants();
        }
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        participants = [];
    }
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
