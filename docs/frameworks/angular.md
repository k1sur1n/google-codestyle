# Angular: профиль Google

> Данные актуальны на 2026-10-09.

Angular - единственный из четырёх фреймворков профиля, для которого у Google есть собственный стайлгайд: [angular.dev/style-guide](https://angular.dev/style-guide). Действует редакция 2025 года: 22 коротких правила вместо нумерованных «Style 01-01 … A-02», без суффиксов `.component.ts` и `Component`, с `inject()`, `protected` и `readonly`. Гайд сам называет свои правила необязательными, а за стилем TypeScript отсылает к Google TypeScript Style Guide, поэтому MUST ниже стоит только там, где источник категоричен. Из 32 правил области NG линтер angular-eslint (проект сообщества, не Google) проверяет полностью 12 и частично 5, остальные 15 остаются на ручное ревью. Раздел «CSS и HTML» добавляет 19 правил из Google HTML/CSS Style Guide; три конфига для веба разобраны в конце документа.

## Источник и его статус

Гайд лежит в репозитории фреймворка: [`adev/src/content/best-practices/style-guide.md`](https://github.com/angular/angular/blob/main/adev/src/content/best-practices/style-guide.md). Сайт на 2026-10-09 собран для Angular v22.2.2. Текст документации распространяется под CC BY 4.0, код - под MIT ([подвал сайта](https://github.com/angular/angular/blob/main/adev/src/app/core/layout/footer/footer.component.html), [LICENSE](https://github.com/angular/angular/blob/main/LICENSE)).

Google относит этот гайд к своим: [README google/styleguide](https://github.com/google/styleguide/blob/gh-pages/README.md) перечисляет Angular Style Guide среди гайдов, живущих вне проекта, а 2026-09-25 старый гайд по AngularJS 1.x был удалён из google/styleguide с пояснением, что гайд Angular поддерживает сам проект и Google пользуется им внутри ([коммит 570df3b](https://github.com/google/styleguide/commit/570df3b)).

Три слоя, из которых складывается «Google-стиль» Angular-приложения:

| Слой | Что регулирует | Источник | Сила |
|---|---|---|---|
| Стайлгайд Angular | имена файлов, структура проекта, DI, компоненты и директивы | [angular.dev/style-guide](https://angular.dev/style-guide) | рекомендации: гайд пишет, что они не обязательны для работы Angular |
| Google TypeScript Style Guide | сам язык: экспорты, именование, типы, видимость | [tsguide](https://google.github.io/styleguide/tsguide.html); правила G-TS-001 … G-TS-010 в [../languages/other.md](../languages/other.md) | must / should по тексту гайда |
| Форматтер | отступы, кавычки, переносы | Prettier с настройками из gts и шаблона Angular CLI, см. [«Конфигурационные файлы»](#конфигурационные-файлы) | задаётся инструментом |

Как в этом документе выбран уровень правила. Гайд Angular не пользуется словами must/should, а во введении прямо говорит, что его рекомендации не обязательны. Поэтому почти все правила ниже - SHOULD. MUST поставлен в двух случаях: формулировка источника категорична («should always», «Never», «Always») или того же требует Google TypeScript Style Guide словом «must». Таких правил пять - G-NG-009, 015, 018, 022 и 028; причина указана в каждом.

Coding standards репозитория angular/angular ([contributing-docs/coding-standards.md](https://github.com/angular/angular/blob/main/contributing-docs/coding-standards.md)) в профиль не включены: документ начинается с оговорки, что он относится только к разработке самого фреймворка, а не приложений на нём. Он использован только как пример того, как команда Angular применяет Google-стиль к своему коду.

## Что изменилось в редакции 2025 года

Старый гайд (эпоха Angular 2-19) состоял из нумерованных правил «Style 01-01 … A-02» с тремя уровнями Do / Consider / Avoid и был построен вокруг NgModule. Один коммит заменил его целиком: [e96a0c1fc «docs: replace style guide with 2025 revision»](https://github.com/angular/angular/commit/e96a0c1fc7bc594fa714ef8f43c65f7dea6a421d) (автор - Jeremy Elbourn, дата коммита 2025-04-22, +227 / −805 строк; сообщение ссылается на RFC в обсуждении angular/angular #58412). После замены файл правился 12 раз; содержательные правки - про объектную форму `[class]` (2025-06-18), отличие `[class]` от `ngClass` (2025-07-14), `readonly` для сигнальных свойств (2025-09-02), пример `[style]` (2025-11-19); последний коммит - 2026-07-07, косметика ([история файла](https://github.com/angular/angular/commits/main/adev/src/content/best-practices/style-guide.md)). Старая редакция доступна на [v19.angular.dev/style-guide](https://v19.angular.dev/style-guide) - она устарела и приведена только для сравнения.

| Тема | Старый гайд (до v19) | Редакция 2025 | Что это значит на практике |
|---|---|---|---|
| Имена файлов и классов | `feature.type.ts`: `user-profile.component.ts`, класс `UserProfileComponent`; суффиксы `Service`, `Directive`, `Pipe`, `Module` | `user-profile.ts`, класс `UserProfile`; суффиксы не упоминаются | советы «всегда `*.component.ts`» устарели; см. G-NG-004 |
| Размер файла | одна сущность на файл, желательно не больше 400 строк | «один концепт на файл», числовых лимитов нет | лимит 400 строк больше не правило; G-NG-012 |
| NgModule | модуль на фичу, `SharedModule`, корневой `app.module.ts` | раздел удалён целиком | советы про `SharedModule` устарели; G-NG-029 |
| Шаблон и стили | выносить в файлы, если больше 3 строк | не регулируется | порог «3 строки» больше не правило |
| Внедрение зависимостей и сервисы | правила о сервисах: `@Injectable`, `providedIn: 'root'`, отдельные data-сервисы | `inject()` вместо параметров конструктора; раздел о сервисах удалён | G-NG-013 |
| Обработчики событий | префикс `on` + имя события (`onClick`) | имя по действию (`saveUserData`), не по событию | прямой разворот; G-NG-025 |
| Host-привязки | `@HostBinding` / `@HostListener` предпочтительнее `host` | в стайлгайде нет; гайд по host-элементам требует обратного | разворот; G-NG-028 |
| `@Input()` / `@Output()` | декораторы вместо свойств метаданных, без алиасов | из стайлгайда убрано; документация советует сигнальные `input()` / `output()` | G-NG-032 |
| Логика в шаблоне | вся презентационная логика - в классе | простые выражения допустимы, сложное - в `computed` | G-NG-021 |
| Новое в 2025 | - | `protected` для членов, нужных шаблону; `readonly`; `[class]` / `[style]`; группировка Angular-свойств; простые lifecycle-методы; приоритет единообразия файла; отсылка к Google TypeScript Style Guide | G-NG-001, 002, 019, 022-024, 026 |

Источники таблицы: [текст до замены](https://github.com/angular/angular/blob/b43fe29ca7eeac9793f9c488e7545960a9057bb8/adev/src/content/best-practices/style-guide.md), [v19.angular.dev/style-guide](https://v19.angular.dev/style-guide), [текущая редакция](https://angular.dev/style-guide).

Инструменты перешли на новую схему раньше, чем многие проекты. Angular CLI с 20.0.0 (2025-05-28) генерирует компоненты и директивы без `.component` / `.directive` в имени; та же версия содержит миграцию, которая при обновлении сохраняет существующему проекту старую схему ([CHANGELOG angular-cli, 20.0.0](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)). С 21.0.0 у `ng new` есть опция `fileNameStyleGuide` со значениями `"2016"` и `"2025"`, по умолчанию `"2025"` ([ng-new/schema.json](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/ng-new/schema.json)). angular-eslint пометил правило `component-class-suffix` как не рекомендуемое командой Angular начиная с v20 ([описание правила](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin/docs/rules/component-class-suffix.md)).

## Общие положения

### G-NG-001 · SHOULD · Если правило гайда расходится со сложившимся стилем файла, сохраняйте единообразие внутри файла
- Проверка: ручное ревью.
- Источник: [When in doubt, prefer consistency](https://angular.dev/style-guide#when-in-doubt-prefer-consistency) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая.

### G-NG-002 · SHOULD · Код на TypeScript оформляется по Google TypeScript Style Guide, формат задаёт Prettier
- Проверка: частично: `prettier --check` и правила `typescript-eslint` из [`eslint.config.js`](../../configs/web/eslint.config.js); остальное - ручное ревью. Сами правила языка - область TS в [../languages/other.md](../languages/other.md) (G-TS-001 … G-TS-010).
- Источник: [Introduction](https://angular.dev/style-guide#introduction) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая. Гайд Angular лишь советует «посмотреть» TS-гайд Google; обязательность правил языка определяет сам TS-гайд.

## Именование файлов

### G-NG-003 · SHOULD · Слова в имени файла разделяются дефисом: компонент `UserProfile` лежит в `user-profile.ts`
- Проверка: ручное ревью; генераторы Angular CLI создают такие имена сами.
- Источник: [Separate words in file names with hyphens](https://angular.dev/style-guide#separate-words-in-file-names-with-hyphens) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая.

### G-NG-004 · SHOULD · В новом коде имя файла и класса не содержит суффикса типа: `user-profile.ts` и `UserProfile`, а не `user-profile.component.ts` и `UserProfileComponent`
- Проверка: ручное ревью; `ng new` с `fileNameStyleGuide: "2025"` (значение по умолчанию); правила `@angular-eslint/component-class-suffix` и `@angular-eslint/directive-class-suffix` держать выключенными.
- Источник: [Match file names to the TypeScript identifier within](https://angular.dev/style-guide#match-file-names-to-the-typescript-identifier-within) (редакция 2025; Angular v22.2.2) · официальный гайд · средняя · реконструкция; [ng-new/schema.json](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/ng-new/schema.json) (Angular CLI 22.x) · конфиг или инструмент · высокая. Гайд нигде прямо не запрещает суффикс: отказ выражен примерами, удалением старых правил 02-01…02-04 и дефолтами CLI. В существующем проекте со старой схемой действует G-NG-001: единообразие важнее переименования.
- Пример:

```text
# плохо (схема 2016 года в новом проекте)
user-profile.component.ts      export class UserProfileComponent {}
user-profile.component.html
auth.service.ts                export class AuthService {}

# хорошо (редакция 2025)
user-profile.ts                export class UserProfile {}
user-profile.html
user-profile.css
user-profile.spec.ts
```

### G-NG-005 · SHOULD · Юнит-тесты лежат в файле с тем же именем и окончанием `.spec.ts`
- Проверка: ручное ревью; `ng generate` создаёт `*.spec.ts` рядом с кодом (`skipTests: false` по умолчанию).
- Источник: [Use the same name for a file's tests with `.spec` at the end](https://angular.dev/style-guide#use-the-same-name-for-a-files-tests-with-spec-at-the-end) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая.

### G-NG-006 · SHOULD · Имя файла отражает главный идентификатор внутри; файлов с именами `helpers.ts`, `utils.ts`, `common.ts` не заводят
- Проверка: ручное ревью.
- Источник: [Match file names to the TypeScript identifier within](https://angular.dev/style-guide#match-file-names-to-the-typescript-identifier-within) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая. Если в файле несколько равноправных идентификаторов, имя даётся по их общей теме.

### G-NG-007 · SHOULD · TypeScript, шаблон и стили одного компонента имеют общее базовое имя
- Проверка: ручное ревью; генератор CLI создаёт `name.ts`, `name.html`, `name.css`.
- Источник: [Use the same file name for a component's TypeScript, template, and styles](https://angular.dev/style-guide#use-the-same-file-name-for-a-components-typescript-template-and-styles) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая. Дополнительный файл стилей получает уточняющее слово: `user-profile-settings.css`.

## Структура проекта

### G-NG-008 · SHOULD · Весь код интерфейса (TypeScript, HTML, стили) лежит в каталоге `src`; конфиги и скрипты - вне его
- Проверка: ручное ревью.
- Источник: [All the application's code goes in a directory named `src`](https://angular.dev/style-guide#all-the-applications-code-goes-in-a-directory-named-src) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая.

### G-NG-009 · MUST · Приложение запускается из файла `src/main.ts`
- Проверка: ручное ревью; файл создаёт `ng new`.
- Источник: [Bootstrap your application in a file named `main.ts` directly inside `src`](https://angular.dev/style-guide#bootstrap-your-application-in-a-file-named-maints-directly-inside-src) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая. MUST - потому что формулировка источника категорична: «should always».

### G-NG-010 · SHOULD · Файлы компонента и его тесты лежат в одном каталоге; общего каталога `tests` для несвязанных тестов нет
- Проверка: ручное ревью.
- Источник: [Group closely related files together in the same directory](https://angular.dev/style-guide#group-closely-related-files-together-in-the-same-directory) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая.

### G-NG-011 · SHOULD · Каталоги строятся по функциональным областям, а не по типам кода: без `components/`, `directives/`, `services/`
- Проверка: ручное ревью.
- Источник: [Organize your project by feature areas](https://angular.dev/style-guide#organize-your-project-by-feature-areas) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая.
- Пример:

```text
# плохо: каталоги по типам кода
src/components/…
src/services/…
src/directives/…

# хорошо: каталоги по функциональным областям
src/catalog/…
src/checkout/payment-info/…
```

### G-NG-012 · SHOULD · Один концепт на файл; при сомнениях выбирайте меньшие файлы
- Проверка: ручное ревью.
- Источник: [One concept per file](https://angular.dev/style-guide#one-concept-per-file) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая. Несколько небольших тесно связанных компонентов или директив в одном файле допустимы. Числового лимита (прежние 400 строк) в редакции 2025 нет.

## Внедрение зависимостей

### G-NG-013 · SHOULD · Зависимости получают функцией `inject()`, а не параметрами конструктора
- Проверка: `@angular-eslint/prefer-inject` (error в пресете `tsRecommended`); существующий код переводит миграция `ng generate @angular/core:inject`.
- Источник: [Prefer the `inject` function over constructor parameter injection](https://angular.dev/style-guide#prefer-the-inject-function-over-constructor-parameter-injection) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая; [миграция inject-function](https://angular.dev/reference/migrations/inject-function) · официальный гайд · высокая. Доводы гайда: читаемость при большом числе зависимостей, место для комментария к каждой, вывод типов, совместимость с полями классов ES2022 (`useDefineForClassFields`).
- Пример:

```ts
// плохо
export class UserProfile {
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}
}

// хорошо
export class UserProfile {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
}
```

## Компоненты и директивы

### G-NG-014 · SHOULD · Селектор компонента - пользовательский элемент в kebab-case с коротким префиксом проекта: `app-user-profile`
- Проверка: `@angular-eslint/component-selector` с опциями `{type: 'element', prefix: '<префикс>', style: 'kebab-case'}`.
- Источник: [Choosing component selectors](https://angular.dev/style-guide#choosing-component-selectors) → [Components: choosing a selector](https://angular.dev/guide/components/selectors#choosing-a-selector) (Angular v22.2.2) · официальный гайд · высокая. Префикс один на весь проект; Angular CLI по умолчанию подставляет `app`.

### G-NG-015 · MUST · Префикс `ng` в собственных селекторах не используется
- Проверка: `@angular-eslint/component-selector` и `@angular-eslint/directive-selector` с заданным `prefix`: селектор с любым другим префиксом, включая `ng`, даёт ошибку.
- Источник: [Selector prefixes](https://angular.dev/guide/components/selectors#selector-prefixes) (Angular v22.2.2) · официальный гайд · высокая. MUST - формулировка источника «Never use».

### G-NG-016 · SHOULD · Селектор директивы - атрибут в camelCase с тем же префиксом, что у компонентов: `[appTooltip]`
- Проверка: `@angular-eslint/directive-selector` с опциями `{type: 'attribute', prefix: '<префикс>', style: 'camelCase'}`.
- Источник: [Choosing directive selectors](https://angular.dev/style-guide#choosing-directive-selectors) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая.

### G-NG-017 · SHOULD · Имя input не совпадает со свойствами DOM-элементов и не получает префикса
- Проверка: частично: `@angular-eslint/no-input-prefix` со списком запрещённых префиксов (опционально; в конфиг профиля не включено, потому что у директив input принято называть так же, как селектор - `appTooltip`); совпадения с DOM - ручное ревью. Смежное правило `@angular-eslint/no-input-rename` (запрет алиасов) включено пресетом `tsRecommended`.
- Источник: [Naming component and directive members](https://angular.dev/style-guide#naming-component-and-directive-members) → [Choosing input names](https://angular.dev/guide/components/inputs#choosing-input-names) (Angular v22.2.2) · официальный гайд · высокая.

### G-NG-018 · MUST · Имя output пишется в camelCase, без префикса `on` и не совпадает с событиями DOM
- Проверка: `@angular-eslint/no-output-on-prefix`, `@angular-eslint/no-output-native`, `@angular-eslint/no-output-rename` (все - error в `tsRecommended`); camelCase - ручное ревью.
- Источник: [Naming component and directive members](https://angular.dev/style-guide#naming-component-and-directive-members) → [Choosing event names](https://angular.dev/guide/components/outputs#choosing-event-names) (Angular v22.2.2) · официальный гайд · высокая. MUST относится к camelCase («Always use»); запрет `on` и совпадений с DOM в источнике сформулирован как «Avoid», но пресет линтера считает его ошибкой.
- Пример:

```ts
// плохо
readonly onSaved = output<void>(); // префикс on: в шаблоне получится (onSaved)
readonly click = output<void>(); // совпадает с событием DOM

// хорошо
readonly saved = output<void>();
readonly panelClosed = output<void>();
```

### G-NG-019 · SHOULD · Angular-специфичные свойства (инъекции, inputs, outputs, queries) стоят в начале класса, все свойства - перед методами
- Проверка: частично: `@angular-eslint/inject-at-top` (только вызовы `inject()`); остальное - ручное ревью.
- Источник: [Group Angular-specific properties before methods](https://angular.dev/style-guide#group-angular-specific-properties-before-methods) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая.

### G-NG-020 · SHOULD · Компонент и директива отвечают за представление; валидация, преобразование данных и другая логика, не связанная с интерфейсом, вынесена в отдельные функции и классы
- Проверка: ручное ревью.
- Источник: [Keep components and directives focused on presentation](https://angular.dev/style-guide#keep-components-and-directives-focused-on-presentation) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая.

### G-NG-021 · SHOULD · Сложная логика не пишется в шаблоне: её выносят в TypeScript, обычно в `computed`
- Проверка: частично: `@angular-eslint/template/conditional-complexity` (в конфиге профиля - warn с порогом 5, это значение правила по умолчанию); остальное - ручное ревью.
- Источник: [Avoid overly complex logic in templates](https://angular.dev/style-guide#avoid-overly-complex-logic-in-templates) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая. Гайд числового порога не задаёт и оставляет решение автору, поэтому линтер здесь только предупреждает.
- Пример:

```html
<!-- плохо -->
@if (items().length > 0 && !settings().readOnly && roles().includes('admin')) {
  <button (click)="removeAll()">Удалить всё</button>
}

<!-- хорошо -->
@if (canRemoveAll()) {
  <button (click)="removeAll()">Удалить всё</button>
}
```

```ts
protected readonly canRemoveAll = computed(
  () => this.items().length > 0 && !this.settings().readOnly && this.roles().includes('admin'),
);
```

### G-NG-022 · MUST · Член класса, который читает шаблон, не объявляется `private`; если он нужен только шаблону, его делают `protected`
- Проверка: ручное ревью. В каталоге правил angular-eslint 22.5.0 такой проверки нет (уверенность в отсутствии - средняя).
- Источник: [Use `protected` on class members that are only used by a component's template](https://angular.dev/style-guide#use-protected-on-class-members-that-are-only-used-by-a-components-template) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая; [Properties used outside of class lexical scope](https://google.github.io/styleguide/tsguide.html#properties-used-outside-of-class-lexical-scope) (экспорт 2023-10-11) · официальный гайд · высокая. MUST взят из TS-гайда Google («must not use `private`»); выбор `protected` вместо `public` в обоих источниках - рекомендация. Публичные члены компонента образуют его API, доступный через внедрение зависимостей и queries; то, что нужно только шаблону, в этот API попадать не должно.
- Пример:

```ts
// плохо: fullName виден всем, кто получил ссылку на компонент
export class UserProfile {
  readonly firstName = input.required<string>();
  readonly lastName = input.required<string>();
  fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
}

// хорошо
export class UserProfile {
  readonly firstName = input.required<string>();
  readonly lastName = input.required<string>();
  protected readonly fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
}
```

### G-NG-023 · SHOULD · Свойства, которые инициализирует Angular, помечаются `readonly`: `input()`, `model()`, `output()` и queries; при декораторах - `@Output` и queries, но не `@Input`
- Проверка: частично: `@angular-eslint/prefer-output-readonly`; `@angular-eslint/prefer-signals` (опция `preferReadonlySignalProperties`, по умолчанию `true`); остальное - ручное ревью.
- Источник: [Use `readonly` for properties that shouldn't change](https://angular.dev/style-guide#use-readonly-for-properties-that-shouldnt-change) (редакция 2025, уточнение 2025-09-02; Angular v22.2.2) · официальный гайд · высокая. Согласуется с [TS-гайдом Google](https://google.github.io/styleguide/tsguide.html#use-readonly).

### G-NG-024 · SHOULD · Классы и стили привязывают через `[class]` и `[style]`, а не директивами `NgClass` и `NgStyle`
- Проверка: `@angular-eslint/template/prefer-class-binding`, `@angular-eslint/template/prefer-style-binding`.
- Источник: [Prefer `class` and `style` over `ngClass` and `ngStyle`](https://angular.dev/style-guide#prefer-class-and-style-over-ngclass-and-ngstyle) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая. Доводы гайда: синтаксис ближе к обычному HTML, а директивы дают дополнительные накладные расходы. Объектная форма `[class]="{…}"` допустима.
- Пример:

```html
<!-- плохо -->
<div [ngClass]="{active: isActive()}" [ngStyle]="{'width.px': width()}"></div>

<!-- хорошо -->
<div [class.active]="isActive()" [style.width.px]="width()"></div>
```

### G-NG-025 · SHOULD · Обработчик события называется по действию, а не по событию: `saveUserData()`, а не `handleClick()`
- Проверка: ручное ревью.
- Источник: [Name event handlers for what they do, not for the triggering event](https://angular.dev/style-guide#name-event-handlers-for-what-they-do-not-for-the-triggering-event) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая. Старый гайд требовал обратного - префикс `on` и имя события. Для клавиатуры используйте модификаторы события в шаблоне; если логика сложная, допустим общий `handleKeydown`, который делегирует именованным методам.
- Пример:

```html
<!-- плохо -->
<button (click)="handleClick()">Сохранить</button>
<button (click)="onClick()">Сохранить</button>

<!-- хорошо -->
<button (click)="saveUserData()">Сохранить</button>
<textarea (keydown.control.enter)="commitNotes()"></textarea>
```

### G-NG-026 · SHOULD · Методы жизненного цикла короткие: длинная логика вынесена в именованные методы, а хук их вызывает
- Проверка: ручное ревью. Смежные правила: `@angular-eslint/no-empty-lifecycle-method` (в `tsRecommended`), `@angular-eslint/no-async-lifecycle-method` (опционально).
- Источник: [Keep lifecycle methods simple](https://angular.dev/style-guide#keep-lifecycle-methods-simple) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая.
- Пример:

```ts
// плохо
ngOnInit(): void {
  this.logger.setMode('info');
  this.logger.monitorErrors();
  // …ещё двадцать строк настройки
}

// хорошо
ngOnInit(): void {
  this.startLogging();
  this.runBackgroundTask();
}
```

### G-NG-027 · SHOULD · Класс с методом жизненного цикла реализует соответствующий интерфейс: `implements OnInit`
- Проверка: `@angular-eslint/use-lifecycle-interface` (в `tsRecommended` - warn; в конфиге профиля поднято до error).
- Источник: [Use lifecycle hook interfaces](https://angular.dev/style-guide#use-lifecycle-hook-interfaces) (редакция 2025; Angular v22.2.2) · официальный гайд · высокая.

## Вне стайлгайда: документация Angular и умолчания инструментов

Эти пять правил не входят в 22 пункта стайлгайда. Они взяты из официальной документации Angular и из умолчаний Angular CLI и angular-eslint: именно ими новый проект на v22 отличается от кода эпохи NgModule. Там, где правило выведено из поведения инструмента, а не из текста гайда, стоит пометка «реконструкция».

### G-NG-028 · MUST · Привязки к host-элементу описываются свойством `host` в декораторе, а не `@HostBinding` и `@HostListener`
- Проверка: `@angular-eslint/prefer-host-metadata-property`.
- Источник: [Component host elements](https://angular.dev/guide/components/host-elements) (Angular v22.2.2) · официальный гайд · высокая. MUST - формулировка источника «Always prefer»; старый стайлгайд (правило 06-03) советовал обратное.
- Пример:

```ts
// плохо
export class Toggle {
  @HostBinding('class.active') isActive = false;
  @HostListener('click') toggle() {}
}

// хорошо
@Component({
  selector: 'app-toggle',
  template: '<ng-content />',
  host: {
    '[class.active]': 'isActive()',
    '(click)': 'toggle()',
  },
})
export class Toggle {
  protected readonly isActive = signal(false);

  protected toggle(): void {
    this.isActive.update(value => !value);
  }
}
```

### G-NG-029 · SHOULD · Компоненты, директивы и пайпы остаются standalone: `standalone: false` не пишут
- Проверка: `@angular-eslint/prefer-standalone` (error в `tsRecommended`).
- Источник: [component/schema.json](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/component/schema.json) (`standalone: true`; Angular CLI 22.x) · конфиг или инструмент · высокая · реконструкция; [ts-recommended.ts](https://github.com/angular-eslint/angular-eslint/blob/main/packages/angular-eslint/src/configs/ts-recommended.ts) (angular-eslint 22.5.0) · конфиг или инструмент · высокая · не Google. Разделы старого гайда про NgModule (04-08 … 04-11) в редакции 2025 удалены без замены.

### G-NG-030 · SHOULD · В шаблонах используется встроенный control flow (`@if`, `@for`, `@switch`), а не `*ngIf`, `*ngFor`, `*ngSwitch`
- Проверка: `@angular-eslint/template/prefer-control-flow` (error в `templateRecommended`).
- Источник: [API: NgIf](https://angular.dev/api/common/NgIf) (помечен устаревшим с v20.0, замена - блок `@if`; Angular v22.2.2) · официальный гайд · высокая; [template-recommended.ts](https://github.com/angular-eslint/angular-eslint/blob/main/packages/angular-eslint/src/configs/template-recommended.ts) (angular-eslint 22.5.0) · конфиг или инструмент · высокая · не Google · реконструкция.

### G-NG-031 · SHOULD · Компоненты работают в режиме `OnPush`; `ChangeDetectionStrategy.Eager` указывают только с обоснованием
- Проверка: `@angular-eslint/prefer-on-push-component-change-detection` (error в `tsRecommended`).
- Источник: [CHANGELOG Angular, 22.0.0, breaking changes](https://github.com/angular/angular/blob/main/CHANGELOG.md) (компонент без `changeDetection` в v22 - `OnPush`; прежнее поведение включает `ChangeDetectionStrategy.Eager`) · конфиг или инструмент · высокая · реконструкция; [component/schema.json](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/component/schema.json) (`changeDetection: "OnPush"` с CLI 22.0.0) · конфиг или инструмент · высокая.

### G-NG-032 · SHOULD · В новом коде inputs и queries объявляются сигнальными функциями (`input()`, `model()`, `viewChild()`), а не декораторами
- Проверка: `@angular-eslint/prefer-signals`.
- Источник: [Declaring inputs with the `@Input` decorator](https://angular.dev/guide/components/inputs#declaring-inputs-with-the-input-decorator) (Angular v22.2.2) · официальный гайд · высокая. Документация рекомендует сигнальные inputs для новых проектов; на queries это требование распространяет линтер (angular-eslint, не Google).

## Что из этого проверяет линтер

| Покрытие | Правила | Число |
|---|---|---|
| Полностью (angular-eslint) | G-NG-013, 014, 015, 016, 018, 024, 027, 028, 029, 030, 031, 032 | 12 |
| Частично | G-NG-002 (Prettier и typescript-eslint), 017, 019, 021, 023 | 5 |
| Только ручное ревью | G-NG-001, 003-012, 020, 022, 025, 026 | 15 |

Структура каталогов, имена файлов, `protected`, имена обработчиков и «простые lifecycle-методы» линтером не проверяются. Имена файлов и стартовую структуру задают генераторы Angular CLI - пока код создаётся через `ng generate`, правила G-NG-003 … G-NG-009 соблюдаются сами. angular-eslint - проект сообщества под лицензией MIT, а не продукт Google; форматирующих правил в нём нет и, по заявлению авторов, не будет ([README, раздел о форматировании](https://github.com/angular-eslint/angular-eslint/blob/main/README.md#philosophy-on-lint-rules-which-enforce-code-formatting-concerns)).

## CSS и HTML

Источник - [Google HTML/CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html) из google/styleguide (текст под CC BY 3.0; владелец по CODEOWNERS - @tonyruscoe). Гайд активен, но меняется редко. Последние содержательные правки: формат `TODO: действие` вместо `TODO(контакт)` (2025-02-13), требование `<!doctype html>` (2024-11-06), алфавитный порядок деклараций стал необязательным (2022-05-06), появились советы избегать `!important` и лишних `id` (2022-01-13); экспорт 2026-09-09 исправил одно слово ([история файла](https://github.com/google/styleguide/commits/gh-pages/htmlcssguide.html)). Правила ниже выписаны по тексту гайда на коммите `d9e89d7` (2026-10-08). Гайд распространяется на исходные файлы HTML и CSS, включая Sass и GSS.

Уровни. Гайд не пользуется словами must/should. Безусловный императив («Use…», «Always…», «Do not…») здесь считается MUST; формулировки «Avoid…», «where possible» и пункты с пометкой «optional» - SHOULD.

Инструменты. Линтера или конфига Stylelint для этого гайда Google не публикует: в google/styleguide его нет, поиск официального конфига результатов не дал - публичных данных не найдено. Проверки ниже собраны профилем из Prettier и встроенных правил Stylelint и помечены «не Google» в разделе [«Конфигурационные файлы»](#конфигурационные-файлы).

Применимость к Angular. Общие правила (отступ, регистр, кавычки, семантика, альтернативный текст) относятся и к шаблонам компонентов. Правила о документе целиком (`doctype`, `meta charset`, атрибут `type`) относятся к `src/index.html`.

**Общие правила**

### G-CSS-001 · MUST · Отступ - 2 пробела; табы и смесь табов с пробелами не используются
- Проверка: Prettier (`tabWidth: 2`, `useTabs: false` - значения по умолчанию); `.editorconfig`: `indent_style = space`, `indent_size = 2`.
- Источник: [Indentation](https://google.github.io/styleguide/htmlcssguide.html#Indentation) (редакция на 2026-10-08) · официальный гайд · высокая.

### G-CSS-002 · MUST · Весь код пишется в нижнем регистре: имена элементов, атрибуты и их значения, селекторы, свойства и значения CSS (кроме строк)
- Проверка: частично: Prettier приводит к нижнему регистру имена свойств и hex-цвета; Stylelint `selector-type-case`, `value-keyword-case`, `function-name-case`, `selector-class-pattern`; HTML - ручное ревью.
- Источник: [Capitalization](https://google.github.io/styleguide/htmlcssguide.html#Capitalization) (редакция на 2026-10-08) · официальный гайд · высокая.

### G-CSS-003 · MUST · Кодировка - UTF-8 без BOM; в HTML она объявлена через `<meta charset="utf-8">`, в таблицах стилей кодировка не указывается
- Проверка: частично: `.editorconfig` `charset = utf-8`; остальное - ручное ревью.
- Источник: [Encoding](https://google.github.io/styleguide/htmlcssguide.html#Encoding) (редакция на 2026-10-08) · официальный гайд · высокая.

### G-CSS-004 · SHOULD · Встраиваемые ресурсы (изображения, медиа, стили, скрипты) подключаются по HTTPS; протокол в адресе не опускают
- Проверка: частично: Stylelint `function-url-no-scheme-relative` и `function-url-scheme-allowed-list` (только `url()` в CSS); HTML и `@import` со строкой - ручное ревью.
- Источник: [Protocol](https://google.github.io/styleguide/htmlcssguide.html#Protocol) (редакция на 2026-10-08) · официальный гайд · высокая. SHOULD - в источнике «where possible».

### G-CSS-005 · SHOULD · HTML и CSS валидны, если этому не мешают особые требования; проверяйте валидатором
- Проверка: частично: правила Stylelint семейства `*-no-unknown`, `color-no-invalid-hex`, `string-no-newline`, `no-invalid-double-slash-comments`; валидаторы W3C - вручную.
- Источник: [HTML Validity](https://google.github.io/styleguide/htmlcssguide.html#HTML_Validity), [CSS Validity](https://google.github.io/styleguide/htmlcssguide.html#CSS_Validity) (редакция на 2026-10-08) · официальный гайд · высокая. SHOULD - в источнике «where possible».

**HTML**

### G-CSS-006 · MUST · HTML-документ начинается с `<!doctype html>`
- Проверка: ручное ревью.
- Источник: [Document Type](https://google.github.io/styleguide/htmlcssguide.html#Document_Type) (правка 2024-11-06) · официальный гайд · высокая.

### G-CSS-007 · MUST · У мультимедиа есть альтернативное содержимое: осмысленный `alt` у изображений (пустой `alt=""` - у декоративных), субтитры и расшифровки у видео и аудио
- Проверка: частично: `@angular-eslint/template/alt-text` из пресета `templateAccessibility` (шаблоны Angular); остальное - ручное ревью.
- Источник: [Multimedia Fallback](https://google.github.io/styleguide/htmlcssguide.html#Multimedia_Fallback) (редакция на 2026-10-08) · официальный гайд · высокая.

### G-CSS-008 · MUST · Разметка, оформление и поведение разделены: элементы HTML используются по назначению, оформление живёт в таблицах стилей, поведение - в скриптах
- Проверка: ручное ревью.
- Источник: [Semantics](https://google.github.io/styleguide/htmlcssguide.html#Semantics), [Separation of Concerns](https://google.github.io/styleguide/htmlcssguide.html#Separation_of_Concerns) (редакция на 2026-10-08) · официальный гайд · высокая. Интерпретация: в Angular шаблон, стили и класс компонента лежат рядом (G-NG-007), и это правилу не противоречит. Оно читается как запрет презентационной разметки и оформления внутри шаблона, а не как требование разнести файлы по каталогам.

### G-CSS-009 · MUST · Значения атрибутов HTML заключаются в двойные кавычки
- Проверка: Prettier: в HTML ставит двойные кавычки и при `singleQuote: true`.
- Источник: [HTML Quotation Marks](https://google.github.io/styleguide/htmlcssguide.html#HTML_Quotation_Marks) (редакция на 2026-10-08) · официальный гайд · высокая.

### G-CSS-010 · MUST · Атрибут `type` у подключаемых стилей и скриптов не пишется
- Проверка: ручное ревью.
- Источник: [`type` Attributes](https://google.github.io/styleguide/htmlcssguide.html#type_Attributes) (редакция на 2026-10-08) · официальный гайд · высокая.
- Пример:

```html
<!-- плохо -->
<link rel="stylesheet" href="https://example.com/main.css" type="text/css">
<script src="https://example.com/main.js" type="text/javascript"></script>

<!-- хорошо -->
<link rel="stylesheet" href="https://example.com/main.css">
<script src="https://example.com/main.js"></script>
```

### G-CSS-011 · SHOULD · Атрибут `id` без необходимости не ставится: для стилей - классы, для скриптов - data-атрибуты; если `id` нужен, в его значении есть дефис
- Проверка: ручное ревью.
- Источник: [`id` Attributes](https://google.github.io/styleguide/htmlcssguide.html#id_Attributes) (редакция на 2026-10-08) · официальный гайд · высокая. Причина из гайда: браузер делает элемент с `id` свойством глобального объекта `window`; значение с дефисом (`user-profile`) не может стать глобальной переменной JavaScript, а `userProfile` - может.

**CSS**

### G-CSS-012 · MUST · Имя класса отражает назначение элемента, а не его вид; слова в имени разделяются только дефисом
- Проверка: частично: Stylelint `selector-class-pattern` со значением `^[a-z][a-z0-9]*(-[a-z0-9]+)*$` (разделитель и регистр); осмысленность имени - ручное ревью.
- Источник: [Class Naming](https://google.github.io/styleguide/htmlcssguide.html#ID_and_Class_Naming), [Class Name Delimiters](https://google.github.io/styleguide/htmlcssguide.html#ID_and_Class_Name_Delimiters) (редакция на 2026-10-08) · официальный гайд · высокая. Запись БЭМ с подчёркиваниями (`block__elem_mod`) этому правилу не соответствует. Для больших проектов гайд допускает короткий префикс приложения через дефис ([Prefixes](https://google.github.io/styleguide/htmlcssguide.html#Prefixes), помечено «optional»).
- Пример:

```css
/* плохо: описывает вид, слова слиты или разделены подчёркиванием */
.btn-green {}
.errorstatus {}
.error_status {}

/* хорошо */
.checkout-submit {}
.error-status {}
```

### G-CSS-013 · SHOULD · ID-селекторы не используются; имя класса не уточняется селектором типа (`.error`, а не `div.error`)
- Проверка: Stylelint `selector-max-id: 0`, `selector-no-qualifying-type`.
- Источник: [ID Selectors](https://google.github.io/styleguide/htmlcssguide.html#ID_Selectors), [Type Selectors](https://google.github.io/styleguide/htmlcssguide.html#Type_Selectors) (редакция на 2026-10-08) · официальный гайд · высокая.

### G-CSS-014 · SHOULD · Где возможно, используются сокращённые свойства: `padding: 0 1em 2em`, `font`, `border-top`
- Проверка: частично: Stylelint `declaration-block-no-redundant-longhand-properties` (срабатывает, когда набор длинных свойств можно заменить одним сокращённым); остальное - ручное ревью.
- Источник: [Shorthand Properties](https://google.github.io/styleguide/htmlcssguide.html#Shorthand_Properties) (редакция на 2026-10-08) · официальный гайд · высокая.

### G-CSS-015 · MUST · Числа записываются единообразно: после нуля нет единицы измерения, ведущий ноль обязателен (`0.8em`), цвет - трёхсимвольный hex, где значение это допускает
- Проверка: Stylelint `length-zero-no-unit`, `color-hex-length: "short"`; ведущий ноль добавляет Prettier.
- Источник: [0 and Units](https://google.github.io/styleguide/htmlcssguide.html#0_and_Units), [Leading 0s](https://google.github.io/styleguide/htmlcssguide.html#Leading_0s), [Hexadecimal Notation](https://google.github.io/styleguide/htmlcssguide.html#Hexadecimal_Notation) (редакция на 2026-10-08) · официальный гайд · высокая. Единица после нуля остаётся там, где без неё нельзя: гайд приводит `flex: 0px`; правило Stylelint свойство `flex` пропускает.

### G-CSS-016 · SHOULD · `!important` не используется; определение браузера по user agent и CSS-хаки - крайняя мера
- Проверка: частично: Stylelint `declaration-no-important`; хаки - ручное ревью.
- Источник: [Important Declarations](https://google.github.io/styleguide/htmlcssguide.html#Important_Declarations), [Hacks](https://google.github.io/styleguide/htmlcssguide.html#Hacks) (редакция на 2026-10-08) · официальный гайд · высокая.

### G-CSS-017 · MUST · Правила CSS оформляются единообразно: каждый селектор и каждая декларация с новой строки, точка с запятой после каждой декларации, пробел после двоеточия и перед `{`, пустая строка между правилами
- Проверка: Prettier (всё, кроме пустой строки); Stylelint `rule-empty-line-before`.
- Источник: [Declaration Stops](https://google.github.io/styleguide/htmlcssguide.html#Declaration_Stops), [Property Name Stops](https://google.github.io/styleguide/htmlcssguide.html#Property_Name_Stops), [Declaration Block Separation](https://google.github.io/styleguide/htmlcssguide.html#Declaration_Block_Separation), [Selector and Declaration Separation](https://google.github.io/styleguide/htmlcssguide.html#Selector_and_Declaration_Separation), [Rule Separation](https://google.github.io/styleguide/htmlcssguide.html#Rule_Separation) (редакция на 2026-10-08) · официальный гайд · высокая.

### G-CSS-018 · MUST · В CSS используются одинарные кавычки; в `url()` кавычки не ставятся
- Проверка: Prettier `singleQuote: true`; Stylelint `function-url-quotes: "never"`.
- Источник: [CSS Quotation Marks](https://google.github.io/styleguide/htmlcssguide.html#CSS_Quotation_Marks) (редакция на 2026-10-08) · официальный гайд · высокая.
- Пример:

```css
/* плохо */
@import url("https://example.com/base.css");
html { font-family: "open sans", arial, sans-serif; }

/* хорошо */
@import url(https://example.com/base.css);
html { font-family: 'open sans', arial, sans-serif; }
```

### G-CSS-019 · SHOULD · Порядок деклараций в проекте единообразен; если автоматической сортировки нет - по алфавиту
- Проверка: ручное ревью. Автоматизировать можно сторонним плагином `stylelint-order` (правило `order/properties-alphabetical-order`); в конфиг профиля он не включён.
- Источник: [Declaration Order](https://google.github.io/styleguide/htmlcssguide.html#Declaration_Order) (помечено «optional» с 2022-05-06) · официальный гайд · высокая. Вендорные префиксы при сортировке не учитываются, но одинаковые свойства с разными префиксами идут по порядку (`-moz-` перед `-webkit-`).

Остальные пункты гайда - необязательные комментарии к коду и секциям, необязательный пропуск закрывающих тегов, запрет ссылок-сущностей вроде `&mdash;`, перенос длинных строк HTML - см. в [первоисточнике](https://google.github.io/styleguide/htmlcssguide.html).

## Конфигурационные файлы

Три файла лежат в [`configs/web/`](../../configs/web/). Они рассчитаны и на Angular, и на React; правила React описаны в [react.md](react.md).

| Файл | Инструменты и версии | Происхождение | Что здесь Google, а что нет |
|---|---|---|---|
| [`eslint.config.js`](../../configs/web/eslint.config.js) | ESLint 10.12.0, typescript-eslint 8.71.1, angular-eslint 22.5.0, eslint-plugin-react-hooks 7.1.1, TypeScript ~6.0.3 | каркас - то, что генерирует `ng add angular-eslint`; правила TypeScript - набор google/gts 7.0.0, перенесённый поштучно; дополнения - по тексту TS-гайда и стайлгайда Angular | Google: выбор правил gts и тексты гайдов. Не Google: сами ESLint, typescript-eslint и angular-eslint; дополнения профиля; блок React целиком |
| [`.prettierrc.json`](../../configs/web/.prettierrc.json) | Prettier 3.9.9 | четыре опции - дословно из `.prettierrc.json` gts 7.0.0; `printWidth` и `overrides` - из шаблона `.prettierrc` Angular CLI | оба источника значений - репозитории Google (gts, Angular CLI). Не Google: сам Prettier; соединение двух наборов в один файл - решение профиля |
| [`.stylelintrc.json`](../../configs/web/.stylelintrc.json) | Stylelint 17.16.0 (2026-10-01) | собран профилем по тексту Google HTML/CSS Style Guide из встроенных правил Stylelint | целиком «не Google»: конфига Stylelint у Google нет |

Комментарии с версиями есть только в `eslint.config.js`: JSON комментариев не допускает, поэтому всё о двух JSON-файлах записано в этом разделе.

Установка и запуск:

```sh
npm install --save-dev eslint@10.12.0 @eslint/js@10.0.1 typescript-eslint@8.71.1 \
  angular-eslint@22.5.0 eslint-plugin-react-hooks@7.1.1 typescript@~6.0.3 \
  prettier@3.9.9 stylelint@17.16.0

npx eslint .
npx prettier --check .
npx stylelint "**/*.css"
```

Версии взяты из реестра npm на 2026-10-09, кроме `@eslint/js` 10.0.1 - это версия из каталога зависимостей angular-eslint 22.5.0, в реестре она отдельно не проверялась. `typescript` нужно закреплять на 6.0.x: typescript-eslint 8.71.1 объявляет диапазон `>=4.8.4 <6.1.0`, а тег `latest` в npm уже указывает на 7.0.2; сам Angular 22 тоже собран на TypeScript 6.0.x. Node.js: ESLint 10 требует `^20.19.0 || ^22.13.0 || >=24`, Stylelint 17 - `>=20.19.0`, Angular 22.2.2 - `^22.22.3 || ^24.15.0 || >=26.0.0`. Если в проекте только Angular или только React, удалите из `eslint.config.js` импорт и блок второго фреймворка и не ставьте его плагин.

### `eslint.config.js`

Файл состоит из четырёх блоков: TypeScript (`**/*.ts`, `**/*.tsx`), классы Angular (`**/*.ts`), шаблоны Angular (`**/*.html` и встроенные шаблоны, которые извлекает процессор `angular.processInlineTemplates`) и React (`**/*.tsx` и файлы хуков). Префикс селекторов задаётся константой `SELECTOR_PREFIX` в начале файла.

Почему основа - не готовый пакет Google:

| Вариант | Состояние на 2026-10-09 | Решение профиля |
|---|---|---|
| [`eslint-config-google`](https://github.com/google/eslint-config-google) 0.14.0 | **архив** с 2026-06-01; последний релиз - 2019-09-02; формат eslintrc, который ESLint 10 не читает; правила под замороженный с 2024-07 JavaScript-гайд; TypeScript не покрывает | не используется |
| [`gts`](https://github.com/google/gts) 7.0.0 как пакет | тег 2025-12-05; последний коммит в main - 2026-01-16; зависимость `eslint ^9.37.0`, а ветка ESLint 9 вышла из поддержки 2026-08-06 ([eslint.org/version-support](https://eslint.org/version-support/), проверено 2026-10-16; то же - [angular-eslint, CONFIGURING_ESLINT.md](https://github.com/angular-eslint/angular-eslint/blob/main/docs/CONFIGURING_ESLINT.md)); README: «This is not an official Google product» | пакет не подключается, его набор правил перенесён в конфиг |
| typescript-eslint + правила gts + дополнения по тексту гайда | ESLint 10.12.0, typescript-eslint 8.71.1; тот же каркас, что создаёт генератор angular-eslint | **принят** |

Что перенесено из gts ([`src/index.js`](https://github.com/google/gts/blob/main/src/index.js), Apache-2.0) и что изменено:

| Правило | В gts 7.0.0 | В профиле | Причина |
|---|---|---|---|
| `no-var`, `prefer-const`, `prefer-arrow-callback`, `block-scoped-var`, `no-restricted-properties` (`describe.only`, `it.only`), `@typescript-eslint/no-floating-promises` | error | error | как в gts |
| `@typescript-eslint/no-empty-function` | off | off | как в gts (пресет `stylistic` его включает) |
| `eqeqeq` | `'error'` | `['error', 'always', {null: 'ignore'}]` | TS-гайд разрешает `== null` ([#equality-checks](https://google.github.io/styleguide/tsguide.html#equality-checks)); G-TS-007 |
| `@typescript-eslint/ban-ts-comment` | warn | error | TS-гайд: «must not» ([#ts-ignore](https://google.github.io/styleguide/tsguide.html#ts-ignore)); G-TS-010 |
| `@typescript-eslint/array-type` | нет (добавлено в main 2026-01-16, [коммит bd623c0](https://github.com/google/gts/commit/bd623c0)) | `{default: 'array-simple'}` | [#arrayt-type](https://google.github.io/styleguide/tsguide.html#arrayt-type) |
| `prettier/prettier`, `quotes`, `eol-last`, `no-trailing-spaces` | включены | нет | форматирование проверяет отдельный шаг `prettier --check`; три правила ESLint помечены устаревшими с 8.53.0 |
| default-экспорт, `const enum`, `#private`, модификатор `public`, «_» в именах, префикс `I` | не проверяются | `no-restricted-syntax`, `@typescript-eslint/explicit-member-accessibility`, `@typescript-eslint/naming-convention` | требования TS-гайда (G-TS-004, G-TS-008, G-TS-009); это дополнение профиля, а не Google-конфиг |

Если нужен именно пакет Google без изменений, вместо файла профиля подойдёт вариант из README gts. Он остаётся на ESLint 9 и не содержит ни дополнений профиля, ни правил Angular:

```js
// eslint.config.js - CommonJS; gts 7.0.0 (eslint ^9.37.0, typescript-eslint ^8.46.1, prettier ^3.6.2)
module.exports = [...require('gts')];
```

Команда `npx gts init` создаёт этот файл, `.prettierrc.js`, `.editorconfig` и `tsconfig.json` с наследованием от `tsconfig-google.json`; проверка - `gts lint`, исправление - `gts fix`.

### `.prettierrc.json`

| Опция | Значение | Откуда |
|---|---|---|
| `singleQuote` | `true` | [`.prettierrc.json` gts](https://github.com/google/gts/blob/main/.prettierrc.json) и [шаблон Angular CLI](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/workspace/files/.prettierrc.template) совпадают |
| `bracketSpacing` | `false` | gts; так же в [`.prettierrc` angular/angular](https://github.com/angular/angular/blob/main/.prettierrc). В шаблоне CLI опции нет |
| `trailingComma` | `"all"` | gts (добавлено в 6.0.0 с пояснением «to match internal Google config»); так же в angular/angular |
| `arrowParens` | `"avoid"` | gts |
| `printWidth` | `100` | шаблон Angular CLI; `.prettierrc` и [CONTRIBUTING](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#rules) angular/angular. gts оставляет умолчание Prettier - 80 |
| `overrides`: `*.html` → `parser: "angular"` | - | шаблон Angular CLI |

Отступ в 2 пробела, точки с запятой и отсутствие табов - умолчания Prettier, которые не меняют ни gts, ни CLI. `ng new` создаёт собственный файл `.prettierrc`, и Prettier читает его раньше, чем `.prettierrc.json` (проверено на Prettier 3.8.1): при переносе настроек профиля сгенерированный файл нужно удалить. Публичный TS-гайд раздела о форматировании не содержит: там есть только требования одинарных кавычек и точек с запятой, всё остальное задаёт инструмент.

### `.stylelintrc.json`

Готовые пресеты (`stylelint-config-standard` и подобные) не подключены: в них много правил, которых в гайде Google нет. Плагины не нужны - используются только встроенные правила. Начиная с 16-й версии Stylelint не содержит форматирующих правил, поэтому отступы, кавычки, точки с запятой и регистр свойств проверяет Prettier.

| Правила Stylelint | Правило профиля |
|---|---|
| `function-name-case`, `selector-type-case`, `value-keyword-case` - `"lower"` | G-CSS-002 |
| `function-url-no-scheme-relative`; `function-url-scheme-allowed-list: ["https", "data"]` | G-CSS-004 (`data:` добавлен профилем: у встроенных данных нет сетевого протокола) |
| `at-rule-no-unknown`, `property-no-unknown`, `unit-no-unknown`, `selector-pseudo-class-no-unknown`, `selector-pseudo-element-no-unknown` (кроме `::ng-deep`), `selector-type-no-unknown` (кроме пользовательских элементов), `color-no-invalid-hex`, `string-no-newline`, `no-invalid-double-slash-comments` | G-CSS-005 |
| `selector-class-pattern` | G-CSS-012 |
| `selector-max-id: 0`; `selector-no-qualifying-type` (атрибутные селекторы разрешены: гайд говорит только о классах) | G-CSS-013 |
| `declaration-block-no-redundant-longhand-properties` | G-CSS-014 |
| `length-zero-no-unit`; `color-hex-length: "short"` | G-CSS-015 |
| `declaration-no-important` | G-CSS-016 |
| `rule-empty-line-before` | G-CSS-017 |
| `function-url-quotes: "never"` | G-CSS-018 |

Конфиг рассчитан на обычный CSS - так Angular CLI создаёт компоненты по умолчанию (`style: "css"`). Гайд Google распространяется и на Sass, но для SCSS Stylelint нужен отдельный синтаксический модуль, а `at-rule-no-unknown` будет ругаться на директивы Sass; этот вариант в профиль не включён. Исключения для `::ng-deep` и пользовательских элементов добавлены ради стилей компонентов Angular.

### Что проверено

| Файл | Проверено локально | Не проверялось |
|---|---|---|
| `eslint.config.js` | синтаксис (`node --check`, Node.js 22.22.0); загрузка и схема конфигурации в ESLint 10.1.0 с заглушками вместо четырёх пакетов-плагинов; срабатывание встроенных правил и двух селекторов `no-restricted-syntax` на тестовых файлах | работа настоящих плагинов: реестр npm недоступен из среды сборки. Имена и опции правил сверены с исходниками typescript-eslint 8.71.1 и angular-eslint 22.5.0 |
| `.prettierrc.json` | разбор JSON; форматирование тестовых `.ts`, `.tsx`, `.css` и `.html` в Prettier 3.8.1 (в том числе парсер `angular`, ведущий ноль и одинарные кавычки в CSS, двойные кавычки в HTML); все три файла конфигурации сами проходят `prettier --check` | версия 3.9.9, на которую рассчитан профиль |
| `.stylelintrc.json` | разбор JSON; имена правил и значения опций сверены с исходниками и README правил Stylelint 17.16.0 | запуск Stylelint: пакет и его зависимости недоступны |

## Расхождения источников и выбор профиля

| Вопрос | Вариант А | Вариант Б | Профиль | Почему |
|---|---|---|---|---|
| Длина строки в TS и HTML | 80: умолчание Prettier в gts; «Column limit: 80» в замороженном [JS-гайде](https://google.github.io/styleguide/jsguide.html#formatting-column-limit) | 100: шаблон `.prettierrc` Angular CLI; CONTRIBUTING и `.prettierrc` angular/angular | **100** | стайлгайд Angular и публичный TS-гайд лимита не задают; для Angular-приложения ближайший источник Google - инструменты самой команды Angular. Если Angular в проекте нет и нужен gts без отступлений, удалите `printWidth` |
| Суффиксы в именах | `user-profile.component.ts`, `UserProfileComponent` (гайд до 2025; `fileNameStyleGuide: "2016"`) | без суффиксов (редакция 2025; умолчание CLI) | **без суффиксов** в новом коде | действующая редакция; существующий проект не переименовывают (G-NG-001) |
| `@ts-ignore` | gts: warn | TS-гайд: «must not» | **error** | когда инструмент мягче гайда, профиль следует тексту гайда |
| Сравнение `== null` | gts: `eqeqeq: 'error'` его запрещает | TS-гайд разрешает | **разрешено** | то же |
| `use-lifecycle-interface` | пресет angular-eslint: warn | стайлгайд: правило без оговорок | **error** | у правила есть автоисправление, причин оставлять предупреждение нет |
| Host-привязки | старый стайлгайд (06-03): декораторы | гайд по host-элементам: «Always prefer» `host` | **`host`** | действующая документация (G-NG-028) |
| Суффикс `$` у Observable | TS-гайд: на усмотрение команды, но единообразно в проекте ([#naming-style](https://google.github.io/styleguide/tsguide.html#naming-style)) | coding standards angular/angular: не добавлять | **на усмотрение проекта, единообразно** | coding standards относятся только к коду фреймворка; для приложений действует TS-гайд |
| `bracketSpacing` | gts и angular/angular: `false` | шаблон CLI: не задано (умолчание Prettier - `true`) | **`false`** | так настроен gts - инструмент именно под TS-гайд Google |
| Проверки доступности в шаблонах | в стайлгайде Angular их нет | генератор angular-eslint включает `templateAccessibility` | **включены** | согласуются с требованием HTML-гайда об альтернативном содержимом (G-CSS-007); сам пресет - не Google |
| Числовой порог сложности шаблона | стайлгайд: порога нет, решает автор | `template/conditional-complexity`: 5 по умолчанию | **warn, 5** | порог принадлежит инструменту, а не гайду, поэтому только предупреждение |
