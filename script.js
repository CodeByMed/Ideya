// Login and Account Creation
const loginForm = document.getElementById('login-form');
const createAccountForm = document.getElementById('create-account-form');
const loginContainer = document.getElementById('login-container');
const createAccountContainer = document.getElementById('create-account-container');
const appContainer = document.getElementById('app-container');
const logoutButton = document.getElementById('logout-button');
const createAccountLink = document.getElementById('create-account-link');
const backToLoginLink = document.getElementById('back-to-login-link');
const sideBarBtn = document.getElementById('toggle-sidebar-button');
const toolsSidebar = document.getElementById('tools-sidebar');
const toggleSidebarButton = document.getElementById('toggle-sidebar-button');
const boldButton = document.getElementById('bold-button');
const underlineButton = document.getElementById('underline-button');
const colorPicker = document.getElementById('color-picker');

createAccountLink.addEventListener('click', () => {
    loginContainer.classList.add('hidden');
    createAccountContainer.classList.remove('hidden');
});

backToLoginLink.addEventListener('click', () => {
    createAccountContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
});

// Notification System
const notification = document.createElement('div');
notification.id = 'notification';
document.body.appendChild(notification);

function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Account Creation Feedback
createAccountForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
    if (accounts[username]) {
        showNotification('Username already exists! ❌');
        return;
    }
    accounts[username] = password;
    localStorage.setItem('accounts', JSON.stringify(accounts));
    showNotification('Account Created! ✅');
    createAccountContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
});

// Login Feedback
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
    if (accounts[username] === password) {
        localStorage.setItem('loggedInUser', username);
        loginContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
        toolsSidebar.classList.remove('hidden');
        loadNotes();
        showNotification('Login Successful! ✅');
    } else {
        showNotification('Invalid username or password! ❌');
    }
});

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    loginContainer.classList.remove('hidden');
    appContainer.classList.add('hidden');
    toolsSidebar.classList.add('hidden');
});

// Notes Management
const notesContainer = document.getElementById('notes-container');
const addNoteButton = document.getElementById('add-note-button');
const noNotesMessage = document.getElementById('no-notes-message');
const fontSelect = document.getElementById('font-select');
const emojiPicker = document.getElementById('emoji-picker');
const noteInput = document.getElementById('note-input');

// Add Note Button
addNoteButton.addEventListener('click', () => {
    const content = noteInput.value.trim();
    if (!content) {
        showNotification('Note content cannot be empty! ❌');
        return;
    }

    // Capture current styles from noteInput
    const styles = {
        color: noteInput.style.color || '#333',
        textDecoration: noteInput.style.textDecoration || 'none',
        fontWeight: noteInput.style.fontWeight || 'normal',
        fontStyle: noteInput.style.fontStyle || 'normal',
        fontFamily: noteInput.style.fontFamily || 'Poppins',
    };

    const timestamp = new Date().toLocaleString();
    const note = createNote(content, timestamp, '#f9f9f9', styles);
    notesContainer.appendChild(note);

    noteInput.value = '';
    updateNoNotesMessage();
    saveNotes();
    showNotification('Note Added! ✅');
});

// Create Note Function (Updated to include styles)
function createNote(content, timestamp, backgroundColor = '#f9f9f9', styles = {}) {
    const note = document.createElement('div');
    note.className = 'note';
    note.style.backgroundColor = backgroundColor;
    note.style.color = styles.color;
    note.style.textDecoration = styles.textDecoration;
    note.style.fontWeight = styles.fontWeight;
    note.style.fontStyle = styles.fontStyle;
    note.style.fontFamily = styles.fontFamily;
    note.draggable = true;

    // Note Header
    const noteHeader = document.createElement('div');
    noteHeader.className = 'note-header';

    const timestampElement = document.createElement('span');
    timestampElement.className = 'timestamp';
    timestampElement.textContent = timestamp;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'X';
    deleteButton.addEventListener('click', () => {
        note.remove();
        updateNoNotesMessage();
        saveNotes();
        showNotification('Note Deleted! ❌');
    });

    noteHeader.appendChild(timestampElement);
    noteHeader.appendChild(deleteButton);

    // Note Content
    const noteContent = document.createElement('div');
    noteContent.className = 'note-content';
    noteContent.textContent = content;

    note.appendChild(noteHeader);
    note.appendChild(noteContent);

    return note;
}

// Font Weight Auswahl:
const fontWeightSelect = document.getElementById("font-weight-select")
fontWeightSelect.addEventListener('change', (e) => {
    const selectedFontWeight = e.target.value;
    noteInput.style.fontWeight = selectedFontWeight;
});

// Emoji Picker
emojiPicker.addEventListener('change', (e) => {
    const emoji = e.target.value;
    if (emoji === 'custom') {
        const customEmoji = prompt('Enter your custom emoji or paste an image URL:');
        if (customEmoji) {
            noteInput.value += customEmoji;
        }
        emojiPicker.value = ''; // Reset the picker
    } else if (emoji) {
        noteInput.value += emoji;
        emojiPicker.value = ''; // Reset the picker
    }
});

// Font Selection
fontSelect.addEventListener('change', (e) => {
    const selectedFont = e.target.value;
    noteInput.style.fontFamily = selectedFont;
});

// Bold Button
boldButton.addEventListener('click', () => {
    const isBold = noteInput.style.fontWeight === 'bold';
    noteInput.style.fontWeight = isBold ? 'normal' : 'bold';
});

// Underline Button
underlineButton.addEventListener('click', () => {
    const isUnderlined = noteInput.style.textDecoration === 'underline';
    noteInput.style.textDecoration = isUnderlined ? 'none' : 'underline';
});

// Clear Formatting Button
const clearFormattingButton = document.getElementById('clear-formatting-button');
clearFormattingButton.addEventListener('click', () => {
    noteInput.style.fontWeight = 'normal';
    noteInput.style.textDecoration = 'none';
    noteInput.style.color = '#333';
    noteInput.style.fontFamily = 'Poppins';
});

// Load Notes (Updated to apply styles)
function loadNotes() {
    notesContainer.innerHTML = ''; // Clear existing notes to prevent duplication
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.forEach(({ content, timestamp, backgroundColor, styles }) => {
        const note = createNote(content, timestamp, backgroundColor, styles);
        notesContainer.appendChild(note);
    });
    updateNoNotesMessage();
}

// Save Notes (Updated to include styles)
function saveNotes() {
    const notes = Array.from(notesContainer.children)
        .filter(note => note.classList.contains('note'))
        .map(note => ({
            content: note.querySelector('.note-content').textContent,
            timestamp: note.querySelector('.timestamp').textContent,
            backgroundColor: note.style.backgroundColor || '#f9f9f9',
            styles: {
                color: note.style.color || '#333',
                textDecoration: note.style.textDecoration || 'none',
                fontWeight: note.style.fontWeight || 'normal',
                fontStyle: note.style.fontStyle || 'normal',
                fontFamily: note.style.fontFamily || 'Poppins',
            },
        }));
    localStorage.setItem('notes', JSON.stringify(notes));
}

notesContainer.addEventListener('input', saveNotes);

function updateNoNotesMessage() {
    const hasNotes = notesContainer.querySelectorAll('.note').length > 0;
    if (hasNotes) {
        noNotesMessage.style.display = 'none'; // Hide the message if notes exist
    } else {
        noNotesMessage.style.display = 'block'; // Show the message if no notes exist

        // Clear existing content and add a button dynamically
        noNotesMessage.textContent = 'No notes here. Create some!';
        const createNoteButton = document.createElement('button');
        createNoteButton.id = 'create-note-button';
        createNoteButton.textContent = 'Create Note';
        createNoteButton.addEventListener('click', () => {
            noteInput.focus(); // Focus on the note input when the button is clicked
        });
        noNotesMessage.appendChild(createNoteButton);
    }
}

// Ensure the message is updated after loading notes
loadNotes();
updateNoNotesMessage();

boldButton.addEventListener('click', () => document.execCommand('bold'));
underlineButton.addEventListener('click', () => document.execCommand('underline'));
colorPicker.addEventListener('input', (e) => {
    noteInput.style.color = e.target.value;
});

// Ensure Sidebar Starts Collapsed
toolsSidebar.classList.add('collapsed'); // Sidebar starts collapsed

// Toggle Sidebar
toggleSidebarButton.addEventListener('click', () => {
    const isCollapsed = toolsSidebar.classList.contains('collapsed');
    if (isCollapsed) {
        toolsSidebar.classList.remove('collapsed');
        toolsSidebar.classList.add('expanded');
        toggleSidebarButton.innerHTML = '&lt;'; // Change to "<"
    } else {
        toolsSidebar.classList.remove('expanded');
        toolsSidebar.classList.add('collapsed');
        toggleSidebarButton.innerHTML = '&gt;'; // Change to ">"
    }
});

// Ensure Toggle Button is Always Visible
toggleSidebarButton.style.display = 'block'; // Ensure the button is always visible

// Change Note Background Color
const backgroundColorPicker = document.createElement('input');
backgroundColorPicker.type = 'color';
backgroundColorPicker.id = 'background-color-picker';
backgroundColorPicker.title = 'Change Note Background';
backgroundColorPicker.addEventListener('input', (e) => {
    const selectedNote = document.querySelector('.note.selected');
    if (selectedNote) {
        selectedNote.style.backgroundColor = e.target.value;
        saveNotes();
    }
});
document.getElementById('tools-content').appendChild(backgroundColorPicker);

// Export Button für .txt-Datei:
const exportButton = document.createElement('button');
exportButton.textContent = 'Export Notes as .txt';
exportButton.addEventListener('click', () => {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    let notesText = notes.map(note => `Timestamp: ${note.timestamp}\nContent: ${note.content}\n\n`).join('');
    const blob = new Blob([notesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.txt';
    a.click();
    URL.revokeObjectURL(url);
});
document.getElementById('tools-content').appendChild(exportButton);

// Import Button für .txt-Datei:
const importButton = document.createElement('button');
importButton.textContent = 'Import Notes from .txt';
importButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.click();
    
    input.addEventListener('change', () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const notes = content.split('\n\n').map(noteText => {
                const [timestamp, noteContent] = noteText.split('\nContent: ');
                return { content: noteContent, timestamp };
            });
            localStorage.setItem('notes', JSON.stringify(notes));
            loadNotes();  // Funktion zum Laden der Notizen
        };
        reader.readAsText(file);
    });
});
document.getElementById('tools-content').appendChild(importButton);

// Font Weight and Style
let fontWeightSelects = document.createElement('select');
fontWeightSelects.title = 'Font Weight';
['normal', 'bold', 'italic', '100', '200', '300', '400', '500', '600', '700', '800', '900'].forEach(weight => {
    const option = document.createElement('option');
    option.value = weight;
    option.textContent = weight;
    fontWeightSelects.appendChild(option);
});
fontWeightSelects.addEventListener('change', (e) => {
    const selectedNote = document.querySelector('.note.selected');
    if (selectedNote) {
        selectedNote.style.fontWeight = e.target.value.includes('italic') ? 'normal' : e.target.value;
        selectedNote.style.fontStyle = e.target.value.includes('italic') ? 'italic' : 'normal';
        saveNotes();
    }
});
document.getElementById('tools-content').appendChild(fontWeightSelect);

// Change Text Color
colorPicker.addEventListener('input', (e) => {
    const selectedNote = document.querySelector('.note.selected');
    if (selectedNote) {
        selectedNote.style.color = e.target.value;
        saveNotes();
    }
});

// Ensure Notes Can Be Selected
notesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('note')) {
        document.querySelectorAll('.note').forEach(note => note.classList.remove('selected'));
        e.target.classList.add('selected');
    }
});

// Drag-and-Drop
notesContainer.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('note')) {
        e.target.classList.add('dragging');
    }
});
notesContainer.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('note')) {
        e.target.classList.remove('dragging');
        saveNotes();
    }
});
notesContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingNote = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(notesContainer, e.clientY);
    if (afterElement == null) {
        notesContainer.appendChild(draggingNote);
    } else {
        notesContainer.insertBefore(draggingNote, afterElement);
    }
});
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.note:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Auto-Save Every 5 Seconds
setInterval(saveNotes, 5000);

// Initialize App
if (localStorage.getItem('loggedInUser')) {
    loginContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
    toolsSidebar.classList.remove('hidden'); // Ensure the sidebar is visible
    loadNotes();
} else {
    updateNoNotesMessage();
}
