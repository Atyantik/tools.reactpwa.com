const webPush = require("web-push");
const path = require("path");
const fs = require("fs");
const http = require("http");
const url = require('url');


const output = (publicKey, privateKey, subject,email) => {
  let showEmailReplace = false;
  if (!subject) {
    showEmailReplace = true;
    subject = "mailto:&lt;someone@example.com&gt;";
  }
  const json = `{
  "subject": "${subject}",
  "publicKey": "${publicKey}",
  "privateKey": "${privateKey}"
}`;
  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(json.replace(/&lt;/g, '<').replace(/&gt;/g, '>') );
  return `<!DOCTYPE html>
<html>
<link>
    <link rel="icon" href="../favicon.ico" type="image/x-icon" />
    <title>Vapid key generator online</title>
    <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism-okaidia.min.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/components/prism-json.js"></script>
    <style>
        .container {
          margin: 0 auto;
          max-width: 1000px;
          font-size: 18px;
          padding: 10px;
        }
        .txt-big {
          font-size: 21px;
        }
        .txt-download {
          cursor: pointer;
          font-size: 20px;
          text-align: center;
          display: block;
          padding: 10px;
          margin-top: 20px;
          text-decoration: none;
          color: white;
          background: green;
          border-radius: 5px;
        }
        .txt-download:hover, .txt-download:active, .txt-download:focus {
          background: #009f00;
        }
        pre[class*=language-], code[class*=language-] {
          white-space: pre-wrap
        }
        input[type=email], button[type=submit] {
          padding: 5px;
        }
    </style>
</head>
<body>
<div class="container">
<h1>Secure VAPID key generator</h1>
<p><u><i><strong>Note:</strong> New keys are generated on every request/refresh/reload</u></i></p>
<p class="txt-big">${showEmailReplace ? "Please replace &quot;<strong>&lt;someone@example.com&gt;</strong>&quot; with your own email address" : ""}</p>
<div>
<form action="/" method="get">
   <input type="email" required name="email" value="${email}" />
   <button type="submit">Update subject email & re-generate keys</button>
</form>
</div>
<pre><code class="language-json">${json}</code></pre>
<a class="txt-download" href="${jsonStr}" download="vapid.json" title="vapid.json">Click here to download the <strong>vapid.json</strong></a>
</div>
</body>
</html>
`
};

const FAVICON = path.join(__dirname, "..","favicon.ico");
//create a server object:
const server = http.createServer(function (req, res) {
  const pathname = url.parse(req.url).pathname;
  
  if (req.method === 'GET' && pathname.indexOf("favicon.ico") !== -1) {
    res.setHeader('Content-Type', 'image/x-icon');
    fs.createReadStream(FAVICON).pipe(res);
    return;
  }
  
  const queryData = url.parse(req.url, true).query;
  const email = queryData.email || "";
  let subject = queryData.sub || queryData.subject || "";
  
  if (!subject && email) {
    subject = `mailto:${email}`
  }
  
  const vapidKeys = webPush.generateVAPIDKeys();
  res.write(output(vapidKeys.publicKey, vapidKeys.privateKey, subject, email)); //write a response to the client
  res.end(); //end the response
});

const port = process.env.PORT || "8080";
server.listen(port, "localhost", () => {
  console.log(`Server running on port: ${port}`);
});

