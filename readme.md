# Quiz Leaderboard

🔗 **Live Demo:** [https://lukeleader.netlify.app/](https://lukeleader.netlify.app/)

A fully offline, real-time quiz leaderboard application with a clean bar chart visualization. Perfect for classrooms, quiz competitions, presentations, and live events.

## Features

### 🎯 Host View

- **Add/Update Participants**: Simple form to add new participants or update existing scores
- **Edit Scores**: Click the edit button next to any participant to modify their score inline
- **Delete Participants**: Remove individual participants with a single click
- **Live Participant List**: View all participants sorted by score with rank indicators
- **Smart Duplicate Handling**: Updating an existing name automatically updates the score instead of creating duplicates
- **Custom Audience Title**: Set a custom title for the audience display (or use the default)
- **Reset Functionality**: Clear all data with a confirmation modal to prevent accidental deletion
- **Persistent Storage**: Data automatically saved to localStorage and persists across sessions

### 📊 Audience View

- **Full-Screen Bar Chart**: Clean, modern visualization optimized for projectors and large displays
- **Real-Time Updates**: Automatically refreshes every 2 seconds to show latest scores
- **Animated Transitions**: Smooth animations when bars change size or position
- **Auto-Sorted Rankings**: Participants automatically ranked by score (highest first)
- **Special Podium Colors**:
  - 🥇 1st Place: Gold gradient
  - 🥈 2nd Place: Silver gradient
  - 🥉 3rd Place: Bronze gradient
- **Large, Readable Text**: Participant names displayed at 28-32px for maximum visibility
- **No Scrollbars**: Clean, distraction-free interface
- **Single-Screen Display**: Designed to fit on one screen without scrolling

### 🔧 Technical Features

- **100% Offline**: No internet connection required, no CDN dependencies
- **No External Libraries**: Pure vanilla HTML, CSS, and JavaScript
- **Cross-Window Sync**: Host and audience views sync via localStorage
- **Responsive Design**: Works on all screen sizes (mobile, tablet, desktop, projector)
- **Dark Theme**: Modern dark UI with gradient backgrounds and shadows
- **Browser Compatible**: Works in all modern browsers

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/quiz-leaderboard.git
   cd quiz-leaderboard
   ```

2. Open `index.html` in your browser - that's it! No build process or dependencies needed.

## Usage

### Quick Start

1. **Open Host View**: Open `index.html` in your browser
2. **Open Audience View**: Click the "Open Audience View" button to open the leaderboard in a new window/tab
3. **Display on Projector**: Drag the audience view window to your projector or second screen, press F11 for fullscreen

### Managing Participants

**Add a New Participant:**

- Enter name and score in the form
- Click "Add / Update Participant"
- Participant appears in the list and on the audience chart

**Update an Existing Score:**

There are two ways to update a score:

1. **Via the form (updates by name)**:

   - Enter the exact same name (case-insensitive)
   - Enter the new score
   - Click "Add / Update Participant"
   - Score updates automatically without creating a duplicate

2. **Inline editing (direct edit)**:
   - Click the edit button (pencil icon) next to any participant's score
   - Modify the score directly
   - Press Enter or click the save button (✓)
   - Press Escape or click cancel (✗) to discard changes

**Delete a Participant:**

- Click the delete button (trash icon) next to any participant
- Confirm the deletion in the dialog
- Participant is removed from the leaderboard

**Change Audience Display Title:**

## File Structure

````
quiz-leaderboard/
├── index.html        # Host view (participant management)
├── audience.html     # Audience view (bar chart display)
├── host.js          # Host view logic and controls
├── audience.js      # Audience view logic and auto-refresh
├── styles.css       # All styling and animations
└── readme.md        # Documentation
```ll data is cleared from both views
- Click the "Reset Leaderboard" button
- Confirm in the modal dialog
- All data is cleared from both views

### Tips for Best Results

- **Projector Setup**: Open audience view in fullscreen mode (F11) on your projector
- **Side-by-Side**: Keep host view on your laptop, audience view on external display
- **Multiple Devices**: Open audience view on multiple devices - they all sync automatically
- **Offline Events**: No internet needed - perfect for locations without WiFi

## File Structure

````

quiz-leaderboard/
├── index.html # Host view (participant management)
├── audience.html # Audience view (bar chart display)
├── host.js # Host view logic and controls
├── audience.js # Audience view logic and auto-refresh
├── styles.css # All styling and animations
└── readme.md # This file

````

## Customization

### Change Colors

Edit `styles.css` to modify:

- Background gradients (`.background`, `body`)
- Bar colors (`.bar-visual`)
- Podium colors (`.chart-bar:nth-child(1/2/3)`)
- Text colors (`.bar-name`, `.bar-score`)

### Adjust Font Sizes

Modify text sizes in `styles.css`:

- `.bar-name` - Participant names (default: 28px)
- `.bar-score` - Score numbers (default: 32px)
- `.audience-title` - Main title (default: 48px)

### Change Refresh Rate

In `audience.js`, modify the interval:

```javascript
setInterval(loadAndRender, 2000); // Change 2000 to desired milliseconds
````

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)

## License

MIT License - Feel free to use for personal or commercial projects.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

Built with ❤️ using vanilla JavaScript, HTML, and CSS - no frameworks required!
.
