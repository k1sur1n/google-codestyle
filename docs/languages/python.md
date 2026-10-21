# Python - профиль Google

> Данные актуальны на 2026-10-09.

Профиль следует публичному [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html) в редакции от 2026-09-10: 4 пробела, 80 колонок, докстринги с секциями `Args:` / `Returns:` / `Raises:`, импорт только модулей и только по полному пути. Код форматирует pyink (форк Black от Google) и проверяет pylint с `pylintrc` из google/styleguide. Порядок импортов, докстринги и типы закрывают isort, ruff и mypy - все три «не Google»; mypy стоит на месте pytype, который гайд советует до сих пор, хотя этот инструмент в архиве с 2026-09-03. Отступ в 2 пробела, которым набрано большинство открытых Python-репозиториев самого Google, описан как известное расхождение и в профиль не взят. Из 65 правил инструмент целиком проверяет 19, частично - 22, только ревью - 24.

Содержание:

1. [Как читать правила](#как-читать-правила)
2. [Форматирование](#1-форматирование) - G-PY-001…010
3. [Именование](#2-именование) - G-PY-011…016
4. [Структура файлов и модулей, порядок импортов](#3-структура-файлов-и-модулей-порядок-импортов) - G-PY-017…025
5. [Комментарии и docstring](#4-комментарии-и-docstring) - G-PY-026…034
6. [Обработка ошибок, логирование, типизация](#5-обработка-ошибок-логирование-типизация) - G-PY-035…047
7. [Запрещённые и ограниченные возможности языка](#6-запрещённые-и-ограниченные-возможности-языка) - G-PY-048…060
8. [Тесты](#7-тесты) - G-PY-061…065
9. [Версия языка и изменения за 2023-2026 годы](#8-версия-языка-и-изменения-за-2023-2026-годы)
10. [Инструменты: pyink, yapf и Black; pylintrc; проверка типов](#9-инструменты-pyink-yapf-и-black-pylintrc-проверка-типов)
11. [Отличия от PEP 8](#10-отличия-от-pep-8)
12. [Гайд против инструментов и против практики](#11-гайд-против-инструментов-и-против-практики)
13. [Машиночитаемые конфиги](#12-машиночитаемые-конфиги)
14. [Матрица «инструмент / ручное ревью»](#13-матрица-инструмент--ручное-ревью)

## Как читать правила

Источник почти всех правил - один документ: Google Python Style Guide, файл `pyguide.md` в репозитории [google/styleguide](https://github.com/google/styleguide), лицензия CC-BY 3.0. Последнее содержательное изменение - 2026-09-10 (коммит [`3b88229`](https://github.com/google/styleguide/commit/3b88229)); коммит от 2026-10-05 только убрал пробелы в заголовках. Ниже «гайд» означает этот документ, а «редакция 2026-09-10» - его текст на дату среза 2026-10-09. После среза, 2026-10-15, вышла редакция [`aee99aa`](https://github.com/google/styleguide/commit/aee99aa): в основном переформатирование примеров, единственное содержательное изменение - формат `TODO` (см. G-PY-034).

Гайд не размечает правила словами MUST и SHOULD. Уровни в профиле расставлены по формулировкам: `must`, `never`, `always`, `do not` дают MUST; `should`, `prefer`, `avoid`, `encouraged` дают SHOULD. Это интерпретация. Там, где уровень профиля отличается от формулировки гайда, причина названа в строке «Источник».

Правила, которые не изменились с 2023 года, помечены только датой редакции. Если правило появилось или менялось в 2023-2026 годах, дата и коммит указаны рядом.

Коды проверок относятся к версиям из раздела [«Машиночитаемые конфиги»](#12-машиночитаемые-конфиги): pylint 4.1.2 с Google `pylintrc`, ruff 0.16.8, pyink 26.5.1, isort 9.0.2, mypy 2.3.1. Коды ruff и поведение mypy проверены запуском; pylint, pyink и isort в среде сборки не запускались, их коды взяты из документации и исходников. «Вариант B» - набор только на ruff, он описан в том же разделе.

Гайд пересказан не целиком: сюда попали ключевые и неочевидные правила. Всё остальное - в [полном тексте гайда](https://google.github.io/styleguide/pyguide.html).

## 1. Форматирование

Гайд описывает раскладку кода словами, но сам же отсылает к автоформаттеру: «многие команды» Google используют Black или Pyink, чтобы не спорить о форматировании. Профиль закрепляет pyink. Правила ниже описывают результат, который форматтер выдаёт сам, и то немногое, что остаётся человеку.

### G-PY-001 · SHOULD · Код форматирует автоформаттер - pyink (выбор профиля) или Black, - и CI проверяет, что формат не нарушен
- Проверка: `pyink --check --diff .` в CI; hook `pyink` в pre-commit.
- Источник: [Google Python Style Guide, §1 Background](https://google.github.io/styleguide/pyguide.html#s1-background) (редакция 2026-09-10) · официальный гайд · высокая; [README google/pyink](https://github.com/google/pyink/blob/main/README.md) (26.5.1, 2026-08-25) · конфиг или инструмент · высокая. Уровень SHOULD: гайд сообщает о практике команд и форматтер не предписывает.

### G-PY-002 · MUST · Строка не длиннее 80 символов; исключения - длинные импорты, URL, пути и флаги в комментариях, строковые константы модуля без пробелов и комментарии `# pylint: disable=…`
- Проверка: pyink `line-length = 80`; `pylint C0301` (`max-line-length=80`, а `ignore-long-lines` пропускает импорты и строки-URL). `ruff E501` длинные импорты исключением не считает, поэтому включается только в варианте B.
- Источник: [§3.2 Line length](https://google.github.io/styleguide/pyguide.html#s3.2-line-length) (редакция 2026-09-10; 2025-02-24, `ff7ea9c`: первая строка докстринга тоже обязана уложиться в 80) · официальный гайд · высокая.

Гайд прямо разрешает оставить строку длиннее 80 символов, если Black или Pyink не смогли её укоротить.

### G-PY-003 · MUST · Строка не переносится обратным слэшем: вместо него работает неявное соединение внутри круглых, квадратных и фигурных скобок
- Проверка: ручное ревью (форматтеры слэш не убирают).
- Источник: [§3.2 Line length](https://google.github.io/styleguide/pyguide.html#s3.2-line-length) (редакция 2026-09-10) · официальный гайд · высокая.
- Пример:

  ```python
  # плохо
  with open(src_path) as src, \
          open(dst_path, 'w') as dst:
      dst.write(src.read())

  # хорошо
  with (
      open(src_path) as src,
      open(dst_path, 'w') as dst,
  ):
      dst.write(src.read())
  ```

### G-PY-004 · MUST · Блок сдвигается на 4 пробела, табуляция запрещена; перенесённые элементы либо выравниваются по открывающей скобке, либо получают висячий отступ в 4 пробела
- Проверка: pyink `pyink-indentation = 4`; `pylint W0311` (`indent-string='    '`); `ruff W191`.
- Источник: [§3.4 Indentation](https://google.github.io/styleguide/pyguide.html#s3.4-indentation) (редакция 2026-09-10) · официальный гайд · высокая.

Внутри Google и в большинстве его открытых Python-репозиториев отступ - 2 пробела. Это расхождение разобрано в разделе [«Гайд против инструментов и против практики»](#11-гайд-против-инструментов-и-против-практики); профиль берёт 4.

### G-PY-005 · MUST · Пустые строки, пробелы и хвостовые запятые стоят так, как их ставит форматтер: две пустые строки между определениями верхнего уровня, одна между методами, без пробелов внутри скобок и без вертикального выравнивания; хвостовая запятая - только когда закрывающая скобка стоит на своей строке
- Проверка: pyink (или Black) приводит сам; `pylint C0303` и `ruff W291`, `W293` ловят хвостовые пробелы. Правила ruff `E2xx` и `E3xx` в версии 0.16.8 находятся в preview и не используются.
- Источник: [§3.4.1 Trailing commas](https://google.github.io/styleguide/pyguide.html#s3.4.1-trailing-commas), [§3.5 Blank Lines](https://google.github.io/styleguide/pyguide.html#s3.5-blank-lines), [§3.6 Whitespace](https://google.github.io/styleguide/pyguide.html#s3.6-whitespace) (редакция 2026-09-10) · официальный гайд · высокая. Про запятые гайд говорит `recommended`; уровень MUST - потому что профиль проверяет формат в CI.

Хвостовая запятая служит и командой форматтеру: если она стоит после последнего элемента, pyink и Black раскладывают элементы по одному на строку.

### G-PY-006 · MUST · Вокруг `=` у параметра пробелы ставятся, только когда у параметра есть и аннотация типа, и значение по умолчанию
- Проверка: pyink (или Black) исправляет сам; `ruff E251` и `E252` в версии 0.16.8 находятся в preview.
- Источник: [§3.19.4 Default Values](https://google.github.io/styleguide/pyguide.html#s3.19.4-default-values), [§3.6 Whitespace](https://google.github.io/styleguide/pyguide.html#s3.6-whitespace) (редакция 2026-09-10) · официальный гайд · высокая.
- Пример:

  ```python
  # плохо
  def scale(value:float, factor: float=1.0, clip = False): ...

  # хорошо
  def scale(value: float, factor: float = 1.0, clip=False): ...
  ```

### G-PY-007 · MUST · Точка с запятой не ставится ни в конце строки, ни между двумя операторами
- Проверка: `pylint W0301`, `C0321`; `ruff E702`, `E703`.
- Источник: [§3.1 Semicolons](https://google.github.io/styleguide/pyguide.html#s3.1-semicolons) (редакция 2026-09-10) · официальный гайд · высокая.

### G-PY-008 · MUST · Скобки не ставятся в `return` и в условиях, если они не нужны для переноса строки или для записи кортежа
- Проверка: частично: `pylint C0325`; остальное - ручное ревью.
- Источник: [§3.3 Parentheses](https://google.github.io/styleguide/pyguide.html#s3.3-parentheses) (редакция 2026-09-10) · официальный гайд · высокая.

### G-PY-009 · SHOULD · На строке один оператор; форма `if foo: bar(foo)` допустима, только когда нет `else` и весь оператор помещается в строку
- Проверка: частично: `pylint C0321` (в `pylintrc` стоит `single-line-if-stmt=yes`); остальное - ручное ревью. `ruff E701` запрещает и разрешённую гайдом форму, поэтому отключён.
- Источник: [§3.14 Statements](https://google.github.io/styleguide/pyguide.html#s3.14-statements) (редакция 2026-09-10) · официальный гайд · высокая.

### G-PY-010 · MUST · В пределах файла используется один вид кавычек - `'` или `"`; другой вид допустим, только чтобы не экранировать кавычку внутри строки; докстринги всегда пишутся в `"""`
- Проверка: `pylint W1405` (`check-quote-consistency=yes`); pyink `pyink-use-majority-quotes = true`; `ruff D300`; в варианте B - `ruff Q000`-`Q003`.
- Источник: [§3.10 Strings](https://google.github.io/styleguide/pyguide.html#s3.10-strings) (редакция 2026-09-10) · официальный гайд · высокая.

Black всегда приводит строки к двойным кавычкам; pyink с `pyink-use-majority-quotes` оставляет тот вид, которого в файле больше. Гайду соответствуют оба результата.

## 2. Именование

С редакции 2026-09-10 раздел об именах начинается с прямой отсылки: в общем случае следовать соглашениям PEP 8. Таблица ниже - выжимка из §3.16.4 гайда.

| Что | Публичное имя | Внутреннее имя |
|---|---|---|
| Пакет, модуль, файл | `lower_with_under` | `_lower_with_under` (модуль) |
| Класс, исключение, псевдоним типа | `CapWords` | `_CapWords` |
| Функция, метод | `lower_with_under()` | `_lower_with_under()` |
| Константа модуля или класса | `CAPS_WITH_UNDER` | `_CAPS_WITH_UNDER` |
| Переменная модуля, класса, экземпляра | `lower_with_under` | `_lower_with_under` |
| Параметр, локальная переменная | `lower_with_under` | - |

### G-PY-011 · SHOULD · Имена следуют PEP 8: `module_name`, `ClassName`, `function_name`, `GLOBAL_CONSTANT_NAME`, `local_var_name`; акроним внутри `CapWords` пишется заглавными целиком (`HTTPServerError`)
- Проверка: частично: `pylint C0103` с регулярными выражениями из `pylintrc`; `ruff N801`-`N806`, `N815`, `N816`; акронимы и осмысленность имён - ручное ревью.
- Источник: [§3.16.2 Naming Conventions](https://google.github.io/styleguide/pyguide.html#s3.16.2-naming-conventions), [§3.16.4](https://google.github.io/styleguide/pyguide.html#s3.16.4-guidelines-derived-from-guidos-recommendations) (редакция 2026-09-10, `3b88229`: добавлены ссылка на PEP 8, правило об акронимах и исключение для кода, тесно связанного с другой кодовой базой, например через FFI к C++) · официальный гайд · высокая.

`function-rgx` и `method-rgx` в Google `pylintrc` пропускают и `snake_case`, и `CamelCase`. Для нового кода `snake_case` у функций обеспечивает `ruff N802`.

### G-PY-012 · MUST · Константа уровня модуля или класса пишется заглавными буквами с подчёркиваниями: `MAX_RETRIES`, для внутренней - `_MAX_RETRIES`
- Проверка: частично: `pylint C0103` (но `const-rgx` в `pylintrc` пропускает и нижний регистр); остальное - ручное ревью.
- Источник: [§2.5 Mutable Global State](https://google.github.io/styleguide/pyguide.html#s2.5-global-variables) (редакция 2026-09-10) · официальный гайд · высокая.

### G-PY-013 · MUST · Файл с кодом имеет расширение `.py` и имя без дефисов, в `lower_with_under`
- Проверка: `pylint C0103` (`module-rgx`); `ruff N999`.
- Источник: [§3.16.3 File Naming](https://google.github.io/styleguide/pyguide.html#s3.16.3-file-naming) (редакция 2026-09-10) · официальный гайд · высокая.

Каталоги-пакеты именуются так же. Исполняемый файл без расширения гайд предлагает делать символической ссылкой или обёрткой на shell.

### G-PY-014 · SHOULD · Внутреннее имя модуля или класса начинается с одного подчёркивания; двойное подчёркивание (`__name`) не используется
- Проверка: частично: `pylint W0212` ловит обращение к защищённому члену извне; остальное - ручное ревью.
- Источник: [§3.16.2 Naming Conventions](https://google.github.io/styleguide/pyguide.html#s3.16.2-naming-conventions) (редакция 2026-09-10) · официальный гайд · высокая.

Юнит-тестам гайд разрешает обращаться к защищённым константам тестируемого модуля.

### G-PY-015 · SHOULD · Односимвольные имена допустимы только для счётчиков и итераторов (`i`, `j`, `k`, `v`), исключения (`e`), файла в `with` (`f`), приватных `_T` и `_P` и обозначений из цитируемой статьи; тип в имя не включается (`id_to_name_dict`)
- Проверка: ручное ревью.
- Источник: [§3.16.1 Names to Avoid](https://google.github.io/styleguide/pyguide.html#s3.16.1-names-to-avoid) (редакция 2026-09-10; 2025-02-24, `ff7ea9c`: требования к математической нотации - сослаться на источник, дать описательные имена публичному API, узко отключить `invalid-name`) · официальный гайд · высокая.

### G-PY-016 · MUST · `TypeVar` и `ParamSpec` получают описательное имя; короткое имя (`_T`, `_P`) разрешено только приватной переменной без ограничений
- Проверка: ручное ревью (`pylint C0105` и `C0132` проверяют другое).
- Источник: [§3.19.10 Type variables](https://google.github.io/styleguide/pyguide.html#s3.19.10-typevars) (редакция 2026-09-10) · официальный гайд · высокая.
- Пример:

  ```python
  # плохо
  T = TypeVar("T")                     # видна снаружи, а имя ничего не говорит
  _T = TypeVar("_T", int, float, str)  # есть ограничения - нужно описательное имя

  # хорошо
  _T = TypeVar("_T")
  AddableType = TypeVar("AddableType", int, float, str)
  ```

## 3. Структура файлов и модулей, порядок импортов

Порядок частей файла по гайду: строка `#!` (только у главного исполняемого файла программы - `#!/usr/bin/env python3`, [§3.7](https://google.github.io/styleguide/pyguide.html#s3.7-shebang-line)), лицензионный заголовок, докстринг модуля, импорты, константы и глобальные переменные, классы и функции, блок `if __name__ == '__main__':`.

Правила импорта - самое заметное отличие от привычного Python. Идея одна: по записи `x.Obj` читатель должен видеть, что `Obj` определён в модуле `x`.

### G-PY-017 · MUST · `import` применяется только к пакетам и модулям, но не к отдельным классам, функциям и типам; исключение - символы из `typing`, `collections.abc` и `typing_extensions`, которые импортируются поимённо
- Проверка: ручное ревью. Публичной проверки нет: гайд упоминает внутренние проверки pylint с префиксом `g-`, но они не опубликованы.
- Источник: [§2.2 Imports](https://google.github.io/styleguide/pyguide.html#s2.2-imports), [§3.19.12 Imports For Typing](https://google.github.io/styleguide/pyguide.html#s3.19.12-imports-for-typing) (редакция 2026-09-10, `3b88229`: из исключений убран `six.moves`; 2023-11-21, `4d9a478`: уточнено «не отдельные типы, классы или функции») · официальный гайд · высокая.
- Пример:

  ```python
  # плохо
  from myproject.storage.cache import LruCache

  # хорошо
  from myproject.storage import cache

  entries = cache.LruCache(max_size=128)

  # хорошо: исключение для typing и collections.abc
  from collections.abc import Mapping, Sequence
  from typing import Any
  ```

### G-PY-018 · MUST · Относительные импорты запрещены: модуль импортируется по полному пути пакета, даже если лежит в том же каталоге
- Проверка: `ruff TID252` с `ban-relative-imports = "all"`; в pylint 4 прямой проверки нет.
- Источник: [§2.2.4 Decision](https://google.github.io/styleguide/pyguide.html#s2.2.4-decision), [§2.3 Packages](https://google.github.io/styleguide/pyguide.html#s2.3-packages) (редакция 2026-09-10) · официальный гайд · высокая.
- Пример:

  ```python
  # плохо
  from . import cache
  from ..storage import cache

  # хорошо
  from myproject.storage import cache
  ```

### G-PY-019 · MUST · Псевдоним `from x import y as z` допустим, только если имя `y` конфликтует с другим именем, слишком длинно или слишком общо; `import y as z` - только для общепринятых сокращений (`import numpy as np`)
- Проверка: ручное ревью. `ruff ICN001` знает общепринятые сокращения, но требует их и там, где гайд псевдонима не требует, поэтому в конфиг не включён.
- Источник: [§2.2.4 Decision](https://google.github.io/styleguide/pyguide.html#s2.2.4-decision) (редакция 2026-09-10) · официальный гайд · высокая.

### G-PY-020 · MUST · Импорты стоят вверху файла: после докстринга модуля и до глобальных переменных и констант
- Проверка: `pylint C0413`; `ruff E402`, `PLC0415`.
- Источник: [§3.13 Imports formatting](https://google.github.io/styleguide/pyguide.html#s3.13-imports-formatting) (редакция 2026-09-10) · официальный гайд · высокая.

### G-PY-021 · SHOULD · Каждый импорт занимает свою строку; несколько имён в одной строке допустимы только для `typing` и `collections.abc`
- Проверка: isort `profile = "google"` (`force_single_line`); `pylint C0410`; `ruff E401`.
- Источник: [§3.13 Imports formatting](https://google.github.io/styleguide/pyguide.html#s3.13-imports-formatting) (редакция 2026-09-10) · официальный гайд · высокая.

### G-PY-022 · SHOULD · Импорты идут группами: `__future__`, стандартная библиотека, сторонние пакеты, пакеты своего репозитория; внутри группы строки сортируются лексикографически без учёта регистра по полному пути модуля
- Проверка: isort `profile = "google"`; в варианте B - `ruff I001` с настройками из конфига. В Google `pylintrc` проверка `wrong-import-order` отключена.
- Источник: [§3.13 Imports formatting](https://google.github.io/styleguide/pyguide.html#s3.13-imports-formatting) (редакция 2026-09-10) · официальный гайд · высокая; [профиль `google` в isort](https://github.com/PyCQA/isort/blob/main/isort/profiles.py) (9.0.2) · конфиг или инструмент · высокая · не Google.
- Пример:

  ```python
  # хорошо: строки `import x` и `from x import y` сортируются вместе,
  # по пути модуля, а не по виду оператора
  from __future__ import annotations

  import collections
  from collections.abc import Sequence
  import logging
  import sys

  from absl import app
  from absl import flags
  import numpy as np

  from myproject.backend import storage
  from myproject.backend.api import handlers
  ```

Пятая группа - импорты из собственного подпакета отдельно от остальных - помечена в гайде как устаревшая. Пустая строка между группами не обязательна.

### G-PY-023 · SHOULD · Импорт под `if TYPE_CHECKING:` используется только в исключительных случаях, когда модуль нельзя импортировать во время работы программы
- Проверка: ручное ревью. Правила `ruff TC001`-`TC003` требуют обратного - переносить импорты под `TYPE_CHECKING` - и в профиль не включаются.
- Источник: [§3.19.13 Conditional Imports](https://google.github.io/styleguide/pyguide.html#s3.19.13-conditional-imports) (редакция 2026-09-10) · официальный гайд · высокая.

### G-PY-024 · MUST · Исполняемый файл держит логику в функции `main()` и вызывает её под `if __name__ == '__main__':`; при импорте модуль не выполняет тяжёлой работы
- Проверка: ручное ревью.
- Источник: [§3.17 Main](https://google.github.io/styleguide/pyguide.html#s3.17-main) (редакция 2026-09-10) · официальный гайд · высокая.
- Пример:

  ```python
  # хорошо (с abseil-py; без него - просто main())
  from collections.abc import Sequence

  from absl import app


  def main(argv: Sequence[str]) -> None:
      ...


  if __name__ == '__main__':
      app.run(main)
  ```

Причина в том, что модуль должен импортироваться без побочных эффектов: его импортируют тесты и `pydoc`.

### G-PY-025 · SHOULD · Функция коротка и решает одну задачу; около 40 строк - повод подумать о разбиении, жёсткого предела нет
- Проверка: ручное ревью. В Google `pylintrc` вся категория `R`, включая `too-many-statements`, отключена.
- Источник: [§3.18 Function length](https://google.github.io/styleguide/pyguide.html#s3.18-function-length) (редакция 2026-09-10) · официальный гайд · высокая.

## 4. Комментарии и docstring

Формат докстринга - то, что обычно и называют «Google style»: первая строка-резюме, пустая строка, описание, затем секции с двоеточием на конце. Гайд описывает его в [§3.8](https://google.github.io/styleguide/pyguide.html#s3.8-comments-and-docstrings). Образец с точными требованиями:

```python
def fetch_rows(
    table: Table,
    keys: Sequence[str],
    require_all_keys: bool = False,
) -> Mapping[str, tuple[str, ...]]:
    """Fetches rows from a table.

    Retrieves rows pertaining to the given keys. Describes what the caller
    gets, not how the function works inside.

    Args:
        table: An open table instance.
        keys: Keys of the rows to fetch. A long description continues
            with a hanging indent.
        require_all_keys: If True, only rows with values set for all keys
            are returned.

    Returns:
        A dict mapping keys to the corresponding row data. Each row is
        a tuple of strings.

    Raises:
        IOError: An error occurred accessing the table.
    """
```

- Заголовок секции заканчивается двоеточием. Порядок секций: `Args:`, `Returns:` (у генератора - `Yields:`), `Raises:`.
- Параметр записывается как `имя: описание`. Продолжение описания получает висячий отступ на 2 или 4 пробела больше имени - одинаково во всём файле.
- Тип в описании нужен, только если у параметра нет аннотации. `*args` и `**kwargs` перечисляются как `*foo` и `**bar`.
- Первая фраза - в изъявительном («Fetches rows…») или повелительном («Fetch rows…») стиле, одинаково во всём файле. У `@property` докстринг пишется как у атрибута: «The table path.», а не «Returns the table path.».
- У класса публичные атрибуты описываются в секции `Attributes:` в том же формате, что и `Args:`. В примере гайда `__init__` несёт собственный докстринг с `Args:`.
- Докстринг модуля: строка-резюме с точкой, пустая строка, описание и, по желанию, пример использования.

### G-PY-026 · SHOULD · Файл открывается лицензионным заголовком и докстрингом модуля, который описывает содержимое и способ использования
- Проверка: частично: `pylint C0114`, `ruff D100` проверяют наличие докстринга модуля; лицензионный заголовок проверяет `addlicense -check` (см. [repository.md](../git/repository.md)); содержание - ручное ревью.
- Источник: [§3.8.2 Modules](https://google.github.io/styleguide/pyguide.html#s3.8.2-comments-in-modules) (редакция 2026-09-10) · официальный гайд · высокая.

### G-PY-027 · MUST · Докстринг пишется в `"""`; его первая строка - резюме не длиннее 80 символов, которое заканчивается точкой, вопросительным или восклицательным знаком; если текст продолжается, за ней идёт пустая строка
- Проверка: `ruff D300`, `D205`, `D212`, `D415` при `convention = "google"`.
- Источник: [§3.8.1 Docstrings](https://google.github.io/styleguide/pyguide.html#s3.8.1-comments-in-doc-strings) (редакция 2026-09-10; 2025-02-24, `ff7ea9c`: лимит 80 для строки-резюме) · официальный гайд · высокая.

### G-PY-028 · MUST · Докстринг обязателен для функции, которая входит в публичный API, нетривиальна по размеру или содержит неочевидную логику; параметры, результат и исключения описываются в секциях `Args:`, `Returns:` (или `Yields:`) и `Raises:`
- Проверка: частично: `ruff D102`, `D103`, `D107`, `D417` и правила оформления секций `D410`-`D412`, `D414`, `D416` при `convention = "google"`; «нетривиальность» и полнота описания - ручное ревью. В Google `pylintrc` проверка `missing-function-docstring` отключена. Конфиг профиля с набором `D` строже формулировки правила: он требует докстринг и у `__init__` (`D107`), и у пакета `__init__.py` (`D104`); если это лишнее - добавьте коды в `ignore`.
- Источник: [§3.8.3 Functions and Methods](https://google.github.io/styleguide/pyguide.html#s3.8.3-functions-and-methods) (редакция 2026-09-10) · официальный гайд · высокая.

Секции можно опустить, если имя и сигнатура функции говорят достаточно и хватает однострочного докстринга.

### G-PY-029 · SHOULD · Секции докстринга описывают контракт: `Returns:` опускается, если функция возвращает `None` или первая фраза уже описывает результат; кортеж описывается как один кортеж, а не как несколько значений; исключения за нарушение контракта в `Raises:` не перечисляются
- Проверка: ручное ревью.
- Источник: [§3.8.3 Functions and Methods](https://google.github.io/styleguide/pyguide.html#s3.8.3-functions-and-methods) (редакция 2026-09-10; 2024-01-23, `19f3149`: уточнены условия для `Returns:` и смысл `Yields:`) · официальный гайд · высокая.
- Пример:

  ```python
  # плохо: кортеж описан в стиле NumPy, как два отдельных результата
  """
  Returns:
      mean: The mean of the sample.
      std: The standard deviation of the sample.
  """

  # хорошо
  """
  Returns:
      A tuple (mean, std), where mean is the sample mean and std is
      the sample standard deviation.
  """
  ```

`Yields:` описывает объект, который возвращает `next()`, а не сам генератор.

### G-PY-030 · MUST · Переопределённый метод может остаться без докстринга, только если он помечен `@override`; без декоратора, а также когда метод уточняет контракт базового, докстринг обязателен
- Проверка: `ruff D102` (проверено на 0.16.8: метод с `@override` не помечается, без него - помечается).
- Источник: [§3.8.3.1 Overridden Methods](https://google.github.io/styleguide/pyguide.html#s3.8.3.1-overridden-methods) (раздел появился 2023-11-21, `4d9a478`; 2026-09-10, `3b88229`: импорт `from typing import override`) · официальный гайд · высокая.
- Пример:

  ```python
  from typing import override


  # плохо: нет ни @override, ни докстринга
  class CsvExporter(Exporter):
      def export(self, rows):
          ...


  # хорошо
  class JsonExporter(Exporter):
      @override
      def export(self, rows):
          ...
  ```

### G-PY-031 · SHOULD · Докстринг класса начинается с фразы о том, что представляет экземпляр; публичные атрибуты, кроме свойств, перечисляются в секции `Attributes:`
- Проверка: частично: `pylint C0115`, `ruff D101` проверяют наличие; содержание - ручное ревью.
- Источник: [§3.8.4 Classes](https://google.github.io/styleguide/pyguide.html#s3.8.4-comments-in-classes) (редакция 2026-09-10; 2024-02-12, `8ee3431`: свойства исключены из `Attributes:`) · официальный гайд · высокая.
- Пример:

  ```python
  # плохо
  class QuotaExceededError(Exception):
      """Raised when the user runs out of quota."""  # «когда», а не «что»


  class RetryPolicy:
      """Class that describes a retry policy."""     # повторяет слово class


  # хорошо
  class QuotaExceededError(Exception):
      """The user has no quota left."""


  class RetryPolicy:
      """A schedule of delays between repeated attempts."""
  ```

### G-PY-032 · MUST · Докстринг декорированной функции или класса описывает поведение после применения декоратора - то, что увидит вызывающий код
- Проверка: ручное ревью.
- Источник: [§3.8.3 Functions and Methods](https://google.github.io/styleguide/pyguide.html#s3.8.3-functions-and-methods), [§3.8.4 Classes](https://google.github.io/styleguide/pyguide.html#s3.8.4-comments-in-classes) (правило добавлено 2026-09-10, `3b88229`) · официальный гайд · высокая.
- Пример:

  ```python
  # хорошо: функция с yield, но вызывающий получает контекст-менеджер
  @contextlib.contextmanager
  def temporary_workdir(prefix: str) -> Iterator[pathlib.Path]:
      """Creates a working directory that is removed on exit.

      Args:
          prefix: A prefix for the directory name.

      Returns:
          A context manager that yields the path of the new directory.
      """
  ```

### G-PY-033 · MUST · Комментарий объясняет, почему код написан так, и не пересказывает сам код; комментарий в конце строки отделяется от кода как минимум двумя пробелами
- Проверка: частично: pyink ставит два пробела перед `#`; содержание - ручное ревью.
- Источник: [§3.8.5 Block and Inline Comments](https://google.github.io/styleguide/pyguide.html#s3.8.5-block-and-inline-comments) (редакция 2026-09-10) · официальный гайд · высокая.

### G-PY-034 · MUST · `TODO` оформляется как `# TODO: <ссылка на контекст, лучше на баг> - <пояснение>`; имя человека или команды контекстом не служит
- Проверка: частично: `ruff TD004`, `TD005`, `TD007` проверяют двоеточие, описание и пробел; наличие ссылки - ручное ревью. `ruff TD002` (требует автора) и `TD003` (не принимает ссылку без `https://`) не включены; в Google `pylintrc` проверка `fixme` отключена.
- Источник: [§3.12 TODO Comments](https://google.github.io/styleguide/pyguide.html#s3.12-todo-comments) (формат введён 2023-09-08, `105acb7`) · официальный гайд · высокая. Обновление после даты среза: редакция гайда от 2026-10-15 (коммит [`aee99aa`](https://github.com/google/styleguide/commit/aee99aa)) вернула скобочную форму `# TODO(crbug.com/192795): Investigate cpufreq optimizations.`, а форму с дефисом объявила старым стилем - то есть Python-гайд снова совпадает с C++-гайдом (G-CPP-032); при следующей ревизии профиля правило следует перевести на скобочную форму.
- Пример:

  ```python
  # плохо: старый стиль, контекст - человек
  # TODO(ivanov): Remove after the migration.

  # хорошо
  # TODO: https://github.com/myorg/myproject/issues/142 - Remove after v2.
  ```

В примере гайда ссылка записана без схемы: `# TODO: crbug.com/192795 - Investigate cpufreq optimizations.` Профиль советует писать `https://`: так ссылка открывается из редактора, а при желании можно включить и `ruff TD003`. Для отложенных задач гайд требует назвать конкретную дату или событие.

## 5. Обработка ошибок, логирование, типизация

Исключения в Python-гайде разрешены (в отличие от C++-гайда Google), но с условиями. Логирование гайд рассматривает на примере `logging` и `absl.logging`. Аннотации типов гайд «настоятельно рекомендует» и просит как минимум аннотировать публичные API.

### G-PY-035 · MUST · Собственное исключение наследуется от существующего класса исключений; его имя оканчивается на `Error` и не повторяет имя модуля (`foo.FooError` - плохо)
- Проверка: частично: `ruff N818` проверяет суффикс `Error`; остальное - ручное ревью.
- Источник: [§2.4 Exceptions](https://google.github.io/styleguide/pyguide.html#s2.4-exceptions) (редакция 2026-09-10) · официальный гайд · высокая. Про наследование гайд говорит `must`, про имя - `should`; уровень MUST взят по первой части.

### G-PY-036 · MUST · `except:` без типа и `except Exception` не используются; исключения - повторный выброс и «точка изоляции», где ошибка записывается и подавляется (например, внешний блок потока)
- Проверка: `pylint W0702`, `W0718`; `ruff E722`, `BLE001`.
- Источник: [§2.4 Exceptions](https://google.github.io/styleguide/pyguide.html#s2.4-exceptions) (редакция 2026-09-10) · официальный гайд · высокая.

Там же: блок `try` должен быть как можно короче, а для очистки ресурсов служит `finally`.

### G-PY-037 · MUST · `assert` не заменяет проверку условий и входных данных: программа обязана работать так же, если все `assert` удалить; в тестах на pytest `assert` - норма
- Проверка: ручное ревью. `ruff S101` помечает любой `assert`, включая допустимые, поэтому в конфиг не включён.
- Источник: [§2.4 Exceptions](https://google.github.io/styleguide/pyguide.html#s2.4-exceptions) (правило переписано 2024-02-12, `8ee3431`; оговорка про pytest - 2023-11-21, `4d9a478`) · официальный гайд · высокая.
- Пример:

  ```python
  # плохо: дальнейший код зависит от assert
  assert minimum >= 1024, 'Minimum port must be at least 1024.'

  # хорошо
  if minimum < 1024:
      raise ValueError(f'Min. port must be at least 1024, not {minimum}.')
  ```

### G-PY-038 · SHOULD · Сообщение об ошибке точно называет условие, которое не выполнено, явно выделяет подставленные значения (`{path=}`, `%r`) и легко находится поиском по тексту
- Проверка: ручное ревью.
- Источник: [§3.10.2 Error Messages](https://google.github.io/styleguide/pyguide.html#s3.10.2-error-messages) (редакция 2026-09-10; 2024-01-23, `19f3149`: `{p!r}` заменено на `{p=}`) · официальный гайд · высокая.
- Пример:

  ```python
  # плохо: сообщение утверждает причину, которой код не проверял,
  # а при workdir = 'deleted' читается как бессмыслица
  logging.warning('The %s directory was already deleted.', workdir)

  # хорошо
  logging.warning('Could not remove directory (reason: %r): %r', error, workdir)
  ```

### G-PY-039 · MUST · Функции логирования получают первым аргументом строковый литерал-шаблон с `%`-плейсхолдерами - не f-строку; значения передаются отдельными аргументами
- Проверка: `pylint W1201`, `W1202`, `W1203` (в `pylintrc`: `logging-modules=logging,absl.logging,tensorflow.io.logging`); `ruff G001`-`G004`.
- Источник: [§3.10.1 Logging](https://google.github.io/styleguide/pyguide.html#s3.10.1-logging) (редакция 2026-09-10) · официальный гайд · высокая.
- Пример:

  ```python
  # плохо
  logging.error(f'Cannot write to {homedir!r}')
  logging.error('Cannot write to %r' % homedir)

  # хорошо
  logging.error('Cannot write to %r', homedir)
  ```

Гайд называет две причины: часть систем логирования хранит нераскрытый шаблон как поле для запросов, и строка не форматируется, если сообщение никуда не выводится.

### G-PY-040 · MUST · Строка собирается f-строкой, оператором `%` или методом `format` - на выбор автора, но не оператором `+`; в цикле строка не накапливается через `+=`
- Проверка: ручное ревью. `pylint C0209` (`consider-using-f-string`) требует f-строку там, где гайд разрешает `%` и `format`, поэтому отключается ключом `--disable=consider-using-f-string`.
- Источник: [§3.10 Strings](https://google.github.io/styleguide/pyguide.html#s3.10-strings) (редакция 2026-09-10) · официальный гайд · высокая. Про `+` гайд говорит `do not`, про накопление в цикле - `avoid`; уровень MUST взят по первой части.

Одно соединение двух строк через `+` гайд допускает. Вместо накопления в цикле части складываются в список с `''.join(...)` или пишутся в `io.StringIO`.

### G-PY-041 · MUST · Файлы, сокеты и подобные ресурсы закрываются явно, лучше всего оператором `with`; объект без поддержки `with` оборачивается в `contextlib.closing()`
- Проверка: частично: `ruff SIM115` (открытие файла без `with`); остальное - ручное ревью. `pylint R1732` выключен в `pylintrc` вместе со всей категорией `R`.
- Источник: [§3.11 Files, Sockets, and similar Stateful Resources](https://google.github.io/styleguide/pyguide.html#s3.11-files-sockets-closeables) (редакция 2026-09-10) · официальный гайд · высокая.

### G-PY-042 · SHOULD · Публичные API аннотированы типами, и код проходит статическую проверку типов в CI; аннотировать каждую функцию не требуется
- Проверка: частично: `mypy` с секцией `[tool.mypy]` из конфига проверяет согласованность типов (альтернатива - pyright); наличие аннотаций у публичных функций - ручное ревью (`disallow_untyped_defs` намеренно не включён).
- Источник: [§2.21 Type Annotated Code](https://google.github.io/styleguide/pyguide.html#s2.21-type-annotated-code), [§3.19.1 General Rules](https://google.github.io/styleguide/pyguide.html#s3.19.1-general-rules) (редакция 2026-09-10) · официальный гайд · высокая; [FAQ pytype, issue #1925](https://github.com/google/pytype/issues/1925) (2025-08) · конфиг или инструмент · высокая · архив.

Гайд называет инструментом проверки pytype. Репозиторий google/pytype в архиве с 2026-09-03, последняя поддерживаемая версия Python - 3.12. Профиль использует mypy - замену «не Google»; обоснование - в разделе [«Проверка типов»](#проверка-типов-гайд-называет-pytype-профиль-использует-mypy).

Там же, в §3.19.1: `self` и `cls` обычно не аннотируются (при необходимости - `typing.Self`), а возвращаемый тип `__init__` можно не писать. Правило `ruff ANN204` требует обратного и в профиль не включается.

### G-PY-043 · MUST · `None` в типе указывается явно - `X | None` (или `Optional[X]`); запись `a: str = None` запрещена
- Проверка: `ruff RUF013`, `UP007`, `UP045`; `mypy` (`no_implicit_optional` включён по умолчанию).
- Источник: [§3.19.5 NoneType](https://google.github.io/styleguide/pyguide.html#s3.19.5-nonetype) (редакция 2026-09-10; формулировка обновлена 2025-02-24, `ff7ea9c`) · официальный гайд · высокая.
- Пример:

  ```python
  # плохо
  def find_user(name: str = None) -> User: ...

  # хорошо
  def find_user(name: str | None = None) -> User | None: ...
  ```

### G-PY-044 · SHOULD · В сигнатурах предпочтительны абстрактные контейнеры (`collections.abc.Sequence`), а не конкретные (`list`); если нужен конкретный тип - встроенный (`tuple[int, ...]`), не `typing.Tuple`; `typing.Text` в новом коде не используется
- Проверка: частично: `ruff UP006`, `UP035` находят устаревшие имена из `typing`; выбор абстрактного типа - ручное ревью.
- Источник: [§3.19.12 Imports For Typing](https://google.github.io/styleguide/pyguide.html#s3.19.12-imports-for-typing), [§3.19.11 String types](https://google.github.io/styleguide/pyguide.html#s3.19.11-string-types) (правило об абстрактных контейнерах добавлено 2025-02-24, `ff7ea9c`) · официальный гайд · высокая.

### G-PY-045 · SHOULD · У обобщённого типа параметры указываются явно (`Sequence[int]`, не голый `Sequence`); если подходит только `Any`, он пишется явно
- Проверка: частично: `mypy` с `disallow_any_generics = true` (в pyright - `reportMissingTypeArgument`); уместность `Any` вместо `TypeVar` - ручное ревью.
- Источник: [§3.19.15 Generics](https://google.github.io/styleguide/pyguide.html#s3.19.15-generics) (редакция 2026-09-10) · официальный гайд · высокая.

### G-PY-046 · SHOULD · Псевдоним типа именуется в `CapWords` (внутренний - `_CapWords`), аннотируется как `TypeAlias` и не подменяет запрещённый импорт символа из модуля
- Проверка: ручное ревью. `ruff UP040` переписывает `TypeAlias` в синтаксис `type X = …` (PEP 695), о котором гайд молчит, - правило не включается.
- Источник: [§3.19.6 Type Aliases](https://google.github.io/styleguide/pyguide.html#s3.19.6-type-aliases) (раздел переписан 2026-09-10, `3b88229`) · официальный гайд · высокая.
- Пример:

  ```python
  # плохо: псевдоним вместо `from module import symbol`
  import immutabledict

  immutabledict = immutabledict.immutabledict

  # хорошо
  from typing import TypeAlias

  _Row: TypeAlias = tuple[str, int]
  RowsByKey: TypeAlias = Mapping[str, _Row]
  ```

### G-PY-047 · MUST · Новые type-комментарии (`x = f()  # type: Foo`) не добавляются - тип записывается аннотацией; `# type: ignore` остаётся допустимым
- Проверка: ручное ревью.
- Источник: [§3.19.8 Typing Variables](https://google.github.io/styleguide/pyguide.html#s3.19.8-typing-variables), [§3.19.7 Ignoring Types](https://google.github.io/styleguide/pyguide.html#s3.19.7-ignoring-types) (редакция 2026-09-10) · официальный гайд · высокая.

## 6. Запрещённые и ограниченные возможности языка

Вторая глава гайда («Python Language Rules») - это список возможностей языка с вердиктом по каждой. Открывает её требование запускать линтер. Правила ниже отличают «Google Python» от просто аккуратного Python сильнее всего, и инструмент их почти не ловит.

### G-PY-048 · MUST · Код проходит `pylint` с `pylintrc` из google/styleguide; предупреждение подавляется точечно, комментарием `# pylint: disable=<символическое-имя>` с пояснением, если причина не очевидна из имени
- Проверка: частично: `pylint --rcfile=pylintrc --disable=consider-using-f-string` в CI; уместность подавлений - ручное ревью.
- Источник: [§2.1 Lint](https://google.github.io/styleguide/pyguide.html#s2.1-lint) (редакция 2026-09-10) · официальный гайд · высокая; [pylintrc](https://google.github.io/styleguide/pylintrc) (2025-02-21, `5b8bc6b`) · конфиг или инструмент · высокая.
- Пример:

  ```python
  # хорошо: имя метода задано чужим API
  def do_PUT(self):  # WSGI name, so pylint: disable=invalid-name
      ...


  # хорошо: неиспользуемые аргументы гасятся явно, с комментарием
  def on_event(event: Event, context: Context) -> None:
      del context  # Unused.
      handle(event)
  ```

Гасить неиспользуемые аргументы именем `_` или префиксом `unused_` гайд разрешает, но «больше не поощряет»: это ломает вызовы с именованными аргументами.

### G-PY-049 · MUST · В comprehension и генераторном выражении допустимы один `for` и одно условие; несколько `for` или несколько фильтров запрещены
- Проверка: ручное ревью (проверено запуском: ни одно правило ruff 0.16.8 такой код не помечает).
- Источник: [§2.7 Comprehensions & Generator Expressions](https://google.github.io/styleguide/pyguide.html#s2.7-comprehensions) (редакция 2026-09-10; 2023-11-21, `4d9a478`: снято требование «каждая часть на своей строке», запрет нескольких `for` оставлен) · официальный гайд · высокая.
- Пример:

  ```python
  # плохо
  pairs = [(x, y) for x in range(10) for y in range(5) if x * y > 10]

  # хорошо
  pairs = []
  for x in range(10):
      for y in range(5):
          if x * y > 10:
              pairs.append((x, y))
  ```

### G-PY-050 · MUST · `staticmethod` не используется (кроме интеграции с чужим API) - вместо него пишется функция модуля; `classmethod` - только для именованных конструкторов и для работы с глобальным состоянием класса
- Проверка: ручное ревью.
- Источник: [§2.17 Function and Method Decorators](https://google.github.io/styleguide/pyguide.html#s2.17-function-and-method-decorators) (редакция 2026-09-10) · официальный гайд · высокая.
- Пример:

  ```python
  # плохо
  class Geometry:
      @staticmethod
      def area(width: float, height: float) -> float:
          return width * height


  # хорошо: функция модуля
  def area(width: float, height: float) -> float:
      return width * height
  ```

О декораторах вообще гайд говорит: применять, когда есть явная выгода; декоратор не должен зависеть от файлов, сокетов и баз данных, потому что выполняется при импорте; на него пишутся юнит-тесты.

### G-PY-051 · MUST · Значением параметра по умолчанию не может быть изменяемый объект или выражение, которое вычисляется при импорте модуля (`[]`, `{}`, `time.time()`, значение флага)
- Проверка: `pylint W0102`; `ruff B006`, `B008`.
- Источник: [§2.12 Default Argument Values](https://google.github.io/styleguide/pyguide.html#s2.12-default-argument-values) (редакция 2026-09-10) · официальный гайд · высокая.
- Пример:

  ```python
  # плохо
  def enqueue(job, queue=[], created_at=time.time()): ...

  # хорошо
  def enqueue(job, queue=None, created_at=None):
      if queue is None:
          queue = []
  ```

### G-PY-052 · MUST · Проверка на `None` пишется только как `is None` / `is not None`; булево значение не сравнивается с `False` через `==`; пустоту последовательности проверяет `if seq:`, а не `len(seq)`
- Проверка: частично: `pylint C0121`, `C1802`, `C1803`; `ruff E711`, `E712`, `PLC1802` (последнее срабатывает только на очевидных последовательностях); остальное - ручное ревью.
- Источник: [§2.14 True/False Evaluations](https://google.github.io/styleguide/pyguide.html#s2.14-truefalse-evaluations) (редакция 2026-09-10) · официальный гайд · высокая.
- Пример:

  ```python
  # плохо
  if len(users) == 0: ...
  if is_ready == False: ...
  timeout = timeout or 30      # 0 - допустимое значение, но оно пропадёт

  # хорошо
  if not users: ...
  if not is_ready: ...
  if timeout is None:
      timeout = 30
  ```

Целое число, про которое известно, что это число (и не результат `len()`), гайд разрешает явно сравнивать с нулём. Для массивов NumPy пустоту проверяет `.size`.

### G-PY-053 · MUST · Свойство (`@property`) пишется только для дешёвой и предсказуемой логики; свойство, которое лишь читает и записывает внутренний атрибут, запрещено - атрибут делается публичным
- Проверка: ручное ревью.
- Источник: [§2.13 Properties](https://google.github.io/styleguide/pyguide.html#s2.13-properties), [§3.15 Getters and Setters](https://google.github.io/styleguide/pyguide.html#s3.15-accessors) (редакция 2026-09-10) · официальный гайд · высокая.

Если чтение или запись значения дороги либо сложны, пишутся функции `get_foo()` и `set_foo()`: вызов подсказывает читателю, что операция нетривиальна.

### G-PY-054 · SHOULD · `lambda` - только для однострочников; вместо `map()` и `filter()` с `lambda` пишется comprehension или генераторное выражение, вместо тривиальной `lambda` - функция из модуля `operator`
- Проверка: частично: `pylint W0108`; `ruff C417`, `E731`; остальное - ручное ревью.
- Источник: [§2.10 Lambda Functions](https://google.github.io/styleguide/pyguide.html#s2.10-lambda-functions) (редакция 2026-09-10; 2023-11-21, `4d9a478`: порог «несколько строк или длиннее 60-80 символов») · официальный гайд · высокая.

### G-PY-055 · MUST · Условное выражение `a if cond else b` используется, только если каждая из трёх частей помещается на одной строке; иначе пишется обычный `if`
- Проверка: ручное ревью.
- Источник: [§2.11 Conditional Expressions](https://google.github.io/styleguide/pyguide.html#s2.11-conditional-expressions) (редакция 2026-09-10) · официальный гайд · высокая.

### G-PY-056 · SHOULD · Изменяемого глобального состояния следует избегать; если оно необходимо, имя начинается с `_`, доступ извне идёт только через публичные функции, а причина объяснена в комментарии
- Проверка: частично: `ruff PLW0603` находит оператор `global`; остальное - ручное ревью. В Google `pylintrc` проверка `global-statement` отключена.
- Источник: [§2.5 Mutable Global State](https://google.github.io/styleguide/pyguide.html#s2.5-global-variables) (редакция 2026-09-10) · официальный гайд · высокая.

Константы модуля это правило не затрагивает: гайд их поощряет (G-PY-012).

### G-PY-057 · SHOULD · Вложенная функция или класс оправданы, только когда замыкают локальное значение (не `self` и не `cls`); ради сокрытия функцию не вкладывают, а дают ей имя с `_` на уровне модуля
- Проверка: ручное ревью.
- Источник: [§2.6 Nested/Local/Inner Classes and Functions](https://google.github.io/styleguide/pyguide.html#s2.6-nested) (редакция 2026-09-10) · официальный гайд · высокая.

### G-PY-058 · SHOULD · «Мощные» возможности языка не используются: собственные метаклассы, доступ к байт-коду, динамическое наследование, подмена импорта, рефлексия (некоторые применения `getattr()`), финализатор `__del__`
- Проверка: ручное ревью.
- Источник: [§2.19 Power Features](https://google.github.io/styleguide/pyguide.html#s2.19-power-features) (редакция 2026-09-10) · официальный гайд · высокая.

Стандартные модули, которые сами построены на этих возможностях (`abc.ABCMeta`, `dataclasses`, `enum`), использовать можно.

### G-PY-059 · MUST · Код не полагается на атомарность операций со встроенными типами; данные между потоками передаются через `queue.Queue`, а вместо низкоуровневых блокировок предпочтителен `threading.Condition`
- Проверка: ручное ревью.
- Источник: [§2.18 Threading](https://google.github.io/styleguide/pyguide.html#s2.18-threading) (редакция 2026-09-10) · официальный гайд · высокая.

### G-PY-060 · SHOULD · Для словарей, списков и файлов используются итераторы и операторы по умолчанию: `for key in adict`, `if key in adict`, `for line in afile` - без `.keys()` и `.readlines()`
- Проверка: частично: `pylint C0201`; `ruff SIM118`; остальное - ручное ревью.
- Источник: [§2.8 Default Iterators and Operators](https://google.github.io/styleguide/pyguide.html#s2.8-default-iterators-and-operators) (редакция 2026-09-10) · официальный гайд · высокая.

## 7. Тесты

О тестах гайд говорит мало: `assert` в pytest-тестах допустим (G-PY-037), докстринги в тестах не обязательны, для имён тестовых методов есть шаблон. Раннер и расположение тестов гайд не предписывает - эти правила взяты из производных гайдов и практики открытых репозиториев Google и помечены соответственно. Соглашения самого pytest (фикстуры, `conftest.py`, параметризация) - «не Google».

### G-PY-061 · SHOULD · Тест лежит рядом с кодом, в соседнем файле `<модуль>_test.py`
- Проверка: частично: pytest с `python_files = ["*_test.py", "test_*.py"]` собирает такие файлы; расположение - ручное ревью.
- Источник: [TensorFlow CONTRIBUTING.md](https://github.com/tensorflow/tensorflow/blob/master/CONTRIBUTING.md) (2026-10) · производный гайд проекта · средняя; [Keras CONTRIBUTING.md](https://github.com/keras-team/keras/blob/master/CONTRIBUTING.md) (2026-10) · производный гайд проекта · средняя.

### G-PY-062 · SHOULD · Тестовый метод называется `test_<что_тестируется>_<состояние>`
- Проверка: ручное ревью (`method-rgx` в Google `pylintrc` пропускает и старую форму `test<MethodUnderTest>_<state>`).
- Источник: [§3.16.2 Naming Conventions](https://google.github.io/styleguide/pyguide.html#s3.16.2-naming-conventions) (редакция 2026-09-10) · официальный гайд · высокая.
- Пример:

  ```python
  # плохо
  def test1(self): ...
  def testParse(self): ...

  # хорошо
  def test_parse_empty_input_returns_no_rows(self): ...
  ```

### G-PY-063 · SHOULD · Тестовому модулю, наследнику `unittest.TestCase` и методам `test_*` докстринг не нужен; докстринг, который только повторяет имя («Tests for foo.bar.»), удаляется
- Проверка: частично: `no-docstring-rgx` в Google `pylintrc`; в ruff - `per-file-ignores` для `*_test.py` и `test_*.py`; содержательность - ручное ревью.
- Источник: [§3.8.2.1 Test modules](https://google.github.io/styleguide/pyguide.html#s3.8.2.1-test-modules) (редакция 2026-09-10, `3b88229`: правило распространено на классы и методы) · официальный гайд · высокая.

Докстринг в тесте нужен, когда сообщает новое: как запускать тест, какие у него необычные зависимости.

### G-PY-064 · SHOULD · Тест на `absltest` запускается через `absltest.main()`, а не `unittest.main()`; имя теста описывает конкретный проверяемый случай
- Проверка: ручное ревью.
- Источник: [Abseil Python: Testing](https://abseil.io/docs/python/guides/testing) (abseil-py v2.5.1) · конфиг или инструмент · средняя.

Правило действует только для проектов на abseil-py. `absltest` повторяет интерфейс `unittest` и добавляет интеграцию с флагами absl.

### G-PY-065 · SHOULD · Тесты запускает pytest; предупреждения в тестах считаются ошибками (`filterwarnings = ["error"]`)
- Проверка: `pytest` с секцией `[tool.pytest.ini_options]` из конфига.
- Источник: [pyproject.toml google/flax](https://github.com/google/flax/blob/main/pyproject.toml) (HEAD 2026-10-07) · практика, выведенная из репозиториев (pytest в конфиге или CI - 9 из 12 Python-репозиториев выборки; `filterwarnings = ["error", …]` - 4 из 12: flax, jax, keras, pyink) · средняя · реконструкция.

## 8. Версия языка и изменения за 2023-2026 годы

**Какую версию Python подразумевает гайд.** Минимальная версия в гайде не названа. По тексту видно, на что он рассчитан: объединения через `|` «рекомендуются в новом коде для Python 3.10+» ([§3.19.5](https://google.github.io/styleguide/pyguide.html#s3.19.5-nonetype)), примеры используют `from typing import Self` (Python 3.11+, [§3.19.1](https://google.github.io/styleguide/pyguide.html#s3.19.1-general-rules)), `from typing import override` (3.12+, [§3.8.3.1](https://google.github.io/styleguide/pyguide.html#s3.8.3.1-overridden-methods)) и `with (...)` со скобками ([§3.2](https://google.github.io/styleguide/pyguide.html#s3.2-line-length)). При этом в тексте остались следы старых версий: совет про `from __future__ import generator_stop` для кода, который может выполняться на Python 3.5 ([§2.20](https://google.github.io/styleguide/pyguide.html#s2.20-modern-python)), и оговорка о совместимости с Python 3.6 ([§3.19.13](https://google.github.io/styleguide/pyguide.html#s3.19.13-conditional-imports)).

Интерпретация: гайд написан для современного Python (3.10-3.12) и не требует конкретной версии. В конфигах профиля стоит 3.12 - это наименьшая версия, на которой работают все примеры гайда. Замените значение на минимальную версию, которую поддерживает ваш проект.

**О чём гайд молчит.** Синтаксис PEP 695 (`type X = …`, `def f[T](…)`), оператор `match` и стиль работы с `dataclasses` в гайде не упоминаются - публичных данных не найдено. В оглавлении гайда есть пункт «3.19.16 Build Dependencies», но самого раздела в файле нет.

**Что менялось.** С октября 2023 года в гайд внесено пять содержательных обновлений; ещё одно, важное для профиля, сделано за месяц до этого окна. Сообщения коммитов безличны («Project import generated by Copybara», «Update Python style guide»), мотивы изменений публично не объясняются.

| Дата | Коммит | Что изменилось | Правила профиля |
|---|---|---|---|
| 2023-09-08 | [`105acb7`](https://github.com/google/styleguide/commit/105acb7) | Новый формат `# TODO: <ссылка> - <текст>`; `TODO(username)` объявлен старым стилем | G-PY-034 |
| 2023-11-21 | [`4d9a478`](https://github.com/google/styleguide/commit/4d9a478) | Раздел о переопределённых методах и `@override`; импорт «не отдельных типов, классов или функций»; в comprehension оставлен только запрет нескольких `for`; порог для `lambda` - 60-80 символов; примеры переформатированы в стиле Black и Pyink; `assert` в pytest признан нормой | G-PY-017, 030, 037, 049, 054 |
| 2024-01-23 | [`19f3149`](https://github.com/google/styleguide/commit/19f3149) | `Returns:` можно опустить, если первая фраза уже описывает результат; `Yields:` описывает объект из `next()`; `{p=}` вместо `{p!r}` в сообщениях об ошибках; `Self` вместо аннотации `cls: Type[_T]` | G-PY-029, 038 |
| 2024-02-12 | [`8ee3431`](https://github.com/google/styleguide/commit/8ee3431) | Правило про `assert` переписано: код должен работать без него; из секции `Attributes:` исключены свойства | G-PY-031, 037 |
| 2025-02-24 | [`ff7ea9c`](https://github.com/google/styleguide/commit/ff7ea9c) | Ссылки на PEP 484/526/585 заменены ссылками на docs.python.org; абстрактные контейнеры предпочтительнее конкретных; строка-резюме докстринга - не длиннее 80; требования к математической нотации | G-PY-002, 015, 027, 044 |
| 2026-09-10 | [`3b88229`](https://github.com/google/styleguide/commit/3b88229) | Из исключений импорта убран `six.moves`; докстринги не обязательны для тестовых классов и методов; докстринг декорированной функции описывает поведение после декоратора; `override` импортируется из `typing`; в именовании появились ссылка на PEP 8, правило об акронимах и исключение для FFI; раздел о псевдонимах типов переписан | G-PY-011, 017, 030, 032, 046, 063 |

В `pylintrc` за то же время пять коммитов: 2023-09-25 ([`28d10d1`](https://github.com/google/styleguide/commit/28d10d1)) - секция `[MASTER]` переименована в `[MAIN]`, отключена вся категория `R`; 2025-02-11 ([`b5908c3`](https://github.com/google/styleguide/commit/b5908c3)) - `score=no`; 2025-02-18 ([`8896388`](https://github.com/google/styleguide/commit/8896388)) - явный заголовок Apache-2.0; 2025-02-21 ([`dc83e08`](https://github.com/google/styleguide/commit/dc83e08) и [`5b8bc6b`](https://github.com/google/styleguide/commit/5b8bc6b)) - `indent-string` изменён с 2 пробелов на 4 и снабжён комментарием о внутреннем стиле.

Интерпретация: изменения идут в сторону PEP 8, Black и современной типизации (PEP 604, 585, 673, 698), а не от них.

## 9. Инструменты: pyink, yapf и Black; pylintrc; проверка типов

Для проверки и форматирования гайд называет поимённо четыре инструмента: `pylint` с опубликованным `pylintrc` ([§2.1](https://google.github.io/styleguide/pyguide.html#s2.1-lint)), Black и Pyink ([§1](https://google.github.io/styleguide/pyguide.html#s1-background)), pytype ([§2.21](https://google.github.io/styleguide/pyguide.html#s2.21-type-annotated-code)). yapf, isort, ruff, mypy и pyright в тексте гайда не упоминаются.

| Инструмент | Владелец | Назван в гайде | Статус на 2026-10-09 | Роль в профиле |
|---|---|---|---|---|
| [pylint](https://pypi.org/project/pylint/) | pylint-dev, не Google | да | активен; 4.1.2 от 2026-10-02, Python ≥ 3.10 | обязательный линтер (G-PY-048) |
| [`pylintrc`](https://google.github.io/styleguide/pylintrc) из google/styleguide | Google | да | активен, правки редкие; последняя - 2025-02-21; Apache-2.0 | настройки pylint; файл скачивается в проект |
| [pyink](https://github.com/google/pyink) | Google; в README: «not an officially supported Google product» | да | активен; 26.5.1 от 2026-08-25 на базе Black 26.5.1; Python ≥ 3.10 | форматтер (G-PY-001) |
| [Black](https://github.com/psf/black) | PSF, не Google | да | активен; последний тег 26.10.0 | допустимая замена pyink |
| [yapf](https://github.com/google/yapf) | Google; в README: «not an official Google product» | нет (упоминания убраны в 2023 году) | не обновляется: релиз 0.43.0 от 2024-11, последний коммит 2025-02-10 (бот); репозиторий не архивирован | не используется |
| [pytype](https://github.com/google/pytype) | Google | да | **архив с 2026-09-03**; последний релиз 2024.10.11; Python не новее 3.12 | не используется |
| [isort](https://github.com/PyCQA/isort), профиль `google` | PyCQA, не Google | нет | активен; 9.0.2 | порядок импортов (G-PY-021, 022) |
| [ruff](https://docs.astral.sh/ruff/) | Astral, не Google | нет | активен; конфиг проверен на 0.16.8 | дополняющий линтер; вариант B |
| mypy | не Google | нет | активен; конфиг проверен на 2.3.1 | проверка типов (G-PY-042) |
| pyright | не Google | нет | активен; блок проверен на 1.1.414 | альтернатива mypy |
| [abseil-py](https://github.com/abseil/abseil-py) (`absl-py`) | Google | да (`app.run` в §3.17) | активен; v2.5.1 | по желанию: `app`, `flags`, `logging`, `absltest` |

### pyink, Black и yapf

pyink - форк Black, который Google ведёт сам. README объясняет его появление так: перейти на Black за один день в монорепозитории, где работают тысячи разработчиков, слишком разрушительно, поэтому Google держит несколько своих правок поверх Black и называет pyink «помощником при переходе». Версии pyink повторяют версии Black, на которых основаны.

| | pyink 26.5.1 | Black 26.5.1 | yapf 0.43.0 |
|---|---|---|---|
| Упомянут в гайде | да | да | нет |
| Сопровождение | активное | активное | остановлено (нет релизов с 2024-11) |
| Длина строки по умолчанию | 88 | 88 | 80 в стилях `google` и `yapf` |
| Отступ | 4; опция `pyink-indentation = 2` | 4 | 4 в стиле `google`, 2 в стиле `yapf` |
| Кавычки | двойные или, с `pyink-use-majority-quotes`, преобладающие в файле | всегда двойные | - |
| Длинный импорт | не трогает | переносит в скобках | - |
| Строка, которая длинна только из-за хвостовой прагмы (`# pylint: disable=…`) | не переносит | переносит | - |
| Строка `class` без докстринга | добавляет пустую строку перед первым методом | не добавляет | - |
| Синтаксис Python 3.12 (PEP 695, PEP 701) | основан на Black 26.5.1; запуском не проверено | принимает (проверено запуском) | не поддерживает |
| Секция в `pyproject.toml` | `[tool.pyink]` | `[tool.black]` | `[tool.yapf]` |

Источники таблицы: [README pyink](https://github.com/google/pyink/blob/main/README.md), [README yapf](https://github.com/google/yapf/blob/main/README.md), [style.py yapf](https://github.com/google/yapf/blob/main/yapf/yapflib/style.py). Прочерк означает, что поведение yapf в этом пункте не исследовалось.

Что из этого следует для профиля:

- **Готового «Google-пресета» у pyink нет.** По умолчанию он, как и Black, форматирует под 88 колонок. Значения `line-length = 80`, `pyink-indentation = 4` и `pyink-use-majority-quotes = true` выставлены по тексту гайда.
- **pyink лучше Black сочетается с остальными правилами гайда.** Он не переносит длинные импорты (гайд выводит их из-под лимита) и не ломает строки с прагмами pylint. С Black и isort на длинных импортах возможен конфликт двух инструментов; запуском это не проверялось.
- **Black - допустимая замена.** Гайд называет оба форматтера на равных. У Black есть готовое расширение для VS Code (pyink подключается через него же); расплата - двойные кавычки везде и перенос длинных импортов.
- **yapf для нового кода не подходит.** Стиль `google` в yapf описан как основанный на гайде, а стиль `yapf` - как стиль открытых проектов Google с отступом 2. Но проект стоит с начала 2025 года и не понимает синтаксис Python 3.12; гайд перестал его упоминать в 2023 году.

### Статус pylintrc из google/styleguide

Файл [`pylintrc`](https://google.github.io/styleguide/pylintrc) - единственный конфиг линтера, который Google публикует вместе с Python-гайдом. Гайд требует запускать pylint именно с ним. Сам файл называет себя «best-effort configuration», лицензирован отдельно от гайда (Apache-2.0, заголовок добавлен 2025-02-18) и в последний раз менялся 2025-02-21.

Файл официальный и живой, но текст гайда покрывает не полностью:

- Отключена вся категория `R` (refactor) и ещё 78 сообщений. Среди них `missing-function-docstring`, `wrong-import-order`, `fixme`, `global-statement`. Обязательные по гайду докстринги функций и порядок импортов pylint с этим файлом не проверяет.
- Регулярные выражения для имён функций и методов пропускают `CamelCase`, а для констант - нижний регистр.
- Проверки запрета относительных импортов и правила «импортировать только модули» в файле нет. Гайд упоминает внутренние проверки с префиксом `g-`; они не опубликованы.
- `consider-using-f-string` (C0209) не отключён, хотя гайд разрешает `%` и `format`.
- Версия pylint в файле не указана. Секция `[MAIN]` означает расчёт на pylint 2.14 и новее. Значительная часть списка `disable` - имена сообщений времён Python 2. Как pylint 4.1.2 реагирует на эти устаревшие имена, запуском не проверено.

До февраля 2025 года файл требовал отступ в 2 пробела, а текст гайда - 4. Расхождение существовало с 2018 года.

Вывод для профиля: pylint с Google `pylintrc` остаётся обязательным (так требует гайд), а пробелы закрывают isort и ruff - оба «не Google».

### Проверка типов: гайд называет pytype, профиль использует mypy

Гайд в редакции 2026-09-10 по-прежнему советует проверять типы при сборке «инструментом вроде pytype» и включать проверку pytype в системе сборки.

Состояние pytype:

- 2025-08-20 в README появилось объявление: последняя поддерживаемая версия Python - 3.12; причина - архитектура на анализе байт-кода мешает добавлять новые возможности ([README](https://github.com/google/pytype/blob/main/README.md)).
- В [FAQ к объявлению](https://github.com/google/pytype/issues/1925) альтернативы названы без ранжирования: mypy и Pyright как зрелые, Pyrefly и ty как новые.
- Последний релиз на PyPI - 2024.10.11. С 2026-09-03 репозиторий в архиве.

Какой инструмент заменил pytype внутри Google, публично не объявлено - публичных данных не найдено. В 12 открытых Python-репозиториях Google картина такая: mypy - 4 (abseil-py, pyink, google-cloud-python, flax), pytype - 2 (flax, optax), pyrefly - 2 (jax, optax), ty - 1 (python-fire), pyright - 0, без проверки типов - 5 (в flax и optax инструментов по два). В начале октября 2026 года в abseil-py и flax появились экспортированные из внутреннего репозитория коммиты, которые заменяют подавления `# pytype: disable` на `# pyrefly: ignore`. Интерпретация: это признак внутреннего перехода на pyrefly, но не объявление; уверенность средняя.

Решение профиля: **mypy**, с пометкой «не Google». Основания: mypy назван в FAQ pytype как зрелая альтернатива; из названных там инструментов он чаще всего встречается в открытых репозиториях Google; секция `[tool.mypy]` проверена запуском. pyright - равноценная замена, его блок лежит в конфиге закомментированным. pyrefly используют jax и optax; конфиг для него в профиль не включён.

## 10. Отличия от PEP 8

Гайд - не PEP 8 с поправками, а самостоятельный документ: он регулирует не только оформление, но и выбор конструкций языка. В именовании гайд с 2026-09-10 прямо отсылает к PEP 8. Содержание PEP 8 сверено по [тексту на peps.python.org](https://peps.python.org/pep-0008/) 2026-10-09.

| Тема | PEP 8 | Google Python Style Guide | Правило |
|---|---|---|---|
| Длина строки | 79; для комментариев и докстрингов - 72; команда может договориться о 99 | 80 для всего, с перечнем исключений | G-PY-002 |
| Что импортировать | `from myclass import MyClass` «обычно допустимо» | только пакеты и модули | G-PY-017 |
| Относительные импорты | явные относительные - «приемлемая альтернатива» | запрещены | G-PY-018 |
| Группы импортов | стандартная библиотека, сторонние, локальные; порядок внутри группы не задан | те же группы плюс `__future__`; внутри - лексикографически по полному пути | G-PY-022 |
| Докстринги | ссылка на PEP 257, формат секций не задан | собственный формат с `Args:`, `Returns:`, `Raises:` | G-PY-027…032 |
| Типы | только оформление аннотаций; проверка типов - необязательный отдельный инструмент | аннотации «настоятельно рекомендуются», проверка типов при сборке | G-PY-042 |
| Инструменты | не предписывает | pylint с опубликованным `pylintrc`; Black или Pyink | G-PY-001, 048 |
| Кавычки | любой вид, единообразно | один вид в пределах файла | G-PY-010 |
| Строки логов | не регулирует | только `%`-шаблон, не f-строка | G-PY-039 |
| Формат `TODO` | не регулирует | `# TODO: <ссылка> - <текст>` | G-PY-034 |
| Ограничения языка | немного (`lambda` не присваивать имени, не ловить всё подряд, `is None`) | много: `staticmethod`, несколько `for` в comprehension, свойства-обёртки, «мощные» возможности, изменяемые значения по умолчанию | G-PY-049…060 |
| Точка входа | не регулирует | `main()` и `if __name__ == '__main__':` | G-PY-024 |
| Длина функции | не регулирует | около 40 строк - повод подумать | G-PY-025 |

Совпадают: отступ в 4 пробела, `CapWords` для классов и `lower_with_under` для функций, константы заглавными, акронимы заглавными целиком, `is None`, `if seq:` вместо `len(seq)`, один импорт на строку, допустимость короткого `if` в одну строку.

С Black гайд расходится в одном параметре - длине строки (80 против 88 по умолчанию). Остальное поведение Black гайд принимает: «магическая» хвостовая запятая описана в §3.4.1, а §3.2 разрешает оставить строку длиннее лимита, если форматтер не справился.

## 11. Гайд против инструментов и против практики

Источник истины в профиле - текст гайда. Конфиги - приближение к нему. Ниже все найденные расхождения: обе версии и вариант, который берёт профиль.

| № | Гайд | Инструмент или практика | Профиль берёт |
|---|---|---|---|
| 1 | Отступ 4 пробела ([§3.4](https://google.github.io/styleguide/pyguide.html#s3.4-indentation)) | Внутренний стиль Google - 2 пробела; так набраны 8 из 12 открытых Python-репозиториев Google | 4 пробела - см. ниже |
| 2 | 80 символов ([§3.2](https://google.github.io/styleguide/pyguide.html#s3.2-line-length)) | pyink и Black по умолчанию - 88 | `line-length = 80` явно |
| 3 | Проверять типы pytype ([§2.21](https://google.github.io/styleguide/pyguide.html#s2.21-type-annotated-code)) | pytype в архиве, Python не новее 3.12 | mypy («не Google»); гайд здесь отстаёт от инструмента |
| 4 | Докстринг функции обязателен ([§3.8.3](https://google.github.io/styleguide/pyguide.html#s3.8.3-functions-and-methods)) | в `pylintrc` `missing-function-docstring` отключён | ruff `D` с `convention = "google"` («не Google») |
| 5 | f-строка, `%` или `format` - на выбор ([§3.10](https://google.github.io/styleguide/pyguide.html#s3.10-strings)) | pylint C0209 требует f-строку | `--disable=consider-using-f-string`; уверенность средняя: на pylint 4 не проверено запуском |
| 6 | Функции и методы - `lower_with_under` ([§3.16.4](https://google.github.io/styleguide/pyguide.html#s3.16.4-guidelines-derived-from-guidos-recommendations)) | регулярные выражения в `pylintrc` пропускают `CamelCase` | гайд; для нового кода - `ruff N802` |
| 7 | Кавычки единообразны в файле, вид любой ([§3.10](https://google.github.io/styleguide/pyguide.html#s3.10-strings)) | Black всегда ставит двойные; pyink умеет «по большинству» | pyink с `pyink-use-majority-quotes`; оба результата гайду соответствуют |
| 8 | `# TODO: crbug.com/192795 - …`, ссылка без схемы ([§3.12](https://google.github.io/styleguide/pyguide.html#s3.12-todo-comments)) | `ruff TD003` на пример из гайда срабатывает, на ссылку с `https://` - нет; `TD002` требует автора; в `pylintrc` `fixme` отключён | писать ссылку с `https://`; включены только `TD004`, `TD005`, `TD007` |
| 9 | Длинный импорт - исключение из лимита; один импорт на строку ([§3.2](https://google.github.io/styleguide/pyguide.html#s3.2-line-length), [§3.13](https://google.github.io/styleguide/pyguide.html#s3.13-imports-formatting)) | Black, `ruff format` и `ruff I001` переносят длинный импорт в скобках; pyink и isort с профилем `google` - нет | pyink и isort; в ruff правила `I` и `E501` выключены (включаются только в варианте B) |
| 10 | `if foo: bar(foo)` разрешён ([§3.14](https://google.github.io/styleguide/pyguide.html#s3.14-statements)) | `ruff E701` запрещает; `pylintrc` согласован с гайдом (`single-line-if-stmt=yes`) | `E701` отключён |
| 11 | `six.moves` убран из исключений импорта (2026-09-10) | профиль `google` в isort всё ещё исключает `six.moves` | безвредно; ничего не делаем |
| 12 | Гайд называет Black и Pyink | ни один из 12 открытых Python-репозиториев Google не проверяет pyink в CI; pyink настроен в 3 из 12, yapf - в 2, ruff format - в 2, Black - в 1, форматтера нет в 5 | pyink с проверкой в CI; вариант B на ruff - альтернатива: `ruff format` используют проекты Google, которые ведутся прямо на GitHub (keras, google-cloud-python) |

Пункты 9 и 10 проверены запуском ruff 0.16.8; пункт 8 - тоже.

### Отступ в 2 пробела: известное расхождение, в профиль не взято

Публичный гайд требует 4 пробела. Внутри Google действует другое правило, и это видно в открытых источниках:

- Комментарий в самом `pylintrc`: внутренний гайд Google требует 2 пробела, а опубликованный говорит о 4, как PEP 8 ([pylintrc](https://github.com/google/styleguide/blob/gh-pages/pylintrc), 2025-02-21). До этой правки файл требовал 2 пробела; значение исправил внешний pull request [`dc83e08`](https://github.com/google/styleguide/commit/dc83e08) - редкий случай принятого внешнего изменения.
- В выборке из 12 открытых Python-репозиториев Google отступ 2 пробела - в 8: abseil-py, yapf, python-fire, tensorflow, jax, flax, optax, google-research. Отступ 4 - в 4: pyink, google-cloud-python, python-docs-samples, keras. Замер - по первому вложенному блоку в не более чем 8 файлах на репозиторий, поэтому уверенность средняя; конфиги её подкрепляют: `pyink-indentation = 2` у flax, optax и bazel, `indent-width = 2` у jax.
- [CONTRIBUTING yapf](https://github.com/google/yapf/blob/12005095296072751e3e4c1f33a047d41b0ce18d/CONTRIBUTING.md) называет 2 пробела и `CamelCase` для функций исключениями, которые остаются частью внутреннего Python-гайда.
- Примеры в самом гайде набраны непоследовательно: часть - с отступом 2 (например, в [§2.4](https://google.github.io/styleguide/pyguide.html#s2.4-exceptions) и [§3.19.1](https://google.github.io/styleguide/pyguide.html#s3.19.1-general-rules)), часть - с отступом 4.
- По книге «Software Engineering at Google» ([глава 8](https://abseil.io/resources/swe-book/html/ch08.html#setting_the_standard)), Python-гайд изначально требовал 2 пробела и `CamelCase` для методов - ради единообразия с C++.

Профиль берёт 4 пробела. Причины: так написано в публичном гайде и в текущем `pylintrc`; так форматируют pyink и Black по умолчанию; так устроена вся остальная экосистема Python. Отступ 2 нужен в одном случае - когда вы отправляете код в проект Google, где он принят. Тогда следуйте конфигу этого проекта (`pyink-indentation = 2`).

## 12. Машиночитаемые конфиги

Все настройки лежат в одном файле: [`../../configs/python/pyproject.toml`](../../configs/python/pyproject.toml). Это фрагмент: в нём только секции `[tool.*]`, которые копируются в `pyproject.toml` проекта.

| Пакет (PyPI) | Версия | Роль | Где настраивается | Проверено запуском |
|---|---|---|---|---|
| `pyink` | 26.5.1 | форматтер | `[tool.pyink]` | нет |
| `isort` | 9.0.2 | порядок импортов | `[tool.isort]`, `profile = "google"` | нет |
| `pylint` | 4.1.2 | линтер гайда | файл `pylintrc` из google/styleguide | нет |
| `ruff` | 0.16.8 | дополняющий линтер; в варианте B - ещё форматтер и импорты | `[tool.ruff]`, `[tool.ruff.lint]`, `[tool.ruff.format]` | да |
| `mypy` | 2.3.1 | проверка типов | `[tool.mypy]` | да |
| `pytest` | 9.1.1 | тесты | `[tool.pytest.ini_options]` | да |
| `pyright` | 1.1.414 | альтернатива mypy | закомментированный `[tool.pyright]` | да |
| `absl-py` | 2.5.1 | по желанию: `app`, `flags`, `logging`, `absltest` | - | нет |

«Нет» означает, что реестр пакетов недоступен из среды сборки. Имена опций в этих секциях сверены с первоисточниками: README и `pyproject.toml` pyink, исходник профиля `google` в isort, сам `pylintrc`. Прогоните эти три инструмента на своём проекте, прежде чем включать их в обязательные проверки.

**Основной набор (вариант A).** Все пять инструментов работают вместе; конфиг составлен так, чтобы их проверки не спорили друг с другом:

```bash
pip install "pyink==26.5.1" "isort==9.0.2" "pylint==4.1.2" "ruff==0.16.8" \
    "mypy==2.3.1" "pytest==9.1.1"
curl -fsSLO https://google.github.io/styleguide/pylintrc

pyink --check --diff .
isort --check-only --diff .
pylint --rcfile=pylintrc --disable=consider-using-f-string src/
ruff check .
mypy src/
pytest
```

`pylintrc` (Apache-2.0) в профиль не скопирован: его нужно скачать и положить в корень проекта. Когда pylint запущен с `--rcfile`, секции `[tool.pylint.*]` из `pyproject.toml` он не читает.

Роль ruff в варианте A - только линтер: он проверяет то, чего нет в Google `pylintrc` (докстринги, относительные импорты, формат `TODO`, современные аннотации). Правила `I`, `E501` и `Q` в нём выключены, чтобы не спорить с pyink, isort и pylint.

**Вариант B («не Google»): только ruff.** `ruff format` заменяет pyink, правило `I` - isort. В конфиге для этого нужны три правки, они помечены словами «Вариант B»: раскомментировать `extend-select`, убрать `E501` из `ignore`, удалить секции `[tool.pyink]` и `[tool.isort]`. pylint и mypy остаются.

```bash
ruff format --check .
ruff check .
```

Чем вариант B отличается от гайда: длинные импорты переносятся в скобках и считаются нарушением лимита; кавычки одного вида на весь проект, а не на файл; профиля `google` для импортов в ruff нет - он собран из отдельных опций и близок к isort, но не тождествен ему.

Версии Python: `target-version = "py312"` в ruff и `python_version = "3.12"` в mypy - см. [раздел 8](#8-версия-языка-и-изменения-за-2023-2026-годы).

Настройки редактора. В google/styleguide лежит файл для Vim, `google_python_style.vim` (последняя правка 2019-12-30); гайд на него ссылается. Расширения pyink для VS Code нет; README pyink советует расширение Black Formatter с путём к исполняемому файлу pyink. Общие параметры для `.editorconfig`: отступ 4 пробела, 80 колонок, UTF-8, перевод строки LF.

## 13. Матрица «инструмент / ручное ревью»

Единица подсчёта - правило этого документа. «Целиком» - инструмент из основного набора проверяет правило полностью. «Частично» - проверяет часть правила или приближение к нему. «Ревью» - публичной проверки нет или она противоречит гайду.

| | Правил | Доля |
|---|---|---|
| Целиком инструментом | 19 | 29 % |
| Частично инструментом | 22 | 34 % |
| Только ручное ревью | 24 | 37 % |
| Всего | 65 | 100 % |

- **Целиком (19):** G-PY-001, 002, 004, 005, 006, 007, 010, 013, 018, 020, 021, 022, 027, 030, 036, 039, 043, 051, 065.
- **Частично (22):** G-PY-008, 009, 011, 012, 014, 026, 028, 031, 033, 034, 035, 041, 042, 044, 045, 048, 052, 054, 056, 060, 061, 063.
- **Ревью (24):** G-PY-003, 015, 016, 017, 019, 023, 024, 025, 029, 032, 037, 038, 040, 046, 047, 049, 050, 053, 055, 057, 058, 059, 062, 064.

Что закрывает какой инструмент:

| Область | Инструмент | Закрывает целиком | Остаётся ревью |
|---|---|---|---|
| Раскладка: отступы, пустые строки, пробелы, запятые, кавычки | pyink (назван в гайде) | G-PY-001, 004, 005, 006, 010 | перенос обратным слэшем (003) |
| Длина строки, точки с запятой, `except`, логирование, значения по умолчанию, положение импортов | pylint + Google `pylintrc` (названы в гайде) | G-PY-002, 007, 013, 020, 021, 036, 039, 051 | всё из категории `R`; имена функций |
| Порядок импортов | isort, профиль `google` (не Google) | G-PY-022 | импорт только модулей (017), псевдонимы (019) |
| Относительные импорты, докстринги, `@override` | ruff (не Google) | G-PY-018, 027, 030 | содержание докстрингов (029, 032) |
| Типы | mypy и ruff (не Google) | G-PY-043 | псевдонимы типов, type-комментарии, имена `TypeVar` |
| Тесты | pytest (не Google) | G-PY-065 | имена тестов (062) |
| Ограничения языка | - | - | G-PY-049, 050, 053, 055, 057, 058, 059 |

Если оставить только инструменты, названные в гайде (pyink или Black и pylint с `pylintrc`), целиком проверяются 13 правил из 65 - 20 %. Ещё шесть (G-PY-018, 022, 027, 030, 043, 065) закрывают инструменты «не Google».

В исследовании, на котором построен профиль, подсчёт сделан по другой выборке - 60 правил-кандидатов гайда: целиком - 16, частично - 24, ревью - 20 (27 %, 40 % и 33 %). Порядок величин тот же: форматирование автоматизируется почти полностью, правила о выборе конструкций языка и о содержании докстрингов остаются за ревью. Доли зависят от выборки: если считать каждое мелкое правило форматирования отдельно, доля автоматизации выше. Внутренние проверки Google (pylint с префиксом `g-`) не опубликованы, поэтому доля автоматизации внутри компании неизвестна.

Сводная матрица по всем областям профиля - в [../enforcement.md](../enforcement.md).
