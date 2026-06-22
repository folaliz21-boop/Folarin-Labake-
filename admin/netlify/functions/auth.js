exports.handler = async function(event, context) {
  const { path } = event;
  
  if (path === '/auth/github') {
    const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
    
    // Redirect to GitHub for authorization
    return {
      statusCode: 302,
      headers: {
        Location: `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo&redirect_uri=https://bucolic-duckanoo-9b8918.netlify.app/auth/github/callback`
      }
    };
  }
  
  if (path === '/auth/github/callback') {
    // Handle GitHub callback and exchange code for token
    const { code } = event.queryStringParameters;
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    // Redirect back to CMS with token
    return {
      statusCode: 302,
      headers: {
        Location: `/admin/?access_token=${tokenData.access_token}`
      }
    };
  }
  
  return {
    statusCode: 404,
    body: 'Not Found'
  };
};
