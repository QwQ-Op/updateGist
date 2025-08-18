export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { model, cover, photoset } = req.body;

    // Your GitHub token and Gist ID
    const GIT_TOKEN = process.env.GIT_TOKEN;
    const GIST_ID = 'ae7fac1de4023cbb57f59e8fee2e0555';
    const FILE_NAME = 'favs.json';

    // Fetch current data from Gist
    const gistRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        Authorization: `token ${GIT_TOKEN}`,
      }
    });

    const gist = await gistRes.json();
    let favorites = [];
    if (gist.files[FILE_NAME]?.content) {
      favorites = JSON.parse(gist.files[FILE_NAME].content);
    }

    // Add new favorite
    favorites.push({
      model,
      cover,
      photoset,
      date: new Date().toISOString().slice(0, 10)
    });

    // Update the Gist with new data
    const patchRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        Authorization: `token ${GIT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          [FILE_NAME]: {
            content: JSON.stringify(favorites, null, 2)
          }
        }
      })
    });

    if (patchRes.ok) {
      return res.status(200).json({ message: 'Favorite added successfully!' });
    } else {
      return res.status(500).json({ message: 'Failed to update Gist.' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
