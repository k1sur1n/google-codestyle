<!--
Профиль Google · шаблон README.md.
Основа: docguide «READMEs» (google/styleguide, CC-BY 3.0) и документация
Google OSPO «Preparing for release» (CC BY 4.0). Правила: G-DOC-001, G-DOC-002,
G-REPO-018 в docs/git/repository.md профиля.
Как пользоваться: положите файл в корень репозитория, замените все
<PLACEHOLDER>, удалите ненужные разделы и все комментарии, включая этот.
Разметка следует docguide: один H1, строки до 80 символов, блоки кода
с указанием языка, заголовки в sentence case.
-->

# <PROJECT>

<One or two sentences that state plainly what the project does and who it is
for.>

<!--
СТАТУС ПОДДЕРЖКИ - необязательный блок.
Что делает Google: проект, который не является официальным продуктом Google,
обязан нести в README фразу «This is not an officially supported Google
product». Вы не Google, поэтому эту фразу копировать нельзя. Напишите правду
о своём проекте: кто его поддерживает и чего ждать пользователю. Один из
вариантов ниже оставьте, остальные удалите.
-->

> **Status:** <experimental | actively maintained | maintenance only>.
> <This is not an officially supported <ORG> product. | Support is provided on
> a best-effort basis through the issue tracker.>

## Get started

Prerequisites: <language or runtime and its minimum version>.

```sh
<command that installs or builds the project>
<command that runs the smallest working example>
```

## Use <PROJECT>

```<language>
<the smallest example that shows the main use case>
```

## Documentation

- [User guide](docs/<FILE>.md)
- [How to run the tests](docs/<FILE>.md)
- [How to release](docs/<FILE>.md)

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md). All changes, including changes by
project members, go through code review.

## Report a security issue

Follow [SECURITY.md](SECURITY.md). Don't open a public issue for a
vulnerability.

## Contact

- Maintainers: <TEAM_OR_NAMES>
- Questions and discussion: <ISSUE_TRACKER_OR_FORUM_URL>

## License

<PROJECT> is licensed under the Apache License, Version 2.0. See
[LICENSE](LICENSE). Code under `third_party/` keeps its original licenses.
