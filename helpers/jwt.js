const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;
  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked
  }).unless({
    path: [
      { url: /\/v1\/fashionhub\/products\/(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/v1\/fashionhub\/categories\/(.*)/, methods: ['GET', 'OPTIONS'] },
      `${api}/users/login`,
      `${api}/users/register`
    ]
  })
}

async function isRevoked(req, jwt) {

  const payload = jwt.payload
  if (!payload.isAdmin) {
    return true
  }
  return false
}

module.exports = authJwt;
