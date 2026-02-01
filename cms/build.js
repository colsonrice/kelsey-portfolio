/**
 * Build Script for Kelsey Portfolio CMS
 * Reads content.json and generates static HTML files from EJS templates
 */

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Paths
const ROOT_DIR = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(__dirname, 'templates');
const DATA_DIR = path.join(__dirname, 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

// Output files
const OUTPUT_INDEX = path.join(ROOT_DIR, 'index.html');
const OUTPUT_RESUME = path.join(ROOT_DIR, 'resume.html');

console.log('🔨 Building Kelsey Portfolio...\n');

// Load content
let content;
try {
    content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
    console.log('✓ Loaded content.json');
} catch (err) {
    console.error('✗ Failed to load content.json:', err.message);
    process.exit(1);
}

// Build index.html
try {
    const indexTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'index.ejs'), 'utf8');
    const indexHtml = ejs.render(indexTemplate, content, {
        filename: path.join(TEMPLATES_DIR, 'index.ejs')
    });
    fs.writeFileSync(OUTPUT_INDEX, indexHtml);
    console.log('✓ Built index.html');
} catch (err) {
    console.error('✗ Failed to build index.html:', err.message);
    process.exit(1);
}

// Build resume.html
try {
    const resumeTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'resume.ejs'), 'utf8');
    const resumeHtml = ejs.render(resumeTemplate, content, {
        filename: path.join(TEMPLATES_DIR, 'resume.ejs')
    });
    fs.writeFileSync(OUTPUT_RESUME, resumeHtml);
    console.log('✓ Built resume.html');
} catch (err) {
    console.error('✗ Failed to build resume.html:', err.message);
    process.exit(1);
}

console.log('\n✨ Build complete!\n');
console.log('Files updated:');
console.log(`  - ${OUTPUT_INDEX}`);
console.log(`  - ${OUTPUT_RESUME}`);
console.log('\nTo deploy: git add . && git commit -m "Update content" && git push\n');
