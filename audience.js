// State management
let participants = [];

// DOM Elements
const chartContainer = document.getElementById('chart-container');
const audienceTitle = document.querySelector('.audience-title');
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');

// Confetti particles
let confettiParticles = [];

// Initialize app
function init() {
    setupConfettiCanvas();
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

// Confetti system
function setupConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    });
    
    animateConfetti();
}

function launchConfetti() {
    const colors = ['#f39c12', '#e74c3c', '#4a90e2', '#2ecc71', '#9b59b6', '#1abc9c'];
    
    for (let i = 0; i < 100; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: -10,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: (Math.random() - 0.5) * 4,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        });
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    confettiParticles.forEach((particle, index) => {
        particle.y += particle.speedY;
        particle.x += particle.speedX;
        particle.rotation += particle.rotationSpeed;
        
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation * Math.PI / 180);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        ctx.restore();
        
        // Remove particles that are off screen
        if (particle.y > confettiCanvas.height) {
            confettiParticles.splice(index, 1);
        }
    });
    
    requestAnimationFrame(animateConfetti);
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
