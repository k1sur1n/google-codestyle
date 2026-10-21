# Дополнительные языки - профиль Google

> Данные актуальны на 2026-10-09.

Из десяти языков-ориентиров профиль разбирает шесть полностью (TypeScript/JavaScript, Java, Kotlin, Go, C#, Rust), два кратко (PHP, Ruby) и исключает Scala и Elixir - так их распределяют Stack Overflow Developer Survey 2025-2026, JetBrains State of Developer Ecosystem 2025 и GitHub Octoverse 2025. Публичный гайд Google есть у TypeScript, JavaScript (заморожен с 2024-07), Java, Go и C# - в google/styleguide - и у Kotlin - на developer.android.com. Для Rust, PHP, Ruby, Scala и Elixir прозаического гайда нет: у Ruby есть только RuboCop-конфиг `google-style`, у Rust гайд существует внутри Google и не опубликован. Из инструментов для этих языков сам Google поддерживает и держит в согласии с текущим гайдом только google-java-format, Error Prone и gofmt; gts мягче гайда, eslint-config-google в архиве с 2026-06-01, а `ktfmt --google-style` расходится с публичным Kotlin-гайдом (2 пробела против 4).

Связанные документы профиля: [python.md](python.md) · [cpp.md](cpp.md) · [Angular](../frameworks/angular.md) · [React](../frameworks/react.md) · [матрица проверок](../enforcement.md) · веб-конфиги: [eslint.config.js](../../configs/web/eslint.config.js), [.prettierrc.json](../../configs/web/.prettierrc.json), [.stylelintrc.json](../../configs/web/.stylelintrc.json).

Как читать правила. Уровень `MUST` стоит там, где сам гайд формулирует правило как обязательное или где его навязывает форматтер; `SHOULD` - рекомендации. Гайды Java, Kotlin и C# не пользуются словами RFC 2119: их декларативные формулировки («is used», «are not used») здесь считаются `MUST`, слова «prefer», «avoid», «should» - `SHOULD`. Правила с пометкой «не Google» взяты из норм сообщества и в профиле всегда имеют уровень `SHOULD`, даже если первоисточник пишет «MUST».

## 1. Какие языки включены и почему

Опорные данные - три источника из брифа. На 2026-10-09 издание 2026 года есть только у Stack Overflow: оно вышло 2026-10-06, на вопрос о языках ответили 14 099 человек против 31 771 в 2025 году. JetBrains State of Developer Ecosystem 2026 и GitHub Octoverse 2026 ещё не опубликованы, поэтому взяты издания 2025 года (JetBrains: 24 534 респондента, публикация в октябре 2025; Octoverse: публикация 2025-10-28, данные за 2024-09 … 2025-08).

| Язык | Stack Overflow 2025 → 2026, % использующих | JetBrains 2025 | Octoverse 2025 | Решение | Причина |
|---|---|---|---|---|---|
| TypeScript / JavaScript (Node.js) | TS 43,6 → 43,8; JS 66,0 → 62,0 | TS - первый в Language Promise Index и «most dramatic rise» за пять лет; JS - «плато зрелости» | TS - № 1 (2,64 млн контрибьюторов, +66,6 % за год); JS - № 3 (+24,8 %) | включён | лидеры всех трёх источников; у Google есть гайды по обоим языкам |
| Java | 29,4 → 27,6 | основной язык для 33 % (вторичный источник) | № 4 (+20,7 %) | включён | массовый бэкенд-язык; гайд Google обновлён в 2026 году |
| C# | 27,8 → 27,1 | основной язык для 12 % (вторичный источник) | № 5 (+22,2 %) | включён | сопоставим с Java по Stack Overflow; гайд есть в google/styleguide |
| Go | 16,4 → 16,5 | № 1 среди языков, которые хотят освоить (11 %); четвёртый в Promise Index | в топ-10 (место не названо) | включён | язык Google с собственным гайдом; рост подтверждён JetBrains |
| Rust | 14,8 → 18,0 (самый «восхищающий» оба года: 72,4 и 67,4 %) | второй в Promise Index; хотят освоить 10 % | в топ-10 не входит | включён | самый заметный рост в Stack Overflow 2026 (+3,2 п. п.) |
| Kotlin | 10,8 → 10,8 | «slow, steady ascent»; хотят освоить 6 % | в топ-10 не входит | включён | больше 10 % в Stack Overflow; гайд Google есть (Android) |
| PHP | 18,9 → 17,7 | «long-term decline», «плато зрелости» | в топ-10 (место не названо) | включён кратко | крупная, но снижающаяся база; гайда Google нет |
| Ruby | 6,4 → 5,8 | «long-term decline» | в топ-10 не входит | включён кратко | меньше 10 % и падает; у Google есть только RuboCop-конфиг |
| Scala | 2,6 → 2,2 | основной язык для 2 %; лидер среди самых высокооплачиваемых (38 %) | не упомянут | исключён | около 2 % и нет признаков роста |
| Elixir | 2,7 → 2,6 (Admired 65,9 → 62,1) | в верхние списки не входит | не упомянут | исключён | около 2,6 %; высокая лояльность при малой базе |

Источники таблицы: Stack Overflow - [2025](https://survey.stackoverflow.co/2025/technology), [2026](https://survey.stackoverflow.co/2026/technology/data); JetBrains - [итоговый пост 2025](https://blog.jetbrains.com/research/2025/10/state-of-developer-ecosystem-2025/), [раздел о трендах](https://devecosystem-2025.jetbrains.com/tools-and-trends), [Go Language Trends 2025](https://blog.jetbrains.com/go/2025/11/10/go-language-trends-ecosystem-2025/); доли «основного языка» JetBrains - по пересказу графиков в [Blog du Modérateur](https://www.blogdumoderateur.com/etude-langages-utilises-developpeurs-2025/) (сторонний источник, уверенность средняя: на сайте отчёта цифры зашиты в графики); Octoverse - [отчёт 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/).

Интерпретация: критерий отбора - наш, в опросах его нет. «Включён» - не меньше 10 % в Stack Overflow 2025/2026, либо топ-5 Octoverse, либо верх списков JetBrains (Promise Index, «хотят освоить»). «Включён кратко» - 5-20 % в Stack Overflow при зафиксированном JetBrains долгом спаде. «Исключён» - меньше 5 % и отсутствие в верхних списках всех трёх источников.

Оговорки к данным:

- База Stack Overflow 2026 по языкам вдвое меньше базы 2025, поэтому сдвиги меньше примерно 1 п. п. (Go, Kotlin, Elixir, TypeScript) трендом считать нельзя. Заметны Rust (+3,2), JavaScript (−4,0), Java (−1,8), PHP (−1,2).
- Octoverse считает уникальных ежемесячных контрибьюторов по языку репозитория; места с шестого по десятое в отчёте не подписаны, поэтому для Go и PHP известно только «в топ-10».
- Swift, Dart и Zig в состав не добавлены: первые два - клиентские языки (данных о доле серверного Swift в трёх источниках нет), Zig - меньше 3 % и системный.

## 2. Сводная таблица

| Язык | Публичный гайд Google | Форматтер | Линтер | Конфиги (пакеты и версии) | Статус инструмента | Основной источник |
|---|---|---|---|---|---|---|
| TypeScript | да; последний экспорт 2023-10-11; раздела о форматировании нет | Prettier с настройками gts | ESLint + typescript-eslint с набором правил gts | `gts` 7.0.0 (2025-12-05): `eslint ^9.37.0`, `typescript-eslint ^8.46.1`, `prettier ^3.6.2`; Node ≥ 18, `typescript >=5`. Конфиги профиля ([configs/web](../../configs/web/eslint.config.js)) пакет gts не подключают: `eslint` 10.12.0, `typescript-eslint` 8.71.1, `prettier` 3.9.9 | gts: репозиторий Google, но README: «not an official Google product»; поддерживается вяло (HEAD 2026-01-16); гайду соответствует частично | [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) |
| JavaScript | да, но не обновляется с 2024-07 | clang-format (совет самого гайда) или тот же Prettier | `eslint-config-google` 0.14.0 - **архив**, не использовать; JS-файлы проверяет gts | - | eslint-config-google: официальный, в архиве с 2026-06-01, формат eslintrc, не для TypeScript | [JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html) |
| Java | да; обновлён 2026-09-09 | `google-java-format` 1.37.0 (JDK ≥ 21), настроек нет | Error Prone 2.50.0 (JDK ≥ 21); Checkstyle 14.3.0 с `google_checks.xml` - не Google | jar `google-java-format-1.37.0-all-deps.jar`; `com.google.errorprone:error_prone_core:2.50.0` | оба - официальные, поддерживаются, соответствуют гайду | [Java Style Guide](https://google.github.io/styleguide/javaguide.html) |
| Kotlin | да, вне google/styleguide: Android Kotlin style guide, 2026-09-22 | гайд не называет; `ktfmt` 0.64 с `--kotlinlang-style` - не Google | `ktlint` 1.8.0, стиль `android_studio` - не Google | jar `ktfmt-0.64-with-dependencies.jar` (Maven `com.facebook:ktfmt`) | ktfmt - не продукт Google (Meta → Kotlin/JetBrains); `--google-style` публичному гайду не соответствует | [Kotlin style guide](https://developer.android.com/kotlin/style-guide) |
| Go | да; обновлён 2026-03-18 | `gofmt` | гайд не называет; `go vet`, staticcheck 2026.2.1, golangci-lint v2.14.0 - не Google | `.golangci.yml` формата `version: "2"` | gofmt - часть тулчейна Go, вывод обязателен по гайду | [Go Style](https://google.github.io/styleguide/go/) |
| C# | да; по существу не менялся с 2020-06 | гайд не называет; `dotnet format` по `.editorconfig` - не Google; clang-format с `Language: CSharp` и `BasedOnStyle: Google` | анализаторы .NET - не Google | официального `.editorconfig` Google: публичных данных не найдено | инструментов Google нет | [C# at Google Style Guide](https://google.github.io/styleguide/csharp-style.html) |
| Rust | нет: публичных данных не найдено (внутренний гайд не опубликован) | `rustfmt` - не Google | `clippy` - не Google | `rustfmt.toml` | так делают Chromium и Fuchsia | [Chromium Rust style](https://chromium.googlesource.com/chromium/src/+/main/styleguide/rust/rust.md) |
| PHP | нет: публичных данных не найдено | PHP-CS-Fixer - не Google | PHP_CodeSniffer - не Google | набор правил `@PER-CS` | практика одного репозитория (google-cloud-php) | [PER Coding Style 3.1](https://www.php-fig.org/per/coding-style/) |
| Ruby | прозаического гайда нет; есть официальный RuboCop-конфиг | RuboCop (автоисправление) | RuboCop | gem `google-style` 1.32.0 (2026-03-10): `rubocop ~> 1.76`, Ruby ≥ 3.2 | официальный (googleapis), поддерживается | [googleapis/ruby-style](https://github.com/googleapis/ruby-style) |
| Scala (исключён) | нет: публичных данных не найдено | `scalafmt` - не Google | - | - | - | [Scala Style Guide](https://docs.scala-lang.org/style/) |
| Elixir (исключён) | нет: публичных данных не найдено | `mix format` - не Google | Credo - не Google | `.formatter.exs` | - | [mix format](https://mix.hexdocs.pm/Mix.Tasks.Format.html) |

### Инструменты из брифа: кто владелец и соответствуют ли они гайду

| Инструмент | Официальный продукт Google? | Поддерживается? | Последний релиз | Соответствует текущему гайду? |
|---|---|---|---|---|
| [google-java-format](https://github.com/google/google-java-format) | да | да (HEAD 2026-10-06) | 1.37.0, 2026-10-01 | да: гайд ссылается на его вывод как на образец переноса строк; флаг `--aosp` даёт стиль AOSP |
| [Error Prone](https://github.com/google/error-prone) | да | да (HEAD 2026-10-08) | 2.50.0, 2026-06-10 | это анализатор ошибок, а не проверка стиля; из правил гайда покрывает `@Override`, пустой `catch`, `switch`, финализаторы |
| [ktfmt](https://github.com/Kotlin/ktfmt), стиль `--google-style` | нет: создан в Meta, с лета 2026 года репозиторий принадлежит Kotlin/JetBrains | да (HEAD 2026-10-06) | 0.64, 2026-06-24; тег v0.65 от 2026-10-06 меняет пакет на `org.jetbrains.kotlinx.ktfmt` | нет: справка CLI называет стиль «Google internal style (2 spaces)», публичный гайд требует 4 пробела |
| [gts](https://github.com/google/gts) | репозиторий Google, команда Node.js; в README - «not an official Google product» | вяло (HEAD 2026-01-16) | 7.0.0, 2025-12-05 (ESLint 9, flat config) | частично: см. [расхождения](#расхождения-гайда-и-gts) |
| [eslint-config-google](https://github.com/google/eslint-config-google) | да | **нет - архив с 2026-06-01** | 0.14.0, 2019-09-02 | соответствует замороженному JS-гайду; eslintrc-формат, flat config не поддержан |
| [buildifier](https://github.com/bazel-contrib/buildtools) | исторически Bazel/Google; сейчас репозиторий `bazel-contrib/buildtools` | да (HEAD 2026-10-08) | v10.1.0, 2026-09-22 | да: гайд Bazel требует, чтобы формат BUILD-файлов совпадал с выводом buildifier |
| [swift-format](https://github.com/swiftlang/swift-format) | нет: проект swiftlang (Apple); начальную реализацию написали инженеры Google | да | 604.0.0, 2026-09-16 | умолчания (100 колонок, 2 пробела) совпадают с гайдом Google 2018 года; отдельного Google-конфига нет |

clang-format, cpplint, `pylintrc`, pyink и yapf разобраны в [cpp.md](cpp.md) и [python.md](python.md).

Вне бэкенд-таблицы, одной строкой:

- **Bazel (`BUILD`, `.bzl`).** Формат задаёт buildifier: `buildifier -r <каталог>`; установка - `go install github.com/bazel-contrib/buildtools/v10/buildifier@latest`. Источник: [BUILD Style Guide](https://bazel.build/build/style-guide).
- **Swift.** [Google Swift Style Guide](https://google.github.io/swift/) не обновлялся с 2018 года (до async/await и акторов) и распространяется под Apache-2.0, а не CC-BY. Умолчания swift-format (`lineLength: 100`, отступ 2 пробела) совпадают с числами гайда, но отдельного Google-конфига у инструмента нет.
- **Shell.** [Shell Style Guide](https://google.github.io/styleguide/shellguide.html) (обновлён 2026-09-24): только Bash, отступ 2 пробела, строка до 80 символов, ShellCheck для всех скриптов.

## 3. TypeScript и JavaScript

Источники и их состояние:

- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) - последний экспорт 2023-10-11. Публичная версия выкладывается вручную («pushed on-demand by volunteers») и адресована прежде всего тем, кто пишет код для импорта в Google. Раздела о форматировании в ней нет: ни отступа, ни длины строки.
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html) - не обновляется с 2024-07-02; сам гайд советует переходить на TypeScript. Из него профиль берёт только то, о чём TS-гайд молчит: отступ 2 пробела и 80 колонок.
- [gts](https://github.com/google/gts) 7.0.0 - готовая связка ESLint + typescript-eslint + Prettier от команды Google Node.js. Она задаёт формат, которого нет в публичном гайде, но часть запретов гайда не проверяет (см. ниже).
- `eslint-config-google` - в архиве с 2026-06-01, рассчитан на замороженный JS-гайд и формат eslintrc; в профиле не используется.

Правила ниже - уровень языка. Правила для компонентов, шаблонов и хуков - в [angular.md](../frameworks/angular.md) и [react.md](../frameworks/react.md).

Конфиги профиля - [eslint.config.js](../../configs/web/eslint.config.js) и [.prettierrc.json](../../configs/web/.prettierrc.json). Пакет gts они не подключают: его набор правил перенесён в `eslint.config.js` поштучно и дополнен запретами гайда, которых в gts нет (причины и версии - в шапке файла). Проект, которому хватает самого gts, может взять его целиком: `npx gts init` создаёт `eslint.config.js`, `.prettierrc.js`, `.editorconfig` и `tsconfig.json`, наследующий `gts/tsconfig-google.json` (`strict: true`, `target: ES2022`), а минимальный `eslint.config.js` состоит из одного элемента - `...require('gts')`.

### G-TS-001 · SHOULD · Новый код пишется на TypeScript; JavaScript остаётся только в уже существующих файлах
- Проверка: ручное ревью.
- Источник: [JavaScript Style Guide, уведомление в начале страницы](https://google.github.io/styleguide/jsguide.html) (не обновляется с 2024-07-02) · официальный гайд · высокая.

### G-TS-002 · MUST · Каждая инструкция заканчивается точкой с запятой, строки пишутся в одинарных кавычках
- Проверка: Prettier - `semi` (по умолчанию `true`), `singleQuote: true`; gts - `quotes` (уровень `warn`).
- Источник: [TypeScript Style Guide · Automatic Semicolon Insertion](https://google.github.io/styleguide/tsguide.html#automatic-semicolon-insertion); [Use single quotes](https://google.github.io/styleguide/tsguide.html#use-single-quotes) (экспорт 2023-10-11) · официальный гайд · высокая.

### G-TS-003 · MUST · Формат задаёт Prettier с настройками gts: отступ 2 пробела, висячие запятые, строка до 80 символов (в конфиге профиля - до 100, как у Angular); вручную формат не правят
- Проверка: `prettier --check .`; в gts - правило `prettier/prettier` (уровень `error`).
- Источник: [gts · .prettierrc.json](https://github.com/google/gts/blob/main/.prettierrc.json) (gts 7.0.0, 2025-12-05) · конфиг или инструмент · высокая; [JavaScript Style Guide · 4.2 Block indentation](https://google.github.io/styleguide/jsguide.html#formatting-block-indentation) и [4.4 Column limit: 80](https://google.github.io/styleguide/jsguide.html#formatting-column-limit) (не обновляется с 2024-07) · официальный гайд · высокая. В публичном TS-гайде этих чисел нет; уровень MUST - потому что формат навязывает инструмент.

О двух значениях ширины. 80 - число замороженного JS-гайда и умолчание Prettier, которое gts не меняет. 100 - отступление команды Angular: её репозиторий следует Google TypeScript Style, но переносит код на 100 символах ([CONTRIBUTING.md](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#rules)), и то же значение ставит [шаблон Angular CLI](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/workspace/files/.prettierrc.template). Общий [.prettierrc.json](../../configs/web/.prettierrc.json) профиля рассчитан на Angular и потому выставлен на 100; в проекте без Angular (Node.js-сервис, библиотека) удалите опцию `printWidth` - останется умолчание Prettier, 80. То же решение с обоснованием записано в [angular.md](../frameworks/angular.md).

### G-TS-004 · MUST · Экспорты только именованные, `export default` не используется
- Проверка: в gts правила нет; в конфиге профиля - ESLint `no-restricted-syntax` с селектором `ExportDefaultDeclaration` (дополнение профиля, не Google).
- Источник: [TypeScript Style Guide · Exports](https://google.github.io/styleguide/tsguide.html#exports) (экспорт 2023-10-11) · официальный гайд · высокая.
- Пример:

```ts
// плохо
export default class UserService {}

// хорошо
export class UserService {}
```

### G-TS-005 · MUST · Код делится на ES-модули (`import`/`export`), конструкция `namespace Foo {}` не используется
- Проверка: `@typescript-eslint/no-namespace` (входит в набор `recommended`, а значит и в gts).
- Источник: [TypeScript Style Guide · Use modules not namespaces](https://google.github.io/styleguide/tsguide.html#use-modules-not-namespaces) (экспорт 2023-10-11) · официальный гайд · высокая.

### G-TS-006 · MUST · Переменные объявляются через `const`, при переприсваивании - через `let`; `var` запрещён
- Проверка: gts - `no-var`, `prefer-const` (уровень `error`).
- Источник: [TypeScript Style Guide · Use const and let](https://google.github.io/styleguide/tsguide.html#use-const-and-let) (экспорт 2023-10-11) · официальный гайд · высокая.

### G-TS-007 · MUST · Сравнение - только `===` и `!==`; единственное исключение - проверка `== null`
- Проверка: ESLint `eqeqeq`; в gts стоит `'error'` без исключения для `null` (строже гайда), в конфиге профиля - `['error', 'always', {null: 'ignore'}]`.
- Источник: [TypeScript Style Guide · Equality checks](https://google.github.io/styleguide/tsguide.html#equality-checks) (экспорт 2023-10-11) · официальный гайд · высокая.

### G-TS-008 · SHOULD · Регистр имени зависит от вида идентификатора: `UpperCamelCase` - классы, интерфейсы, типы, enum, декораторы и параметры типов; `lowerCamelCase` - переменные, параметры, функции, методы и свойства; `CONSTANT_CASE` - глобальные константы и значения enum
- Проверка: частично: `@typescript-eslint/naming-convention` с селектором `typeLike` (дополнение профиля, не Google; в gts правила нет); регистр переменных, функций и констант - ручное ревью.
- Источник: [TypeScript Style Guide · Rules by identifier type](https://google.github.io/styleguide/tsguide.html#naming-rules-by-identifier-type) (экспорт 2023-10-11) · официальный гайд · высокая.

### G-TS-009 · MUST · Имена не несут служебных меток: без `_` в начале и в конце, без префикса `I` у интерфейсов; приватные члены объявляются словом `private`, а не как `#поле`
- Проверка: `@typescript-eslint/naming-convention` (`leadingUnderscore: 'forbid'`, `trailingUnderscore: 'forbid'`, запрет имён интерфейсов вида `IName`) и `no-restricted-syntax` с селектором по `PrivateIdentifier` - оба правила есть в конфиге профиля как дополнение, не Google.
- Источник: [TypeScript Style Guide · _ prefix/suffix](https://google.github.io/styleguide/tsguide.html#identifiers-underscore-prefix-suffix); [Naming style](https://google.github.io/styleguide/tsguide.html#naming-style); [No #private fields](https://google.github.io/styleguide/tsguide.html#private-fields) (экспорт 2023-10-11) · официальный гайд · высокая.
- Пример:

```ts
// плохо
interface IUser {
  name_: string;
}
class Cache {
  #items = new Map<string, string>();
}

// хорошо
interface User {
  name: string;
}
class Cache {
  private readonly items = new Map<string, string>();
}
```

### G-TS-010 · MUST · Проверку типов не отключают комментариями `@ts-ignore`, `@ts-expect-error` и `@ts-nocheck`
- Проверка: `@typescript-eslint/ban-ts-comment`; в gts - уровень `warn`, конфиг профиля поднимает его до `error`.
- Источник: [TypeScript Style Guide · @ts-ignore](https://google.github.io/styleguide/tsguide.html#ts-ignore) (экспорт 2023-10-11) · официальный гайд · высокая. В тестах гайд допускает `@ts-expect-error`, но советует обходиться без него.

Что ещё стоит знать (подробности - по ссылкам): `const enum` запрещён ([Const enums](https://google.github.io/styleguide/tsguide.html#enums)); `any` заменяют конкретным типом или `unknown` ([any](https://google.github.io/styleguide/tsguide.html#any)); объектные типы описывают через `interface`, а не псевдоним типа ([Prefer interfaces](https://google.github.io/styleguide/tsguide.html#prefer-interfaces)); для простых типов пишут `T[]`, а не `Array<T>` ([Array&lt;T&gt; Type](https://google.github.io/styleguide/tsguide.html#arrayt-type)); модификатор `public` не пишут ([Visibility](https://google.github.io/styleguide/tsguide.html#visibility)); внутри проекта импортируют по относительным путям ([Import paths](https://google.github.io/styleguide/tsguide.html#import-paths)); имена JS-файлов - строчными буквами с `_` или `-` ([File name](https://google.github.io/styleguide/jsguide.html#file-name), гайд не обновляется).

### Расхождения гайда и gts

| Тема | Гайд | gts 7.0.0 | Что делает конфиг профиля |
|---|---|---|---|
| `@ts-ignore` и варианты | запрещены | `ban-ts-comment: 'warn'` | уровень `error` (G-TS-010) |
| `== null` | разрешено | `eqeqeq: 'error'` без исключений | исключение для `null` (G-TS-007) |
| `export default`, `_`-имена, `#private`, `const enum`, модификатор `public` | запрещены | не проверяются | дополнительные правила ESLint с пометкой «не Google» (G-TS-004, G-TS-009) |
| Форматирование | в публичной версии не описано | Prettier: одинарные кавычки, `bracketSpacing: false`, `trailingComma: "all"`, `arrowParens: "avoid"`; ширина 80 и отступ 2 - умолчания Prettier | те же опции Prettier, но `printWidth: 100` (G-TS-003) |
| `T[]` для простых типов | рекомендуется | правило `array-type` добавлено в ветку `main` 2026-01-16 и в релиз 7.0.0 не входит | `@typescript-eslint/array-type` включено |

Во всех строках, где гайд и gts расходятся, профиль следует тексту гайда: гайд - официальный источник, а gts сам называет себя неофициальным продуктом. Что из конфигов запускалось локально, а что нет, записано в шапке [eslint.config.js](../../configs/web/eslint.config.js); настоящие плагины не устанавливались - реестр npm из среды сборки недоступен. Проверено локально для этого документа: примеры из G-TS-004 и G-TS-009 проходят `prettier --check` (Prettier 3.8.1) с опциями gts.

## 4. Java

[Google Java Style Guide](https://google.github.io/styleguide/javaguide.html) - самый свежий из дополнительных гайдов: правки 2025-04, 2025-09, 2026-04 и 2026-09-09. Интерпретация: текст рассчитан на Java 22-25 - он говорит о безымянных переменных `_`, Markdown-Javadoc (`///`), module imports и compact source files. Формат целиком берёт на себя `google-java-format`: настроек у него нет, а гайд ссылается на его вывод как на образец переноса строк.

```sh
# google-java-format 1.37.0 (2026-10-01); нужен JDK 21 или новее
java -jar google-java-format-1.37.0-all-deps.jar --replace $(git ls-files '*.java')
# проверка в CI
java -jar google-java-format-1.37.0-all-deps.jar --dry-run --set-exit-if-changed $(git ls-files '*.java')
# Error Prone 2.50.0 - флаги javac; артефакт com.google.errorprone:error_prone_core:2.50.0
#   -XDcompilePolicy=simple --should-stop=ifError=FLOW -Xplugin:ErrorProne
```

Не запускалось: jar-файлы google-java-format и Error Prone из среды сборки недоступны (JDK 21 есть); флаги сверены с README инструментов.

### G-JAVA-001 · MUST · Отступ блока - 2 пробела, символ табуляции в исходниках не используется
- Проверка: `google-java-format`; Checkstyle `Indentation`, `FileTabCharacter` (`google_checks.xml`, не Google).
- Источник: [Java Style Guide · 4.2 Block indentation](https://google.github.io/styleguide/javaguide.html#s4.2-block-indentation); [2.3.1 Whitespace characters](https://google.github.io/styleguide/javaguide.html#s2.3.1-whitespace-characters) (2026-09-09) · официальный гайд · высокая.

### G-JAVA-002 · MUST · Строка не длиннее 100 символов; строка-продолжение сдвигается минимум на 4 пробела
- Проверка: `google-java-format`; Checkstyle `LineLength` (не Google). Исключения гайда: строки `package` и `import`, длинные URL, текстовые блоки.
- Источник: [Java Style Guide · 4.4 Column limit: 100](https://google.github.io/styleguide/javaguide.html#s4.4-column-limit); [4.5.2 Indent continuation lines](https://google.github.io/styleguide/javaguide.html#s4.5.2-line-wrapping-indent) (2026-09-09) · официальный гайд · высокая.

### G-JAVA-003 · MUST · Фигурные скобки ставятся у `if`, `else`, `for`, `do` и `while` всегда, даже для одной инструкции; открывающая скобка остаётся на той же строке (стиль K&R)
- Проверка: Checkstyle `NeedBraces`, `LeftCurly`, `GoogleRightCurly` (не Google); расстановку переносов делает `google-java-format`.
- Источник: [Java Style Guide · 4.1.1 Use of optional braces](https://google.github.io/styleguide/javaguide.html#s4.1.1-braces-always-used); [4.1.2 Nonempty blocks: K & R style](https://google.github.io/styleguide/javaguide.html#s4.1.2-blocks-k-r-style) (2026-09-09) · официальный гайд · высокая.

### G-JAVA-004 · MUST · Импорты - без `*` и без `import module`; сначала все статические одной группой, после пустой строки - все остальные, внутри группы порядок ASCII
- Проверка: `google-java-format` (сортирует и удаляет неиспользуемые); Checkstyle `AvoidStarImport`, `AvoidModuleImport`, `CustomImportOrder` (не Google); Error Prone `WildcardImport` (уровень SUGGESTION, включается флагом `-Xep:WildcardImport:WARN`).
- Источник: [Java Style Guide · 3.3.1 No wildcard imports](https://google.github.io/styleguide/javaguide.html#s3.3.1-wildcard-imports); [3.3.1.1 No module imports](https://google.github.io/styleguide/javaguide.html#s3.3.1.1-module-imports); [3.3.3 Ordering and spacing](https://google.github.io/styleguide/javaguide.html#s3.3.3-import-ordering-and-spacing) (2026-09-09; запрет module imports - с 2026-04) · официальный гайд · высокая.
- Пример:

```java
// плохо
import java.util.*;
import static com.google.common.truth.Truth.assertThat;

// хорошо
import static com.google.common.truth.Truth.assertThat;

import java.util.List;
import java.util.Map;
```

### G-JAVA-005 · MUST · В файле ровно один класс верхнего уровня, имя файла совпадает с его именем, у файла есть объявление `package`
- Проверка: Checkstyle `OneTopLevelClass`, `OuterTypeFilename`, `PackageDeclaration` (не Google); Error Prone `MultipleTopLevelClasses` (уровень SUGGESTION).
- Источник: [Java Style Guide · 3.4.1 Exactly one top-level class declaration](https://google.github.io/styleguide/javaguide.html#s3.4.1-one-top-level-class); [3.2 Package declaration](https://google.github.io/styleguide/javaguide.html#s3.2-package-declaration) (2026-09-09; compact source files запрещены с 2026-04) · официальный гайд · высокая.

### G-JAVA-006 · MUST · Имена: пакеты - строчными буквами без `_`, классы - `UpperCamelCase`, методы, поля, параметры и локальные переменные - `lowerCamelCase`, константы - `UPPER_SNAKE_CASE`; префиксы и суффиксы вроде `mName`, `s_name`, `kName`, `name_` не используются
- Проверка: Checkstyle `PackageName`, `TypeName`, `GoogleMethodName`, `GoogleNonConstantFieldName`, `AbbreviationAsWordInName` (не Google); Error Prone `ConstantField` (уровень SUGGESTION); запрет префиксов - ручное ревью.
- Источник: [Java Style Guide · 5.1 Rules common to all identifiers](https://google.github.io/styleguide/javaguide.html#s5.1-identifier-names); [5.2.4 Constant names](https://google.github.io/styleguide/javaguide.html#s5.2.4-constant-names) (2026-09-09) · официальный гайд · высокая.
- Пример:

```java
// плохо - так пишут в AOSP, но не в Google Java Style
private int mRetryCount;
private static Cache sCache;

// хорошо
private int retryCount;
private static Cache cache;
static final int MAX_RETRIES = 3;
```

### G-JAVA-007 · MUST · Аннотация `@Override` ставится везде, где это допустимо, включая методы доступа record
- Проверка: Error Prone `MissingOverride` (включена по умолчанию); Checkstyle `MissingOverrideOnRecordAccessor` (не Google).
- Источник: [Java Style Guide · 6.1 @Override: always used](https://google.github.io/styleguide/javaguide.html#s6.1-override-annotation) (2026-09-09) · официальный гайд · высокая.

### G-JAVA-008 · MUST · Пойманное исключение не игнорируется; пустой блок `catch` допустим только с комментарием, который объясняет причину
- Проверка: Error Prone `EmptyCatch` (включена по умолчанию); Checkstyle `EmptyCatchBlock` (не Google).
- Источник: [Java Style Guide · 6.2 Caught exceptions: not ignored](https://google.github.io/styleguide/javaguide.html#s6.2-caught-exceptions) (2026-09-09) · официальный гайд · высокая.

### G-JAVA-009 · MUST · Каждый `switch` исчерпывающий (при необходимости - с меткой `default`); switch-выражения пишутся только в новом синтаксисе со стрелкой `->`
- Проверка: Error Prone `MissingCasesInEnumSwitch`, `FallThrough` (включены по умолчанию), `MissingDefault` (экспериментальная); Checkstyle `MissingSwitchDefault`, `FallThrough` (не Google).
- Источник: [Java Style Guide · 4.8.4.3 Exhaustiveness and presence of the default label](https://google.github.io/styleguide/javaguide.html#s4.8.4.3-switch-default); [4.8.4.4 Switch expressions](https://google.github.io/styleguide/javaguide.html#s4.8.4.4-switch-expressions) (2026-09-09) · официальный гайд · высокая.

### G-JAVA-010 · MUST · Javadoc есть у каждого видимого класса, члена и компонента record (`public`, а для членов - и `protected`); исключения - очевидные члены и переопределения
- Проверка: частично: Checkstyle `MissingJavadocType`, `MissingJavadocMethod`, `SummaryJavadoc` (не Google); содержание - ручное ревью.
- Источник: [Java Style Guide · 7.3 Where Javadoc is used](https://google.github.io/styleguide/javaguide.html#s7.3-javadoc-where-required); [7.1.1 General form](https://google.github.io/styleguide/javaguide.html#s7.1.1-javadoc-multi-line) (2026-09-09; с этой даты допустимы и Markdown-Javadoc `///`, и традиционный `/** */`) · официальный гайд · высокая.

Что ещё стоит знать: финализаторы не используются ([6.4](https://google.github.io/styleguide/javaguide.html#s6.4-finalizers)); `_` для безымянных переменных и параметров разрешён ([5.2.9](https://google.github.io/styleguide/javaguide.html#s5.2.9-unnamed-variables)); акронимы в именах пишутся как слова - `XmlHttpRequest` ([5.3](https://google.github.io/styleguide/javaguide.html#s5.3-camel-case)).

Противоречие внутри гайда (на 2026-10-09). [Раздел 4.8.6.2](https://google.github.io/styleguide/javaguide.html#s4.8.6.2-todo-comments) задаёт формат `// TODO: <ссылка на баг> - <пояснение>`, а пример в разделе об аннотациях после экспорта 2026-09-09 написан по-старому: `// TODO(b/123): …`. Профиль берёт формат из нормативного раздела 4.8.6.2.

Файлы настроек IDE в google/styleguide (`intellij-java-google-style.xml`, `eclipse-java-google-style.xml`) не менялись с 2018-01-30 и правок гайда 2022-2026 годов не отражают - пользоваться ими не стоит. `google_checks.xml` поддерживает проект Checkstyle, а не Google; все проверки в нём по умолчанию имеют уровень `warning`.

## 5. Kotlin

Гайд Google по Kotlin лежит вне google/styleguide: это [Kotlin style guide](https://developer.android.com/kotlin/style-guide) на developer.android.com (футер страницы - 2026-09-22), который описывает стандарт Google для Kotlin-кода под Android. Форматтер и линтер в нём не названы. Якоря у большинства разделов страницы не определены, поэтому ниже раздел указан словами, а ссылка ведёт на страницу целиком.

Главная ловушка - `ktfmt --google-style`. Этот стиль даёт отступ 2 пробела и в справке ktfmt назван «Google internal style», а публичный гайд требует 4 пробела. В AOSP (`frameworks/base/PREUPLOAD.cfg`) ktfmt запускают с `--kotlinlang-style`. Профиль следует публичному гайду:

```sh
# ktfmt 0.64 (2026-06-24, Maven com.facebook:ktfmt); не Google
java -jar ktfmt-0.64-with-dependencies.jar --kotlinlang-style src/
# проверка в CI
java -jar ktfmt-0.64-with-dependencies.jar --kotlinlang-style --dry-run --set-exit-if-changed src/
```

Альтернатива - ktlint 1.8.0 (не Google) со строкой `ktlint_code_style = android_studio` в `.editorconfig` для `[*.{kt,kts}]`. Не запускалось: jar-файлы в среде сборки недоступны.

### G-KT-001 · MUST · Отступ блока - 4 пробела, табуляция не используется
- Проверка: `ktfmt --kotlinlang-style` (не Google); ktlint `indent` (не Google).
- Источник: [Kotlin style guide · Formatting → Indentation](https://developer.android.com/kotlin/style-guide) (2026-09-22) · официальный гайд · высокая.

### G-KT-002 · MUST · Строка не длиннее 100 символов
- Проверка: ktfmt (ширина по умолчанию 100; не Google); ktlint `max-line-length` (не Google). Исключения гайда: строки `package` и `import`, неразрывные строки вроде URL.
- Источник: [Kotlin style guide · Formatting → Line wrapping](https://developer.android.com/kotlin/style-guide) (2026-09-22) · официальный гайд · высокая.

### G-KT-003 · MUST · Импорты идут одним списком в порядке ASCII; wildcard-импорты запрещены
- Проверка: ktfmt сортирует импорты и удаляет неиспользуемые (не Google); ktlint `no-wildcard-imports`, `import-ordering` (не Google).
- Источник: [Kotlin style guide · Source files → Structure → Import statements](https://developer.android.com/kotlin/style-guide#structure) (2026-09-22) · официальный гайд · высокая.

### G-KT-004 · MUST · Фигурные скобки обязательны у `if`, `for`, `do`, `while` и веток `when`, даже для одной инструкции; исключение - ветка `when` или `if` не более чем с одним `else`, которые целиком помещаются в строку
- Проверка: частично: ktlint (не Google); остальное - ручное ревью.
- Источник: [Kotlin style guide · Formatting → Braces](https://developer.android.com/kotlin/style-guide) (2026-09-22) · официальный гайд · высокая.

### G-KT-005 · MUST · Имена: пакеты - строчными буквами без `_`, типы - `PascalCase`, функции и свойства - `camelCase`, константы - `UPPER_SNAKE_CASE`
- Проверка: ktlint `package-name`, `class-naming`, `function-naming`, `property-naming` (не Google). Константой гайд считает `val` без собственного `get` с глубоко неизменяемым содержимым - `const val` либо свойство верхнего уровня или `object`.
- Источник: [Kotlin style guide · Naming](https://developer.android.com/kotlin/style-guide) (2026-09-22) · официальный гайд · высокая.

### G-KT-006 · MUST · Акронимы в именах пишутся как обычные слова: `XmlHttpRequest`, `supportsIpv6OnIos`
- Проверка: ручное ревью.
- Источник: [Kotlin style guide · Naming → Camel case](https://developer.android.com/kotlin/style-guide) (2026-09-22) · официальный гайд · высокая.
- Пример:

```kotlin
// плохо
class XMLHTTPRequest
class IOStream // так советуют Kotlin Coding Conventions, но не гайд Google

// хорошо
class XmlHttpRequest
class IoStream
```

### G-KT-007 · SHOULD · Backing property называется так же, как публичное свойство, но с префиксом `_`
- Проверка: ktlint `backing-property-naming` (не Google).
- Источник: [Kotlin style guide · Naming → Backing properties](https://developer.android.com/kotlin/style-guide#backing-properties) (2026-09-22) · официальный гайд · высокая.

### G-KT-008 · SHOULD · Файл с одним классом верхнего уровня называется по этому классу (`UserRepository.kt`); файл с несколькими объявлениями получает описательное имя в `PascalCase`
- Проверка: ktlint `filename` (не Google).
- Источник: [Kotlin style guide · Source files → Naming](https://developer.android.com/kotlin/style-guide) (2026-09-22) · официальный гайд · высокая.

### G-KT-009 · MUST · KDoc есть у каждого `public`-типа и у каждого его `public`- или `protected`-члена; исключения - очевидные функции и переопределения
- Проверка: ручное ревью (в гайде инструмент не назван).
- Источник: [Kotlin style guide · Documentation → Usage](https://developer.android.com/kotlin/style-guide) (2026-09-22) · официальный гайд · высокая.

### G-KT-010 · SHOULD · В именах тестовых функций допустимы подчёркивания (`pop_emptyStack`), а имена с пробелами в обратных кавычках не используются
- Проверка: ручное ревью.
- Источник: [Kotlin style guide · Naming → Function names](https://developer.android.com/kotlin/style-guide) (2026-09-22) · официальный гайд · средняя (формулировка проверена по странице, якорь раздела не определён).

Что ещё стоит знать: `@Composable`-функции, возвращающие `Unit`, называются существительным в `PascalCase` (тот же раздел Function names); про висячие запятые и опускание `: Unit` гайд не говорит - здесь можно следовать [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html) (не Google).

## 6. Go

[Go Style](https://google.github.io/styleguide/go/) состоит из трёх документов: Guide (нормативный и канонический), Decisions (нормативный) и Best Practices (ненормативный); последнее обновление - 2026-03-18. Гайд надстроен над [Effective Go](https://go.dev/doc/effective_go) и предполагает, что читатель с ним знаком. Из инструментов гайд называет только `gofmt`; `goimports`, `go vet`, staticcheck и golangci-lint в тексте не упоминаются, поэтому всё, кроме `gofmt`, ниже помечено «не Google».

```sh
test -z "$(gofmt -l .)"      # проверка формата в CI: gofmt -l печатает файлы, которые он изменил бы
go vet ./...
golangci-lint run            # golangci-lint v2.14.0, конфиг .golangci.yml с version: "2" (не Google)
```

Проверено локально: примеры «хорошо» из G-GO-008 и G-GO-010 проходят `gofmt -l` и `go vet` (Go 1.24.7). golangci-lint не запускался: в среде сборки его нет.

В golangci-lint стандартный набор - `errcheck`, `govet`, `ineffassign`, `staticcheck`, `unused`; проверки `ST1000`, `ST1003`, `ST1016`, `ST1020`-`ST1022` в нём по умолчанию выключены, их включают явно (`checks: ["all"]`). Линтеры длины строки (`lll`, `golines`) включать не нужно - см. G-GO-002.

### G-GO-001 · MUST · Весь Go-код отформатирован `gofmt`
- Проверка: `gofmt -l`.
- Источник: [Go Style Guide · Formatting](https://google.github.io/styleguide/go/guide#formatting) (2026-03-18) · официальный гайд · высокая.

### G-GO-002 · SHOULD · Фиксированного лимита длины строки нет; слишком длинную строку лучше упростить, чем механически разбивать
- Проверка: ручное ревью.
- Источник: [Go Style Guide · Line length](https://google.github.io/styleguide/go/guide#line-length) (2026-03-18) · официальный гайд · высокая.

### G-GO-003 · MUST · Составные имена пишутся в `MixedCaps` или `mixedCaps` без подчёркиваний, включая константы (`MaxLength`, не `MAX_LENGTH`); имена пакетов - только строчные буквы и цифры
- Проверка: staticcheck `ST1003` (не Google; в golangci-lint по умолчанию выключена); revive `var-naming` (не Google).
- Источник: [Go Style Guide · MixedCaps](https://google.github.io/styleguide/go/guide#mixed-caps); [Go Style Decisions · Package names](https://google.github.io/styleguide/go/decisions#package-names) (2026-03-18) · официальный гайд · высокая.

### G-GO-004 · MUST · Имя получателя - одна-две буквы, сокращение имени типа, одинаковое во всех методах типа; не `this` и не `self`
- Проверка: staticcheck `ST1006`, `ST1016` (не Google); revive `receiver-naming` (не Google).
- Источник: [Go Style Decisions · Receiver names](https://google.github.io/styleguide/go/decisions#receiver-names) (2026-03-18) · официальный гайд · высокая.

### G-GO-005 · SHOULD · Геттеры называются без префикса `Get` (`Counts`, не `GetCounts`); инициализмы пишутся в одном регистре (`URL` или `url`, но не `Url`)
- Проверка: частично: staticcheck `ST1003` (инициализмы; не Google); остальное - ручное ревью.
- Источник: [Go Style Decisions · Getters](https://google.github.io/styleguide/go/decisions#getters); [Initialisms](https://google.github.io/styleguide/go/decisions#initialisms) (2026-03-18) · официальный гайд · высокая.

### G-GO-006 · SHOULD · Импорты делятся на группы в таком порядке: стандартная библиотека, прочие пакеты, protobuf, импорты ради побочных эффектов
- Проверка: частично: `goimports` или `gci` отделяют стандартную библиотеку (не Google); группы protobuf и побочных эффектов - ручное ревью.
- Источник: [Go Style Decisions · Import grouping](https://google.github.io/styleguide/go/decisions#import-grouping) (2026-03-18) · официальный гайд · высокая.

### G-GO-007 · MUST · `import .` не используется; `import _` допустим только в пакете `main` и в тестах
- Проверка: staticcheck `ST1001` для dot-импорта (не Google); blank-импорты - ручное ревью.
- Источник: [Go Style Decisions · Import "dot"](https://google.github.io/styleguide/go/decisions#import-dot); [Import "blank"](https://google.github.io/styleguide/go/decisions#import-blank) (2026-03-18) · официальный гайд · высокая.

### G-GO-008 · SHOULD · Текст ошибки начинается со строчной буквы и не заканчивается точкой; ошибка обрабатывается сразу, основной путь идёт без `else`
- Проверка: staticcheck `ST1005` (не Google); revive `error-strings`, `indent-error-flow` (не Google).
- Источник: [Go Style Decisions · Error strings](https://google.github.io/styleguide/go/decisions#error-strings); [Indent error flow](https://google.github.io/styleguide/go/decisions#indent-error-flow) (2026-03-18) · официальный гайд · высокая.
- Пример:

```go
// плохо
if err == nil {
	process(data)
} else {
	return fmt.Errorf("Failed to load config.")
}

// хорошо
if err != nil {
	return fmt.Errorf("load config: %w", err)
}
process(data)
```

### G-GO-009 · MUST · `panic` не используется для обычной обработки ошибок - функция возвращает `error`
- Проверка: ручное ревью.
- Источник: [Go Style Decisions · Don't panic](https://google.github.io/styleguide/go/decisions#dont-panic) (2026-03-18) · официальный гайд · высокая.

### G-GO-010 · MUST · В тестах не заводят «assert-библиотеки»: проверка пишется обычным `if`, а сообщение называет функцию, аргументы, полученное и ожидаемое значение - в таком порядке
- Проверка: ручное ревью.
- Источник: [Go Style Decisions · Assertion libraries](https://google.github.io/styleguide/go/decisions#assert); [Got before want](https://google.github.io/styleguide/go/decisions#got-before-want) (2026-03-18) · официальный гайд · высокая. Порядок «got перед want» в гайде сформулирован как рекомендация.
- Пример:

```go
// плохо
assert.Equal(t, 5, Add(2, 3))

// хорошо
if got, want := Add(2, 3), 5; got != want {
	t.Errorf("Add(2, 3) = %d, want %d", got, want)
}
```

Что ещё стоит знать: вместо `interface{}` пишут `any` ([Use any](https://google.github.io/styleguide/go/decisions#use-any)); часть советов гайда привязана к внутренним библиотекам Google (например, `log.Exit` и замечание, что `log.Fatalf` - не из стандартной библиотеки), вне Google их нужно читать с этой поправкой.

## 7. C#

[C# at Google Style Guide](https://google.github.io/styleguide/csharp-style.html) добавлен в google/styleguide 2020-06-03 и с 2020-06-04 по существу не менялся (в 2024 году правили только ссылку); в тексте осталась оговорка о пересмотре после выхода C# 7. Гайд называет себя стилем по умолчанию для C#-кода Google. Именование взято из Microsoft C# naming guidelines и CoreFX coding guidelines, пробельные правила - из Google Java Style, переносы - из Google C++ Style.

Инструментов гайд не называет, официального `.editorconfig` или конфига `dotnet format` от Google нет - публичных данных не найдено. Все проверки ниже - «не Google»: это опции `.editorconfig`, которые читает `dotnet format` (`dotnet format --verify-no-changes` в CI). Единственный готовый машинный «Google C#» - пресет clang-format (`Language: CSharp`, `BasedOnStyle: Google`: `ColumnLimit: 100`, `NamespaceIndentation: All`), и он живёт в LLVM, а не у Google.

### G-CS-001 · MUST · Отступ - 2 пробела без табуляции, строка не длиннее 100 символов
- Проверка: `.editorconfig` - `indent_style = space`, `indent_size = 2` (не Google); длина строки - clang-format с пресетом Google для C# или ручное ревью.
- Источник: [C# at Google Style Guide · Whitespace rules](https://google.github.io/styleguide/csharp-style.html#whitespace-rules) (2020-06-04) · официальный гайд · высокая.

### G-CS-002 · MUST · Открывающая скобка остаётся на той же строке, `} else {` пишется без переноса, скобки ставятся даже там, где они необязательны
- Проверка: `.editorconfig` - `csharp_new_line_before_open_brace = none`, `csharp_new_line_before_else = false`, `csharp_prefer_braces = true` (не Google).
- Источник: [C# at Google Style Guide · Whitespace rules](https://google.github.io/styleguide/csharp-style.html#whitespace-rules) (2020-06-04) · официальный гайд · высокая.
- Пример:

```csharp
// плохо - стиль Allman, привычный для .NET
if (isReady)
{
  Start();
}
else
  Wait();

// хорошо
if (isReady) {
  Start();
} else {
  Wait();
}
```

### G-CS-003 · MUST · Имена: классы, методы, перечисления, пространства имён, публичные поля и свойства - `PascalCase`; локальные переменные и параметры - `camelCase`; `private`, `protected` и `internal` поля и свойства - `_camelCase`; модификаторы `const`, `static`, `readonly` на регистр не влияют
- Проверка: правила `dotnet_naming_rule.*` в `.editorconfig`, диагностика `IDE1006` (не Google).
- Источник: [C# at Google Style Guide · Naming rules](https://google.github.io/styleguide/csharp-style.html#naming-rules) (2020-06-04) · официальный гайд · высокая.

### G-CS-004 · MUST · Имя интерфейса начинается с `I`; акроним в имени пишется как слово (`MyRpc`, не `MyRPC`)
- Проверка: `dotnet_naming_rule.*`, диагностика `IDE1006` (не Google) - для префикса; акронимы - ручное ревью.
- Источник: [C# at Google Style Guide · Naming rules](https://google.github.io/styleguide/csharp-style.html#naming-rules) (2020-06-04) · официальный гайд · высокая.

### G-CS-005 · MUST · Файлы и каталоги называются в `PascalCase`; по возможности имя файла совпадает с именем главного класса
- Проверка: ручное ревью.
- Источник: [C# at Google Style Guide · Naming rules](https://google.github.io/styleguide/csharp-style.html#naming-rules) (2020-06-04) · официальный гайд · высокая. Вторая половина правила в гайде - рекомендация («where possible»).

### G-CS-006 · MUST · Директивы `using` стоят в начале файла, до объявления пространства имён, в алфавитном порядке; импорты `System` идут первыми
- Проверка: `.editorconfig` - `csharp_using_directive_placement = outside_namespace`, `dotnet_sort_system_directives_first = true` (не Google).
- Источник: [C# at Google Style Guide · Organization](https://google.github.io/styleguide/csharp-style.html#organization) (2020-06-04) · официальный гайд · высокая.

### G-CS-007 · MUST · Модификаторы идут в порядке `public protected internal private new abstract virtual override sealed static readonly extern unsafe volatile async`
- Проверка: `.editorconfig` - `csharp_preferred_modifier_order` с этим списком (не Google).
- Источник: [C# at Google Style Guide · Organization](https://google.github.io/styleguide/csharp-style.html#organization) (2020-06-04) · официальный гайд · высокая.

### G-CS-008 · MUST · Всё, что может быть `const`, объявляется как `const`; если нельзя - `readonly`; вместо «магических чисел» - именованные константы
- Проверка: ручное ревью; частично - анализаторы .NET (не Google).
- Источник: [C# at Google Style Guide · Constants](https://google.github.io/styleguide/csharp-style.html#constants) (2020-06-04) · официальный гайд · высокая.

### G-CS-009 · SHOULD · `var` используют, когда тип очевиден из правой части, и не используют для базовых типов
- Проверка: ручное ревью.
- Источник: [C# at Google Style Guide · The var keyword](https://google.github.io/styleguide/csharp-style.html#the-var-keyword) (2020-06-04) · официальный гайд · высокая.

Что ещё стоит знать: пространства имён - не глубже двух уровней, структура каталогов не обязана их повторять ([Namespace naming](https://google.github.io/styleguide/csharp-style.html#namespace-naming)). Гайд написан до записей (`record`), nullable reference types и file-scoped namespaces - про них в нём ничего нет; здесь остаётся следовать документации .NET (не Google).

## 8. Rust

Публичного гайда Google по Rust нет - публичных данных не найдено. Гайд существует внутри компании: стайлгайд Chromium сообщает, что проект собирается следовать «Google Rust Style Guide», когда его первая версия будет опубликована, а пока предложенный текст доступен только по внутренней ссылке. До публикации ближе всего к «стилю Google» практика двух проектов Google:

- [Chromium](https://chromium.googlesource.com/chromium/src/+/main/styleguide/rust/rust.md) следует общему Rust Style Guide (формат - rustfmt по корневому [`.rustfmt.toml`](https://chromium.googlesource.com/chromium/src/+/main/.rustfmt.toml)) и Rust API Guidelines;
- [Fuchsia](https://fuchsia.dev/fuchsia-src/development/languages/rust) прямо пишет, что стайлгайда для Rust у неё нет, и требует перед отправкой прогонять rustfmt; линтер - clippy ([lint_and_format](https://fuchsia.dev/fuchsia-src/development/languages/lint_and_format)).

Курс [Comprehensive Rust](https://google.github.io/comprehensive-rust/) команды Android - учебный материал, а не стайлгайд. Правила ниже - нормы сообщества Rust; уровень `SHOULD` у всех, потому что гайда Google за ними нет.

```sh
cargo fmt --all -- --check     # проверка формата в CI (rustfmt; не Google)
cargo clippy --all-targets -- -D warnings   # не Google
```

### G-RS-001 · SHOULD · Код форматируется `rustfmt`; формат проверяется в CI
- Проверка: `cargo fmt --all -- --check`.
- Источник: [Chromium Rust style](https://chromium.googlesource.com/chromium/src/+/main/styleguide/rust/rust.md) (состояние на 2026-10-09, дата правки файла не определена) · производный гайд проекта · высокая; [Fuchsia · Rust](https://fuchsia.dev/fuchsia-src/development/languages/rust) (2026-03-01) · производный гайд проекта · высокая.

### G-RS-002 · SHOULD · Отступ - 4 пробела без табуляции, строка не длиннее 100 символов
- Проверка: rustfmt - `tab_spaces`, `max_width` (значения по умолчанию).
- Источник: [Rust Style Guide](https://doc.rust-lang.org/style-guide/) (документация текущего стабильного Rust) · сторонний источник · высокая · не Google.

### G-RS-003 · SHOULD · Многострочные списки оформляются блочным отступом, а не выравниванием по открывающей скобке; последний элемент заканчивается запятой
- Проверка: rustfmt.
- Источник: [Rust Style Guide](https://doc.rust-lang.org/style-guide/) (документация текущего стабильного Rust) · сторонний источник · высокая · не Google.
- Пример:

```rust
// плохо - визуальное выравнивание по открывающей скобке
let report = build_report(first_argument_with_a_long_name,
                          second_argument_with_a_long_name);

// хорошо - блочный отступ и висячая запятая; так форматирует rustfmt
let report = build_report(
    first_argument_with_a_long_name,
    second_argument_with_a_long_name,
);
```

### G-RS-004 · SHOULD · Регистр имён: типы, трейты и варианты enum - `UpperCamelCase`; функции, методы, модули и локальные переменные - `snake_case`; константы и статики - `SCREAMING_SNAKE_CASE`; акроним считается одним словом (`Uuid`, не `UUID`)
- Проверка: предупреждения компилятора `non_camel_case_types`, `non_snake_case`, `non_upper_case_globals` (включены по умолчанию); акронимы - ручное ревью.
- Источник: [Rust API Guidelines · Naming (C-CASE)](https://rust-lang.github.io/api-guidelines/naming.html) (версии нет; состояние на 2026-10-09) · сторонний источник · высокая · не Google; на эти рекомендации ссылается [Chromium Rust style](https://chromium.googlesource.com/chromium/src/+/main/styleguide/rust/rust.md).

### G-RS-005 · SHOULD · Геттеры называются без префикса `get_` (`first()`, не `get_first()`)
- Проверка: ручное ревью.
- Источник: [Rust API Guidelines · Naming (C-GETTER)](https://rust-lang.github.io/api-guidelines/naming.html) (версии нет; состояние на 2026-10-09) · сторонний источник · высокая · не Google.

### G-RS-006 · SHOULD · Код проходит `clippy` без предупреждений
- Проверка: `cargo clippy --all-targets -- -D warnings`.
- Источник: [Fuchsia · Formatters and linters](https://fuchsia.dev/fuchsia-src/development/languages/lint_and_format) (2025-02-28) · производный гайд проекта · средняя (Fuchsia запускает clippy своей командой `fx clippy`; порог «без предупреждений» - выбор профиля).

### G-RS-007 · SHOULD · Комментарии пишутся построчно (`//`), документация - через `///` перед атрибутами; блочные `/* */` не используются
- Проверка: ручное ревью (rustfmt комментарии не переписывает).
- Источник: [Rust Style Guide](https://doc.rust-lang.org/style-guide/) (документация текущего стабильного Rust) · сторонний источник · высокая · не Google.

Настройки rustfmt у Chromium отличаются от умолчаний: `edition = "2024"`, `style_edition = "2021"`, `newline_style = "Unix"`, `wrap_comments = true`, `use_small_heuristics = "Max"`. Профиль оставляет умолчания rustfmt: отклонения Chromium - решение одного проекта, а не правило Google, а опция `wrap_comments` к тому же нестабильна и требует nightly-сборки rustfmt. Чтобы `rustfmt` и `cargo fmt` давали одинаковый результат, README rustfmt советует явно задать `style_edition` в `rustfmt.toml`.

Проверено локально: обе команды из блока выше выполнены на тестовом крейте (cargo 1.97.0, rustfmt 1.9.0, clippy 0.1.97); пример «хорошо» из G-RS-003 проходит `cargo fmt --check`, пример «плохо» - нет.

## 9. PHP

Публичного гайда Google по PHP нет - публичных данных не найдено. Есть практика одного репозитория: [google-cloud-php](https://github.com/googleapis/google-cloud-php/blob/main/CONTRIBUTING.md) следует PSR-2 и проверяет стиль инструментами PHP-CS-Fixer и PHP_CodeSniffer (`composer style-check`, `composer style-fix`). Это правило одной библиотеки, а не стандарт компании. PSR-2 с тех пор заменён: действующий стандарт PHP-FIG - [PER Coding Style 3.1](https://www.php-fig.org/per/coding-style/), который расширяет и заменяет PSR-12 и требует PSR-1. Профиль берёт его; в самом стандарте правила ниже сформулированы как MUST, в профиле они `SHOULD`, потому что это не правила Google.

```sh
# PHP-CS-Fixer 3.95 (не Google); check - краткая запись для fix --dry-run, код возврата 8 - есть файлы для исправления
vendor/bin/php-cs-fixer check --rules=@PER-CS --diff .
```

Не запускалось: Packagist из среды сборки недоступен; имена наборов и правил сверены с документацией PHP-CS-Fixer 3.95.

### G-PHP-001 · SHOULD · Стиль проверяется автоматически: PHP-CS-Fixer с набором `@PER-CS`, при необходимости вместе с PHP_CodeSniffer
- Проверка: `php-cs-fixer check --rules=@PER-CS --diff .`.
- Источник: [google-cloud-php · CONTRIBUTING.md, Coding Style](https://github.com/googleapis/google-cloud-php/blob/main/CONTRIBUTING.md) (ветка main, 2026-10) · практика, выведенная из репозиториев (1 репозиторий) · низкая · реконструкция. Сам репозиторий называет PSR-2; замена на PER-CS - решение профиля.

### G-PHP-002 · SHOULD · Отступ - 4 пробела, табуляция не используется
- Проверка: PHP-CS-Fixer `@PER-CS` (правило `indentation_type`).
- Источник: [PER Coding Style · 2.4 Indenting](https://www.php-fig.org/per/coding-style/#24-indenting) (версия 3.1) · сторонний источник · высокая · не Google.

### G-PHP-003 · SHOULD · Жёсткого лимита длины строки нет; мягкий лимит - 120 символов, а стремиться стоит к 80
- Проверка: ручное ревью; PHP_CodeSniffer `Generic.Files.LineLength` (не Google).
- Источник: [PER Coding Style · 2.3 Lines](https://www.php-fig.org/per/coding-style/#23-lines) (версия 3.1) · сторонний источник · высокая · не Google.

### G-PHP-004 · SHOULD · Открывающая скобка класса и метода стоит на отдельной строке, у управляющих конструкций - на той же строке
- Проверка: PHP-CS-Fixer `@PER-CS` (правило `braces_position`).
- Источник: [PER Coding Style · 4.1 Extends and Implements](https://www.php-fig.org/per/coding-style/#41-extends-and-implements); [4.4 Methods and Functions](https://www.php-fig.org/per/coding-style/#44-methods-and-functions); [5 Control Structures](https://www.php-fig.org/per/coding-style/#5-control-structures) (версия 3.1) · сторонний источник · высокая · не Google.

### G-PHP-005 · SHOULD · Видимость указывается у всех свойств, констант и методов; многострочный список заканчивается запятой
- Проверка: PHP-CS-Fixer `@PER-CS` (правила `modifier_keywords`, `trailing_comma_in_multiline`).
- Источник: [PER Coding Style · 4.3 Properties and Constants](https://www.php-fig.org/per/coding-style/#43-properties-and-constants); [2.6 Trailing commas](https://www.php-fig.org/per/coding-style/#26-trailing-commas) (версия 3.1) · сторонний источник · высокая · не Google.

## 10. Ruby

Прозаического гайда Google по Ruby нет, но есть официальный машинный стандарт - gem [`google-style`](https://github.com/googleapis/ruby-style) команды Google Cloud Ruby: набор правил RuboCop, который gemspec описывает как общий стиль Ruby-проектов Google. Версия 1.32.0 (2026-03-10) требует Ruby 3.2 и `rubocop ~> 1.76`; минорная версия gem совпадает с целевой версией Ruby (1.32 → Ruby 3.2). Уровень правил - `SHOULD`: конфиг опубликован для библиотек Google Cloud, обязательность для всего Ruby-кода Google публично не заявлена.

```yaml
# .rubocop.yml - google-style 1.32.0; в Gemfile: gem "google-style"
inherit_gem:
  google-style: google-style.yml
```

Не запускалось: RuboCop и gem `google-style` из среды сборки недоступны; содержимое `google-style.yml` сверено по клону репозитория (HEAD 2026-07-31), синтаксис примера из G-RB-004 проверен `ruby -c` (Ruby 3.3.6).

### G-RB-001 · SHOULD · Ruby-код проверяется RuboCop с конфигом `google-style`
- Проверка: `bundle exec rubocop`.
- Источник: [googleapis/ruby-style · README](https://github.com/googleapis/ruby-style/blob/main/README.md) (v1.32.0, 2026-03-10) · конфиг или инструмент · высокая.

### G-RB-002 · SHOULD · Строка не длиннее 120 символов
- Проверка: RuboCop `Layout/LineLength` (`Max: 120`).
- Источник: [google-style.yml](https://github.com/googleapis/ruby-style/blob/main/google-style.yml) (v1.32.0, 2026-03-10) · конфиг или инструмент · высокая.

### G-RB-003 · SHOULD · Строковые литералы пишутся в двойных кавычках
- Проверка: RuboCop `Style/StringLiterals` (`EnforcedStyle: double_quotes`).
- Источник: [google-style.yml](https://github.com/googleapis/ruby-style/blob/main/google-style.yml) (v1.32.0, 2026-03-10) · конфиг или инструмент · высокая.

### G-RB-004 · SHOULD · В объявлении метода параметры пишутся без скобок («Seattle style»): `def call request, options = {}`
- Проверка: RuboCop `Style/MethodDefParentheses` (`EnforcedStyle: require_no_parentheses`).
- Источник: [google-style.yml](https://github.com/googleapis/ruby-style/blob/main/google-style.yml) (v1.32.0, 2026-03-10) · конфиг или инструмент · высокая.
- Пример:

```ruby
# плохо - так требует общий Ruby Style Guide, но не конфиг Google
def publish(topic, payload)
end

# хорошо
def publish topic, payload
end
```

### G-RB-005 · SHOULD · Метод не длиннее 25 строк; ABC-метрика не выше 30, цикломатическая сложность не выше 10
- Проверка: RuboCop `Metrics/MethodLength` (`Max: 25`), `Metrics/AbcSize` (`Max: 30`), `Metrics/CyclomaticComplexity` (`Max: 10`).
- Источник: [google-style.yml](https://github.com/googleapis/ruby-style/blob/main/google-style.yml) (v1.32.0, 2026-03-10) · конфиг или инструмент · высокая.

### G-RB-006 · SHOULD · Во всём, чего конфиг не меняет, действуют умолчания RuboCop и общий Ruby Style Guide: отступ 2 пробела, `snake_case` для методов, переменных и файлов, имена предикатов с `?` на конце
- Проверка: RuboCop (умолчания).
- Источник: [Ruby Style Guide](https://rubystyle.guide/) (версии нет; состояние на 2026-10-09) · сторонний источник · высокая · не Google.

Конфиг Google расходится с Ruby Style Guide в трёх местах: 120 колонок вместо 80, двойные кавычки зафиксированы, `def` без скобок. Массивы слов и символов пишутся в квадратных скобках (`Style/WordArray`, `Style/SymbolArray`: `brackets`), а комментарий `# frozen_string_literal: true` не требуется (`Style/FrozenStringLiteralComment` выключен).

## 11. Scala и Elixir - исключены

Оба языка в профиль не входят (около 2-3 % в Stack Overflow, см. раздел 1), правил с ID для них нет.

- **Scala.** Гайд или конфиг Google: публичных данных не найдено. Общепринятая альтернатива (не Google) - [Scala Style Guide](https://docs.scala-lang.org/style/) и форматтер `scalafmt`: отступ 2 пробела без табуляции, жёсткого лимита строки нет, переносить принято примерно после 80 символов ([Indentation](https://docs.scala-lang.org/style/indentation.html)).
- **Elixir.** Гайд или конфиг Google: публичных данных не найдено. Общепринятая альтернатива (не Google) - встроенный форматтер [`mix format`](https://mix.hexdocs.pm/Mix.Tasks.Format.html) с конфигом `.formatter.exs` и проверкой `mix format --check-formatted` в CI; статический анализ стиля - Credo.

## 12. Варианты стиля

«Google style» не один. Производные гайды крупных проектов Google устроены по одной схеме - «следуем основному гайду, кроме перечисленного» - и расходятся с ним в самых заметных параметрах: отступе, длине строки, префиксах имён. С нормами сообщества гайды Google соотносятся по-разному: в Go и Swift они надстроены над общей нормой, в Java, Kotlin и TypeScript - это самостоятельный и более строгий стандарт. Варианты C++ (Chromium, Fuchsia) и Python (PEP 8) разобраны в [cpp.md](cpp.md) и [python.md](python.md); здесь по ним только строка в таблице.

| Вариант | Чей | Отступ / длина строки | Главные отличия от публичного гайда Google | Что делает профиль |
|---|---|---|---|---|
| Google Java Style | Google | 2 (перенос +4) / 100 | - | основа раздела Java |
| AOSP Java code style | Android (платформа) | 4 (перенос +8) / 100 | поля с префиксами `m` и `s`; импорты группами android → сторонние → java/javax; однострочный `if` без скобок допустим | не берёт; `google-java-format --aosp` - только для кода платформы Android |
| Chromium Java | Chromium | 4 (перенос +8) / 100 | основа - AOSP, а не Google Java Style; 10 групп импортов | не берёт |
| [Oracle Code Conventions](https://www.oracle.com/java/technologies/javase/codeconventions-indentation.html) (1999, архивная страница) | Sun / Oracle | 4 / 80 | нет современных конструкций языка | не берёт |
| Android Kotlin style guide | Android / Google | 4 / 100 | - | основа раздела Kotlin |
| ktfmt `--google-style` | Kotlin/JetBrains, раньше Meta | 2 / 100 | «Google internal style»; публично не описан | не берёт (G-KT-001) |
| Kotlin Coding Conventions | JetBrains | 4 / не задана | двухбуквенные акронимы заглавными (`IOStream`); wildcard-импорты не регулируются; имена тестов в обратных кавычках разрешены; советует избегать `@param` и `@return` | только там, где гайд Google молчит |
| Go Style | Google | gofmt / лимита нет | - | основа раздела Go |
| Effective Go и Go Code Review Comments | команда и сообщество Go | gofmt / лимита нет | Effective Go написан к релизу 2009 года и активно не обновляется (нет дженериков и модулей); `import .` допускается ограниченно; запрета assert-библиотек нет | фон; при расхождении действует гайд Google |
| Chromium Web (TS/JS) | Chromium | как в гайдах Google | «следует и развивает» гайды Google по HTML/CSS, TS и JS плюс WebUI Lit Style Guide | не берёт |
| Репозиторий Angular | команда Angular (Google) | 2 / 100 | Google TS Style, но перенос на 100 символах | см. [angular.md](../frameworks/angular.md) |
| Chromium Rust, Fuchsia Rust | Chromium, Fuchsia | 4 / 100 (умолчания rustfmt) | гайда Google нет; Chromium меняет несколько опций rustfmt | основа раздела Rust - умолчания rustfmt |
| Google Swift Style Guide (2018) | Google | 2 / 100 | включает Swift API Design Guidelines целиком и добавляет к ним форматирование | вне профиля |
| Flutter style guide | Flutter | 2 / 100 | Effective Dart советует 80 колонок и запрещает буквенные префиксы; Flutter ставит 100 и префикс `k` у глобальных констант | вне профиля |
| Chromium C++ | Chromium | 2 / 80 | C++23 против C++20; запрещены `std::function`, `std::shared_ptr`, `<chrono>`, большая часть Abseil | см. [cpp.md](cpp.md) |
| Fuchsia C++ | Fuchsia | 2 / 100 | 100 колонок вместо 80; вложенные пространства имён запрещены | см. [cpp.md](cpp.md) |

**AOSP Java.** [Гайд AOSP](https://source.android.com/docs/setup/contribute/code-style) (обновлён 2025-03-13) называет свои правила строгими для контрибьюторов платформы и необязательными для разработчиков приложений. С Google Java Style он расходится в трёх вещах сразу - отступ, префиксы полей, группы импортов. Интерпретация: совместить два стиля в одном проекте не получится, и выбор определяется тем, пишется ли код для платформы Android.

**Chromium.** У Chromium свой набор гайдов по языкам: Java строится на AOSP, Python - на PEP 8 с Ruff (79 колонок), Swift - на гайде Google без исключений, Web - на гайдах Google с дополнениями ([индекс стилей](https://chromium.googlesource.com/chromium/src/+/main/styleguide/styleguide.md)). Интерпретация: даже внутри Google «основной» гайд служит точкой отсчёта, а не единственным стандартом.

**Android Kotlin и ktfmt.** Публичный гайд - 4 пробела, «внутренний стиль Google» в ktfmt - 2 пробела, и публичного текста, который описывал бы второй вариант, нет. AOSP запускает ktfmt с `--kotlinlang-style`. Профиль берёт то, что можно прочитать и проверить, - публичный гайд.

**Kotlin Coding Conventions.** [Конвенции JetBrains](https://kotlinlang.org/docs/coding-conventions.html) (редакция 2026-08-12) совпадают с гайдом Google в отступе и общем каркасе. Гайд Google добавляет то, чего в конвенциях нет: лимит 100 колонок, запрет wildcard-импортов, единое правило для акронимов, обязательный KDoc для публичного API. Конвенции, в свою очередь, говорят о висячих запятых и об опускании `: Unit`, о которых гайд Google молчит.

**Effective Go и Go Code Review Comments.** Гайд Google не заменяет нормы сообщества, а расширяет их: он предполагает знакомство с [Effective Go](https://go.dev/doc/effective_go), а [Code Review Comments](https://go.dev/wiki/CodeReviewComments) сам ссылается на гайд Google как на более подробный. По базовым пунктам (gofmt, MixedCaps, геттеры без `Get`, короткие получатели, строки ошибок) противоречий нет; Google добавляет запреты (`import .`, assert-библиотеки) и отдельную группу импортов для protobuf.

**Swift API Design Guidelines.** [Гайд Google по Swift](https://google.github.io/swift/) включает [API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/) целиком - они считаются его частью. В самих Guidelines правил форматирования нет: 100 колонок, скобки K&R, запрет точек с запятой и висячие запятые - добавка Google.

**Fuchsia и Flutter.** [Fuchsia](https://fuchsia.dev/fuchsia-src/development/languages/lint_and_format) перечисляет форматтеры по языкам (clang-format, rustfmt, `gofmt -s`, `gn format`) и запускает их одной командой `fx format-code`. Во [Flutter](https://github.com/flutter/flutter/blob/master/docs/contributing/Style-guide-for-Flutter-repo.md) при расхождении с Effective Dart действует гайд Flutter - пример того, как производный гайд явно ставит себя выше основного.

Интерпретация: расхождения с нормами сообщества объяснимы тем, что правила Google рассчитаны на автоматические правки большой кодовой базы. Сам TS-гайд обосновывает запрет `export default` тем, что у такого экспорта нет канонического имени и это затрудняет централизованное сопровождение ([Exports](https://google.github.io/styleguide/tsguide.html#exports)); запрет wildcard-импортов в Java и Kotlin работает на ту же цель.
