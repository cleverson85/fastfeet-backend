# Inicio
docker-compose up -d
Obs: Este comando irá criar as tabelas e o user seed na aplicação usando docker.

# Criar tabelas
yarn sequelize db:migrate

# Criar Seed
yarn sequelize db:seed:all

# Login/Senha
admin@fastfeet.com
123456