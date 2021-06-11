require('dotenv').config({
  path: process.env.API_ENVIRONMENT === 'docker' ? '.env.docker' : '.env',
});

module.exports = {
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    freezeTableName: true,
  },
};
