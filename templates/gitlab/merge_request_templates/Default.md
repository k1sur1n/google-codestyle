<!--
Перенос на GitLab - не Google. Профиль Google · шаблон merge request.
Google не публикует шаблонов для GitLab. Текст перенесён из google/new-project,
.github/PULL_REQUEST_TEMPLATE.md (Apache-2.0): «PR» заменено на «MR», последний
пункт чек-листа добавлен профилем. Правило G-REPO-007 в docs/git/repository.md.

Куда положить: .gitlab/merge_request_templates/Default.md в ветке по умолчанию.
Отличия от GitHub:
  - файл с именем Default.md GitLab подставляет в каждый новый MR сам;
    остальные шаблоны из каталога автор выбирает в списке;
  - в Default.md работают переменные, например %{first_multiline_commit}
    и %{source_branch};
  - строка, начинающаяся с «/», - quick action (например /assign_reviewer);
  - «Fixes #N» закрывает issue при слиянии в ветку по умолчанию, как на GitHub.
Удалите этот комментарий после копирования.
-->
Fixes #<issue_number_goes_here>

> It's a good idea to open an issue first for discussion.

- [ ] Tests pass
- [ ] Appropriate changes to documentation are included in the MR
- [ ] New source files have the license header
