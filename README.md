# IT animals

<b>Задача 9. Автоматизированный алгоритм обезличивания данных</b>

<b>Демо: </b> http://62.84.123.147:8001

## Требования

- Ubuntu 20.04
- docker
- docker-compose v2
- make
- git

## Конфигурация

Для конфигурации контейнеров:
- бекенда [`backend/docker-compose.yml`](./backend/docker-compose.yml)
- фронтенда [`frontend/docker-compose.yml`](./frontend/docker-compose.yml)

## Установка

```shell
git clone https://github.com/it-animals/moscow-depersonalization-data.git
```

```shell
cd moscow-depersonalization-data/frontend
```

```shell
cp .env.example .env
```

```shell
cd ..
```

```shell
make init
```

<i>После успешной установки проекта, проект будет доступен по адресу:</i>

http://localhost:8001

## Команды

Первая инициализация проекта
```shell
make init
```

Рестарт контейнеров
```shell
make restart
```

Запуск контейнеров
```shell
make up
```

Выключение контейнеров
```shell
make down
```

Выключение контейнеров и удаление данных
```shell
make down-clear
```

Статус контейнеров
```shell
make status
```

Запуск слушателя новых заданий на конвертацию
```shell
make queue
```