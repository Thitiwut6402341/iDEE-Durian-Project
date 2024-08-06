import * as Ftp from 'ftp';

export function uploadFileFromBuffer(buffer: Buffer, remote: string) {
  const ftpClient = new Ftp();
  return new Promise((resolve, reject) => {
    ftpClient.connect({
      host: '10.0.0.3',
      user: 'SNC_CoDE',
      password: '$nCC0deTe@mS',
    });
    ftpClient.on('ready', function () {
      //  console.log("Connected to FTP server");
      // const base64Data = "YOUR_BASE64_STRING"; // Replace with your actual base64 string
      ftpClient.put(buffer, remote, function (err) {
        if (err) reject(err);
        //    console.log("Uploaded file successfully");
        resolve(true);
        ftpClient.end();
      });
    });

    ftpClient.on('error', function (err) {
      reject(err);
    });

    ftpClient.on('end', function () {
      // console.log("Disconnected from FTP server");
    });
  });
}
