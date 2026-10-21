# Django - профиль Google

> Данные актуальны на 2026-10-09.

Google не публикует правил для Django: публичных данных не найдено. Поэтому Python-код Django-проекта подчиняется общим правилам профиля ([python.md](../languages/python.md)), а там, где привычки экосистемы Django расходятся с гайдом Google - длина строки, относительные импорты, группы импортов, импорт отдельных имён, - профиль берёт вариант Google. Всё, что касается самого фреймворка, собрано из источников «не Google»: стиля кода самого Django, правил `DJ` линтера ruff и стороннего гайда HackSoft. Ниже 15 таких правил; все они рекомендации (SHOULD).

## Что публикует Google

- **В google/styleguide Django не упоминается.** В тексте Google Python Style Guide нет слов Django, Flask или FastAPI. Во всём репозитории слово «django» встречается только как CSS-класс подсветки `language-django` в HTML/CSS-гайде и в обслуживающем его скрипте (поиск по клону [google/styleguide](https://github.com/google/styleguide), HEAD от 2026-10-07).
- **Рядом есть только правила для примеров Google Cloud.** [AUTHORING_GUIDE.md](https://github.com/GoogleCloudPlatform/python-docs-samples/blob/main/AUTHORING_GUIDE.md) репозитория python-docs-samples требует, чтобы примеры следовали PEP 8 и Google Python Style Guide; линтер - flake8, форматтер - Black, тесты - pytest. Это гайд по оформлению примеров кода; правил об архитектуре Django-приложений в нём нет.

Вывод: публичных правил Google для Django - стайлгайда, эталонного проекта или конфига - нет. Публичных данных не найдено.

## Какие правила Google Python действуют в Django-проекте

Действуют все правила [python.md](../languages/python.md). Экосистема Django привыкла к другому в пяти местах. В таблице обе версии и выбор профиля.

| Тема | Гайд Google | Стиль Django | Профиль берёт |
|---|---|---|---|
| Длина строки | 80 для кода, комментариев и докстрингов (G-PY-002) | 88 для кода (как у black), 79 для комментариев и докстрингов | 80 |
| Относительные импорты | запрещены (G-PY-018) | одноточечный относительный импорт для своего приложения: `from .foo import Bar` | абсолютные: `from myproject.shop import models` |
| Что импортировать | только модули (G-PY-017) | в документации и коде Django принято `from django.shortcuts import render` | модули: `from django import shortcuts` и вызов `shortcuts.render(...)` |
| Группы импортов | `__future__`, стандартная библиотека, сторонние, свои; сортировка по полному пути (G-PY-022) | шесть групп, отдельно «другие компоненты Django» и «свой компонент»; внутри группы `import x` раньше `from x import y` | порядок Google; Django попадает в группу сторонних пакетов |
| Формат докстринга | секции `Args:`, `Returns:`, `Raises:` (G-PY-027…032) | PEP 257 без формата секций | формат Google - он не противоречит PEP 257 |

Причина одна для всех строк: профиль описывает стиль Google, а не стиль Django, и одинаковые правила во всём Python-коде репозитория важнее совпадения с документацией фреймворка. Интерпретация: это решение профиля; Google о Django не высказывался.

Источники столбца «Стиль Django»: разделы [Python style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#python-style) и [Imports](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#imports) стиля кода Django; импорт `from django.shortcuts import render` и `from .models import Question` - из [учебника Django, часть 3](https://docs.djangoproject.com/en/dev/intro/tutorial03/).

Строка «Что импортировать» - самое заметное отступление от учебников Django. Допустимый выход для команды, которой оно мешает, - записать в CONTRIBUTING исключение для имён фреймворка. Это будет отступление от гайда Google, а не его толкование: гайд делает исключение только для `typing`, `collections.abc` и `typing_extensions`.

Что совпадает без оговорок:

- **Логирование.** Гайд Google требует `%`-шаблон вместо f-строки (G-PY-039); стиль Django запрещает f-строки в сообщениях логов и ошибок, потому что строка может потребовать перевода.
- **Именование.** `snake_case` для функций и переменных, `CapWords` для классов (G-PY-011) - так же в стиле Django.
- **Типы.** Гайд Google рекомендует аннотации (G-PY-042); стиль Django о них молчит, запрета нет. Для проверки нужен пакет `django-stubs` - правило G-DJ-015.

Одно практическое следствие для тестов: правило G-PY-061 кладёт тесты в файлы `<модуль>_test.py`, а `manage.py test` по умолчанию ищет файлы `test*.py` ([документация Django](https://docs.djangoproject.com/en/dev/topics/testing/overview/#running-tests)). Запускайте его с ключом `--pattern="*_test.py"` либо используйте pytest с настройкой `python_files` из конфига профиля.

## Правила для Django («не Google»)

Источники и их вес:

- **[Django coding style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/)** - правила для кода самого фреймворка («для включения в Django»). К прикладным проектам их применяют по аналогии. Страница относится к ветке разработки (6.2 alpha); актуальный релиз по тегам - 6.1.2. Тип: производный гайд проекта, не Google.
- **[Правила `DJ` в ruff](https://docs.astral.sh/ruff/rules/#flake8-django-dj)** - семь стабильных проверок; проверены запуском на ruff 0.16.8. Тип: конфиг или инструмент, не Google.
- **[HackSoft Django Styleguide](https://github.com/HackSoftware/Django-Styleguide)** - гайд компании HackSoft, MIT, последний коммит 2025-09-25. Тип: сторонний источник, не Google.

### G-DJ-001 · SHOULD · В Django-проекте действуют все правила G-PY; где стиль Django расходится с гайдом Google (длина строки, относительные импорты, импорт отдельных имён, группы импортов), берётся вариант Google
- Проверка: те же инструменты, что для остального Python-кода: pyink, isort с `profile = "google"`, pylint, ruff (`TID252` для относительных импортов), mypy.
- Источник: [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html) (редакция 2026-09-10) · официальный гайд · высокая; [Django coding style, Imports](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#imports) (dev, 6.2 alpha) · производный гайд проекта · высокая · не Google · реконструкция. Уровень SHOULD: это решение профиля, гайд Google о Django молчит.
- Пример:

  ```python
  # плохо (хотя так написано в учебниках Django)
  from django.shortcuts import render

  from .models import Order

  # хорошо
  from django import shortcuts

  from myproject.shop import models
  ```

### G-DJ-002 · SHOULD · Первый параметр view-функции называется `request`
- Проверка: ручное ревью.
- Источник: [Django coding style, View style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#view-style) (dev, 6.2 alpha) · производный гайд проекта · высокая · не Google.

### G-DJ-003 · SHOULD · Имена полей модели пишутся строчными буквами через подчёркивание: `first_name`, а не `FirstName` или `firstName`
- Проверка: частично: `ruff N815` находит `mixedCase` в теле класса; остальное - ручное ревью.
- Источник: [Django coding style, Model style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#model-style) (dev, 6.2 alpha) · производный гайд проекта · высокая · не Google.

### G-DJ-004 · SHOULD · Содержимое модели идёт в порядке: поля, менеджеры, `class Meta`, `__str__()` и другие magic-методы, `save()`, `get_absolute_url()`, остальные методы
- Проверка: `ruff DJ012`.
- Источник: [Django coding style, Model style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#model-style) (dev, 6.2 alpha) · производный гайд проекта · высокая · не Google.
- Пример:

  ```python
  # хорошо
  class Order(models.Model):
      """A customer order."""

      created_at = models.DateTimeField(auto_now_add=True)
      comment = models.CharField(max_length=200, blank=True, default='')

      class Meta:
          ordering = ['-created_at']

      def __str__(self) -> str:
          return f'Order {self.pk}'

      def total_cents(self) -> int:
          """Returns the order total in cents."""
          ...
  ```

### G-DJ-005 · SHOULD · Варианты для `choices` задаются константами с именами заглавными буквами в классе модели или перечислением `models.TextChoices`
- Проверка: ручное ревью.
- Источник: [Django coding style, Model style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#model-style) (dev, 6.2 alpha) · производный гайд проекта · высокая · не Google.

### G-DJ-006 · SHOULD · Модуль не читает `django.conf.settings` на верхнем уровне, то есть в момент импорта; значение берётся лениво, внутри функции
- Проверка: ручное ревью.
- Источник: [Django coding style, Use of django.conf.settings](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#use-of-django-conf-settings) (dev, 6.2 alpha) · производный гайд проекта · высокая · не Google.

Правило согласуется с требованием гайда Google не делать работу при импорте модуля (G-PY-024).

### G-DJ-007 · SHOULD · f-строка не используется в строке, которая может потребовать перевода, включая сообщения об ошибках и логов; внутри f-строки - только обращение к переменной или атрибуту, без выражений
- Проверка: частично: для логов - `ruff G004` и `pylint W1203` (правило G-PY-039); остальное - ручное ревью.
- Источник: [Django coding style, Python style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#python-style) (dev, 6.2 alpha) · производный гайд проекта · высокая · не Google.

### G-DJ-008 · SHOULD · В шаблонах внутри `{{ }}` и `{% %}` стоит ровно по одному пробелу; `{% extends %}` - первая строка шаблона, не считая комментария
- Проверка: ручное ревью. Для шаблонов существует сторонний линтер djLint (последний тег v1.46.4); его правила в исследовании не проверялись.
- Источник: [Django coding style, Template style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#template-style) (dev, 6.2 alpha) · производный гайд проекта · высокая · не Google.

### G-DJ-009 · SHOULD · В тестах используются `assertRaisesMessage()` и `assertWarnsMessage()` вместо `assertRaises()` и `assertWarns()`, а булевы значения проверяет `assertIs(…, True)`, а не `assertTrue()`
- Проверка: ручное ревью.
- Источник: [Django coding style, Python style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#python-style) (dev, 6.2 alpha) · производный гайд проекта · высокая · не Google.

Правило относится к тестам на `django.test.TestCase`. В тестах на pytest обычный `assert` допустим и по гайду Google (G-PY-037).

### G-DJ-010 · SHOULD · Строковое поле модели (`CharField`, `TextField`) не объявляется с `null=True`: «пусто» хранится как пустая строка
- Проверка: `ruff DJ001`.
- Источник: [ruff, правила flake8-django](https://docs.astral.sh/ruff/rules/#flake8-django-dj) (ruff 0.16.8) · конфиг или инструмент · высокая · не Google.

### G-DJ-011 · SHOULD · Каждая модель определяет метод `__str__()`
- Проверка: `ruff DJ008`.
- Источник: [ruff, правила flake8-django](https://docs.astral.sh/ruff/rules/#flake8-django-dj) (ruff 0.16.8) · конфиг или инструмент · высокая · не Google.

### G-DJ-012 · SHOULD · `ModelForm` перечисляет поля явно: без `exclude` и без `fields = '__all__'`
- Проверка: `ruff DJ006`, `DJ007`.
- Источник: [ruff, правила flake8-django](https://docs.astral.sh/ruff/rules/#flake8-django-dj) (ruff 0.16.8) · конфиг или инструмент · высокая · не Google.

### G-DJ-013 · SHOULD · Доменная логика не размещается во views, формах и сериализаторах: она живёт в моделях (подход Django) или в функциях-сервисах и селекторах (подход HackSoft); проект выбирает один подход и записывает выбор в документации
- Проверка: ручное ревью.
- Источник: [Django design philosophies, Include all relevant domain logic](https://docs.djangoproject.com/en/dev/misc/design-philosophies/#include-all-relevant-domain-logic) (dev, 6.2 alpha) · официальный гайд · высокая · не Google; [HackSoft Django Styleguide, Overview](https://github.com/HackSoftware/Django-Styleguide#overview) (2025-09-25) · сторонний источник · высокая · не Google · реконструкция.

Источники здесь противоречат друг другу, и оба «не Google»:

- **Django.** Модель должна включать всю относящуюся к объекту доменную логику - это шаблон Active Record.
- **HackSoft.** Логика живёт в сервисах (запись в базу), селекторах (чтение), свойствах модели и методе `clean()`. В `save()` модели, собственных менеджерах, сигналах, views и сериализаторах её быть не должно.

Рекомендация профиля: для командного проекта с API - сервисы и селекторы; для небольшого приложения, где почти вся работа - CRUD, - логика в моделях. Интерпретация: сервис - обычная функция с аннотированной сигнатурой, поэтому его проще покрыть проверкой типов (G-PY-042) и тестом без HTTP-слоя; когда логики мало, отдельный слой только добавляет файлы.

### G-DJ-014 · SHOULD · Сервис - функция в `<приложение>/services.py` с именем `<сущность>_<действие>` (`user_create`), аргументами только по ключу и аннотациями типов
- Проверка: ручное ревью.
- Источник: [HackSoft Django Styleguide, Services](https://github.com/HackSoftware/Django-Styleguide#services) (2025-09-25) · сторонний источник · высокая · не Google.
- Пример:

  ```python
  # хорошо
  def user_create(*, email: str, name: str) -> models.User:
      """Creates a user and sends the welcome message."""
      ...
  ```

Правило действует, только если проект выбрал подход с сервисами (G-DJ-013). Для API тот же гайд советует по одному классу на операцию и отдельные сериализаторы для входа и выхода - см. [раздел APIs & Serializers](https://github.com/HackSoftware/Django-Styleguide#apis--serializers).

### G-DJ-015 · SHOULD · Проверка типов в Django-проекте запускается с пакетом `django-stubs` и его плагином для mypy
- Проверка: `mypy` с `plugins = ["mypy_django_plugin.main"]`.
- Источник: [README django-stubs](https://github.com/typeddjango/django-stubs/blob/master/README.md) (6.1.2) · конфиг или инструмент · высокая · не Google.

Без этого пакета mypy не знает типов моделей, менеджеров и запросов, и правило G-PY-042 в Django-проекте не работает.

## Настройки инструментов

Добавления к [`configs/python/pyproject.toml`](../../configs/python/pyproject.toml) профиля для Django-проекта. Все они «не Google».

```toml
[tool.ruff.lint]
# В существующий список select добавьте "DJ":
#   DJ001, DJ003, DJ006, DJ007, DJ008, DJ012, DJ013
# В существующий список ignore добавьте "D106":
#   вложенный `class Meta` в моделях и формах не требует докстринга

[tool.mypy]
# В существующую секцию добавьте:
plugins = ["mypy_django_plugin.main"]

[tool.django-stubs]
django_settings_module = "myproject.settings"
```

- Строки для ruff проверены запуском на ruff 0.16.8: на учебной модели срабатывают `DJ001`, `DJ008`, `DJ012`, на форме - `DJ007`, на view с `locals()` - `DJ003`; без `D106` в `ignore` ruff требует докстринг у каждого `class Meta`.
- Строки для mypy и django-stubs не запускались: пакет недоступен из среды сборки. Они взяты из README django-stubs 6.1.2 (поддерживает Django 6.1, mypy 1.13-2.4, Python 3.11-3.14).
- Кроме перечисленных в правилах, в наборе `DJ` есть `DJ003` (не передавать `locals()` в `render`) и `DJ013` (`@receiver` - верхний из декораторов).

Сам Django на 2026-10-09 проверяет свой код так: black 26.5.1, isort 8.0.1 с `profile = "black"`, flake8 7.3.0 с `max-line-length = 88` ([.pre-commit-config.yaml](https://github.com/django/django/blob/main/.pre-commit-config.yaml), [pyproject.toml](https://github.com/django/django/blob/main/pyproject.toml)). Профиль эти настройки не перенимает по причинам из таблицы выше.

## Чего здесь нет

- Правил для Django REST Framework, Celery и асинхронных views: источники из исследования их не покрывают или покрывают только сторонним гайдом HackSoft, на который дана ссылка.
- Проверенных настроек djLint и django-upgrade (последний тег 1.33.0): в исследовании установлены только их версии.
