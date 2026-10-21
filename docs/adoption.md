# Чек-листы внедрения профиля Google

> Данные актуальны на 2026-10-09.

Два чек-листа: для нового репозитория (16 шагов: файлы репозитория → конфиги → заголовки лицензии → CI → защита ветки → коммиты и релизы → ML) и для существующего (инвентаризация → один форматирующий коммит с `.git-blame-ignore-revs` → линтеры по очереди → заголовки и `third_party/` → процесс). Каждый шаг называет файлы профиля, которые нужно скопировать, команды и правила, которые он закрывает. Варианты для GitHub и GitLab даны рядом; всё, что касается GitLab, - перенос (не Google). Как сам Google внедряет стиль, публично известно мало: внутри компании форматирование и линтеры запускает presubmit монорепозитория, а в открытых репозиториях проверки есть у 13 из 24 (см. [research/google.md](../research/google.md)); чек-листы ниже - конструкция профиля по его правилам.

## 0. Перед началом

Решения, которые нужно принять один раз и записать в `CONTRIBUTING.md`:

| Решение | Варианты | Где описано |
|---|---|---|
| Площадка | GitHub (`templates/github/`) или GitLab (`templates/gitlab/`, перенос - не Google) | раздел 3 |
| Формат коммитов и релизов | **A** (по умолчанию): предложение-приказ без префикса, заголовок ≤ 72 символов, релизы вручную тегом `vX.Y.Z` + `CHANGELOG.md`; **B**: Conventional Commits, заголовок ≤ 100, release-please (только GitHub, для библиотек с частыми релизами). Не смешивать | [git/commits.md](git/commits.md), [git/releases.md](git/releases.md) |
| Условия вклада | свой CLA **или** DCO (`Signed-off-by`); CLA Google и статус `cla/google` доступны только проектам Google | [git/repository.md](git/repository.md) (G-REPO-017), [templates/repo/CONTRIBUTING.md](../templates/repo/CONTRIBUTING.md) |
| Набор Python-инструментов | **A**: pyink + isort + pylint (Google `pylintrc`) + ruff (линтер) + mypy; **B** («не Google»): ruff format + ruff check + pylint + mypy | [languages/python.md](languages/python.md), шапка [configs/python/pyproject.toml](../configs/python/pyproject.toml) |
| Версии инструментов | закрепить те, что в шапках конфигов: clang-format/clang-tidy 18.1.3, pyink 26.5.1, ruff 0.16.8, mypy 2.3.1, pylint 4.1.2, ESLint 10.12.0, Prettier 3.9.9, TypeScript ~6.0.3; одна версия в pre-commit, CI и у разработчиков | шапки файлов в [configs/](../configs/) |

Заполнители в файлах профиля: `<PROJECT>`, `<ORG>`, `<COPYRIGHT_HOLDER>` / `<правообладатель>`, `<CLA_URL>`, `<SECURITY_CONTACT_EMAIL>`, `PACKAGE_DIR` (каталог пакета Python в CI), `SELECTOR_PREFIX` (префикс селекторов Angular в `eslint.config.js`), `myproject` (каталог проекта в `.clang-format`). Комментарии-шапки шаблонов (`<!-- … -->`, `# …`) после копирования удаляются: в шаблонах PR и issue они иначе попадут в текст каждого PR.

## 1. Новый репозиторий

Порядок важен: сначала файлы и конфиги, потом заголовки и CI, затем настройки площадки - обязательные статусы можно включить только после первого успешного прогона.

### Шаг 1. Файлы репозитория

- Скопировать `templates/repo/README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` в корень; заменить заполнители; удалить комментарии-шапки.
- Положить `LICENSE`: текст Apache License 2.0 с <https://www.apache.org/licenses/LICENSE-2.0.txt> без правок (в профиле копии нет).
- В `README.md` ответить на пять вопросов (что это и зачем, к кому обращаться, каков статус, как пользоваться, где документация) и записать статус поддержки своими словами - дисклеймер «not an officially supported Google product» относится только к проектам Google.
- Правила: G-REPO-001, G-REPO-002, G-REPO-003, G-REPO-004, G-REPO-005, G-REPO-018, G-DOC-001, G-DOC-002.

```sh
cp templates/repo/{README,CONTRIBUTING,SECURITY,CODE_OF_CONDUCT}.md .
curl -fsSL https://www.apache.org/licenses/LICENSE-2.0.txt -o LICENSE
```

### Шаг 2. Условия вклада

- В `CONTRIBUTING.md` оставить один вариант: свой CLA (вариант A шаблона, ссылка `<CLA_URL>`) или DCO (вариант B: `git commit -s`, трейлер `Signed-off-by`).
- Проверку сделать обязательным статусом: внешний сервис проверки CLA или DCO-бот на GitHub, своё задание или внешний сервис на GitLab - «не Google».
- Правила: G-REPO-003, G-REPO-017, G-GIT-010.

### Шаг 3. Шаблоны площадки и владельцы кода

| | GitHub | GitLab (перенос - не Google) |
|---|---|---|
| Шаблон PR / MR | `templates/github/PULL_REQUEST_TEMPLATE.md` → `.github/PULL_REQUEST_TEMPLATE.md` | `templates/gitlab/merge_request_templates/Default.md` → `.gitlab/merge_request_templates/Default.md` |
| Шаблоны issue | `templates/github/ISSUE_TEMPLATE/*` → `.github/ISSUE_TEMPLATE/` | `templates/gitlab/issue_templates/*.md` → `.gitlab/issue_templates/` |
| Владельцы кода | `templates/github/CODEOWNERS` → `.github/CODEOWNERS` | `templates/gitlab/CODEOWNERS` → `.gitlab/CODEOWNERS` (или корень, `docs/`); обязательное одобрение владельцев - Premium и Ultimate |

- В `CODEOWNERS` - не меньше двух владельцев на путь (отпуска, увольнения); общее правило первым, частные - ниже.
- Правила: G-REPO-007, G-REPO-020, G-CR-016.

### Шаг 4. Редактор и pre-commit

```sh
cp configs/.editorconfig .editorconfig
cp configs/.pre-commit-config.yaml .pre-commit-config.yaml
# заменить <COPYRIGHT_HOLDER> в хуке addlicense; убрать хуки языков, которых нет
pip install pre-commit
pre-commit install            # ставит хуки pre-commit и commit-msg (default_install_hook_types)
pre-commit run --all-files    # первый прогон: форматтеры правят файлы, их нужно закоммитить
```

- Если в проекте нет документационных ноутбуков - оставить один хук `nbstripout` без `exclude`; нет Python или C++ - удалить соответствующие блоки.
- Хукам `gitleaks` и `addlicense` нужен Go (`language: golang`), хуку `commitlint` - Node.js; без них используйте варианты `gitleaks-system` и установку `go install github.com/google/addlicense@v1.2.0`.
- Правила: G-PY-005, G-DOC-009 (хвостовые пробелы), G-MLOPS-002, G-MLOPS-004, G-MLOPS-005 (большие файлы, ключи, секреты), G-REPO-009.

### Шаг 5. Python

- Скопировать секции `[tool.pyink]`, `[tool.isort]`, `[tool.ruff*]`, `[tool.mypy]`, `[tool.pytest.ini_options]` из `configs/python/pyproject.toml` в `pyproject.toml` проекта; поправить `src_paths`, `target-version` / `python_version` под минимальную версию Python проекта.
- Скачать `pylintrc` (Apache-2.0, в профиль не скопирован) и закоммитить его в корень.
- Для Django добавить `"DJ"` в `select` ruff и `django-stubs` для mypy; для FastAPI - `"FAST"` ([frameworks/django.md](frameworks/django.md), [frameworks/fastapi.md](frameworks/fastapi.md)).
- Отформатировать всё одним коммитом «Format with pyink and isort» до любых содержательных правок.

```sh
curl -fsSLO https://google.github.io/styleguide/pylintrc
python -m pip install "pyink==26.5.1" "isort==9.0.2" "pylint==4.1.2" "ruff==0.16.8" "mypy==2.3.1" "pytest==9.1.1"
pyink . && isort .
pyink --check --diff . && isort --check-only --diff . && ruff check . \
  && pylint --rcfile=pylintrc --disable=consider-using-f-string src/ && mypy src/ && pytest
```

- Правила: G-PY-001, G-PY-002, G-PY-004, G-PY-010, G-PY-022, G-PY-042, G-PY-043, G-PY-048, G-PY-061, G-PY-065; расхождения гайда и инструментов - раздел 11 «Гайд против инструментов и против практики» в [languages/python.md](languages/python.md).

### Шаг 6. C++

```sh
cp configs/cpp/.clang-format .clang-format
cp configs/cpp/.clang-tidy .clang-tidy
# в .clang-tidy сузить HeaderFilterRegex до каталогов проекта, например '(src|include)/.*'
git ls-files '*.cc' '*.h' ':!:third_party/**' | xargs clang-format-18 -i          # форматирующий коммит
cmake -S . -B build -DCMAKE_EXPORT_COMPILE_COMMANDS=ON -DCMAKE_CXX_STANDARD=20 \
      -DCMAKE_CXX_EXTENSIONS=OFF -DCMAKE_CXX_COMPILER=clang++-18
git ls-files '*.cc' ':!:third_party/**' | xargs clang-tidy-18 -p build --warnings-as-errors='*'
```

- Флаги сборки, которые закрывают правила гайда (в `CMAKE_CXX_FLAGS` или `copts`): `-std=c++20 -fno-exceptions -Wimplicit-fallthrough -Wctad-maybe-unsupported -Wreorder-init-list -Wdeprecated-this-capture -Wold-style-cast -Wvla -Wexit-time-destructors -Wglobal-constructors`. `-fno-exceptions` и `-Wold-style-cast` могут ломать сторонние заголовки - подключайте их через `-isystem`.
- Расширения файлов нового кода - `.cc` / `.h` / `.inc`; тесты - `foo_test.cc`.
- Правила: G-CPP-001 … G-CPP-006, G-CPP-010, G-CPP-011 … G-CPP-017, G-CPP-019, G-CPP-022, G-CPP-034, G-CPP-071, G-CPP-073.

### Шаг 7. Фронтенд (Angular, React, HTML/CSS)

Новый Angular-проект:

1. `ng new <имя>` - умолчания Angular CLI 22 уже дают имена файлов редакции 2025 (`fileNameStyleGuide: "2025"`), standalone-компоненты, `OnPush`, Prettier в devDependencies.
2. `ng add angular-eslint`, затем заменить сгенерированный `eslint.config.js` файлом `configs/web/eslint.config.js` и задать `SELECTOR_PREFIX`.
3. Удалить сгенерированный `.prettierrc` (он имеет приоритет над `.prettierrc.json`), положить `configs/web/.prettierrc.json` и `configs/web/.stylelintrc.json`.
4. Закрепить версии: `npm install --save-dev eslint@10.12.0 @eslint/js@10.0.1 typescript-eslint@8.71.1 angular-eslint@22.5.0 typescript@~6.0.3 prettier@3.9.9 stylelint@17.16.0` (TypeScript 7.x не входит в диапазон typescript-eslint).
5. В `package.json` - `"type": "module"` (иначе переименовать конфиг в `eslint.config.mjs`); `.prettierignore`: `dist/`, `coverage/`, `.angular/`, `package-lock.json`.

React-проект: удалить из `eslint.config.js` импорт `angular-eslint` и блоки 2-3, оставить блок `not-google/react` (`eslint-plugin-react-hooks@7.1.1`); default-экспорты заменить именованными либо точечно отключить `no-restricted-syntax` для файлов, где default требует инструмент (сниппет - в [frameworks/react.md](frameworks/react.md)).

Проверка: `npx prettier --check . && npx eslint . && npx stylelint "**/*.css"`. Ширина строки 100 (`printWidth` в `.prettierrc.json` и `max_line_length` в `.editorconfig`) - значение Angular CLI; без Angular удалите `printWidth` и поставьте 80 в `.editorconfig` (число JS-гайда и gts).

- Правила: G-TS-003, G-TS-004, G-NG-003 … G-NG-009, G-NG-013, G-NG-014, G-NG-029, G-NG-031, G-REACT-004, G-CSS-001, G-CSS-003.

### Шаг 8. Заголовки лицензии и чужой код

- Выбрать правообладателя - один на весь репозиторий (владелец прав либо «The <PROJECT> Authors» с файлом `AUTHORS`; имён авторов в файлах нет); год - год создания файла.
- Расставить заголовки отдельным коммитом; включить `addlicense -check` в CI (уже есть в шаблонах) и в pre-commit (шаг 4).
- Чужой код - в `third_party/<библиотека>/` с его `LICENSE`; заголовки в нём не трогать; завести список допустимых лицензий.

```sh
go install github.com/google/addlicense@v1.2.0
addlicense -c "<правообладатель>" -l apache -ignore "third_party/**" .
addlicense -check -c "<правообладатель>" -l apache -ignore "third_party/**" .
```

- Встроенный шаблон addlicense использует `http://www.apache.org/licenses/LICENSE-2.0`; текст OSPO с `https://` - через свой файл шаблона (`-f`, Go-шаблон с `{{.Year}}`, `{{.Holder}}`). Текст заголовка - в [git/repository.md](git/repository.md) и в `templates/repo/CONTRIBUTING.md`.
- Правила: G-REPO-010 … G-REPO-016.

### Шаг 9. Имена и терминология

- Ветка по умолчанию - `main`; не использовать `master`, `slave`, `whitelist`, `blacklist` в именах, комментариях и документации (имена, закреплённые внешним API, остаются).
- Проверка: `git grep -nwiE 'whitelist|blacklist|slave'`.
- Правила: G-REPO-019, G-BR-002, G-CPP-033.

### Шаг 10. CI

| | GitHub | GitLab (перенос - не Google) |
|---|---|---|
| Файл | `templates/github/workflows/lint.yml` → `.github/workflows/lint.yml` | `templates/gitlab/.gitlab-ci.yml` → `.gitlab-ci.yml` |
| Что сделать | заменить `<COPYRIGHT_HOLDER>`, `PACKAGE_DIR`; удалить задания для отсутствующих языков; тесты - отдельный workflow `test` | то же; проверить теги образов (`python:3.12`, `ubuntu:24.04`, `node:24`, `golang:1.24` - не проверялись из среды сборки); `include: Jobs/Secret-Detection.gitlab-ci.yml` даёт задание `secret_detection` на всех тарифах |
| Требования Google OSPO к workflow (G-REPO-024) | «a fixed version of the action MUST be used by specifying a specific commit»: `uses:` закреплены на SHA с версией в комментарии; `permissions: contents: read`; `timeout-minutes`; `concurrency`; `persist-credentials: false` | аналога нет: закрепляйте теги образов и версии `include` (правила Google нет) |
| Обновление закреплённых версий | Dependabot или Renovate (15 из 24 репозиториев Google используют хотя бы один) - «не Google» как правило | Renovate |

- Правила: G-REPO-022, G-REPO-024, G-BR-010, G-BR-011, G-CR-005.

### Шаг 11. Защита ветки и слияние

GitHub (Settings → General и Settings → Branches / Rules):

- Default branch - `main`.
- Pull Requests: оставить только «Allow squash merging»; сообщение squash-коммита - «Pull request title and description»; включить «Automatically delete head branches».
- Защита `main`: «Require pull request reviews before merging» (1 одобрение, «Require review from Code Owners»), «Require status checks before merging» (статусы `lint`-заданий и `test`) + «Require branches to be up to date before merging», «Require conversation resolution before merging», «Require linear history»; «Allow force pushes» и «Allow deletions» выключены; «Do not allow bypassing the above settings» - по решению команды (у googleapis `isAdminEnforced: false`).
- У внешних участников нет административного доступа; merge queue - по желанию (тогда в workflow нужен триггер `merge_group`).

GitLab (перенос - не Google):

- Settings → Repository → Protected branches: `main`, «Allowed to push and merge» - No one, «Allowed to merge» - Maintainers (или Developers + Maintainers), «Allowed to force push» выключено.
- Settings → Merge requests: Merge method - «Fast-forward merge»; «Squash commits when merging» - «Require»; «Squash commit message template» - `%{title}` и ниже `%{description}`; Merge checks - «Pipelines must succeed», все треды разрешены.
- «Required approvals» (1) и «Require approval from code owners» - Premium и Ultimate. На Free правила G-CR-001 и G-CR-016 выполняются организационно: договорённость в `CONTRIBUTING.md`, ревьюер ставит одобрение комментарием, слияние делает только мейнтейнер.

- Правила: G-REPO-021, G-REPO-023, G-BR-005, G-BR-006, G-BR-011, G-BR-013, G-CR-001, G-CR-016, G-CR-017.

### Шаг 12. Сообщения коммитов

- Положить `commitlint.config.mjs` выбранного варианта (оба блока - в [git/commits.md](git/commits.md), раздел «Проверка: commitlint»); хук `commit-msg` уже установлен шагом 4 (без `default_install_hook_types` - `pre-commit install --hook-type commit-msg`).
- В CI задание `commit-messages` проверяет заголовок PR / MR (при squash он становится заголовком коммита) и коммиты ветки; при обязательном squash второй шаг можно сделать необязательным.
- Язык - английский (практика 24 из 24 репозиториев; письменного правила нет): для русскоязычной команды это самое спорное правило профиля - решите и запишите.
- Правила: G-GIT-001 … G-GIT-005, G-GIT-007, G-GIT-011, G-GIT-013, G-GIT-015.

### Шаг 13. Релизы

- Вариант A: теги `vX.Y.Z` (SemVer), `CHANGELOG.md` или заметки релиза на площадке; защита тегов `v*` (тег не перемещается).
- Вариант B (GitHub): три файла из [git/releases.md](git/releases.md) - `release-please-config.json`, `.release-please-manifest.json`, `.github/workflows/release-please.yml` (action v5.0.0, закреплён на SHA `45996ed1f6d02564a971a2fa1b5860e934307cf7`); в Settings → Actions → General включить «Allow GitHub Actions to create and approve pull requests». Со встроенным `GITHUB_TOKEN` на Release PR не запускаются другие workflow: если `lint` - обязательный статус, нужен отдельный токен (секрет) или ручной запуск проверок.
- GitLab: release-please не работает; минимальное задание с ключевым словом `release:` по тегу - в [git/releases.md](git/releases.md); альтернатива - `semantic-release` с `@semantic-release/gitlab` (не Google, версия не проверялась).
- Записать срок поддержки прошлой мажорной версии.
- Правила: G-REL-001, G-REL-003, G-REL-004, G-REL-005, G-REL-007, G-REL-008, G-REL-009, G-REL-010.

### Шаг 14. Договорённости о ревью в CONTRIBUTING.md

- Размер изменения - ориентир 100 строк (книга SWE - около 200), один логический шаг; рефакторинг - отдельным PR.
- Срок первого ответа ревьюера - один рабочий день; метки необязательных замечаний «Nit:», «Optional:», «FYI:».
- Правила: G-BR-007, G-BR-008, G-CR-006, G-CR-007; порядок ревью - [git/code-review.md](git/code-review.md).

### Шаг 15. ML-проект (если применимо)

1. Каркас по [ml/project-structure.md](ml/project-structure.md), раздел 2: `configs/default.py` с `get_config()`, исполняемый модуль с `app.run(main)` и флагами `--config`, `--workdir`; библиотечные модули с тестами рядом (G-ML-001, G-ML-002, G-ML-009, G-ML-012).
2. `lock_config=True`; действующий конфиг сохраняется в рабочий каталог запуска (G-ML-010, G-REPRO-015).
3. `.gitignore`: рабочие каталоги запусков, `**/.ipynb_checkpoints`, данные, веса, чекпойнты (`/data/`, `/models/`, `/checkpoints/`, `*.ckpt`, `*.safetensors`, `*.keras`, `*.h5`, `*.pt`, `*.onnx`), логи трекеров, `.env` (G-ML-003, G-NB-003, G-MLOPS-002, G-MLOPS-004); `.gitattributes`: `*.ipynb text eol=lf`. Файлы DVC (`*.dvc`, `dvc.yaml`, `dvc.lock`) коммитятся.
4. Способ хранения больших файлов - объектное хранилище, DVC или Git LFS (`git lfs track`; проверьте поддержку и квоту LFS на хостинге) (G-MLOPS-003).
5. Хуки nbstripout и jupytext (шаг 4), задание `notebooks` в CI (G-NB-001, G-NB-009).
6. Сид в конфиге, выставляется в точке входа: `keras.utils.set_random_seed`, `jax.random.key(config.seed)`; версия датасета, а не «latest» (G-REPRO-001, G-REPRO-004, G-REPRO-014, G-LIB-018, G-MLOPS-006).
7. Зависимости: lock-файл с хешами для библиотеки или сервиса (`uv pip compile requirements.in --universal --generate-hashes --python-version 3.12 -o requirements_lock_3_12.txt`), `requirements.txt` с `==` для каталога эксперимента (G-REPRO-012, G-REPRO-013).
8. Тест воспроизводимости на коротком запуске, тест одного шага обучения и круга «экспорт → загрузка → предсказание» - в CI (G-REPRO-011, G-MLOPS-013).
9. Шаблон записи об эксперименте и журнал метрик в рабочем каталоге (G-REPRO-017, G-REPRO-018).
10. `templates/ml/MODEL_CARD.md` и `templates/ml/DATA_CARD.md` рядом с моделью и датасетом (G-MLOPS-025, G-MLOPS-026; о лицензии DATA_CARD - [NOTICE.md](../NOTICE.md), раздел 4); формат модели без исполняемого кода - `.keras`, safetensors, `state_dict` (G-LIB-011, G-LIB-028, G-LIB-033); для продакшен-сервиса - `docs/ml-test-score.md` (G-MLOPS-019).
11. Необязательный фрагмент ruff для ML-кода (`S101`, `S301`, `PLR0913`, `TID251` с запретом `tensorflow.compat.v1`, `tf_keras`, `flax.training.checkpoints`) - в [ml/libraries.md](ml/libraries.md) и [ml/mlops.md](ml/mlops.md).

### Шаг 16. Дополнительные языки

Правила и команды - [languages/other.md](languages/other.md); хуки - закомментированный блок в `configs/.pre-commit-config.yaml`; секции `.editorconfig` уже на месте. Конфиги рядом с кодом, которых нет в дереве профиля (все - не Google, кроме gem `google-style`):

```yaml
# .golangci.yml - golangci-lint v2.14.0 (не Google); ключи сверены с .golangci.reference.yml
version: "2"
linters:
  default: standard        # errcheck, govet, ineffassign, staticcheck, unused
  enable:
    - revive
  settings:
    staticcheck:
      checks: ["all"]
formatters:
  enable:
    - gofmt
    - goimports
  settings:
    goimports:
      local-prefixes:
        - github.com/org/project
```

```yaml
# .rubocop.yml - RuboCop с gem google-style 1.32.0 (googleapis/ruby-style); в Gemfile: gem "google-style"
inherit_gem:
  google-style: google-style.yml
```

```toml
# rustfmt.toml - умолчания rustfmt (не Google); значение совпадает с edition в Cargo.toml
style_edition = "2024"
```

Java - `google-java-format-1.37.0-all-deps.jar --dry-run --set-exit-if-changed` и Error Prone 2.50.0 (`-XDcompilePolicy=simple --should-stop=ifError=FLOW -Xplugin:ErrorProne`); Kotlin - ktfmt 0.64 только с `--kotlinlang-style` (флаг `--google-style` даёт 2 пробела и противоречит публичному гайду); Go - без лимита длины строки (`lll` и `golines` не включать); C# - `dotnet format --verify-no-changes` читает `.editorconfig`; PHP - `php-cs-fixer check --rules=@PER-CS`; Ruby - `bundle exec rubocop`.

## 2. Существующий репозиторий

Принцип: механические изменения отдельно от содержательных, инструменты включаются по одному, старый код не переименовывается ради правил об именах (гайды Google разрешают существующему коду оставаться в своём стиле: G-NG-001, G-CPP-010 для расширений файлов).

### 2.1. Инвентаризация (baseline)

- Сравнить корень с таблицей «Файлы и структура» в [git/repository.md](git/repository.md): чего нет из `LICENSE`, `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `.gitignore`, `.editorconfig`, `CODEOWNERS`, шаблонов PR и issue (G-REPO-001 … G-REPO-007, G-REPO-020).
- Снять текущую картину линтеров без исправлений - это и есть baseline:

```sh
ruff check --statistics .
pylint --rcfile=pylintrc --disable=consider-using-f-string --exit-zero src/ | tail -n 3
mypy src/ | tail -n 1
git ls-files '*.cc' '*.h' ':!:third_party/**' | xargs clang-format-18 --style=file --dry-run 2>&1 | grep -c warning
```

- Перед публикацией закрытого репозитория - очистка истории от секретов и внутренних данных (G-REPO-009): прогон gitleaks по всей истории (подкоманда `gitleaks git`, та же, что в `entry` хука; запуск напрямую не проверялся); найденные секреты отозвать (удаление из истории их не обезвреживает).
- Записать в issue или `docs/adoption-status.md`, какие правила включены, какие - цель миграции.

### 2.2. Один форматирующий коммит и `.git-blame-ignore-revs`

Форматирование всего дерева - одним механическим коммитом без содержательных правок (так просит, например, CONTRIBUTING Abseil); его хеш - в `.git-blame-ignore-revs`, чтобы `git blame` его не показывал (GitHub читает этот файл автоматически).

```sh
git switch -c format-with-profile
pyink . && isort .                                                   # Python (G-PY-001, G-PY-022)
git ls-files '*.cc' '*.h' ':!:third_party/**' | xargs clang-format-18 -i   # C++ (G-CPP-003)
npx prettier --write .                                               # веб (G-TS-003)
git commit -am "Format code with pyink, isort, clang-format and Prettier"
git rev-parse HEAD >> .git-blame-ignore-revs
git add .git-blame-ignore-revs && git commit -m "Add formatting commit to .git-blame-ignore-revs"
git config blame.ignoreRevsFile .git-blame-ignore-revs               # локально у каждого
```

- Этот PR сливается первым, до включения обязательных проверок; одновременно - `.editorconfig` и `.pre-commit-config.yaml` (шаг 4 раздела 1).

### 2.3. Линтеры по одному

Python ([languages/python.md](languages/python.md)):

1. ruff: `ruff check --statistics`, автоисправимое - `ruff check --fix` отдельным коммитом; `D` (докстринги) на старом коде даёт больше всего замечаний - вводить по каталогам через `[tool.ruff.lint.per-file-ignores]`.
2. pylint с Google `pylintrc` на pylint 4.1.2: первый запуск может выдать сообщения об устаревших именах в `disable=` (не проверено запуском); на старом коде начать с `--exit-zero` и порога по числу сообщений, затем убрать.
3. mypy: `disallow_any_generics` и `check_untyped_defs` на старом коде шумят - вводить по модулям через `[[tool.mypy.overrides]]`; сначала публичные API (G-PY-042).
4. Правила без инструмента (импорт только модулей - G-PY-017, `staticmethod` - G-PY-050, вложенные comprehension - G-PY-049) - в чек-лист ревью для нового кода, старый код не переписывать.

C++ ([languages/cpp.md](languages/cpp.md)):

1. clang-tidy сначала без `--warnings-as-errors`; первыми - проверки с автоисправлением (`--fix`): `google-explicit-constructor`, `google-readability-casting`, `modernize-use-nullptr`, `modernize-use-override`, `google-readability-braces-around-statements`; каждая - отдельным коммитом.
2. Переименования под `readability-identifier-naming` (G-CPP-011 … G-CPP-017) - отдельными изменениями по каталогам или `// NOLINT(readability-identifier-naming)` для имён, закреплённых внешним API.
3. `-fno-exceptions` (G-CPP-034) включать только если код действительно не использует исключения; иначе правило - цель миграции, а не проверка.
4. Унаследованные `.cpp` / `.hpp` не переименовывать (G-CPP-010 действует для нового кода); добавить расширения в глобы хуков и CI.

Фронтенд ([frameworks/angular.md](frameworks/angular.md)):

1. Не переименовывать файлы и классы со старыми суффиксами (G-NG-001, G-NG-004); Angular CLI при обновлении сам сохраняет старую схему генерации.
2. DI - миграцией `ng generate @angular/core:inject` (G-NG-013).
3. Включать правила блоками: `prettier --write`, затем ESLint; `@angular-eslint/prefer-signals` и `prefer-host-metadata-property` на старом коде дадут много срабатываний - временно понизить до `warn`.

### 2.4. Заголовки лицензии и чужой код

- Заголовки - отдельным изменением (`addlicense` правит файлы на месте); год - год создания файла, не текущий: для старых файлов задать `-y` или поправить вручную (G-REPO-011).
- Найти чужой код вне `third_party/` и перенести; заголовки в нём не трогать; `-ignore "third_party/**"` во всех командах (G-REPO-014, G-REPO-015).
- `git grep -nwiE 'whitelist|blacklist|slave'`; имена, закреплённые внешним API, оставить (G-REPO-019).

### 2.5. Процесс

1. commitlint - только на новых PR / MR (`--from base --to head`), историю не переписывать (G-GIT-003 … G-GIT-005).
2. Переименование `master` → `main` - по решению команды: Google существующие проекты не переименовывает (9 из 24 остаются на `master`); G-BR-002 - SHOULD.
3. Слияние переключить на squash, merge-коммиты выключить, прямой push в основную ветку закрыть (G-BR-005, G-BR-006).
4. Долгоживущие ветки разработки удалить или описать план их слияния (G-BR-001).
5. Обязательные статусы включать после того, как `lint` и `test` прошли на основной ветке хотя бы раз (G-REPO-022).
6. release-please (вариант B): задать точку отсчёта - текущую версию в `.release-please-manifest.json` и `bootstrap-sha` в конфиге; формат старых тегов не менять, новый - с очередного релиза (так делали googletest, keras, leveldb) (G-REL-003, G-REL-009).
7. CODEOWNERS заполнить по фактическим владельцам каталогов; минимум два на путь (G-CR-016).

### 2.6. ML-репозиторий - дополнительно

1. `nbstripout` по рабочим ноутбукам одним отдельным коммитом, затем хук и CI-проверка; документационные ноутбуки, где выводы нужны, перевести на пары `.ipynb` + `.md` (`jupytext --set-formats ipynb,md:myst`) и внести их каталог в исключения (G-NB-001, G-NB-009).
2. Большие файлы в истории: `git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sort -k3 -n | tail` - оставить, перенести в LFS (`git lfs migrate`) или в хранилище (G-MLOPS-002, G-MLOPS-003).
3. Код, который импортируется из ноутбуков или продублирован в нескольких ноутбуках, - в модули с тестами (G-NB-011, G-NB-012).
4. Исследовательские каталоги отделить от продакшен-пакетов; каждому - README, файл зависимостей, команда запуска (G-ML-004).
5. Захардкоженные гиперпараметры - в `configs/`; существующий gin-код не переписывать, оставить один корневой `@gin.configurable` и сохранять operative config (G-ML-009, G-ML-013).
6. Объявления и чтение флагов убрать из библиотечных модулей (G-ML-011, G-ML-012).
7. Проверить сиды всех генераторов и версии датасетов (G-REPRO-001, G-REPRO-014); найти `pickle`, `torch.load` без `weights_only=True`, `safe_mode=False`, `compat.v1`, `flax.training.checkpoints` (G-LIB-004, G-LIB-011, G-LIB-012, G-LIB-026, G-LIB-028).
8. Код преобразования признаков - один для обучения и обслуживания (G-MLOPS-011); посчитать ML Test Score «как есть» и выбрать группу с минимальной суммой как следующий шаг (G-MLOPS-019); описать процедуру выкладки и отката модели (G-MLOPS-021).
9. Удалить мёртвые экспериментальные ветки кода и неиспользуемые флаги (G-ML-006).

## 3. GitHub и GitLab: что переносится, а что нет

| Задача | GitHub | GitLab (перенос - не Google) |
|---|---|---|
| Шаблоны PR / MR и issue | `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/` (Markdown или YAML-формы) | `.gitlab/merge_request_templates/`, `.gitlab/issue_templates/` (только Markdown; `/label ~bug` - quick action) |
| Владельцы кода | `.github/CODEOWNERS`, «Require review from Code Owners» - все тарифы | `CODEOWNERS` с секциями `[Имя]`; «Require approval from code owners» - Premium и Ultimate |
| Обязательные проверки | required status checks по именам заданий | «Pipelines must succeed»; отдельные задания не выбираются |
| Число одобрений | в правилах защиты ветки - все тарифы | «Required approvals» - Premium и Ultimate; на Free - организационно |
| Squash-слияние | «Allow squash merging», «Pull request title and description» | «Squash commits when merging: Require», шаблон `%{title}` / `%{description}`, «Fast-forward merge» |
| Закрепление зависимостей CI | `uses:` на SHA (письменное правило Google) | теги образов и `include` - по аналогии, правила Google нет |
| Заголовки лицензии | addlicense в workflow и pre-commit | тот же CLI в задании с образом Go |
| Сканер секретов | gitleaks через pre-commit (или `gitleaks/gitleaks-action`, не проверялось) | встроенный шаблон `Jobs/Secret-Detection.gitlab-ci.yml` (все тарифы; результаты в MR - Ultimate) |
| Проверка сообщений коммитов | задание `commit-messages` (commitlint) | то же задание; серверная альтернатива - push rule «Require expression in commit messages» (Premium и Ultimate) |
| Релизы | release-please (вариант B), GitHub Releases | `release:` в `.gitlab-ci.yml`; release-please не работает |
| Общие файлы организации | репозиторий `<org>/.github` | аналога для файлов нет |
| Аудит настроек | `ossf/scorecard-action` v2.4.4 (4 из 24 репозиториев Google) | публичных данных не найдено |
| Проверка условий вклада | приложение Google CLA - только проекты Google; для своего проекта - внешний сервис CLA или DCO-бот | своё задание или внешний сервис |

## 4. Чего профиль не делает

- Не копирует обязательства Google: CLA Google, дисклеймер о продукте Google, канал g.co/vulnz, статус `cla/google`, бот `header-checker-lint` и приложение release-please (оба объявлены устаревшими) - вместо них показаны собственные варианты.
- Не воспроизводит внутренние практики монорепозитория (presubmit, TAP, readability, крупномасштабные изменения): что из них имеет смысл в обычном git, разобрано в [comparison/approach.md](../comparison/approach.md) и [research/google.md](../research/google.md).
- Не запускал инструменты, недоступные из среды сборки (pyink, isort, pylint, cpplint, pre-commit, commitlint, nbstripout, jupytext, gitleaks, addlicense, Stylelint, настоящие плагины ESLint): команды и опции сверены с документацией и исходниками; первый прогон у вас - это и проверка профиля. Полный список - в [enforcement.md](enforcement.md), раздел 8.
