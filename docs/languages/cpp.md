# Профиль Google · C++

> Данные актуальны на 2026-10-09.

Профиль повторяет публичный [Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html) в редакции от 2026-09-29: C++20 без возможностей C++23, без исключений, 80 колонок, отступ 2 пробела, `PascalCase` для типов и функций, `snake_case` для переменных, `kMixedCase` для констант, завершающий `_` у полей класса. Форматирование целиком отдано clang-format (`BasedOnStyle: Google` с явным `PointerAlignment: Left`), часть языковых запретов закрывают clang-tidy (`google-*` и `readability-identifier-naming`) и флаги компилятора. cpplint Google публично не сопровождает с 2024-07-08, поэтому в профиле это необязательное дополнение из форка сообщества. Из 73 правил инструмент целиком проверяет 19, частично - 34, только на ревью остаются 20.

## Как читать документ

- **Источник истины - текст гайда**, а не конфиги. Конфиги в [`../../configs/cpp/`](../../configs/cpp/) - приближение; известные расхождения собраны в [разделе 9.6](#96-известные-расхождения-гайда-и-инструментов).
- **Редакция.** Гайд читался из `google/styleguide`, ветка `gh-pages`, файл `cppguide.html`, последнее содержательное изменение - коммит `428b08a` от 2026-09-29. Текст гайда распространяется по лицензии CC-BY 3.0; правила ниже пересказаны, дословные фрагменты перечислены в [`NOTICE.md`](../../NOTICE.md) профиля.
- **MUST и SHOULD.** Гайд формально объявляет обязательными все свои соглашения ([Exceptions to the Rules](https://google.github.io/styleguide/cppguide.html#Exceptions_to_the_Rules)) и не использует RFC 2119. В профиле `MUST` стоит там, где формулировка раздела - «must», «never», «do not», «forbidden», «banned», либо где правило навязывает форматтер пресета; `SHOULD` - где гайд пишет «should», «prefer», «avoid». Это наша разметка по модальности текста.
- **Проверка.** Названы реальные опции и проверки: clang-format 18.1.3, clang-tidy 18.1.3 (обе проверены локально), cpplint 2.0.2 (форк сообщества, локально не запускался), предупреждения clang++ 18.1.3. Пометка «с 22.1.0» означает, что проверки нет в clang-tidy 18.
- **Чего здесь нет.** Документ не пересказывает гайд целиком: выбраны ключевые и неочевидные правила. Остальное (локальные переменные, `friend`, structured bindings, раскладка лямбд и списков инициализации) - в [полном тексте гайда](https://google.github.io/styleguide/cppguide.html).
- **Существующий код.** Если код написан в другом стиле, гайд разрешает оставаться согласованным с его локальными соглашениями ([Existing Non-conformant Code](https://google.github.io/styleguide/cppguide.html#Existing_Non-conformant_Code)).

## 1. Форматирование

В профиле форматирование не обсуждается на ревью: его выдаёт clang-format с пресетом `Google`. Гайд упоминает clang-format один раз (раздел Line Length), но все репозитории Google из выборки, где есть `.clang-format`, наследуют именно этот пресет (5 из 6 C++-репозиториев; подробности - в [`research/google.md`](../../research/google.md)).

### G-CPP-001 · MUST · Строка не длиннее 80 символов; исключения - нерасщепляемый комментарий (URL, команда), нерасщепляемый строковый литерал, `#include`, header guard и using-декларация
- Проверка: clang-format `ColumnLimit: 80` (значение пресета Google); cpplint `whitespace/line_length`.
- Источник: [C++ Style Guide - Line Length](https://google.github.io/styleguide/cppguide.html#Line_Length) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-002 · MUST · Отступы только пробелами, по 2 пробела на уровень; табуляция запрещена
- Проверка: clang-format `UseTab: Never`, `IndentWidth: 2`; cpplint `whitespace/tab`.
- Источник: [C++ Style Guide - Spaces vs. Tabs](https://google.github.io/styleguide/cppguide.html#Spaces_vs._Tabs) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-003 · MUST · Раскладку объявлений задаёт форматтер: перенос аргументов - выравнивание по скобке или отступ 4; `public:`/`private:` - с отступом в 1 пробел; содержимое namespace и директивы препроцессора - без отступа; перед концевым комментарием - 2 пробела
- Проверка: clang-format, пресет Google: `ContinuationIndentWidth: 4`, `AccessModifierOffset: -1`, `BinPackArguments: true`, `BinPackParameters: true`, `BreakConstructorInitializers: BeforeColon`, `NamespaceIndentation: None`, `IndentPPDirectives: None`, `SpacesBeforeTrailingComments: 2`, `MaxEmptyLinesToKeep: 1`; cpplint `whitespace/indent`, `whitespace/comments`.
- Источник: [C++ Style Guide - Formatting](https://google.github.io/styleguide/cppguide.html#Formatting) (подразделы [Function Calls](https://google.github.io/styleguide/cppguide.html#Function_Calls), [Class Format](https://google.github.io/styleguide/cppguide.html#Class_Format), [Constructor Initializer Lists](https://google.github.io/styleguide/cppguide.html#Constructor_Initializer_Lists), [Namespace Formatting](https://google.github.io/styleguide/cppguide.html#Namespace_Formatting); редакция 2026-09-29, правило о вертикальных пробелах упрощено 2025-07-31, `c6f57a9`) · официальный гайд · высокая.
- Пример:

```cpp
// хорошо: так раскладывает пресет Google
namespace myproject {

class UrlTable : public Table {
 public:
  explicit UrlTable(std::string_view name) : name_(name), num_entries_(0) {}

  UrlTableError AddUrl(std::string_view url, const AddOptions& options,
                       int* num_duplicates);

 private:
  std::string name_;
  int num_entries_;  // Два пробела перед концевым комментарием.
};

}  // namespace myproject
```

### G-CPP-004 · MUST · `*` и `&` прижаты к типу (`char* c`, `const std::string& s`); в одном объявлении нельзя объявлять несколько имён, если хотя бы одно из них - указатель или ссылка
- Проверка: clang-format `PointerAlignment: Left` вместе с `DerivePointerAlignment: false` (в пресете Google до clang-format 20 включительно стоит `DerivePointerAlignment: true`); clang-tidy `readability-isolate-declaration`.
- Источник: [C++ Style Guide - Pointer and Reference Expressions and Types](https://google.github.io/styleguide/cppguide.html#Pointer_and_Reference_Expressions) (редакция 2026-09-29; запрет пробела перед `*` и `&` введён 2025-07-31, `c6f57a9`) · официальный гайд · высокая.
- Пример:

```cpp
// плохо
int *x;
char * c;
int x, *y;

// хорошо
int* x;
char* c;
int x;
int* y;
```

### G-CPP-005 · MUST · Тело `if`, `else`, `for`, `while`, `do` заключается в фигурные скобки; `else` - на строке с `}`; однострочная форма без скобок разрешена, но не поощряется, а для `if…else` и `do…while` недопустима
- Проверка: clang-tidy `google-readability-braces-around-statements` (умолчание семейства `ShortStatementLines: 1`: срабатывает, когда тело без скобок стоит на отдельной строке, то есть строже гайда - тот двухстрочную форму ещё допускает), `bugprone-suspicious-semicolon`; cpplint `readability/braces`, `whitespace/empty_loop_body`; clang-format `InsertBraces: true` расставляет скобки сам (в конфиге профиля опция выключена, см. комментарий в `.clang-format`).
- Источник: [C++ Style Guide - Looping and Branching Statements](https://google.github.io/styleguide/cppguide.html#Formatting_Looping_Branching) (редакция 2026-09-29; формулировка «разрешено, но не поощряется» - 2026-05-07, `1809c76`) · официальный гайд · высокая.
- Пример:

```cpp
// плохо
if (x) DoThis(); else DoThat();
while (condition);

// допустимо, но не поощряется
if (x == kFoo) return new Foo();

// хорошо
if (x == kFoo) {
  return new Foo();
}
while (condition) {
}
```

### G-CPP-006 · MUST · Логические и побитовые операторы пишутся знаками (`&&`, `||`, `~`), а не словами (`and`, `or`, `compl`); длинное булево выражение переносится единообразно; выражение в `return` не оборачивается в скобки без необходимости
- Проверка: частично: clang-tidy `readability-operators-representation` (с опциями `BinaryOperators` и `OverloadedOperators` из конфига профиля), cpplint `readability/alt_tokens`, clang-format `BreakBeforeBinaryOperators: None` (оператор остаётся в конце строки); лишние скобки в `return` - ручное ревью.
- Источник: [C++ Style Guide - Boolean Expressions](https://google.github.io/styleguide/cppguide.html#Boolean_Expressions); [Return Values](https://google.github.io/styleguide/cppguide.html#Return_Values) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-007 · SHOULD · У литерала с плавающей точкой есть точка и цифры по обе стороны от неё: `1.0f`, `1248.0e6`, а не `1.f` и `1248e6`
- Проверка: ручное ревью (clang-format 18.1.3 такие литералы не исправляет - проверено локально).
- Источник: [C++ Style Guide - Floating-point Literals](https://google.github.io/styleguide/cppguide.html#Floating_Literals) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-008 · MUST · Не-ASCII-символы в исходниках редки и записаны только в UTF-8; префикс `u8` и типы `char16_t`, `char32_t`, `wchar_t` не используются (кроме вызовов Windows API)
- Проверка: частично: cpplint `readability/utf8` (некорректный UTF-8); остальное - ручное ревью.
- Источник: [C++ Style Guide - Non-ASCII Characters](https://google.github.io/styleguide/cppguide.html#Non-ASCII_Characters) (редакция 2026-09-29) · официальный гайд · высокая. Уровень: требование UTF-8 в гайде «must», отказ от `u8` и широких типов - «should».

## 2. Именование

Сводка (подробности и проверки - в правилах ниже):

| Сущность | Стиль | Пример |
|---|---|---|
| Тип: класс, структура, алиас, enum, концепт, типовой параметр шаблона | `PascalCase` | `UrlTable`, `PropertiesMap` |
| Функция, метод | `PascalCase` | `AddTableEntry()` |
| Аксессор и мутатор | можно `snake_case` | `count()`, `set_count(int)` |
| Переменная, параметр | `snake_case` | `table_name` |
| Поле класса | `snake_case_` с завершающим `_` | `table_name_` |
| Поле структуры | `snake_case` без `_` | `num_entries` |
| Константа со статическим временем жизни, перечислитель | `kMixedCase` | `kDaysInAWeek`, `kOutOfMemory` |
| Пространство имён | `snake_case` | `myproject::internal` |
| Макрос | `ALL_CAPS` с префиксом проекта | `MYPROJECT_ROUND(x)` |
| Файл | строчные буквы, `_` или `-` | `url_table.h`, `url_table_test.cc` |
| Каталог | отдельного правила нет; обычно совпадает с именем namespace | `myproject/` |

### G-CPP-009 · SHOULD · Имя понятно читателю из другой команды; чем шире область видимости, тем описательнее имя; слова не сокращаются выбрасыванием букв, а аббревиатура пишется как одно слово (`StartRpc()`, не `StartRPC()`)
- Проверка: ручное ревью.
- Источник: [C++ Style Guide - Choosing Names](https://google.github.io/styleguide/cppguide.html#General_Naming_Rules) (редакция 2026-09-29; раздел расширен 2025-04-10, `445123e`) · официальный гайд · высокая.

### G-CPP-010 · SHOULD · Имена файлов - строчными буквами, слова разделяются `_` (предпочтительно) или `-`; исходники - `.cc`, заголовки - `.h`, файлы для текстового включения - `.inc`; имя не совпадает с файлами из `/usr/include`
- Проверка: ручное ревью (при желании - скрипт в CI: `git ls-files '*.cc' '*.h' | grep -E '[A-Z ]'`).
- Источник: [C++ Style Guide - File Names](https://google.github.io/styleguide/cppguide.html#File_Names); о каталогах - [Namespace Names](https://google.github.io/styleguide/cppguide.html#Namespace_Names) (редакция 2026-09-29) · официальный гайд · высокая. Для имён каталогов отдельного правила в гайде нет: сказано лишь, что код namespace обычно лежит в каталогах с тем же именем, а пути в `#include` пишутся от корня проекта.

### G-CPP-011 · MUST · Типы - классы, структуры, алиасы, перечисления, типовые параметры шаблона - и концепты именуются в `PascalCase` без подчёркиваний
- Проверка: clang-tidy `readability-identifier-naming`: `ClassCase`, `StructCase`, `UnionCase`, `EnumCase`, `TypeAliasCase`, `TypedefCase`, `ConceptCase`, `TypeTemplateParameterCase` = `CamelCase`.
- Источник: [C++ Style Guide - Type Names](https://google.github.io/styleguide/cppguide.html#Type_Names); [Concept Names](https://google.github.io/styleguide/cppguide.html#Concept_Names) (редакция 2026-09-29; имена концептов - 2024-02-12, `1932017`) · официальный гайд · высокая.

### G-CPP-012 · MUST · Переменные и параметры - `snake_case`; поля класса дополнительно оканчиваются на `_` (`table_name_`), поля структуры - нет (`num_entries`)
- Проверка: частично: clang-tidy `readability-identifier-naming`: `VariableCase`, `ParameterCase`, `PublicMemberCase`, `PrivateMemberCase`, `ProtectedMemberCase` = `lower_case`, `PrivateMemberSuffix`, `ProtectedMemberSuffix`, `ClassMemberSuffix` = `_` (инструмент различает не `struct` и `class`, а открытые и закрытые поля); остальное - ручное ревью.
- Источник: [C++ Style Guide - Variable Names](https://google.github.io/styleguide/cppguide.html#Variable_Names) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-013 · MUST · Константы со статическим временем жизни (`constexpr` или `const` с неизменным на всю программу значением) и перечислители именуются `kMixedCase`, а не `MACRO_STYLE`; для локальных констант префикс `k` необязателен
- Проверка: clang-tidy `readability-identifier-naming`: `GlobalConstantCase`, `ClassConstantCase`, `StaticConstantCase`, `EnumConstantCase`, `ScopedEnumConstantCase` = `CamelCase` с соответствующими `…Prefix: k`; `LocalConstantCase: aNy_CasE`.
- Источник: [C++ Style Guide - Constant Names](https://google.github.io/styleguide/cppguide.html#Constant_Names); [Enumerator Names](https://google.github.io/styleguide/cppguide.html#Enumerator_Names) (редакция 2026-09-29; уточнения 2025-04-10, `445123e`) · официальный гайд · высокая.
- Пример:

```cpp
// плохо
const int DAYS_IN_A_WEEK = 7;
enum class UrlTableError { OK, OUT_OF_MEMORY };

// хорошо
const int kDaysInAWeek = 7;
enum class UrlTableError { kOk = 0, kOutOfMemory };

void PrintReport(std::string_view title) {
  const int width = 72;  // Локальная константа: префикс `k` по желанию.
}
```

### G-CPP-014 · MUST · Функции и методы именуются в `PascalCase` (`AddTableEntry()`); аксессоры и мутаторы можно называть как переменные (`count()`, `set_count(int)`)
- Проверка: частично: clang-tidy `readability-identifier-naming`: `FunctionCase: CamelCase`, `MethodCase: CamelCase` с `MethodIgnoredRegexp` для `snake_case` (отклоняет `getSize()` и `Parse_One()`, но не может проверить, что `snake_case`-метод действительно аксессор); остальное - ручное ревью.
- Источник: [C++ Style Guide - Function Names](https://google.github.io/styleguide/cppguide.html#Function_Names) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-015 · MUST · Пространства имён - `snake_case`; имя верхнего уровня уникально и образовано от имени проекта или команды; вложенные namespace не повторяют известные верхнеуровневые имена (`std`, `absl`)
- Проверка: частично: clang-tidy `readability-identifier-naming.NamespaceCase: lower_case`; уникальность и совпадения с известными именами - ручное ревью.
- Источник: [C++ Style Guide - Namespace Names](https://google.github.io/styleguide/cppguide.html#Namespace_Names) (редакция 2026-09-29; правило о вложенных именах - 2025-04-10, `445123e`) · официальный гайд · высокая.

### G-CPP-016 · MUST · Макрос, если без него не обойтись, именуется заглавными буквами с подчёркиваниями и с префиксом проекта: `MYPROJECT_ROUND(x)`
- Проверка: частично: clang-tidy `readability-identifier-naming.MacroDefinitionCase: UPPER_CASE` (в конфиге профиля - с исключением для header guard); наличие префикса проекта - ручное ревью.
- Источник: [C++ Style Guide - Macro Names](https://google.github.io/styleguide/cppguide.html#Macro_Names) (редакция 2026-09-29; обязательный префикс проекта - 2023-03-22, `f1dbcc3`) · официальный гайд · высокая.

### G-CPP-017 · SHOULD · Параметр шаблона именуется по правилам своей категории (типовой - как тип, нетиповой - как переменная или константа); сущность, которая повторяет существующую сущность C, C++ или STL, может следовать её стилю (`sparse_hash_map`, `LONGLONG_MAX`)
- Проверка: частично: clang-tidy `readability-identifier-naming.TypeTemplateParameterCase`, `TemplateTemplateParameterCase` = `CamelCase`; исключения для аналогов STL инструмент не распознаёт (нужен `// NOLINT(readability-identifier-naming)`) - ручное ревью.
- Источник: [C++ Style Guide - Template Parameter Names](https://google.github.io/styleguide/cppguide.html#Template_Parameter_Names); [Exceptions to Naming Rules](https://google.github.io/styleguide/cppguide.html#Exceptions_to_Naming_Rules) (редакция 2026-09-29; исключение для Rust interop - 2025-11-13, `c885dc2`) · официальный гайд · высокая.

## 3. Структура файлов и порядок include

### G-CPP-018 · SHOULD · У каждого `.cc` есть парный `.h` (кроме тестов и файла с `main()`); каждый заголовок самодостаточен - компилируется сам по себе; вынос определений в `-inl.h` запрещён
- Проверка: частично: cpplint `build/include` (в `.cc` не подключён собственный заголовок); самодостаточность - отдельная цель сборки, компилирующая каждый заголовок поодиночке; остальное - ручное ревью.
- Источник: [C++ Style Guide - Header Files](https://google.github.io/styleguide/cppguide.html#Header_Files); [Self-contained Headers](https://google.github.io/styleguide/cppguide.html#Self_contained_Headers) (редакция 2026-09-29) · официальный гайд · высокая. Уровень: общая формулировка - «should», но о `-inl.h` сказано «no longer allowed».

### G-CPP-019 · MUST · Заголовок защищён `#define`-guard вида `<PROJECT>_<PATH>_<FILE>_H_`, построенным от полного пути файла в дереве проекта; `#pragma once` не используется
- Проверка: частично: cpplint `build/header_guard` проверяет имя и наличие guard, но форк сообщества принимает и `#pragma once`; запрет `#pragma once` - `grep -rn '#pragma once'` в CI или ручное ревью.
- Источник: [C++ Style Guide - The #define Guard](https://google.github.io/styleguide/cppguide.html#The__define_Guard); [Windows Code](https://google.github.io/styleguide/cppguide.html#Windows_Code) (редакция 2026-09-29) · официальный гайд · высокая. Уровень: о guard сказано «should», запрет `#pragma once` - «do not use».
- Пример:

```cpp
// плохо
#pragma once

// хорошо: файл foo/src/bar/baz.h проекта foo
#ifndef FOO_BAR_BAZ_H_
#define FOO_BAR_BAZ_H_

// ...

#endif  // FOO_BAR_BAZ_H_
```

### G-CPP-020 · MUST · Include what you use: файл подключает заголовок для каждого символа, который использует, и не полагается на транзитивные включения - даже `foo.cc` подключает `bar.h`, если использует его символы, хотя `foo.h` его уже подключил
- Проверка: частично: cpplint `build/include_what_you_use` (только часть стандартной библиотеки); clang-tidy `misc-include-cleaner` (не из семейства google; в конфиг профиля не включена, google-cloud-cpp её отключает); остальное - ручное ревью.
- Источник: [C++ Style Guide - Include What You Use](https://google.github.io/styleguide/cppguide.html#Include_What_You_Use) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-021 · MUST · Сущности, которыми проект не владеет, нельзя объявлять вперёд (forward declaration) - подключается их заголовок; для собственных сущностей объявление вперёд - крайняя мера; в `namespace std` ничего не объявляется
- Проверка: частично: clang-tidy `cert-dcl58-cpp` (объявления в `namespace std`), `abseil-no-namespace` (объявления в `namespace absl`); cpplint `build/forward_decl` (только объявления вида `class Foo::Bar;`); остальное - ручное ревью.
- Источник: [C++ Style Guide - Forward Declarations](https://google.github.io/styleguide/cppguide.html#Forward_Declarations) (редакция 2026-09-29; запрет для чужих сущностей - 2026-05-01, `3c5c895`) · официальный гайд · высокая.
- Пример:

```cpp
// плохо: объявление вперёд сущности чужой библиотеки
namespace absl {
class Status;
}

// хорошо
#include "absl/status/status.h"
```

### G-CPP-022 · MUST · Порядок `#include`: парный заголовок → системные заголовки и `<*.h>` языка C → стандартная библиотека C++ → другие библиотеки → заголовки проекта; группы разделены пустой строкой и отсортированы по алфавиту; пути - от корня проекта, без `.` и `..`
- Проверка: clang-format `IncludeBlocks: Regroup`, `IncludeCategories`, `SortIncludes: CaseSensitive` (пресет Google; две последние группы он сливает в одну - см. комментарий в `.clang-format`); cpplint `build/include_order`, `build/include_subdir`.
- Источник: [C++ Style Guide - Names and Order of Includes](https://google.github.io/styleguide/cppguide.html#Names_and_Order_of_Includes) (редакция 2026-09-29; правило об угловых скобках - 2024-02-12, `1932017`) · официальный гайд · высокая. Уровень: об алфавитном порядке в гайде сказано «should», в профиле MUST - порядок навязывает форматтер пресета.
- Пример:

```cpp
// хорошо: файл myproject/server/url_table.cc
#include "myproject/server/url_table.h"

#include <sys/types.h>
#include <unistd.h>

#include <string>
#include <vector>

#include "absl/strings/str_cat.h"
#include "myproject/base/logging.h"

// Угловые скобки - только там, где их требует библиотека: стандартная,
// системная, в редких случаях сторонняя (<Python.h>).
```

### G-CPP-023 · MUST · Функция определяется в заголовке рядом с объявлением, только если она короткая (ориентир - до 10 строк); любое определение в заголовке ODR-безопасно: `inline`, шаблон или тело внутри класса
- Проверка: частично: clang-tidy `misc-definitions-in-headers` (не из семейства google; ловит только нарушения ODR); длина тела - ручное ревью.
- Источник: [C++ Style Guide - Defining Functions in Header Files](https://google.github.io/styleguide/cppguide.html#Defining_Functions_in_Header_Files) (редакция 2026-09-29; раздел расширен 2025-04-10, `445123e`) · официальный гайд · высокая.

### G-CPP-024 · MUST · Код лежит в пространстве имён проекта; `using namespace foo;` запрещён; inline-namespace запрещены; многострочный namespace закрывается комментарием `}  // namespace foo`; вложенные namespace в новом коде пишутся одной строкой (`namespace a::b {`)
- Проверка: частично: clang-tidy `google-build-using-namespace`, `google-global-names-in-headers`, `google-readability-namespace-comments`; clang-format `FixNamespaceComments: true`; cpplint `build/namespaces`, `readability/namespace`; inline-namespace - ручное ревью.
- Источник: [C++ Style Guide - Namespaces](https://google.github.io/styleguide/cppguide.html#Namespaces) (редакция 2026-09-29; однострочные вложенные namespace - 2023-10-12, `901474a`; `internal`-namespace с именем файла - 2025-04-10, `445123e`) · официальный гайд · высокая.

### G-CPP-025 · MUST · В заголовках нет ни безымянных namespace, ни `static`-сущностей с внутренним связыванием; в `.cc` всё, что не нужно снаружи, наоборот, прячется в безымянный namespace или объявляется `static`
- Проверка: частично: clang-tidy `google-build-namespaces` (безымянный namespace в заголовке; с 22.1.0 - алиас `misc-anonymous-namespace-in-header`); cpplint `build/namespaces_headers`; сокрытие в `.cc` - ручное ревью.
- Источник: [C++ Style Guide - Internal Linkage](https://google.github.io/styleguide/cppguide.html#Internal_Linkage) (редакция 2026-09-29) · официальный гайд · высокая. Уровень: запрет для заголовков - «do not», сокрытие в `.cc` - «encouraged».

### G-CPP-026 · MUST · Поля класса - `private` (кроме констант); секции идут в порядке `public` → `protected` → `private`, а внутри секции: типы и алиасы, статические константы, фабричные функции, конструкторы и присваивания, деструктор, остальные функции, поля
- Проверка: ручное ревью (clang-tidy `misc-non-private-member-variables-in-classes` - приближение для первой части, в конфиг не включена: срабатывает на `protected`-полях тестовых фикстур, которые гайд разрешает; порядок объявлений инструмент не проверяет).
- Источник: [C++ Style Guide - Access Control](https://google.github.io/styleguide/cppguide.html#Access_Control); [Declaration Order](https://google.github.io/styleguide/cppguide.html#Declaration_Order) (редакция 2026-09-29) · официальный гайд · высокая. Уровень: о порядке объявлений в гайде сказано «prefer».

### G-CPP-027 · SHOULD · Свободная функция живёт в пространстве имён, а не в глобальной области; класс, состоящий только из статических методов, не создаётся ради группировки функций
- Проверка: ручное ревью.
- Источник: [C++ Style Guide - Nonmember, Static Member, and Global Functions](https://google.github.io/styleguide/cppguide.html#Nonmember,_Static_Member,_and_Global_Functions) (редакция 2026-09-29, раздел переформулирован тем же коммитом `428b08a`) · официальный гайд · высокая.

### G-CPP-028 · SHOULD · Функции короткие и решают одну задачу; около 40 строк - повод подумать о разбиении (жёсткого предела нет)
- Проверка: частично: clang-tidy `google-readability-function-size` (умолчание семейства `StatementThreshold: 800` - страховка от гигантских функций, а не проверка ориентира в 40 строк); cpplint `readability/fn_size` (по умолчанию выключена); остальное - ручное ревью.
- Источник: [C++ Style Guide - Write Short Functions](https://google.github.io/styleguide/cppguide.html#Write_Short_Functions) (редакция 2026-09-29) · официальный гайд · высокая.

## 4. Комментарии и документирование

Формата вроде Doxygen гайд не предписывает: комментарии - обычный текст в `//`. Что документировать, сказано подробно; ниже - ключевое.

### G-CPP-029 · SHOULD · Каждый файл начинается с лицензионного заголовка; комментарии пишутся в одном стиле (`//` - обычный выбор, `/* */` допустим); файловый комментарий нужен, если файл объявляет несколько связанных абстракций
- Проверка: частично: cpplint `legal/copyright` (ищет строку `Copyright [year] <Copyright Owner>`); наличие заголовка лицензии - `addlicense -check` (см. [`../git/repository.md`](../git/repository.md)); остальное - ручное ревью.
- Источник: [C++ Style Guide - Comment Style](https://google.github.io/styleguide/cppguide.html#Comment_Style); [File Comments](https://google.github.io/styleguide/cppguide.html#File_Comments) (редакция 2026-09-29; файловые комментарии уточнены 2023-08-22, `d8cee70`) · официальный гайд · высокая.

### G-CPP-030 · SHOULD · У каждого неочевидного класса и почти у каждого объявления функции есть комментарий: что это и как этим пользоваться (для функции - глагол в третьем лице: «Opens the file»); у переопределения описываются только отличия; комментарий у определения объясняет «как»
- Проверка: ручное ревью.
- Источник: [C++ Style Guide - Struct and Class Comments](https://google.github.io/styleguide/cppguide.html#Class_Comments); [Function Comments](https://google.github.io/styleguide/cppguide.html#Function_Comments); [Implementation Comments](https://google.github.io/styleguide/cppguide.html#Implementation_Comments) (редакция 2026-09-29) · официальный гайд · высокая.
- Пример:

```cpp
// плохо: пересказывает имя и ничего не говорит о контракте
// Finds the user.
const User* FindUser(std::string_view login) const;

// хорошо
// Returns the user registered under `login`, or nullptr if there is none.
// The pointer stays valid until the next call to AddUser() or RemoveUser().
// Lookup is case-insensitive.
const User* FindUser(std::string_view login) const;
```

### G-CPP-031 · SHOULD · Неочевидный аргумент вызова заменяется именованной константой, перечислением вместо `bool` или структурой опций; в крайнем случае ставится комментарий `/*name=*/value`; имя неиспользуемого параметра в определении закомментировано: `double /*radians*/`
- Проверка: частично: clang-tidy `bugprone-argument-comment` (не из семейства google; сверяет имя в `/*name=*/` с именем параметра); остальное - ручное ревью.
- Источник: [C++ Style Guide - Function Argument Comments](https://google.github.io/styleguide/cppguide.html#Function_Argument_Comments); [Function Declarations and Definitions](https://google.github.io/styleguide/cppguide.html#Function_Declarations_and_Definitions) (редакция 2026-09-29) · официальный гайд · высокая.
- Пример:

```cpp
// плохо: что означают 3, true и nullptr?
Thumbnail thumbnail = RenderThumbnail(image, 3, true, nullptr);

// хорошо
RenderOptions options;
options.scale_factor = 3;
options.color_mode = ColorMode::kGrayscale;
Thumbnail thumbnail =
    RenderThumbnail(image, options, /*progress_callback=*/nullptr);

// хорошо: имя неиспользуемого параметра закомментировано
void Circle::Rotate(double /*radians*/) {}
```

### G-CPP-032 · MUST · TODO пишется как `// TODO(<контекст>): <текст>`, где контекст - номер бага, ссылка, имя или e-mail того, кто знает подробности; для отложенных дел указывается конкретная дата или событие
- Проверка: частично: clang-tidy `google-readability-todo` (в 18.1.3 требует скобочную форму; с 22.1.0 принимает и `TODO: ссылка - текст`); cpplint `readability/todo`, `whitespace/todo`; дата или событие - ручное ревью.
- Источник: [C++ Style Guide - TODO Comments](https://google.github.io/styleguide/cppguide.html#TODO_Comments) (редакция 2026-09-29) · официальный гайд · средняя. Формулировка нестабильна: с 2023-08-22 (`d8cee70`) по 2026-09-29 предпочтительной была форма `// TODO: bug 12345678 - текст`; коммит `428b08a` вернул скобочные примеры без упоминания в описании коммита (см. [раздел 9.6](#96-известные-расхождения-гайда-и-инструментов)).
- Пример:

```cpp
// плохо
// TODO: fix this later
// todo(bug 12345) fix

// хорошо
// TODO(bug 12345): Remove the fallback when all clients send UTF-8.
// TODO(example.com/my-design-doc): Switch to the new index by 2027-03-01.
```

### G-CPP-033 · MUST · В именах, комментариях и документации используется инклюзивный язык: без `master`/`slave`, `blacklist`/`whitelist`, `redline`; формулировки гендерно-нейтральны
- Проверка: ручное ревью.
- Источник: [C++ Style Guide - Inclusive Language](https://google.github.io/styleguide/cppguide.html#Inclusive_Language) (редакция 2026-09-29; раздел существует с 2020-09-25) · официальный гайд · высокая.

## 5. Обработка ошибок, логирование, типы

### 5.1. Ошибки

Запрет исключений - самое известное отличие гайда от норм сообщества. Гайд объясняет его практикой, а не принципом: существующий код Google не рассчитан на исключения, перевод его обошёлся бы слишком дорого, а открытым проектам Google исключения не рекомендуются, чтобы их можно было использовать внутри компании. Там же сказано, что при старте с нуля решение, вероятно, было бы другим.

### G-CPP-034 · MUST · Исключения C++ не используются - ни `throw`/`try`/`catch`, ни `std::exception_ptr` и `std::nested_exception`; на Windows их допустимо включить в компиляторе, только если без этого не собирается стандартная библиотека
- Проверка: компилятор `-fno-exceptions` (clang++ 18.1.3: `try` при этом флаге - ошибка компиляции); проверки `throw` для C++ в семействе `google-*` нет (`google-objc-avoid-throwing-exception` - только Objective-C).
- Источник: [C++ Style Guide - Exceptions](https://google.github.io/styleguide/cppguide.html#Exceptions); [Windows Code](https://google.github.io/styleguide/cppguide.html#Windows_Code) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-035 · SHOULD · Функция, которая может завершиться восстановимой ошибкой, возвращает `absl::Status` или `absl::StatusOr<T>`; успех проверяется через `ok()`; возвращённый статус нельзя игнорировать; перебирать все канонические коды ошибок не нужно
- Проверка: частично: компилятор `-Wunused-result` (тип `absl::Status` объявлен с `ABSL_MUST_USE_RESULT`, то есть `[[nodiscard]]`; предупреждение включено по умолчанию); clang-tidy `abseil-unchecked-statusor-access` - только с 22.1.0; остальное - ручное ревью.
- Источник: [Abseil - Status User Guide](https://abseil.io/docs/cpp/guides/status) (дата страницы не указана; Abseil 20260817.0) · официальный гайд · средняя. Сам C++-гайд называет `absl::Status` примером общеупотребимого типа ([Choosing Names](https://google.github.io/styleguide/cppguide.html#General_Naming_Rules)), но отдельного правила об обработке ошибок через него не содержит - поэтому SHOULD.
- Пример:

```cpp
// плохо: исключение
User LoadUser(std::string_view login) {
  if (login.empty()) throw std::invalid_argument("empty login");
  ...
}

// хорошо
absl::StatusOr<User> LoadUser(std::string_view login) {
  if (login.empty()) {
    return absl::InvalidArgumentError("login must not be empty");
  }
  ...
}

absl::StatusOr<User> user = LoadUser(login);
if (!user.ok()) {
  return user.status();
}
```

### G-CPP-036 · MUST · Конструктор не вызывает виртуальные функции; если инициализация может не удаться, вместо «тяжёлого» конструктора используется фабричная функция или метод `Init()`
- Проверка: частично: clang-tidy `clang-analyzer-optin.cplusplus.VirtualCall` (вызов виртуальной функции из конструктора или деструктора); выбор фабрики вместо конструктора - ручное ревью.
- Источник: [C++ Style Guide - Doing Work in Constructors](https://google.github.io/styleguide/cppguide.html#Doing_Work_in_Constructors) (редакция 2026-09-29; ссылается на Tip of the Week #42) · официальный гайд · высокая.

### G-CPP-037 · SHOULD · `noexcept` ставится там, где он даёт выигрыш в скорости и точно отражает семантику, - прежде всего на move-конструкторах; при полностью отключённых исключениях `noexcept` безусловный
- Проверка: частично: clang-tidy `performance-noexcept-move-constructor` (не из семейства google; при `-fno-exceptions` молчит); остальное - ручное ревью.
- Источник: [C++ Style Guide - noexcept](https://google.github.io/styleguide/cppguide.html#noexcept) (редакция 2026-09-29) · официальный гайд · высокая.

### 5.2. Логирование и вывод

Отдельного раздела о логировании в гайде нет: тема разобрана в разделе о потоках. Конкретную библиотеку гайд не называет; публичная библиотека Google - [Abseil Logging](https://abseil.io/docs/cpp/guides/logging) (`absl/log/log.h`: `LOG(INFO)`, `LOG(ERROR)`, `LOG(FATAL)`; `absl/log/check.h`: `CHECK()`, `DCHECK()`).

### G-CPP-038 · SHOULD · Потоки (`<iostream>`) - только для разового читаемого вывода, адресованного разработчикам; диагностика пишется через библиотеку логирования, а не в `std::cerr`; состояние потока (`imbue()`, `xalloc()`) и манипуляторы не используются; `operator<<` перегружается только для типов-значений
- Проверка: ручное ревью.
- Источник: [C++ Style Guide - Streams](https://google.github.io/styleguide/cppguide.html#Streams) (редакция 2026-09-29); [Abseil - Logging](https://abseil.io/docs/cpp/guides/logging) (дата страницы не указана) · официальный гайд · высокая.

### G-CPP-039 · SHOULD · Значения печатаются типобезопасно - `absl::StrCat`, `absl::Substitute`, `absl::StrFormat` или `std::ostream`, а не семейство `printf`; адрес как число хранится в `uintptr_t`; структурированные данные передаются между процессами через библиотеку сериализации (Protocol Buffers), а не копией памяти
- Проверка: частично: cpplint `runtime/printf`, `runtime/printf_format`; остальное - ручное ревью.
- Источник: [C++ Style Guide - Architecture Portability](https://google.github.io/styleguide/cppguide.html#Architecture_Portability) (редакция 2026-09-29; раздел переписан 2024-09-05, `8c4da23`) · официальный гайд · высокая.

### 5.3. Типы

### G-CPP-040 · MUST · Из встроенных целых типов используется только `int`; когда важен размер - `int16_t`, `int64_t` из `<stdint.h>` вместо `short`, `long`, `long long`; беззнаковые типы - только для битовых масок и модульной арифметики, а не как знак «число неотрицательно»; `std::` перед `int32_t` не пишется
- Проверка: частично: clang-tidy `google-runtime-int` (с `TypeSuffix: _t` из конфига профиля); cpplint `runtime/int`; уместность беззнаковых типов - ручное ревью.
- Источник: [C++ Style Guide - Integer Types](https://google.github.io/styleguide/cppguide.html#Integer_Types) (редакция 2026-09-29; отказ от `std::` - 2023-10-12, `901474a`) · официальный гайд · высокая.
- Пример:

```cpp
// плохо: unsigned как «неотрицательное», long long, лишний std::
unsigned int retries;
long long total_bytes;
std::int32_t delta;

// хорошо
int retries;
int64_t total_bytes;
int32_t delta;
uint32_t flags_mask;  // Битовая маска: беззнаковый тип уместен.
```

### G-CPP-041 · MUST · Из типов с плавающей точкой используются только `float` и `double`; `long double` запрещён
- Проверка: частично: clang-tidy `google-runtime-float` существует только с версии 22.1.0; на clang-tidy 18.1.3 - `grep -rnw 'long double'` в CI или ручное ревью.
- Источник: [C++ Style Guide - Floating-Point Types](https://google.github.io/styleguide/cppguide.html#Floating-Point_Types) (редакция 2026-09-29; раздел появился 2024-09-05, `8c4da23`) · официальный гайд · высокая.

### G-CPP-042 · MUST · Приведения в стиле C (`(int)x`) запрещены, кроме приведения к `void`; арифметические преобразования без потери значения - фигурной инициализацией (`int64_t{x}`), остальные - `static_cast`, `absl::down_cast`, `const_cast`, `reinterpret_cast`; переинтерпретация битов - `std::bit_cast`
- Проверка: clang-tidy `google-readability-casting` (с 22.1.0 - алиас `modernize-avoid-c-style-cast`); cpplint `readability/casting`, `runtime/casting`; компилятор `-Wold-style-cast`.
- Источник: [C++ Style Guide - Casting](https://google.github.io/styleguide/cppguide.html#Casting) (редакция 2026-09-29; `std::bit_cast` - 2023-08-22, `d8cee70`; `absl::down_cast` - 2026-05-01, `3c5c895`) · официальный гайд · высокая.
- Пример:

```cpp
// плохо
long y = (long)x;
double ratio = (double)hits / total;

// хорошо: расширение без потерь - фигурная инициализация,
// преобразование значения - static_cast
int64_t y = int64_t{x};
double ratio = static_cast<double>(hits) / total;
```

### G-CPP-043 · MUST · Для указателей - `nullptr`, для нулевого символа - `'\0'`; литерал `0` и `NULL` в этих ролях не используются
- Проверка: clang-tidy `modernize-use-nullptr` (не из семейства google).
- Источник: [C++ Style Guide - 0 and nullptr/NULL](https://google.github.io/styleguide/cppguide.html#0_and_nullptr/NULL) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-044 · SHOULD · `const` ставится в API везде, где это осмысленно; метод, не меняющий логическое состояние, - `const`; у параметра по значению `const` в объявлении не пишется; настоящие константы - `constexpr`, константная инициализация неконстантной переменной - `constinit`; `constexpr` не ставится ради встраивания
- Проверка: частично: clang-tidy `readability-avoid-const-params-in-decls` (не из семейства google); остальное - ручное ревью (`misc-const-correctness` не включать: она требует `const` у локальных переменных, а гайд к этому нейтрален).
- Источник: [C++ Style Guide - Use of const](https://google.github.io/styleguide/cppguide.html#Use_of_const); [Use of constexpr, constinit, and consteval](https://google.github.io/styleguide/cppguide.html#Use_of_constexpr) (редакция 2026-09-29; `constinit` и `consteval` - 2023-10-12, `901474a`) · официальный гайд · высокая.

### G-CPP-045 · SHOULD · Вывод типов (`auto`) применяется только там, где код становится понятнее или безопаснее, а не ради экономии набора; `auto`-параметры у обычных (не лямбда) функций запрещены - пишется именованный параметр шаблона; для элементов map-подобных контейнеров - structured bindings
- Проверка: ручное ревью (`modernize-use-auto` не включать: она требует обратного).
- Источник: [C++ Style Guide - Type Deduction](https://google.github.io/styleguide/cppguide.html#Type_deduction) (редакция 2026-09-29; раздел переработан 2026-05-01, `3c5c895`; ссылается на Tip of the Week #232) · официальный гайд · высокая. Уровень: общая рекомендация - «should», запрет `auto`-параметров - «do not».
- Пример:

```cpp
// плохо: auto-параметр; тип result не виден из контекста
void Process(auto item);
auto result = Compute(config);

// хорошо: тип итератора очевиден и длинен, auto уместен
template <typename T>
void Process(T item);
std::unique_ptr<Widget> widget = MakeWidget(config);
auto it = index.find(key);
for (const auto& [name, widget] : widgets_by_name) {
  Draw(name, widget);
}
```

### G-CPP-046 · MUST · Конструктор, вызываемый с одним аргументом, и оператор преобразования помечаются `explicit`; исключения - конструкторы копирования и перемещения и конструктор от `std::initializer_list`
- Проверка: clang-tidy `google-explicit-constructor` (с 23.1.0 - алиас `misc-explicit-constructor`); cpplint `runtime/explicit`.
- Источник: [C++ Style Guide - Implicit Conversions](https://google.github.io/styleguide/cppguide.html#Implicit_Conversions) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-047 · MUST · Публичный интерфейс класса явно показывает, копируемый он, только перемещаемый или ни то ни другое: нужные операции объявлены (`= default`) или удалены (`= delete`) в секции `public`; объявил присваивание - объяви и соответствующий конструктор
- Проверка: ручное ревью (clang-tidy `cppcoreguidelines-special-member-functions` - грубое приближение, в конфиг не включена).
- Источник: [C++ Style Guide - Copyable and Movable Types](https://google.github.io/styleguide/cppguide.html#Copyable_Movable_Types) (редакция 2026-09-29; формулировки уточнены 2025-11-13, `c885dc2`) · официальный гайд · высокая.
- Пример:

```cpp
class Connection {
 public:
  // хорошо: видно, что тип только перемещаемый
  Connection(Connection&& other) = default;
  Connection& operator=(Connection&& other) = default;
  Connection(const Connection&) = delete;
  Connection& operator=(const Connection&) = delete;
};
```

### G-CPP-048 · MUST · `struct` - только пассивный набор данных: все поля открыты и между ними нет инвариантов; всё остальное - `class`; вместо `std::pair` и `std::tuple` предпочтительна структура с осмысленными именами полей
- Проверка: ручное ревью.
- Источник: [C++ Style Guide - Structs vs. Classes](https://google.github.io/styleguide/cppguide.html#Structs_vs._Classes); [Structs vs. Pairs and Tuples](https://google.github.io/styleguide/cppguide.html#Structs_vs._Tuples) (редакция 2026-09-29) · официальный гайд · высокая. Уровень: об открытых полях сказано «must», о предпочтении структуры кортежу - «prefer».

### G-CPP-049 · SHOULD · У динамического объекта один владелец; владение передаётся через `std::unique_ptr`; разделяемое владение (`std::shared_ptr`) - только с веской причиной и по возможности на неизменяемый объект; `std::auto_ptr` не используется никогда
- Проверка: частично: clang-tidy `modernize-replace-auto-ptr` (не из семейства google); остальное - ручное ревью.
- Источник: [C++ Style Guide - Ownership and Smart Pointers](https://google.github.io/styleguide/cppguide.html#Ownership_and_Smart_Pointers) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-050 · SHOULD · Результат возвращается значением, а не через выходной параметр; обязательные параметры передаются по значению или по ссылке, необязательные - `std::optional` или указателем; входные идут перед выходными; функция не сохраняет параметр-ссылку дольше вызова
- Проверка: ручное ревью (cpplint `runtime/references` по умолчанию выключена: она отражает прежнее правило, которое гайд изменил в мае 2020 года).
- Источник: [C++ Style Guide - Inputs and Outputs](https://google.github.io/styleguide/cppguide.html#Inputs_and_Outputs) (редакция 2026-09-29; требование о времени жизни распространено на все ссылки 2024-02-12, `1932017`; ссылается на Tips of the Week #116 и #176) · официальный гайд · высокая.

## 6. Запрещённые и ограниченные возможности языка

Сводка: что запрещено совсем, а что ограничено условиями.

| Возможность | Статус в гайде | Правило |
|---|---|---|
| Исключения, `std::exception_ptr` | запрещены | G-CPP-034 |
| Модули C++20 | запрещены | G-CPP-062 |
| Пользовательские литералы, включая стандартные (`5s`, `"x"sv`) | запрещены | G-CPP-052 |
| `<ratio>`, `<cfenv>`/`<fenv.h>`, `<filesystem>` | запрещены | G-CPP-063 |
| `long double`; `short`, `long`, `long long` | запрещены | G-CPP-040, G-CPP-041 |
| Приведения в стиле C | запрещены (кроме приведения к `void`) | G-CPP-042 |
| `using namespace`, inline-namespace | запрещены | G-CPP-024 |
| `#pragma once`, `-inl.h` | запрещены | G-CPP-018, G-CPP-019 |
| Нестандартные расширения (`__attribute__`, VLA, `alloca()`) | запрещены вне общего portability-заголовка | G-CPP-064 |
| `std::auto_ptr` | запрещён | G-CPP-049 |
| Статические объекты с нетривиальным деструктором | запрещены | G-CPP-051 |
| Объявление вперёд чужих сущностей | запрещено | G-CPP-021 |
| Корутины C++20 | только через библиотеки, одобренные лидами проекта | G-CPP-062 |
| Rvalue-ссылки | только в четырёх случаях | G-CPP-053 |
| RTTI | избегать вне тестов | G-CPP-054 |
| `auto`, CTAD, концепты, шаблонное метапрограммирование | ограничены условиями | G-CPP-045, G-CPP-059, G-CPP-061 |
| Макросы | избегать; не объявлять ими API | G-CPP-065 |
| Потоки `<iostream>` | только там, где это лучший инструмент | G-CPP-038 |
| Boost | раздел удалён 2026-05-01; действует общее правило о сторонних библиотеках | G-CPP-068 |

Про `goto` гайд намеренно молчит: в разделе [Goals](https://google.github.io/styleguide/cppguide.html#Goals) он назван конструкцией, которая и так почти не встречается. Отдельных оценок для `<ranges>`, `std::format`, `std::span` в гайде нет - публичных данных не найдено.

### G-CPP-051 · MUST · Объект со статическим временем жизни обязан быть тривиально разрушаемым - никаких глобальных и статических `std::string`, `std::map`, умных указателей; динамическая инициализация нелокальных переменных в общем случае запрещена; `thread_local` вне функции помечается `constinit`
- Проверка: частично: компилятор `-Wexit-time-destructors`, `-Wglobal-constructors` (clang++ 18.1.3 в режиме C++20 не предупреждает о коротком `const std::string`); clang-tidy `fuchsia-statically-constructed-objects` (не из семейства google; в конфиге профиля - необязательная); cpplint `runtime/string`; остальное - ручное ревью.
- Источник: [C++ Style Guide - Static and Global Variables](https://google.github.io/styleguide/cppguide.html#Static_and_Global_Variables); [thread_local Variables](https://google.github.io/styleguide/cppguide.html#thread_local) (редакция 2026-09-29; `constinit` - 2023-10-12, `901474a`; ссылается на Tip of the Week #140) · официальный гайд · высокая.
- Пример:

```cpp
// плохо: нетривиальные деструкторы и динамическая инициализация
const std::string kGreeting = "hello";
static std::map<int, int> g_cache;
thread_local Session session = MakeSession();

// хорошо
constexpr std::string_view kGreeting = "hello";
constinit thread_local int tls_depth = 0;

std::map<int, int>& Cache() {
  // Объект намеренно никогда не удаляется.
  static auto& cache = *new std::map<int, int>;
  return cache;
}
```

### G-CPP-052 · MUST · Пользовательские литералы запрещены - и свои, и чужие, включая стандартные (`5s`, `"x"sv`); операторы перегружаются только с очевидным смыслом, а `&&`, `||`, запятая и унарный `&` - никогда; для сравнения определяются `operator==` и, при естественном порядке, `operator<=>`
- Проверка: частично: clang-tidy `google-runtime-operator` (унарный `&`); cpplint `runtime/operator`; литералы и остальные операторы - ручное ревью (`grep -rn 'chrono_literals\|string_literals\|string_view_literals'` находит подключение стандартных литералов).
- Источник: [C++ Style Guide - Operator Overloading](https://google.github.io/styleguide/cppguide.html#Operator_Overloading) (редакция 2026-09-29; `==` и `<=>` - 2023-10-12, `901474a`) · официальный гайд · высокая.
- Пример:

```cpp
// плохо
using namespace std::chrono_literals;
auto timeout = 5s;

// хорошо
auto timeout = std::chrono::seconds(5);
```

### G-CPP-053 · MUST · Rvalue-ссылки и `&&`-квалификатор методов используются только в четырёх случаях: move-конструктор и move-присваивание; `&&`-метод, который «потребляет» `*this`; forwarding-ссылка вместе с `std::forward`; пара перегрузок `Foo&&` и `const Foo&`
- Проверка: ручное ревью.
- Источник: [C++ Style Guide - Rvalue References](https://google.github.io/styleguide/cppguide.html#Rvalue_references) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-054 · SHOULD · RTTI (`typeid`, `dynamic_cast`) вне юнит-тестов избегается: вместо ветвления по типу - виртуальный метод или Visitor; самодельный RTTI на тегах типов не пишется; когда тип объекта гарантирован логикой программы, для приведения вниз годится `absl::down_cast`
- Проверка: ручное ревью.
- Источник: [C++ Style Guide - Run-Time Type Information (RTTI)](https://google.github.io/styleguide/cppguide.html#Run-Time_Type_Information__RTTI_) (редакция 2026-09-29; `absl::down_cast` - 2026-05-01, `3c5c895`) · официальный гайд · высокая.

### G-CPP-055 · MUST · Переопределение виртуальной функции или деструктора помечается ровно одним из `override` и `final`, без `virtual`; наследование только `public`; множественное наследование реализации настоятельно не рекомендуется
- Проверка: частично: clang-tidy `modernize-use-override` (не из семейства google); cpplint `readability/inheritance`; закрытое и множественное наследование - ручное ревью.
- Источник: [C++ Style Guide - Inheritance](https://google.github.io/styleguide/cppguide.html#Inheritance) (редакция 2026-09-29) · официальный гайд · высокая. Уровень: о спецификаторах сказано «do not», о `public`-наследовании - «should».

### G-CPP-056 · MUST · Аргументы по умолчанию запрещены у виртуальных функций и там, где значение может меняться от вызова к вызову; перегрузка допустима, только когда читателю вызова не нужно знать, какая именно перегрузка выбрана
- Проверка: частично: clang-tidy `google-default-arguments` (виртуальные функции); остальное - ручное ревью.
- Источник: [C++ Style Guide - Default Arguments](https://google.github.io/styleguide/cppguide.html#Default_Arguments); [Function Overloading](https://google.github.io/styleguide/cppguide.html#Function_Overloading) (редакция 2026-09-29; ссылается на Tip of the Week #148) · официальный гайд · высокая.

### G-CPP-057 · SHOULD · Тип возвращаемого значения пишется перед именем функции; форма `auto F() -> T` - только там, где она обязательна (лямбды) или заметно читаемее
- Проверка: ручное ревью (`modernize-use-trailing-return-type` не включать: она требует обратного).
- Источник: [C++ Style Guide - Trailing Return Type Syntax](https://google.github.io/styleguide/cppguide.html#trailing_return) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-058 · SHOULD · Лямбда, которая может пережить текущую область видимости, захватывает переменные явным списком; `[&]` - только когда лямбда заведомо живёт меньше захваченного; `[=]` - только для коротких лямбд и без неявного захвата `this`; захват с инициализатором не используется, чтобы вводить новые имена
- Проверка: частично: компилятор `-Wdeprecated-this-capture` (неявный захват `this` через `[=]`, в C++20 включено по умолчанию); остальное - ручное ревью.
- Источник: [C++ Style Guide - Lambda Expressions](https://google.github.io/styleguide/cppguide.html#Lambda_expressions) (редакция 2026-09-29) · официальный гайд · высокая. Уровень: о явных захватах - «prefer», о захвате с инициализатором - «do not».
- Пример:

```cpp
// плохо: лямбда уходит в другой поток, а захват не виден
executor->Schedule([&] { Flush(buffer); });

// хорошо
executor->Schedule([&buffer] { Flush(buffer); });
```

### G-CPP-059 · MUST · Вывод аргументов шаблона класса (CTAD) применяется только к шаблонам, чьи авторы явно это поддержали хотя бы одним deduction guide; шаблоны из `std` считаются поддержавшими
- Проверка: компилятор `-Wctad-maybe-unsupported` (гайд сам требует включить предупреждение компилятора, если оно есть).
- Источник: [C++ Style Guide - Class Template Argument Deduction](https://google.github.io/styleguide/cppguide.html#CTAD) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-060 · MUST · Designated initializers используются только в форме C++20: поля перечисляются в порядке их объявления в структуре
- Проверка: компилятор `-Wreorder-init-list` (clang++ 18.1.3 выдаёт предупреждение и без флага; с `-Werror` - ошибка).
- Источник: [C++ Style Guide - Designated Initializers](https://google.github.io/styleguide/cppguide.html#Designated_initializers) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-061 · MUST · Ограничения шаблонов пишутся через `requires(...)` и стандартные концепты, а не через `template <Concept T>`, `std::enable_if` и type traits; новые концепты редки, не выходят на границу API и не описывают того, что компилятор не проверяет; сложное метапрограммирование прячется в детали реализации
- Проверка: ручное ревью (clang-tidy `modernize-use-constraints` переводит `enable_if` в `requires`, не из семейства google, в конфиг не включена).
- Источник: [C++ Style Guide - Concepts and Constraints](https://google.github.io/styleguide/cppguide.html#Concepts); [Template Metaprogramming](https://google.github.io/styleguide/cppguide.html#Template_metaprogramming) (редакция 2026-09-29; раздел о концептах появился 2023-10-12, `901474a`) · официальный гайд · высокая.
- Пример:

```cpp
// плохо
template <std::integral T>
T Twice(T x);

// хорошо
template <typename T>
  requires(std::integral<T>)
T Twice(T x);
```

### G-CPP-062 · MUST · Модули C++20 не используются; корутины C++20 - только через библиотеки, одобренные лидами проекта, собственные promise- и awaitable-типы не пишутся
- Проверка: ручное ревью (модули дополнительно не включаются в настройках сборки).
- Источник: [C++ Style Guide - C++20 modules](https://google.github.io/styleguide/cppguide.html#modules); [Coroutines](https://google.github.io/styleguide/cppguide.html#coroutines) (редакция 2026-09-29; запрет модулей и корутин - 2024-09-05, `8c4da23`; корутины через одобренные библиотеки - 2025-07-31, `c6f57a9`) · официальный гайд · высокая.

### G-CPP-063 · MUST · Заголовки `<ratio>`, `<cfenv>` (`<fenv.h>`) и `<filesystem>` не подключаются
- Проверка: cpplint `build/c++11` (`<cfenv>`, `<fenv.h>`, `<ratio>`), `build/c++17` (`<filesystem>`); без cpplint - `grep -rnE '#include <(ratio|cfenv|fenv\.h|filesystem)>'` в CI.
- Источник: [C++ Style Guide - Disallowed standard library features](https://google.github.io/styleguide/cppguide.html#Disallowed_Stdlib) (редакция 2026-09-29; раздел в нынешнем виде - 2024-09-05, `8c4da23`) · официальный гайд · высокая.

### G-CPP-064 · MUST · Нестандартные расширения компилятора (`__attribute__`, intrinsics, `#pragma`, массивы переменной длины, `alloca()`, `a ?: b`) не используются напрямую; допустимы только обёртки из общего для проекта portability-заголовка
- Проверка: частично: компилятор `-Wvla`, `-Wpedantic`; cpplint `runtime/arrays`; остальное - ручное ревью.
- Источник: [C++ Style Guide - Nonstandard Extensions](https://google.github.io/styleguide/cppguide.html#Nonstandard_Extensions) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-065 · SHOULD · Макросы не определяются там, где справится `inline`-функция, перечисление или константа, особенно в заголовках; макросами не объявляются части API; локальный макрос определяется непосредственно перед использованием и снимается `#undef` сразу после
- Проверка: ручное ревью (clang-tidy `cppcoreguidelines-macro-usage` - приближение, в конфиг не включена).
- Источник: [C++ Style Guide - Preprocessor Macros](https://google.github.io/styleguide/cppguide.html#Preprocessor_Macros) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-066 · MUST · Переход из одной ветки `case` в следующую помечается `[[fallthrough]];`; `switch` не по перечислению всегда содержит `default`, а недостижимый `default` считается ошибкой
- Проверка: компилятор `-Wimplicit-fallthrough`, `-Wswitch` (необработанные значения перечисления); clang-tidy `bugprone-switch-missing-default-case` (не из семейства google).
- Источник: [C++ Style Guide - Switch Statements](https://google.github.io/styleguide/cppguide.html#Switch_Statements) (редакция 2026-09-29; отдельный раздел с 2023-03-22, `f1dbcc3`) · официальный гайд · высокая.

### G-CPP-067 · SHOULD · Алиас попадает в публичный API, только если он нужен пользователям и его смысл задокументирован; алиасы «чтобы меньше печатать» и алиасы namespace в публичные заголовки не кладутся - их место в `.cc`, в теле функции, в `private`-секции или в `internal`-namespace
- Проверка: частично: clang-tidy `google-global-names-in-headers` (using-объявления в глобальной области заголовка), `misc-unused-using-decls`; остальное - ручное ревью.
- Источник: [C++ Style Guide - Aliases](https://google.github.io/styleguide/cppguide.html#Aliases) (редакция 2026-09-29) · официальный гайд · высокая.

### G-CPP-068 · SHOULD · Библиотека выбирается так: сначала то, что уже принято в кодовой базе для этой задачи; иначе по убыванию приоритета - Abseil, стандартная библиотека C++, собственные библиотеки проекта, сторонние библиотеки
- Проверка: ручное ревью.
- Источник: [C++ Style Guide - Third-party Libraries](https://google.github.io/styleguide/cppguide.html#Third_party_Libraries) (редакция 2026-09-29; раздел заменил раздел о Boost 2026-05-01, `3c5c895`) · официальный гайд · высокая.

### G-CPP-069 · MUST · При использовании Abseil соблюдаются его правила совместимости: не объявлять вперёд его сущности, не открывать `namespace absl`, не зависеть от `internal`-, `detail`- и `impl`-частей, не брать адреса его функций и не полагаться на их сигнатуры
- Проверка: частично: clang-tidy `abseil-no-namespace`, `abseil-no-internal-dependencies`; остальное - ручное ревью.
- Источник: [Abseil - Compatibility Guidelines](https://abseil.io/about/compatibility) (дата страницы не указана; Abseil 20260817.0) · официальный гайд · высокая.

## 7. Тесты (GoogleTest)

Сам гайд говорит о тестах мало: имя файла, послабление для полей фикстуры и свободный RTTI. Остальное задают документация GoogleTest (v1.18.0, требует как минимум C++17) и проверки clang-tidy. Имена наборов и тестов следуют правилу для функций (G-CPP-014) - так написано в [GoogleTest Primer](https://google.github.io/googletest/primer.html).

### G-CPP-070 · SHOULD · В именах `TEST(TestSuiteName, TestName)` нет подчёркиваний: оба имени - в `PascalCase`
- Проверка: clang-tidy `google-readability-avoid-underscore-in-googletest-name` (макросы `TEST`, `TEST_F`, `TEST_P`, `TYPED_TEST`).
- Источник: [GoogleTest FAQ](https://google.github.io/googletest/faq.html); [GoogleTest Primer](https://google.github.io/googletest/primer.html) (GoogleTest v1.18.0) · официальный гайд · высокая. Причина - зарезервированные идентификаторы и совпадения имён сгенерированных классов.
- Пример:

```cpp
// плохо
TEST(Url_Table, add_url) { EXPECT_EQ(UrlTable("t").num_entries(), 0); }

// хорошо
TEST(UrlTableTest, NewTableIsEmpty) {
  EXPECT_EQ(UrlTable("t").num_entries(), 0);
}
```

### G-CPP-071 · SHOULD · Тест для `foo.cc` лежит в `foo_test.cc` (суффиксы `_unittest` и `_regtest` устарели); в тестах действуют только названные гайдом послабления: поля фикстуры, определённой в `.cc`, могут быть `protected`, RTTI допустим, тестовый класс может быть `friend`
- Проверка: ручное ревью.
- Источник: [C++ Style Guide - File Names](https://google.github.io/styleguide/cppguide.html#File_Names); [Access Control](https://google.github.io/styleguide/cppguide.html#Access_Control); [RTTI](https://google.github.io/styleguide/cppguide.html#Run-Time_Type_Information__RTTI_); [Friends](https://google.github.io/styleguide/cppguide.html#Friends) (редакция 2026-09-29) · официальный гайд · высокая.
- Пример:

```cpp
// хорошо: url_table_test.cc
class UrlTableTest : public testing::Test {
 protected:
  UrlTable table_{"test"};  // protected-поле фикстуры в .cc разрешено
};

TEST_F(UrlTableTest, RejectsEmptyUrl) {
  EXPECT_EQ(table_.AddUrl(""), UrlTableError::kMalformedInput);
}
```

### G-CPP-072 · SHOULD · Используются имена API GoogleTest со словом `Suite` (`SetUpTestSuite`, `INSTANTIATE_TEST_SUITE_P`), а не устаревшие с `Case`
- Проверка: clang-tidy `google-upgrade-googletest-case` (с автоисправлением).
- Источник: [clang-tidy - google-upgrade-googletest-case](https://clang.llvm.org/extra/clang-tidy/checks/google/upgrade-googletest-case.html) (документация LLVM 24.0.0git; проверка есть в 18.1.3) · конфиг или инструмент · средняя. В тексте C++-гайда этого правила нет: оно следует из переименования API в самом GoogleTest.

Чего в публичных источниках Google нет: требований к покрытию, к структуре каталогов тестов и к выбору между `EXPECT_*` и `ASSERT_*` сверх сказанного в Primer (обычно предпочтительны `EXPECT_*`, потому что они позволяют увидеть несколько сбоев за один прогон).

## 8. Стандарт языка и изменения за 2023-2026 годы

### G-CPP-073 · SHOULD · Код пишется под C++20: возможности C++23 и нестандартные расширения не используются; перед тем как брать возможности C++17 и C++20, проверяется переносимость на нужные проекту окружения
- Проверка: компилятор `-std=c++20` (в CMake - `CMAKE_CXX_STANDARD 20` с `CMAKE_CXX_EXTENSIONS OFF`); clang-format `Standard: c++20`.
- Источник: [C++ Style Guide - C++ Version](https://google.github.io/styleguide/cppguide.html#C++_Version) (редакция 2026-09-29; переход с C++17 на C++20 - 2023-10-12, `901474a`) · официальный гайд · высокая. Уровень: в гайде «should»; на практике стандарт фиксируется флагом сборки.

История целевого стандарта: C++11 (формулировка в файле с 2018-07-31) → C++17 (2019-09-05) → C++20 (2023-10-12). Гайд обещает поднимать версию «агрессивно», но публичного списка разрешённых возможностей C++23 пока нет. Abseil при этом требует лишь C++17, а GoogleTest - «как минимум C++17», так что код, совместимый с ними, может не использовать C++20.

Содержательные изменения гайда за три года (по истории `cppguide.html`, [коммиты](https://github.com/google/styleguide/commits/gh-pages/cppguide.html)):

| Дата | Коммит | Что изменилось | Правила профиля |
|---|---|---|---|
| 2023-03-22 | `f1dbcc3` | `internal`-namespace для непубличных частей API; отдельный раздел о `switch`; обязательный префикс проекта у макросов | G-CPP-016, G-CPP-024, G-CPP-066 |
| 2023-08-22 | `d8cee70` | порядок разрушения `thread_local`; `std::bit_cast`; файловые комментарии; новый формат TODO с дефисом | G-CPP-029, G-CPP-032, G-CPP-042, G-CPP-051 |
| 2023-10-12 | `901474a` | целевой стандарт C++20; `constinit`; `==` и `<=>`; раздел о концептах; однострочные вложенные namespace; `int32_t` без `std::` | G-CPP-024, G-CPP-040, G-CPP-044, G-CPP-052, G-CPP-061, G-CPP-073 |
| 2024-02-12 | `1932017` | когда нужны угловые скобки в `#include`; ссылочные параметры не переживают вызов; имена концептов | G-CPP-011, G-CPP-022, G-CPP-050 |
| 2024-07-08 | `3e13205` | ссылка на `cpplint.py` переведена на форк сообщества, каталог `cpplint/` удалён из репозитория | раздел 9.3 |
| 2024-09-05 | `8c4da23` | запрет `long double`, модулей и корутин; раздел о запрещённых заголовках; печать через Abseil или потоки вместо `printf` | G-CPP-039, G-CPP-041, G-CPP-062, G-CPP-063 |
| 2025-04-10 | `445123e` | определения в заголовках; `internal_<файл>`-namespace; уточнения именования | G-CPP-009, G-CPP-013, G-CPP-015, G-CPP-023 |
| 2025-07-31 | `c6f57a9` | корутины через одобренные библиотеки; запрет пробела перед `*` и `&` | G-CPP-004, G-CPP-062 |
| 2025-11-13 | `c885dc2` | порядок предпочтения форм TODO; исключения именования для Rust interop | G-CPP-017, G-CPP-032 |
| 2026-05-01 | `3c5c895` | запрет объявлять вперёд чужие сущности; `absl::down_cast`; переработан `auto`; раздел Boost заменён разделом о сторонних библиотеках | G-CPP-021, G-CPP-045, G-CPP-054, G-CPP-068 |
| 2026-05-07 | `1809c76` | условные операторы и циклы без фигурных скобок «разрешены, но не поощряются» | G-CPP-005 |
| 2026-09-29 | `428b08a` | исходник гайда переведён с HTML на Markdown; примеры объявлены иллюстрациями, а не шаблонами; раздел TODO без объявления вернулся к скобочной форме | G-CPP-027, G-CPP-032 |

## 9. Инструменты и машиночитаемые конфиги

### 9.1. Файлы профиля и версии

| Файл | Инструмент | Версия, на которой проверен | Что проверялось |
|---|---|---|---|
| [`../../configs/cpp/.clang-format`](../../configs/cpp/.clang-format) | clang-format | 18.1.3 (локально) | `--style=file:<путь> --dump-config`; форматирование образца; `--dry-run -Werror` на результате |
| [`../../configs/cpp/.clang-tidy`](../../configs/cpp/.clang-tidy) | clang-tidy | 18.1.3 (локально) | `--verify-config`; 0 замечаний на образцах в стиле гайда; 55 замечаний от 24 проверок на образце с нарушениями |

Состояние инструментов на 2026-10-09:

| Инструмент | Последний релиз | Кто сопровождает | Назван в гайде | Статус |
|---|---|---|---|---|
| clang-format, пресет `Google` | LLVM 23.1.0 - 2026-08-25 (зеркало для pre-commit на 2026-10-07 публикует 23.1.3) | LLVM Project; пресет правят в том числе инженеры Google | да, один раз ([Line Length](https://google.github.io/styleguide/cppguide.html#Line_Length)) | активен; не продукт Google |
| clang-tidy, проверки `google-*` и `abseil-*` | LLVM 23.1.0 - 2026-08-25 | LLVM Project | нет | активен; не продукт Google |
| cpplint | 2.0.2 - 2025-04-08 | сообщество ([cpplint/cpplint](https://github.com/cpplint/cpplint)), не Google | да ([cpplint](https://google.github.io/styleguide/cppguide.html#cpplint)) | форк активен; копия Google удалена 2024-07-08 |
| Abseil C++ | 20260817.0 | Google | да | активен |
| GoogleTest | v1.18.0 | Google | да (как Google Test) | активен |

Конфиги написаны так, чтобы работать на clang 18 и новее. На версиях 21-23 они не запускались: в среде сборки профиля установлена только 18.1.3. Закрепите одну версию clang-format и clang-tidy для всех разработчиков и для CI.

Команды для CI:

```sh
# форматирование: ненулевой код возврата, если файл не отформатирован
clang-format --style=file --dry-run -Werror $(git ls-files '*.cc' '*.h')

# статический анализ: нужен compile_commands.json в каталоге build/
clang-tidy -p build --warnings-as-errors='*' $(git ls-files '*.cc')
```

### 9.2. clang-format

Пресет `Google` в clang-format задаёт почти всё форматирование из раздела 1: `ColumnLimit: 80`, `IndentWidth: 2`, `UseTab: Never`, `ContinuationIndentWidth: 4`, `AccessModifierOffset: -1`, `NamespaceIndentation: None`, `FixNamespaceComments: true`, `IncludeBlocks: Regroup`, `SpacesBeforeTrailingComments: 2`, `MaxEmptyLinesToKeep: 1` (вывод `clang-format --style=Google --dump-config`, версия 18.1.3; определение пресета - [Format.cpp](https://github.com/llvm/llvm-project/blob/main/clang/lib/Format/Format.cpp)). Abseil и GoogleTest держат `.clang-format` из двух строк: `Language: Cpp` и `BasedOnStyle: Google`.

Профиль добавляет к пресету три строки:

- `DerivePointerAlignment: false` и `PointerAlignment: Left`. До clang-format 20 включительно пресет Google содержал `DerivePointerAlignment: true`: форматтер подражал стилю, преобладающему в файле, и оставлял `int *p`. Гайд с 2025-07-31 требует `int* p`; пресет исправлен в 21.1.0 ([коммит LLVM](https://llvm.googlesource.com/llvm-project/+/9281797a577b7954521fb9192d41e457ca2ca42e) от 2025-07-25). Явная запись даёт одинаковый результат на любой версии. Так же поступают google-cloud-cpp, leveldb и tensorflow.
- `Standard: c++20` вместо `Auto`.

Два усиления оставлены в конфиге закомментированными: принудительные фигурные скобки (`InsertBraces: true` с `AllowShort…: Never/false`) и отдельная группа `#include` для заголовков проекта. Причины - в [разделе 9.6](#96-известные-расхождения-гайда-и-инструментов).

### 9.3. cpplint

Google убрал cpplint из `google/styleguide` 2024-07-08 (коммит [`3e13205`](https://github.com/google/styleguide/commit/3e13205), «cpplint: declare bankruptcy»): внутренние обновления давно не публиковались, и README теперь отправляет к форку сообщества [cpplint/cpplint](https://github.com/cpplint/cpplint). При этом раздел гайда [cpplint](https://google.github.io/styleguide/cppguide.html#cpplint) сохранён и по-прежнему советует запускать `cpplint.py`, только ссылка ведёт на форк.

Форк жив: релиз 2.0.2 от 2025-04-08 (Python ≥ 3.9), ветка `develop` обновлялась 2026-10-07. С гайдом он расходится в трёх местах: принимает `#pragma once`, требует строку `Copyright` и формат `TODO(my_username)`. В выборке из 25 репозиториев Google cpplint не упоминается ни в корневых файлах, ни в `.github/`.

В профиле cpplint - необязательное дополнение. Он единственный из инструментов закрывает header guard (G-CPP-019), запрещённые заголовки (G-CPP-063), некорректный UTF-8 (G-CPP-008), семейство `printf` (G-CPP-039) и подключение собственного заголовка (G-CPP-018). Минимальный `CPPLINT.cfg` в корне репозитория (не запускалось: реестр пакетов недоступен из среды сборки; синтаксис - из встроенной справки `cpplint.py` 2.0.2):

```text
set noparent
linelength=80
filter=-legal/copyright
```

Строка `filter=-legal/copyright` нужна, если лицензионный заголовок проекта не содержит строки `Copyright [year] <owner>`.

### 9.4. clang-tidy: семейство `google-*` и остальные проверки

В документации LLVM 24.0.0git семейство `google-*` насчитывает 20 проверок: 16 для C++ и GoogleTest и 4 для Objective-C ([список](https://clang.llvm.org/extra/clang-tidy/checks/list.html)). В clang-tidy 18.1.3 их 19: нет `google-runtime-float`. Проверок именования для C++ в семействе нет: имена проверяет `readability-identifier-naming` с ручной настройкой.

| Проверка | Что находит | Правило | Версии |
|---|---|---|---|
| `google-build-explicit-make-pair` | явные шаблонные аргументы у `make_pair` | - | |
| `google-build-namespaces` | безымянный namespace в заголовке | G-CPP-025 | с 22.1.0 - алиас `misc-anonymous-namespace-in-header` |
| `google-build-using-namespace` | `using namespace` | G-CPP-024 | |
| `google-default-arguments` | аргументы по умолчанию у виртуальных методов | G-CPP-056 | |
| `google-explicit-constructor` | конструкторы и операторы преобразования без `explicit` | G-CPP-046 | с 23.1.0 - алиас `misc-explicit-constructor` |
| `google-global-names-in-headers` | `using` в глобальной области заголовка | G-CPP-024, G-CPP-067 | |
| `google-readability-avoid-underscore-in-googletest-name` | `_` в именах тестов | G-CPP-070 | |
| `google-readability-braces-around-statements` | тело без фигурных скобок (`ShortStatementLines: 1`) | G-CPP-005 | алиас `readability-braces-around-statements` |
| `google-readability-casting` | приведения в стиле C | G-CPP-042 | с 22.1.0 - алиас `modernize-avoid-c-style-cast` |
| `google-readability-function-size` | слишком большие функции (`StatementThreshold: 800`) | G-CPP-028 | алиас `readability-function-size` |
| `google-readability-namespace-comments` | нет комментария `// namespace foo` | G-CPP-024 | алиас `llvm-namespace-comment` |
| `google-readability-todo` | TODO без контекста | G-CPP-032 | с 22.1.0 принимает и форму с дефисом |
| `google-runtime-float` | `long double` | G-CPP-041 | новая в 22.1.0 |
| `google-runtime-int` | `short`, `long`, `long long` | G-CPP-040 | |
| `google-runtime-operator` | перегрузка унарного `&` | G-CPP-052 | |
| `google-upgrade-googletest-case` | устаревшие имена GoogleTest с `Case` | G-CPP-072 | |
| `google-objc-*` (4 проверки) | правила Objective-C | - | в профиле отключены |

Из семейства `abseil-*` (20 проверок в trunk, 19 в 18.1.3) стилю гайда соответствуют три: `abseil-no-namespace` и `abseil-no-internal-dependencies` (G-CPP-069) и `abseil-unchecked-statusor-access` (G-CPP-035, только с 22.1.0). Остальные - идиомы `absl::Duration`, `absl::Time` и `absl::StrCat`; включайте их, если проект использует эти типы.

Проверки других семейств включены поимённо, по одной на конкретное правило: `readability-isolate-declaration` (G-CPP-004), `bugprone-suspicious-semicolon` (G-CPP-005), `readability-operators-representation` (G-CPP-006), `cert-dcl58-cpp` (G-CPP-021), `misc-definitions-in-headers` (G-CPP-023), `bugprone-argument-comment` (G-CPP-031), `clang-analyzer-optin.cplusplus.VirtualCall` (G-CPP-036), `performance-noexcept-move-constructor` (G-CPP-037), `modernize-use-nullptr` (G-CPP-043), `readability-avoid-const-params-in-decls` (G-CPP-044), `modernize-replace-auto-ptr` (G-CPP-049), `modernize-use-override` (G-CPP-055), `bugprone-switch-missing-default-case` (G-CPP-066), `misc-unused-using-decls` (G-CPP-067).

Семейства `modernize-*`, `misc-*` и `readability-*` целиком не включаются: `modernize-use-trailing-return-type` и `modernize-use-auto` требуют обратного правилам G-CPP-057 и G-CPP-045, `misc-const-correctness` - обратного G-CPP-044, `misc-use-anonymous-namespace` запрещает `static`, который гайд разрешает (G-CPP-025). google-cloud-cpp включает эти семейства целиком и потом вычёркивает около тридцати проверок ([.clang-tidy](https://github.com/googleapis/google-cloud-cpp/blob/main/.clang-tidy)); профиль идёт от обратного. Какие проверки clang-tidy обязательны внутри Google - публичных данных не найдено.

### 9.5. Флаги компилятора

Часть запретов дешевле всего проверяет сам компилятор. Каждое предупреждение получено на тестовом файле (clang++ 18.1.3):

```text
-std=c++20                    # G-CPP-073
-fno-exceptions               # G-CPP-034
-Wimplicit-fallthrough        # G-CPP-066: [[fallthrough]]
-Wctad-maybe-unsupported      # G-CPP-059: CTAD без deduction guide
-Wreorder-init-list           # G-CPP-060: порядок designated initializers
-Wdeprecated-this-capture     # G-CPP-058: неявный захват this через [=]
-Wold-style-cast              # G-CPP-042: приведения в стиле C
-Wvla                         # G-CPP-064: массивы переменной длины
-Wexit-time-destructors -Wglobal-constructors   # G-CPP-051 (частично)
```

### 9.6. Известные расхождения гайда и инструментов

| № | Что говорит гайд | Что делает инструмент | Что берёт профиль и почему |
|---|---|---|---|
| 1 | `char* c`, пробела перед `*` и `&` быть не должно (с 2025-07-31) | пресет Google в clang-format ≤ 20: `DerivePointerAlignment: true` - оставляет `int *p`, если так написано в большинстве строк файла (проверено на 18.1.3) | явные `DerivePointerAlignment: false` и `PointerAlignment: Left`: результат не зависит от версии |
| 2 | TODO: сейчас `// TODO(bug 12345): …`; с 2023-08 по 2026-09 предпочтительной была форма `// TODO: bug 12345 - …`; Python-гайд в редакции 2026-09-10 требовал форму с дефисом, а в редакции 2026-10-15 (после даты среза) тоже вернулся к скобочной форме (см. G-PY-034) | clang-tidy 18: на форму с дефисом - «missing username/bug in TODO» (проверено); clang-tidy ≥ 22.1 принимает обе; cpplint требует `TODO(my_username)` | скобочная форма: она соответствует текущему тексту гайда и проходит все версии инструментов; уверенность средняя - раздел может снова измениться |
| 3 | `#pragma once` запрещён | cpplint-форк принимает `#pragma once` как замену guard | guard по гайду; запрет проверяется `grep` или на ревью |
| 4 | файл начинается с лицензионного заголовка, но новые файлы «обычно» без строки copyright и строки автора | cpplint `legal/copyright` требует строку `Copyright [year] <owner>` | заголовок по правилам лицензии проекта (см. [`../git/repository.md`](../git/repository.md)); если строки `Copyright` в нём нет - `filter=-legal/copyright` |
| 5 | пять групп `#include`, «другие библиотеки» и «заголовки проекта» раздельно | пресет даёт три группы и сливает две последние (проверено); в примере самого гайда они тоже идут одним блоком | пресет как есть; отдельная группа для проекта - закомментированный блок `IncludeCategories` |
| 6 | фигурные скобки обязательны; форма без скобок в одну или две строки «разрешена, но не поощряется» | пресет: `AllowShortIfStatementsOnASingleLine: WithoutElse`, `AllowShortLoopsOnASingleLine: true`, `InsertBraces: false` - сам сворачивает `if (x) return;` в строку; `google-readability-braces-around-statements` бракует двухстрочную форму, которую гайд ещё допускает | пресет как есть плюс проверка clang-tidy; для нового кода - раскомментировать `InsertBraces: true` и `AllowShort…`. По умолчанию опция выключена: она меняет токены, а Abseil и GoogleTest живут на чистом пресете |
| 7 | около 40 строк на функцию - повод подумать | `google-readability-function-size`: порог 800 операторов | ревью; проверка остаётся страховкой от гигантских функций |
| 8 | целевой стандарт - C++20 | пресет: `Standard: Auto` | `Standard: c++20` |
| 9 | trailing return type - только по необходимости; `auto` - ради ясности; `const` у локальных - нейтрально | `modernize-use-trailing-return-type`, `modernize-use-auto`, `misc-const-correctness` требуют обратного | семейства целиком не включаются, проверки перечислены поимённо |
| 10 | статические объекты с нетривиальным деструктором запрещены, включая `const std::string kFoo = "foo";` | clang++ 18 с `-Wexit-time-destructors -Wglobal-constructors` в C++20 о короткой строке не предупреждает; `fuchsia-statically-constructed-objects` её находит | флаги компилятора и ревью; проверка `fuchsia-*` - необязательная |
| 11 | «Use cpplint.py» | Google публичную версию не сопровождает, каталог удалён 2024-07-08 | основа - clang-format и clang-tidy; cpplint-форк - необязательное дополнение «не Google» |
| 12 | guard оканчивается на `_`: `FOO_BAR_BAZ_H_` | `readability-identifier-naming.MacroDefinitionCase: UPPER_CASE` бракует завершающее подчёркивание (проверено на 18.1.3) | `MacroDefinitionIgnoredRegexp: '^[A-Z][A-Z0-9_]*_H_$'` |
| 13 | для локальных констант префикс `k` необязателен | `ConstexprVariablePrefix: k` в clang-tidy 18 срабатывает и на локальных `constexpr` (в 22.1.0 добавлены более тонкие опции) | опции `ConstexprVariable*` не заданы: глобальные и статические `constexpr` всё равно попадают под `GlobalConstant*`, `ClassConstant*`, `StaticConstant*` (проверено) |
| 14 | поля класса - с `_`, поля структуры - без; аксессоры могут быть в `snake_case` | `readability-identifier-naming` различает только уровень доступа и не знает, что метод - аксессор | приближение: закрытые поля с `_`, открытые без; методам разрешены `PascalCase` и `snake_case` |

Общий принцип профиля: при расхождении прав текст гайда, конфиг подстраивается или расхождение выносится на ревью.

## 10. Abseil и C++ Tips of the Week

[Abseil](https://abseil.io/about/) - открытая библиотека C++, выросшая из базовых частей внутренней кодовой базы Google (лицензия Apache-2.0, последний тег 20260817.0, требует C++17). В гайде у неё особый статус: при выборе библиотеки она стоит первой, раньше стандартной библиотеки C++ (G-CPP-068), а отдельные правила прямо называют её API:

| Задача | Что называет гайд | Правило |
|---|---|---|
| Приведение вниз и вверх по иерархии | `absl::down_cast`, `absl::implicit_cast` (`absl/base/casts.h`) | G-CPP-042, G-CPP-054 |
| Сборка и форматирование строк | `absl::StrCat`, `absl::Substitute`, `absl::StrFormat`, `absl::StreamFormat` | G-CPP-038, G-CPP-039 |
| Ошибки | `absl::Status`, `absl::StatusOr<T>` | G-CPP-035 |
| Флаги командной строки | `ABSL_FLAG`, `ABSL_DECLARE_FLAG` | - |
| Алгоритмы над контейнерами | `absl/algorithm/container.h` | - |

Правила для пользователей самой библиотеки - в [Compatibility Guidelines](https://abseil.io/about/compatibility) (G-CPP-069). В редакции 2024-02-12 гайд в нескольких местах стал предпочитать средства `std` аналогам из `absl`, так что «Abseil первой» не означает «Abseil вместо всего».

[C++ Tips of the Week](https://abseil.io/tips/) - серия внутренних заметок Google о C++, которую публикуют выборочно и с исходными номерами. Это не правила, а обоснования и идиомы; гайд ссылается на них там, где правилу нужен длинный разбор. В текущей редакции гайда упомянуты:

| Tip | Тема | Где упомянут в гайде |
|---|---|---|
| #42 | фабричные функции вместо методов инициализации | [Doing Work in Constructors](https://google.github.io/styleguide/cppguide.html#Doing_Work_in_Constructors) |
| #109 | осмысленный `const` в объявлениях функций | [Use of const](https://google.github.io/styleguide/cppguide.html#Use_of_const) |
| #116, #176 | ссылки на аргументы; возвращаемое значение вместо выходного параметра | [Inputs and Outputs](https://google.github.io/styleguide/cppguide.html#Inputs_and_Outputs) |
| #130 | имена пространств имён | [Namespace Names](https://google.github.io/styleguide/cppguide.html#Namespace_Names) |
| #140 | безопасные идиомы для констант | [Static and Global Variables](https://google.github.io/styleguide/cppguide.html#Static_and_Global_Variables) |
| #148 | наборы перегрузок | [Function Overloading](https://google.github.io/styleguide/cppguide.html#Function_Overloading) |
| #232 | когда использовать `auto` | [Type Deduction](https://google.github.io/styleguide/cppguide.html#Type_deduction) |

Дата последней публикации в серии не установлена; лицензия сайта abseil.io не проверена.

## 11. Публичный гайд и производные: Chromium, Fuchsia, AOSP

«Google style» для C++ не один. Производные гайды устроены одинаково - «следуем публичному гайду, кроме перечисленного», - но расходятся в заметных местах. Профиль берёт публичный гайд; таблица показывает, какие отклонения уже обкатаны крупными проектами Google, если какое-то из них понадобится вам. Каждое такое отклонение - «производный гайд проекта», а не основной стиль.

| Параметр | Публичный гайд Google | Chromium C++ | Fuchsia C++ |
|---|---|---|---|
| Отношение к публичному гайду | - | следует ему, кроме перечисленных исключений | следует ему, кроме перечисленных исключений |
| Целевой стандарт | C++20, C++23 нельзя | C++23 (по состоянию на 01/2026), часть возможностей запрещена списком | на странице не указан |
| Длина строки | 80 | 80 | 100 |
| Фигурные скобки | обязательны; однострочная форма без скобок разрешена, но не поощряется | `{}` на всех условиях и циклах | скобки обязательны, если тело длиннее строки; однострочные формы запрещены |
| `*` и `&` | у типа (с 2025-07-31) | у типа | - |
| Объявления вперёд | избегать; для чужих сущностей запрещены | предпочтительнее `#include` (прямо названо отличием от гайда Google) | - |
| Запреты сверх гайда | - | `std::function`, `std::shared_ptr`, `std::weak_ptr`, `std::bind`, `<chrono>`, `<regex>`, `<exception>`, библиотека потоков, `std::any`, `<format>`, `<span>` | вложенные namespace (кроме `internal` и кода FIDL) |
| Abseil | первая в приоритете | большая часть запрещена: `StatusOr`, `string_view`, Strings, Synchronization, Time, flags, log-макросы, `Span`, `Variant` и др. | - |
| UTF-16 и широкие символы | не использовать | UTF-16 используется широко | - |
| Множественное наследование | наследование реализации настоятельно не рекомендуется | разрешено, но не поощряется | - |
| Поля-указатели | обычные указатели, владение - `std::unique_ptr` | `raw_ptr<T>` и `raw_ref<T>` | - |
| Тесты | `foo_test.cc`; `_unittest` устарел | суффикс `_unittest.cc` сохранён; функции только для тестов - с суффиксом `ForTesting` (проверяет PRESUBMIT.py) | - |
| Аксессоры | могут быть в `snake_case` | простые встроенные аксессоры - `snake_case()` | - |
| TODO | `TODO(контекст)` | `TODO(crbug.com/…)` или `TODO(username)` | `TODO(https://fxbug.dev/…)` |
| Правила `#include` | пути от корня проекта, пять групп | свои `IncludeCategories` | системные и библиотечные - `<lib/fdio/fd.h>`, свои - в кавычках с путём от корня |
| Форматтер | clang-format, `BasedOnStyle: Google` | `BasedOnStyle: Chromium` плюс `Standard: Latest`, `InsertBraces: true`, `InsertNewlineAtEOF: true`; вывод clang-format на ревью принимается всегда | `clang-format -style=file -fallback-style=Google`, clang-tidy; общие команды `fx format-code`, `fx lint` |
| Прочее | - | слово «Chromium» в коде не используется (пишут «Chrome»); логирование перед коммитом удаляется | не добавлять `-Wall` и `-Wextra` |

Пресет `Chromium` в clang-format - это пресет `Google` с `AllowShortIfStatementsOnASingleLine: Never`, `AllowShortLoopsOnASingleLine: false`, `AllowShortFunctionsOnASingleLine: Inline` и одним параметром на строку.

Источники таблицы: [Chromium C++ style](https://chromium.googlesource.com/chromium/src/+/main/styleguide/c++/c++.md) и [Modern C++ use in Chromium](https://chromium.googlesource.com/chromium/src/+/main/styleguide/c++/c++-features.md) (в тексте пометка «as of 01/2026»; даты изменения файлов не определены; лицензия Chromium, BSD-подобная), [`.clang-format` Chromium](https://chromium.googlesource.com/chromium/src/+/main/.clang-format), [Fuchsia C++ style](https://fuchsia.dev/fuchsia-src/development/languages/c-cpp/cpp-style) и [Fuchsia: lint and format](https://fuchsia.dev/fuchsia-src/development/languages/lint_and_format) (обе страницы обновлены 2025-02-28; лицензия не проверена). Тип источника - производный гайд проекта, уверенность высокая. Прочерк означает, что на изученной странице тема не раскрыта.

**AOSP.** Отдельного C++-гайда платформы Android в изученных источниках нет - публичных данных не найдено. Страница [AOSP code style](https://source.android.com/docs/setup/contribute/code-style) описывает Java. Известно только, что [repohooks](https://android.googlesource.com/platform/tools/repohooks/+/refs/heads/main/README.md) содержит встроенные хуки `clang_format` и `cpplint`.

Blink C++ (внутри Chromium) не разбирался.

## 12. Матрица «инструмент / ручное ревью»

Единица подсчёта - правило этого документа. «Целиком» - строка «Проверка» не содержит оговорок; «частично» - начинается со слова «частично»; «ревью» - «ручное ревью».

| Раздел | Правил | Целиком | Частично | Только ревью |
|---|---|---|---|---|
| 1. Форматирование | 8 | 5 | 2 | 1 |
| 2. Именование | 9 | 2 | 5 | 2 |
| 3. Структура файлов и include | 11 | 1 | 8 | 2 |
| 4. Комментарии | 5 | 0 | 3 | 2 |
| 5. Ошибки, логирование, типы | 17 | 4 | 8 | 5 |
| 6. Запреты и ограничения | 19 | 4 | 8 | 7 |
| 7. Тесты | 3 | 2 | 0 | 1 |
| 8. Стандарт языка | 1 | 1 | 0 | 0 |
| **Всего** | **73** | **19 (26 %)** | **34 (47 %)** | **20 (27 %)** |

Какой инструмент сколько правил затрагивает (правило может попасть в несколько строк):

| Инструмент | Правил | Какие |
|---|---|---|
| clang-format (конфиг профиля) | 8 | G-CPP-001…004, 006, 022, 024, 073 |
| Флаги компилятора | 10 | G-CPP-034, 035, 042, 051, 058, 059, 060, 064, 066, 073 |
| clang-tidy `google-*` | 13 на 18.1.3; 14 с 22.1.0 | G-CPP-005, 024, 025, 028, 032, 040, 042, 046, 052, 056, 067, 070, 072; с 22.1.0 - 041 |
| clang-tidy `readability-identifier-naming` | 7 | G-CPP-011…017 |
| clang-tidy, другие семейства (включённые в конфиг) | 15 | G-CPP-004, 005, 006, 021, 023, 031, 036, 037, 043, 044, 049, 055, 066, 067, 069 (069 и часть 021 - проверки `abseil-*`) |
| cpplint 2.0.2 (необязательный, не Google) | 24 | G-CPP-001…003, 005, 006, 008, 018…022, 024, 025, 029, 032, 039, 040, 042, 046, 051, 052, 055, 063, 064; без другой проверки из конфигов профиля - 008, 018, 019, 020, 029, 039, 063 |
| Только ручное ревью | 20 | G-CPP-007, 009, 010, 026, 027, 030, 033, 038, 045, 047, 048, 050, 053, 054, 057, 061, 062, 065, 068, 071 |

Что из этого следует:

- Форматирование автоматизируется почти полностью; правила проектирования - владение, `auto`, rvalue-ссылки, `struct` против `class`, комментарии по существу - остаются за ревью.
- Собственно `google-*` целиком закрывают немного правил: большую часть категории «целиком» дают clang-format, компилятор и настроенный `readability-identifier-naming`.
- Доли зависят от отбора правил: при подсчёте по всем мелким правилам форматирования гайда доля автоматизации была бы выше. Внутренние проверки Google публично недоступны, поэтому реальная доля автоматизации внутри компании неизвестна.
