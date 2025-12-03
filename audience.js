// State management
let participants = [];

// DOM Elements
const chartContainer = document.getElementById('chart-container');
const audienceTitle = document.querySelector('.audience-title');

// Initialize app
function init() {
    loadAndRender();
    loadAndDisplayTitle();
    setupStorageListener();
    
    // Auto-refresh every 2 seconds to catch updates
    setInterval(loadAndRender, 2000);
    setInterval(loadAndDisplayTitle, 2000);
}

// Load data and render
function loadAndRender() {
    const newParticipants = loadFromLocalStorage();
    
    // Only re-render if data has changed
    if (JSON.stringify(newParticipants) !== JSON.stringify(participants)) {
        participants = newParticipants;
        sortParticipants(participants);
        renderAudienceView();
    }
}

// Listen for storage changes (works across tabs/windows)
function setupStorageListener() {
    window.addEventListener('storage', (e) => {
        if (e.key === 'quizLeaderboard') {
            loadAndRender();
        }
        if (e.key === 'quizLeaderboardTitle') {
            loadAndDisplayTitle();
        }
    });
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

// Load and display title
function loadAndDisplayTitle() {
    try {
        const saved = localStorage.getItem('quizLeaderboardTitle');
        const title = saved || 'Quiz Leaderboard';
        if (audienceTitle.textContent !== title) {
            audienceTitle.textContent = title;
        }
    } catch (e) {
        console.error('Error loading title:', e);
        audienceTitle.textContent = 'Quiz Leaderboard';
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
