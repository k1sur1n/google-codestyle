# Сообщения коммитов (профиль Google)

> Данные актуальны на 2026-10-09.

Единого формата коммитов у Google нет: общий гайд
[eng-practices](https://google.github.io/eng-practices/review/developer/cl-descriptions.html) задаёт содержание
(первая строка - короткий приказ, дальше «что и почему»), README стайлгайдов отсылает за формой к статье
[«How to Write a Git Commit Message»](https://cbea.ms/git-commit/), а Go, Chromium, AOSP и Angular держат собственные
форматы. Профиль берёт за формат по умолчанию связку «содержание по eng-practices, форма по cbea.ms»: предложение в
повелительном наклонении с заглавной буквы, без префикса типа и без точки, до 72 символов, тело с переносом на 72.
Conventional Commits - второй вариант, обязательный там, где релизы делает release-please
(в выборке это 4 репозитория из 24, и во всех четырёх формат соблюдён в 98-100 % коммитов). Смешивать оба формата в
одном репозитории нельзя. Проверка формы автоматизируется commitlint (не Google), смысл остаётся на ревью.

Связанные документы: [ветки и слияние](branches.md), [код-ревью](code-review.md), [релизы](releases.md),
[состав репозитория](repository.md).

## Откуда берутся правила

| Слой | Что задаёт | Статус |
|---|---|---|
| [eng-practices, «Writing good CL descriptions»](https://google.github.io/eng-practices/review/developer/cl-descriptions.html) (CC-BY 3.0, содержательная правка 2024-05-10) | Содержание: что и почему, первая строка как приказ, плохие и хорошие примеры, теги | Общий гайд Google для любых языков и проектов; формулировки уровня «should»; чисел длины нет |
| [README google/styleguide](https://github.com/google/styleguide/blob/gh-pages/README.md) → [cbea.ms/git-commit](https://cbea.ms/git-commit/) | Форма: семь правил статьи (пустая строка, 50/72, заглавная буква, без точки, повелительное наклонение, «что и почему») | Абзац добавлен 2025-01-17 ([a47f7e5](https://github.com/google/styleguide/commit/a47f7e5)); это рекомендация («please refer»), статья сторонняя (Chris Beams, 2014), не Google |
| [Go](https://go.dev/doc/contribute#commit_messages), [Chromium](https://chromium.googlesource.com/chromium/src/+/main/docs/contributing.md), [AOSP](https://source.android.com/docs/setup/contribute/submit-patches), [Angular](https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md) | Собственные форматы проектов с трейлерами Gerrit или типами | Обязательны только внутри своих проектов |
| [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) | `<type>[scope][!]: <description>`, футер `BREAKING CHANGE:` | Спецификация сообщества, не Google; выросла из правил Angular; у Google используется в googleapis и ещё нескольких проектах, которые ведутся прямо на GitHub |
| Измерение 24 репозиториев Google (7 006 коммитов) и трёх Gerrit-проектов | Фактические доли | Практика, а не правило; подробности - в [отчёте](../../research/google.md) |

В eng-practices изменение называется CL (changelist). В git-репозитории описание CL - это сообщение коммита, а при
squash-слиянии - заголовок и описание PR/MR.

## Формат по умолчанию

```text
<Резюме в повелительном наклонении, с заглавной буквы, без точки, до 72 символов>
<пустая строка>
<Тело: что изменено и почему; строки до 72 символов>
<пустая строка>
<Трейлеры: Fixes #123 / Updates #123 / Bug: ABC-123>
```

Почему выбран он, а не Conventional Commits:

1. Это единственная пара правил, которая опирается на оба общих документа Google и не противоречит ни одному
   производному формату: Go, Chromium и AOSP тоже укладываются в «короткая первая строка, пустая строка, тело на 72».
2. Так пишет половина выборки: в 12 репозиториях из 24, которые экспортируются из внутреннего монорепозитория
   (abseil-cpp, guava, bazel, tensorflow и другие), заголовок с заглавной буквы встречается в среднем в 86 % коммитов, а
   префикс типа Conventional Commits - в 1,1 %.
3. Conventional Commits нужен инструменту, а не читателю: он появляется там, где историю разбирает release-please.
   Поэтому профиль включает его правилом G-GIT-013, а не делает общим требованием.

## Варианты формата

| Формат | Где используется | Пример (реальный коммит) |
|---|---|---|
| **По умолчанию в профиле:** предложение-приказ без префикса | eng-practices; репозитории, экспортируемые из внутреннего монорепозитория (12 из 24); из ведущихся на GitHub - keras, flatbuffers, python-fire | `Support io.IOBase in keras.saving.load_model (#23873)` - [keras@09040cd](https://github.com/keras-team/keras/commit/09040cdb145d609507046ff25596eaeeedb0b603) |
| То же во внутреннем стиле: первая строка - законченное предложение с точкой | abseil-cpp, guava (точка в 91 % заголовков), re2, leveldb | `Include cord.h directly from status.cc.` - [abseil-cpp@37f69fa](https://github.com/abseil/abseil-cpp/commit/37f69fa448d5c2a291a6575054b90cae6dddf798) |
| **Conventional Commits** (второй вариант профиля) | release-please, google-cloud-go, google-cloud-python, gts, go-github (98-100 % коммитов); microservices-demo, python-docs-samples (64-74 %) | `fix(spanner): disable DirectPath fallback by default (#20648)` - [google-cloud-go@00f8c41](https://github.com/googleapis/google-cloud-go/commit/00f8c4132a1f056a8d8b03ea7624ea2b61f7ad10) |
| Angular: `<type>(<scope>): <summary>`, тело обязательно (кроме `docs`) | angular/angular; проверяет собственный инструмент `ng-dev`, не commitlint | `fix(compiler): strip script elements regardless of namespace` - [angular@97e6aa4](https://github.com/angular/angular/commit/97e6aa4a5579e7c968231b0864a3b3890c348863) |
| Go: `пакет: фраза со строчной буквы`, трейлеры `Fixes #N` и `Change-Id:` | go.googlesource.com (Gerrit); 97,7 % из 300 коммитов golang/go | `net/http: apply header limits to Trailer headers too` - [go@2557edd](https://github.com/golang/go/commit/2557edd671b4ec84af8a5841a621a6abab39774b) |
| Chromium: строка-резюме, тело на 72, футер `Bug:` / `Fixed:` | chromium.googlesource.com (Gerrit) | `[DevTools] Don't expose extensions to remote DevTools frontends` + `Bug: 553154932` - [chromium@dfc2c70](https://github.com/chromium/chromium/commit/dfc2c70c0c336002ebf22bdd6e06304c3273d01e) |
| AOSP: резюме до 50 символов с префиксом области, `Bug:` и `Test:` | android.googlesource.com (Gerrit) | `audio: Align api2aidl_NativeType_AudioDeviceDescription with native` + `Bug: 402026998`, `Test: atest AidlConversionUnitTests` - [frameworks/base@d7e56a6](https://android.googlesource.com/platform/frameworks/base/+/d7e56a686df669542aa5365f61c59c55c83b4795) |
| Тег области в квадратных скобках | jax (43 % коммитов), tensorflow (21 %), flatbuffers (17 %) | `[remat] don't DCE an effectful remat with no used inputs or outputs` - [jax@60a9811](https://github.com/jax-ml/jax/commit/60a9811fccc37c6f6efa7dd215c9789bf3b99ae3) |

Чем форматы отличаются по существу:

| Параметр | eng-practices + cbea.ms (профиль) | Go | Chromium | AOSP | Angular / Conventional Commits |
|---|---|---|---|---|---|
| Лимит первой строки | 50 - ориентир, 72 - предел (cbea.ms); в eng-practices числа нет | «как можно короче», около 72 нестрого | не задан | 50 символов | Angular: не ограничен (`maxLineLength: Infinity`); `config-conventional`: 100 |
| Первая буква | заглавная | строчная после двоеточия | не задано | не задано | строчная |
| Точка в конце | нет (cbea.ms); в примерах eng-practices встречается | нет | не задано | не задано | нет |
| Перенос тела | 72 | около 72 | 72 | 72, жёстко | не задан; `config-conventional`: 100 |
| Ссылка на задачу | «номера багов» в теле | `Fixes #N`, `Updates #N`, `For #N` | `Bug: N`, `Fixed: N` | `Bug: N` (хук repohooks) | `Fixes #N`, `Closes #N` |
| Обязательные трейлеры | нет | `Change-Id` | `Change-Id` | `Change-Id`; `Signed-off-by` при `git commit -s` | нет |
| Несовместимое изменение | не описано | не описано | не описано | не описано | `!` и/или `BREAKING CHANGE:` |
| Чем проверяется | ревью | Gerrit, `git codereview` | presubmit и commit queue | хуки `commit_msg_*` в `PREUPLOAD.cfg` | `ng-dev commit-message`; commitlint |

Источники таблицы: [eng-practices](https://google.github.io/eng-practices/review/developer/cl-descriptions.html),
[cbea.ms](https://cbea.ms/git-commit/), [go.dev/doc/contribute](https://go.dev/doc/contribute#commit_messages) и
[go.dev/wiki/CommitMessage](https://go.dev/wiki/CommitMessage),
[Chromium contributing.md](https://chromium.googlesource.com/chromium/src/+/main/docs/contributing.md),
[AOSP submit-patches](https://source.android.com/docs/setup/contribute/submit-patches) (2026-06-17) и
[repohooks](https://android.googlesource.com/platform/tools/repohooks/+/refs/heads/main/README.md),
[Angular](https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md) и его
[`.ng-dev/commit-message.mjs`](https://github.com/angular/angular/blob/main/.ng-dev/commit-message.mjs),
[`@commitlint/config-conventional`](https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/src/index.ts).

## Правила

Правила 001-012 и 015-017 действуют для обоих вариантов профиля. Правила 013-014 - только для варианта Conventional
Commits; в нём первая буква описания строчная, а остальные правила формы применяются к описанию после префикса.

### G-GIT-001 · SHOULD · Первая строка - короткое резюме того, что именно делает изменение, понятное без остального текста
- Проверка: ручное ревью.
- Источник: [eng-practices, «First Line»](https://google.github.io/eng-practices/review/developer/cl-descriptions.html#first-line) (2024-05-10) · официальный гайд · высокая.
- Пример:

```text
# плохо
Update train.py

# хорошо
Stop logging raw user queries in the training job
```

### G-GIT-002 · SHOULD · Первая строка написана в повелительном наклонении: «Add», а не «Added», «Adds» или «Adding»
- Проверка: ручное ревью (commitlint наклонение не проверяет).
- Источник: [eng-practices, «First Line»](https://google.github.io/eng-practices/review/developer/cl-descriptions.html#first-line) (2024-05-10) · официальный гайд · высокая; [cbea.ms, правило 5](https://cbea.ms/git-commit/) (2014) · сторонний источник · высокая · не Google.
- Остальной текст сообщения в повелительном наклонении писать не обязательно. В выборке первое слово - глагол-приказ в
  64-97 % коммитов (в среднем 80,5 %), формы третьего лица и прошедшего времени - не более 10 %.

### G-GIT-003 · MUST · После первой строки идёт пустая строка
- Проверка: commitlint `body-leading-blank`.
- Источник: [eng-practices, «First Line»](https://google.github.io/eng-practices/review/developer/cl-descriptions.html#first-line) (2024-05-10) · официальный гайд · высокая; [Conventional Commits 1.0.0, п. 6](https://www.conventionalcommits.org/en/v1.0.0/#specification) · сторонний источник · высокая · не Google.
- В eng-practices это «should»; профиль ставит MUST, потому что во всех производных форматах пустая строка обязательна
  (Chromium называет её «crucial», Conventional Commits и Angular требуют её), а git отделяет заголовок от тела именно
  по ней.

### G-GIT-004 · SHOULD · Первая строка не длиннее 72 символов; ориентир - 50
- Проверка: commitlint `header-max-length` (72).
- Источник: [README google/styleguide](https://github.com/google/styleguide/blob/gh-pages/README.md) (абзац от 2025-01-17) · официальный гайд · высокая; [cbea.ms, правило 2](https://cbea.ms/git-commit/) (2014) · сторонний источник · высокая · не Google.
- Практика мягче правила: медиана длины заголовка по 24 репозиториям - 56 символов, 90-й перцентиль - 84; медиана
  укладывается в 72 во всех 24, но в 12 из 24 более четверти заголовков длиннее 72. Поэтому 50 - цель, а не проверка.
- При squash-слиянии GitHub дописывает к заголовку ` (#123)`: оставляйте под суффикс 7-8 символов.

### G-GIT-005 · SHOULD · Первая строка начинается с заглавной буквы и не заканчивается точкой
- Проверка: commitlint `header-case` (`sentence-case`) и `header-full-stop`.
- Источник: [cbea.ms, правила 3 и 4](https://cbea.ms/git-commit/) (2014), на которые ссылается [README google/styleguide](https://github.com/google/styleguide/blob/gh-pages/README.md) (2025-01-17) · сторонний источник · средняя · не Google.
- Источники расходятся: в хороших примерах eng-practices первая строка - законченное предложение, и в двух из трёх
  стоит точка; в 12 репозиториях из 24 точка есть не менее чем в 30 % заголовков (guava - 91 %). Профиль берёт вариант
  без точки: он совпадает с cbea.ms, Go, Angular и Conventional Commits и проверяется инструментом.

### G-GIT-006 · SHOULD · Тело объясняет, что изменено и почему: проблему, выбранный подход и его недостатки
- Проверка: ручное ревью.
- Источник: [eng-practices, «Body is Informative»](https://google.github.io/eng-practices/review/developer/cl-descriptions.html#informative) (2024-05-10) · официальный гайд · высокая.
- По ситуации добавляют номера задач, результаты бенчмарков и ссылки на дизайн-документы. Внешняя ссылка может стать
  недоступной, поэтому суть излагается в самом сообщении. Тело уместно даже у маленького изменения, если ему нужен
  контекст; в выборке тело есть в среднем у 46 % коммитов (от 9 % до 89 % по репозиториям).

### G-GIT-007 · SHOULD · Строки тела переносятся на 72 символа
- Проверка: commitlint `body-max-line-length` (72; строки с URL правило пропускает).
- Источник: [cbea.ms, правило 6](https://cbea.ms/git-commit/) (2014) · сторонний источник · высокая · не Google; [go.dev/doc/contribute](https://go.dev/doc/contribute#commit_messages) (сверено 2026-10-09) · производный гайд проекта · высокая.
- То же число у Chromium и AOSP. В теле не используют Markdown и HTML (правило Go): сообщение читают в терминале.

### G-GIT-008 · SHOULD · Описания без содержания - «Fix bug», «Fix build», «Phase 1» - не принимаются
- Проверка: частично: commitlint `header-min-length` (порог 15 символов - выбор профиля, в источнике числа нет); остальное - ручное ревью.
- Источник: [eng-practices, «Bad CL Descriptions»](https://google.github.io/eng-practices/review/developer/cl-descriptions.html#bad) (2024-05-10) · официальный гайд · высокая.

### G-GIT-009 · SHOULD · Ссылка на задачу стоит трейлером в последнем абзаце: `Fixes #N` закрывает задачу, `Updates #N` - нет
- Проверка: ручное ревью; наличие ссылки можно требовать правилом commitlint `references-empty`.
- Источник: [go.dev/doc/contribute](https://go.dev/doc/contribute#commit_messages) (сверено 2026-10-09) · производный гайд проекта · высокая; [Chromium contributing.md, справочник футеров](https://chromium.googlesource.com/chromium/src/+/main/docs/contributing.md) (сверено 2026-10-09) · производный гайд проекта · высокая · реконструкция.
- Общий гайд требует только упомянуть номер бага; синтаксис взят у Go (он же в шаблоне PR
  [google/new-project](https://github.com/google/new-project/blob/main/.github/PULL_REQUEST_TEMPLATE.md)). Go просит не
  заменять `Fixes` на `Close` или `Resolves`. Для внешнего трекера подходит футер Chromium и AOSP: `Bug: ABC-123`.
  В выборке строку, закрывающую задачу или PR (`Fixes`, `Closes`, `Resolves` и подобные), несут 450 коммитов из
  7 006 - около 6 %.

### G-GIT-010 · SHOULD · В сообщении остаются только те служебные трейлеры, которые читает инструмент этого репозитория
- Проверка: ручное ревью; если проект выбрал DCO - commitlint `signed-off-by`.
- Источник: [go.dev/wiki/CommitMessage](https://go.dev/wiki/CommitMessage) (сверено 2026-10-09) · производный гайд проекта · высокая; [измерение 24 репозиториев](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (`Signed-off-by` как требование - 0 из 24) · высокая · реконструкция.
- `Change-Id:` нужен только Gerrit (его добавляет хук, вручную не правят). `PiperOrigin-RevId:` - след экспорта из
  внутреннего монорепозитория (12 из 24), в обычный репозиторий не переносится. `Signed-off-by:` Google не требует
  (вклад закрывает CLA), Go прямо запрещает; исключение - AOSP с `git commit -s`. Порядок передачи прав описан в
  [repository.md](repository.md).

### G-GIT-011 · SHOULD · Сообщения пишутся на английском языке
- Проверка: частично: собственная проверка в CI регулярным выражением на кириллицу; остальное - ручное ревью.
- Источник: [измерение 24 репозиториев](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (24 из 24; кириллицы нет ни в одном из 7 006 сообщений) · высокая · реконструкция.
- Письменного правила о языке нет: публичных данных не найдено. Все общие гайды и все примеры в них - на английском.

### G-GIT-012 · SHOULD · Тег области в первой строке необязателен; если команда его вводит, он короткий и одного вида во всём репозитории
- Проверка: ручное ревью.
- Источник: [eng-practices, «Using tags»](https://google.github.io/eng-practices/review/developer/cl-descriptions.html#tags) (2024-05-10) · официальный гайд · высокая.
- Допустимые виды - `[tag]`, `#tag`, `tag:`. Длинные и множественные теги переносят в тело. В формате по умолчанию
  профиль тегов не требует.

### G-GIT-013 · MUST · В репозитории с release-please коммиты основной ветки следуют Conventional Commits
- Проверка: commitlint `type-enum`, `type-empty`, `subject-empty` (пресет `@commitlint/config-conventional`).
- Источник: [release-please README, «How should I write my commits?»](https://github.com/googleapis/release-please#how-should-i-write-my-commits) (v17.11.2, 2026-08-24) · конфиг или инструмент · высокая; [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/#specification) · сторонний источник · высокая · не Google.
- MUST - потому что формат читает инструмент: `fix:` даёт patch, `feat:` - minor, `!` - major; релиз создают только
  типы `feat`, `fix` и `deps`. В выборке все 4 репозитория с release-please соблюдают формат в 98-100 % коммитов, а
  google-cloud-go делает проверку обязательным статусом PR. Вне таких репозиториев формат не обязателен: доля коммитов
  с префиксом типа в остальных 17 репозиториях - от 0 до 9 %.

```text
# плохо: release-please не увидит изменение
Add retries for resumable uploads

# хорошо
feat(storage): add retries for resumable uploads
```

### G-GIT-014 · MUST · В варианте Conventional Commits несовместимое изменение помечается `!` перед двоеточием или футером `BREAKING CHANGE:`
- Проверка: ручное ревью; правило commitlint `breaking-change-exclamation-mark` строже спецификации - оно требует оба признака сразу.
- Источник: [Conventional Commits 1.0.0, п. 11-13 и 16](https://www.conventionalcommits.org/en/v1.0.0/#specification) · сторонний источник · высокая · не Google.
- От этой пометки зависит номер версии, см. [G-REL-001](releases.md).

### G-GIT-015 · SHOULD · Заголовок и описание PR/MR оформляются как сообщение коммита
- Проверка: commitlint по заголовку PR/MR в CI (текст подаётся на стандартный ввод); описание - ручное ревью.
- Источник: [go.dev/doc/contribute, «Sending a change via GitHub»](https://go.dev/doc/contribute) (сверено 2026-10-09) · производный гайд проекта · высокая; [google-cloud-go CONTRIBUTING.md](https://github.com/googleapis/google-cloud-go/blob/37f936ac9d69e173da0ba4123e382c52b2dd741f/CONTRIBUTING.md) (2026-10-08) · производный гайд проекта · высокая.
- При squash-слиянии ([G-BR-006](branches.md)) в историю попадает один коммит, собранный из заголовка и описания
  PR; сообщения промежуточных коммитов ветки пропадают. Спецификация Conventional Commits прямо допускает, что при
  таком процессе сообщение приводит в порядок тот, кто сливает.

### G-GIT-016 · SHOULD · Перед слиянием описание перечитывают: оно должно соответствовать итоговому изменению
- Проверка: ручное ревью.
- Источник: [eng-practices, «Review the description before submitting the CL»](https://google.github.io/eng-practices/review/developer/cl-descriptions.html) (2024-05-10) · официальный гайд · высокая.
- То же относится к описаниям, которые генерирует инструмент.

### G-GIT-017 · SHOULD · Сообщение отката называет откатываемый коммит и причину
- Проверка: ручное ревью.
- Источник: [Angular, «Revert commits»](https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md) (сверено 2026-10-09) · производный гайд проекта · средняя · реконструкция; [go.dev/wiki/CommitMessage](https://go.dev/wiki/CommitMessage) (сверено 2026-10-09) · производный гайд проекта · средняя.
- В eng-practices формат отката не описан: публичных данных не найдено. Профиль берёт то, что создаёт `git revert`
  (`Revert "<заголовок>"` и строка `This reverts commit <SHA>.`), и добавляет причину, как требует Angular. В варианте
  Conventional Commits первая строка - `revert: <заголовок исходного коммита>`. Повторное внесение Go просит описывать
  явно: какое изменение возвращается и каким оно было отменено.

## Примеры

Все примеры условные (не из реальных репозиториев) и написаны в формате профиля.

Исправление ошибки:

```text
Fix dropped last batch in the shard iterator

The iterator stopped one record early when the shard size was an
exact multiple of the batch size, so the last batch of every such
shard was silently dropped. Compare against the record count instead
of the last index, and add a regression test with a shard of exactly
two batches.

Fixes #412
```

Новая возможность с описанием компромисса:

```text
Add retry with backoff to the artifact uploader

Uploads to the model registry fail on transient HTTP 503 responses
about once per 200 runs, and one failure discards a finished training
job. Retry up to five times with exponential backoff and jitter.

Only idempotent PUT requests are retried. Multipart uploads still
fail fast, because a blind retry can duplicate parts; that case is
tracked separately.

Updates #518
```

Рефакторинг отдельным изменением ([G-BR-008](branches.md)):

```text
Move tokenizer config parsing out of train.py

No behavior change. The parser lived in train.py, so the inference
server had to import the whole training stack to read one YAML file.
Existing parser tests pass unchanged; only their imports move.
```

Оптимизация с результатами измерения:

```text
Compile log parser regexes once at import

Profiling showed that about a third of the parse time went to
re.compile calls for the same twelve patterns on every line.

Benchmark (bench/parse_logs.py, 1 GB sample, median of 5 runs):
  before: 41.2 s
  after:  26.0 s
```

Маленькое изменение, которому хватает одной строки контекста:

```text
Document the --seed flag in the training README

The flag has existed since #377 but appeared only in --help output.
```

Откат:

```text
Revert "Enable mixed precision by default"

This reverts commit 3f2a9c1e5b7d. With float16 gradients the
validation loss of the ranking model diverges after about 12k steps
(curves in #602). Mixed precision stays available behind --amp until
loss scaling is fixed.
```

Вариант Conventional Commits - новая возможность и несовместимое изменение:

```text
feat(storage): add retries for resumable uploads

Resume an interrupted upload from the last committed offset instead
of restarting the transfer from zero.

Fixes #238
```

```text
refactor(api)!: raise FetchError on HTTP 4xx

Client.fetch used to return None for any client error, which hid
authentication failures behind "no data" code paths.

BREAKING CHANGE: Client.fetch raises FetchError instead of returning
None on HTTP 4xx. Callers that checked for None must catch the
exception.
```

Плохо:

```text
Fix bug
```

Какая ошибка и что сделано - неизвестно. Это первый пример плохого описания в eng-practices.

```text
fixed tests and updated readme, also some refactoring.
```

Прошедшее время, строчная буква, точка, и главное - три несвязанных изменения в одном коммите
(нарушены G-GIT-002, G-GIT-005 и [G-BR-007](branches.md)).

```text
Update the retry logic in uploader.py to use exponential backoff with jitter and five attempts because of 503s
```

110 символов в первой строке и нет тела: причина и детали должны уйти в тело (G-GIT-004, G-GIT-006).

## Проверка: commitlint (не Google)

Google не публикует ни конфига, ни инструмента для проверки сообщений в обычном git-репозитории. В 24 репозиториях
выборки нет ни одного конфига commitlint и ни одного workflow с такой проверкой; в googleapis формат проверял внешний
бот [conventional-commit-lint](https://github.com/googleapis/repo-automation-bots/tree/main/packages/conventional-commit-lint),
который объявлен устаревшим (отключение было назначено на 2025-08-13), а его README советует взамен GitHub Actions с
commitlint. У проектов на Gerrit проверки свои: `git codereview` у Go, presubmit у Chromium, хуки `commit_msg_*` у
AOSP, `ng-dev` у Angular. Поэтому ниже - сторонний инструмент
[commitlint](https://github.com/conventional-changelog/commitlint) (MIT), настроенный под правила профиля.

Конфиг для формата по умолчанию, файл `commitlint.config.mjs` в корне репозитория:

```js
// Профиль Google: формат по умолчанию (содержание - eng-practices, форма - cbea.ms).
// Инструмент: @commitlint/cli 21.2.3, Node.js >= 22.12.0. Не Google.
// Не запускалось: реестр пакетов недоступен из среды сборки.
// Имена и поведение правил сверены с исходным кодом commitlint 21.2.3.
export default {
  // Пресетов в `extends` нет намеренно: config-conventional и config-angular
  // требуют префикс типа, а формат по умолчанию его не использует.
  rules: {
    'header-max-length': [2, 'always', 72], // G-GIT-004
    'header-min-length': [2, 'always', 15], // G-GIT-008; порог выбран профилем
    'header-case': [1, 'always', 'sentence-case'], // G-GIT-005; предупреждение
    'header-full-stop': [2, 'never', '.'], // G-GIT-005
    'header-trim': [2, 'always'],
    'body-leading-blank': [2, 'always'], // G-GIT-003
    'body-max-line-length': [2, 'always', 72], // G-GIT-007; строки с URL пропускаются
    'footer-leading-blank': [1, 'always'],
  },
};
```

Первое число - уровень: `2` - ошибка, `1` - предупреждение. `header-case` оставлен предупреждением: правило сравнивает
только первую букву и ошибается на заголовках, которые законно начинаются со строчной (`gRPC`, `iOS`). Коммиты слияния,
`Revert …`, `fixup!` и `squash!` commitlint по умолчанию не проверяет.

Конфиг для варианта Conventional Commits:

```js
// Профиль Google: вариант Conventional Commits для репозиториев с release-please.
// Инструмент: @commitlint/cli 21.2.3 и @commitlint/config-conventional 21.2.3. Не Google.
// Не запускалось: реестр пакетов недоступен из среды сборки.
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // К типам пресета добавлен `deps`: release-please считает его поводом для релиза.
    'type-enum': [
      2,
      'always',
      ['build', 'chore', 'ci', 'deps', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
    ],
  },
};
```

Пресет сам задаёт `header-max-length` 100, `body-max-line-length` 100, строчную букву в описании и запрет точки.
Предел 100 для этого варианта оставлен: префикс типа и суффикс ` (#N)` съедают 15-25 символов, и в googleapis 90-й
перцентиль длины заголовка - 78-92 символа.

Где запускать:

| Место | Как | Замечания |
|---|---|---|
| Локально | хук `commit-msg`: `commitlint --edit <файл сообщения>` | Хук `pre-commit` не подходит: сообщения ещё нет. Готовая запись - в [`.pre-commit-config.yaml`](../../configs/.pre-commit-config.yaml) профиля |
| GitHub Actions | `commitlint --from <base sha> --to <head sha>` для коммитов PR и заголовок PR через стандартный ввод | См. [`workflows/lint.yml`](../../templates/github/workflows/lint.yml). При squash-слиянии важен заголовок PR |
| GitLab CI | `commitlint --from "$CI_MERGE_REQUEST_DIFF_BASE_SHA" --to "$CI_COMMIT_SHA"` и заголовок MR | См. [`.gitlab-ci.yml`](../../templates/gitlab/.gitlab-ci.yml). Перенос на GitLab - не Google |
| GitLab, сервер | push rule «Require expression in commit messages» | Только Premium и Ultimate; проверяет одно регулярное выражение |

Различие платформ: GitHub по умолчанию собирает squash-коммит из заголовка PR и списка коммитов (или из сообщения
единственного коммита), GitLab - из заголовка MR (шаблон `%{title}`). Чтобы тело не терялось, на GitHub выбирают
«Pull request title and description», на GitLab дописывают в шаблон squash-коммита `%{description}`.

## Что показало измерение

Выборка: 24 репозитория из 10 GitHub-организаций Google, по 300 последних коммитов из каждого (в pyink - 106), всего
7 006; дата среза - 2026-10-09. Половина выборки (12 из 24) экспортируется из внутреннего монорепозитория, половина
ведётся прямо на GitHub.

| Практика | Доля репозиториев | Комментарий |
|---|---|---|
| Сообщения на английском | 24 из 24 | кириллицы нет ни в одном сообщении |
| Медиана длины заголовка ≤ 72 | 24 из 24 | среднее медиан - 56 символов |
| Медиана длины заголовка ≤ 50 | 8 из 24 | ориентир «50» выдерживает треть |
| Более четверти заголовков длиннее 72 | 12 из 24 | максимум - google-cloud-go, 48 % |
| Заголовок с заглавной буквы в ≥ 80 % коммитов | 13 из 24 | в экспортируемых репозиториях в среднем 86 % |
| Точка в конце заголовка в ≥ 30 % коммитов | 12 из 24 | меньше 5 % - в 9 из 24 |
| Conventional Commits в ≥ 60 % коммитов | 7 из 24 | в ≥ 95 % - 5 из 24; все 4 репозитория с release-please |
| Префикс `[Tag]` в ≥ 15 % коммитов | 3 из 24 | jax, tensorflow, flatbuffers |
| Стиль Go `pkg: …` в ≥ 50 % коммитов | 0 из 24 | вне выборки: golang/go - 97,7 % |
| Тело есть у ≥ 50 % коммитов | 10 из 24 | среднее - 46 % |
| `Signed-off-by` в ≥ 50 % коммитов | 0 из 24 | DCO не применяется |
| Конфиг commitlint или workflow с проверкой сообщений | 0 из 24 | в googleapis - внешний бот (устарел) |

На Gerrit-хостах проверено ещё 160 коммитов: 40 из golang/go (префикс пакета - 40 из 40, точка в конце - 0, заголовок
до 72 символов - 35), 60 из chromium/src (`Bug:` - 47, заголовок до 72 - 56) и 60 из AOSP frameworks/base (`Bug:` - 45,
`Test:` - 46; в документированный предел 50 символов укладываются только 33).

## Чего в публичных источниках нет

- Правила о языке сообщений - публичных данных не найдено (есть только практика, G-GIT-011).
- Числового предела длины в eng-practices нет; числа 50 и 72 приходят из сторонней статьи.
- Формат отката и правила для `fixup!`-коммитов в общих гайдах не описаны.
- Требований к подписи коммитов (GPG, SSH) - публичных данных не найдено.
- Правил для GitLab Google не публикует; всё, что относится к GitLab в этом документе, - перенос (не Google).
