# Оформление репозитория и документации - профиль Google

> Данные актуальны на 2026-10-09.

Письменные правила Google для открытых git-репозиториев есть, но адресованы они сотрудникам Google: это документация Open Source Programs Office (OSPO) и шаблон `google/new-project`. Обязательный минимум - `LICENSE`, `README.md`, `CONTRIBUTING` с условиями вклада, заголовок лицензии в каждом исходном файле и каталог `third_party/` для чужого кода. `CODE_OF_CONDUCT` и `SECURITY` необязательны, а про `CODEOWNERS`, `.gitignore`, `.editorconfig` и changelog письменных правил нет. Измерение 24 репозиториев подтверждает минимум (README, LICENSE, CONTRIBUTING - 24 из 24) и показывает расхождения: дисклеймер о «неофициальном продукте» стоит в 8 из 24, правообладатель `Google LLC` - в 5 из 24. Всё, что относится только к Google (CLA Google, дисклеймер, канал g.co/vulnz), профиль заменяет нейтральным требованием и помечает.

Связанные документы: [commits.md](commits.md) · [branches.md](branches.md) · [code-review.md](code-review.md) · [releases.md](releases.md) · [матрица проверок](../enforcement.md) · [чек-лист внедрения](../adoption.md).

## Как читать этот документ

- **Письменные правила.** [Документация OSPO о выпуске проектов](https://opensource.google/documentation/reference/releasing) (CC BY 4.0, обновлена 2025-06-10), шаблон [google/new-project](https://github.com/google/new-project) (Apache-2.0, последний коммит 2025-02-21), [docguide](https://google.github.io/styleguide/docguide/) из google/styleguide (CC-BY 3.0) и [Google developer documentation style guide](https://developers.google.com/style) (CC BY 4.0). MUST - там, где в источнике «must» или прямое повеление внутри обязательной процедуры выпуска; рекомендации docguide и правила из практики - SHOULD.
- **Практика.** 24 активных репозитория из 10 организаций GitHub (`google`, `googleapis`, `GoogleCloudPlatform`, `abseil`, `bazelbuild`, `tensorflow`, `keras-team`, `jax-ml`, `google-deepmind`, `google-research`) и сам шаблон; до 300 последних коммитов на репозиторий, всего 7 041; измерено 2026-10-09. «19 из 24» - число репозиториев, где практика найдена. Выборка и метод - в [research/google.md](../../research/google.md).
- **Адаптация.** Правила OSPO защищают права Google; в вашем репозитории правообладатель, соглашение о вкладе и текст о поддержке - свои. Где уровень в профиле отличается от уровня в источнике, причина названа в правиле.
- **Две модели.** 12 из 24 репозиториев - экспорт из внутреннего монорепозитория через Copybara: PR в них кнопкой на GitHub не сливают. Остальные 12 ведутся прямо на GitHub; настройки ревью и защиты веток видны только у них.
- **GitLab.** Правил, шаблонов и CI для GitLab Google не публикует (в выборке 0 из 25 репозиториев с `.gitlab-ci.yml` или `.gitlab/`). Всё про GitLab здесь - перенос с пометкой «не Google».

## Файлы и структура

| Файл или каталог | Письменное правило Google | В 24 репозиториях | В `google/new-project` | В профиле |
|---|---|---|---|---|
| `README.md` | обязателен | 24 | да | G-DOC-001…003 |
| `LICENSE` | обязателен | 24 (Apache-2.0 - 19) | да | G-REPO-001, 002 |
| `CONTRIBUTING.md` | обязателен, с разделом о CLA | 24 | `docs/contributing.md` | G-REPO-003 |
| `CODE_OF_CONDUCT.md` | по желанию | 8; с файлом организации - 18 | `docs/code-of-conduct.md` | G-REPO-004 |
| `SECURITY.md` | по желанию | 11; с файлом организации - 20 | нет | G-REPO-005 |
| `.gitignore` | публичных данных не найдено | 23 | нет | G-REPO-006 |
| Шаблоны issue и PR | есть только в шаблоне | issue - 13, PR - 11 | да | G-REPO-007 |
| `third_party/` | обязателен для чужого кода | в корне - 6 | нет | G-REPO-014 |
| `AUTHORS`, `CONTRIBUTORS` | при копирайте «The [Project] Authors» | 11 | нет | G-REPO-012 |
| `CODEOWNERS` | публичных данных не найдено | 9 | нет | G-REPO-020 |
| Changelog (`CHANGELOG.md`, `CHANGES.md`, `NEWS`, `RELEASE.md`) | публичных данных не найдено | 13; из них 4 ведёт release-please | нет | G-REL-008 в [releases.md](releases.md) |
| `.editorconfig` | публичных данных не найдено | 4 | нет | [configs/.editorconfig](../../configs/.editorconfig) - не Google |
| `.pre-commit-config.yaml` | публичных данных не найдено | 6 | нет | [configs/.pre-commit-config.yaml](../../configs/.pre-commit-config.yaml) - не Google |

Схемы каталогов (`src/`, `tests/` и подобных) Google для внешних репозиториев не задаёт - публичных данных не найдено. Закреплены три места: `README.md` в корне кода, `third_party/` в корне и содержимое `docs/` (G-DOC-005). Раскладка профиля:

```text
<project>/
├── README.md  LICENSE  CONTRIBUTING.md  CODE_OF_CONDUCT.md  SECURITY.md
├── .gitignore
├── .github/     # CODEOWNERS, PULL_REQUEST_TEMPLATE.md, ISSUE_TEMPLATE/, workflows/
│                # на GitLab - .gitlab/ и .gitlab-ci.yml
├── docs/
├── third_party/<библиотека>/LICENSE
└── <код проекта>
```

Готовые файлы: [templates/repo/](../../templates/repo/), [templates/github/](../../templates/github/), [templates/gitlab/](../../templates/gitlab/).

### G-REPO-001 · MUST · В корне лежит `LICENSE` с полным текстом лицензии без правок
- Проверка: `test -f LICENSE`; OpenSSF Scorecard `License`; текст - `diff` с эталоном лицензии.
- Источник: [OSPO: Preparing](https://opensource.google/documentation/reference/releasing/preparing) (2025-06-10) · официальный гайд · высокая.
- В Apache-2.0 строка приложения `Copyright [yyyy] [name of copyright owner]` остаётся незаполненной: правообладателя называют заголовки файлов.

### G-REPO-002 · SHOULD · Лицензия по умолчанию - Apache-2.0; другую выбирают по записанной причине
- Проверка: ручное ревью; `grep -q "Apache License" LICENSE`.
- Источник: [OSPO: Preparing](https://opensource.google/documentation/reference/releasing/preparing) (2025-06-10) · официальный гайд · высокая; [измерение](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (19 из 24; BSD-3-Clause - 4, MIT - 1) · высокая.
- У Google это MUST («must use it unless there is a specific reason not to»); в профиле - SHOULD, потому что обязательство адресовано сотрудникам Google.

### G-REPO-003 · MUST · Есть `CONTRIBUTING.md` с условиями передачи прав на вклад и требованием ревью
- Проверка: `test -f CONTRIBUTING.md -o -f docs/contributing.md -o -f .github/CONTRIBUTING.md`; содержание - ручное ревью.
- Источник: [OSPO: Preparing](https://opensource.google/documentation/reference/releasing/preparing) (2025-06-10) · официальный гайд · высокая; [new-project: docs/contributing.md](https://github.com/google/new-project/blob/main/docs/contributing.md) (2023-06-22) · конфиг или инструмент · высокая.
- В проектах Google раздел о CLA включают без изменений; в чужом проекте его заменяет своё условие (G-REPO-017). Шаблон: [CONTRIBUTING.md](../../templates/repo/CONTRIBUTING.md).

### G-REPO-004 · SHOULD · Кодекс поведения - файл в репозитории на основе Contributor Covenant либо общий файл организации
- Проверка: `test -f CODE_OF_CONDUCT.md -o -f docs/CODE_OF_CONDUCT.md -o -f .github/CODE_OF_CONDUCT.md`.
- Источник: [OSPO: Preparing](https://opensource.google/documentation/reference/releasing/preparing) (2025-06-10) · официальный гайд · высокая; [измерение](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (в репозитории - 8 из 24, с файлом организации - 18 из 24) · высокая.
- OSPO называет кодекс необязательным. Если он есть, берут Contributor Covenant в редакции Google и меняют только раздел о разрешении конфликтов. Шаблон: [CODE_OF_CONDUCT.md](../../templates/repo/CODE_OF_CONDUCT.md).

### G-REPO-005 · SHOULD · Есть `SECURITY.md`: канал для сообщений об уязвимостях, состав отчёта, срок ответа, срок раскрытия
- Проверка: `test -f SECURITY.md`; OpenSSF Scorecard `Security-Policy`.
- Источник: [OSPO: Preparing](https://opensource.google/documentation/reference/releasing/preparing) (2025-06-10) · официальный гайд · высокая; [google/oss-vulnerability-guide: шаблоны политик](https://github.com/google/oss-vulnerability-guide/tree/main/templates/security_policies) (2021-03-11, не обновляется) · официальный гайд · средняя; [измерение](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (в репозитории - 11 из 24, с файлом организации - 20 из 24) · высокая.
- Канал Google (g.co/vulnz) в чужой проект не копируют. Ориентиры из шаблона Google: ответ за 3 рабочих дня, раскрытие через 90 дней. Шаблон: [SECURITY.md](../../templates/repo/SECURITY.md).

### G-REPO-006 · SHOULD · В корне есть `.gitignore`
- Проверка: `test -f .gitignore`.
- Источник: [измерение](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (23 из 24) · высокая · реконструкция.

### G-REPO-007 · SHOULD · Есть шаблон PR (`Fixes #N` и чек-лист «тесты, документация») и шаблон сообщения об ошибке (ожидалось, получилось, шаги, версия и платформа)
- Проверка: наличие `.github/PULL_REQUEST_TEMPLATE.md` и `.github/ISSUE_TEMPLATE/`.
- Источник: [new-project: .github](https://github.com/google/new-project/tree/main/.github) (2025-02-19) · конфиг или инструмент · высокая; [измерение](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (шаблон PR - 11 из 24; шаблоны issue - 13 из 24) · высокая.
- Шаблоны Google - два-четыре пункта, а не анкета. YAML-формы issue - у 7 из 24, только Markdown - у 6, пустые issue отключены у 4. Профиль берёт Markdown, как `google/new-project`: он без изменений переносится в GitLab.

### G-REPO-008 · SHOULD · Имя репозитория описывает проект, слова разделены дефисами, чужих товарных знаков в имени нет
- Проверка: ручное ревью.
- Источник: [OSPO: Preparing](https://opensource.google/documentation/reference/releasing/preparing) (2025-06-10) · официальный гайд · высокая.
- Пример: `imageresizeservice` - плохо, `image-resize-service` - хорошо.

### G-REPO-009 · MUST · Перед публикацией из кода и комментариев убраны закрытые сведения, имена и адреса людей без их согласия
- Проверка: частично: сканер секретов (Google инструмент не называет; не Google); остальное - ручное ревью.
- Источник: [OSPO: Preparing](https://opensource.google/documentation/reference/releasing/preparing) (2025-06-10) · официальный гайд · высокая.

## Open source: заголовки, чужой код, вклад

Заголовок Apache-2.0 из `google/new-project` в оформлении для Python. Подставьте год создания файла и своего правообладателя:

```python
# Copyright <год> <правообладатель>
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
```

Заголовки расставляет и проверяет [addlicense](https://github.com/google/addlicense) v1.2.0 (Apache-2.0; README называет его «not an official Google product»):

```sh
go install github.com/google/addlicense@v1.2.0
addlicense -c "<правообладатель>" -l apache -ignore "third_party/**" .         # добавить
addlicense -check -c "<правообладатель>" -l apache -ignore "third_party/**" .  # проверить в CI
```

Три оговорки. `-check` считает заголовком любое вхождение `copyright`, `mozilla public` или `spdx-license-identifier` в первых 1000 байтах файла: текст, год и правообладателя он не сверяет. Встроенный шаблон addlicense ссылается на `http://www.apache.org/…`, а OSPO и `google/new-project` - на `https://…`; точный текст даёт свой шаблон через `-f <файл>`. Ни один из 25 измеренных репозиториев addlicense не запускает: заголовки проверяют бот `header-checker-lint` (4 из 24, объявлен устаревшим) и собственные скрипты (3 из 24).

### G-REPO-010 · MUST · Каждый файл с исходным кодом начинается с заголовка: строка копирайта и указание лицензии
- Проверка: частично: `addlicense -check` - наличие; текст и правообладатель - ручное ревью.
- Источник: [OSPO: Preparing, Apache header](https://opensource.google/documentation/reference/releasing/preparing#Apache-header) (2025-06-10) · официальный гайд · высокая; [new-project: Source Code Headers](https://github.com/google/new-project/blob/main/README.md#source-code-headers) (2024-02-22) · конфиг или инструмент · высокая; [измерение](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (заголовок в 9-10 из 10 файлов выборки - 19 из 24; ни одного - 2 из 24: keras, pyink) · средняя.
- Правило охватывает JS и CSS, которые отдаются браузеру. Для конфигов с комментариями (например, YAML) заголовок - «best practice»; сгенерированному коду он не нужен.

### G-REPO-011 · MUST · В строке копирайта стоит год создания файла; при правках его не обновляют
- Проверка: ручное ревью (`addlicense -y <год>` задаёт год только при добавлении).
- Источник: [OSPO: Preparing](https://opensource.google/documentation/reference/releasing/preparing) (2025-06-10) · официальный гайд · высокая; [Go: Contribution Guide](https://go.dev/doc/contribute) (дата страницы не указана) · производный гайд проекта · высокая.

### G-REPO-012 · SHOULD · Правообладатель в заголовках один на весь репозиторий: владелец прав либо «The [Project] Authors» с файлом `AUTHORS`; имён авторов в файлах нет
- Проверка: `addlicense -c "<правообладатель>"` при добавлении; единообразие - ручное ревью.
- Источник: [OSPO: Authors file](https://opensource.google/documentation/reference/releasing/authors) (2025-06-10) · официальный гайд · высокая; [измерение](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев («The [Project] Authors» - 11 из 24, «Google LLC» - 5, «Google Inc.» - 5, «DeepMind» - 1 (optax); без заголовков - 2) · средняя.
- В `AUTHORS` добавляют по просьбе автора; на владение правами запись не влияет, точным реестром OSPO считает историю коммитов.
- Расхождение источников: C++ и Python Style Guide советуют не ставить в новые файлы копирайт и строку автора ([cppguide: File Comments](https://google.github.io/styleguide/cppguide.html#File_Comments)) - так устроена внутренняя кодовая база. Для открытого репозитория профиль берёт требование OSPO: копирайт есть, имён авторов нет.

### G-REPO-013 · MUST · В блоке заголовка с построчным префиксом комментария нет строк без префикса
- Проверка: addlicense формирует блок правильно; рукописные заголовки - ручное ревью.
- Источник: [OSPO: Preparing](https://opensource.google/documentation/reference/releasing/preparing) (2025-06-10) · официальный гайд · высокая.
- Пример:

```python
# плохо: пустая строка разрывает блок
# Copyright 2026 The Example Authors

# Licensed under the Apache License, Version 2.0 (the "License");

# хорошо
# Copyright 2026 The Example Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
```

### G-REPO-014 · MUST · Чужой код, скопированный в репозиторий, лежит в `third_party/<библиотека>/` в корне, и у каждой библиотеки есть свой `LICENSE`
- Проверка: частично: `for d in third_party/*/; do test -f "$d/LICENSE" || echo "$d"; done`; чужой код в других каталогах - ручное ревью.
- Источник: [OSPO: Preparing](https://opensource.google/documentation/reference/releasing/preparing) (2025-06-10) · официальный гайд · высокая; [измерение](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (`third_party/` в корне - 6 из 24, где-либо в дереве - 8 из 24; сколько репозиториев вообще хранят чужой код, не измерено) · низкая.
- Исключения из источника: форк сохраняет раскладку апстрима; экосистема со своим соглашением называет каталог иначе (`vendor`); зависимости, которые ставит пакетный менеджер, в репозиторий не копируют.

### G-REPO-015 · MUST · В файлах чужого кода сохраняются исходные заголовки; заголовки проекта на `third_party/` не ставят
- Проверка: `addlicense -check -ignore "third_party/**" .`
- Источник: [OSPO: Preparing](https://opensource.google/documentation/reference/releasing/preparing) (2025-06-10) · официальный гайд · высокая.

### G-REPO-016 · SHOULD · У проекта есть список допустимых лицензий зависимостей; AGPL, SSPL, OSL, BUSL, некоммерческие лицензии и Commons Clause в него не входят
- Проверка: сканер лицензий (Google инструмент публично не называет; не Google) и ручное ревью.
- Источник: [OSPO: Third-party licenses](https://opensource.google/documentation/reference/thirdparty/licenses) (2026-06-05) · официальный гайд · высокая; [OSPO: AGPL policy](https://opensource.google/documentation/reference/using/agpl-policy) (2025-06-10) · официальный гайд · высокая.
- У Google это MUST NOT для собственной кодовой базы; в профиле - SHOULD: это корпоративная юридическая политика, а не норма для чужих проектов. Категории Google (`restricted`, `reciprocal`, `notice`, `permissive`, `unencumbered`) годятся как основа своего списка.

### G-REPO-017 · MUST · Вклад внешнего участника принимают только после того, как он принял условия передачи прав; условия покрывают отправителя PR и всех авторов коммитов
- Проверка: обязательный статус в защите ветки (у Google - `cla/google`); ручное ревью.
- Источник: [OSPO: Accepting contributions](https://opensource.google/documentation/reference/releasing/contributions) (2025-06-10) · официальный гайд · высокая; [OSPO: CLA policy](https://opensource.google/documentation/reference/cla/policy) (2022-04-20) · официальный гайд · высокая; [измерение](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (CLA в CONTRIBUTING - 22 из 24, с учётом ссылок - 24 из 24; DCO - 0 из 24) · высокая.
- CLA Google и проверяющее его приложение обслуживают только проекты Google. В своём проекте выберите один механизм и запишите его в CONTRIBUTING: собственный CLA либо DCO с `Signed-off-by` - оба варианта «не Google». Сам Google DCO не использует.

### G-REPO-018 · SHOULD · README прямо говорит о статусе поддержки проекта
- Проверка: ручное ревью; в проектах Google - `grep -q "not an officially supported Google product" README.md`.
- Источник: [OSPO: Publishing](https://opensource.google/documentation/reference/releasing/publishing) (2025-06-10) · официальный гайд · высокая; [измерение](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (8 из 24) · высокая.
- У Google это MUST: неофициальный проект несёт фразу «This is not an officially supported Google product». На практике дисклеймер есть в трети репозиториев, точная формулировка - в одном из восьми. В профиле - SHOULD с другим содержанием: в чужом проекте фраза о продукте Google была бы неправдой, а её цель - честно задать ожидания от поддержки - переносится.

### G-REPO-019 · SHOULD · В новом коде, комментариях, документации и сообщениях коммитов нет терминов master/slave, whitelist/blacklist, redline; о человеке неизвестного пола пишут they/them
- Проверка: частично: `git grep -nwiE 'whitelist|blacklist|slave'` (команда составлена по образцу Chromium; линтера Google не публикует); остальное - ручное ревью.
- Источник: [OSPO: Preparing](https://opensource.google/documentation/reference/releasing/preparing) (2025-06-10) · официальный гайд · высокая; [C++ Style Guide: Inclusive Language](https://google.github.io/styleguide/cppguide.html#Inclusive_Language) (2026-09-29) · официальный гайд · высокая; [Android: Respectful code](https://source.android.com/docs/setup/contribute/respectful-code) (2026-06-17) · производный гайд проекта · высокая. Уровень: основная формулировка OSPO - «should avoid», но там же сказано, что новые проекты «must comply with this policy»; SHOULD - решение профиля, для нового открытого проекта правило можно считать MUST.
- Замены из [word list](https://developers.google.com/style/word-list): allowlist, denylist (у Chromium - blocklist), placeholder вместо dummy. Исключение - совместимость с внешним API. Следствие - основная ветка `main`: так в 14 из 24 репозиториев, 9 старых остаются на `master` (G-BR-002 в [branches.md](branches.md)).

## Командная работа: владельцы, защита ветки, проверки

OSPO и `google/new-project` о `CODEOWNERS` молчат. Внутри Google владельцев задают файлы `OWNERS` в каталогах монорепозитория ([Software Engineering at Google, гл. 9](https://abseil.io/resources/swe-book/html/ch09.html)); на GitHub их роль играет `CODEOWNERS` вместе с защитой ветки. Настройки googleapis (фрагмент `.github/sync-repo-settings.yaml` из release-please; бот, применявший файл, объявлен устаревшим; файл остался описанием политики):

```yaml
mergeCommitAllowed: false
branchProtectionRules:
  - pattern: main
    requiredApprovingReviewCount: 1
    requiresCodeOwnerReviews: true
    requiresStrictStatusChecks: true
    requiredStatusCheckContexts: [cla/google, docs, lint, test (18), windows]
```

Здесь - настройки репозитория. Процесс описан рядом: слияние только через PR или MR и squash - G-BR-005 и G-BR-006 в [branches.md](branches.md); одобрение ревьюера и владельца кода - G-CR-001 и G-CR-016 в [code-review.md](code-review.md).

### G-REPO-020 · SHOULD · Владельцы кода записаны в `CODEOWNERS`: владелец по умолчанию и владельцы каталогов, предпочтительно команды
- Проверка: наличие `.github/CODEOWNERS`; настройка «Require review from Code Owners».
- Источник: [googleapis/release-please: CODEOWNERS](https://github.com/googleapis/release-please/blob/main/.github/CODEOWNERS) (HEAD 2026-10-05) · конфиг или инструмент · высокая; [измерение](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (9 из 24) · средняя · реконструкция.
- Все 9 репозиториев ведутся прямо на GitHub. Команды-владельцы - у googleapis и GoogleCloudPlatform, персональные - у tensorflow и bazel. Шаблоны: [GitHub](../../templates/github/CODEOWNERS), [GitLab](../../templates/gitlab/CODEOWNERS).

### G-REPO-021 · MUST · Основная ветка защищена: любое изменение, в том числе от участников проекта, проходит через PR или MR с одобрением хотя бы одного ревьюера
- Проверка: настройки защиты ветки; OpenSSF Scorecard `Branch-Protection`, `Code-Review`.
- Источник: [new-project: docs/contributing.md](https://github.com/google/new-project/blob/main/docs/contributing.md) (2023-06-22) · конфиг или инструмент · высокая; [OSPO: GitHub services](https://opensource.google/documentation/reference/github/services) (2025-06-10) · официальный гайд · высокая; [измерение](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (требование ревью в тексте CONTRIBUTING - 16 из 24; настройки видны в 3 из 24) · средняя.

### G-REPO-022 · SHOULD · Слияние блокируют обязательные проверки: CI (тесты, lint), проверка условий вклада и ревью владельца кода; ветка PR должна быть актуальной
- Проверка: список required status checks в настройках ветки.
- Источник: [googleapis/release-please: sync-repo-settings.yaml](https://github.com/googleapis/release-please/blob/main/.github/sync-repo-settings.yaml) (HEAD 2026-10-05) · конфиг или инструмент · высокая; [OSPO: CLA on GitHub](https://opensource.google/documentation/reference/cla/github) (2025-06-10) · официальный гайд · высокая; [измерение](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (3 из 3 репозиториев, где настройки лежат в коде; у остальных 21 они не видны) · средняя · реконструкция.

### G-REPO-023 · MUST · У внешних участников нет административного доступа; тот, кто сливает PR, убеждается, что проверка условий вклада пройдена
- Проверка: аудит прав доступа; ручное ревью.
- Источник: [OSPO: GitHub repositories](https://opensource.google/documentation/reference/github/repos) (2025-06-10) · официальный гайд · высокая.

### G-REPO-024 · MUST · Сторонние действия в workflow GitHub Actions закреплены на SHA коммита, а не на тег или ветку
- Проверка: OpenSSF Scorecard `Pinned-Dependencies`; zizmor или actionlint (не Google).
- Источник: [OSPO: GitHub services](https://opensource.google/documentation/reference/github/services) (2025-06-10) · официальный гайд · высокая; [измерение](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (не менее 90 % действий закреплены SHA - 12 из 24) · высокая.
- Тег может переписать мейнтейнер действия, коммит - нет. Версию пишут комментарием: `uses: actions/checkout@<sha> # v7.0.1`. Там же OSPO советует `timeout-minutes` и `concurrency`; блок `permissions:` во всех workflow - у 14 из 24.

## README и документация

Правила разметки - из [docguide](https://google.github.io/styleguide/docguide/) (версия 2.0), правила текста - из [Google developer documentation style guide](https://developers.google.com/style). Оба источника - рекомендации: единственное «must» касается имени `README.md`. Линтера Markdown Google не публикует; коды markdownlint ниже - ближайшая автоматическая проверка, «не Google». Старшинство по гайду: правила проекта, затем гайд Google, затем сторонние справочники.

### G-DOC-001 · MUST · Файл называется `README.md` и лежит в корне каталога с кодом, а не в каталоге документации
- Проверка: `test -f README.md`.
- Источник: [docguide: READMEs](https://google.github.io/styleguide/docguide/READMEs.html) (2024-07-08) · официальный гайд · высокая.

### G-DOC-002 · SHOULD · README отвечает на пять вопросов: что это и зачем, к кому обращаться, каков статус, как пользоваться, где документация
- Проверка: ручное ревью.
- Источник: [docguide: What to put in your README](https://google.github.io/styleguide/docguide/READMEs.html#what-to-put-in-your-readme) (2024-07-08) · официальный гайд · высокая; [OSPO: Preparing](https://opensource.google/documentation/reference/releasing/preparing) (2025-06-10) · официальный гайд · высокая.
- «Как пользоваться» - пример кода или команды, которые можно скопировать. Шаблон: [README.md](../../templates/repo/README.md).

### G-DOC-003 · SHOULD · У каждого каталога верхнего уровня с самостоятельным пакетом есть актуальный `README.md`
- Проверка: частично: скрипт по каталогам; актуальность - ручное ревью.
- Источник: [docguide: Where to put your README](https://google.github.io/styleguide/docguide/READMEs.html#where-to-put-your-readme) (2024-07-08) · официальный гайд · высокая; [измерение](../../research/google.md) (2026-10-09) · практика, выведенная из репозиториев (в google-research README есть в 735 из 755 каталогов проектов) · высокая.

### G-DOC-004 · SHOULD · Документацию меняют в том же PR, что и код
- Проверка: пункт чек-листа в шаблоне PR; ручное ревью.
- Источник: [docguide: Update Docs with Code](https://google.github.io/styleguide/docguide/best_practices.html#update-docs-with-code) (2024-09-11) · официальный гайд · высокая.

### G-DOC-005 · SHOULD · Документации мало, и она верна: устаревшее удаляют, чужие руководства не пересказывают, а дают ссылку
- Проверка: ручное ревью.
- Источник: [docguide: Minimum Viable Documentation](https://google.github.io/styleguide/docguide/best_practices.html#minimum-viable-documentation), [Duplication is Evil](https://google.github.io/styleguide/docguide/best_practices.html#duplication-is-evil), [Documentation is the Story of Your Code](https://google.github.io/styleguide/docguide/best_practices.html#documentation-is-the-story-of-your-code) (2024-09-11) · официальный гайд · высокая.
- Каталог `docs/` по гайду объясняет четыре вещи: как начать пользоваться, как запускать тесты, как отлаживать и как выпускать релиз.

### G-DOC-006 · SHOULD · Строки Markdown не длиннее 80 символов; исключения - ссылки, таблицы, заголовки, блоки кода
- Проверка: markdownlint `MD013` (не Google).
- Источник: [docguide: Character line limit](https://google.github.io/styleguide/docguide/style.html#character-line-limit) (2026-09-14) · официальный гайд · высокая.

### G-DOC-007 · SHOULD · Документ начинается с единственного H1 и введения в 1-3 предложения; заголовки - в стиле ATX, с уникальными полными названиями
- Проверка: markdownlint `MD003`, `MD025`, `MD024` (не Google); введение - ручное ревью.
- Источник: [docguide: Document layout](https://google.github.io/styleguide/docguide/style.html#document-layout), [Headings](https://google.github.io/styleguide/docguide/style.html#headings) (2026-09-14) · официальный гайд · высокая.
- Директива `[TOC]` из гайда рассчитана на Gitiles; на других площадках оглавление строят их средствами.

### G-DOC-008 · SHOULD · Многострочный код оформляют огороженным блоком с указанием языка, а не отступом в четыре пробела
- Проверка: markdownlint `MD040`, `MD046` (не Google).
- Источник: [docguide: Code](https://google.github.io/styleguide/docguide/style.html#code) (2026-09-14) · официальный гайд · высокая.

### G-DOC-009 · SHOULD · Вместо HTML - Markdown; хвостовых пробелов нет
- Проверка: markdownlint `MD033`, `MD009` (не Google).
- Источник: [docguide: Strongly prefer Markdown to HTML](https://google.github.io/styleguide/docguide/style.html#strongly-prefer-markdown-to-html), [Trailing whitespace](https://google.github.io/styleguide/docguide/style.html#trailing-whitespace) (2026-09-14) · официальный гайд · высокая.
- Принудительный перенос строки, если он нужен, делают обратной косой чертой в конце строки, а не двумя пробелами.

### G-DOC-010 · SHOULD · Текст ссылки называет цель; ссылки внутри репозитория не поднимаются через `../`
- Проверка: ручное ревью.
- Источник: [docguide: Links](https://google.github.io/styleguide/docguide/style.html#links) (2026-09-14) · официальный гайд · высокая.
- Пример:

```markdown
<!-- плохо -->
Подробности [здесь](../../guides/style.md).

<!-- хорошо -->
Подробности - в [руководстве по стилю](/docs/guides/style.md).
```

### G-DOC-011 · SHOULD · Английский текст документации: второе лицо, действительный залог, заголовки в sentence case, условие перед инструкцией, код моноширинным шрифтом, нумерованный список только для последовательности шагов
- Проверка: ручное ревью.
- Источник: [Google developer documentation style guide: Highlights](https://developers.google.com/style/highlights) (2025-04-02) · официальный гайд · высокая.
- Гайд написан для английского языка (американская орфография, serial comma). К русскоязычной документации применимы только структурные правила G-DOC-006…010.

## GitHub и GitLab: различия

Столбец GitHub - то, что есть у Google. Столбец GitLab - перенос; свойства GitLab сверены с docs.gitlab.com 2026-10-09.

| Что | GitHub | GitLab (перенос - не Google) |
|---|---|---|
| Шаблон PR / MR | `.github/PULL_REQUEST_TEMPLATE.md` | `.gitlab/merge_request_templates/Default.md`: `Default.md` подставляется сам; есть переменные (`%{source_branch}`, `%{first_multiline_commit}`) и quick actions |
| Шаблоны issue | `.github/ISSUE_TEMPLATE/`: Markdown с front matter или YAML-формы; `config.yml` с `blank_issues_enabled` и `contact_links` | `.gitlab/issue_templates/*.md`: только Markdown; форм и `config.yml` нет, метки ставит quick action `/label` |
| Владельцы кода | `CODEOWNERS` в `.github/`, корне или `docs/`; действует последнее совпавшее правило; отрицания `!` нет | `CODEOWNERS` в корне, `docs/` или `.gitlab/`; секции `[Имя]`, необязательные `^[Имя]`, число одобрений `[Имя][2]`, исключения `!`; тариф Premium или Ultimate |
| Обязательное ревью владельца | «Require review from Code Owners» в защите ветки | «Require approval from code owners» в правилах ветки (Premium) |
| Число одобрений | защита ветки или rulesets | approval rules (Premium) |
| Обязательные проверки | required status checks | «Pipelines must succeed» в настройках merge requests |
| Общие файлы организации | репозиторий `<org>/.github`: CODE_OF_CONDUCT, CONTRIBUTING, SECURITY, шаблоны (но не LICENSE) | для файлов аналога нет - их кладут в каждый репозиторий; шаблоны описаний уровня группы - Premium |
| Проверка условий вклада | приложение Google CLA, статус `cla/google` - только для проектов Google | публичных данных не найдено; свой job в CI |
| Сообщения об уязвимостях | вкладка Security policy, GitHub Security Advisories | `SECURITY.md` - обычный файл; закрытый канал - e-mail или confidential issue |
| Заголовки лицензии | addlicense в workflow или pre-commit | тот же CLI в job |

`Fixes #N` закрывает issue на обеих площадках. Из-за различий в `CODEOWNERS` шаблоны разные: файл для GitHub плоский, файл для GitLab разбит на секции.

## Чего в публичных правилах Google нет

- Формата файлов `METADATA` и `README.google` внутри `third_party/<библиотека>` - публичных данных не найдено: открытая страница OSPO содержит только обзор.
- Официального `.pre-commit-config.yaml`, линтера Markdown и workflow для CI - публичных данных не найдено; в `google/new-project` нет ни одного CI-файла.
- Инструмента проверки лицензий зависимостей - публичных данных не найдено.
- Правил и шаблонов для GitLab - публичных данных не найдено: страница OSPO о хостинге рекомендует GitHub и GitLab не упоминает.
