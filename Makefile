init: down-clear yarn-install yarn-build up composer-install migrate queue
restart: down up
up:
	(cd backend && docker-compose up -d) && \
	(cd frontend && docker-compose up -d)
down:
	(cd backend && docker-compose down --remove-orphans) && \
	(cd frontend && docker-compose down --remove-orphans)
down-clear:
	(cd backend && docker-compose down -v --remove-orphans) && \
	(cd frontend && docker-compose down -v --remove-orphans) && \
	(cd backend/files && sudo rm -vrf ./*)
status:
	(cd backend && docker-compose ps -a) && \
	(cd frontend && docker-compose ps -a)
bash:
	(cd backend && docker-compose exec --user=www-data php bash)
composer-install:
	(cd backend && docker-compose exec php composer install)
yarn-install:
	(cd frontend && docker-compose run --rm node yarn install)
yarn-build:
	(cd frontend && docker-compose run --rm node yarn build)
migrate:
	(cd backend && docker-compose exec php yii migrate --interactive=0)
queue:
	(cd backend && docker-compose exec -d php yii queue/listen)
build:
	(cd backend && docker-compose build) && \
	(cd frontend && docker-compose build)