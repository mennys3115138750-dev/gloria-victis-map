// Netlify Function — Git 数据库代理
// 接收前端保存请求，调用 GitHub API 提交 markers.json
// GITHUB_TOKEN 通过 Netlify 环境变量设置，不写入代码

const REPO_OWNER = 'mennys3115138750-dev';
const REPO_NAME = 'gloria-victis-map';
const BRANCH = 'master';
const FILE_PATH = 'data/markers.json';

exports.handler = async (event) => {
  // CORS 预检（同域名不需要，但保留兼容）
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Not Found' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: '请求体不是有效的 JSON' })
    };
  }

  if (!body.markers || !Array.isArray(body.markers)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: '缺少 markers 数组' })
    };
  }

  const content = JSON.stringify(body, null, 2) + '\n';
  const apiBase = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'User-Agent': 'gv-map-netlify',
    Accept: 'application/vnd.github+json'
  };

  // 1. 获取当前文件 sha
  let sha = null;
  try {
    const res = await fetch(apiBase, { headers });
    if (res.ok) {
      const data = await res.json();
      sha = data.sha;
    }
  } catch (e) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: '无法连接 GitHub API' })
    };
  }

  // 2. 提交更新
  const commitBody = {
    message: 'Update markers from web editor',
    content: Buffer.from(content).toString('base64'),
    branch: BRANCH
  };
  if (sha) commitBody.sha = sha;

  const commitRes = await fetch(apiBase, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(commitBody)
  });

  if (!commitRes.ok) {
    const err = await commitRes.json().catch(() => ({}));
    if (commitRes.status === 409) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: '数据已被他人修改，请刷新页面后重试' })
      };
    }
    return {
      statusCode: commitRes.status,
      body: JSON.stringify({ error: err.message || 'GitHub API 错误' })
    };
  }

  const result = await commitRes.json();
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      commit: {
        sha: result.commit.sha,
        html_url: result.commit.html_url,
        message: result.commit.message
      }
    })
  };
};
