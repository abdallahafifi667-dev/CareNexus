const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes('<<<<<<< HEAD')) return;
        
        let lines = content.split(/\r?\n/);
        let out = [];
        let state = 'NORMAL'; // NORMAL, IN_HEAD, IN_THEIRS
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.startsWith('<<<<<<< HEAD')) {
                state = 'IN_HEAD';
                continue;
            } else if (line.startsWith('=======')) {
                if (state === 'IN_HEAD') {
                    state = 'IN_THEIRS';
                    continue;
                }
            } else if (line.startsWith('>>>>>>>')) {
                if (state === 'IN_THEIRS') {
                    state = 'NORMAL';
                    continue;
                }
            }
            
            if (state === 'NORMAL' || state === 'IN_HEAD') {
                out.push(line);
            }
        }
        
        fs.writeFileSync(filePath, out.join('\n'), 'utf8');
        console.log('Resolved conflicts in: ' + filePath);
    } catch (e) {
        console.error('Error processing ' + filePath + ': ' + e.message);
    }
}

function walk(dir) {
    let list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        let stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (!fullPath.includes('node_modules') && !fullPath.includes('.git')) {
                walk(fullPath);
            }
        } else {
            if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.scss')) {
                processFile(fullPath);
            }
        }
    });
}

const targetDir = process.argv[2];
if (!targetDir) {
    console.error('Please provide a target directory.');
    process.exit(1);
}

walk(targetDir);
console.log('Done resolving conflicts.');
