// Профиль «Google» · веб (TypeScript, Angular, React) · ESLint, flat config.
// Данные актуальны на 2026-10-09. Правила описаны в docs/frameworks/angular.md (G-NG-*, G-CSS-*),
// docs/frameworks/react.md (G-REACT-*) и docs/languages/other.md (G-TS-*).
//
// Из чего собран файл:
//   1. Каркас - то, что генерирует `ng add angular-eslint` 22.5.0
//      (angular-eslint/packages/schematics/src/utils.ts, MIT): @eslint/js recommended,
//      typescript-eslint recommended + stylistic, angular-eslint tsRecommended,
//      templateRecommended, templateAccessibility, селекторы с префиксом проекта.
//   2. Правила Google для TypeScript - набор из google/gts 7.0.0 (src/index.js, Apache-2.0),
//      перенесённый сюда поштучно, без пакета gts. Причина: gts 7.0.0 (2025-12-05) зависит от
//      eslint ^9.37.0, а ветка ESLint 9 вышла из поддержки 2026-08-06 (eslint.org/version-support,
//      проверено 2026-10-16); новых релизов gts после
//      7.0.0 нет. Три форматирующих правила gts (quotes, eol-last, no-trailing-spaces) не
//      перенесены: в ESLint они помечены устаревшими с 8.53.0, их работу делает Prettier.
//   3. Дополнения профиля (НЕ Google-конфиг): требования Google TypeScript Style Guide, которых
//      в gts нет (именованные экспорты, запрет const enum, #private, модификатора public, «_»),
//      и правила стайлгайда Angular поверх пресета angular-eslint. Каждое помечено якорем гайда.
//   4. React - eslint-plugin-react-hooks (команда React, Meta). Это НЕ Google: у Google нет
//      гайда и конфига для React.
//   eslint-config-google не используется: репозиторий в архиве с 2026-06-01, последний релиз
//   0.14.0 от 2019-09-02, формат eslintrc (ESLint 10 его не читает), TypeScript не покрывает.
//
// Версии (реестр npm на 2026-10-09, если не сказано иное):
//   eslint                     10.12.0 - Node.js ^20.19.0 || ^22.13.0 || >=24
//   @eslint/js                 10.0.1 - версия из каталога зависимостей angular-eslint 22.5.0
//   typescript-eslint          8.71.1 - peer: eslint ^8.57.0 || ^9 || ^10;
//                                         typescript >=4.8.4 <6.1.0
//   angular-eslint             22.5.0 - peer: eslint ^9 || ^10, typescript-eslint ^8;
//                                         мажор совпадает с мажором Angular (22.x)
//   eslint-plugin-react-hooks  7.1.1 - peer включает eslint ^9 и ^10
//   typescript                 ~6.0.3 - НЕ 7.x: dist-tag latest = 7.0.2 не входит
//                                         в диапазон typescript-eslint
//   prettier                   3.9.9 - запускается отдельно (`prettier --check .`),
//                                         настройки - в .prettierrc.json
// Форматирующих правил в этом файле нет, поэтому eslint-config-prettier не нужен.
//
// Файл - ES-модуль: в package.json нужен "type": "module", иначе переименуйте файл
// в eslint.config.mjs. Если в проекте только Angular или только React - удалите импорт и блок
// другого фреймворка (помечены ниже).
//
// Проверено локально: синтаксис (`node --check`, Node.js 22.22.0); загрузка файла и схема
//   конфигурации - ESLint 10.1.0 с заглушками вместо пакетов @eslint/js, typescript-eslint,
//   angular-eslint и eslint-plugin-react-hooks; на тестовых файлах сработали встроенные правила
//   eqeqeq, no-var, prefer-const, prefer-arrow-callback, block-scoped-var,
//   no-restricted-properties и селекторы ExportDefaultDeclaration и PrivateIdentifier
//   из no-restricted-syntax.
// Не запускалось: реестр пакетов недоступен из среды сборки, поэтому настоящие плагины не
//   устанавливались. Имена и опции правил @typescript-eslint/* сверены с исходниками
//   typescript-eslint 8.71.1, правил @angular-eslint/* - с angular-eslint 22.5.0; селектор
//   TSEnumDeclaration[const=true] сверен с описанием AST (@typescript-eslint/ast-spec), но не
//   исполнялся.

// @ts-check
import eslint from '@eslint/js';
import {defineConfig} from 'eslint/config';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint'; // только Angular
import reactHooks from 'eslint-plugin-react-hooks'; // только React (не Google)

// Префикс селекторов проекта (G-NG-014, G-NG-016). Замените на свой; `ng` запрещён (G-NG-015).
const SELECTOR_PREFIX = 'app';

export default defineConfig([
  {
    name: 'google/ignores',
    ignores: ['dist/**', 'coverage/**', '.angular/**'],
  },

  // ---------------------------------------------------------------------------------------------
  // 1. TypeScript: Google TypeScript Style Guide (google.github.io/styleguide/tsguide.html)
  // ---------------------------------------------------------------------------------------------
  {
    name: 'google/typescript',
    files: ['**/*.ts', '**/*.tsx'],
    extends: [eslint.configs.recommended, tseslint.configs.recommended, tseslint.configs.stylistic],
    languageOptions: {
      parserOptions: {
        // Типизированный линтинг: нужен правилу @typescript-eslint/no-floating-promises.
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // --- Как в gts 7.0.0 ---
      'block-scoped-var': 'error',
      'no-var': 'error', // G-TS-006, tsguide #use-const-and-let
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'no-restricted-properties': [
        'error',
        {object: 'describe', property: 'only'},
        {object: 'it', property: 'only'},
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-empty-function': 'off', // включено в stylistic; gts выключает

      // --- Отличия от gts: здесь профиль следует тексту гайда, а не инструменту ---
      // G-TS-007, tsguide #equality-checks: `== null` разрешено; в gts - 'error' без исключения.
      eqeqeq: ['error', 'always', {null: 'ignore'}],
      // G-TS-010, tsguide #ts-ignore: «must not»; в gts - 'warn'.
      '@typescript-eslint/ban-ts-comment': 'error',
      // tsguide #arrayt-type; в gts добавлено после релиза 7.0.0 (коммит bd623c0, 2026-01-16).
      '@typescript-eslint/array-type': ['error', {default: 'array-simple'}],
      // tsguide #indexable-key-string-type записывает индексные сигнатуры как {[key: string]: T};
      // пресет stylistic требовал бы Record<string, T>.
      '@typescript-eslint/consistent-indexed-object-style': 'off',

      // --- Дополнения профиля: правила гайда, которых нет в gts (не Google-конфиг) ---
      // tsguide #prefer-interfaces
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      // tsguide #visibility: модификатор public не пишется (кроме не-readonly свойств-параметров).
      '@typescript-eslint/explicit-member-accessibility': ['error', {accessibility: 'no-public'}],
      '@typescript-eslint/naming-convention': [
        'error',
        // G-TS-008, tsguide #naming-rules-by-identifier-type: UpperCamelCase для классов,
        // интерфейсов, типов, enum и параметров типов.
        {selector: 'typeLike', format: ['PascalCase']},
        // G-TS-009, tsguide #naming-style: интерфейс не помечается префиксом I.
        {selector: 'interface', format: ['PascalCase'], custom: {regex: '^I[A-Z]', match: false}},
        // G-TS-009, tsguide #identifiers-underscore-prefix-suffix: «_» не ставят ни в начало,
        // ни в конец имени.
        {
          selector: ['variableLike', 'memberLike'],
          format: null,
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          // G-TS-004, tsguide #exports. Если инструмент требует default-экспорт (например, файл для
          // React.lazy), отключите правило для такого файла отдельным блоком с `files`.
          selector: 'ExportDefaultDeclaration',
          message: 'Используйте именованные экспорты (Google TypeScript Style Guide, #exports).',
        },
        {
          // tsguide #enums
          selector: 'TSEnumDeclaration[const=true]',
          message: 'const enum запрещён (Google TypeScript Style Guide, #enums).',
        },
        {
          // G-TS-009, tsguide #private-fields
          // Любой член класса, чьё имя - #идентификатор (поле, метод, accessor).
          selector: 'ClassBody > * > PrivateIdentifier.key',
          message:
            'Вместо #private пишите private (Google TypeScript Style Guide, #private-fields).',
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------------------------
  // 2. Angular: классы компонентов, директив и сервисов (angular.dev/style-guide, редакция 2025)
  // ---------------------------------------------------------------------------------------------
  {
    name: 'google/angular',
    files: ['**/*.ts'],
    // tsRecommended включает как error: prefer-inject (G-NG-013), prefer-standalone (G-NG-029),
    // prefer-on-push-component-change-detection (G-NG-031), no-input-rename (G-NG-017),
    // no-output-on-prefix, no-output-native, no-output-rename (G-NG-018) и др.
    extends: [angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      // G-NG-014, G-NG-015
      '@angular-eslint/component-selector': [
        'error',
        {type: 'element', prefix: SELECTOR_PREFIX, style: 'kebab-case'},
      ],
      // G-NG-016, G-NG-015
      '@angular-eslint/directive-selector': [
        'error',
        {type: 'attribute', prefix: SELECTOR_PREFIX, style: 'camelCase'},
      ],
      // G-NG-019 (частично: только вызовы inject())
      '@angular-eslint/inject-at-top': 'error',
      // G-NG-023, G-NG-032
      '@angular-eslint/prefer-output-readonly': 'error',
      '@angular-eslint/prefer-signals': 'error',
      // G-NG-027; в tsRecommended - warn
      '@angular-eslint/use-lifecycle-interface': 'error',
      // G-NG-028
      '@angular-eslint/prefer-host-metadata-property': 'error',
      // Намеренно НЕ включены: component-class-suffix и directive-class-suffix - с v20 команда
      // Angular суффиксы не рекомендует (G-NG-004).
    },
  },

  // ---------------------------------------------------------------------------------------------
  // 3. Angular: шаблоны (отдельные *.html и встроенные, извлечённые процессором)
  // ---------------------------------------------------------------------------------------------
  {
    name: 'google/angular-templates',
    files: ['**/*.html'],
    // templateRecommended включает prefer-control-flow (G-NG-030), banana-in-box, eqeqeq,
    // no-negated-async. templateAccessibility - как в генераторе `ng add angular-eslint`;
    // частично покрывает G-CSS-007 (альтернативный текст).
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      // G-NG-024
      '@angular-eslint/template/prefer-class-binding': 'error',
      '@angular-eslint/template/prefer-style-binding': 'error',
      // G-NG-021. Порог 5 - значение правила по умолчанию; гайд числа не задаёт, поэтому warn.
      '@angular-eslint/template/conditional-complexity': ['warn', {maxComplexity: 5}],
    },
  },

  // ---------------------------------------------------------------------------------------------
  // 4. React: Rules of React (react.dev) - НЕ Google
  // ---------------------------------------------------------------------------------------------
  {
    name: 'not-google/react',
    // Компоненты и файлы пользовательских хуков (use-thing.ts, useThing.ts).
    files: ['**/*.tsx', '**/use-*.ts', '**/use[A-Z]*.ts'],
    // rules-of-hooks (error), exhaustive-deps (warn) и правила React Compiler:
    // G-REACT-001 … G-REACT-011.
    extends: [reactHooks.configs.flat.recommended],
  },
]);
