## Avant de lancer l'application

Il faut ajouter un .env dans le dossier server 

contenu du .env exemple : 

HOST=localhost
PORT=3000
DATABASE_URL=postgres://postgres:test@database:5432/s3ku4pp
JWT_ENCRYPTION=secret
TOKEN=/kHdfUX+u/Kn3qPY4+ahjwQgyV5UhkM5cdh1i2xhozB=

REDIS_HOST=redis
REDIS_PORT=6379


USERNAME=postgres
PASSWORD=test
DATABASE=s3ku4pp

## Après avoir ajouter le .env dans le dossier server

1) Se mettre dans le dossier server `cd server`

2) Build les images docker avec la commande `docker-compose build`

3) Run les conteneurs `docker-compose up`

Si tout est ok on doit pouvoir accéder à l'api via le reverse-proxy  `https://localhost:443/api`
sans oublier d'ajouter dans le headers le token inscrit dans le .env en l'occurence ici dans l'exemple `/kHdfUX+u/Kn3qPY4+ahjwQgyV5UhkM5cdh1i2xhozB=` 
