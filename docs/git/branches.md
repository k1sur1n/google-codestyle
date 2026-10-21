# Ветки и процесс PR/MR (профиль Google)

> Данные актуальны на 2026-10-09.

Google работает по trunk-based development: одна основная ветка - источник истины, изменения маленькие и
попадают в неё ежедневно, ветки заводят только под релизы. Внутри компании это обеспечивает монорепозиторий с
собственной системой контроля версий, а в git-репозитории та же модель собирается из стандартных настроек GitHub и
GitLab: защищённая `main`, короткие ветки, слияние одним коммитом (squash), обязательные проверки. Письменных правил
именно про git-ветки у Google почти нет, поэтому часть правил ниже - реконструкция по книге «Software Engineering at
Google», рекомендациям DORA, гайду eng-practices и настройкам репозиториев googleapis; такие правила помечены словом
«реконструкция».
Схему именования веток Google не публикует.

Связанные документы: [коммиты](commits.md), [код-ревью](code-review.md), [релизы](releases.md),
[состав репозитория](repository.md).

## Как Google описывает trunk-based development

Три источника описывают одно и то же с разных сторон:

- **Книга «Software Engineering at Google», гл. 16** (2020; CC BY-NC-ND 4.0, поэтому здесь только пересказ). Источник
  истины должен быть один. Стабильность основной ветки обеспечивают тесты, CI и ревью, а не изоляция в dev-ветках:
  ставку на долгие ветки авторы называют ошибочной. Незавершённую работу коммитят в основную ветку и выключают флагом.
  Долгоживущая ветка разработки есть меньше чем у 10 команд примерно из 1000. Релизные ветки допустимы, cherry-pick в
  них минимален, обратно в основную ветку они не сливаются - 
  [гл. 16](https://abseil.io/resources/swe-book/html/ch16.html#dev_branches).
- **DORA, «Trunk-based development»** (исследовательская программа Google Cloud; CC BY 4.0; даты на странице нет).
  Измеримые пороги: не более трёх активных веток, слияние в основную ветку не реже раза в день, ветка живёт считаные
  часы, нет заморозок кода и фаз интеграции. Типичные ошибки - тяжёлое ревью с несколькими обязательными одобрениями,
  асинхронное ревью и отсутствие автотестов до слияния - 
  [dora.dev](https://dora.dev/capabilities/trunk-based-development/).
- **eng-practices, «Small CLs»** (2024-04-24; CC-BY 3.0): как резать работу на маленькие изменения - 
  [small-cls](https://google.github.io/eng-practices/review/developer/small-cls.html).

Интерпретация: внутри Google разработчик обычно не заводит ветку под задачу - почти вся разработка идёт в голове
основной ветки ([обзор Henderson](https://arxiv.org/pdf/1702.01715), 2017): изменение уходит на ревью и после одобрения
коммитится прямо в неё. В git ближайший аналог - короткая ветка, PR/MR и слияние одним коммитом. Соответствие
выглядит так:

| Внутри Google | В git-репозитории | Что не переносится |
|---|---|---|
| Изменение (CL) коммитится в основную ветку после ревью | Короткая ветка → PR/MR → squash в `main` | - |
| Presubmit: быстрые тесты и линтеры до коммита | Обязательные проверки CI на PR/MR | Выбор тестов по глобальному графу зависимостей |
| Полный прогон тестов после коммита, поломку откатывают | CI на `main`; поломку чинят откатом (`git revert`) | Глобальная платформа TAP и автоматический откат |
| Незавершённая функциональность выключена флагом | То же | - |
| Релизная ветка от «зелёной» ревизии, исправления - cherry-pick | Ветка `N.x` от `main`, cherry-pick из `main` | - |
| Владельцы каталогов (`OWNERS`) | `CODEOWNERS` и обязательное одобрение владельца, см. [code-review.md](code-review.md) | Наследование прав вверх по дереву каталогов |
| Экспорт наружу через Copybara | - | Целиком: это механика публикации внутреннего кода |

## Правила

### G-BR-001 · MUST · У репозитория одна основная ветка - источник истины; долгоживущих веток разработки (`develop`, `dev`, `next`) нет
- Проверка: частично: список веток (`git ls-remote --heads <url>`); остальное - ручное ревью.
- Источник: [Software Engineering at Google, гл. 16](https://abseil.io/resources/swe-book/html/ch16.html#dev_branches) (2020) · книга, статья или доклад · высокая; [измерение 24 репозиториев](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (веток `develop`, `dev`, `staging`, `next` нет ни в одном из 24) · высокая · реконструкция.
- MUST - по формулировке книги (единственный источник истины обязателен) и потому что отступлений в выборке нет.

### G-BR-002 · SHOULD · Основная ветка называется `main`
- Проверка: настройка «default branch» репозитория; `git ls-remote --symref <url> HEAD`.
- Источник: [Google Open Source, «Preparing for release»](https://opensource.google/documentation/reference/releasing/preparing) (2025-06-10) · официальный гайд · средняя · реконструкция; [измерение 24 репозиториев](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (`main` - 14 из 24) · высокая.
- Прямого правила «называйте ветку main» нет. Оно выводится из требования к новым open-source-проектам избегать пары
  master/slave и из того, что шаблон google/new-project и новые проекты живут на `main`. Существующие проекты задним
  числом не переименовывают: `master` остаётся в 9 из 24 (abseil-cpp, bazel, guava, tensorflow, keras и другие).

### G-BR-003 · SHOULD · Рабочая ветка живёт часы или день: слияние в основную - не реже раза в день, активных веток - не больше трёх
- Проверка: частично: метрики хостинга (возраст открытых PR/MR, число активных веток); остальное - ручное ревью.
- Источник: [DORA, «Trunk-based development»](https://dora.dev/capabilities/trunk-based-development/) (страница без даты; сверено 2026-10-09) · книга, статья или доклад · высокая.
- Туда же относится отказ от заморозок кода и отдельных фаз интеграции. Пороги DORA - цели для измерения, а не
  автоматические запреты.

### G-BR-004 · SHOULD · Незавершённая функциональность попадает в основную ветку частями и выключена флагом, а не копится в отдельной ветке
- Проверка: ручное ревью.
- Источник: [Software Engineering at Google, гл. 16](https://abseil.io/resources/swe-book/html/ch16.html#left_parenthesisnearlyright_parenthesis) (2020) · книга, статья или доклад · высокая.

### G-BR-005 · MUST · Изменение попадает в основную ветку только через PR/MR; прямой push закрыт для всех, включая сопровождающих
- Проверка: настройки защиты ветки; OpenSSF Scorecard `Branch-Protection`.
- Источник: [google/new-project, docs/contributing.md](https://github.com/google/new-project/blob/main/docs/contributing.md) (2023-06-22) · конфиг или инструмент · высокая; [Google Open Source, «GitHub services»](https://opensource.google/documentation/reference/github/services) (2025-06-10) · официальный гайд · высокая.
- Шаблон проекта требует ревью для всех изменений, включая изменения участников проекта. Документ OSPO требует защиту
  основных веток там, где GitHub Actions получают дополнительный доступ к репозиторию. Сами настройки защиты и состав
  обязательных проверок описаны правилами G-REPO-021 и G-REPO-022 в [repository.md](repository.md); здесь - их
  следствие для процесса.

### G-BR-006 · SHOULD · PR/MR сливается одним коммитом (squash); merge-коммиты выключены, история основной ветки линейная
- Проверка: настройки слияния репозитория (см. таблицу платформ); `git log --merges origin/main` ничего не выводит.
- Источник: [release-please README, «Linear git commit history»](https://github.com/googleapis/release-please#linear-git-commit-history-use-squash-merge) (v17.11.2, 2026-08-24) · конфиг или инструмент · высокая; [sync-repo-settings.yaml в googleapis/release-please](https://github.com/googleapis/release-please/blob/main/.github/sync-repo-settings.yaml) (репозиторий на 2026-10-05) · конфиг или инструмент · высокая; [измерение 24 репозиториев](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (merge-коммитов нет в 14 из 24) · высокая.
- Доводы release-please: историю проще читать и делить пополам (`git bisect`), в основной ветке нет промежуточных
  нерабочих состояний, одна запись changelog соответствует одному PR. Сообщением коммита становятся заголовок и
  описание PR, см. [G-GIT-015](commits.md). Rebase-слияние у googleapis тоже разрешено; профиль оставляет его для
  случаев, когда коммиты ветки осмысленны по отдельности.

### G-BR-007 · SHOULD · Один PR/MR - одно самодостаточное изменение; ориентир - около 100 строк, 1000 строк обычно слишком много
- Проверка: частично: собственная проверка размера диффа в CI (не Google); остальное - ручное ревью.
- Источник: [eng-practices, «What is Small?»](https://google.github.io/eng-practices/review/developer/small-cls.html#what-is-small) (2024-04-24) · официальный гайд · высокая; [Software Engineering at Google, гл. 9](https://abseil.io/resources/swe-book/html/ch09.html#write_small_changes) (2020) · книга, статья или доклад · высокая.
- Жёсткого порога нет: книга называет «около 200 строк», гайд - 100, решает ревьюер. Число файлов тоже считается:
  200 строк в одном файле приемлемы, те же 200 строк в 50 файлах - обычно нет. Удаление файла целиком и результат
  автоматического рефакторинга оцениваются мягче. Изменение не должно быть и слишком мелким: новый API приносят вместе
  с примером его использования. Если разбить не получается, о большом PR договариваются с ревьюерами заранее.

### G-BR-008 · SHOULD · Рефакторинг идёт отдельным PR/MR, а не вместе с новой функциональностью или исправлением ошибки
- Проверка: ручное ревью.
- Источник: [eng-practices, «Separate Out Refactorings»](https://google.github.io/eng-practices/review/developer/small-cls.html#refactoring) (2024-04-24) · официальный гайд · высокая.
- Мелкая чистка рядом с правкой (переименовать локальную переменную) допустима. Крупное переформатирование - тоже
  отдельным изменением, см. [G-CR-004](code-review.md).

```text
# плохо: один PR
Rename UserStore to AccountStore and fix the cache eviction race

# хорошо: два PR
Rename UserStore to AccountStore
Fix eviction race in AccountStore cache
```

### G-BR-009 · SHOULD · Тесты к изменению входят в тот же PR/MR
- Проверка: частично: отчёт о покрытии изменённых строк в CI; остальное - ручное ревью.
- Источник: [eng-practices, «Keep related test code in the same CL»](https://google.github.io/eng-practices/review/developer/small-cls.html#test-code) (2024-04-24) · официальный гайд · высокая.
- Независимые правки тестов (покрыть существующий код перед рефакторингом, вынести вспомогательные функции) можно
  прислать отдельно и раньше.

### G-BR-010 · SHOULD · После каждого слияния основная ветка собирается и проходит тесты - в том числе посреди цепочки зависимых PR/MR
- Проверка: CI на основной ветке после каждого слияния.
- Источник: [eng-practices, «Don't Break the Build»](https://google.github.io/eng-practices/review/developer/small-cls.html#break) (2024-04-24) · официальный гайд · высокая.
- Цепочки (следующий PR основан на предыдущем) - рекомендованный гайдом способ не простаивать в ожидании ревью.

### G-BR-011 · SHOULD · Перед слиянием изменение проверено поверх актуального состояния основной ветки
- Проверка: GitHub - «Require branches to be up to date before merging» или merge queue; GitLab - метод слияния fast-forward либо merge trains.
- Источник: [sync-repo-settings.yaml в googleapis/release-please](https://github.com/googleapis/release-please/blob/main/.github/sync-repo-settings.yaml) (`requiresStrictStatusChecks: true`; репозиторий на 2026-10-05) · конфиг или инструмент · средняя · реконструкция; [Software Engineering at Google, гл. 23](https://abseil.io/resources/swe-book/html/ch23.html#why_presubmit_isnapostrophet_enough) (2020) · книга, статья или доклад · средняя.
- Книга описывает «столкновения в воздухе»: два изменения проходят проверки по отдельности и ломают сборку вместе.
  Небольшим репозиториям она прямо советует сериализовать слияния - это и делает очередь слияний. Со стороны настроек
  то же требование входит в G-REPO-022 ([repository.md](repository.md)).

### G-BR-012 · SHOULD · Релизная ветка создаётся только для поддержки уже выпущенной версии; исправление сначала попадает в основную ветку и переносится cherry-pick
- Проверка: ручное ревью; `git branch -r --contains <sha>` показывает, что исправление есть в `main`.
- Источник: [Software Engineering at Google, гл. 16](https://abseil.io/resources/swe-book/html/ch16.html#what_about_release_branchesquestion_mar) (2020) · книга, статья или доклад · высокая; [измерение 24 репозиториев](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (релизные или LTS-ветки - 11 из 24) · высокая.
- Обратно в основную ветку релизная не сливается. Единого имени нет: `lts_YYYY_MM_DD` (abseil-cpp), `vX.Y.x`
  (googletest), `rX.Y` (tensorflow, keras), `release/X.Y.Z` (jax), `release-X.Y.Z` (bazel), `12.x` (release-please).
  Профиль берёт `N.x`: эту схему использует сам release-please, и его action умеет вести релизы из такой ветки, см.
  [releases.md](releases.md).

### G-BR-013 · SHOULD · Ветка удаляется сразу после слияния
- Проверка: настройка автоудаления веток на хостинге.
- Источник: [README бота sync-repo-settings](https://github.com/googleapis/repo-automation-bots/tree/main/packages/sync-repo-settings) (значение по умолчанию `deleteBranchOnMerge: true`; репозиторий на 2026-10-06) · конфиг или инструмент · средняя · реконструкция.
- Бот объявлен устаревшим (отключение было назначено на 2025-08-05) и здесь служит только описанием принятых у
  googleapis значений по умолчанию. На практике правило соблюдают не все: в 24 репозиториях от одной ветки (go-github,
  re2) до 2 610 (tensorflow).

## Чего в публичных источниках нет

- **Имена рабочих веток.** Публичных данных не найдено. Общепринятая альтернатива (не Google): короткое имя в нижнем
  регистре через дефис, при желании с номером задачи - `412-fix-shard-iterator`. Выберите одну схему и запишите её в
  `CONTRIBUTING.md`.
- **Force-push в ветку PR.** Общего правила нет. go-github просит не переписывать историю PR во время ревью, Go
  принимает оба способа обновления. В основную ветку force-push закрыт защитой (G-BR-005).
- **Подпись коммитов.** Публичных данных не найдено; в настройках googleapis по умолчанию подпись не требуется.
- **Число коммитов в PR.** Общего правила нет. JAX и Flax просят один коммит на PR, потому что PR импортируется во
  внутренний репозиторий; при squash-слиянии число коммитов в ветке не важно.

## Что показало измерение

Выборка: 24 активных репозитория Google на GitHub, 7 006 коммитов, срез 2026-10-09. Из них 2 976 коммитов несут в
заголовке суффикс `(#N)`, то есть соответствуют слитым PR. Настройки защиты веток через API не снимались: они видны
только там, где лежат в репозитории как код (`.github/sync-repo-settings.yaml` - 3 репозитория из 24).

| Практика | Доля | Комментарий |
|---|---|---|
| Основная ветка `main` | 14 из 24 | `master` - 9 из 24; у pyink ветка называется `pyink` |
| Веток `develop`, `dev`, `staging`, `next` нет | 24 из 24 | особые долгие ветки: `preview` (google-cloud-go, google-cloud-python), `nightly` (tensorflow) |
| Есть релизные или LTS-ветки | 11 из 24 | имена - в G-BR-012 |
| Merge-коммитов нет совсем | 14 из 24 | 5 % и больше - в 8 из 24: это 7 экспортируемых репозиториев, куда внешние PR приходят merge-коммитом импорта, и yapf |
| Суффикс `(#N)` (squash через интерфейс GitHub) в ≥ 60 % коммитов | 9 из 24 | в репозиториях, которые ведутся на GitHub, в среднем 79 %; в экспортируемых - 4 % |
| CONTRIBUTING прямо требует squash | 4 из 24 | google-cloud-go, go-github и другие |
| Настройки слияния лежат в репозитории как код | 3 из 24 | во всех трёх: `mergeCommitAllowed: false`, `squashMergeAllowed: true`, `rebaseMergeAllowed: true`, одно одобрение, одобрение владельцев кода, обязательные проверки |

Как читать эти цифры: половина выборки (12 из 24) - односторонний экспорт из внутреннего монорепозитория, и PR там не
сливается кнопкой, а импортируется внутрь и возвращается коммитом экспорта. Образцом для собственного репозитория
служат проекты, которые ведутся прямо на GitHub (googleapis, GoogleCloudPlatform, keras, go-github): у них squash и
линейная история - фактическая норма.

## GitHub и GitLab

Google не публикует настроек для GitLab; правый столбец - перенос (не Google). Названия настроек взяты из
документации платформ на 2026-10-09.

| Задача | GitHub | GitLab |
|---|---|---|
| Имя основной ветки | Default branch = `main` | Default branch = `main`; защищается автоматически |
| Закрыть прямой push (G-BR-005) | Защита ветки или ruleset: «Require pull request reviews before merging», «Do not allow bypassing the above settings» | Protected branches: «Allowed to push and merge» - никто, «Allowed to merge» - нужная роль |
| Обязательное число одобрений | В составе защиты ветки. В публичных репозиториях доступно на бесплатном тарифе, в приватных - с Pro, Team и Enterprise | «Required approvals» - только Premium и Ultimate; на Free одобрение необязательно и слияние не блокирует |
| Обязательные проверки CI | «Require status checks before merging» | Settings → Merge requests → Merge checks: «Pipelines must succeed» |
| Squash и линейная история (G-BR-006) | Оставить только «Allow squash merging»; дополнительно «Require linear history» | Merge method - «Fast-forward merge»; «Squash commits when merging» - «Require» |
| Актуальность ветки (G-BR-011) | «Require branches to be up to date before merging»; merge queue - для репозиториев организаций (публичных, а приватных - на Enterprise Cloud), в CI нужен триггер `merge_group` | Fast-forward и semi-linear сами требуют rebase; merge trains - Premium и Ultimate |
| Сообщение squash-коммита | По умолчанию - заголовок PR и список коммитов; переключить на «Pull request title and description» | Шаблон по умолчанию - `%{title}`; добавить `%{description}` в «Squash commit message template» |
| Удаление ветки (G-BR-013) | «Automatically delete head branches» | Опция «Delete source branch» в MR; включается по умолчанию в настройках проекта |
| Force-push в основную ветку | «Allow force pushes» выключено | «Allowed to force push» выключено |
| Проверка имён веток (если команда ввела схему) | В стандартной защите ветки не предусмотрена - проверка в CI | Push rule «Branch name» - Premium и Ultimate |

Документация платформ:
[защита веток GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches),
[методы слияния GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github),
[merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue),
[защищённые ветки GitLab](https://docs.gitlab.com/user/project/repository/branches/protected/),
[методы слияния GitLab](https://docs.gitlab.com/user/project/merge_requests/methods/),
[squash в GitLab](https://docs.gitlab.com/user/project/merge_requests/squash_and_merge/),
[одобрения в GitLab](https://docs.gitlab.com/user/project/merge_requests/approvals/),
[merge trains](https://docs.gitlab.com/ci/pipelines/merge_trains/),
[push rules](https://docs.gitlab.com/user/project/repository/push_rules/).

Главное различие для этого профиля: в бесплатном GitLab нельзя сделать одобрение и одобрение владельца кода
обязательными. Правило о ревью (G-BR-005, [G-CR-001](code-review.md)) там держится на договорённости и на том, что
право слияния в защищённую ветку есть только у сопровождающих.
