bash:
	(cd ../../laradock && docker-compose exec --user=laradock --workdir=$(WORKDIR) workspace bash)
