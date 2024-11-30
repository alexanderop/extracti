import express from 'express';
import cors from 'cors';
import https from 'https';

const app = express();
app.use(cors());

app.get('/download-repo/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;
  const zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/main.zip`;

  https.get(zipUrl, (response) => {
    if (response.statusCode === 302 || response.statusCode === 301) {
      // Follow redirect
      https.get(response.headers.location, (redirectResponse) => {
        redirectResponse.pipe(res);
      }).on('error', (err) => {
        res.status(500).json({ error: err.message });
      });
    } else {
      response.pipe(res);
    }
  }).on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
}); 