const config = require("config");

module.exports.verifyEmail = `<html> <head>  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;" /> <meta name="viewport" content="width=600,initial-scale = 2.3,user-scalable=no"> <!--[if !mso]><!-- --> <link href='https://fonts.googleapis.com/css?family=Work+Sans:300,400,500,600,700' rel="stylesheet"> <link href='https://fonts.googleapis.com/css?family=Quicksand:300,400,700' rel="stylesheet"> <title>Email </title> <style type="text/css"> body { width: 100%; background-color: #ffffff; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; mso-margin-top-alt: 0px; mso-margin-bottom-alt: 0px; mso-padding-alt: 0px 0px 0px 0px; } p, h1, h2, h3, h4 { margin-top: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; } span.preheader { display: none; font-size: 1px; } html { width: 100%; } table { font-size: 14px; border: 0; } } </style></head>
    <body class="respond" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"> <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff"> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590"> <tr> <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td> </tr> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590"> <tr> <td align="center" height="70" style="height:70px;"> <a href="" style="display: block; border-style: none !important; border: 0 !important;"><img width="100" border="0" style="display: block; width: 210px;" src=${config.get(
      "logo"
    )} alt="" /></a> </td> </tr> </table> </td> </tr> <tr> <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td> </tr> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590" style="border:1px solid #eeeeee;"> <tr> <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td> </tr> <tr> <td align="center" style="color: #343434; font-size: 24px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header"> <div style="line-height: 35px"> Thank You for a signing in </div> <span style="color: #5caad2;">Verify your email address</span> </td> </tr> <tr> <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td> </tr> <tr> <td align="center"> <table border="0" width="40" align="center" cellpadding="0" cellspacing="0" bgcolor="eeeeee"> <tr> <td height="2" style="font-size: 2px; line-height: 2px;">&nbsp;</td> </tr> </table> </td> </tr> <tr> <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td> </tr> <tr> <td align="center"> <table border="0" width="400" align="center" cellpadding="0" cellspacing="0" class="container590"> <tr> <td align="center" style="color: #888888; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;"> <div style="line-height: 24px"> Please confirm that you want to use this as your email address. </div> </td> </tr> </table> </td> </tr> <tr> <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td> </tr> <tr> <td align="center"> <table border="0" align="center" width="400" cellpadding="0" cellspacing="0" bgcolor="5caad2" style=""> <tr> <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td> </tr> <tr> <td align="center" style="color: #ffffff; font-size: 14px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 26px;"> <div style="line-height: 26px;"> <a href=${config.get(
  "app_domain"
)}$link$ style="color: #ffffff; text-decoration: none;">Verify my email</a> </div> </td> </tr> <tr> <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td> </tr> </table> </td> </tr> <tr> <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </body> </html>`;

module.exports.adminResetPassword = `
<!DOCTYPE html> <html> <head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;" /> <meta name="viewport" content="width=600,initial-scale = 2.3,user-scalable=no"> <!--[if !mso]><!-- --> <link href='https://fonts.googleapis.com/css?family=Work+Sans:300,400,500,600,700' rel="stylesheet"> <link href='https://fonts.googleapis.com/css?family=Quicksand:300,400,700' rel="stylesheet"> <!-- <![endif]--> <title>Email 2</title> <style type="text/css"> body { width: 100%; background-color: #ffffff; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; mso-margin-top-alt: 0px; mso-margin-bottom-alt: 0px; mso-padding-alt: 0px 0px 0px 0px; } p, h1, h2, h3, h4 { margin-top: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; } span.preheader { display: none; font-size: 1px; } html { width: 100%; } table { font-size: 14px; border: 0; } } </style> <!-- [if gte mso 9]><style type=”text/css”> body { font-family: arial, sans-serif!important; } </style> <![endif]--> </head> <body class="respond" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"> <!-- header --> <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff"> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590" > <tr> <td height="40" style="font-size: 40px; line-height: 40px;">&nbsp;</td> </tr> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590" bgcolor="eeeeee"> <tr> <td align="center" height="70" style="height:70px;"> <a href="" style="display: block; border-style: none !important; border: 0 !important;"><img width="100" border="0" style="display: block; width: 210px;" src=${config.get(
  "logo"
)} alt="" /></a> </td> </tr> </table> </td> </tr> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590" style="border:1px solid #eeeeee;"> <tr> <td align="center"> <table border="0" width="400" align="center" cellpadding="0" cellspacing="0" class="container590"> <tr> <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td> </tr> <tr> <td align="left" style="color: #343434; font-size: 24px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header"> <div style="line-height: 35px"> <span style="color: #5caad2;">Hi $name$ </span> </div> </td> </tr> <tr> <td height="15" style="font-size: 15px; line-height: 15px;">&nbsp;</td> </tr> <tr> <td align="left" style="color: #888888; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;"> <div style="line-height: 24px"> A request has been received to reset your password. If you follow the link below you will be able to personally reset your password. This password reset request is valid for the next 24 hours. </div> </td> </tr> <tr> <td height="25" style="font-size: 25px;line-height: 25px;"></td> </tr> <tr bgcolor="5caad2"> <td align="center" style="color: #ffffff; font-size: 14px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 26px;"> <div style="line-height: 26px;padding: 12px;">
<a href=${config.get(
  "backend_app_domain"
)}$link$ style="color: #ffffff; text-decoration: none;">Reset your password</a> </div> </td> </tr> <tr> <td height="25" style="font-size: 25px;line-height: 25px;"></td> </tr> <tr> <td align="left" style="color: #888888; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;"> </td> </tr> <tr> <td height="25" style="font-size: 25px;line-height: 25px;"></td> </tr>  <tr> <td height="25" style="font-size: 25px;line-height: 25px;"></td> </tr> <tr> <td align="left" style="color: #888888; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">  </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <!-- end header --> </body> </html>`;

module.exports.resetPassword = `
<!DOCTYPE html> <html> <head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;" /> <meta name="viewport" content="width=600,initial-scale = 2.3,user-scalable=no"> <!--[if !mso]><!-- --> <link href='https://fonts.googleapis.com/css?family=Work+Sans:300,400,500,600,700' rel="stylesheet"> <link href='https://fonts.googleapis.com/css?family=Quicksand:300,400,700' rel="stylesheet"> <!-- <![endif]--> <title>Email 2</title> <style type="text/css"> body { width: 100%; background-color: #ffffff; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; mso-margin-top-alt: 0px; mso-margin-bottom-alt: 0px; mso-padding-alt: 0px 0px 0px 0px; } p, h1, h2, h3, h4 { margin-top: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; } span.preheader { display: none; font-size: 1px; } html { width: 100%; } table { font-size: 14px; border: 0; } } </style> <!-- [if gte mso 9]><style type=”text/css”> body { font-family: arial, sans-serif!important; } </style> <![endif]--> </head> <body class="respond" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"> <!-- header --> <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff"> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590" > <tr> <td height="40" style="font-size: 40px; line-height: 40px;">&nbsp;</td> </tr> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590" bgcolor="eeeeee"> <tr> <td align="center" height="70" style="height:70px;"> <a href="" style="display: block; border-style: none !important; border: 0 !important;"><img width="100" border="0" style="display: block; width: 210px;" src=${config.get(
  "logo"
)} alt="" /></a> </td> </tr> </table> </td> </tr> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590" style="border:1px solid #eeeeee;"> <tr> <td align="center"> <table border="0" width="400" align="center" cellpadding="0" cellspacing="0" class="container590"> <tr> <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td> </tr> <tr> <td align="left" style="color: #343434; font-size: 24px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header"> <div style="line-height: 35px"> <span style="color: #5caad2;">Hi $name$ </span> </div> </td> </tr> <tr> <td height="15" style="font-size: 15px; line-height: 15px;">&nbsp;</td> </tr> <tr> <td align="left" style="color: #888888; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;"> <div style="line-height: 24px"> A request has been received to reset your password. If you follow the link below you will be able to personally reset your password. This password reset request is valid for the next 24 hours. </div> </td> </tr> <tr> <td height="25" style="font-size: 25px;line-height: 25px;"></td> </tr> <tr bgcolor="5caad2"> <td align="center" style="color: #ffffff; font-size: 14px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 26px;"> <div style="line-height: 26px;padding: 12px;">
<a href=${config.get(
  "app_domain"
)}$link$ style="color: #ffffff; text-decoration: none;">Reset your password</a> </div> </td> </tr> <tr> <td height="25" style="font-size: 25px;line-height: 25px;"></td> </tr> <tr> <td align="left" style="color: #888888; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;"> </td> </tr> <tr> <td height="25" style="font-size: 25px;line-height: 25px;"></td> </tr>  <tr> <td height="25" style="font-size: 25px;line-height: 25px;"></td> </tr> <tr> <td align="left" style="color: #888888; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">  </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <!-- end header --> </body> </html>`;

module.exports.verifyotp = `<!DOCTYPE html><html> <head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;" /> <meta name="viewport" content="width=600,initial-scale = 2.3,user-scalable=no"> <!--[if !mso]><!-- --> <link href="https://fonts.googleapis.com/css?family=Work+Sans:300,400,500,600,700" rel="stylesheet"> <link href="https://fonts.googleapis.com/css?family=Quicksand:300,400,700" rel="stylesheet"> <!-- <![endif]--> <title>Email </title> <style type="text/css"> body { width: 100%; background-color: #96C809; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; mso-margin-top-alt: 0px; mso-margin-bottom-alt: 0px; mso-padding-alt: 0px 0px 0px 0px; } p, h1, h2, h3, h4 { margin-top: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; } span.preheader { display: none; font-size: 1px; } html { width: 100%; } table { font-size: 14px; border: 0; } } </style> </head>
   <body class="respond" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"> <!-- header --> <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff"> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590"> <tr> <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td> </tr> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590"> <tr> <td align="center" height="70" style="height:70px;"> <a href="" style="display: block; border-style: none !important; border: 0 !important;"><img width="100" border="0" style="display: block; width: 210px;" src=${config.get(
     "logo"
   )} alt="" /></a> </td> </tr> </table> </td> </tr> <tr> <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td> </tr> <tr> <td align="center">
  <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590" style="border:1px solid #eeeeee;"> <tr> <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td> </tr> <tr> <td align="center" style="color: #343434; font-size: 24px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header"> <div style="line-height: 35px"> Thank You for a signing in </div> <span style="color: #96C809;">Verify Your Account </span> </td> </tr> <tr> <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td> </tr> <tr> <td align="center"> <table border="0" width="40" align="center" cellpadding="0" cellspacing="0" bgcolor="eeeeee"> <tr> <td height="2" style="font-size: 2px; line-height: 2px;">&nbsp;</td> </tr> </table> </td> </tr> <tr> <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td> </tr> <tr> <td align="center">
                                          <table border="0" width="400" align="center" cellpadding="0" cellspacing="0" class="container590"> <tr> <td align="center" style="color: #888888; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;"> <div style="line-height: 24px"> Please use the following OTP to complete your verification. Your Verification Code Is </div> </td> </tr> </table> </td> </tr> <tr> <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td> </tr> <tr> <td align="center"> <table border="0" align="center" width="400" cellpadding="0" cellspacing="0" bgcolor="#96C809" style=""> <tr> <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td> </tr> <tr> <td align="center" style="color: #ffffff; font-size: 14px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 26px;"> <div style="line-height: 26px;"> <a href="" style="color: #ffffff; text-decoration: none;">$otp$</a> </div> </td> </tr>
 <tr> <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td> </tr> </table> </td> </tr> <tr> <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <!-- end header --> </body></html>`;

module.exports.SendMail = ` <html> <head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;" /> <meta name="viewport" content="width=600,initial-scale = 2.3,user-scalable=no"> <!--[if !mso]><!-- --> <link href='https://fonts.googleapis.com/css?family=Work+Sans:300,400,500,600,700' rel="stylesheet"> <link href='https://fonts.googleapis.com/css?family=Quicksand:300,400,700' rel="stylesheet"> <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap" rel="stylesheet"> <title>Email </title>
    <style type="text/css"> body { width: 100%; background-color: #ffffff; margin: 0; padding: 0; font-family: 'Roboto', sans-serif; -webkit-font-smoothing: antialiased; mso-margin-top-alt: 0px; mso-margin-bottom-alt: 0px; mso-padding-alt: 0px 0px 0px 0px; } p, h1, h2, h3, h4 { margin-top: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; } span.preheader { display: none; font-size: 1px; } html { width: 100%; } table { font-size: 14px; border: 0;
        } } </style> </head> <body class="respond" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"> <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff"> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590"> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590" style="background-image:url( ${config.get(
          "headerImage"
        )}); padding: 83px;"> </table> </td> </tr> <tr> <td align="center"> <table width="590" cellpadding="0" cellspacing="0" class="container590" style="background-color: #f7f9fb; padding: 40px 20px;"> <tr> <td align="left" style="color: #555555; font-family: 'Roboto', sans-serif; font-size: 16px; font-weight:400; font-style: italic; padding-bottom: 20px;" class="main-header"> <div style="line-height: 35px"> Dear $name$,</div> </td> </tr> <tr> <td align="left" style="color: #777777; font-family: 'Roboto', sans-serif; font-size: 14px; font-weight:400;" class="main-header"> <div style="line-height: 28px">$text$</div> </td> </tr> <tr> <td align="left" style="color: #555555; font-family: 'Roboto', sans-serif; font-size: 14px; font-weight:400; padding-top: 20px;" class="main-header"> <div style="line-height: 35px">Kind regards,</div> </td> </tr> <tr> <td align="left" style="color: #555555; font-family: 'Roboto', sans-serif; font-size: 16px; font-weight:400; padding-bottom: 10px;" class="main-header"> <div style="line-height: 35px"><b style="color: #96C809; font-weight: 200;">The Atelier Team</b></div> </td> </tr> <tr> <td align="left" style="border-top: 1px solid #cccccc; padding-bottom: 5px;" class="main-header"> </tr> <tr> <td align="left" style="color: #555555; font-family: 'Roboto', sans-serif; font-size: 14px; font-weight:400;" class="main-header"> <img src=${config.get(
  "logo"
)} style=" padding-top: 10px;"> </tr> </table> </body> </html>`;

module.exports.newProductEmail = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head> <meta charset="UTF-8"> <meta http-equiv="x-ua-compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <title>New-Product-email</title> </head> <body style="margin: 0;"> <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="background-color: #0069f1;"> <tbody> <tr> <td align="center"> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="center" valign="top"> <table class="col-600" width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #88b9f8;"> <tbody> <tr> <td height="15"></td> </tr> <tr> <td align="center" style="line-height: 0px;"> <img src="https://ateli-yay.sfo2.digitaloceanspaces.com/yay/1607887160808_header_white_logo.png" alt=""> </td> </tr> <tr> <td height="30"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td align="center"> <table class="col-600" width="600" border="0" cellpadding="0" cellspacing="0" style="padding: 0px 40px;"> <tbody> <tr> <td align="center" valign="top"> <table class="col-600" width="100%" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td height="50"></td> </tr> <tr> <td align="center" style="line-height: 0px;"> <img src=${config.get(
    "single_product_img"
  )} alt="logo"> </td> </tr> <tr> <td height="50"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td align="center"> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="center" style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 40px;color: rgb(255, 255, 255);font-weight: bold;"> Great News! </td> </tr> <tr> <td height="25"></td> </tr> <tr> <td align="center" style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);"> Your product has just been created and is now ready to order. :) </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="50"></td> </tr> <tr> <td> <table class="col-600" align="center" width="600" border="0" cellpadding="0" cellspacing="0" style="border-top: 1px solid #88b9f8;"> <tbody> <tr> <td height="15"></td> </tr> <tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgb(255, 255, 255);"> <a href="https://e-xd.co/" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgb(255, 255, 255);text-decoration: none;">www.e-xd.co</a> </td> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgb(255, 255, 255);text-align: right;"> E-XD Atelier PTY LTD. </td> </tr> <tr> <td height="15"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </body>
</html>
`;

module.exports.shippedProductEmail = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head> <meta charset="UTF-8"> <meta http-equiv="x-ua-compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <title>Shipped-Product-email</title> </head> <body style="margin: 0;"> <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="background-color: #0069f1;"> <tbody> <tr> <td align="center"> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="center" valign="top"> <table class="col-600" width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #88b9f8;"> <tbody> <tr> <td height="15"></td> </tr> <tr> <td align="center" style="line-height: 0px;"> <img src="https://ateli-yay.sfo2.digitaloceanspaces.com/yay/1607887160808_header_white_logo.png" alt=""> </td> </tr> <tr> <td height="30"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td align="center"> <table class="col-600" width="600" border="0" cellpadding="0" cellspacing="0" style="padding: 0px 40px;"> <tbody> <tr> <td align="center" valign="top"> <table class="col-600" width="100%" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td height="50"></td> </tr> <tr> <td align="center" style="line-height: 0px;"> <img src=${config.get(
    "halfDoneShippingPayment"
  )} alt="logo"> </td> </tr> <tr> <td height="50"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td align="center"> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="center" style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 40px;color: rgb(255, 255, 255);font-weight: bold;"> $productName$ is almost here! </td> </tr> <tr> <td height="25"></td> </tr> <tr> <td align="center" style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);"> Just a few more steps before your order is finalized. There's an outstanding amount of $amountLeft$ remaining for your order. Click below to finalise your delivery</td> </tr> </tbody> </table> </td> </tr><tr> <td height="20"></td> </tr> <tr> <td><tbody> <tr> <td align="center"> <a href=${config.get(
  "app_domain"
)}$link$ style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: #fff;border-width: 3px;border-color: rgb(255, 255, 255);border-style: solid;border-radius: 50px;width: 202px;display: block;padding: 10px 0px;text-decoration: none;">View</a> </td> </tr><tr> <td height="50"></td> </tr> </tbody> <table class="col-600" align="center" width="600" border="0" cellpadding="0" cellspacing="0" style="border-top: 1px solid #88b9f8;"> <tbody> <tr> <td height="15"></td> </tr> <tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgb(255, 255, 255);"> <a href="https://e-xd.co/" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgb(255, 255, 255);text-decoration: none;">www.e-xd.co</a> </td> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgb(255, 255, 255);text-align: right;"> E-XD Atelier PTY LTD. </td> </tr> <tr> <td height="15"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </body>
</html>
`;

module.exports.acceptedProductEmail = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head> <meta charset="UTF-8"> <meta http-equiv="x-ua-compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <title>Inproduction-update-email</title> </head> <body style="margin: 0;"> <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="center"> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="center" valign="top"> <table class="col-600" width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #bbbbbb;"> <tbody> <tr> <td height="15"></td> </tr> <tr> <td align="center" style="line-height: 0px;"> <img src="https://ateli-yay.sfo2.digitaloceanspaces.com/yay/1607887160808_header_white_logo.png" alt="logo"> </td> </tr> <tr> <td height="30"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td align="center"> <table class="col-600" width="600" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="center" valign="top"> <table class="col-600" width="100%" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td height="40"></td> </tr> <tr> <td align="center" style="line-height: 0px;"> <img src="images/product_image.png" alt="logo"> </td> </tr> <tr> <td height="40"></td> </tr> <tr> <td align="center" style="line-height: 0px;"> <img src="images/product_content_img.png" alt="logo"> </td> </tr> <tr> <td height="40"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td align="center"> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="background-color: rgb(248, 248, 248);border-width: 1px;border-color: rgb(255, 255, 255);border-style: solid;border-radius: 30px;padding: 30px 50px;"> <tbody> <tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(0, 0, 0);"> Hey $name$, </td> </tr> <tr> <td height="25"></td> </tr> <tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(0, 0, 0);"> We have started production on all components for your product $productName$. That is, primary packaging, secondary packaging, formulation and labelling, we will keep you updated on how they’re tracking. </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="25"></td> </tr> <tr> <td> <table class="col-600" align="center" width="600" border="0" cellpadding="0" cellspacing="0" style="border-top: 1px solid #bbbbbb;"> <tbody> <tr> <td height="15"></td> </tr> <tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgba(0, 0, 0, 0.502);"> <a href="https://e-xd.co/" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgba(0, 0, 0, 0.502);text-decoration: none;">www.e-xd.co</a> </td> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgba(0, 0, 0, 0.502);text-align: right;"> E-XD Atelier PTY LTD. </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </body> </html> `;

module.exports.delayEmail = `

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="x-ua-compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Delayed-email</title>
	</head>
	<body style="margin: 0;"> <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="center"> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="center" valign="top"> <table class="col-600" width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #bbbbbb;"> <tbody> <tr> <td height="15"></td> </tr> <tr> <td align="center" style="line-height: 0px;"> <img src=${config.get(
    "header_logo"
  )} alt="logo"> </td> </tr> <tr> <td height="30"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td align="center"> <table class="col-600" width="600" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="center" valign="top"> <table class="col-600" width="100%" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td height="25"></td> </tr> <tr> <td align="left" style="line-height: 0px;"> <img style="margin-left: 50px;" src=${config.get(
  "exclamation"
)} alt="logo"> </td> </tr> <tr> <td height="25"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td align="center"> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="background-color: rgb(248, 248, 248);border-width: 1px;border-color: rgb(255, 255, 255);border-style: solid;border-radius: 30px;padding: 50px;"> <tbody>
								<tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(0, 0, 0);"> Hey $userName$, </td> </tr> <tr> <td height="25"></td> </tr> <tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(0, 0, 0);"> $productName$’s $component$ has been delayed due to $reason$. We’re trying our best to minimise this delay as much as possible. If you have any concerns please contact your account manager. </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="25"></td> </tr> <tr> <td> <table class="col-600" align="center" width="600" border="0" cellpadding="0" cellspacing="0" style="border-top: 1px solid #bbbbbb;"> <tbody> <tr> <td height="15"></td> </tr> <tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgba(0, 0, 0, 0.502);"> <a href="https://e-xd.co/" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgba(0, 0, 0, 0.502);text-decoration: none;">www.e-xd.co</a> </td> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgba(0, 0, 0, 0.502);text-align: right;"> E-XD Atelier PTY LTD. </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </body> </html>`;

module.exports.orderPlaced = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="x-ua-compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Your-order-has-been-placed-email</title>
	</head>
	<body style="margin: 0;"> <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="center"> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="center" valign="top"> <table class="col-600" width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #bbbbbb;"> <tbody> <tr> <td height="15"></td> </tr> <tr> <td align="center" style="line-height: 0px;"> <img src=${config.get(
    "header_logo"
  )} alt="logo"> </td> </tr> <tr> <td height="30"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td align="center"> <table class="col-600" width="600" border="0" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #bbbbbb;"> <tbody> <tr> <td align="center" valign="top"> <table class="col-600" width="100%" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td height="25"></td> </tr> <tr> <td align="left"> <img src=${config.get(
  "order_submit"
)} alt="logo"> </td> <td align="left"> <img src=${config.get(
  "blue_smile_icon"
)} alt="logo"> </td> </tr> <tr> <td height="25"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="25"></td> </tr> <tr> <td align="center"> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0"> <tbody> <tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(0, 0, 0);"> Your Order has been placed! Details are below. </td> </tr> <tr>
									<td height="25"></td>
								</tr> </tbody> </table> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="background-color: #0069f1;border-radius: 30px;"> <tbody> <tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);padding: 25px 50px;"> Order No.$orderId$</td> </tr> <tr> <td> <table style="width: 83%;border-bottom: 1px solid #ffffff;margin: 0 auto;"> <tbody> <tr> <td></td> </tr> </tbody> </table> </td> </tr> <tr> <td align="center"> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;padding: 25px 50px;border-spacing: 0 1em;color: #ffffff;font-size: 16px;"> <tbody> <tr> <td width="100px"> <img src= $heroImage$ alt="logo"> </td> <td> $productName$ </td> <td> Cost <p>$cost$</p> </td> <td> Units <p>$units$</p> </td> <td> RRP <p>$RRP$</p> </td> <td> Margin <p>$margin$</p> </td> </tr> <tr> <td colspan="6"> <table style="width: 100%;border-bottom: 1px solid #ffffff;margin: 0 auto;"> <tbody> <tr> <td></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="40"></td> </tr> <tr> <td> <table class="col-600" align="center" width="600" border="0" cellpadding="0" cellspacing="0" style="border-top: 1px solid #bbbbbb;"> <tbody> <tr> <td height="15"></td> </tr> <tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgba(0, 0, 0, 0.502);"> <a href="https://e-xd.co/" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgba(0, 0, 0, 0.502);text-decoration: none;">www.e-xd.co</a> </td> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgba(0, 0, 0, 0.502);text-align: right;"> E-XD Atelier PTY LTD. </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </body> </html>`;

module.exports.userMail = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="x-ua-compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Email-template_log-in-details</title>
	</head>
	<body style="margin: 0;"> <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="background-color: #0069f1;"> <tbody> <tr> <td align="center"> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="padding: 0px 40px;"> <tbody> <tr> <td align="center" valign="top"> <table class="col-600" width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #88b9f8;"> <tbody> <tr> <td height="15"></td> </tr> <tr> <td align="center" style="line-height: 0px;"> <img src=${config.get(
    "white_logo"
  )} alt="logo"> </td> </tr> <tr> <td height="30"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td align="center"> <table class="col-600" width="600" border="0" cellpadding="0" cellspacing="0" style="padding: 0px 40px;"> <tbody> <tr> <td align="center" valign="top"> <table class="col-600" width="100%" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td height="50"></td> </tr> <tr> <td align="left" style="line-height: 0px;"> <img src=${config.get(
  "welcome_image"
)} alt="logo"> </td> <td align="left" style="line-height: 0px;vertical-align:bottom;text-align: right;"> <img src=${config.get(
  "smile_icon"
)} alt="logo"> </td> </tr> <tr> <td height="50"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td align="center"> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="background-color: #ffffff;padding: 20px 40px;"> <tbody> <tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: #010101;"> Congratulations! </td> </tr> <tr> <td height="25"></td> </tr> <tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: #010101;"> Your account with us has been created. Here’s some important information you will need for your Atelier account so, please save this email so you can refer to it later. </td> </tr> </tbody> </table> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="background-color: #ffffff;padding: 20px 40px;"> <tbody> <tr> <td align="center" valign="top"> <table class="col-600" width="286" align="center" border="0" cellpadding="0" cellspacing="0" style="background-color: rgb(242, 242, 242);border-radius: 30px;padding: 15px;"> <tbody> <tr> <td align="center" style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: #010101;"> <b>USERNAME:</b> </br>$userName$ </td> </tr>
												<tr>
													<td height="20"></td> </tr> <tr> <td align="center" style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: #010101;"> <b>PASSWORD:</b> </br>$password$ </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="background-color: #ffffff;padding: 20px 40px;"> <tbody> <tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: #010101;"> We’re so excited to start creating some of the coolest products together. Let’s get started! ;) </td> </tr> </tbody> </table> </td> </tr> <tr> <td> <table class="col-600" align="center" width="600" border="0" cellpadding="0" cellspacing="0" style="padding: 0px 40px;"> <tbody> <tr> <td height="15"></td> </tr> <tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgb(255, 255, 255);"> <a href="https://e-xd.co/" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgb(255, 255, 255);text-decoration: none;">www.e-xd.co</a> </td> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgb(255, 255, 255);text-align: right;"> E-XD Atelier PTY LTD. </td> </tr> <tr> <td height="15"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </body> </html>`;

module.exports.trackMail = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="x-ua-compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Tracking-email</title>
	</head>
	<body style="margin: 0;"> <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="center"> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="center" valign="top"> <table class="col-600" width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #bbbbbb;"> <tbody> <tr> <td height="15"></td> </tr> <tr> <td align="center" style="line-height: 0px;"> <img ${config.get(
    "header_logo"
  )}  alt="logo"> </td> </tr> <tr> <td height="30"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr>
					<td align="center"> <table class="col-600" width="600" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="center" valign="top"> <table class="col-600" width="100%" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td height="35"></td> </tr> <tr> <td align="center" style="line-height: 0px;"> <img src=${config.get(
            "shippingImage"
          )} alt="logo"> </td> </tr> <tr> <td height="30"></td> </tr> <tr> <td align="center" style="line-height: 0px;"> <img src=${config.get(
  "trackingImage"
)} alt="logo"> </td> </tr> <tr> <td height="35"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td align="center"> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="background-color: rgb(248, 248, 248);border-width: 1px;border-color: rgb(255, 255, 255);border-style: solid;border-radius: 30px;padding: 30px 42px;"> <tbody> <tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(0, 0, 0);"> Hey $userName$, </td> </tr>
								<tr>
									<td height="25"></td>
								</tr>
								<tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(0, 0, 0);"> Your $component$ for $productName$ has just been shipped. Here’s your tracking details. Log in to your Atelier App for more details. </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="25"></td> </tr> <tr> <td align="center"> <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="center"> <a href="#" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: #010101;border-width: 3px;border-color: rgb(0, 105, 241);border-style: solid;border-radius: 50px;width: 202px;background-color: #ffffff;display: block;padding: 10px 0px;text-decoration: none;">Track Here</a> </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="25"></td> </tr> <tr> <td> <table class="col-600" align="center" width="600" border="0" cellpadding="0" cellspacing="0" style="border-top: 1px solid #bbbbbb;"> <tbody> <tr> <td height="15"></td> </tr> <tr> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgba(0, 0, 0, 0.502);"> <a href="https://e-xd.co/" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgba(0, 0, 0, 0.502);text-decoration: none;">www.e-xd.co</a> </td> <td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgba(0, 0, 0, 0.502);text-align: right;"> E-XD Atelier PTY LTD. </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </body> </html>`;

module.exports.orderSubmitted = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="x-ua-compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Your-order-is-confirmed-email</title>
	</head>
	<body style="margin: 0;">
		<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
			<tbody>
				<tr>
					<td align="center">
						<table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
							<tbody>
								<tr>
									<td align="center" valign="top">
										<table class="col-600" width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #bbbbbb;">
											<tbody>
												<tr>
													<td height="15"></td>
												</tr>
												<tr>
													<td align="center" style="line-height: 0px;">
														<img src=${config.get("header_logo")} alt="logo">
													</td>
												</tr>
												<tr>
													<td height="30"></td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
				<tr>
					<td align="center">
						<table class="col-600" width="600" border="0" cellpadding="0" cellspacing="0">
							<tbody>
								<tr>
									<td align="center" valign="top">
										<table class="col-600" width="100%" border="0" cellpadding="0" cellspacing="0">
											<tbody>
												<tr>
													<td height="40"></td>
												</tr>
												<tr>
													<td align="left">
														<img src=${config.get("order_submit")} alt="logo">
													</td>
												</tr>
												<tr>
													<td height="40"></td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
				<tr>
					<td height="25"></td>
				</tr>
				<tr>
					<td align="center">
						<table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="background-color: #0069f1;">
							<tbody>
								<tr>
									<td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);">
										<table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;padding: 0px 25px;border-spacing: 0 1em;color: #ffffff;font-size: 16px;">
											<tbody>
												<tr>
													<td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);">
														Order Summary
													</td>
													<td align="right" style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);">
														<img src=${config.get("right_icon")} alt="logo">
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
								<tr>
									<td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgb(255, 255, 255);padding: 25px;text-transform: uppercase;">
										ORDER NO.
										<p style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);margin: 5px 0px;">$orderId$</p>
									</td>
								</tr>
								<tr>
									<td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);padding: 0px 25px;text-transform: uppercase;">
										Product Details
									</td>
								</tr>
								<tr>
									<td align="center">
										<table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;padding: 25px;border-spacing: 0 1em;color: #ffffff;font-size: 16px;">
											<tbody>
												<tr>
													<td width="100px" rowspan="2">
														<img src=$heroImage$ alt="logo">
													</td>
													<td style="text-transform: uppercase;">
														Product Name
														<p>$productName$</p>
													</td>
													<td style="text-transform: uppercase;">
														Date
														<p>22 June, 2020</p>
													</td>
													<td style="text-transform: uppercase;">
														Quantity
														<p>$quantity$</p>
													</td>
													<td style="text-transform: uppercase;">
														Amount
														<p>AUD $amount$</p>
													</td>
												</tr>
												<tr>
													<td colspan="4" style="text-transform: uppercase;">
														<a href="#" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(0, 105, 241);border-width: 3px;border-color: rgb(0, 105, 241);border-style: solid;border-radius: 50px;background-color: #ffffff;text-transform: unset;font-weight: bold;display: block;padding: 10px;text-align: center;text-decoration: none;">This Order Has Carbon Offset Applied</a>
													</td>
												</tr>
												<tr>
													<td height="20"></td>
												</tr>
												<tr>
													<td colspan="5">
														<table style="width: 100%;border-bottom: 1px solid #ffffff;margin: 0 auto;">
															<tbody>
																<tr>
																	<td></td>
																</tr>
															</tbody>
														</table>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
								<tr>
									<td align="center">
										<table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;padding: 0px 25px;border-spacing: 0 1em;color: #ffffff;font-size: 16px;">
											<tbody>
												<tr>
													<td width="230px" style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);text-transform: uppercase;">
														Final Production Time
													</td>
													<td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);text-transform: uppercase;">
														$productionTime$ Days
													</td>
													<td rowspan="2" style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);text-transform: uppercase;">
														<b>Delivered On:</b>
														<p>$deliveredDate$</p>
													</td>
												</tr>
												<tr>
													<td width="230px" style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);text-transform: uppercase;">
														Primary Packaging
													</td>
													<td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);text-transform: uppercase;">
														$primaryProductionTime$ Days
													</td>
												</tr>
												<tr>
													<td width="230px" style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);text-transform: uppercase;">
														Secondary Packaging
													</td>
													<td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);text-transform: uppercase;">
													$secondaryProductionTime$ Days
													</td>
													<td rowspan="3" style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);text-transform: uppercase;">
														<b>Shipped To</b>
														<p>$shippingAddress$</p>
													</td>
												</tr>
												<tr>
													<td width="230px" style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);text-transform: uppercase;">
														Labelling
													</td>
													<td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);text-transform: uppercase;">
														$labelProductionTime$ Days
													</td>
												</tr>
												<tr>
													<td width="230px" style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);text-transform: uppercase;">
														Formulation & Filling
													</td>
													<td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);text-transform: uppercase;">
														$formulationProductionTime$ Days
													</td>
												</tr>
												<tr>
													<td height="20"></td>
												</tr>
												<tr>
													<td colspan="3">
														<table style="width: 100%;border-bottom: 1px solid #ffffff;margin: 0 auto;">
															<tbody>
																<tr>
																	<td></td>
																</tr>
															</tbody>
														</table>
													</td>
												</tr>
												<tr>
													<td height="10"></td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
								<tr>
									<td align="center">
										<table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;padding: 0px 25px;border-spacing: 0 1em;color: #ffffff;font-size: 16px;">
											<tbody>
												<tr>
													<td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);text-transform: uppercase;">
														Paid Upfront With A </br>5% Discount Saving:
													</td>
													<td align="right" style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 16px;color: rgb(255, 255, 255);text-transform: uppercase;">
														Total Amount Paid:
													</td>
												</tr>
												<tr>
													<td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 40px;color: rgb(255, 255, 255);text-transform: uppercase;">
														<b>$ $donationAmount$</b>
													</td>
													<td align="right" style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 40px;color: rgb(255, 255, 255);text-transform: uppercase;">
														<b>$ $totalAmount$</b>
													</td>
												</tr>
												<tr>
													<td height="10"></td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
				<tr>
					<td height="20"></td>
				</tr>
				<tr>
					<td>
						<table class="col-600" align="center" width="600" border="0" cellpadding="0" cellspacing="0" style="border-top: 1px solid #bbbbbb;">
							<tbody>
								<tr>
									<td height="15"></td>
								</tr>
								<tr>
									<td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgba(0, 0, 0, 0.502);">
										<a href="https://e-xd.co/" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgba(0, 0, 0, 0.502);text-decoration: none;">www.e-xd.co</a>
									</td>
									<td style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size: 12px;color: rgba(0, 0, 0, 0.502);text-align: right;">
										E-XD Atelier PTY LTD.
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>
	</body>
</html>`;
