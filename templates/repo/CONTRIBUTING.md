<!--
Профиль Google · шаблон CONTRIBUTING.md.
Основа: google/new-project, docs/contributing.md (Apache-2.0). Правила:
G-REPO-003, G-REPO-010, G-REPO-017, G-REPO-021 в docs/git/repository.md.
Как пользоваться: положите файл в корень репозитория (Google допускает также
docs/contributing.md), замените все <PLACEHOLDER>, оставьте ОДИН вариант
условий вклада и удалите все комментарии, включая этот.
-->

# How to contribute

We would love to accept your patches and contributions to this project.

## Before you begin

### Accept the contribution terms

<!--
УСЛОВИЯ ВКЛАДА - обязательный раздел, текст выбираете вы.
Что делает Google: в проектах Google раздел называется «Sign our Contributor
License Agreement», включается без изменений и требует подписать Google CLA
на https://cla.developers.google.com/. Google CLA и приложение, которое его
проверяет, обслуживают только проекты Google. Вы не Google: ссылаться на
Google CLA нельзя. Оставьте вариант A или вариант B.

Вариант A - собственный CLA. Ближе всего к практике Google; текст ниже
повторяет формулировку шаблона Google с вашими реквизитами. Нужен сервис,
который собирает подписи и ставит статус проверки в PR или MR.
-->

Contributions to this project must be accompanied by a
[Contributor License Agreement](<CLA_URL>) (CLA). You (or your employer) retain
the copyright to your contribution; this simply gives us permission to use and
redistribute your contributions as part of the project.

If you or your current employer have already signed the <ORG> CLA (even if it
was for a different project), you probably don't need to do it again.

<!--
Вариант B - DCO («не Google»: Google DCO не использует). Удалите два абзаца
варианта A и раскомментируйте текст:

Contributions to this project must be signed off under the
[Developer Certificate of Origin](https://developercertificate.org/). Add a
`Signed-off-by` line to every commit, for example with `git commit -s`.
-->

### Review our community guidelines

This project follows the [code of conduct](CODE_OF_CONDUCT.md).

## Contribution process

### Open an issue first

For anything larger than a small fix, open an issue before you write code, so
that we can agree on the approach.

### Code reviews

<!-- Для GitLab замените «GitHub pull requests» на «GitLab merge requests». -->

All submissions, including submissions by project members, require review. We
use GitHub pull requests for this purpose.

### Before you send a change

- Keep the change small and focused on one thing.
- Add or update tests, and make sure that tests and linters pass:

  ```sh
  <command that runs the linters>
  <command that runs the tests>
  ```

- Update the documentation in the same change.
- Follow the [style guide](<STYLE_GUIDE_URL>) and the
  [commit message rules](<COMMIT_RULES_URL>).
- Add the license header to every new source file.

### Source code headers

Every file containing source code must include copyright and license
information. Use the year the file was created, and don't update the year when
you change the file later.

<!--
Что делает Google: в заголовке стоит «Google LLC» либо «The <Project> Authors».
Впишите своего правообладателя. Заголовки добавляет и проверяет addlicense:
  addlicense -c "<COPYRIGHT_HOLDER>" -l apache -ignore "third_party/**" .
-->

```text
Copyright <YEAR> <COPYRIGHT_HOLDER>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

Don't add this header to files under `third_party/`: third-party files keep
their original headers.
