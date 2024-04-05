const http = require('http');
const { findUser } = require('./db.function');

function getBodyFromStream(req) {
  return new Promise((resolve, reject) => {
    const data = [];
    req.on('data', (chunk) => {
      data.push(chunk);
    });
    req.on('end', () => {
      const body = Buffer.concat(data).toString();
      if (body) {
        // assuming that the body is a json object
        resolve(JSON.parse(body));
        return;
      }
      resolve({});
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}

function authenticate(req, res, next) {
  const authHeader = req.headers;
  if (!authHeader) {
    res.statusCode = 401;
    res.end('header content not found');
    return;
  }
  const { username, password } = authHeader;
  const user = findUser(username);
  if (!user || user.username !== username || user.password !== password) {
    res.statusCode = 401;
    res.end('user not found');
    return;
  }
  next(req, res);
}

function getBooks(req, res) {
  console.log('getBooks', req.body);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ books: [{ name: 'Harry Potter' }] }));
}

function postBooks(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end(`POST request received from ${req.url} endpoint`);
}

function updateBooks(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end(`PUT request received from ${req.url} endpoint`);
}

function updatePatialBooks(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end(`PATCH request received from ${req.url} endpoint`);
}

function deleteBooks(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end(`DELETE request received from ${req.url} endpoint`);
}

function getAuthors(req, res) {
  console.log('getBooks', req.body);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ authors: [{ name: 'J.K. Rowling' }] }));
}

const server = http.createServer(async (req, res) => {
  try {
    const body = await getBodyFromStream(req);
    if (req.url === '/books' && req.method === 'GET') {
      authenticate(req, res, getBooks);
    } else if (req.url === '/books' && req.method === 'POST') {
      authenticate(req, res, postBooks);
    } else if (req.url === '/books' && req.method === 'PUT') {
      authenticate(req, res, updateBooks);
    } else if (req.url === '/books' && req.method === 'PATCH') {
      authenticate(req, res, updatePatialBooks);
    } else if (req.url === '/books' && req.method === 'DELETE') {
      authenticate(req, res, deleteBooks);
    } else if (req.url === '/authors' && req.method == 'GET') {
      authenticate(req, res, getAuthors);
    } else if (req.url === '/authors' && req.method === 'POST') {
      authenticate(req, res, postBooks);
    } else if (req.url === '/authors' && req.method === 'PUT') {
      authenticate(req, res, updateBooks);
    } else if (req.url === '/authors' && req.method === 'PATCH') {
      authenticate(req, res, updatePatialBooks);
    } else if (req.url === '/authors' && req.method === 'DELETE') {
      authenticate(req, res, deleteBooks);
    }
  } catch (error) {
    res.statusCode = 500;
    res.end(error.message);
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
