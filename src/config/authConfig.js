require('dotenv').config({
  path: process.env.API_ENVIRONMENT === 'docker' ? '.env.docker' : '.env',
});

export default {
  secret: process.env.SECRET_API,
  expiresIn: '7d',
};
