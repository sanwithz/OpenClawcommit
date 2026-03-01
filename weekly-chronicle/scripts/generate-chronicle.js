#!/usr/bin/env node
/**
 * Weekly Chronicle Generator
 * Generates newspaper-style PDF from JSON weekly log
 * 
 * Usage: node generate-chronicle.js [week-id]
 * Example: node generate-chronicle.js 2025-W19
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const TEMPLATE_DIR = path.join(__dirname, '..', 'templates');
const OUTPUT_DIR = path.join(__dirname, '..', 'output');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options).toUpperCase();
}

function formatDateRange(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options = { month: 'short', day: 'numeric' };
    return `${startDate.toLocaleDateString('en-US', options)}-${endDate.toLocaleDateString('en-US', options)}, ${endDate.getFullYear()}`;
}

function generateFrontContent(data) {
    const keyPoints = data.front_page.key_points || [];
    let content = `<p>${data.front_page.lead_story}</p>`;
    
    keyPoints.forEach(point => {
        content += `<p>${point}</p>`;
    });
    
    return content;
}

function generateWeekAtGlance(items) {
    return items.map(item => `<li>${item}</li>`).join('\n                        ');
}

function generateSectionColumns(sectionData) {
    if (!sectionData || !Array.isArray(sectionData)) return '';
    
    return sectionData.map(item => `
            <div class="column">
                <h3 class="headline-small">${item.headline}</h3>
                <p class="byline">${item.date}</p>
                <p>${item.content}</p>
                <div class="pull-quote">${item.highlight}</div>
            </div>`).join('');
}

function generateLookingAheadSection(data) {
    const checklist = data.sections.looking_ahead.checklist || [];
    return `
            <div class="column">
                <h3 class="headline-small">Next Week's Priorities</h3>
                <p>${data.sections.looking_ahead.priorities}</p>
            </div>
            
            <div class="column">
                <h3 class="headline-small">Goals & Aspirations</h3>
                <p>${data.sections.looking_ahead.goals}</p>
            </div>
            
            <div class="column">
                <div class="highlight-box">
                    <h4>Week Ahead Checklist</h4>
                    <ul>
                        ${checklist.map(item => `<li>${item}</li>`).join('\n                        ')}
                    </ul>
                </div>
            </div>`;
}

function generateHTML(data) {
    const templatePath = path.join(TEMPLATE_DIR, 'newspaper_template.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders
    const replacements = {
        '{{TITLE}}': `${data.masthead.title} - ${formatDate(data.date_range.end)}`,
        '{{MASTHEAD_TITLE}}': data.masthead.title,
        '{{MASTHEAD_SUBTITLE}}': data.masthead.subtitle,
        '{{VOLUME}}': data.masthead.volume,
        '{{NUMBER}}': data.masthead.number,
        '{{DATE_DISPLAY}}': formatDate(data.date_range.end),
        '{{DATE_RANGE}}': formatDateRange(data.date_range.start, data.date_range.end),
        '{{FRONT_HEADLINE}}': data.front_page.headline,
        '{{FRONT_BYLINE}}': data.front_page.byline,
        '{{FRONT_CONTENT}}': generateFrontContent(data),
        '{{PULL_QUOTE}}': data.front_page.pull_quote,
        '{{WEATHER_TEMP}}': data.front_page.weather.temp_range,
        '{{WEATHER_CONDITION}}': data.front_page.weather.condition,
        '{{WEEK_AT_GLANCE}}': generateWeekAtGlance(data.front_page.week_at_glance),
        '{{SECTION_HOME}}': generateSectionColumns(data.sections.home_personal),
        '{{SECTION_HEALTH}}': generateSectionColumns(data.sections.health_wellness),
        '{{SECTION_WORK}}': generateSectionColumns(data.sections.work_career),
        '{{SECTION_ENTERTAINMENT}}': generateSectionColumns(data.sections.entertainment),
        '{{SECTION_LOOKING_AHEAD}}': generateLookingAheadSection(data)
    };
    
    Object.entries(replacements).forEach(([key, value]) => {
        template = template.replace(new RegExp(key, 'g'), value);
    });
    
    return template;
}

async function generatePDF(htmlContent, outputPath) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Wait for fonts
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    
    await browser.close();
    return outputPath;
}

async function main() {
    const weekId = process.argv[2] || getLatestWeekId();
    
    if (!weekId) {
        console.error('Error: No week ID provided and no data files found.');
        console.error('Usage: node generate-chronicle.js [week-id]');
        console.error('Example: node generate-chronicle.js 2025-W19');
        process.exit(1);
    }
    
    const dataPath = path.join(DATA_DIR, `${weekId}.json`);
    
    if (!fs.existsSync(dataPath)) {
        console.error(`Error: Data file not found: ${dataPath}`);
        console.error('Available weeks:');
        listAvailableWeeks();
        process.exit(1);
    }
    
    console.log(`Generating chronicle for week: ${weekId}`);
    
    // Load data
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Generate HTML
    const htmlContent = generateHTML(data);
    const htmlPath = path.join(OUTPUT_DIR, `${weekId}.html`);
    fs.writeFileSync(htmlPath, htmlContent);
    console.log(`✓ HTML generated: ${htmlPath}`);
    
    // Generate PDF
    const pdfPath = path.join(OUTPUT_DIR, `${weekId}.pdf`);
    await generatePDF(htmlContent, pdfPath);
    console.log(`✓ PDF generated: ${pdfPath}`);
    
    console.log('\nDone! Your weekly chronicle is ready.');
    return pdfPath;
}

function getLatestWeekId() {
    const files = fs.readdirSync(DATA_DIR)
        .filter(f => f.endsWith('.json') && f !== 'weekly_log.json')
        .sort();
    
    if (files.length === 0) return null;
    
    return files[files.length - 1].replace('.json', '');
}

function listAvailableWeeks() {
    const files = fs.readdirSync(DATA_DIR)
        .filter(f => f.endsWith('.json') && f !== 'weekly_log.json')
        .map(f => f.replace('.json', ''));
    
    files.forEach(f => console.log(`  - ${f}`));
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
