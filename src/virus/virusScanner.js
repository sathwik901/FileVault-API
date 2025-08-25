const NodeClam = require('clamscan');

async function scanFile(filePath) {
  try {
    const clamscan = await new NodeClam().init({
      clamscan: {
        path: "/opt/homebrew/bin/clamscan"
      },
      removeInfected: false,  
      quarantineInfected: false,
      debugMode: false,
      preference: 'clamscan' 
    });

    const { isInfected, viruses } = await clamscan.scanFile(filePath);

    if (isInfected) {
      console.log(`Infected file: ${filePath}`);
      console.log('Viruses found:', viruses);
      return true;
    } else {
      console.log(`File is clean: ${filePath}`);
      return false;
    }
  } catch (err) {
    console.error('Error scanning file:', err);
  }
}

module.exports = scanFile;