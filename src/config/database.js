module.exports = {
  dialect: 'postgres',
  host: 'db',
  username: 'postgres',
  password: 'docker',
  database: 'FastFeet',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    freezeTableName: true,
  },
};
