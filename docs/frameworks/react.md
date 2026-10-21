# React: профиль Google

> Данные актуальны на 2026-10-09.

Стайлгайда Google для React нет - публичных данных не найдено: в google/styleguide React не упоминается, а TSX встречается один раз, в таблице именования TypeScript-гайда. Поэтому профиль состоит из двух слоёв. Язык регулирует Google TypeScript Style Guide - это Google. Сам React регулируют «Rules of React» с react.dev и линтер `eslint-plugin-react-hooks` 7.1.1 от команды React (Meta); все 15 правил области REACT ниже помечены «не Google». Там, где привычки экосистемы React расходятся с TS-гайдом Google (default-экспорт, `type` против `interface`, имена файлов), профиль берёт вариант Google.

## Проверка: есть ли гайд Google

| Что проверено | Результат | Источник |
|---|---|---|
| Тексты google/styleguide (коммит `d9e89d7`, 2026-10-08) | слово «React» не встречается ни в TypeScript-, ни в JavaScript-гайде; «TSX» и «JSX» - один раз, в строке таблицы именования: UpperCamelCase для функций-компонентов в TSX | [tsguide, Rules by identifier type](https://google.github.io/styleguide/tsguide.html#naming-rules-by-identifier-type) |
| Список гайдов Google вне google/styleguide | Angular, Effective Dart, Kotlin; React в списке нет | [README google/styleguide](https://github.com/google/styleguide/blob/gh-pages/README.md) |
| Фреймворки, названные в TS-гайде | декораторы разрешены только фреймворковые, перечислены Angular и Polymer | [tsguide, Decorators](https://google.github.io/styleguide/tsguide.html#decorators) |
| Веб-поиск «Google official React style guide» | ни одного результата от Google, только сторонние гайды (например, [Dynatrace](https://developer.dynatrace.com/learn/react-style-guide)) | уверенность средняя: отсутствие показано поиском, не исчерпывающе |

Не проверялось: правила отдельных команд Google внутри их репозиториев (Material, Chrome, Firebase). Вердикт для профиля: **публичных данных не найдено**; альтернатива ниже помечена «не Google».

## Какие правила Google продолжают действовать

React-код остаётся кодом на TypeScript, и к нему применяются правила области TS из [../languages/other.md](../languages/other.md) (G-TS-001 … G-TS-010). В четырёх темах гайд Google пересекается с привычками экосистемы React; в трёх из них они расходятся:

| Тема | Правило Google | Что принято в React | Профиль | Проверка |
|---|---|---|---|---|
| Экспорт компонента | только именованные экспорты; default-экспорт запрещён ([tsguide, Exports](https://google.github.io/styleguide/tsguide.html#exports)) | примеры react.dev построены на `export default function`; default-экспорт обычен для файла с одним компонентом ([react.dev](https://react.dev/learn/importing-and-exporting-components#default-vs-named-exports)) | **именованный экспорт** (G-TS-004); исключение - файлы, где default-экспорт требует инструмент | `no-restricted-syntax` с селектором `ExportDefaultDeclaration` |
| Тип props | `interface`, а не псевдоним типа-литерала ([tsguide, Prefer interfaces](https://google.github.io/styleguide/tsguide.html#prefer-interfaces)) | react.dev допускает и `type`, и `interface` ([react.dev](https://react.dev/learn/typescript#typescript-with-react-components)) | **`interface`** (G-REACT-014) | `@typescript-eslint/consistent-type-definitions` |
| Имя компонента | UpperCamelCase для функций-компонентов в TSX ([tsguide](https://google.github.io/styleguide/tsguide.html#naming-rules-by-identifier-type)) | имя с заглавной буквы | совпадают (G-TS-008, G-REACT-013) | ручное ревью |
| Имя файла | JavaScript-гайд: только строчные буквы, разделитель `_` или `-` ([jsguide, File name](https://google.github.io/styleguide/jsguide.html#file-name)); TS-гайд отдельного правила не содержит, но мимоходом называет файлы snake_case ([tsguide, Imports](https://google.github.io/styleguide/tsguide.html#identifiers-imports)) | в примерах react.dev файлы названы как компоненты: `Gallery.js`, `Button.js` ([react.dev](https://react.dev/learn/importing-and-exporting-components)) | **строчные буквы, один разделитель на проект**; профиль советует дефис (`user-card.tsx`), как в Angular-части (G-NG-003) | ручное ревью |

Оговорки. JavaScript-гайд **не обновляется** с 2024-07 (плашка в начале гайда: Google советует переходить на TypeScript), поэтому правило об именах файлов взято из замороженного источника. Выбор дефиса, а не подчёркивания - решение профиля ради единообразия с Angular; оба разделителя гайду не противоречат.

Интерпретация: запрет default-экспорта в TS-гайде объяснён тем, что у такого экспорта нет канонического имени и это усложняет централизованное сопровождение кода ([tsguide, Exports](https://google.github.io/styleguide/tsguide.html#exports)). Для React-проекта это означает `import {UserCard} from './user-card'` вместо импорта под произвольным именем.

Форматирование (G-TS-002, G-TS-003) - Prettier с настройками из [`.prettierrc.json`](../../configs/web/.prettierrc.json) (одинарные кавычки, запятая в конце многострочных списков, без пробелов внутри фигурных скобок). Значение `printWidth: 100` в этом файле пришло из инструментов Angular; если Angular в проекте нет и нужен набор gts без отступлений, удалите эту опцию - останется умолчание Prettier, 80. Происхождение каждой опции разобрано в [angular.md](angular.md#конфигурационные-файлы).

## Правила React (не Google)

Источники - документация React на [react.dev](https://react.dev/reference/rules) (версия 19.3, текст под CC BY 4.0) и `eslint-plugin-react-hooks` 7.1.1 (MIT). Авторы документации подчёркивают, что «Rules of React» - именно правила, а не рекомендации: их нарушение, скорее всего, приводит к ошибкам. Поэтому большинство пунктов ниже - MUST. SHOULD стоит там, где документация даёт совет или пресет линтера выдаёт предупреждение, а не ошибку.

### G-REACT-001 · MUST · Компоненты и хуки идемпотентны: при тех же props, state и context рендер возвращает тот же результат
- Проверка: частично: `react-hooks/purity`; остальное - ручное ревью.
- Источник: [Components and Hooks must be idempotent](https://react.dev/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent) (react.dev, v19.3) · официальный гайд · высокая · не Google.
- Пример:

```tsx
// плохо: результат зависит от момента вызова
export function Ticket({title}: TicketProps) {
  const id = Math.random();
  return <li key={id}>{title}</li>;
}

// хорошо: всё, от чего зависит результат, приходит снаружи
export function Ticket({id, title}: TicketProps) {
  return <li key={id}>{title}</li>;
}
```

### G-REACT-002 · MUST · Побочные эффекты выполняются вне рендера - в обработчиках событий или в эффектах
- Проверка: частично: `react-hooks/globals`, `react-hooks/refs`; остальное - ручное ревью.
- Источник: [Side effects must run outside of render](https://react.dev/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) (react.dev, v19.3) · официальный гайд · высокая · не Google.

### G-REACT-003 · MUST · Props, state, аргументы и возвращаемые значения хуков, а также значения, уже переданные в JSX, не изменяются на месте
- Проверка: частично: `react-hooks/immutability`; остальное - ручное ревью.
- Источник: [Props and state are immutable](https://react.dev/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable), [Return values and arguments to Hooks are immutable](https://react.dev/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable), [Values are immutable after being passed to JSX](https://react.dev/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) (react.dev, v19.3) · официальный гайд · высокая · не Google.
- Пример:

```tsx
// плохо: меняет объект, полученный через props
export function Price({item}: PriceProps) {
  item.price = Math.round(item.price);
  return <span>{item.price}</span>;
}

// хорошо: новое значение вместо изменения чужого
export function Price({item}: PriceProps) {
  const rounded = Math.round(item.price);
  return <span>{rounded}</span>;
}
```

### G-REACT-004 · MUST · Хуки вызываются только на верхнем уровне функции: не в условиях, циклах и вложенных функциях и не после раннего `return`
- Проверка: `react-hooks/rules-of-hooks` (error в пресете `recommended`).
- Источник: [Only call Hooks at the top level](https://react.dev/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) (react.dev, v19.3) · официальный гайд · высокая · не Google.

### G-REACT-005 · MUST · Хуки вызываются только из функций-компонентов и из пользовательских хуков
- Проверка: `react-hooks/rules-of-hooks`.
- Источник: [Only call Hooks from React functions](https://react.dev/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) (react.dev, v19.3) · официальный гайд · высокая · не Google.

### G-REACT-006 · MUST · Хук не передаётся как обычное значение: его не кладут в props и переменные и не подменяют на лету
- Проверка: частично: `react-hooks/rules-of-hooks`; остальное - ручное ревью.
- Источник: [Never pass around hooks as regular values](https://react.dev/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values) (react.dev, v19.3) · официальный гайд · высокая · не Google.

### G-REACT-007 · SHOULD · Массив зависимостей хука перечисляет все значения, которые использует его функция
- Проверка: `react-hooks/exhaustive-deps`.
- Источник: [exhaustive-deps](https://react.dev/reference/eslint-plugin-react-hooks/lints/exhaustive-deps) (react.dev, v19.3) · официальный гайд · высокая · не Google. SHOULD - в пресете `recommended` правило выдаёт предупреждение, а не ошибку.

### G-REACT-008 · SHOULD · `setState` не вызывается синхронно в теле эффекта; то, что вычисляется из props и state, считают прямо при рендере
- Проверка: `react-hooks/set-state-in-effect`.
- Источник: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect#updating-state-based-on-props-or-state), [set-state-in-effect](https://react.dev/reference/eslint-plugin-react-hooks/lints/set-state-in-effect) (react.dev, v19.3) · официальный гайд · высокая · не Google. SHOULD - в документации это совет, хотя пресет линтера считает нарушение ошибкой.
- Пример:

```tsx
// плохо: лишнее состояние и лишний рендер
const [total, setTotal] = useState(0);
useEffect(() => {
  setTotal(items.reduce((sum, item) => sum + item.price, 0));
}, [items]);

// хорошо
const total = items.reduce((sum, item) => sum + item.price, 0);
```

### G-REACT-009 · MUST · `setState` не вызывается во время рендера
- Проверка: `react-hooks/set-state-in-render`.
- Источник: [set-state-in-render](https://react.dev/reference/eslint-plugin-react-hooks/lints/set-state-in-render) (react.dev, v19.3) · официальный гайд · высокая · не Google.

### G-REACT-010 · MUST · Ref не читают и не записывают во время рендера
- Проверка: `react-hooks/refs`.
- Источник: [refs](https://react.dev/reference/eslint-plugin-react-hooks/lints/refs) (react.dev, v19.3) · официальный гайд · высокая · не Google.

### G-REACT-011 · MUST · Компонент не объявляют внутри другого компонента
- Проверка: `react-hooks/static-components`.
- Источник: [static-components](https://react.dev/reference/eslint-plugin-react-hooks/lints/static-components) (react.dev, v19.3) · официальный гайд · высокая · не Google.
- Пример:

```tsx
// плохо: Row создаётся заново при каждом рендере Table
export function Table({rows}: TableProps) {
  function Row({row}: RowProps) {
    return <tr>{row.title}</tr>;
  }
  return <table>{rows.map(row => <Row key={row.id} row={row} />)}</table>;
}

// хорошо: оба компонента объявлены на уровне модуля
function Row({row}: RowProps) {
  return <tr>{row.title}</tr>;
}

export function Table({rows}: TableProps) {
  return <table>{rows.map(row => <Row key={row.id} row={row} />)}</table>;
}
```

### G-REACT-012 · MUST · Функцию компонента не вызывают напрямую - её используют только в JSX
- Проверка: ручное ревью.
- Источник: [Never call component functions directly](https://react.dev/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) (react.dev, v19.3) · официальный гайд · высокая · не Google.
- Пример: `<Article />`, а не `{Article()}`.

### G-REACT-013 · MUST · Имя компонента начинается с заглавной буквы и пишется в UpperCamelCase
- Проверка: ручное ревью.
- Источник: [Your First Component](https://react.dev/learn/your-first-component) (react.dev, v19.3) · официальный гайд · высокая · не Google; [Rules by identifier type](https://google.github.io/styleguide/tsguide.html#naming-rules-by-identifier-type) (экспорт 2023-10-11) · официальный гайд · высокая. Единственное место, где гайд Google прямо говорит о компонентах в TSX, и оно совпадает с правилом React.

### G-REACT-014 · SHOULD · Props описаны объектным типом; в профиле Google - через `interface`
- Проверка: `@typescript-eslint/consistent-type-definitions` со значением `'interface'`.
- Источник: [TypeScript with React Components](https://react.dev/learn/typescript#typescript-with-react-components) (react.dev, v19.3) · официальный гайд · высокая · не Google; [Prefer interfaces](https://google.github.io/styleguide/tsguide.html#prefer-interfaces) (экспорт 2023-10-11) · официальный гайд · высокая.

### G-REACT-015 · SHOULD · Приложение обёрнуто в `<StrictMode>`, а код проверяется плагином `eslint-plugin-react-hooks`
- Проверка: ручное ревью (наличие `<StrictMode>` в точке входа и блока React в `eslint.config.js`).
- Источник: [Rules of React](https://react.dev/reference/rules) (react.dev, v19.3) · официальный гайд · высокая · не Google. В источнике - «We strongly recommend».

Методика, которая линтером не проверяется: хранить минимальное состояние и выводить остальное из него - [Thinking in React, шаг 3](https://react.dev/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state) (не Google).

## Инструменты (не Google)

| Пакет | Версия | Владелец | Состояние и ограничения | В конфиге профиля |
|---|---|---|---|---|
| [`eslint-plugin-react-hooks`](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks) | 7.1.1 | команда React (Meta) | активен, MIT. С 7.0.0 остались пресеты `recommended` и `recommended-latest`, правила React Compiler включены по умолчанию; с 7.1.0 поддерживает ESLint 10 ([CHANGELOG](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/CHANGELOG.md)) | да: `reactHooks.configs.flat.recommended` |
| [`@eslint-react/eslint-plugin`](https://github.com/Rel1cx/eslint-react) | 5.24.10 | сообщество (Rel1cx) | активен; лицензия не проверена. Требует Node.js 22+, ESLint 10.3.0+, TypeScript 5+; пресеты `recommended-typescript`, `strict-typescript` и др. | нет: пересечение его правил с `react-hooks/*` не проверялось |
| [`eslint-plugin-react`](https://github.com/jsx-eslint/eslint-plugin-react) | 7.37.5 | сообщество (jsx-eslint) | последний коммит - 2026-07-29; диапазон peer заканчивается на ESLint `^9.7`, ESLint 10 в него не входит; лицензия не проверена | нет: несовместим с ESLint 10 по объявленным зависимостям |
| `react` | 19.3.0 | команда React (Meta) | [реестр npm](https://registry.npmjs.org/react/latest) | - |

Что включает пресет `recommended` плагина 7.x ([README](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md), [src/index.ts](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/src/index.ts)): `rules-of-hooks` (error) и `exhaustive-deps` (warn), а также правила React Compiler - `config`, `error-boundaries`, `gating`, `globals`, `immutability`, `preserve-manual-memoization`, `purity`, `refs`, `set-state-in-effect`, `set-state-in-render`, `static-components`, `use-memo` (error) и `unsupported-syntax`, `incompatible-library` (warn). По документации React, диагностикой компилятора можно пользоваться и в проекте, который сам компилятор не подключал ([react.dev](https://react.dev/reference/eslint-plugin-react-hooks)). На той же странице на 2026-10-09 висит пометка о том, что возможность доступна в последней RC-версии; как она соотносится со стабильным релизом 7.1.1, выяснить не удалось.

## Конфигурация

Правила React подключает четвёртый блок [`configs/web/eslint.config.js`](../../configs/web/eslint.config.js): он применяется к `**/*.tsx` и к файлам пользовательских хуков (`use-*.ts`, `useName.ts`). Первый блок того же файла применяет к `.tsx` правила TypeScript-гайда Google. Версии пакетов, команды установки и результаты проверки конфига описаны в [angular.md](angular.md#конфигурационные-файлы). Если Angular в проекте нет, удалите из конфига импорт `angular-eslint` и блоки 2 и 3.

Если инструмент требует default-экспорт (например, файл, который загружается через `React.lazy`), отключите запрет точечно - отдельным блоком в конце массива конфигурации:

```js
{
  // Только для файлов, где default-экспорт требует инструмент.
  files: ['src/pages/**/*.tsx'],
  rules: {'no-restricted-syntax': 'off'},
},
```

Блок отключает `no-restricted-syntax` целиком, то есть вместе с запретами `const enum` и `#private` для этих файлов.

Минимальный вариант только с официальным плагином React - по его [README](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md) (MIT), отформатирован настройками профиля:

```js
import reactHooks from 'eslint-plugin-react-hooks';
import {defineConfig} from 'eslint/config';

export default defineConfig([reactHooks.configs.flat.recommended]);
```

## Пример компонента в стиле профиля

```tsx
// user-card.tsx - имя файла строчными через дефис
import {useState} from 'react';

// G-REACT-014: props описаны интерфейсом
interface UserCardProps {
  name: string;
  onSelect: (name: string) => void;
}

// Именованный экспорт (TS-гайд Google); имя в UpperCamelCase (G-REACT-013)
export function UserCard({name, onSelect}: UserCardProps) {
  // G-REACT-004: хук на верхнем уровне
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="user-card">
      <button type="button" onClick={() => setExpanded(!expanded)}>
        {name}
      </button>
      {expanded && (
        <button type="button" onClick={() => onSelect(name)}>
          Выбрать
        </button>
      )}
    </section>
  );
}
```
