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
  
  // Revert boxShadow to standard React Native shadow objects
  content = content.replace(/boxShadow:\s*'0px 4px 8px rgba\(0,0,0,0\.4\)'/g, "shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 8");
  
  // Revert textShadow
  content = content.replace(/textShadow:\s*'2px 2px 4px rgba\(0,0,0,0\.5\)'/g, "textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 3");
  
  fs.writeFileSync(file, content);
}
console.log('Reverted shadow deprecations back to original.');
