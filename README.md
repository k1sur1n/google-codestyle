# google-codestyle

> Данные актуальны на 2026-10-09.

Это профиль публичного стандарта кода Google для обычного git-репозитория на GitHub или GitLab: 508 правил, у каждого есть способ проверки и источник, плюс 8 готовых конфигов и 17 шаблонов файлов репозитория и CI. Профиль собрал владелец репозитория только по публичным источникам: гайдам google/styleguide, eng-practices, документации Google Open Source, открытым репозиториям, книге и статьям сотрудников. Парный репозиторий [k1sur1n/yandex-codestyle](https://github.com/k1sur1n/yandex-codestyle/tree/main) устроен так же и описывает профиль Яндекса; сравнение двух профилей в [comparison/](comparison/README.md) опубликовано в обоих репозиториях одним и тем же текстом, различаются только ссылки.

## Быстрый старт

Пути ниже относятся к этому репозиторию, команды выполняются в корне вашего проекта.

1. Положите файлы репозитория и лицензию:

   ```sh
   cp templates/repo/{README,CONTRIBUTING,SECURITY,CODE_OF_CONDUCT}.md .
   curl -fsSL https://www.apache.org/licenses/LICENSE-2.0.txt -o LICENSE
   ```

   Замените все `<PLACEHOLDER>` и удалите комментарии-шапки. В `CONTRIBUTING.md` оставьте один вариант условий вклада: свой CLA или DCO.
2. Скопируйте шаблоны площадки: `templates/github/*` в `.github/` (шаблоны PR и issue, CODEOWNERS, `workflows/lint.yml`); для GitLab вместо этого `templates/gitlab/*` в `.gitlab/`, а `.gitlab-ci.yml` в корень.
3. Поставьте редакторские настройки и хуки:

   ```sh
   cp configs/.editorconfig .editorconfig
   cp configs/.pre-commit-config.yaml .pre-commit-config.yaml
   pip install pre-commit
   pre-commit install
   pre-commit run --all-files
   ```

   В хуке addlicense замените `<COPYRIGHT_HOLDER>`, уберите хуки языков, которых у вас нет. `pre-commit install` ставит и стадию `commit-msg`.
4. Скопируйте конфиги языков. Python: секции `[tool.pyink]`, `[tool.isort]`, `[tool.ruff*]`, `[tool.mypy]`, `[tool.pytest.ini_options]` из `configs/python/pyproject.toml` в свой `pyproject.toml`, затем `curl -fsSLO https://google.github.io/styleguide/pylintrc` (файл Apache-2.0, в профиль не скопирован). C++: `cp configs/cpp/.clang-format .clang-format` и `cp configs/cpp/.clang-tidy .clang-tidy`, в `.clang-tidy` сузьте `HeaderFilterRegex`. Веб: три файла из `configs/web/`.
5. Расставьте заголовки лицензии, чужой код держите в `third_party/`:

   ```sh
   go install github.com/google/addlicense@v1.2.0
   addlicense -c "<правообладатель>" -l apache -ignore "third_party/**" .
   ```

6. После первого зелёного прогона CI включите защиту `main`: статусы `lint` и `test` обязательны, одно одобрение, ревью владельцев кода, только squash-слияние. Точные настройки для GitHub и GitLab в [docs/adoption.md, шаг 11](docs/adoption.md#шаг-11-защита-ветки-и-слияние). Там же выбирается вариант коммитов и релизов: A, предложение без префикса и ручные теги, или B, Conventional Commits и release-please (только GitHub).

Полный чек-лист, отдельно для нового и для существующего репозитория, лежит в [docs/adoption.md](docs/adoption.md). В шапке каждого конфига указана версия инструмента и то, запускался ли файл локально.

## Что внутри

- `docs/`: 508 правил в 26 областях, 17 документов по языкам, фреймворкам, git и ML; плюс матрица проверок [enforcement.md](docs/enforcement.md) и чек-листы внедрения [adoption.md](docs/adoption.md).
- `configs/`: 8 файлов для копирования в проект: `.editorconfig`, `.pre-commit-config.yaml`, `pyproject.toml`, `.clang-format`, `.clang-tidy`, конфиги ESLint, Prettier и Stylelint.
- `templates/`: 17 файлов: README, CONTRIBUTING, SECURITY и CODE_OF_CONDUCT, шаблоны PR и issue, CODEOWNERS и CI для GitHub и для GitLab, карточки модели и данных.
- `research/`: отчёт [google.md](research/google.md) о том, откуда взят каждый факт, и [open-issues.md](research/open-issues.md) с замечаниями и открытыми вопросами (общий для обоих репозиториев).
- `comparison/`: 8 документов о различиях с Яндексом, тот же текст лежит в yandex-codestyle.
- [NOTICE.md](NOTICE.md): заимствованные фрагменты, скопированные конфиги, строки атрибуции CC-BY.

<details><summary>Полное дерево файлов</summary>

```text
google-codestyle/
├── README.md
├── NOTICE.md
├── docs/
│   ├── languages/
│   │   ├── python.md                Python
│   │   ├── cpp.md                   C++
│   │   └── other.md                 TS/JS, Java, Kotlin, Go, C#, Rust, PHP, Ruby
│   ├── frameworks/
│   │   ├── angular.md               Angular вместе с HTML/CSS
│   │   ├── react.md                 React (не Google)
│   │   ├── django.md                Django
│   │   └── fastapi.md               FastAPI
│   ├── git/
│   │   ├── repository.md            обязательные файлы, лицензии, CLA, документация, GitHub и GitLab
│   │   ├── commits.md               сообщения коммитов
│   │   ├── branches.md              ветки и процесс PR/MR
│   │   ├── code-review.md           код-ревью
│   │   └── releases.md              версии, теги, релизы, changelog
│   ├── ml/
│   │   ├── project-structure.md     структура ML-проекта, конфиги экспериментов, типизация тензоров
│   │   ├── notebooks.md             ноутбуки в репозитории
│   │   ├── reproducibility.md       сиды, детерминизм, окружение, трекинг
│   │   ├── mlops.md                 данные и веса, пайплайны, CI/CD, реестр, мониторинг, карточки, C++ в ML
│   │   └── libraries.md             TensorFlow, Keras, JAX, Flax, PyTorch, scikit-learn, Hugging Face
│   ├── enforcement.md               матрица «правило → инструмент / ручное ревью»
│   └── adoption.md                  чек-листы внедрения
├── configs/
│   ├── .editorconfig
│   ├── .pre-commit-config.yaml
│   ├── python/
│   │   └── pyproject.toml           секции [tool.pyink], [tool.isort], [tool.ruff*], [tool.mypy], [tool.pytest.ini_options]
│   ├── cpp/
│   │   ├── .clang-format            BasedOnStyle: Google, PointerAlignment: Left явно
│   │   └── .clang-tidy              google-* плюс поимённые проверки
│   └── web/
│       ├── eslint.config.js
│       ├── .prettierrc.json
│       └── .stylelintrc.json
├── templates/
│   ├── repo/
│   │   ├── README.md
│   │   ├── CONTRIBUTING.md
│   │   ├── SECURITY.md
│   │   └── CODE_OF_CONDUCT.md
│   ├── github/
│   │   ├── PULL_REQUEST_TEMPLATE.md
│   │   ├── ISSUE_TEMPLATE/
│   │   │   ├── bug_report.md
│   │   │   ├── feature_request.md
│   │   │   └── config.yml
│   │   ├── CODEOWNERS
│   │   └── workflows/
│   │       └── lint.yml
│   ├── gitlab/                      перенос на GitLab (не Google)
│   │   ├── merge_request_templates/
│   │   │   └── Default.md
│   │   ├── issue_templates/
│   │   │   ├── Bug.md
│   │   │   └── Feature.md
│   │   ├── CODEOWNERS
│   │   └── .gitlab-ci.yml
│   └── ml/
│       ├── MODEL_CARD.md
│       └── DATA_CARD.md
├── research/
│   ├── google.md                    полный отчёт: разделы A-F брифа
│   └── open-issues.md               замечания и открытые вопросы (общий для обоих репозиториев)
└── comparison/                      тот же текст лежит в yandex-codestyle
    ├── README.md                    главные отличия, сводная таблица, навигация
    ├── approach.md                  философия, история, создание правил, контроль соблюдения, монорепозиторий
    ├── code.md                      Python, C++, фронтенд, Django и FastAPI, дополнительные языки
    ├── examples.md                  «один код, два стиля»: шесть пар примеров
    ├── repository.md                git, ревью и open source
    ├── ml.md                        MLE и MLOps
    ├── choosing.md                  что взять у каждой команды для своего стека
    └── glossary.md                  внутренние термины обеих компаний
```

</details>

Области и число правил в каждой:

| Область | Правил | Документ |
|---|---|---|
| Python (`PY`) | 65 | [docs/languages/python.md](docs/languages/python.md) |
| C++ (`CPP`) | 73 | [docs/languages/cpp.md](docs/languages/cpp.md) |
| TypeScript / JavaScript (`TS`) | 10 | [docs/languages/other.md](docs/languages/other.md) |
| Java (`JAVA`) | 10 | [docs/languages/other.md](docs/languages/other.md) |
| Kotlin (`KT`) | 10 | [docs/languages/other.md](docs/languages/other.md) |
| Go (`GO`) | 10 | [docs/languages/other.md](docs/languages/other.md) |
| C# (`CS`) | 9 | [docs/languages/other.md](docs/languages/other.md) |
| Rust (`RS`) | 7 | [docs/languages/other.md](docs/languages/other.md) |
| PHP (`PHP`) | 5 | [docs/languages/other.md](docs/languages/other.md) |
| Ruby (`RB`) | 6 | [docs/languages/other.md](docs/languages/other.md) |
| Angular (`NG`) | 32 | [docs/frameworks/angular.md](docs/frameworks/angular.md) |
| HTML / CSS (`CSS`) | 19 | [docs/frameworks/angular.md](docs/frameworks/angular.md) |
| React (`REACT`) | 15 | [docs/frameworks/react.md](docs/frameworks/react.md) |
| Django (`DJ`) | 15 | [docs/frameworks/django.md](docs/frameworks/django.md) |
| FastAPI (`FAPI`) | 13 | [docs/frameworks/fastapi.md](docs/frameworks/fastapi.md) |
| Репозиторий (`REPO`) | 24 | [docs/git/repository.md](docs/git/repository.md) |
| Документация (`DOC`) | 11 | [docs/git/repository.md](docs/git/repository.md) |
| Коммиты (`GIT`) | 17 | [docs/git/commits.md](docs/git/commits.md) |
| Ветки (`BR`) | 13 | [docs/git/branches.md](docs/git/branches.md) |
| Код-ревью (`CR`) | 18 | [docs/git/code-review.md](docs/git/code-review.md) |
| Релизы (`REL`) | 12 | [docs/git/releases.md](docs/git/releases.md) |
| Структура ML-проекта (`ML`) | 17 | [docs/ml/project-structure.md](docs/ml/project-structure.md) |
| Ноутбуки (`NB`) | 13 | [docs/ml/notebooks.md](docs/ml/notebooks.md) |
| Воспроизводимость (`REPRO`) | 19 | [docs/ml/reproducibility.md](docs/ml/reproducibility.md) |
| MLOps (`MLOPS`) | 31 | [docs/ml/mlops.md](docs/ml/mlops.md) |
| ML-библиотеки (`LIB`) | 34 | [docs/ml/libraries.md](docs/ml/libraries.md) |
| **Итого** | **508** | |

## Как читать правило

Все правила записаны одинаково. Вот одно из [docs/languages/python.md](docs/languages/python.md) без изменений:

```markdown
### G-PY-020 · MUST · Импорты стоят вверху файла: после докстринга модуля и до глобальных переменных и констант
- Проверка: `pylint C0413`; `ruff E402`, `PLC0415`.
- Источник: [§3.13 Imports formatting](https://google.github.io/styleguide/pyguide.html#s3.13-imports-formatting) (редакция 2026-09-10) · официальный гайд · высокая.
```

`G-PY-020` это ID: `G` значит Google, `PY` область, `020` порядковый номер в документе. ID постоянны: номер не переиспользуют и не сдвигают при правках, новое правило получает следующий номер в конце области, поэтому на правило можно ссылаться из ревью («G-PY-017: импортируйте модуль, а не функцию»), из `comparison/` и из других репозиториев. `MUST` стоит там, где формулировка источника обязательна (must, required, never, always) или правило навязано форматтером или CI проекта-источника; `SHOULD` это рекомендация, правило из практики или реконструкция.

Строка «Проверка» называет инструмент и код правила линтера, либо «ручное ревью», либо «частично: …», если инструмент закрывает только часть правила. Строка «Источник» даёт ссылку на раздел источника, дату или версию, тип источника и уверенность (`высокая`, `средняя`, `низкая`): насколько источник подтверждает правило в той форме, в какой оно записано. Три пометки в конце строки предупреждают о слабых местах. «· реконструкция» значит, что правило выведено из практики открытых репозиториев Google, и в нём указана доля, например «18 из 24». «· не Google» значит, что публичных данных Google не нашлось и взят внешний источник. «· архив» значит, что источник заархивирован; действующие правила на таких источниках не строятся. Если правило неочевидно, за строкой «Источник» идёт пример «плохо / хорошо». Объяснения причин в документах помечены словом «Интерпретация» и отделены от фактов; там, где искали и не нашли, написано «публичных данных не найдено».

Какой документ и какие конфиги нужны для вашего стека:

| Язык или область | Документ | Конфиги и шаблоны | Инструменты | Откуда правила |
|---|---|---|---|---|
| Python | [languages/python.md](docs/languages/python.md), G-PY-001…065 | [configs/python/pyproject.toml](configs/python/pyproject.toml); `pylintrc` скачивается с google.github.io | pyink 26.5.1, isort 9.0.2, pylint 4.1.2 + Google `pylintrc`, ruff 0.16.8, mypy 2.3.1, pytest 9.1.1 | гайд Google; ruff, isort, mypy, pytest не Google |
| C++ | [languages/cpp.md](docs/languages/cpp.md), G-CPP-001…073 | [configs/cpp/.clang-format](configs/cpp/.clang-format), [configs/cpp/.clang-tidy](configs/cpp/.clang-tidy); флаги clang++ в [enforcement.md](docs/enforcement.md) | clang-format 18.1.3 (`BasedOnStyle: Google`, указатели слева явно), clang-tidy 18.1.3, cpplint 2.0.2 (необязательно) | гайд Google; конфиг clang-tidy и форк cpplint не Google |
| TypeScript / JavaScript | [languages/other.md](docs/languages/other.md) §3, G-TS-001…010 | [configs/web/eslint.config.js](configs/web/eslint.config.js), [configs/web/.prettierrc.json](configs/web/.prettierrc.json) | ESLint 10.12.0 + typescript-eslint 8.71.1 (правила gts перенесены поштучно), Prettier 3.9.9, TypeScript ~6.0.3 | гайды Google (TS; JS заморожен); плагины ESLint не Google |
| Angular, HTML/CSS | [frameworks/angular.md](docs/frameworks/angular.md), G-NG-001…032, G-CSS-001…019 | те же файлы плюс [configs/web/.stylelintrc.json](configs/web/.stylelintrc.json) | angular-eslint 22.5.0, Prettier (парсер `angular` для HTML), Stylelint 17.16.0 | гайд Angular (Google) и HTML/CSS Style Guide; angular-eslint и Stylelint не Google |
| React | [frameworks/react.md](docs/frameworks/react.md), G-REACT-001…015 | блок `not-google/react` в [configs/web/eslint.config.js](configs/web/eslint.config.js) | eslint-plugin-react-hooks 7.1.1 | язык: TS-гайд Google; React не Google |
| Django | [frameworks/django.md](docs/frameworks/django.md), G-DJ-001…015 | `[tool.ruff.lint]` + `"DJ"`, `django-stubs` для mypy | ruff DJ*, mypy + django-stubs | не Google |
| FastAPI | [frameworks/fastapi.md](docs/frameworks/fastapi.md), G-FAPI-001…013 | `[tool.ruff.lint]` + `"FAST"` | ruff FAST* | не Google |
| Java | [languages/other.md](docs/languages/other.md) §4, G-JAVA-001…010 | секция `[*.java]` в [configs/.editorconfig](configs/.editorconfig); хуки в [.pre-commit-config.yaml](configs/.pre-commit-config.yaml) закомментированы | google-java-format 1.37.0, Error Prone 2.50.0; Checkstyle 14.3.0 с `google_checks.xml` по желанию | гайд Google; Checkstyle не Google |
| Kotlin | [languages/other.md](docs/languages/other.md) §5, G-KT-001…010 | секция `[*.{kt,kts}]` (`ktlint_code_style = android_studio`) | ktfmt 0.64 `--kotlinlang-style`, ktlint 1.8.0 | гайд Android (Google); ktfmt и ktlint не Google |
| Go | [languages/other.md](docs/languages/other.md) §6, G-GO-001…010 | секция `[*.go]`; хуки golangci-lint закомментированы | gofmt, go vet; golangci-lint v2.14.0 | гайд Google (Go Style: Guide, Decisions, Best practices); golangci-lint не Google |
| C# | [languages/other.md](docs/languages/other.md) §7, G-CS-001…009 | секция `[*.cs]` с опциями `csharp_*` / `dotnet_*` | `dotnet format` | гайд Google; dotnet format не Google |
| Rust, PHP, Ruby | [languages/other.md](docs/languages/other.md) §8-10, G-RS-001…007, G-PHP-001…005, G-RB-001…006 | секции `.editorconfig`; хуки закомментированы | rustfmt + clippy; PHP-CS-Fixer 3.95 `@PER-CS`; RuboCop + gem `google-style` 1.32.0 | не Google, кроме gem `google-style` (googleapis/ruby-style) |
| Репозиторий и документация | [git/repository.md](docs/git/repository.md), G-REPO-001…024, G-DOC-001…011 | [templates/repo/](templates/repo/), [templates/github/](templates/github/), [templates/gitlab/](templates/gitlab/), секция `[*.md]` | addlicense v1.2.0; markdownlint по желанию (не Google) | документация OSPO, google/new-project, docguide (Google) |
| Коммиты | [git/commits.md](docs/git/commits.md), G-GIT-001…017 | блоки `commitlint.config.mjs` в документе; задание `commit-messages` в CI | commitlint 21.2.3 | eng-practices + cbea.ms (Google ссылается); Conventional Commits и commitlint не Google |
| Ветки, ревью, релизы | [git/branches.md](docs/git/branches.md), G-BR-001…013; [git/code-review.md](docs/git/code-review.md), G-CR-001…018; [git/releases.md](docs/git/releases.md), G-REL-001…012 | таблицы настроек GitHub и GitLab в документах; блоки release-please в releases.md | настройки хостинга; release-please 17.11.2 / action v5.0.0 (только GitHub) | eng-practices и книга SWE (Google); ветки и релизы: практика репозиториев; GitLab: перенос |
| ML: структура, ноутбуки, воспроизводимость | [ml/project-structure.md](docs/ml/project-structure.md), G-ML-001…017; [ml/notebooks.md](docs/ml/notebooks.md), G-NB-001…013; [ml/reproducibility.md](docs/ml/reproducibility.md), G-REPRO-001…019 | хуки nbstripout/jupytext в [.pre-commit-config.yaml](configs/.pre-commit-config.yaml); задание `notebooks` в CI; фрагменты `.gitignore`/`.gitattributes` в документах | absl + ml_collections (Google); nbstripout 0.9.1, jupytext 1.19.6, uv (не Google) | принципы Google + практика Flax/JAX/tensorflow-docs; часть не Google |
| MLOps и ML-библиотеки | [ml/mlops.md](docs/ml/mlops.md), G-MLOPS-001…031; [ml/libraries.md](docs/ml/libraries.md), G-LIB-001…034 | [templates/ml/MODEL_CARD.md](templates/ml/MODEL_CARD.md), [templates/ml/DATA_CARD.md](templates/ml/DATA_CARD.md); хуки gitleaks, check-added-large-files | TFX, TFDV (Google); gitleaks, DVC, Git LFS (не Google) | Rules of ML, ML Test Score, MLOps-документ Google Cloud; TF/Keras/JAX/Flax Google; PyTorch, scikit-learn, Hugging Face не Google |

Scala и Elixir исключены; обоснование по опросам 2025-2026 в [languages/other.md](docs/languages/other.md) §1.

## Откуда правила и насколько им верить

Правила лежат в трёх слоях, и слой каждого правила виден по строке «Источник».

Первый слой: письменные правила Google. Это Google Python Style Guide (редакция 2026-09-10), C++ Style Guide (2026-09-29), гайды TypeScript, JavaScript, Java, Go, C#, HTML/CSS и Markdown (docguide) из google/styleguide; Angular style guide (angular.dev, редакция 2025); Kotlin style guide (developer.android.com); eng-practices (Code Review Developer Guide, «Writing good CL descriptions»); документация Google OSPO и шаблон google/new-project; Rules of ML, The ML Test Score, «Hidden Technical Debt», документ Google Cloud об уровнях MLOps; документация TensorFlow, Keras, JAX, Flax. Отсюда взяты Python, C++, большая часть дополнительных языков, Angular, репозиторий, ревью, часть коммитов, MLOps и ML-библиотеки Google. Пометок у таких правил нет.

Второй слой: практика открытых репозиториев Google. Где письменного правила нет, профиль измерил 24 репозитория организаций Google, googleapis, GoogleCloudPlatform, tensorflow, keras-team, google-deepmind, google-research и 755 проектов google-research и записал практику большинства с долей, например «18 из 24», обычно на уровне `SHOULD`. Так получены ветки и squash-слияние, теги и release-please, язык коммитов, ноутбуки (flax, jax, tensorflow/docs), каркас ML-проекта (примеры Flax), lock-файлы и CODEOWNERS. Правил с пометкой «· реконструкция» 45.

Третий слой: не Google. Публичных данных Google нет для React (взяты Rules of React от команды React), Django, FastAPI, Rust, PHP, Ruby (кроме gem `google-style`), PyTorch, scikit-learn и Hugging Face. Сюда же относятся инструменты, которых Google не называет: ruff, mypy, isort, clang-tidy (конфиг собран профилем), форк cpplint, Prettier, typescript-eslint, angular-eslint, Stylelint, commitlint, pre-commit, nbstripout, jupytext, gitleaks, markdownlint, Git LFS, DVC, а также все настройки GitLab (Google не публикует материалов для GitLab). Правил с источником «· не Google» 83.

| Слой | Пометка в строке «Источник» | Правил |
|---|---|---|
| Письменные правила Google | нет | все остальные |
| Практика 24 открытых репозиториев Google | `· реконструкция` | 45 |
| Общепринятая альтернатива или инструмент не от Google | `· не Google` | 83 |

Из 508 правил 188 уровня `MUST` и 320 уровня `SHOULD`; инструмент проверяет целиком 168 правил, частично 163, остальные 177 остаются на ревью. Числа посчитаны скриптом по строкам правил (2026-10-09) и совпадают с [docs/enforcement.md](docs/enforcement.md).

Два факта стоит знать до внедрения. Google не принимает внешние правки в google/styleguide: это экспорт внутренних гайдов, и он меняется (в сентябре и октябре 2026 года изменились C++ и Haskell, удалены AngularJS и ES5 JavaScript), поэтому в каждом документе стоит дата актуальности, а в строках «Источник» редакции и коммиты. Инструменты, которые называют сами гайды, частично не поддерживаются: pytype в архиве с 2026-09-03 (профиль берёт mypy, «не Google»), cpplint удалён из google/styleguide 2024-07-08 (профиль предлагает форк cpplint/cpplint как необязательный), eslint-config-google в архиве с 2026-06-01 (не используется), yapf не обновляется с 2024-11 (профиль берёт pyink). Как решены эти конфликты, написано в [python.md](docs/languages/python.md) (раздел 11 «Гайд против инструментов и против практики»), [cpp.md](docs/languages/cpp.md) (раздел 9 «Инструменты и машиночитаемые конфиги») и [other.md](docs/languages/other.md) (раздел 2 «Сводная таблица»). Архивные источники (`google/eslint-config-google`, `google/pytype`, Model Card Toolkit) названы архивными в тексте, а в строке «Источник» помечены `· архив`.

Пользователь профиля не Google, поэтому обязательства, которые есть только у проектов Google, показаны как варианты, а не как правила: CLA Google (в шаблоне [CONTRIBUTING.md](templates/repo/CONTRIBUTING.md) свой CLA или DCO), дисклеймер «This is not an officially supported Google product» (в шаблоне README строка о статусе поддержки с `<ORG>`), канал g.co/vulnz и адрес opensource@google.com (в [SECURITY.md](templates/repo/SECURITY.md) свой контакт), статус `cla/google` в обязательных проверках (своя проверка условий вклада).

Где источники расходятся, профиль выбрал один вариант. Python: публичный гайд, 4 пробела, 80 колонок, pyink; практика 2 пробелов в открытых репозиториях Google описана как известное расхождение, но не принята. C++: публичный гайд с `BasedOnStyle: Google` и явно заданным выравниванием указателей (пресет изменился в clang-format 21.1). Проверка типов: mypy вместо архивного pytype («не Google»).

## Чего здесь нет

- Часть инструментов не запускалась. Реестры npm и PyPI из среды сборки были недоступны, поэтому pyink, isort, pylint, cpplint, commitlint, фреймворк pre-commit, Stylelint, nbstripout, jupytext, плагины ESLint (typescript-eslint, angular-eslint), release-please и DVC не исполнялись; их конфиги сверены с исходниками на закреплённых версиях. Локально проверены clang-format и clang-tidy 18.1.3, ruff 0.16.8, mypy 2.3.1, pyright 1.1.414 (закомментированная альтернатива mypy), Prettier без плагинов, Python 3.13. Шапка каждого конфига говорит, запускался ли он.
- Практика git измерена по выборке, а не по организации: 24 репозитория Google (7 006 коммитов) плюс шаблон google/new-project как эталон, по 300 последних коммитов на репозиторий. Pull request как объекты не измерялись (API GitHub был недоступен); настройки защиты веток видны только там, где лежат в репозитории как код. Долю вроде «19 из 24» нужно читать как свойство выборки.
- О внутренних практиках (Piper, Critique, readability, TAP, LSC) известно из книги «Software Engineering at Google» (2020) и статей 2016-2018 годов; актуальных цифр после 2020 года нет. Внутренние проверки pylint `g-*` и другие внутренние документы недоступны.
- Источники меняются. Всё датировано 2026-10-09. В сентябре и октябре 2026 года google/styleguide пережил серию изменений: экспорт Haskell-гайда, удаление гайдов AngularJS и ES5 JavaScript, обновление C++-гайда и миграция HTML → Markdown, при которой у перенесённых гайдов могут меняться якоря ссылок. Уже после даты среза, 2026-10-15, Python-гайд вернул скобочную форму `TODO` (см. [research/open-issues.md](research/open-issues.md)). Ссылки на файлы репозиториев закреплены на коммитах, ссылки на сайты нет.
- Книга SWE (CC BY-NC-ND 4.0) только пересказана. Полный текст статьи CACM 2016 о монорепозитории Google и опроса ICSE-SEIP 2018 получить не удалось; их цифры взяты из вторичных источников, и это оговорено при каждой цифре.
- Сравнение в `comparison/` опирается и на источники Яндекса. Их ограничения (выборка из 25 репозиториев, реконструкция практик git и ML, недоступные внутренние документы Аркадии) описаны в [README yandex-codestyle](https://github.com/k1sur1n/yandex-codestyle/blob/main/README.md) и в [yandex-codestyle/research/yandex.md](https://github.com/k1sur1n/yandex-codestyle/blob/main/research/yandex.md#метод-и-ограничения).
- 11 вопросов остаются за вами: лицензия шаблона карточки данных, формат `TODO` в Python после правки гайда, ширина строки TypeScript 80 или 100, обязательность английского языка в коммитах и другие. Они собраны в [research/open-issues.md](research/open-issues.md) вместе с тем, что было исправлено при проверке и что оставлено как есть.

Полный перечень того, что проверить не удалось, лежит в разделах [«Метод и ограничения»](research/google.md#метод-и-ограничения) и [«Чего в публичном доступе нет»](research/google.md#чего-в-публичном-доступе-нет) отчёта.

## Лицензии

Текст этого репозитория (правила, отчёт, сравнение, список замечаний, шаблоны и комментарии в конфигах) написан своими словами и принадлежит владельцу репозитория. Файла `LICENSE` здесь нет намеренно: выберите лицензию для собственного текста сами и положите её в корень. Парный репозиторий лицензируется отдельно.

Заимствованные фрагменты и скопированные конфиги перечислены в [NOTICE.md](NOTICE.md) с источником, лицензией и местом использования. Основные лицензии источников: тексты google/styleguide и eng-practices CC-BY 3.0, `pylintrc` из google/styleguide Apache-2.0 (в профиль не скопирован, скачивается при внедрении), документация opensource.google и developers.google.com CC BY 4.0, гайд Angular CC BY 4.0. Лицензии CC-BY требуют указания авторства: строки атрибуции приведены в [NOTICE.md, раздел 2](NOTICE.md#2-атрибуция-требование-cc-by), при переносе фрагментов в свой проект их нужно сохранить. Шаблон карточки данных берёт названия тем из Data Cards Playbook, у которого README называет CC BY-SA 4.0, а файл LICENSE Apache-2.0; это расхождение разобрано в [NOTICE.md, раздел 4](NOTICE.md#4-data-cards-playbook-проверка-лицензии-и-решение-профиля), а решение остаётся за вами ([research/open-issues.md](research/open-issues.md), № 1). Где лицензия источника не установлена, в NOTICE и в карте источников стоит «лицензия не проверена». Источники Яндекса, на которые опирается `comparison/`, перечислены в [NOTICE парного репозитория](https://github.com/k1sur1n/yandex-codestyle/blob/main/NOTICE.md).

## Как обновлять

1. Сверьте карту источников ([раздел A отчёта](research/google.md#a-карта-источников)) с текущим состоянием: у каждого источника указаны статус, дата последнего содержательного изменения и, для файлов репозиториев, коммит. Изменения гайдов Google видны по истории ветки `gh-pages` репозитория google/styleguide.
2. Правила не перенумеровывайте. Изменившееся правило правьте под тем же ID, устаревшее помечайте в тексте, а не удаляйте, новое добавляйте в конец области со следующим номером. Так ссылки из ревью, из `comparison/` в обоих репозиториях и из чужих репозиториев остаются верными.
3. После правок обновите дату актуальности в шапке изменённых документов, счётчики в этом README и в `docs/enforcement.md` (их считает скрипт по строкам правил) и версии инструментов в шапках конфигов. Если конфиг перепроверен локально, поправьте строку «Проверено локально».
4. Новый заимствованный фрагмент или скопированный конфиг: новая строка в [NOTICE.md](NOTICE.md).
5. `comparison/*.md` и `research/open-issues.md` одинаковы в обоих репозиториях. Правку в них вносите в обе копии, меняя только ссылки.

## Связанные материалы

- [research/google.md](research/google.md): полный отчёт, карта источников, измерение репозиториев, внутренние практики (Piper, Critique, readability, TAP), конфликты, ML.
- [research/open-issues.md](research/open-issues.md): что требует вашего решения, что исправлено, что оставлено и почему.
- [comparison/README.md](comparison/README.md): чем отличаются подходы двух компаний и почему; дальше по разделу: [approach.md](comparison/approach.md), [code.md](comparison/code.md), [examples.md](comparison/examples.md), [repository.md](comparison/repository.md), [ml.md](comparison/ml.md), [choosing.md](comparison/choosing.md), [glossary.md](comparison/glossary.md).
- [docs/enforcement.md](docs/enforcement.md): какое правило проверяет инструмент, какое ревьюер.
- [docs/adoption.md](docs/adoption.md): чек-листы внедрения для нового и существующего репозитория, GitHub и GitLab.
- [NOTICE.md](NOTICE.md): заимствованные фрагменты, скопированные конфиги, лицензии, атрибуция CC-BY.
- [k1sur1n/yandex-codestyle](https://github.com/k1sur1n/yandex-codestyle/blob/main/README.md): парный профиль Яндекса (правила `Y-…`) и отчёт [research/yandex.md](https://github.com/k1sur1n/yandex-codestyle/blob/main/research/yandex.md).
