APP_NAME = granit-betest

build:
	docker build --platform=linux/amd64 -t $(APP_NAME) .

run:
	docker run --name $(APP_NAME) -it --rm -p 3000:3000 $(APP_NAME)