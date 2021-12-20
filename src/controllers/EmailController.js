const controllers = {};

require('dotenv').config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const nodemailer = require('nodemailer');


controllers.sendStarship = async (req, res) => {

  const { name, email, misionLink, note, starshipName, describeStarship, websiteUrl, twitterUrl, discordUrl, coinmarketcapUrl } = req.body;
  
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  if(req.file != null){
    let info = await transporter.sendMail({
      from: process.env.EMAIL_FROM, // sender address
      to: email, // list of receivers
      subject: 'CREATE NEW MISSIONS', // Subject line
      text: 'CREATE NEW MISSIONS', // plain text body
      html: getHtmlCreateStarshipWithImage(name, email, misionLink, starshipName, describeStarship, websiteUrl, twitterUrl, discordUrl, coinmarketcapUrl),
      attachments: [
        {
          filename: "icon.png",
          path: req.file.path
        }
      ]
    });
  
    fs.unlinkSync(req.file.path, function (err) {
      if (err) throw err;
      console.log('File deleted!');
    });
  
  }else{
    let info = await transporter.sendMail({
      from: process.env.EMAIL_FROM, // sender address
      to: email, // list of receivers
      subject: 'CREATE NEW MISSIONS', // Subject line
      text: 'CREATE NEW MISSIONS', // plain text body
      html: getHtmmlCreateStarship(name, email, misionLink, note)
    });
  }

  res.status(200).json({
    success: true,
    message: 'Email sent successfully!',
  });
};


controllers.sendMission = async (req, res) => {

  
  const { subUrl, discord, twitter, payOutAddress, missionUrl } = req.body;
  

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: process.env.EMAIL_FROM, // sender address
    to: process.env.EMAIL_FROM, // list of receivers
    subject: 'CLEAR MISSION', // Subject line
    text: 'CLEAR MISSION', // plain text body
    html: getHtmlMission(missionUrl, subUrl, twitter, discord, payOutAddress) // html body
  });

  res.status(200).json({
    success: true,
    message: 'Email sent successfully!',
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/Images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

controllers.upload = multer({
  storage: storage,
  limits: { fileSize: '10000000' },
  fileFilter: (req, file, cb) => {
    const fileTypes = /png/;
    const mimType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (file != null){
      if (file.mimetype === 'image/png') {
        cb(null, true);
      } else {
        req.fileValidationError = 'Forbidden extension';
        return cb(null, false, req.fileValidationError);
      }
    }
  },
}).single('image');

function getHtmmlCreateStarship(name, email, mission_link, note){
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="https://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" />
    <!--<![endif]-->
    <title>Hold My Ledger DAO | Email Template</title>
    <!--[if mso]>
    <style type="text/css">
      table {border-collapse:collapse;border-spacing:0;margin:0;}
      div, td {padding:0;}
      div {margin:0 !important;}
    </style>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
  </head>
  <body style="margin:0;padding:0;word-spacing:normal;background-color:#efefef">
    <div role="article" aria-roledescription="email" lang="en" style="-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#efefef">
      <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <!--[if mso]>
            <table role="presentation" align="center" style="width:612px">
            <tr>
            <td style="padding:24px 0">
            <![endif]-->
            <div class="outer" style="width:100%;max-width:612px;margin:0 auto;background-color:#ffffff">
              <header style="width:auto;background-color:#ffffff;text-align:center;padding:48px 24px 24px">
                <!--[if mso]>
                <table role="presentation" width="100%">
                <tr>
                <td style="width:100px;padding:10px;text-align:center" valign="middle">
                <![endif]-->
                <img src="https://holdmyledger.com/images/logo_coloured.png" width="48" height="48" style="display:block;color:#ffffff;margin:0 auto 16px;" alt="holdmyledgerdao" />
                <p style="font-family:'Orbitron', sans-serif;font-weight:700;font-size:14px">Hold My Ledger DAO</p>
                <!--[if mso]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </header>
              <table role="presentation" width="100%">
                <tr>
                  <td style="padding:0 24px">
                    <div class="inner-content" style="max-width:480px;display:block;margin:0 auto">
                      <img src="https://holdmyledger.com/images/people.svg" style="width:100%;max-width:165px;margin:0 auto 48px;display:block" alt="illustration" />
                      <h4 style="margin-top:0;margin-bottom:32px;font-family:'Orbitron',sans-serif;font-weight:700;font-size:24px;line-height:32px;text-align:center;color:#6B2FB7">Create New Mission</h4>
                      <table width="100%" style="border-collapse:collapse;font-family:'Poppins',sans-serif;font-size:13px;font-weight:400;line-height:24px;color:#5D5858">
                        <tr>
                          <td style="width:100px">Your name</td>
                          <td style="width:24px;text-align:center">:</td>
                          <td>${name}</td>
                        </tr>
                        <tr>
                          <td style="width:100px">Email address</td>
                          <td style="width:24px;text-align:center">:</td>
                          <td>${email}</td>
                        </tr>
                        <tr>
                          <td style="width:100px">Mission link</td>
                          <td style="width:24px;text-align:center">:</td>
                          <td>${mission_link}</td>
                        </tr>
                        <tr>
                          <td style="width:100px">Note</td>
                          <td style="width:24px;text-align:center">:</td>
                          <td>${note}</td>
                        </tr>
                      </table>
                      <a href="https://admin.holdmyledger.com/" style="display:block;width:100%;max-width:280px;height:64px;background-color:#4C3D8F;color:white;font-family:'Orbitron',sans-serif;font-weight:600;font-size:18px;line-height:64px;text-align:center;text-decoration:none;margin:48px auto 0" target="_blank">Go to Dashboard</a>
                    </div>
                  </td>
                </tr>
              </table>
              <div class="spacer" style="line-height:50px;height:50px;mso-line-height-rule:exactly">&nbsp;</div>
            </div>
            <!--[if mso]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
      </table>
    </div>
  </body>
  </html>
  `
}

function getHtmlCreateStarshipWithImage(name, email, mission_link, starship_name, describe_starship, website_url, twitter_url, discord_url, coinmarketcap_url ){
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="https://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" />
    <!--<![endif]-->
    <title>Hold My Ledger DAO | Email Template</title>
    <!--[if mso]>
    <style type="text/css">
      table {border-collapse:collapse;border-spacing:0;margin:0;}
      div, td {padding:0;}
      div {margin:0 !important;}
    </style>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
  </head>
  <body style="margin:0;padding:0;word-spacing:normal;background-color:#efefef">
    <div role="article" aria-roledescription="email" lang="en" style="-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#efefef">
      <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <!--[if mso]>
            <table role="presentation" align="center" style="width:612px">
            <tr>
            <td style="padding:24px 0">
            <![endif]-->
            <div class="outer" style="width:100%;max-width:612px;margin:0 auto;background-color:#ffffff">
              <header style="width:auto;background-color:#ffffff;text-align:center;padding:48px 24px 24px">
                <!--[if mso]>
                <table role="presentation" width="100%">
                <tr>
                <td style="width:100px;padding:10px;text-align:center" valign="middle">
                <![endif]-->
                <img src="https://holdmyledger.com/images/logo_coloured.png" width="48" height="48" style="display:block;color:#ffffff;margin:0 auto 16px;" alt="holdmyledgerdao" />
                <p style="font-family:'Orbitron', sans-serif;font-weight:700;font-size:14px">Hold My Ledger DAO</p>
                <!--[if mso]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </header>
              <table role="presentation" width="100%">
                <tr>
                  <td style="padding:0 24px">
                    <div class="inner-content" style="max-width:480px;display:block;margin:0 auto">
                      <img src="https://holdmyledger.com/images/people.svg" style="width:100%;max-width:165px;margin:0 auto 48px;display:block" alt="illustration" />
                      <h4 style="margin-top:0;margin-bottom:32px;font-family:'Orbitron',sans-serif;font-weight:700;font-size:24px;line-height:32px;text-align:center;color:#6B2FB7">Create New Mission</h4>
                      <table width="100%" style="border-collapse:collapse;font-family:'Poppins',sans-serif;font-size:13px;font-weight:400;line-height:24px;color:#5D5858">
                        <tr>
                          <td>Your name</td>
                          <td style="width:24px;text-align:center">:</td>
                          <td>${name}</td>
                        </tr>
                        <tr>
                          <td>Email address</td>
                          <td style="width:24px;text-align:center">:</td>
                          <td>${email}</td>
                        </tr>
                        <tr>
                          <td>Mission link</td>
                          <td style="width:24px;text-align:center">:</td>
                          <td>${mission_link}</td>
                        </tr>
                        <tr>
                          <td colspan="3"><hr/></td>
                        </tr>
                        <tr>
                          <td>Your starship name</td>
                          <td style="width:24px;text-align:center">:</td>
                          <td>${starship_name}</td>
                        </tr>
                        <tr>
                          <td>Upload starship logo</td>
                          <td style="width:24px;text-align:center">:</td>
                          <td><em style="color: #aaaaaa">Please check in the attacment file.</em></td>
                        </tr>
                        <tr>
                          <td>Describe your starship</td>
                          <td style="width:24px;text-align:center">:</td>
                          <td>${describe_starship}</td>
                        </tr>
                        <tr>
                          <td>Website URL</td>
                          <td style="width:24px;text-align:center">:</td>
                          <td>${website_url}</td>
                        </tr>
                        <tr>
                          <td>Twitter URL</td>
                          <td style="width:24px;text-align:center">:</td>
                          <td>${twitter_url}</td>
                        </tr>
                        <tr>
                          <td>Discord URL</td>
                          <td style="width:24px;text-align:center">:</td>
                          <td>${discord_url}</td>
                        </tr>
                        <tr>
                          <td>Coinmarketcap URL</td>
                          <td style="width:24px;text-align:center">:</td>
                          <td>${coinmarketcap_url}</td>
                        </tr>
                      </table>
                      <a href="https://admin.holdmyledger.com/" style="display:block;width:100%;max-width:280px;height:64px;background-color:#4C3D8F;color:white;font-family:'Orbitron',sans-serif;font-weight:600;font-size:18px;line-height:64px;text-align:center;text-decoration:none;margin:48px auto 0" target="_blank">Go to Dashboard</a>
                    </div>
                  </td>
                </tr>
              </table>
              <div class="spacer" style="line-height:50px;height:50px;mso-line-height-rule:exactly">&nbsp;</div>
            </div>
            <!--[if mso]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
      </table>
    </div>
  </body>
  </html>
  `}

  function getHtmlMission(mission_url, submission_url, twitter_handle, discord_id, payout_address){
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="https://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="x-apple-disable-message-reformatting" />
      <!--[if !mso]><!-->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" />
      <!--<![endif]-->
      <title>Hold My Ledger DAO | Email Template</title>
      <!--[if mso]>
      <style type="text/css">
        table {border-collapse:collapse;border-spacing:0;margin:0;}
        div, td {padding:0;}
        div {margin:0 !important;}
      </style>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
    </head>
    <body style="margin:0;padding:0;word-spacing:normal;background-color:#efefef">
      <div role="article" aria-roledescription="email" lang="en" style="-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#efefef">
        <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center">
              <!--[if mso]>
              <table role="presentation" align="center" style="width:612px">
              <tr>
              <td style="padding:24px 0">
              <![endif]-->
              <div class="outer" style="width:100%;max-width:612px;margin:0 auto;background-color:#ffffff">
                <header style="width:auto;background-color:#ffffff;text-align:center;padding:48px 24px 24px">
                  <!--[if mso]>
                  <table role="presentation" width="100%">
                  <tr>
                  <td style="width:100px;padding:10px;text-align:center" valign="middle">
                  <![endif]-->
                  <img src="https://holdmyledger.com/images/logo_coloured.png" width="48" height="48" style="display:block;color:#ffffff;margin:0 auto 16px;" alt="holdmyledgerdao" />
                  <p style="font-family:'Orbitron', sans-serif;font-weight:700;font-size:14px">Hold My Ledger DAO</p>
                  <!--[if mso]>
                  </td>
                  </tr>
                  </table>
                  <![endif]-->
                </header>
                <table role="presentation" width="100%">
                  <tr>
                    <td style="padding:0 24px">
                      <div class="inner-content" style="max-width:480px;display:block;margin:0 auto">
                        <img src="https://holdmyledger.com/images/people.svg" style="width:100%;max-width:165px;margin:0 auto 48px;display:block" alt="illustration" />
                        <h4 style="margin-top:0;margin-bottom:32px;font-family:'Orbitron',sans-serif;font-weight:700;font-size:24px;line-height:32px;text-align:center;color:#6B2FB7">Clear Mission</h4>
                        <table width="100%" style="border-collapse:collapse;font-family:'Poppins',sans-serif;font-size:13px;font-weight:400;line-height:24px;color:#5D5858">
                          <tr>
                            <td style="width:148px">Mission URL</td>
                            <td style="width:24px;text-align:center">:</td>
                            <td>${mission_url}</td>
                          </tr>
                          <tr>
                            <td style="width:148px">Submission URL</td>
                            <td style="width:24px;text-align:center">:</td>
                            <td>${submission_url}</td>
                          </tr>
                          <tr>
                            <td style="width:148px">Your twitter handle</td>
                            <td style="width:24px;text-align:center">:</td>
                            <td>${twitter_handle}</td>
                          </tr>
                          <tr>
                            <td style="width:148px">Discord ID</td>
                            <td style="width:24px;text-align:center">:</td>
                            <td>${discord_id}</td>
                          </tr>
                          <tr>
                            <td style="width:148px">Your payout address</td>
                            <td style="width:24px;text-align:center">:</td>
                            <td>${payout_address}</td>
                          </tr>
                        </table>
                        <a href="https://admin.holdmyledger.com/" style="display:block;width:100%;max-width:280px;height:64px;background-color:#4C3D8F;color:white;font-family:'Orbitron',sans-serif;font-weight:600;font-size:18px;line-height:64px;text-align:center;text-decoration:none;margin:48px auto 0" target="_blank">Go to Dashboard</a>
                      </div>
                    </td>
                  </tr>
                </table>
                <div class="spacer" style="line-height:50px;height:50px;mso-line-height-rule:exactly">&nbsp;</div>
              </div>
              <!--[if mso]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
    `
  }
module.exports = controllers;
