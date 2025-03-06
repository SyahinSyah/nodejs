const SMB2 = require('smb2');
const fs = require('fs');
const path = require('path');

// SMB2 configuration
const smb2Client = new SMB2({
  share: '\\\\172.17.90.120\\testautomate', // Shared folder path
  username: 'itdev1', // Replace with your username
  password: '@Likom123456', // Replace with your password
  domain: 'Likom' // Replace with your domain (if applicable)
});

// Local folder to transfer
const localFolder = 'C:/Users/syahinsyah/Desktop/EXE 1.1/141124';

// Function to transfer a file
function transferFile(localFilePath, remoteFilePath) {
  const fileData = fs.readFileSync(localFilePath);
  smb2Client.writeFile(remoteFilePath, fileData, (err) => {
    if (err) {
      console.error(`Error transferring file ${localFilePath}:`, err);
    } else {
      console.log(`File transferred successfully: ${localFilePath}`);
    }
  });
}

// Function to recursively transfer a folder
function transferFolder(localPath, remotePath) {
  fs.readdir(localPath, (err, items) => {
    if (err) {
      console.error('Error reading folder:', err);
      return;
    }

    items.forEach((item) => {
      const localItemPath = path.join(localPath, item);
      const remoteItemPath = path.join(remotePath, item);

      fs.stat(localItemPath, (err, stats) => {
        if (err) {
          console.error('Error checking file stats:', err);
          return;
        }

        if (stats.isFile()) {
          // Transfer the file
          transferFile(localItemPath, remoteItemPath);
        } else if (stats.isDirectory()) {
          // Recursively transfer the subdirectory
          transferFolder(localItemPath, remoteItemPath);
        }
      });
    });
  });
}

// Start the transfer
transferFolder(localFolder, '\\'); // Transfer to the root of the shared folder