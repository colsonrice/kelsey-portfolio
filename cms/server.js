const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const app = express();
const PORT = 3001;

// Paths
const DATA_DIR = path.join(__dirname, 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');
const IMAGES_DIR = path.join(__dirname, '..', 'images');
const ROOT_DIR = path.join(__dirname, '..');

// Ensure directories exist
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Initialize auth file with default password if it doesn't exist
if (!fs.existsSync(AUTH_FILE)) {
    const defaultPassword = 'admin123'; // User should change this!
    const hash = bcrypt.hashSync(defaultPassword, 10);
    fs.writeFileSync(AUTH_FILE, JSON.stringify({ passwordHash: hash }, null, 2));
    console.log('\n⚠️  Default password is "admin123" - please change it after first login!\n');
}

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'kelsey-cms-secret-' + Date.now(),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve static files
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/images', express.static(IMAGES_DIR));
app.use(express.static(ROOT_DIR));

// Image upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, IMAGES_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = req.body.filename || 'upload-' + Date.now();
        cb(null, name + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|svg/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// Auth middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) {
        next();
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
}

// Routes

// Login page redirect
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Check auth status
app.get('/api/auth/status', (req, res) => {
    res.json({ authenticated: !!req.session.authenticated });
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;

    try {
        const auth = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));

        if (bcrypt.compareSync(password, auth.passwordHash)) {
            req.session.authenticated = true;
            res.json({ success: true });
        } else {
            res.status(401).json({ error: 'Invalid password' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Auth error' });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Change password
app.post('/api/auth/change-password', requireAuth, (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const auth = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));

        if (!bcrypt.compareSync(currentPassword, auth.passwordHash)) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }

        auth.passwordHash = bcrypt.hashSync(newPassword, 10);
        fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to change password' });
    }
});

// Get content
app.get('/api/content', requireAuth, (req, res) => {
    try {
        const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
        res.json(content);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load content' });
    }
});

// Save content
app.post('/api/content', requireAuth, (req, res) => {
    try {
        const content = req.body;
        fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save content' });
    }
});

// Build site
app.post('/api/build', requireAuth, (req, res) => {
    try {
        execSync('node cms/build.js', { cwd: ROOT_DIR });
        res.json({ success: true, message: 'Site built successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Build failed: ' + err.message });
    }
});

// Upload image
app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
        success: true,
        filename: req.file.filename,
        path: '/images/' + req.file.filename
    });
});

// List images
app.get('/api/images', requireAuth, (req, res) => {
    try {
        const files = fs.readdirSync(IMAGES_DIR)
            .filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
            .map(f => ({
                name: f,
                path: '/images/' + f,
                size: fs.statSync(path.join(IMAGES_DIR, f)).size
            }));
        res.json(files);
    } catch (err) {
        res.json([]);
    }
});

// Also check for images in root directory
app.get('/api/images/all', requireAuth, (req, res) => {
    try {
        const imagesInRoot = fs.readdirSync(ROOT_DIR)
            .filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
            .map(f => ({
                name: f,
                path: '/' + f,
                size: fs.statSync(path.join(ROOT_DIR, f)).size,
                location: 'root'
            }));

        const imagesInFolder = fs.existsSync(IMAGES_DIR)
            ? fs.readdirSync(IMAGES_DIR)
                .filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
                .map(f => ({
                    name: f,
                    path: '/images/' + f,
                    size: fs.statSync(path.join(IMAGES_DIR, f)).size,
                    location: 'images'
                }))
            : [];

        res.json([...imagesInRoot, ...imagesInFolder]);
    } catch (err) {
        res.json([]);
    }
});

// Preview the built site
app.get('/preview', (req, res) => {
    res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🚀 Kelsey Portfolio CMS is running!                  ║
║                                                        ║
║   Admin Panel: http://localhost:${PORT}/admin            ║
║   Preview Site: http://localhost:${PORT}/preview         ║
║                                                        ║
║   Default password: admin123                           ║
║   (Change it after first login!)                       ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
    `);
});
