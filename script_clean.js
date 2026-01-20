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
  
  if (currentUser) {
    signinBtn.style.display = 'none';
    changeAccountBtn.style.display = 'inline-block';
    signoutBtn.style.display = 'inline-block';
  } else {
    signinBtn.style.display = 'inline-block';
    changeAccountBtn.style.display = 'none';
    signoutBtn.style.display = 'none';
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
  
  const storedAccount = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '{"username":"MPDC","password":"MPDC2026"}');
  
  if (username === storedAccount.username && password === storedAccount.password) {
    currentUser = username;
    localStorage.setItem('currentUser', currentUser);
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    closeModal();
    updateAuthUI();
    showSection('dashboard');
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
    files.push({
      id: Date.now(),
      title,
      storage,
      info,
      createdDate: new Date().toISOString()
    });
    
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
}

function displayAddStatus(message, type) {
  const statusEl = document.getElementById('addStatus');
  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;
}

async function searchFiles(query) {
  const files = await loadFiles();
  const resultsDiv = document.getElementById('results');
  
  if (!currentUser) {
    resultsDiv.innerHTML = '<p style="text-align:center; color: var(--text-secondary); padding: 2rem;">📋 Please sign in to view and manage your files</p>';
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
      <div class="file-info-left">
        <div class="file-title"><i class="fas fa-file"></i> ${escapeHtml(file.title)}</div>
        <div class="file-storage"><strong>📁 Location:</strong> ${escapeHtml(file.storage)}</div>
        ${file.info ? `<div class="file-detail"><strong>📝 Info:</strong> ${escapeHtml(file.info)}</div>` : ''}
        <small style="color: var(--text-tertiary);">📅 ${new Date(file.createdDate).toLocaleString()}</small>
      </div>
      <div class="file-actions">
        <button class="btn btn-secondary" onclick="deleteFile(${file.id})" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    </div>
  `).join('');
}

async function deleteFile(id) {
  if (!confirm('Are you sure you want to delete this file?')) return;
  
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
document.getElementById('searchBar').addEventListener('input', (e) => {
  searchFiles(e.target.value);
});

document.getElementById('title').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addFile();
});

// Prevent modal from closing when clicking inside
['modal', 'change-account-modal'].forEach(id => {
  const modal = document.getElementById(id);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
});

// ===== Initialization =====
window.addEventListener('load', () => {
  initTheme();
  updateAuthUI();
  showSection('hero');
});