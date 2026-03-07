const fs = require('fs');

const content = fs.readFileSync('src/i18n.ts', 'utf8');

// 分割成语言块
const lines = content.split('\n');
let result = [];
let inLanguageBlock = false;
let seenKeys = new Set();

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // 检测语言块开始
  if (line.match(/^\s*\/\/\s*[\u4e00-\u9fff]/)) {
    // 新语言块开始，重置seenKeys
    seenKeys = new Set();
    result.push(line);
    continue;
  }
  
  // 检测翻译key
  const keyMatch = line.match(/^\s*'([\w.]+)':/);
  if (keyMatch) {
    const key = keyMatch[1];
    if (seenKeys.has(key)) {
      // 跳过重复的key
      continue;
    }
    seenKeys.add(key);
  }
  
  result.push(line);
}

fs.writeFileSync('src/i18n.ts', result.join('\n'));
console.log('Done!');
