init: down-clear up composer-install migrate
restart: down up
up:
	(cd backend && docker-compose up -d)
down:
	(cd backend && docker-compose down --remove-orphans)
down-clear:
	(cd backend && docker-compose down -v --remove-orphans)
status:
	(cd backend && docker-compose ps -a)
bash:
	(cd backend && docker-compose exec php bash)
composer-install:
	(cd backend && docker-compose exec php composer install)
migrate:
	(cd backend && docker-compose exec php yii migrate --interactive=0)