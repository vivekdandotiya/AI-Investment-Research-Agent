import fs from 'fs';
import path from 'path';
import os from 'os';

const homeDir = os.homedir();
const conversationId = '9dac7693-fa84-44bf-b0fc-49572c1be816';
const logSourceDir = path.join(homeDir, '.gemini', 'antigravity', 'brain', conversationId, '.system_generated', 'logs');
const logDestDir = path.join(process.cwd(), 'transcripts');

function main() {
  console.log('===================================================');
  console.log('       InvesTrack Log Export Utility Script        ');
  console.log('===================================================');
  console.log(`Searching for transcripts in: \n  ${logSourceDir}\n`);

  try {
    if (!fs.existsSync(logDestDir)) {
      fs.mkdirSync(logDestDir, { recursive: true });
      console.log('Created local transcripts/ directory.');
    }
    
    const files = ['transcript.jsonl', 'transcript_full.jsonl'];
    let copiedCount = 0;

    files.forEach(file => {
      const src = path.join(logSourceDir, file);
      const dest = path.join(logDestDir, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`✔ Copied ${file} to transcripts/`);
        copiedCount++;
      } else {
        console.warn(`⚠ Source log file not found at ${src}`);
      }
    });

    if (copiedCount > 0) {
      console.log('\nSUCCESS: Transcripts exported to transcripts/ folder.');
      console.log('These logs contain your full AI chat sessions to satisfy assignment bonus points.');
    } else {
      console.log('\nERROR: No logs copied. Verify conversation ID or file paths.');
    }
  } catch (error) {
    console.error('\nERROR: Failed during log export:', error.message);
  }
  console.log('===================================================');
}

main();
