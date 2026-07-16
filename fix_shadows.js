const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'app'));
files.push(...walkSync(path.join(__dirname, 'components')));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace shadow props with boxShadow
  content = content.replace(/shadowColor:\s*['"][^'"]+['"],\s*shadowOffset:\s*\{[^}]+\},\s*shadowOpacity:\s*[\d.]+,\s*shadowRadius:\s*[\d.]+/g, "boxShadow: '0px 4px 8px rgba(0,0,0,0.4)'");
  
  // Replace textShadow props with textShadow
  content = content.replace(/textShadowColor:\s*['"][^'"]+['"],\s*textShadowOffset:\s*\{[^}]+\},\s*textShadowRadius:\s*[\d.]+/g, "textShadow: '2px 2px 4px rgba(0,0,0,0.5)'");
  
  fs.writeFileSync(file, content);
}
console.log('Fixed shadow deprecations.');
