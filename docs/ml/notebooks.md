# Ноутбуки (Jupyter, Colab) в репозитории - профиль Google

> Данные актуальны на 2026-10-09.

Единственный свод правил Google для ноутбуков, который записан и проверяется CI, лежит в репозитории `tensorflow/docs`: шаблон ноутбука, форматтер `nbfmt`, линтер `nblint` и джоб, который не пропускает изменённые ноутбуки с output-ячейками. Остальные репозитории Google поступают иначе: Flax и JAX хранят документационные ноутбуки парой `.ipynb` + `.md` через jupytext и выводы не вычищают, а в google-research правил нет вовсе - выводы сохранены примерно в половине ноутбуков. Профиль берёт политику `tensorflow/docs` для рабочих и исследовательских ноутбуков (выводы не коммитятся, MUST) и схему JAX/Flax для документационных (пара файлов, выводы допустимы). Момент переноса кода из ноутбука в модули Google явно не формулирует; правило собрано из примера Flax и статьи «Hidden Technical Debt», а чёткая формулировка взята у Cookiecutter Data Science с пометкой «не Google».

Соседние документы: структура проекта - [project-structure.md](project-structure.md); сиды и окружение - [reproducibility.md](reproducibility.md); что нельзя коммитить (данные, веса, секреты) - [mlops.md](mlops.md).

## 1. Что задокументировано и что делают репозитории

### (а) Письменные источники Google

| Источник | Что задаёт | Статус |
|---|---|---|
| [Шаблон ноутбука TensorFlow](https://github.com/tensorflow/docs/blob/master/tools/templates/notebook.ipynb) | структура ноутбука, стиль кода и текста, порядок работы с GitHub и Colab | активен; репозиторий `tensorflow/docs` правился 2026-10-05; Apache-2.0 |
| [`nbfmt` и `nblint`](https://github.com/tensorflow/docs/blob/master/tools/tensorflow_docs/tools/README.md) | единый формат JSON ноутбука; проверки лицензии, кнопок, лексики | активны; ставятся из git, релизов с версиями нет |
| [CI `tensorflow/docs`](https://github.com/tensorflow/docs/blob/master/.github/workflows/ci.yaml) | джобы `nbfmt`, `nblint`, `outputs-removed` на изменённых ноутбуках | активен |
| [JAX: «Update notebooks»](https://docs.jax.dev/en/latest/developer.html#update-notebooks) | пара `.ipynb` + `.md` через jupytext | активен |
| [Flax: contributing](https://flax.readthedocs.io/en/latest/contributing.html) | та же пара; исполнение ноутбуков при сборке документации | активен |
| [TensorFlow docs style](https://www.tensorflow.org/community/contribute/docs_style) | изображения в репозиторий не коммитятся | активен |

Чего нет: Google Python Style Guide не упоминает ни notebook, ни Colab. Общего «Colab style guide» для репозиториев Google вне `tensorflow/docs`, правил именования ноутбуков и явного правила «когда выносить код из ноутбука» публичных данных не найдено. Документация Google Cloud говорит о ноутбуках только как о среде: Workbench и Colab Enterprise рекомендованы для экспериментов и разработки ([Best practices for implementing ML on Google Cloud](https://docs.cloud.google.com/architecture/ml-on-gcp-best-practices#use-notebooks-for-experimentation-and-development), ревизия 2024-09-09), а процесс «на скриптах и ноутбуках» отнесён к уровню 0 зрелости MLOps ([документ об уровнях MLOps](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), ревизия 2024-08-28).

### (б) Практика репозиториев Google

Подсчёт автора профиля по клонам на 2026-10-09: ноутбук считается «с выводами», если хотя бы у одной кодовой ячейки непустой список `outputs`.

| Репозиторий (коммит) | Ноутбуков | С сохранёнными выводами | В паре с `.md` | Чем обеспечено |
|---|---|---|---|---|
| `tensorflow/docs` (`d599803`) | не считались | запрещены в изменённых ноутбуках; одно исключение в списке `EXCLUDED_PATHS` | - | CI: `nbfmt --test`, `nblint`, поиск `"output_type":` |
| `google/flax` (`6c9494b`) | 45 | 35 (78 %) | 36 (80 %) | pre-commit: jupytext v1.13.8 `--sync`; nbstripout 0.6.1 с `--keep-output --keep-count --extra-keys …` |
| `jax-ml/jax` (`efe43f1`) | 41 | 19 (46 %) | 32 (78 %) | pre-commit: jupytext v1.16.4 `--sync`, `files: docs/` |
| `google-research/google-research` (`72ffe35`) | 335 в 186 из 755 проектов | 162 (48 %); в 101 из 186 проектов есть хотя бы один ноутбук с выводами | 0 | ничего: в репозитории нет ни `.pre-commit-config.yaml`, ни `.gitattributes` |
| `keras-team/keras` | 0 | - | - | - |

Дополнительно по выборке из 24 репозиториев Google (см. отчёт [research/google.md](../../research/google.md)): файлы `.ipynb` есть в 7 из 24; хук jupytext - в 2 (`jax`, `flax`), хук nbstripout - в 1 (`flax`). В google-research у 282 из 335 ноутбуков (84 %) в метаданных есть блок `colab`, то есть их сохраняли из Colab.

Интерпретация: «в Google выводы ноутбуков всегда вычищают» - неверно. Вычищают там, где ноутбук исполняется и тестируется при публикации (`tensorflow/docs`); там, где ноутбук публикуется как есть, выводы оставляют и решают проблему диффов текстовой копией.

### (в) Инструменты «не Google», которыми пользуются репозитории Google

| Инструмент | Версия | Лицензия | Что делает |
|---|---|---|---|
| [nbstripout](https://github.com/kynan/nbstripout) | 0.9.1 (2026-02-21) | MIT | удаляет выводы и часть метаданных - как git-фильтр, pre-commit-хук или проверка (`--verify`) |
| [jupytext](https://github.com/mwouts/jupytext) | v1.19.6 (2026-10-04) | MIT | держит ноутбук и его текстовую копию (`.md`, `.py`) синхронными |

## 2. Что берёт профиль

Конфликт. `tensorflow/docs` запрещает выводы и проверяет это в CI; Flax запускает nbstripout с `--keep-output`, то есть сознательно сохраняет выводы и чистит только метаданные; JAX выводы не регулирует.

Профиль делит ноутбуки на два класса:

| Класс | Где лежит | Выводы | Диффы и ревью | Правила |
|---|---|---|---|---|
| Рабочие и исследовательские | `notebooks/`, каталоги экспериментов | не коммитятся | чистый JSON после nbstripout | G-NB-001, G-NB-002 |
| Документационные (публикуются без исполнения) | `docs/` | допустимы; пути перечислены в списке исключений | текстовая копия `.md` через jupytext | G-NB-009, G-NB-010 |

Почему так. Политика `tensorflow/docs` - единственная, которая у Google и записана, и автоматизирована; она же закрывает две практические проблемы: нечитаемые диффы и случайное попадание данных в репозиторий через выводы ячеек. Схема JAX и Flax нужна там, где читатель должен видеть результат, не запуская код.

## 3. Правила: что попадает в git

### G-NB-001 · MUST · Ноутбуки коммитятся без output-ячеек; исключения перечислены явным списком путей
- Проверка: pre-commit-хук `nbstripout` (не Google); в CI - `nbstripout --verify` или поиск строки `"output_type":` в изменённых ноутбуках (раздел 7).
- Источник: [CI `tensorflow/docs`, джоб `outputs-removed`](https://github.com/tensorflow/docs/blob/master/.github/workflows/ci.yaml) (HEAD 2026-10-05) · конфиг или инструмент · высокая; [README инструментов](https://github.com/tensorflow/docs/blob/master/tools/tensorflow_docs/tools/README.md) (2026-10-05) · производный гайд проекта · высокая. Уровень: MUST, потому что проект-источник проверяет правило в CI; в Flax и JAX правило не действует (раздел 1).
- Пример: в `tensorflow/docs` список исключений состоит из одного файла (`site/en/guide/gpu.ipynb`). В Colab то же делает настройка ноутбука «Omit code cell output when saving this notebook» - в шаблоне TensorFlow она включена.

### G-NB-002 · SHOULD · JSON ноутбука и его метаданные приводятся к единому виду одним инструментом, и это проверяется в CI
- Проверка: `python3 -m tensorflow_docs.tools.nbfmt --test <файлы>` либо nbstripout с `--extra-keys` (не Google), как во Flax.
- Источник: [README инструментов, `nbfmt`](https://github.com/tensorflow/docs/blob/master/tools/tensorflow_docs/tools/README.md) (2026-10-05) · конфиг или инструмент · высокая; [`.pre-commit-config.yaml` Flax](https://github.com/google/flax/blob/main/.pre-commit-config.yaml) (2026-10-07) · конфиг или инструмент · высокая. Уровень: в `tensorflow/docs` это MUST (джоб `nbfmt`); в профиле SHOULD, потому что `nbfmt` ставится только из git без закреплённых версий, а замена ему - не инструмент Google.
- Пример: разные среды по-разному пишут отступы, идентификаторы ячеек и метаданные (`kernelspec`, `colab`, `executionInfo`, `vscode`); без нормализации дифф ноутбука состоит из шума.

### G-NB-003 · SHOULD · Файлы `.ipynb` хранятся с переводами строк LF, а каталоги `.ipynb_checkpoints` исключены из git
- Проверка: строка `*.ipynb text eol=lf` в `.gitattributes` и `**/.ipynb_checkpoints` в `.gitignore`.
- Источник: [`.gitattributes`](https://github.com/tensorflow/docs/blob/master/.gitattributes) и [`.gitignore`](https://github.com/tensorflow/docs/blob/master/.gitignore) репозитория `tensorflow/docs` (коммит `d599803`, 2026-10-05) · конфиг или инструмент · средняя.

Изображения и другие бинарные вложения. Правило «не коммитить изображения и сгенерированные бинарные файлы вместе с ноутбуками» записано как G-MLOPS-005 в [mlops.md](mlops.md) (источник - [TensorFlow docs style](https://www.tensorflow.org/community/contribute/docs_style)). Для ноутбуков есть отдельный довод из шаблона TensorFlow: GitHub не показывает дифф ноутбука, если изменение велико из-за встроенных картинок, - ещё одна причина не сохранять выводы.

## 4. Правила: оформление ноутбука

### G-NB-004 · MUST · В open-source-репозитории ноутбук начинается с ячейки копирайта и ячейки лицензии
- Проверка: `nblint`, проверки `tensorflow::copyright_check` и `tensorflow::license_check`; без `nblint` - ручное ревью.
- Источник: [стиль `tensorflow` в `nblint`](https://github.com/tensorflow/docs/blob/master/tools/tensorflow_docs/tools/nblint/style/tensorflow.py) (2026-10-05) · конфиг или инструмент · высокая; [шаблон ноутбука, «Notebook style»](https://github.com/tensorflow/docs/blob/master/tools/templates/notebook.ipynb) (2026-10-05) · производный гайд проекта · высокая.
- Пример: в шаблоне лицензионная ячейка свёрнута (форма Colab), чтобы не мешать чтению. Общее правило о заголовках лицензии - G-REPO-010 в [../git/repository.md](../git/repository.md).

### G-NB-005 · SHOULD · У ноутбука один заголовок H1, сразу после него - ссылки запуска (Colab, GitHub), затем раздел с обзором до любого кода; все установки и импорты собраны в разделе Setup
- Проверка: частично: `nblint` (стиль `tensorflow`: `button_colab`, `button_github`, `button_download`, `button_website`); порядок разделов - ручное ревью.
- Источник: [шаблон ноутбука, «Notebook style»](https://github.com/tensorflow/docs/blob/master/tools/templates/notebook.ipynb) (2026-10-05) · производный гайд проекта · высокая.
- Пример: проверки кнопок рассчитаны на сайт tensorflow.org; в своём проекте лишние отключаются флагом `--exclude_lint=tensorflow::button_website`.

### G-NB-006 · SHOULD · Код в ноутбуке пишется для читателя: короткие ячейки, быстрые примеры на малых данных, а определённая функция сразу запускается и показывает результат
- Проверка: ручное ревью.
- Источник: [шаблон ноутбука, «Code style» и «Code content»](https://github.com/tensorflow/docs/blob/master/tools/templates/notebook.ipynb) (2026-10-05) · производный гайд проекта · высокая.
- Пример: шаблон просит не обучать модель до сходимости - достаточно показать, что обучение идёт, - и брать самый высокоуровневый API, который решает задачу. Стиль кода - Google Python Style Guide «там, где применимо». Вспомогательный код (например, построение графиков) прячется в сворачиваемую ячейку с `#@title` в первой строке.

### G-NB-007 · SHOULD · Текст ноутбука написан в повелительном наклонении и во втором лице, заголовки - короткие, в sentence case, лексика - инклюзивная
- Проверка: частично: `nblint`, стиль `google` (`inclusive_language`, `second_person`); остальное - ручное ревью.
- Источник: [шаблон ноутбука, «Text»](https://github.com/tensorflow/docs/blob/master/tools/templates/notebook.ipynb) (2026-10-05) · производный гайд проекта · высокая; [стиль `google` в `nblint`](https://github.com/tensorflow/docs/blob/master/tools/tensorflow_docs/tools/nblint/style/google.py) (2026-10-05) · конфиг или инструмент · высокая.
- Пример: обе проверки `nblint` ссылаются на Google developer documentation style guide; правила текста документации - в [../git/repository.md](../git/repository.md).

### G-NB-008 · SHOULD · Ноутбук открывается в Colab по прямой ссылке на файл в репозитории; ссылка или бейдж стоит в самом ноутбуке или в README рядом
- Проверка: частично: `nblint` (`tensorflow::button_colab`); остальное - ручное ревью.
- Источник: [шаблон ноутбука, «GitHub workflow»](https://github.com/tensorflow/docs/blob/master/tools/templates/notebook.ipynb) (2026-10-05) · производный гайд проекта · высокая; [README примера MNIST во Flax](https://github.com/google/flax/blob/main/examples/mnist/README.md) (2026-10-07) · практика, выведенная из репозиториев (ссылка на Colab внутри самого ноутбука: 13 из 45 во Flax, 16 из 41 в JAX, 47 из 335 в google-research; в остальных случаях ссылка стоит в README или документации) · средняя.
- Пример: формат ссылки - `https://colab.research.google.com/github/<org>/<repo>/blob/<branch>/<path>.ipynb`. Шаблон советует прикладывать такую ссылку на ветку pull request, чтобы ревьюер открыл ноутбук одним щелчком.

## 5. Правила: документационные ноутбуки

### G-NB-009 · SHOULD · Документационные ноутбуки хранятся парой: `.ipynb` и текстовая копия (`.md` в формате MyST), которую синхронизирует jupytext; ревью идёт по текстовой копии
- Проверка: pre-commit-хук `jupytext` с `args: [--sync]` (не Google); в CI - `pre-commit run jupytext --all-files`.
- Источник: [JAX developer docs, «Update notebooks»](https://docs.jax.dev/en/latest/developer.html#update-notebooks) (2026-10-09) · производный гайд проекта · высокая; [Flax contributing](https://flax.readthedocs.io/en/latest/contributing.html) (2026-10-07) · производный гайд проекта · высокая; [`.pre-commit-config.yaml` JAX](https://github.com/jax-ml/jax/blob/main/.pre-commit-config.yaml) (HEAD 2026-10-09) · практика, выведенная из репозиториев (в паре с `.md`: 36 из 45 ноутбуков Flax, 32 из 41 ноутбука JAX) · высокая.
- Пример: `.ipynb` открывается и исполняется в Colab, `.md` даёт читаемый дифф. Версия jupytext у разработчика должна совпадать с `rev` хука: номер версии записан в заголовке текстовой копии, и другая версия меняет его при каждой синхронизации. Новая пара создаётся командой `jupytext --set-formats ipynb,md:myst <файл>.ipynb`.

### G-NB-010 · SHOULD · Ноутбуки документации исполняются при сборке или в CI; ошибка в ячейке ломает сборку, а намеренные ошибки помечаются явно
- Проверка: джоб сборки документации (во Flax - Sphinx с `myst_nb`; в `tensorflow/docs` ноутбуки без выводов исполняются и тестируются при публикации).
- Источник: [Flax contributing, «Notebooks within the Sphinx build»](https://flax.readthedocs.io/en/latest/contributing.html) (2026-10-07) · производный гайд проекта · высокая; [README инструментов `tensorflow/docs`](https://github.com/tensorflow/docs/blob/master/tools/tensorflow_docs/tools/README.md) (2026-10-05) · производный гайд проекта · высокая.
- Пример: во Flax ячейка с намеренной ошибкой получает тег метаданных `raises-exceptions`, а долгие ноутбуки исключены из сборки списком в `conf.py`.

## 6. Правила: когда код переезжает из ноутбука в модули

Факты. У Google нет явного правила. Ближайшие формулировки: docstring `main.py` в примере Flax (основная логика лежит в библиотеках, которые можно тестировать и импортировать в Colab) и «prototype smell» из «Hidden Technical Debt» - постоянная опора на прототипную среду как признак долга. Явную формулировку даёт Cookiecutter Data Science (не Google): ноутбуки - для исследования и коммуникации, исходные файлы - для повторения; удачные части переносятся в исходный код; одна и та же задача не решается кодом в нескольких ноутбуках ([opinions](https://cookiecutter-data-science.drivendata.org/opinions/)).

Интерпретация - критерий профиля. Код покидает ноутбук, как только выполняется любое из условий: (1) он понадобился во втором ноутбуке или скрипте; (2) от него зависит результат, который попадёт в отчёт, пайплайн или продакшен; (3) для него нужен тест.

### G-NB-011 · SHOULD · Ноутбук - тонкая оболочка над модулями: логика, которая нужна больше одного раза, лежит в импортируемых модулях с тестами, а ноутбук её импортирует
- Проверка: ручное ревью.
- Источник: [flax/examples/mnist](https://github.com/google/flax/tree/main/examples/mnist) (2026-10-07) · практика, выведенная из репозиториев (ноутбук рядом с `train.py` и `train_test.py` - в 5 из 11 примеров Flax с конфигом) · средняя · реконструкция; [Cookiecutter Data Science, opinions](https://cookiecutter-data-science.drivendata.org/opinions/) (v2.3.0, 2025-07-23) · сторонний источник · высокая · не Google.
- Пример: для импорта кода проекта в Jupyter Cookiecutter Data Science советует `%load_ext autoreload` и `%autoreload 2` - тогда правки в модулях подхватываются без перезапуска ядра.

### G-NB-012 · SHOULD · Код из ноутбука переносится в модули с тестами до того, как им начинает пользоваться пайплайн или продакшен; ни продакшен-код, ни пайплайн не импортируют и не запускают ноутбуки
- Проверка: частично: поиск импортов из `notebooks/` в CI или import-linter (не Google); остальное - ручное ревью.
- Источник: [«Hidden Technical Debt», §5 «prototype smell»](https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf) (NIPS 2015) · книга, статья или доклад · средняя · реконструкция; [MLOps: Continuous delivery and automation pipelines in ML, уровень 0](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning) (ревизия 2024-08-28) · официальный гайд · средняя.

### G-NB-013 · SHOULD · Исследовательские ноутбуки лежат в `notebooks/` и называются `<номер>-<автор>-<описание>.ipynb`
- Проверка: частично: проверка имени регулярным выражением в CI; остальное - ручное ревью.
- Источник: [Cookiecutter Data Science, opinions](https://cookiecutter-data-science.drivendata.org/opinions/) (v2.3.0, 2025-07-23) · сторонний источник · средняя · не Google. У Google правил именования ноутбуков публичных данных не найдено.
- Пример: `0.3-bull-visualize-distributions.ipynb` - номер шага, короткое имя автора, описание через дефис.

## 7. Настройка инструментов

Итоговый `.pre-commit-config.yaml` профиля лежит в [../../configs/.pre-commit-config.yaml](../../configs/.pre-commit-config.yaml); ниже - фрагменты, относящиеся к ноутбукам. Идентификаторы хуков и опции сверены с файлами репозиториев инструментов; YAML разобран локально. Не запускалось: реестр пакетов недоступен из среды сборки.

Рабочие и исследовательские ноутбуки - выводы удаляются (G-NB-001):

```yaml
# nbstripout 0.9.1 (2026-02-21) - не Google.
repos:
  - repo: https://github.com/kynan/nbstripout
    rev: 0.9.1
    hooks:
      - id: nbstripout
        exclude: ^docs/
```

Документационные ноутбуки - пара файлов, выводы сохраняются, чистятся только метаданные (G-NB-002, G-NB-009):

```yaml
# jupytext v1.19.6 (2026-10-04) и nbstripout 0.9.1 - не Google.
# Схема jax-ml/jax (jupytext v1.16.4, files: docs/) и google/flax (nbstripout 0.6.1 с --keep-output).
repos:
  - repo: https://github.com/mwouts/jupytext
    rev: v1.19.6
    hooks:
      - id: jupytext
        files: ^docs/
        args: [--sync]
  - repo: https://github.com/kynan/nbstripout
    rev: 0.9.1
    hooks:
      - id: nbstripout
        name: nbstripout (docs, keep outputs)
        files: ^docs/
        args:
          - --keep-output
          - --keep-count
          - --extra-keys
          - "cell.metadata.executionInfo cell.metadata.id metadata.kernelspec metadata.vscode metadata.colab cell.metadata.colab"
```

Замечания:

- Список `--extra-keys` взят из конфига Flax и сокращён: убраны вложенные ключи `cell.metadata.executionInfo.user` и `cell.metadata.executionInfo.user_tz`, которые покрывает `cell.metadata.executionInfo`.
- Документация jupytext указывает адрес `https://github.com/jupytext/jupytext`; JAX и Flax используют `https://github.com/mwouts/jupytext`. Оба адреса ведут в один репозиторий (проверено 2026-10-09: одинаковый HEAD).
- Как pre-commit-хук nbstripout меняет и рабочую копию: выводы пропадают из локального файла. Как git-фильтр он чистит только то, что попадает в индекс. Если локальные выводы нужны, вместо хука ставят фильтр: `nbstripout --install --attributes .gitattributes`.
- JAX закрепляет `rev` хуков не тегом, а SHA коммита с комментарием `# frozen: v1.16.4`. Это строже; профиль оставляет теги ради читаемости.
- `nbfmt` как pre-commit-хук: рецепт из README `tensorflow/docs` (`repo: https://github.com/tensorflow/docs`, `rev: pre-commit`) в текущем виде не работает - файл `.pre-commit-hooks.yaml` лежит не в корне репозитория, а в `tools/tensorflow_docs/tools/`, и ссылки `pre-commit` в репозитории нет. Вызывайте `nbfmt` командой в CI.

`.gitattributes` (G-NB-003):

```gitattributes
*.ipynb text eol=lf
```

Проверка в CI. Скрипт повторяет логику джоба `outputs-removed` из `tensorflow/docs` и одинаково работает в GitHub Actions и GitLab CI. Проверено локально на тестовом репозитории (bash 5, git).

```bash
#!/usr/bin/env bash
# tools/check_notebook_outputs.sh - в изменённых ноутбуках нет выводов.
# В output-ячейке всегда есть ключ "output_type".
set -euo pipefail

base="${1:-origin/main}"
# Пути, где сохранённые выводы разрешены (документационные ноутбуки, G-NB-009).
allowed=("docs/")

status=0
while IFS= read -r nb; do
  for prefix in "${allowed[@]}"; do
    [[ "$nb" == "$prefix"* ]] && continue 2
  done
  if grep --quiet '"output_type":' "$nb"; then
    echo "Remove output cells from: $nb" >&2
    status=1
  fi
done < <(git diff --name-only --diff-filter=d "$base"... -- '*.ipynb')
exit "$status"
```

```yaml
# GitHub Actions - фрагмент для .github/workflows/lint.yml.
jobs:
  notebooks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 0
      - run: bash tools/check_notebook_outputs.sh "origin/${{ github.base_ref }}"
```

```yaml
# GitLab CI - фрагмент для .gitlab-ci.yml. Перенос на GitLab - не Google.
notebooks:
  stage: lint
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
      changes:
        - "**/*.ipynb"
  script:
    - git fetch origin "$CI_MERGE_REQUEST_TARGET_BRANCH_NAME"
    - bash tools/check_notebook_outputs.sh "origin/$CI_MERGE_REQUEST_TARGET_BRANCH_NAME"
```

Различие платформ: в GitHub Actions базовая ветка берётся из `github.base_ref` и нужен полный клон (`fetch-depth: 0`); в GitLab - из `CI_MERGE_REQUEST_TARGET_BRANCH_NAME`, а целевую ветку приходится подтягивать явно. Альтернатива для GitHub - готовое действие `kynan/nbstripout` (есть начиная с 0.9.0), которое запускает `nbstripout --verify`.

## 8. Сводка: правило → инструмент

| Правило | Инструмент | Чей инструмент |
|---|---|---|
| G-NB-001 | `nbstripout`, `nbstripout --verify`, поиск `"output_type":` | не Google; логика проверки - `tensorflow/docs` |
| G-NB-002 | `nbfmt --test`; nbstripout `--extra-keys` | Google (`tensorflow/docs`); не Google |
| G-NB-003 | `.gitattributes`, `.gitignore` | git |
| G-NB-004, G-NB-005, G-NB-007, G-NB-008 | `nblint` (частично) | Google (`tensorflow/docs`) |
| G-NB-009 | `jupytext --sync` | не Google |
| G-NB-010 | сборка документации с исполнением ноутбуков | Sphinx + `myst_nb` - не Google |
| G-NB-006, G-NB-011, G-NB-012, G-NB-013 | ручное ревью | - |
