# Версии, теги, релизы и changelog (профиль Google)

> Данные актуальны на 2026-10-09.

Единого документа «как Google выпускает релизы» нет. Есть политика Google Open Source о несовместимых
изменениях в библиотеках (для присоединившихся проектов: несовместимое изменение - новая мажорная версия, прошлая
поддерживается не меньше года), README клиентских библиотек Google Cloud («следуем SemVer») и инструмент
[release-please](https://github.com/googleapis/release-please), который по истории коммитов в формате Conventional
Commits сам считает версию, ведёт `CHANGELOG.md`, ставит тег и создаёт релиз на GitHub. Практика пёстрая: тег `vX.Y.Z`
у 14 репозиториев из 24, файл changelog у 13, release-please - только у 4. Профиль берёт SemVer и теги `vX.Y.Z` как
вариант по умолчанию, а release-please - как рекомендованную автоматизацию там, где принят Conventional Commits.
GitLab release-please не поддерживает; для него ниже дан перенос с пометкой «не Google».

Связанные документы: [коммиты](commits.md), [ветки](branches.md), [код-ревью](code-review.md),
[состав репозитория](repository.md).

## Источники

| Источник | Что задаёт | Статус |
|---|---|---|
| [Google Open Source: OSS Libraries breaking change policy](https://opensource.google/documentation/policies/library-breaking-change) (CC BY 4.0) | Мажорная версия при несовместимом изменении, release notes, срок поддержки | Страница не обновлялась с 2023-01-18; действует только для проектов, которые к ней присоединились; не касается Chromium, Android и серверных API |
| [Semantic Versioning 2.0.0](https://semver.org/) (CC BY 3.0) | Сама схема MAJOR.MINOR.PATCH | Спецификация сообщества, автор Tom Preston-Werner; не Google |
| [release-please](https://github.com/googleapis/release-please) и [release-please-action](https://github.com/googleapis/release-please-action) (Apache-2.0) | Автоматизация: версия, changelog, тег, релиз | Активны: CLI v17.11.2 (2026-08-24), action v5.0.0 (2026-04-22). GitHub-приложение release-please объявлено устаревшим |
| [AIP-180](https://google.aip.dev/180), [AIP-181](https://google.aip.dev/181), [AIP-185](https://google.aip.dev/185) | Версии и уровни стабильности сетевых API | Правила для API Google, не для репозиториев |
| [Abseil: releases](https://abseil.io/about/releases) и [compatibility](https://abseil.io/about/compatibility) | «Live at head» и LTS-снимки | Производный гайд проекта |
| [Go: module version numbering](https://go.dev/doc/modules/version-numbers) | SemVer с обязательным `v` и `/vN` в пути модуля | Производный гайд проекта |
| Измерение 24 репозиториев (теги, ветки, changelog) | Фактические доли | Практика; подробности - в [отчёте](../../research/google.md) |

## Какие схемы версий встречаются у Google

| Схема | Где | Пример тега | Когда уместна |
|---|---|---|---|
| **SemVer, тег `vX.Y.Z`** (вариант профиля) | 14 из 24: googletest, guava, keras, tensorflow, release-please и другие | `v17.11.2` | Библиотека или инструмент с публичным API и пользователями, которые закрепляют версии |
| SemVer с префиксом компонента | 3 из 24: google-cloud-go, google-cloud-python, jax | `spanner/v1.96.1`, `jax-v0.11.2` | Несколько пакетов в одном репозитории |
| `X.Y.Z` без `v` | 2 из 24: bazel, pyink | `9.3.0` | - |
| Дата | 2 из 24: abseil-cpp, re2 | `20260817.0`, `2025-11-05` | Модель «live at head»: пользователи собираются из свежей основной ветки, а тег - только снимок |
| Без тегов и релизов | 2 из 24: google-research, python-docs-samples | - | Исследовательский код и примеры |

Трёхчастный номер - не гарантия SemVer по смыслу: go-github поднимает мажорную версию почти в каждом релизе (от
`v84.0.0` до `v92.0.0` с конца февраля по середину сентября 2026 года), flatbuffers и pyink кодируют в номере дату.
Abseil прямо предупреждает, что его LTS-снимки не стоит считать версиями и что ABI не гарантируется.

## Правила

### G-REL-001 · MUST · Библиотека версионируется по SemVer: несовместимое изменение публичного API повышает мажорную версию
- Проверка: частично: release-please вычисляет версию по коммитам (`!` или `BREAKING CHANGE:` дают мажорную, см. [G-GIT-014](commits.md)); совместимость самого API - ручное ревью.
- Источник: [Google Open Source, OSS Libraries breaking change policy](https://opensource.google/documentation/policies/library-breaking-change) (2023-01-18) · официальный гайд · высокая; [Semantic Versioning 2.0.0, п. 8](https://semver.org/) · сторонний источник · высокая · не Google.
- MUST - по формулировке политики; сама политика обязательна только для присоединившихся к ней проектов и не
  обновлялась с 2023 года. Клиентские библиотеки Google Cloud заявляют SemVer в своих README
  ([google-cloud-node](https://github.com/googleapis/google-cloud-node), [google-cloud-java](https://github.com/googleapis/google-cloud-java)).
  В выборке трёхчастная версия - у 19 репозиториев из 24.

### G-REL-002 · SHOULD · Версии `0.y.z` считаются нестабильными; обещание совместимости начинается с `1.0.0`
- Проверка: ручное ревью; в release-please поведение до 1.0.0 задают `bump-minor-pre-major` и `bump-patch-for-minor-pre-major`.
- Источник: [Semantic Versioning 2.0.0, п. 4](https://semver.org/) · сторонний источник · высокая · не Google; [Go: module version numbering](https://go.dev/doc/modules/version-numbers) (на 2026-10-09) · производный гайд проекта · высокая.
- То же пишут библиотеки Google Cloud: версии `0.x.y` могут ломать совместимость в любой момент.

### G-REL-003 · SHOULD · Тег релиза имеет вид `vX.Y.Z`; в репозитории с несколькими пакетами - с префиксом компонента
- Проверка: регулярное выражение по именам тегов в CI; release-please создаёт тег сам (`include-v-in-tag`, `include-component-in-tag`).
- Источник: [измерение 24 репозиториев](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (`vX.Y.Z` - 14 из 24) · высокая · реконструкция; [схема конфига release-please](https://github.com/googleapis/release-please/blob/main/schemas/config.json) (v17.11.2) · конфиг или инструмент · высокая.
- Письменного правила о формате тега нет. Спецификация SemVer уточняет, что `v1.2.3` - это имя тега, а не сама
  версия; версия - `1.2.3`. Go требует префикс `v`. Аннотированные теги практикой Google не являются: в 19
  репозиториях из 24 большинство тегов лёгкие.

### G-REL-004 · SHOULD · Предварительная версия помечается суффиксом через дефис: `v2.0.0-rc.1`
- Проверка: регулярное выражение по именам тегов в CI.
- Источник: [Semantic Versioning 2.0.0, п. 9](https://semver.org/) · сторонний источник · высокая · не Google; [Go: module version numbering](https://go.dev/doc/modules/version-numbers) (на 2026-10-09) · производный гайд проекта · высокая.
- На практике написание разное: `v2.22.0-rc0` у tensorflow, `10.0.0rc1` у bazel. Профиль берёт вариант SemVer, потому
  что его понимают менеджеры пакетов и release-please (стратегия `prerelease`).

### G-REL-005 · MUST · Опубликованный тег не перемещают и не переиспользуют: исправление выходит новой версией
- Проверка: защита тегов на хостинге (правила для тегов в GitHub, protected tags в GitLab); остальное - ручное ревью.
- Источник: [Semantic Versioning 2.0.0, п. 3](https://semver.org/) · сторонний источник · высокая · не Google.
- У Google письменного правила об этом нет - публичных данных не найдено. Уровень MUST взят из формулировки SemVer.
  Исключение - «плавающие» теги мажорной версии у GitHub Actions (`v5` указывает на последний `v5.x.y`); README
  release-please-action описывает их как отдельный сценарий.

### G-REL-006 · SHOULD · Несовместимые изменения описаны в заметках к релизу вместе с тем, как на них перейти
- Проверка: ручное ревью; release-please выносит такие изменения в отдельный раздел changelog.
- Источник: [Google Open Source, OSS Libraries breaking change policy](https://opensource.google/documentation/policies/library-breaking-change) (2023-01-18) · официальный гайд · высокая.
- Текст для заметки берётся из футера `BREAKING CHANGE:` коммита, поэтому писать его нужно для пользователя библиотеки,
  а не для ревьюера.

### G-REL-007 · SHOULD · Предыдущая мажорная версия поддерживается не меньше 12 месяцев после выхода новой; больше одной мажорной версии в год не выпускают
- Проверка: ручное ревью.
- Источник: [Google Open Source, OSS Libraries breaking change policy](https://opensource.google/documentation/policies/library-breaking-change) (2023-01-18) · официальный гайд · высокая.
- Политика допускает более частые мажорные версии, но тогда команда поддерживает все предыдущие. Срок действует для
  присоединившихся проектов; для своей библиотеки запишите собственный срок в README или `SECURITY.md`. Поддержка
  ведётся из релизной ветки, см. [G-BR-012](branches.md).

### G-REL-008 · SHOULD · У проекта с релизами есть changelog: файл `CHANGELOG.md` в корне или заметки к каждому релизу на хостинге
- Проверка: наличие файла или релизов; при release-please файл создаётся автоматически.
- Источник: [измерение 24 репозиториев](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (файл changelog - 13 из 24) · высокая · реконструкция.
- Формат changelog Google не регламентирует - публичных данных не найдено. Из 13 файлов 4 ведёт release-please, 9
  пишутся вручную (`CHANGELOG.md`, `CHANGES.md`, `RELEASE.md`, `NEWS`); остальные 11 репозиториев обходятся GitHub
  Releases или не выпускают релизов. Guava и Bazel собирают заметки из трейлера `RELNOTES` в коммитах. Для ручного
  ведения подходит формат [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) (не Google).

### G-REL-009 · SHOULD · В репозитории с Conventional Commits версию, changelog, тег и релиз формирует release-please через Release PR; вручную их не правят
- Проверка: наличие `release-please-config.json`, `.release-please-manifest.json` и workflow с `googleapis/release-please-action`.
- Источник: [release-please README](https://github.com/googleapis/release-please#whats-a-release-pr) (v17.11.2, 2026-08-24) · конфиг или инструмент · высокая; [измерение 24 репозиториев](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (release-please - 4 из 24) · высокая.
- Это практика googleapis, а не требование ко всем проектам Google. Нужную версию при необходимости задают футером
  `Release-As: 2.0.0` в коммите, а не правкой файлов. Настройка - в разделе «release-please: настройка».

### G-REL-010 · SHOULD · Workflow релиза получает только те права, которые нужны релизу, и только на уровне задания
- Проверка: OpenSSF Scorecard `Token-Permissions`; ручное ревью workflow.
- Источник: [release-please-action README, «Workflow Permissions»](https://github.com/googleapis/release-please-action#workflow-permissions) (v5.0.0) · конфиг или инструмент · высокая; [измерение 24 репозиториев](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (`permissions:` объявлены во всех workflow - 14 из 24) · средняя · реконструкция.
- release-please-action нужны `contents: write`, `issues: write` и `pull-requests: write`; остальным заданиям
  достаточно `contents: read`, как в CI самого release-please. Само действие закрепляется на SHA коммита - это
  требование G-REPO-024 из [repository.md](repository.md). Для автора вне Google сторонним считается любое действие,
  включая `googleapis/release-please-action`.

### G-REL-011 · SHOULD · Публикация пакета - отдельный шаг, который запускается созданным релизом
- Проверка: ручное ревью workflow (триггер `release: published` или выход `release_created` у release-please-action).
- Источник: [release-please README](https://github.com/googleapis/release-please#readme) (v17.11.2) · конфиг или инструмент · высокая; [измерение 24 репозиториев](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (публикация из workflow - 9 из 24) · средняя · реконструкция.
- release-please пакеты не публикует. В pyink, abseil-py и keras публикация в PyPI запускается событием
  `release: published`, идёт в отдельном environment и использует `id-token: write` (trusted publishing) вместо
  долгоживущего токена.

### G-REL-012 · SHOULD · Сетевой API версионируется отдельно от кода: мажорная версия - в имени пакета или пути (`v1`), стабильность - `v1alpha`, `v1beta`, `v1`
- Проверка: ручное ревью.
- Источник: [AIP-185](https://google.aip.dev/185) (2024-10-22) · официальный гайд · высокая; [AIP-181](https://google.aip.dev/181) (2019-02-18) · официальный гайд · высокая.
- AIP - правила для API самого Google, там это «must»; профиль переносит их как рекомендацию. Минорные и patch-версии
  наружу не выставляются, а в пределах одной мажорной версии клиентский код ломать нельзя
  ([AIP-180](https://google.aip.dev/180)).

## release-please: что он делает

Инструмент поддерживает открытым специальный PR - Release PR. Пока в основную ветку попадают коммиты, он обновляет в
этом PR номер версии и текст changelog. Когда сопровождающий сливает Release PR, release-please:

1. обновляет `CHANGELOG.md` и файлы с версией (`pyproject.toml`, `package.json`, `version.txt` - зависит от типа);
2. ставит тег на коммит;
3. создаёт GitHub Release с текстом из changelog.

Как коммиты превращаются в версию и changelog:

| Коммит | Версия | Раздел changelog по умолчанию |
|---|---|---|
| `fix: …` | patch | Bug Fixes |
| `feat: …` | minor | Features |
| `feat!: …`, `fix!: …`, `refactor!: …`, футер `BREAKING CHANGE:` | major | BREAKING CHANGES (отдельный блок в начале записи) |
| `perf: …`, `revert: …` | README поводом для релиза их не называет | Performance Improvements, Reverts |
| `docs`, `chore`, `refactor`, `test`, `build`, `ci`, `style` | без релиза | скрыты |

По README, Release PR появляется, когда после прошлого релиза в ветке есть «releasable unit» - коммит типа `feat`,
`fix` или `deps` (для Java и Python - ещё и `docs`). Состав и названия разделов меняет ключ `changelog-sections`.

Чего release-please не делает: не публикует пакеты в npm, PyPI и другие реестры, не управляет сложными схемами веток,
не работает с GitLab (в README и документации GitLab не упоминается, все операции идут через API GitHub).

Статус на 2026-10-09: CLI - v17.11.2; action - v5.0.0, работает на Node 24, при этом README action всё ещё показывает
`@v4`; GitHub-приложение release-please объявлено устаревшим (отключение было назначено на 2025-08-13), остались CLI и
action. Три из четырёх репозиториев выборки с release-please по-прежнему держат конфиг приложения
(`.github/release-please.yml`); для нового проекта берите action.

## release-please: настройка

Нужны три файла. JSON не допускает комментариев, поэтому пояснения даны текстом.

`release-please-config.json` - что и как выпускать (проверено по схеме v17.11.2; не запускалось: реестр пакетов и
API GitHub недоступны из среды сборки):

```json
{
  "$schema": "https://raw.githubusercontent.com/googleapis/release-please/main/schemas/config.json",
  "release-type": "python",
  "include-component-in-tag": false,
  "bump-minor-pre-major": true,
  "packages": {
    ".": {}
  }
}
```

- `release-type` - стратегия: `python` (обновляет `pyproject.toml`, `<пакет>/__init__.py`, `CHANGELOG.md`), `node`,
  `go`, `rust`, `java`, `simple` и другие. Для C++ и любого проекта без поддерживаемого манифеста берите `simple`:
  версия хранится в `version.txt`.
- `include-component-in-tag: false` - тег вида `v1.2.3`. По умолчанию опция включена и тег получает префикс
  компонента; для одного пакета в репозитории он не нужен.
- `bump-minor-pre-major: true` - до версии 1.0.0 несовместимое изменение повышает минорную версию, а не мажорную.
- `packages` - пути пакетов; `"."` - корень. Для нескольких пакетов перечислите каталоги и оставьте
  `include-component-in-tag` включённым.

`.release-please-manifest.json` - последняя выпущенная версия каждого пакета; дальше файл обновляет сам инструмент:

```json
{
  ".": "0.1.0"
}
```

`.github/workflows/release-please.yml`:

```yaml
# Профиль Google: релизы через release-please.
# googleapis/release-please-action v5.0.0 (2026-04-22), нужен раннер с Node 24.
# Не запускалось: API GitHub недоступен из среды сборки. YAML разобран локально.
name: release-please

on:
  push:
    branches: [main]

permissions: {}

jobs:
  release-please:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    permissions:
      contents: write
      issues: write
      pull-requests: write
    steps:
      - uses: googleapis/release-please-action@45996ed1f6d02564a971a2fa1b5860e934307cf7 # v5.0.0
        with:
          # Со встроенным GITHUB_TOKEN проверки CI на Release PR не запускаются.
          # Чтобы они запускались, создайте токен и передайте его секретом.
          token: ${{ secrets.RELEASE_PLEASE_TOKEN || github.token }}
          config-file: release-please-config.json
          manifest-file: .release-please-manifest.json
```

Что учесть:

- В организации может понадобиться настройка «Allow GitHub Actions to create and approve pull requests».
- Сливайте PR через squash ([G-BR-006](branches.md)): release-please рекомендует это прямо, а исправить запись
  changelog задним числом (блок `BEGIN_COMMIT_OVERRIDE` в описании слитого PR) можно только для squash-коммитов.
- Первую версию задаёт запись в манифесте, а точку отсчёта истории - ключ `bootstrap-sha` в конфиге.
- Поддержка старой мажорной версии: ветку `N.x` добавляют в `on.push.branches`, а входу `target-branch` передают
  имя ветки; для исправлений подходит стратегия версий `always-bump-patch`.
- Release PR помечается `autorelease: pending`, после слияния - `autorelease: tagged`. Если новый Release PR не
  создаётся, проверьте, не осталась ли метка `autorelease: pending` на старом.

## Что показало измерение

Выборка - 24 репозитория Google на GitHub, срез 2026-10-09; формат и число тегов сняты через `git ls-remote`, каденция
посчитана по датам тегов, а не по GitHub Releases.

| Практика | Доля | Комментарий |
|---|---|---|
| Есть теги | 22 из 24 | без тегов - google-research и python-docs-samples |
| Последний стабильный тег - `vX.Y.Z` | 14 из 24 | ещё 2 - `X.Y.Z`, 3 - с префиксом компонента, 2 - дата, 1 - `X.Y` |
| Трёхчастная версия в любом написании | 19 из 24 | |
| Большинство тегов лёгкие | 19 из 24 | преимущественно аннотированные - re2, flatbuffers, jax |
| Есть файл changelog | 13 из 24 | автоматический - 4, ручной - 9 |
| release-please | 4 из 24 | gts, release-please, google-cloud-go, google-cloud-python |
| Есть релизные или LTS-ветки | 11 из 24 | |
| Пакет публикуется из workflow | 9 из 24 | |

Формат тегов менялся со временем: `release-1.12.1` → `v1.13.0` у googletest, `2.4.0` → `v3.x` у keras, `v1.20` → `1.21`
у leveldb. Каденция (медианный интервал между стабильными релизами за 24 месяца) - от 2 дней у google-cloud-go до 275
дней у googletest; у большинства библиотек - от трёх недель до двух месяцев (go-github 22 дня, flax 28, jax 29, keras
31, guava 43, abseil-cpp 49).

## GitHub и GitLab

| Задача | GitHub (источник Google) | GitLab (перенос, не Google) |
|---|---|---|
| Версия, changelog, тег, релиз | release-please-action | Публичных данных не найдено: release-please работает только с GitHub. Сторонняя замена - semantic-release с плагином [`@semantic-release/gitlab`](https://github.com/semantic-release/gitlab) (MIT), который публикует релиз в GitLab; настройка и версии здесь не проверялись |
| Релиз по тегу без вычисления версии | `gh release create` или интерфейс | Ключевое слово `release:` в `.gitlab-ci.yml` |
| Защита тегов (G-REL-005) | Правила для тегов | Protected tags |
| Публикация пакета | Событие `release: published` | Задание с `rules: if: $CI_COMMIT_TAG` |

Минимальное задание для GitLab - релиз при появлении тега (пример из
[документации GitLab](https://docs.gitlab.com/user/project/releases/release_cicd_examples/); не Google; не запускалось):

```yaml
release_job:
  stage: release
  image: registry.gitlab.com/gitlab-org/cli:latest
  rules:
    - if: $CI_COMMIT_TAG
  script:
    - echo "running release_job"
  release:
    tag_name: '$CI_COMMIT_TAG'
    description: '$CI_COMMIT_TAG'
```

В своём проекте замените `latest` конкретной версией образа: тот же принцип, что в G-REPO-024. Тег при этом ставит
человек или сторонний инструмент; changelog либо ведётся вручную (G-REL-008), либо генерируется тем же сторонним
инструментом.

## Чего в публичных источниках нет

- Общего для всех проектов Google правила о формате тегов и о том, аннотировать ли их.
- Формата `CHANGELOG.md` вне release-please.
- Требований к подписи тегов и релизных артефактов - публичных данных не найдено; в выборке отдельные проекты
  подключают SLSA-генератор (flatbuffers) и sigstore (re2).
- Единой страницы с политикой версий клиентских библиотек Google Cloud: формулировки есть только в README
  репозиториев.
- Каких-либо материалов о релизах на GitLab.
