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
    <meta property="og:url" content="https://tools.reactpwa.com/vapid/" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="Generate VAPID Keys online" />
    <meta property="og:description" content="Implement web push notifications with Voluntary Application Server Identification. This tool helps you create public & private keys for VAPID server" />

    <meta property="og:image" content="/vapid/public/digital-keys.png" />
    <meta property="og:image:secure_url" content="https://tools.reactpwa.com/vapid/public/digital-keys.png" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="512" />
    <meta property="og:image:height" content="512" />
    <meta property="og:image:alt" content="Digital Keys" />
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
        .txt-center {
          text-align: center;
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
        .card {
          margin-top: 20px;
          border: 1px solid #d3d3d3;
          border-radius: .25rem;
        }
        .content {
          padding: 15px;
        }
    </style>
</head>
<body>
<div class="container">
<h1>Secure VAPID key generator</h1>
<p><u><i><strong>Note:</strong> New keys are generated on every request/refresh/reload</u></i></p>
<p class="txt-big">${showEmailReplace ? "Please replace &quot;<strong>&lt;someone@example.com&gt;</strong>&quot; with your own email address" : ""}</p>
<div>
<form action="" method="get">
   <input type="email" required name="email" value="${email}" />
   <button type="submit">Update subject email & re-generate keys</button>
</form>
</div>
<pre><code class="language-json">${json}</code></pre>
<a class="txt-download" href="${jsonStr}" download="vapid.json" title="vapid.json">Click here to download the <strong>vapid.json</strong></a>
<div class="card">
  <div class="content">
    <h3><a href="https://www.reactpwa.com/" target="_blank">Parent Project: ReactPWA</a></h3>
    <p>This tool helps you create public &amp; private keys for <strong>Voluntary Application Server Identification - VAPID</strong></p>
    <p>This tool was created for supporting the project <a href="https://github.com/Atyantik/pawjs" target="_blank">PawJS</a> &amp; <a href="https://www.reactpwa.com/" target="_blank">ReactPWA</a> to help implement Web Push notification.</p>
  </div>
</div>
</div>
<footer class="container">
  <section class="copyright txt-center"><a href="https://www.atyantik.com" target="_blank" rel="noreferrer noopener nofollow">Copyright &copy; 2018 Atyantik Technologies Private Limited</a></section>
</footer>

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

