<!--
Профиль Google · шаблон SECURITY.md.
Основа: шаблоны политик из google/oss-vulnerability-guide,
templates/security_policies/ (CC BY 4.0; репозиторий не обновляется
с 2021-03-11). Правило G-REPO-005 в docs/git/repository.md.

Что делает Google: проекты в организациях Google не держат свой канал.
Их SECURITY.md отправляет на https://g.co/vulnz, а раскрытие координируют
через GitHub Security Advisory. Этот канал принимает отчёты только о проектах
Google. Вы не Google: не указывайте g.co/vulnz, впишите собственный канал.

Как пользоваться: положите файл в корень репозитория, замените все
<PLACEHOLDER>, оставьте один канал приёма и удалите комментарии.
Варианты канала:
  - e-mail группы, которая разбирает уязвимости;
  - GitHub: закрытое сообщение об уязвимости на вкладке Security, если эта
    функция включена в репозитории;
  - GitLab: confidential issue.
Сроки «3 рабочих дня» и «90 дней» - значения из шаблона Google; поменяйте их,
если не сможете выдержать.
-->

# Security policy

## Report a vulnerability

Don't report security vulnerabilities through public issues, pull requests, or
discussions.

To report a security issue, <email <SECURITY_CONTACT_EMAIL> | describe your
private reporting channel>. Include:

- a description of the issue;
- the steps you took to create the issue;
- affected versions;
- mitigations for the issue, if known.

Our vulnerability management team will respond within 3 working days of your
report. If the issue is confirmed as a vulnerability, we will open a security
advisory and work with you on the fix.

## Disclosure

This project follows a 90 day disclosure timeline.
