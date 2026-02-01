// CMS Application
let content = {};
let hasUnsavedChanges = false;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    setupEventListeners();
});

// Check authentication status
async function checkAuth() {
    try {
        const res = await fetch('/api/auth/status');
        const data = await res.json();
        if (data.authenticated) {
            showDashboard();
            await loadContent();
        } else {
            showLogin();
        }
    } catch (err) {
        showLogin();
    }
}

// Show/hide screens
function showLogin() {
    document.getElementById('login-screen').classList.add('active');
    document.getElementById('dashboard').classList.remove('active');
}

function showDashboard() {
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('dashboard').classList.add('active');
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.dataset.section;
            switchSection(section);
        });
    });

    // Action buttons
    document.getElementById('save-btn').addEventListener('click', saveContent);
    document.getElementById('build-btn').addEventListener('click', buildSite);
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Password change form
    document.getElementById('password-form').addEventListener('submit', handlePasswordChange);

    // Image upload
    document.getElementById('image-upload').addEventListener('change', handleImageUpload);

    // Track changes
    document.addEventListener('input', (e) => {
        if (e.target.matches('input, textarea')) {
            hasUnsavedChanges = true;
            updateSaveButton();
        }
    });

    // Warn before leaving with unsaved changes
    window.addEventListener('beforeunload', (e) => {
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

// Login handler
async function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        if (res.ok) {
            showDashboard();
            await loadContent();
        } else {
            errorEl.textContent = 'Invalid password';
        }
    } catch (err) {
        errorEl.textContent = 'Login failed';
    }
}

// Logout
async function logout() {
    if (hasUnsavedChanges) {
        if (!confirm('You have unsaved changes. Are you sure you want to logout?')) {
            return;
        }
    }
    await fetch('/api/auth/logout', { method: 'POST' });
    showLogin();
    document.getElementById('password').value = '';
}

// Switch sections
function switchSection(sectionId) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(`section-${sectionId}`).classList.add('active');

    // Load images when switching to images section
    if (sectionId === 'images') {
        loadImages();
    }
}

// Load content from server
async function loadContent() {
    try {
        const res = await fetch('/api/content');
        content = await res.json();
        populateForm();
        showToast('Content loaded', 'success');
    } catch (err) {
        showToast('Failed to load content', 'error');
    }
}

// Populate form fields with content
function populateForm() {
    // Simple fields with data-path
    document.querySelectorAll('[data-path]').forEach(el => {
        const path = el.dataset.path;
        const value = getNestedValue(content, path);
        if (value !== undefined) {
            el.value = value;
        }
    });

    // About highlights
    renderAboutHighlights();

    // Case studies
    renderCaseStudies();

    // Expertise items
    renderExpertiseItems();

    // Resume arrays
    document.getElementById('resume-skills').value = (content.resume?.skills || []).join('\n');
    document.getElementById('resume-tools').value = (content.resume?.tools || []).join('\n');
    document.getElementById('resume-geo').value = (content.resume?.geoProjects || []).join('\n');

    // Resume experience
    renderResumeExperience();
}

// Get nested value from object
function getNestedValue(obj, path) {
    return path.split('.').reduce((o, k) => o?.[k], obj);
}

// Set nested value in object
function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((o, k) => {
        if (!o[k]) o[k] = {};
        return o[k];
    }, obj);
    target[last] = value;
}

// Render about highlights
function renderAboutHighlights() {
    const container = document.getElementById('about-highlights');
    const highlights = content.about?.highlights || [];

    container.innerHTML = highlights.map((h, i) => `
        <div class="card">
            <div class="form-group">
                <label>Title</label>
                <input type="text" data-array="about.highlights.${i}.title" value="${escapeHtml(h.title)}">
            </div>
            <div class="form-group">
                <label>Description</label>
                <input type="text" data-array="about.highlights.${i}.description" value="${escapeHtml(h.description)}">
            </div>
        </div>
    `).join('');

    // Add listeners
    container.querySelectorAll('[data-array]').forEach(el => {
        el.addEventListener('input', () => {
            const [base, prop, idx, field] = el.dataset.array.split('.');
            content[base][prop][parseInt(idx)][field] = el.value;
        });
    });
}

// Render case studies
function renderCaseStudies() {
    const container = document.getElementById('case-studies-list');
    const studies = content.work?.caseStudies || [];

    container.innerHTML = studies.map((cs, i) => `
        <div class="card">
            <div class="card-header">
                <span class="card-title">Case Study ${i + 1}: ${escapeHtml(cs.title)}</span>
            </div>
            <div class="form-group">
                <label>Tag</label>
                <input type="text" data-cs="${i}" data-field="tag" value="${escapeHtml(cs.tag)}">
            </div>
            <div class="form-group">
                <label>Title</label>
                <input type="text" data-cs="${i}" data-field="title" value="${escapeHtml(cs.title)}">
            </div>
            <div class="form-group">
                <label>Summary</label>
                <textarea data-cs="${i}" data-field="summary" rows="2">${escapeHtml(cs.summary)}</textarea>
            </div>
            <div class="form-group">
                <label>Challenge</label>
                <textarea data-cs="${i}" data-field="challenge" rows="2">${escapeHtml(cs.challenge)}</textarea>
            </div>
            <div class="form-group">
                <label>Approach</label>
                <textarea data-cs="${i}" data-field="approach" rows="2">${escapeHtml(cs.approach)}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Result Stat (optional)</label>
                    <input type="text" data-cs="${i}" data-field="resultStat" value="${escapeHtml(cs.resultStat || '')}">
                </div>
                <div class="form-group">
                    <label>Result Label (optional)</label>
                    <input type="text" data-cs="${i}" data-field="resultLabel" value="${escapeHtml(cs.resultLabel || '')}">
                </div>
            </div>
            <div class="form-group">
                <label>Result Description</label>
                <textarea data-cs="${i}" data-field="resultDescription" rows="2">${escapeHtml(cs.resultDescription)}</textarea>
            </div>
        </div>
    `).join('');

    // Add listeners
    container.querySelectorAll('[data-cs]').forEach(el => {
        el.addEventListener('input', () => {
            const idx = parseInt(el.dataset.cs);
            const field = el.dataset.field;
            content.work.caseStudies[idx][field] = el.value;
        });
    });
}

// Render expertise items
function renderExpertiseItems() {
    const container = document.getElementById('expertise-list');
    const items = content.expertise?.items || [];

    container.innerHTML = items.map((item, i) => `
        <div class="card">
            <div class="form-row">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" data-exp="${i}" data-field="title" value="${escapeHtml(item.title)}">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" data-exp="${i}" data-field="description" value="${escapeHtml(item.description)}">
                </div>
            </div>
        </div>
    `).join('');

    // Add listeners
    container.querySelectorAll('[data-exp]').forEach(el => {
        el.addEventListener('input', () => {
            const idx = parseInt(el.dataset.exp);
            const field = el.dataset.field;
            content.expertise.items[idx][field] = el.value;
        });
    });
}

// Render resume experience
function renderResumeExperience() {
    const container = document.getElementById('resume-experience');
    const experience = content.resume?.experience || [];

    container.innerHTML = experience.map((exp, expIdx) => `
        <div class="card">
            <div class="card-header">
                <span class="card-title">${escapeHtml(exp.company)}</span>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" data-exp-idx="${expIdx}" data-exp-field="company" value="${escapeHtml(exp.company)}">
                </div>
                <div class="form-group">
                    <label>Duration</label>
                    <input type="text" data-exp-idx="${expIdx}" data-exp-field="duration" value="${escapeHtml(exp.duration)}">
                </div>
            </div>
            ${exp.roles.map((role, roleIdx) => `
                <div class="role-card">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" data-role="${expIdx}-${roleIdx}" data-role-field="title" value="${escapeHtml(role.title)}">
                        </div>
                        <div class="form-group">
                            <label>Period</label>
                            <input type="text" data-role="${expIdx}-${roleIdx}" data-role-field="period" value="${escapeHtml(role.period)}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Bullets (one per line)</label>
                        <textarea data-role="${expIdx}-${roleIdx}" data-role-field="bullets" rows="3">${role.bullets.join('\n')}</textarea>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');

    // Add listeners for experience
    container.querySelectorAll('[data-exp-idx]').forEach(el => {
        el.addEventListener('input', () => {
            const idx = parseInt(el.dataset.expIdx);
            const field = el.dataset.expField;
            content.resume.experience[idx][field] = el.value;
        });
    });

    // Add listeners for roles
    container.querySelectorAll('[data-role]').forEach(el => {
        el.addEventListener('input', () => {
            const [expIdx, roleIdx] = el.dataset.role.split('-').map(Number);
            const field = el.dataset.roleField;
            if (field === 'bullets') {
                content.resume.experience[expIdx].roles[roleIdx].bullets = el.value.split('\n').filter(b => b.trim());
            } else {
                content.resume.experience[expIdx].roles[roleIdx][field] = el.value;
            }
        });
    });
}

// Collect all form data
function collectFormData() {
    // Collect simple fields
    document.querySelectorAll('[data-path]').forEach(el => {
        setNestedValue(content, el.dataset.path, el.value);
    });

    // Resume arrays
    content.resume.skills = document.getElementById('resume-skills').value.split('\n').filter(s => s.trim());
    content.resume.tools = document.getElementById('resume-tools').value.split('\n').filter(t => t.trim());
    content.resume.geoProjects = document.getElementById('resume-geo').value.split('\n').filter(g => g.trim());

    return content;
}

// Save content
async function saveContent() {
    const data = collectFormData();

    try {
        const res = await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            hasUnsavedChanges = false;
            updateSaveButton();
            showToast('Content saved!', 'success');
        } else {
            showToast('Failed to save', 'error');
        }
    } catch (err) {
        showToast('Save error', 'error');
    }
}

// Build site
async function buildSite() {
    // Save first
    await saveContent();

    try {
        const res = await fetch('/api/build', { method: 'POST' });
        const data = await res.json();

        if (res.ok) {
            showToast('Site built successfully! Ready to deploy.', 'success');
        } else {
            showToast('Build failed: ' + data.error, 'error');
        }
    } catch (err) {
        showToast('Build error', 'error');
    }
}

// Password change
async function handlePasswordChange(e) {
    e.preventDefault();
    const messageEl = document.getElementById('password-message');
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        messageEl.textContent = 'New passwords do not match';
        messageEl.className = 'message error';
        return;
    }

    try {
        const res = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword })
        });

        if (res.ok) {
            messageEl.textContent = 'Password changed successfully';
            messageEl.className = 'message success';
            document.getElementById('password-form').reset();
        } else {
            const data = await res.json();
            messageEl.textContent = data.error;
            messageEl.className = 'message error';
        }
    } catch (err) {
        messageEl.textContent = 'Failed to change password';
        messageEl.className = 'message error';
    }
}

// Load and display images
async function loadImages() {
    try {
        const res = await fetch('/api/images/all');
        const images = await res.json();

        const grid = document.getElementById('images-grid');
        grid.innerHTML = images.map(img => `
            <div class="image-item">
                <img src="${img.path}" alt="${img.name}">
                <div class="image-info">
                    <div>${img.name}</div>
                    <small>${formatBytes(img.size)}</small>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Failed to load images');
    }
}

// Handle image upload
async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('filename', file.name.replace(/\.[^/.]+$/, ''));

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            showToast('Image uploaded!', 'success');
            loadImages();
        } else {
            showToast('Upload failed', 'error');
        }
    } catch (err) {
        showToast('Upload error', 'error');
    }

    e.target.value = '';
}

// Update save button appearance
function updateSaveButton() {
    const btn = document.getElementById('save-btn');
    if (hasUnsavedChanges) {
        btn.textContent = 'Save Changes*';
        btn.style.animation = 'pulse 1s infinite';
    } else {
        btn.textContent = 'Save Changes';
        btn.style.animation = '';
    }
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Utility functions
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
