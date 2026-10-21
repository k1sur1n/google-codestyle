# Структура ML-проекта, конфиги экспериментов, типы и docstrings - профиль Google

> Данные актуальны на 2026-10-09.

Нормативного документа Google о том, как раскладывать ML-проект по каталогам, нет: Google Python Style Guide не содержит ни одного ML-специфичного правила, а общего гайда у google-research и google-deepmind публичных данных не найдено. Профиль поэтому собран из трёх слоёв: письменные принципы (Rules of Machine Learning, статья «Hidden Technical Debt in Machine Learning Systems», гайды проектов TensorFlow и Keras), практика репозиториев Google с измеренными долями (примеры Flax, монорепозиторий google-research) и общепринятые альтернативы с пометкой «не Google» для оставшихся пробелов. Для конфигов экспериментов профиль берёт связку absl + ml_collections; gin-config остаётся только для существующего кода, Fiddle описан как альтернатива. Почти все правила здесь - SHOULD: источники формулируют их как рекомендации.

Соседние документы: ноутбуки - [notebooks.md](notebooks.md); сиды, окружение и трекинг - [reproducibility.md](reproducibility.md); пайплайны, CI/CD, ML Test Score, реестр моделей, мониторинг и список того, что нельзя коммитить, - [mlops.md](mlops.md); правила работы с TensorFlow, Keras, JAX и Flax - [libraries.md](libraries.md); общий стиль Python - [../languages/python.md](../languages/python.md).

## 1. Что опубликовано, а чего нет

| Тема | (а) Письменные источники Google | (б) Практика репозиториев Google | (в) Альтернатива «не Google» |
|---|---|---|---|
| Раскладка каталогов | публичных данных не найдено | единый шаблон примеров Flax; в google-research общего шаблона нет, есть только типовой набор файлов (доли - в разделе 2) | Cookiecutter Data Science v2 |
| Граница research / production | Rules of ML (правила №4, №5, №22, №32); «Hidden Technical Debt» (glue code, dead experimental codepaths, prototype smell); уровни MLOps в документации Google Cloud | исследовательский код живёт в отдельном монорепозитории google-research с мягкими требованиями, библиотеки - в своих репозиториях с CI и тестами | - |
| Конфиги экспериментов | принципы конфигурации из «Hidden Technical Debt» §6; документация gin-config, ml_collections, Fiddle, absl. Рекомендации, какую библиотеку выбирать, публичных данных не найдено | Flax - ml_collections; Dopamine, Trax, T5X - gin; T5X - ещё и Fiddle | Hydra, OmegaConf (в исследовании не разбирались) |
| Типизация тензоров | `jax.typing` (типы массивов без форм). Соглашения о записи форм в аннотациях или именах - публичных данных не найдено | runtime-проверки Chex в коде DeepMind | jaxtyping |
| Docstrings | Google Python Style Guide (общий формат); TensorFlow code style (формы и dtype в описаниях); Keras API design guidelines | - | - |
| Форматирование ML-кода | Google Python Style Guide: 4 пробела | TensorFlow, JAX, Flax, Optax, Chex, Orbax - 2 пробела; Keras - 4 (раздел 8) | - |

Статусы источников, на которые опираются правила:

- [Rules of Machine Learning](https://developers.google.com/machine-learning/guides/rules-of-ml) - живой гайд, обновлён 2025-08-25, CC BY 4.0.
- [«Hidden Technical Debt in Machine Learning Systems»](https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf) - статья сотрудников Google, NIPS 2015, не обновляется, открытой лицензии нет. Обязательных формулировок в ней нет, поэтому все правила из неё - SHOULD.
- [Keras API design guidelines](https://github.com/keras-team/governance/blob/master/keras_api_design_guidelines.md) - добавлен 2020-05-29, последняя правка 2022-02-12, сам называет себя «guidelines, not rules»; лицензия в репозитории не указана. Источник не обновляется.
- [«Best Practices for Managing Keras Projects on GitHub»](https://github.com/keras-team/governance/blob/master/project_setup_best_practices.md) - последний коммит 2023-06-07; описывает black, isort и flake8, тогда как репозиторий `keras` перешёл на ruff. Источник устарел; здесь он нужен только как подтверждение расположения тестов.
- [TensorFlow code style](https://www.tensorflow.org/community/contribute/code_style) - страница датирована 2021-04-08, исходный файл правился 2024-07-24.

## 2. Каркас проекта

Профиль рекомендует раскладку, которая повторяет шаблон примеров Flax, и добавляет к ней два каталога из Cookiecutter Data Science - они помечены.

```text
<project>/
├── README.md             # что это, команда запуска, ожидаемый результат
├── pyproject.toml        # пакет и настройки инструментов
├── requirements.txt      # закреплённые зависимости (см. reproducibility.md)
├── configs/
│   └── default.py        # get_config() -> ml_collections.ConfigDict
├── <package>/
│   ├── main.py           # флаги absl и app.run(main); логики нет
│   ├── train.py          # train_and_evaluate(config, workdir)
│   ├── train_test.py     # тест лежит рядом с кодом
│   ├── input_pipeline.py # загрузка и препроцессинг, общие для обучения и serving
│   ├── models.py
│   └── models_test.py
├── notebooks/            # не Google: исследовательские ноутбуки (см. notebooks.md)
├── MODEL_CARD.md         # см. ../../templates/ml/MODEL_CARD.md
└── .gitignore            # не Google: data/, каталоги запусков (см. mlops.md)
```

Запуск: `python -m <package>.main --workdir=/tmp/run1 --config=configs/default.py`.

### Как выглядят репозитории Google на самом деле

**Примеры Flax** (`google/flax`, каталог `examples/`, коммит `6c9494b` от 2026-10-07; подсчёт автора профиля по клону). README каталога объясняет решение: все примеры, включая простейший MNIST, устроены одинаково, чтобы, разобравшись в одном, читатель знал структуру остальных ([examples/README.md](https://github.com/google/flax/blob/main/examples/README.md)).

| Признак | Каталогов из 14 в `examples/` |
|---|---|
| `configs/` и исполняемый модуль с `config_flags.DEFINE_config_file(..., lock_config=True)` | 11 |
| пара `main.py` + `train.py` (в `ppo` - `ppo_main.py` + `ppo_lib.py`) | 11 |
| `README.md` | 12 |
| `requirements.txt` | 12 |
| хотя бы один `*_test.py` | 10 |
| `input_pipeline.py` | 9 |
| `models.py` | 9 |
| ноутбук рядом с кодом | 5 |

Оставшиеся три каталога (`cloud`, `linen_design_test`, `nnx_toy_examples`) - не обучающие примеры этого вида; ниже «примеры Flax с конфигом» означает эти 11.

**google-research** (монорепозиторий исследовательского кода, коммит `72ffe35` от 2026-10-08, 755 каталогов-проектов верхнего уровня, 23 236 путей). CONTRIBUTING требует только CLA и ревью через pull request; стилевых требований в нём нет ([CONTRIBUTING.md](https://github.com/google-research/google-research/blob/master/CONTRIBUTING.md)). README предупреждает: «This is not an official Google product».

| Что есть в каталоге проекта | Проектов из 755 | Доля |
|---|---|---|
| README в корне проекта | 735 | 97 % |
| `requirements.txt` в корне проекта | 468 | 62 % |
| `run.sh` | 288 | 38 % |
| хотя бы один `*_test.py` | 220 | 29 % |
| хотя бы один `.ipynb` | 186 | 25 % |
| каталог `configs/` (на любом уровне) | 89 | 12 % |
| `setup.py` или `pyproject.toml` | 47 | 6 % |
| файлы `.gin` | 42 | 6 % |
| собственный файл LICENSE | 0 | 0 % |

Интерпретация: требования к исследовательскому коду у Google заметно мягче, чем к библиотекам. Де-факто стандарт google-research - «README + список зависимостей + скрипт запуска»; тесты есть меньше чем у трети проектов, упаковка - у 6 %. Граница «исследовательский код → продакшен» проходит между репозиториями (google-research против `flax`, `jax`, `optax`, `keras`), а не внутри одного. Профиль переносит эту границу внутрь репозитория правилом G-ML-004.

**Cookiecutter Data Science v2 - не Google** ([сайт](https://cookiecutter-data-science.drivendata.org/), v2.3.0 от 2025-07-23). Закрывает то, о чём Google молчит: каталоги `data/{raw,interim,processed,external}` (сырые данные неизменяемы и не хранятся в git), `notebooks/`, `models/`, `reports/`. Профиль берёт оттуда только `notebooks/` и запись `data/` в `.gitignore`; остальное - по желанию команды.

## 3. Правила: структура проекта

### G-ML-001 · SHOULD · Точка входа - короткий исполняемый модуль на absl: он объявляет флаги и вызывает библиотечную функцию, а вся логика обучения лежит в импортируемых модулях
- Проверка: ручное ревью (ориентир: в `main.py` нет определений моделей, циклов обучения и работы с данными).
- Источник: [flax/examples/mnist/main.py](https://github.com/google/flax/blob/main/examples/mnist/main.py) (коммит `6c9494b`, 2026-10-07) · практика, выведенная из репозиториев (11 из 14 каталогов `examples/` во Flax) · средняя · реконструкция.
- Пример: docstring этого файла объясняет мотив - файл намеренно короткий, чтобы логику можно было тестировать и импортировать в Colab. Полный пример - в разделе 5.3. Общее правило о `main()` - G-PY-024 в [../languages/python.md](../languages/python.md).

### G-ML-002 · SHOULD · Каждый проект или эксперимент самодостаточен и собран по одному шаблону: README с командой запуска и ожидаемым результатом, `configs/`, точка входа, библиотечные модули, тесты и файл зависимостей
- Проверка: частично: CI-шаг проверяет наличие `README.md`, `configs/` и файла зависимостей в каталоге проекта; содержание README - ручное ревью.
- Источник: [flax/examples/README.md](https://github.com/google/flax/blob/main/examples/README.md) (2026-10-07) · практика, выведенная из репозиториев (Flax: 11 из 14; google-research: README у 735 из 755 проектов, `requirements.txt` у 468, тесты у 220) · средняя · реконструкция.

Расположение тестов задаёт Python-профиль: тест лежит рядом с кодом в файле `<модуль>_test.py` (G-PY-061 в [../languages/python.md](../languages/python.md)). Проекты TensorFlow и Keras требуют того же и добавляют: новая функциональность и исправления багов приходят вместе с тестами ([TensorFlow CONTRIBUTING.md](https://github.com/tensorflow/tensorflow/blob/master/CONTRIBUTING.md), 2026-10-08; [«Best Practices for Managing Keras Projects on GitHub»](https://github.com/keras-team/governance/blob/master/project_setup_best_practices.md), 2023-06-07, не обновляется). В исследовательском коде это правило соблюдается слабо: тесты есть у 220 из 755 проектов google-research.

### G-ML-003 · SHOULD · Всё, что порождает запуск (чекпойнты, журналы метрик, сохранённый конфиг), пишется в отдельный рабочий каталог запуска, заданный флагом, - вне дерева исходников
- Проверка: частично: каталоги запусков перечислены в `.gitignore`; остальное - ручное ревью.
- Источник: [flax/examples/mnist/README.md](https://github.com/google/flax/blob/main/examples/mnist/README.md) (2026-10-07) · практика, выведенная из репозиториев (флаг `workdir` в 10 из 11 примеров Flax с конфигом) · средняя · реконструкция; [Best practices for implementing ML on Google Cloud, чекпойнты](https://docs.cloud.google.com/architecture/ml-on-gcp-best-practices#use-training-checkpoints-to-save-the-current-state-of-your-experiment) (ревизия 2024-09-09) · официальный гайд · высокая.
- Пример: в MNIST-примере Flax датасет скачивается через TFDS при запуске, а рабочий каталог эталонного запуска лежит в бакете Cloud Storage; документ Google Cloud советует отдельную папку на каждый эксперимент или запуск. Что именно нельзя коммитить - правила G-MLOPS-002 - G-MLOPS-005 в [mlops.md](mlops.md).

## 4. Правила: граница между исследовательским и продакшен-кодом

Факты. Rules of ML описывает путь «простая модель на правильной инфраструктуре → усложнение». «Hidden Technical Debt» называет признаками долга обвязочный код вокруг чужих пакетов (glue code), накопившиеся экспериментальные ветки (dead experimental codepaths) и постоянную опору на прототипную среду (prototype smell). Документ Google Cloud об уровнях MLOps относит процесс «на скриптах и ноутбуках» к уровню 0 ([MLOps: Continuous delivery and automation pipelines in machine learning](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), ревизия 2024-08-28).

Интерпретация: явного правила «вот здесь кончается исследовательский код» у Google нет; правила ниже - перенос этих принципов и практики репозиториев на один git-репозиторий. Два соседних правила из тех же источников записаны в [mlops.md](mlops.md) и здесь не повторяются: общий код преобразования признаков для обучения и serving (G-MLOPS-011, Rules of ML №32) и тестирование инфраструктуры отдельно от модели (G-MLOPS-013, Rules of ML №5). Их структурное следствие видно в каркасе из раздела 2: препроцессинг живёт в одном модуле `input_pipeline.py`, который импортируют и обучение, и сервис.

### G-ML-004 · SHOULD · Исследовательский и продакшен-код разделены каталогами или пакетами; продакшен-код не импортирует исследовательские каталоги и ноутбуки, а у исследовательского каталога есть минимум: README, файл зависимостей, команда запуска
- Проверка: частично: import-linter (не Google) или поиск импортов в CI; состав каталога - CI-шаг из G-ML-002; остальное - ручное ревью.
- Источник: [google-research README](https://github.com/google-research/google-research/blob/master/README.md) и [CONTRIBUTING.md](https://github.com/google-research/google-research/blob/master/CONTRIBUTING.md) (коммит `72ffe35`, 2026-10-08) · практика, выведенная из репозиториев (README у 735 из 755 проектов, `requirements.txt` у 468, `run.sh` у 288) · средняя · реконструкция.

### G-ML-005 · SHOULD · Первая версия - простая модель: сначала отлаживается инфраструктура пайплайна, усложнение модели идёт потом
- Проверка: ручное ревью дизайна (ориентир: до первой сложной модели есть работающие загрузка данных, обучение, оценка и экспорт).
- Источник: [Rules of ML, правило №4](https://developers.google.com/machine-learning/guides/rules-of-ml#ml_phase_i_your_first_pipeline) (обновлено 2025-08-25) · официальный гайд · высокая.

### G-ML-006 · SHOULD · Экспериментальные ветки кода и флаги экспериментов периодически пересматриваются и удаляются
- Проверка: ручное ревью; поиск неиспользуемых флагов и полей конфигов.
- Источник: [«Hidden Technical Debt», §5 «Dead experimental codepaths»](https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf) (NIPS 2015) · книга, статья или доклад · высокая.
- Пример: статья приводит цену таких веток - потери Knight Capital в 2012 году. Удаление неиспользуемых признаков - G-MLOPS-024 в [mlops.md](mlops.md).

### G-ML-007 · SHOULD · Сторонний ML-пакет вызывается через один модуль-адаптер с API проекта, а не напрямую из многих мест
- Проверка: частично: import-linter (не Google) или поиск импортов пакета вне адаптера; остальное - ручное ревью.
- Источник: [«Hidden Technical Debt», §5 «Glue code»](https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf) (NIPS 2015) · книга, статья или доклад · средняя · реконструкция (статья советует оборачивать «чёрные ящики» в общие API; формулировка про один модуль - наша).

Момент, когда код из ноутбука обязан переехать в модули, описан правилами G-NB-011 и G-NB-012 в [notebooks.md](notebooks.md).

## 5. Конфиги экспериментов

### 5.1. Статус инструментов

| Инструмент | Что это | Статус на 2026-10-09 | Кто использует (проверено по файлам зависимостей и примерам) | В профиле |
|---|---|---|---|---|
| [absl-py](https://github.com/abseil/abseil-py) (`app`, `flags`) | точка входа и флаги командной строки | активен: v2.5.1 от 2026-10-09; [гайд по флагам](https://abseil.io/docs/python/guides/flags) на abseil.io с футером 2017 года | Flax, Kauldron, Scenic, Dopamine, Trax, T5X, paxml; 270 из 468 `requirements.txt` в google-research | основа: `app.run(main)` и флаги |
| [ml_collections](https://github.com/google/ml_collections) (`ConfigDict`, `config_flags`) | конфиг - Python-файл с `get_config()`, типобезопасные оверрайды из CLI | активен: v1.1.0 от 2025-04-17, HEAD 2026-07-07; Apache-2.0 | примеры Flax (11 из 14), Kauldron; 49 из 468 `requirements.txt` в google-research | выбор по умолчанию |
| [Fiddle](https://github.com/google/fiddle) | конфиг - граф вызовов Python; библиотечный код о конфигурации не знает | активен: PyPI 0.3.0 от 2024-04-09, HEAD 2026-10-05 (`version.py`: 0.3.1); Apache-2.0 | T5X; 3 из 468 `requirements.txt` в google-research | альтернатива, когда нужна глубокая конфигурируемость |
| [gin-config](https://github.com/google/gin-config) | DSL `.gin` и dependency injection через декораторы | репозиторий жив (коммит 2026-10-05), но последний релиз на PyPI - 0.5.0 от 2021-11-03 с классификаторами Python 2.7 и 3.5-3.7; README: «This is not an official Google product»; Apache-2.0 | Dopamine, Trax, T5X; файлы `.gin` в 42 из 755 проектов google-research, `gin-config` в 44 из 468 `requirements.txt` | только существующий код (G-ML-013) |
| собственные системы | `official/modeling/hyperparams` в TensorFlow Model Garden; именованные конфигурации в Python-модулях Pax | живут внутри своих проектов | TensorFlow Model Garden, paxml | не переносятся |
| Hydra, OmegaConf - не Google | YAML-конфиги с композицией | в исследовании не разбирались | 0 из 468 `requirements.txt` в google-research | не входят в профиль |

Доли по `requirements.txt` - подсчёт автора профиля по 468 файлам `requirements.txt` в корнях проектов google-research (коммит `72ffe35`, 2026-10-08); проект может использовать библиотеку и без записи в этом файле, поэтому доли - нижняя оценка.

Ни одна из трёх библиотек не объявлена стандартом: официальной рекомендации Google, какую выбирать, и заявления о том, что gin устарел, публичных данных не найдено.

### 5.2. Что берёт профиль и почему

Конфликт. Три инструмента расходятся в главном - где живёт конфигурация и знает ли о ней библиотечный код:

- **gin**: значения лежат вне Python, в `.gin`-файле, и внедряются в функции через декораторы. Цена - слабая поддержка статического анализа и рефакторинга; два биндинга одного параметра молча перезаписывают друг друга, и для разных значений нужны scope ([gin docs, Scoping](https://github.com/google/gin-config/blob/master/docs/index.md#scoping)).
- **ml_collections**: конфиг - обычный Python-файл, возвращающий словарь с доступом через точку; объект `config` передаётся в код обучения.
- **Fiddle**: конфиг описывает, какие функции и классы с какими аргументами вызвать; бизнес-логика остаётся чистым Python без зависимости от Fiddle ([«How to structure your code»](https://github.com/google/fiddle/blob/main/docs/flags_code_lab.md#how-to-structure-your-code)).

Профиль берёт **absl + ml_collections**. Причины: у ml_collections есть свежие релизы; это самый частый вариант в актуальных JAX/Flax-примерах Google; конфиг остаётся Python-кодом, который проверяют линтер и тайп-чекер; оверрайды из командной строки типобезопасны, а блокировка ловит опечатки в именах полей. Это хорошо ложится на принципы «Hidden Technical Debt» §6: конфигурацию легко задать как небольшое изменение предыдущей, в ней трудно ошибиться, две конфигурации легко сравнить.

Интерпретация: у выбора есть слабое место - ml_collections поощряет протаскивать объект `config` вглубь кода, а Fiddle и Keras API design guidelines советуют обратное. Профиль снимает противоречие правилом G-ML-011: `config` живёт только на верхнем уровне (`main.py`, `train.py`) и там разворачивается в явные аргументы. Если проекту нужно конфигурировать глубоко вложенные объекты, берите Fiddle - он построен вокруг этого принципа.

Подводный камень ml_collections: типы (например, dataclass), объявленные на уровне модуля конфиг-файла, ломают pickle-сериализацию, потому что конфиг-файл загружается не обычным импортом; такие типы объявляют внутри `get_config()` ([README, Config Flags](https://github.com/google/ml_collections/blob/master/README.md#config-flags)).

### 5.3. Правила

### G-ML-008 · SHOULD · Конфигурации экспериментов лежат в репозитории и проходят то же код-ревью, что и код
- Проверка: частично: защита ветки и обязательное ревью (G-CR-001 в [../git/code-review.md](../git/code-review.md)); то, что запуск для отчёта не использовал незакоммиченный конфиг, - ручное ревью.
- Источник: [«Hidden Technical Debt», §6 «Configuration Debt»](https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf) (NIPS 2015) · книга, статья или доклад · высокая; [«The ML Test Score», тест Model 1](https://storage.googleapis.com/pub-tools-public-publication-data/pdf/aad9f93b86b7addfea4c419b9100c6cdd26cacea.pdf) (IEEE Big Data 2017) · книга, статья или доклад · высокая.

### G-ML-009 · SHOULD · Конфиг эксперимента - Python-файл с функцией `get_config()`, возвращающей `ml_collections.ConfigDict`; он подключается через `config_flags.DEFINE_config_file`, а отдельные поля переопределяются из командной строки
- Проверка: ручное ревью (ориентир: в `configs/*.py` есть `get_config`; гиперпараметры не захардкожены в `train.py`).
- Источник: [ml_collections README, Config Flags](https://github.com/google/ml_collections/blob/master/README.md#config-flags) (v1.1.0, 2025-04-17) · конфиг или инструмент · высокая; [flax/examples/mnist/configs/default.py](https://github.com/google/flax/blob/main/examples/mnist/configs/default.py) (2026-10-07) · практика, выведенная из репозиториев (11 из 14 каталогов `examples/` во Flax) · высокая.
- Пример:

```python
# хорошо: configs/default.py
"""Default hyperparameter configuration."""

import ml_collections


def get_config() -> ml_collections.ConfigDict:
    config = ml_collections.ConfigDict()
    config.seed = 0
    config.learning_rate = 0.1
    config.batch_size = 128
    config.num_epochs = 10
    return config
```

```shell
python -m my_project.main --workdir=/tmp/run1 \
    --config=configs/default.py --config.learning_rate=0.05
```

### G-ML-010 · SHOULD · Загруженный конфиг заблокирован от добавления новых полей (`lock_config=True` или `.lock()`); там, где конфиг не должен меняться вовсе, используется `FrozenConfigDict`
- Проверка: частично: поиск `lock_config=False` в исполняемых модулях; остальное - ручное ревью.
- Источник: [ml_collections README, Locking and copying](https://github.com/google/ml_collections/blob/master/README.md#locking-and-copying) (v1.1.0, 2025-04-17) · конфиг или инструмент · высокая; [flax/examples/mnist/main.py](https://github.com/google/flax/blob/main/examples/mnist/main.py) (2026-10-07) · практика, выведенная из репозиториев (11 из 11 примеров Flax с конфигом передают `lock_config=True`) · высокая.
- Пример: блокировка превращает опечатку в ошибку.

```python
# плохо: без блокировки опечатка молча создаёт новое поле
config.learnign_rate = 0.05

# хорошо: после config.lock() та же строка поднимает исключение
# с подсказкой правильного имени поля
```

### G-ML-011 · SHOULD · Библиотечный код не знает о системе конфигурации: модели, слои и функции принимают явные аргументы, а объект конфига разворачивается в них на верхнем уровне
- Проверка: частично: import-linter (не Google) или поиск импортов `ml_collections`, `gin`, `fiddle`, `absl.flags` в библиотечных пакетах; сигнатуры - ручное ревью.
- Источник: [Fiddle, «How to structure your code»](https://github.com/google/fiddle/blob/main/docs/flags_code_lab.md#how-to-structure-your-code) (HEAD 2026-10-05) · конфиг или инструмент · высокая.
- Пример: ту же мысль со стороны API слоёв - явные одноуровневые аргументы вместо словаря гиперпараметров - задаёт G-LIB-014 в [libraries.md](libraries.md).

```python
# плохо: слой зависит от формы конфига и не читается без него
class Encoder:
    def __init__(self, config):
        self.num_layers = config.model.encoder.num_layers


# хорошо: явные одноуровневые аргументы; config разворачивается в train.py
class Encoder:
    def __init__(self, num_layers: int, hidden_size: int, dropout: float = 0.1):
        self.num_layers = num_layers


encoder = Encoder(
    num_layers=config.num_layers,
    hidden_size=config.hidden_size,
)
```

### G-ML-012 · SHOULD · Флаги absl объявляются в исполняемом модуле; библиотечные модули не объявляют и не читают флаги, а значения флагов не читаются при импорте и в значениях аргументов по умолчанию
- Проверка: частично: поиск `flags.DEFINE_` вне `main.py` и `*_main.py`; остальное - ручное ревью.
- Источник: [flax/examples](https://github.com/google/flax/tree/main/examples) (2026-10-07) · практика, выведенная из репозиториев (в 9 из 11 примеров Flax с конфигом флаги объявлены только в исполняемом модуле) · средняя · реконструкция; [absl flags guide](https://abseil.io/docs/python/guides/flags) (футер 2017) · конфиг или инструмент · высокая; [Google Python Style Guide, §2.12](https://google.github.io/styleguide/pyguide.html#s2.12-default-argument-values) (редакция 2026-09-10) · официальный гайд · высокая.
- Пример: это расхождение гайда и практики. Гайд absl описывает обратную модель - каждый модуль объявляет нужные ему флаги - и предупреждает только, что имена флагов глобальны, а разбираются флаги в `app.run()`, не при импорте. Профиль берёт практику Flax и схему Fiddle (флаги только в Main): глобальные имена конфликтуют при импорте, а библиотека с флагами плохо тестируется и не импортируется в ноутбук. Запрет читать флаг в аргументе по умолчанию - правило G-PY-051 в [../languages/python.md](../languages/python.md); запуск через `app.run(main)` - G-PY-024 там же.

```python
# хорошо: <package>/main.py
"""Entry point: parses flags and runs training."""

from collections.abc import Sequence

from absl import app
from absl import flags
from ml_collections import config_flags

from my_project import train

# required=True сужает тип _WORKDIR.value до str для mypy и pyright.
_WORKDIR = flags.DEFINE_string(
    'workdir', None, 'Directory for run outputs.', required=True
)
_CONFIG = config_flags.DEFINE_config_file(
    'config', None, 'Path to the experiment configuration.', lock_config=True
)


def main(argv: Sequence[str]) -> None:
    """Runs training with the flag-provided config and output directory."""
    if len(argv) > 1:
        raise app.UsageError('Too many command-line arguments.')
    train.train_and_evaluate(_CONFIG.value, _WORKDIR.value)


if __name__ == '__main__':
    flags.mark_flag_as_required('config')
    app.run(main)
```

### G-ML-013 · SHOULD · В существующем коде на gin-config: один корневой `@gin.configurable`, остальные функции и классы регистрируются через `@gin.register`, а operative config запуска сохраняется рядом с результатами
- Проверка: ручное ревью; наличие сохранённого operative config в каталоге запуска.
- Источник: [gin docs, «Using `gin.register`»](https://github.com/google/gin-config/blob/master/docs/index.md#using-ginregister) и [«Retrieving "operative" parameter values»](https://github.com/google/gin-config/blob/master/docs/index.md#retrieving-operative-parameter-values) (документация правилась 2024-12-04; релизы на PyPI не обновляются с 0.5.0 от 2021-11-03) · конфиг или инструмент · высокая.
- Пример: operative config - значения параметров всех реально вызванных configurable-функций, включая значения по умолчанию; его возвращает `gin.operative_config_str()`. Новый код на gin профиль не рекомендует: это решение профиля, а не позиция Google.

## 6. Типизация данных и тензоров

Общие правила аннотаций - в [../languages/python.md](../languages/python.md). Google Python Style Guide упоминает тензоры только в примере псевдонима типа (`tuple[tf.Tensor, tf.Tensor]`, [§3.19.6](https://google.github.io/styleguide/pyguide.html#s3.19.6-type-aliases)); слова ML, JAX, Colab и notebook в гайде не встречаются.

Чего нет: официального соглашения Google о записи форм тензоров в аннотациях, комментариях или суффиксах имён публичных данных не найдено. `jax.typing` описывает только «массив или не массив», без ранга, формы и dtype. Альтернатива «не Google» - библиотека [jaxtyping](https://github.com/patrick-kidger/jaxtyping) (аннотации вида `Float[Tensor, "dim1 dim2"]`, проверяемые во время выполнения через typeguard или beartype); в документации JAX она не упоминается, и в профиль не входит.

Проверка типов: Python-гайд называет pytype, но `google/pytype` в архиве с 2026-09-03; профиль использует mypy с пометкой «не Google» (G-PY-042 в [../languages/python.md](../languages/python.md)). Сами ML-репозитории Google расходятся: JAX проверяет типы хуком Pyrefly (`pyrefly-check`, v1.3.2), а в Orbax всё ещё стоит хук pytype.

Аннотации для массивов JAX (входы - `jax.typing.ArrayLike`, выходы - `jax.Array`, без `list` и `tuple` вместо массивов) записаны правилом G-LIB-022 в [libraries.md](libraries.md); источник - [«JAX Typing Best Practices»](https://docs.jax.dev/en/latest/jax.typing.html#jax-typing-best-practices).

### G-ML-014 · SHOULD · Формы, ранги и dtype, которые аннотация выразить не может, проверяются во время выполнения - на границах функций и в тестах
- Проверка: тесты в CI (например, `chex.assert_shape`, `chex.assert_rank`, `chex.assert_type`, `chex.assert_tree_all_finite`); наличие самих проверок - ручное ревью.
- Источник: [chex README](https://github.com/google-deepmind/chex/blob/master/README.md) (v0.1.92, 2026-06-12) · конфиг или инструмент · средняя · реконструкция (Chex - инструмент DeepMind, а не предписание Google).
- Пример: функции `chex.assert_*` - не оператор `assert`, поэтому правила об `assert` (G-PY-037 в [../languages/python.md](../languages/python.md), G-LIB-015 в [libraries.md](libraries.md)) они не нарушают.

### G-ML-015 · SHOULD · Гиперпараметры, батчи и результаты передаются типизированными структурами (dataclass, `NamedTuple`, `ConfigDict`), а не голыми `dict`, числами и безымянными кортежами
- Проверка: частично: тайп-чекер профиля; остальное - ручное ревью.
- Источник: [«Hidden Technical Debt», §5, «plain-old-data type smell»](https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf) (NIPS 2015) · книга, статья или доклад · средняя · реконструкция (статья называет проблему; перечень структур - наш).

## 7. Docstrings

Формат docstring (секции `Args:`, `Returns:`, `Raises:`) задаёт Python-гайд - правила G-PY-026 - G-PY-030 в [../languages/python.md](../languages/python.md). Ниже только то, что добавляют ML-проекты Google.

Конфликт источников. Keras API design guidelines предписывают описывать аргументы конструктора в docstring класса, а не `__init__`. Google Python Style Guide ([§3.8.4](https://google.github.io/styleguide/pyguide.html#s3.8.4-comments-in-classes)) документирует `__init__` собственным docstring с секцией `Args:`. Профиль следует Python-гайду как более общему и обновляемому источнику; вариант Keras уместен только при вкладе в сам Keras.

### G-ML-016 · SHOULD · Docstring функции, работающей с тензорами, для каждого аргумента и результата называет тип и смысл, а также допустимые формы, dtype и ранги; форма пишется в квадратных скобках в обратных кавычках
- Проверка: частично: `ruff D417` (при `convention = "google"`, см. G-PY-028) проверяет, что описаны все аргументы; формы и dtype - ручное ревью.
- Источник: [TensorFlow code style, «Python operations»](https://www.tensorflow.org/community/contribute/code_style) (страница 2021-04-08, файл правился 2024-07-24) · производный гайд проекта · высокая; [TensorFlow docs style](https://www.tensorflow.org/community/contribute/docs_style) (проверено 2026-10-09) · производный гайд проекта · высокая.
- Пример:

```python
# хорошо
import chex
import jax
import jax.numpy as jnp
from jax.typing import ArrayLike


def mean_cross_entropy(logits: ArrayLike, labels: ArrayLike) -> jax.Array:
    """Computes the mean cross-entropy over a batch.

    Args:
        logits: Unnormalized class scores, shape `[batch, num_classes]`,
            floating dtype.
        labels: True class indices, shape `[batch]`, integer dtype.

    Returns:
        Scalar loss (shape `[]`), same dtype as `logits`.
    """
    logits = jnp.asarray(logits)
    labels = jnp.asarray(labels)
    chex.assert_rank([logits, labels], [2, 1])
    log_probs = jax.nn.log_softmax(logits)
    picked = jnp.take_along_axis(log_probs, labels[:, None], axis=-1)
    return -jnp.mean(picked)
```

### G-ML-017 · SHOULD · Docstring публичной функции или класса ML-API содержит короткий пример использования
- Проверка: ручное ревью (Keras прямо пишет, что стиль docstring автоматически не проверяет - [CONTRIBUTING.md](https://github.com/keras-team/keras/blob/master/CONTRIBUTING.md)).
- Источник: [Keras API design guidelines](https://github.com/keras-team/governance/blob/master/keras_api_design_guidelines.md) (2020-05-29, не обновляется) · официальный гайд · средняя; [TensorFlow code style, «Python operations»](https://www.tensorflow.org/community/contribute/code_style) (2021-04-08) · производный гайд проекта · высокая.

Сообщения об ошибках. Проверка пользовательского ввода исключением `ValueError` вместо `assert` и требование к тексту сообщения (что передано, что ожидалось, как исправить) записаны правилом G-LIB-015 в [libraries.md](libraries.md); общий запрет полагаться на `assert` - G-PY-037. Философия Flax формулирует то же короче: бесполезное сообщение об ошибке - это баг ([Flax philosophy](https://flax.readthedocs.io/en/latest/philosophy.html)).

## 8. Известное расхождение: отступы в ML-репозиториях Google

Публичный Python-гайд требует 4 пробела, и профиль следует ему (G-PY-004 в [../languages/python.md](../languages/python.md)). Собственные ML-репозитории Google в большинстве отформатированы иначе:

| Репозиторий | Отступ | Длина строки | Где задано |
|---|---|---|---|
| tensorflow/tensorflow | 2 пробела | 80 | [`pylintrc`](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/tools/ci_build/pylintrc): `indent-string='  '`, `max-line-length=80`; гайд проекта: PEP 8, но 2 пробела вместо 4 |
| jax-ml/jax | 2 пробела | 80 | [`pyproject.toml`](https://github.com/jax-ml/jax/blob/main/pyproject.toml): `[tool.ruff] indent-width = 2`, `line-length = 80` |
| google/flax | 2 пробела | 80 | [`pyproject.toml`](https://github.com/google/flax/blob/main/pyproject.toml): `[tool.ruff] indent-width = 2` |
| google-deepmind/optax, chex | 2 пробела | 80 | [`pyproject.toml`](https://github.com/google-deepmind/optax/blob/main/pyproject.toml): `[tool.pyink] pyink-indentation = 2` |
| google/orbax | 2 пробела | 80 | `.pylintrc`, вызываемый из [`.pre-commit-config.yaml`](https://github.com/google/orbax/blob/main/.pre-commit-config.yaml) |
| keras-team/keras | 4 пробела | 80 | [`pyproject.toml`](https://github.com/keras-team/keras/blob/master/pyproject.toml): `[tool.ruff] line-length = 80`, отступ не переопределён |

Интерпретация: два пробела - след внутреннего стиля Google в экспортированном коде. Профиль их не перенимает: правило публичного гайда однозначно, а смешение двух отступов в одном репозитории хуже любого из вариантов. Если вы вносите вклад в TensorFlow, JAX или Flax, действуют конфиги этих проектов.

## 9. Что смотреть дальше

- [notebooks.md](notebooks.md) - ноутбуки и момент переноса кода в модули.
- [reproducibility.md](reproducibility.md) - сиды, окружение, сохранение конфига запуска, трекинг.
- [mlops.md](mlops.md) - пайплайны, тесты данных и моделей, ML Test Score, что не коммитить.
- [libraries.md](libraries.md) - рекомендации и антипаттерны TensorFlow, Keras, JAX, Flax.
- [../enforcement.md](../enforcement.md) - сводная матрица «правило → инструмент или ручное ревью».
