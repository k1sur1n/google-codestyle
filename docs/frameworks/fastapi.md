# FastAPI - профиль Google

> Данные актуальны на 2026-10-09.

Google не публикует правил для FastAPI: публичных данных не найдено. Python-код FastAPI-сервиса подчиняется общим правилам профиля ([python.md](../languages/python.md)); примеры из документации FastAPI расходятся с ними в двух местах - относительные импорты и импорт отдельных имён, - и там профиль берёт вариант Google. Правила о самом фреймворке взяты из источников «не Google»: официальной документации FastAPI, проверок `FAST` линтера ruff, официального шаблона проекта и одного стороннего сборника практик. Ниже 13 таких правил; официальной страницы «FastAPI style guide» не существует, поэтому почти все они рекомендации (SHOULD).

## Что публикует Google

- **В google/styleguide FastAPI не упоминается.** Слова FastAPI и Flask не встречаются ни в Google Python Style Guide, ни в остальных файлах репозитория (поиск по клону [google/styleguide](https://github.com/google/styleguide), HEAD от 2026-10-07).
- **Правил для веб-сервисов на Python вне примеров Google Cloud нет.** [AUTHORING_GUIDE.md](https://github.com/GoogleCloudPlatform/python-docs-samples/blob/main/AUTHORING_GUIDE.md) репозитория python-docs-samples описывает оформление примеров (PEP 8 и Google Python Style Guide, flake8, Black, pytest) и об архитектуре сервисов не говорит.

Вывод: публичных данных не найдено.

## Какие правила Google Python действуют в FastAPI-проекте

Действуют все правила [python.md](../languages/python.md). FastAPI построен на аннотациях типов, поэтому с требованиями гайда Google к типам (G-PY-042…047) и докстрингам (G-PY-027…032) он сочетается без трения. Расхождения - в четырёх местах.

| Тема | Гайд Google | Документация и практика FastAPI | Профиль берёт |
|---|---|---|---|
| Относительные импорты | запрещены (G-PY-018) | примеры используют `from .routers import items` и `from ..dependencies import …`; там же показан равноценный абсолютный вариант `from app.routers import items` | абсолютные |
| Что импортировать | только модули (G-PY-017) | примеры пишут `from fastapi import Depends, FastAPI` | модуль: `import fastapi` и обращение `fastapi.FastAPI()`, `fastapi.Depends(...)` |
| Вызов в значении по умолчанию | вычисляемые значения по умолчанию запрещены (G-PY-051, `ruff B008`) | `Depends()` и `Query()` в значениях по умолчанию - старая идиома; сам FastAPI отключает у себя `B008` | форма с `Annotated` (G-FAPI-006): вызова в значении по умолчанию нет, конфликт исчезает |
| Длина строки | 80 (G-PY-002) | FastAPI и его шаблон проекта отключают `E501`, формат задаёт `ruff format` | 80 |

Причина выбора та же, что и для остального Python-кода: профиль описывает стиль Google, и единые правила во всём репозитории важнее совпадения с учебником фреймворка. Интерпретация: это решение профиля; Google о FastAPI не высказывался.

Строка «Что импортировать» - самое заметное отличие от учебника FastAPI. Команда, которой оно мешает, может записать в CONTRIBUTING исключение для имён фреймворка; это будет отступление от гайда Google, а не его толкование.

Источники строк: [Bigger Applications](https://fastapi.tiangolo.com/tutorial/bigger-applications/#how-relative-imports-work) (документация FastAPI 0.143.0), [pyproject.toml FastAPI](https://github.com/fastapi/fastapi/blob/master/pyproject.toml).

## Правила для FastAPI («не Google»)

Источники и их вес:

- **[Документация FastAPI](https://fastapi.tiangolo.com/)** - версия 0.143.0 от 2026-10-08, лицензия MIT. Это учебник, а не стайлгайд: правила ниже собраны из его рекомендаций. В строке «Источник» она обозначена как «официальный гайд · не Google» - официальная документация самого проекта FastAPI.
- **[Правила `FAST` в ruff](https://docs.astral.sh/ruff/rules/#fastapi-fast)** - три стабильные проверки; проверены запуском на ruff 0.16.8. Тип: конфиг или инструмент, не Google.
- **[full-stack-fastapi-template](https://github.com/fastapi/full-stack-fastapi-template)** - официальный шаблон проекта от организации fastapi, MIT. Тип: практика, выведенная из репозиториев, не Google.
- **[zhanymkanov/fastapi-best-practices](https://github.com/zhanymkanov/fastapi-best-practices)** - сборник практик частного автора, последний коммит 2026-05-03, файла лицензии нет. Тип: сторонний источник, не Google.

### G-FAPI-001 · SHOULD · В FastAPI-проекте действуют все правила G-PY; относительные импорты и импорт отдельных имён из примеров документации заменяются импортом модулей по полному пути
- Проверка: те же инструменты, что для остального Python-кода; относительные импорты - `ruff TID252`; импорт отдельных имён - ручное ревью.
- Источник: [Google Python Style Guide, §2.2 Imports](https://google.github.io/styleguide/pyguide.html#s2.2-imports) (редакция 2026-09-10) · официальный гайд · высокая; [FastAPI: Bigger Applications](https://fastapi.tiangolo.com/tutorial/bigger-applications/#how-relative-imports-work) (0.143.0) · официальный гайд · высокая · не Google · реконструкция. Уровень SHOULD: это решение профиля, гайд Google о FastAPI молчит.
- Пример:

  ```python
  # плохо (хотя так написано в учебнике FastAPI)
  from fastapi import Depends, FastAPI

  from .routers import items

  # хорошо
  import fastapi

  from app.routers import items

  app = fastapi.FastAPI()
  app.include_router(items.router)
  ```

### G-FAPI-002 · SHOULD · Функция маршрута объявляется как `async def`, если она вызывает библиотеки через `await` или вовсе не ждёт внешних систем; если библиотека блокирующая и `await` не поддерживает - обычный `def`; если неясно - тоже `def`
- Проверка: ручное ревью.
- Источник: [FastAPI: Concurrency and async / await, In a hurry?](https://fastapi.tiangolo.com/async/#in-a-hurry) (0.143.0) · официальный гайд · высокая · не Google.

Маршрут, объявленный обычным `def`, FastAPI выполняет во внешнем пуле потоков, поэтому блокирующий вызов в нём не останавливает сервер ([Path operation functions](https://fastapi.tiangolo.com/async/#path-operation-functions)). К блокирующим документация относит большинство библиотек для баз данных.

### G-FAPI-003 · SHOULD · В `async`-маршруте блокирующий код не вызывается напрямую: синхронный SDK выносится в пул потоков
- Проверка: ручное ревью.
- Источник: [zhanymkanov/fastapi-best-practices](https://github.com/zhanymkanov/fastapi-best-practices#contents) (2026-05-03) · сторонний источник · средняя · не Google.

### G-FAPI-004 · SHOULD · Приложение больше одного файла оформляется пакетом `app/` с `main.py`, `dependencies.py` и подпакетами `routers/` и `internal/`; в каждом каталоге лежит `__init__.py`
- Проверка: ручное ревью.
- Источник: [FastAPI: Bigger Applications, An example file structure](https://fastapi.tiangolo.com/tutorial/bigger-applications/#an-example-file-structure) (0.143.0) · официальный гайд · высокая · не Google.

Источники расходятся в том, как резать приложение, когда оно растёт:

- **Документация FastAPI:** по техническим слоям - `routers/`, `dependencies.py`, `internal/`.
- **Официальный шаблон:** `backend/app/{api,core,models.py,crud.py,main.py}`, маршруты в `api/routes/`, зависимости в `api/deps.py`.
- **fastapi-best-practices:** по доменам - `src/<домен>/{router,schemas,models,service,dependencies,config}.py`.

Рекомендация профиля: начинать со структуры из документации; когда доменов становится несколько и у каждого свои модели и зависимости, переходить к делению по доменам. Интерпретация: первый вариант описан в официальном источнике и достаточен для небольшого сервиса, второй лучше удерживает связанные файлы рядом; публичных данных о выборе Google нет.

### G-FAPI-005 · SHOULD · Маршруты группируются в `APIRouter` по модулям и подключаются к приложению через `include_router` с `prefix`, `tags` и общими `dependencies`
- Проверка: ручное ревью.
- Источник: [FastAPI: Bigger Applications, APIRouter](https://fastapi.tiangolo.com/tutorial/bigger-applications/#apirouter) (0.143.0) · официальный гайд · высокая · не Google.

### G-FAPI-006 · SHOULD · Параметры запроса и зависимости объявляются через `Annotated`, а не через значение по умолчанию
- Проверка: `ruff FAST002`.
- Источник: [FastAPI: Query Parameters and String Validations](https://fastapi.tiangolo.com/tutorial/query-params-str-validations/) (0.143.0) · официальный гайд · высокая · не Google; [ruff, правила FastAPI](https://docs.astral.sh/ruff/rules/#fastapi-fast) (ruff 0.16.8) · конфиг или инструмент · высокая · не Google.
- Пример:

  ```python
  # плохо: вызов в значении по умолчанию (ещё и нарушает G-PY-051)
  @router.get('/{item_id}')
  def read_item(item_id: str, db: Storage = fastapi.Depends(get_db)) -> Item:
      ...


  # хорошо
  @router.get('/{item_id}')
  def read_item(
      item_id: str,
      db: Annotated[Storage, fastapi.Depends(get_db)],
  ) -> Item:
      ...
  ```

### G-FAPI-007 · SHOULD · Тип ответа задаётся аннотацией возвращаемого значения; параметр `response_model` нужен, только когда функция возвращает не тот тип, который объявлен в API
- Проверка: частично: `ruff FAST001` находит лишний `response_model`; остальное - ручное ревью.
- Источник: [FastAPI: Response Model, response_model or Return Type](https://fastapi.tiangolo.com/tutorial/response-model/#response-model-or-return-type) (0.143.0) · официальный гайд · средняя · не Google.

### G-FAPI-008 · MUST · Для входных и выходных данных заводятся отдельные модели; пароль не хранится открытым текстом и не возвращается в ответе
- Проверка: ручное ревью.
- Источник: [FastAPI: Response Model, Add an output model](https://fastapi.tiangolo.com/tutorial/response-model/#add-an-output-model) (0.143.0) · официальный гайд · высокая · не Google. Уровень MUST: документация формулирует запрет словом `never`.

### G-FAPI-009 · SHOULD · Код запуска и остановки приложения размещается в обработчике `lifespan`; декоратор `@app.on_event` в новом коде не используется
- Проверка: ручное ревью.
- Источник: [FastAPI: Lifespan Events](https://fastapi.tiangolo.com/advanced/events/#lifespan) (0.143.0) · официальный гайд · высокая · не Google.

Документация называет `lifespan` рекомендуемым способом, а события `startup` и `shutdown` - устаревшей альтернативой.

### G-FAPI-010 · SHOULD · Настройки приложения описываются классом-наследником `BaseSettings` из пакета `pydantic-settings`
- Проверка: ручное ревью.
- Источник: [FastAPI: Settings and Environment Variables, Pydantic Settings](https://fastapi.tiangolo.com/advanced/settings/#pydantic-settings) (0.143.0) · официальный гайд · высокая · не Google.

### G-FAPI-011 · SHOULD · Объект настроек отдаётся маршрутам как зависимость и создаётся один раз - функцией с `@lru_cache`
- Проверка: ручное ревью.
- Источник: [FastAPI: Settings and Environment Variables, Creating the Settings only once with lru_cache](https://fastapi.tiangolo.com/advanced/settings/#creating-the-settings-only-once-with-lru-cache) (0.143.0) · официальный гайд · высокая · не Google.
- Пример:

  ```python
  # хорошо
  @functools.lru_cache
  def get_settings() -> config.Settings:
      """Returns the process-wide settings object."""
      return config.Settings()


  @router.get('/info')
  def read_info(
      settings: Annotated[config.Settings, fastapi.Depends(get_settings)],
  ) -> Info:
      ...
  ```

Настройки не читаются при импорте модуля (это требование G-PY-024), а в тестах зависимость легко подменить.

### G-FAPI-012 · MUST · Каждый параметр пути из шаблона маршрута присутствует в сигнатуре функции
- Проверка: `ruff FAST003`.
- Источник: [ruff, правила FastAPI](https://docs.astral.sh/ruff/rules/#fastapi-fast) (ruff 0.16.8; правило стабильно с 0.10.0) · конфиг или инструмент · высокая · не Google. Уровень MUST: пропущенный параметр - ошибка в логике, и линтер останавливает на ней сборку.

### G-FAPI-013 · SHOULD · Маршруты тестируются через `TestClient` в тестах на pytest
- Проверка: ручное ревью.
- Источник: [FastAPI: Testing](https://fastapi.tiangolo.com/tutorial/testing/) (0.143.0) · официальный гайд · средняя · не Google.

Для асинхронных тестов в документации есть отдельная страница - [Async Tests](https://fastapi.tiangolo.com/advanced/async-tests/). Имена тестовых файлов и методов - по правилам G-PY-061 и G-PY-062.

## Настройки инструментов

Добавление к [`configs/python/pyproject.toml`](../../configs/python/pyproject.toml) профиля для FastAPI-проекта - одна строка, «не Google»:

```toml
[tool.ruff.lint]
# В существующий список select добавьте "FAST":
#   FAST001 - лишний response_model;
#   FAST002 - зависимость без Annotated;
#   FAST003 - параметр пути отсутствует в сигнатуре.
```

Проверено запуском на ruff 0.16.8: на учебном маршруте срабатывают все три правила, а на форме с `Annotated` и `fastapi.Depends` замечаний нет.

Если в проекте остаётся старый код с `Depends()` в значениях по умолчанию, правило `B008` из конфига профиля будет на нём срабатывать. Перепишите такой код на `Annotated`. Временная мера - перечислить вызовы фреймворка как неизменяемые (опция проверена на ruff 0.16.8):

```toml
[tool.ruff.lint.flake8-bugbear]
extend-immutable-calls = ["fastapi.Depends", "fastapi.Query"]
```

Версии на 2026-10-09: FastAPI 0.143.0 (Python ≥ 3.10, `starlette>=0.46.0`, `pydantic>=2.9.0`); последние теги pydantic - v2.14.0, pydantic-settings - v2.15.0, starlette - 1.7.0.

Для сравнения - как проверяет код официальный шаблон full-stack-fastapi-template: ruff с набором `E, W, F, I, B, C4, UP, ARG001, T201` и отключёнными `E501` и `B008`, `mypy` в режиме `strict`, Python ≥ 3.14 ([backend/pyproject.toml](https://github.com/fastapi/full-stack-fastapi-template/blob/master/backend/pyproject.toml)). Профиль берёт из шаблона идею связки «ruff + mypy», но оставляет свои настройки: лимит 80 колонок, включённый `B008`, формат докстрингов Google.

## Чего здесь нет

- Правил для работы с базой данных, миграций (Alembic) и фоновых задач: в исследовании разделы документации FastAPI о базах данных и зависимостях с `yield` прочитаны только на уровне оглавления.
- Правил Google для Flask и других веб-фреймворков на Python: публичных данных не найдено.
