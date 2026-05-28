const fs = require('fs');
const readline = require('readline');

async function run() {
  const logPath = '/Users/sudipdas/.gemini/antigravity-ide/brain/bf5a4d19-bb74-400e-ba2b-a3be8e2707fa/.system_generated/logs/transcript.jsonl';
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let foundContent = null;

  for await (const line of rl) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.type === 'VIEW_FILE' && parsed.content.includes('src/app/admin/portfolio/page.tsx') && !parsed.content.includes('Total Lines: 1\nTotal Bytes: 0')) {
        foundContent = parsed.content;
      }
    } catch(e) {}
  }

  if (foundContent) {
    const lines = foundContent.split('\n');
    let output = [];
    let isCode = false;
    for (let l of lines) {
      if (l.match(/^\d+:/)) {
        isCode = true;
        output.push(l.replace(/^\d+:\s?/, ''));
      } else if (isCode && l === 'The above content shows the entire, complete file contents of the requested file.') {
        break;
      }
    }
    fs.writeFileSync('/Users/sudipdas/Desktop/Personal/Projects/Madmarketer/Product Websites/Madmarketer/src/app/admin/portfolio/page.tsx', output.join('\n'));
    console.log('Restored src/app/admin/portfolio/page.tsx!');
  } else {
    console.log('Not found');
  }
}
run();
