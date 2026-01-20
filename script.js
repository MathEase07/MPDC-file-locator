// ===== FILE STORAGE TRACKER - ENHANCED MODERN VERSION =====
// Features: Dark/Light Mode, Modern UI, Responsive, File Management

// ===== Theme Toggle =====
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
}

function setTheme(theme) {
  if (theme === 'dark') {
    html.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    html.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

themeToggle.addEventListener('click', () => {
  const currentTheme = html.classList.contains('dark-mode') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// ===== Navigation =====
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.getAttribute('data-section');
    showSection(section);
  });
});

document.querySelectorAll('.footer-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.getAttribute('data-section');
    showSection(section);
  });
});

function showSection(sectionId) {
  document.querySelectorAll('.view-section').forEach(section => {
    section.classList.remove('active');
  });
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.add('active');
  }
}

// ===== Modal Functions =====
function closeModal() {
  document.getElementById('modal').classList.remove('active');
}

function closeChangeModal() {
  document.getElementById('change-account-modal').classList.remove('active');
}

// ===== Constants =====
const STORAGE_KEY = "fileStorageTrackerData";
const ACCOUNT_KEY = "fileStorageTrackerAccount";
let currentUser = localStorage.getItem('currentUser');

// ===== Auth UI =====
function updateAuthUI() {
  const signinBtn = document.getElementById('signin-btn');
  const changeAccountBtn = document.getElementById('change-account-btn');
  const signoutBtn = document.getElementById('signout-header-btn');
  const navFeatures = document.querySelector('[data-section="features"]');
  const navInstructions = document.querySelector('[data-section="instructions"]');
  const navDevelopers = document.querySelector('[data-section="developers"]');
  const homeLink = document.querySelector('.navbar-nav a:first-child');
  const footerQuickLinks = document.getElementById('footer-quick-links');
  const footerLinks = document.querySelectorAll('.footer-link');
  
  if (currentUser) {
    signinBtn.style.display = 'none';
    changeAccountBtn.style.display = 'inline-block';
    signoutBtn.style.display = 'inline-block';
    navFeatures.style.display = 'none';
    navInstructions.style.display = 'none';
    navDevelopers.style.display = 'none';
    footerQuickLinks.style.display = 'none';
    footerLinks.forEach(link => link.style.pointerEvents = 'none');
    homeLink.textContent = 'Dashboard';
    homeLink.setAttribute('data-section', 'dashboard');
  } else {
    signinBtn.style.display = 'inline-block';
    changeAccountBtn.style.display = 'none';
    signoutBtn.style.display = 'none';
    navFeatures.style.display = 'inline-block';
    navInstructions.style.display = 'inline-block';
    navDevelopers.style.display = 'inline-block';
    footerQuickLinks.style.display = 'block';
    footerLinks.forEach(link => link.style.pointerEvents = 'auto');
    homeLink.textContent = 'Home';
    homeLink.setAttribute('data-section', 'hero');
  }
}

// ===== Sign In =====
document.getElementById('signin-btn').addEventListener('click', () => {
  document.getElementById('modal').classList.add('active');
});

document.getElementById('cancel-login').addEventListener('click', closeModal);

document.getElementById('submit-login').addEventListener('click', () => {
  const username = document.getElementById('login-user').value.trim();
  const password = document.getElementById('login-pass').value;
  
  if (!username || !password) {
    alert('Please enter username and password');
    return;
  }
  
  const storedAccount = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '{"username":"user","password":"password"}');
  
  if (username === storedAccount.username && password === storedAccount.password) {
    currentUser = username;
    localStorage.setItem('currentUser', currentUser);
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    closeModal();
    updateAuthUI();
    showSection('dashboard');
    searchFiles('');
  } else {
    alert('Invalid credentials');
  }
});

// ===== Change Account =====
document.getElementById('change-account-btn').addEventListener('click', () => {
  document.getElementById('change-account-modal').classList.add('active');
});

document.getElementById('cancel-change').addEventListener('click', closeChangeModal);

document.getElementById('submit-change').addEventListener('click', () => {
  const newUsername = document.getElementById('change-user').value.trim();
  const newPassword = document.getElementById('change-pass').value;
  const confirmPassword = document.getElementById('change-pass-confirm').value;
  
  if (!newUsername || !newPassword || !confirmPassword) {
    alert('All fields are required');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }
  
  if (newPassword.length < 4) {
    alert('Password must be at least 4 characters');
    return;
  }
  
  const newAccount = { username: newUsername, password: newPassword };
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(newAccount));
  currentUser = newUsername;
  localStorage.setItem('currentUser', currentUser);
  
  document.getElementById('change-user').value = '';
  document.getElementById('change-pass').value = '';
  document.getElementById('change-pass-confirm').value = '';
  closeChangeModal();
  updateAuthUI();
  alert('Account updated successfully!');
});

// ===== Sign Out =====
document.getElementById('signout-header-btn').addEventListener('click', () => {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateAuthUI();
  showSection('hero');
  document.getElementById('searchBar').value = '';
  searchFiles('');
});

// ===== File Management =====
async function loadFiles() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

async function saveFiles(files) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

function addFile() {
  if (!currentUser) {
    alert('Please sign in first');
    return;
  }
  
  const title = document.getElementById('title').value.trim();
  const storage = document.getElementById('storage').value.trim();
  const info = document.getElementById('info').value.trim();
  
  if (!title || !storage) {
    alert('Title and Storage Location are required');
    return;
  }
  
  loadFiles().then(files => {
    const newFile = {
      id: Date.now(),
      title,
      storage,
      info,
      createdDate: new Date().toISOString(),
      image: window.uploadedImageData || null // Add image data if uploaded
    };
    
    files.push(newFile);
    saveFiles(files);
    clearForm();
    displayAddStatus('✓ File added successfully!', 'success');
    setTimeout(() => document.getElementById('addStatus').textContent = '', 3000);
  });
}

function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('storage').value = '';
  document.getElementById('info').value = '';
  document.getElementById('imageUpload').value = '';
  window.uploadedImageData = null; // Clear uploaded image data
}

function displayAddStatus(message, type) {
  const statusEl = document.getElementById('addStatus');
  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;
}

async function searchFiles(query) {
  const files = await loadFiles();
  const resultsDiv = document.getElementById('results');
  
  // Always clear results first
  resultsDiv.innerHTML = '';
  
  if (files.length === 0 && !query) {
    resultsDiv.innerHTML = '<p style="text-align:center; color: var(--text-secondary); padding: 2rem;">📋 No files yet. Sign in to add your first file!</p>';
    return;
  }
  
  let filteredFiles = files;
  if (query) {
    filteredFiles = files.filter(f =>
      f.title.toLowerCase().includes(query.toLowerCase()) ||
      f.storage.toLowerCase().includes(query.toLowerCase()) ||
      f.info.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  if (filteredFiles.length === 0) {
    resultsDiv.innerHTML = '<p style="text-align:center; color: var(--text-secondary); padding: 2rem;">🔍 No files found. Try searching or add a new file.</p>';
    return;
  }
  
  resultsDiv.innerHTML = filteredFiles.map(file => `
    <div class="file-card">
      <div class="file-header">
        <h3 class="file-title"><i class="fas fa-file"></i> ${escapeHtml(file.title)}</h3>
      </div>
      <div class="file-content" style="display: flex; gap: 20px; align-items: flex-start;">
        ${file.image ? `<div style="flex-shrink: 0;">
          <img class="file-image-thumbnail" src="${file.image}" alt="File image" onclick="openImageViewer('${file.image.replace(/'/g, "\\'")}')">
        </div>` : ''}
        <div style="flex: 1; min-width: 0;">
          <div class="file-item">
            <span class="file-label">📁 Location:</span>
            <span class="file-value">${escapeHtml(file.storage)}</span>
          </div>
          ${file.info ? `<div class="file-item">
            <span class="file-label">📝 Info:</span>
            <span class="file-value">${escapeHtml(file.info)}</span>
          </div>` : ''}
        </div>
      </div>
      <div class="file-actions">
        <button class="btn btn-primary" onclick="openEditFlow(${file.id})">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-secondary" onclick="openDeleteFlow(${file.id})">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    </div>
  `).join('');
}

// Store the action that needs password verification
let pendingAction = null;

function openEditFlow(fileId) {
  pendingAction = { type: 'edit', fileId };
  document.getElementById('verify-modal-title').textContent = 'Verify Password to Edit';
  document.getElementById('password-verify-modal').classList.add('active');
  document.getElementById('verify-password').value = '';
  document.getElementById('verify-password').focus();
}

function openDeleteFlow(fileId) {
  pendingAction = { type: 'delete', fileId };
  document.getElementById('verify-modal-title').textContent = 'Verify Password to Delete';
  document.getElementById('password-verify-modal').classList.add('active');
  document.getElementById('verify-password').value = '';
  document.getElementById('verify-password').focus();
}

function closeVerifyModal() {
  document.getElementById('password-verify-modal').classList.remove('active');
}

function cancelVerify() {
  pendingAction = null;
  closeVerifyModal();
}

function closeEditModal() {
  document.getElementById('edit-file-modal').classList.remove('active');
}

async function proceedWithAction(password) {
  const trimmedPassword = password.trim();
  const storedAccount = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '{"username":"user","password":"password"}');
  
  console.log('Password entered:', trimmedPassword);
  console.log('Stored password:', storedAccount.password);
  console.log('Pending action:', pendingAction);
  
  if (trimmedPassword !== storedAccount.password) {
    alert('Incorrect password!');
    return;
  }
  
  console.log('Password correct, proceeding with action');
  closeVerifyModal();
  alert('Password verified — processing...');
  
  if (!pendingAction) {
    console.error('Pending action is null!');
    return;
  }
  
  if (pendingAction.type === 'edit') {
    console.log('Opening edit for file ID:', pendingAction.fileId);
    await openEditFile(pendingAction.fileId);
  } else if (pendingAction.type === 'delete') {
    console.log('Deleting file ID:', pendingAction.fileId);
    await deleteFile(pendingAction.fileId);
  } else {
    console.error('Unknown action type:', pendingAction.type);
  }
  
  pendingAction = null;
}

async function openEditFile(fileId) {
  const files = await loadFiles();
  const file = files.find(f => f.id === fileId);
  
  if (!file) {
    alert('File not found!');
    return;
  }
  
  document.getElementById('edit-title').value = file.title;
  document.getElementById('edit-storage').value = file.storage;
  document.getElementById('edit-info').value = file.info || '';
  document.getElementById('edit-file-modal').dataset.fileId = fileId;
  document.getElementById('edit-file-modal').classList.add('active');
  document.getElementById('edit-title').focus();
}

async function saveEditFile() {
  const fileId = parseInt(document.getElementById('edit-file-modal').dataset.fileId);
  const title = document.getElementById('edit-title').value.trim();
  const storage = document.getElementById('edit-storage').value.trim();
  const info = document.getElementById('edit-info').value.trim();
  
  if (!title || !storage) {
    alert('Title and Storage Location are required');
    return;
  }
  
  let files = await loadFiles();
  const fileIndex = files.findIndex(f => f.id === fileId);
  
  if (fileIndex !== -1) {
    files[fileIndex].title = title;
    files[fileIndex].storage = storage;
    files[fileIndex].info = info;
    await saveFiles(files);
    closeEditModal();
    const query = document.getElementById('searchBar').value;
    searchFiles(query);
    displayAddStatus('✓ File updated successfully!', 'success');
  }
}

async function deleteFile(id) {
  let files = await loadFiles();
  files = files.filter(f => f.id !== id);
  await saveFiles(files);
  
  const query = document.getElementById('searchBar').value;
  searchFiles(query);
  displayAddStatus('✓ File deleted successfully!', 'success');
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

async function exportFiles() {
  const files = await loadFiles();
  if (files.length === 0) {
    alert('No files to export');
    return;
  }
  
  const dataStr = JSON.stringify(files, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `files-backup-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  alert('✓ Files exported successfully!');
}

async function importFiles() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    try {
      const text = await file.text();
      const importedFiles = JSON.parse(text);
      
      if (!Array.isArray(importedFiles)) {
        alert('Invalid file format');
        return;
      }
      
      const existingFiles = await loadFiles();
      const merged = [...existingFiles, ...importedFiles];
      await saveFiles(merged);
      
      alert(`✓ Imported ${importedFiles.length} files!`);
      searchFiles('');
    } catch (error) {
      alert('Error reading file: ' + error.message);
    }
  };
  
  input.click();
}

// ===== Event Listeners =====
function setupEventListeners() {
  document.getElementById('searchBar').addEventListener('input', (e) => {
    searchFiles(e.target.value);
  });

  document.getElementById('title').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addFile();
  });

  // Password verification modal listeners
  document.getElementById('cancel-verify').addEventListener('click', closeVerifyModal);
  document.getElementById('submit-verify').addEventListener('click', () => {
    const password = document.getElementById('verify-password').value;
    proceedWithAction(password);
  });

  document.getElementById('verify-password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const password = document.getElementById('verify-password').value;
      proceedWithAction(password);
    }
  });

  // Edit modal listeners
  document.getElementById('cancel-edit').addEventListener('click', closeEditModal);
  document.getElementById('submit-edit').addEventListener('click', saveEditFile);

  document.getElementById('edit-title').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveEditFile();
  });

  // Prevent modal from closing when clicking inside
  ['modal', 'change-account-modal', 'password-verify-modal', 'edit-file-modal'].forEach(id => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          if (id === 'password-verify-modal') {
            closeVerifyModal();
          } else if (id === 'edit-file-modal') {
            closeEditModal();
          } else {
            modal.classList.remove('active');
          }
        }
      });
    }
  });
}

// ===== Custom Cursor =====
function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);
  
  const cursorTrail = document.createElement('div');
  cursorTrail.className = 'cursor-trail';
  document.body.appendChild(cursorTrail);
  
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = (mouseX - 10) + 'px';
    cursor.style.top = (mouseY - 10) + 'px';
    
    setTimeout(() => {
      trailX = mouseX;
      trailY = mouseY;
      cursorTrail.style.left = (trailX - 5) + 'px';
      cursorTrail.style.top = (trailY - 5) + 'px';
    }, 50);
  });
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.classList.contains('btn')) {
      cursor.classList.add('hover');
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.classList.contains('btn')) {
      cursor.classList.remove('hover');
    }
  });
}

// ===== Initialization =====
window.addEventListener('load', () => {
  initTheme();
  updateAuthUI();
  initCustomCursor();
  setupEventListeners();
  showSection('hero');
});
