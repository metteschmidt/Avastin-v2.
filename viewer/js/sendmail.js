
/* Support functions */

function sendMailInclude(file)
{
  var script  = document.createElement('script');
  script.src  = file;
  script.type = 'text/javascript';
  script.defer = true;
  document.getElementsByTagName('head').item(0).appendChild(script);
}

/* include any js files here */
sendMailInclude('../viewer/js/json2.js');

function sendMail(address, subject, body, fileName)
{
    var args = {'address': address, 'subject': subject, 'body':body, 'fileName': fileName};

    var invokeString = "objc://iplanner/sendMail?" + encodeURIComponent(JSON.stringify(args));

    iFrame = document.createElement("IFRAME");
    iFrame.setAttribute("src", invokeString);
    document.body.appendChild(iFrame); 
    iFrame.parentNode.removeChild(iFrame);
    iFrame = null;
}

