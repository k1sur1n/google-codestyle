# Воспроизводимость и трекинг экспериментов - профиль Google

> Данные актуальны на 2026-10-09.

У Google воспроизводимость описана на трёх уровнях: требование «Training is reproducible» в статье «The ML Test Score», практические советы ML Crash Course (сидировать генераторы, инициализировать компоненты в фиксированном порядке, усреднять несколько запусков, держать всё в системе контроля версий) и рецепты самих фреймворков - `set_random_seed` и `enable_op_determinism` в TensorFlow и Keras, явные ключи в JAX. Побитовой воспроизводимости не обещает никто: TensorFlow гарантирует её только на том же железе и той же версии, Keras предупреждает, что бэкенды дают разные случайные числа при одном сиде. Официального гайда о фиксации окружения ML-проекта нет; есть практика: TensorFlow и JAX держат lock-файлы с хешами, а в исследовательском коде google-research точные версии закреплены меньше чем в каждом седьмом `requirements.txt`. Для трекинга экспериментов письменный источник один - Deep Learning Tuning Playbook; инструмент по умолчанию в коде Google - TensorBoard.

Соседние документы: конфиги экспериментов - [project-structure.md](project-structure.md); ноутбуки - [notebooks.md](notebooks.md); версионирование данных и моделей, пайплайны, ML Metadata, реестр моделей - [mlops.md](mlops.md); остальные правила библиотек - [libraries.md](libraries.md). Сиды и детерминизм для PyTorch и scikit-learn (не Google) записаны здесь: G-REPRO-007 и G-REPRO-008.

## 1. Что опубликовано, а чего нет

| Тема | (а) Письменные источники Google | (б) Практика репозиториев Google | (в) Альтернатива «не Google» |
|---|---|---|---|
| Сиды и порядок инициализации | ML Crash Course, модули «Production ML systems» (2025) | в примерах Flax сид - поле конфига в 5 из 11 примеров, в остальных захардкожен | - |
| Детерминизм фреймворков | docstring `enable_op_determinism` (TensorFlow), Keras FAQ и `set_random_seed`, документация `jax.random` | - | PyTorch: заметка «Reproducibility»; scikit-learn: «Common pitfalls» (раздел 3) |
| Детерминизм JAX на GPU (XLA) | публичных данных не найдено | - | - |
| Требование воспроизводимости как критерий | «The ML Test Score», тест Infra 1; «Hidden Technical Debt», §8 «Reproducibility Debt» | - | - |
| Фиксация зависимостей | README «Managing hermetic Python» в TensorFlow (для сборки самого TensorFlow). Общего гайда для ML-проектов публичных данных не найдено | lock-файлы с хешами: 2 из 8 ML-репозиториев; google-research - раздел 4 | Cookiecutter Data Science |
| Контейнеры | документы Google Cloud об уровнях MLOps и об архитектуре на TFX (правила - в [mlops.md](mlops.md)) | - | - |
| Версии датасетов | TFDS «Datasets versioning» (2021) | - | DVC (см. [mlops.md](mlops.md)) |
| Трекинг экспериментов | Deep Learning Tuning Playbook; рекомендации Google Cloud (TensorBoard, Experiments) | TensorBoard-журналы в 10 из 11 примеров Flax | MLflow Tracking |

Статусы источников:

- [ML Crash Course, «Deployment testing»](https://developers.google.com/machine-learning/crash-course/production-ml-systems/deployment-testing) (обновлён 2025-08-25) и [модуль о мониторинге пайплайнов](https://developers.google.com/machine-learning/crash-course/production-ml-systems/monitoring) (2025-10-16) - учебный курс Google for Developers, CC BY 4.0. Это учебный материал, а не внутренний стандарт; формулировки рекомендательные.
- [«The ML Test Score»](https://storage.googleapis.com/pub-tools-public-publication-data/pdf/aad9f93b86b7addfea4c419b9100c6cdd26cacea.pdf) (IEEE Big Data 2017) и [«Hidden Technical Debt in Machine Learning Systems»](https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf) (NIPS 2015) - статьи, не обновляются, открытой лицензии нет.
- [Deep Learning Tuning Playbook](https://github.com/google-research/tuning_playbook) - гайд исследователей Google Research и Гарварда, CC BY 4.0, с оговоркой «not an officially supported Google product»; последний коммит 2024-06-13. Источник не обновляется.
- [TFDS «Datasets versioning»](https://www.tensorflow.org/datasets/datasets_versioning) - страница не обновлялась с 2021-06-17.
- Документы Google Cloud ([уровни MLOps](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), ревизия 2024-08-28; [best practices](https://docs.cloud.google.com/architecture/ml-on-gcp-best-practices), ревизия 2024-09-09) - активны; в апреле 2026 года Vertex AI переименован в Gemini Enterprise Agent Platform, и в текстах оба названия встречаются вперемешку.

## 2. Что обещают фреймворки

| Фреймворк | Что гарантируется | Чего не гарантируется | Источник |
|---|---|---|---|
| TensorFlow | при выставленных сидах и `enable_op_determinism` операция с теми же входами на том же железе даёт те же выходы; модель можно обучить до одинаковых весов от запуска к запуску | детерминизм между версиями TensorFlow; часть операций без детерминированной реализации бросает `UnimplementedError`; скорость падает (для `Dataset.map` со stateful-операциями - на порядки) | [docstring `enable_op_determinism`](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/python/framework/config.py) |
| Keras 3 | `set_random_seed` выставляет сиды Python, NumPy, TensorFlow (даже при другом бэкенде - из-за `tf.data`) и torch (при бэкенде torch) | распределённое обучение с parameter server, недетерминированные операции cuDNN; генераторы разных бэкендов дают разные числа при одном сиде | [`rng_utils.py`](https://github.com/keras-team/keras/blob/master/keras/src/utils/rng_utils.py), [Keras 3](https://keras.io/keras_3/) |
| JAX | случайное число - чистая функция явного ключа: тот же ключ даёт тот же результат независимо от порядка вызовов и устройства | «sequential equivalence»: N чисел по одному и N чисел сразу не обязаны совпадать | [Pseudorandom numbers](https://docs.jax.dev/en/latest/101/random.html#no-sequential-equivalence) |
| PyTorch (не Google) | при выставленных сидах и `use_deterministic_algorithms(True)` - детерминированные реализации там, где они есть | воспроизводимость между релизами, коммитами и платформами; операции без детерминированной реализации поднимают ошибку | [Reproducibility](https://docs.pytorch.org/docs/2.14/notes/randomness.html) |

Вывод для профиля: критерий воспроизводимости - совпадение метрик в пределах допуска на зафиксированном окружении, а не побитовое равенство весов.

## 3. Правила: сиды и детерминизм

### G-REPRO-001 · SHOULD · Каждый запуск обучения детерминированно сидирует все генераторы случайных чисел; сид - поле конфига и записывается вместе с результатами
- Проверка: частично: тест воспроизводимости (G-REPRO-011); поиск вызовов генераторов без сида - ручное ревью.
- Источник: [ML Crash Course, «Test model updates with reproducible training»](https://developers.google.com/machine-learning/crash-course/production-ml-systems/deployment-testing) (2025-08-25) · официальный гайд · высокая; [примеры Flax](https://github.com/google/flax/tree/main/examples) (2026-10-07) · практика, выведенная из репозиториев (сид вынесен в конфиг в 5 из 11 примеров с конфигом) · средняя · реконструкция в части «сид - поле конфига».

### G-REPRO-002 · SHOULD · Компоненты модели инициализируются в фиксированном порядке, чтобы от запуска к запуску получать одни и те же случайные числа
- Проверка: ручное ревью; косвенно - тест воспроизводимости (G-REPRO-011).
- Источник: [ML Crash Course, «Test model updates with reproducible training»](https://developers.google.com/machine-learning/crash-course/production-ml-systems/deployment-testing) (2025-08-25) · официальный гайд · высокая.
- Пример: правило существенно для генераторов с глобальным состоянием (NumPy, TensorFlow); в JAX порядок вызовов на результат не влияет (см. абзац о JAX ниже).

### G-REPRO-003 · SHOULD · Разбиение и сэмплирование данных детерминированы: хеш от стабильного ключа, без текущего времени и несидированных случайных чисел
- Проверка: частично: тест, что повторное разбиение даёт те же множества; остальное - ручное ревью.
- Источник: [ML Crash Course, «Randomization»](https://developers.google.com/machine-learning/crash-course/production-ml-systems/monitoring) (2025-10-16) · официальный гайд · высокая.
- Пример:

```python
# плохо: состав выборок меняется от запуска к запуску
is_train = random.random() < 0.8

# хорошо: пример всегда попадает в одну и ту же выборку
digest = hashlib.sha256(f'{query}:{logged_date}'.encode()).digest()
is_train = int.from_bytes(digest[:8], 'big') % 10 < 8
```

Курс отдельно оговаривает выбор ключа: хеш только по запросу навсегда закрепляет запрос за одной выборкой, поэтому в ключ добавляют дату из лога (не текущую дату).

### G-REPRO-004 · SHOULD · В программах на TensorFlow и Keras сиды выставляются одним вызовом `keras.utils.set_random_seed(seed)` в начале программы; когда нужна точная повторяемость на TensorFlow, к нему добавляется `tf.config.experimental.enable_op_determinism()`
- Проверка: частично: поиск `set_random_seed` в точке входа; остальное - ручное ревью.
- Источник: [docstring `enable_op_determinism`](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/python/framework/config.py) (TensorFlow 2.21, HEAD 2026-10-09) · официальный гайд · высокая; [Keras FAQ](https://keras.io/getting_started/faq/#how-can-i-obtain-reproducible-results-using-keras-during-development) (страница без даты; проверено 2026-10-09) · официальный гайд · высокая.
- Пример:

```python
import keras
import tensorflow as tf

keras.utils.set_random_seed(config.seed)
if config.deterministic:
    # Заметно замедляет обучение; включать для отладки и тестов.
    tf.config.experimental.enable_op_determinism()
```

При включённом детерминизме случайные операции TensorFlow без сида поднимают `RuntimeError` - это полезная проверка сама по себе.

### G-REPRO-005 · SHOULD · Переменная окружения `PYTHONHASHSEED` задаётся до запуска процесса, а не внутри программы
- Проверка: ручное ревью скриптов запуска и CI-конфигурации.
- Источник: [Keras FAQ](https://keras.io/getting_started/faq/#how-can-i-obtain-reproducible-results-using-keras-during-development) (страница без даты; проверено 2026-10-09) · официальный гайд · высокая.
- Пример: `PYTHONHASHSEED=0 python -m my_project.main --config=configs/default.py --workdir=/tmp/run1`. Без этого порядок элементов в `set` и другие операции на хешах могут различаться между запусками.

JAX. Главное правило - случайность идёт через явные ключи и один ключ не используется дважды - записано как G-LIB-018 в [libraries.md](libraries.md). Для воспроизводимости важно, что из него следует: глобального генератора в JAX нет намеренно, результат зависит только от значений ключей и не зависит от порядка и числа вызовов и от устройства ([«Why not a global generator?»](https://docs.jax.dev/en/latest/101/random.html#why-not-a-global-generator)). Сид превращается в ключ один раз, в точке входа: `key = jax.random.key(config.seed)`. Ниже - правило из той же страницы документации, которого в libraries.md нет.

### G-REPRO-006 · SHOULD · Ключи для шагов обучения и для примеров выводятся от одного родительского ключа (`fold_in(key, step)` или один `split(key, n)`), а не длинной цепочкой расщеплений
- Проверка: ручное ревью.
- Источник: [JAX, «Keep the key tree wide, not deep»](https://docs.jax.dev/en/latest/101/random.html#keep-the-key-tree-wide-not-deep) (JAX 0.11.2, 2026-09-17) · официальный гайд · высокая.
- Пример:

```python
# плохо: ключ каждого шага получен из ключа предыдущего
for step in range(num_steps):
    key, step_key = jax.random.split(key)

# хорошо: все ключи шагов выведены от одного родителя
for step in range(num_steps):
    step_key = jax.random.fold_in(key, step)
```

Документация называет две причины: цепочка вычисляется последовательно, а вероятность совпадения ключей в ней растёт с длиной. Несколько расщеплений подряд безвредны; правило касается всего, что пропорционально длине обучения или размеру датасета.

### G-REPRO-007 · SHOULD · PyTorch: в начале программы выставляются сиды `torch`, `random` и NumPy, включается `torch.use_deterministic_algorithms(True)`, `torch.backends.cudnn.benchmark` выключен, а `DataLoader` получает `worker_init_fn` и `generator` с заданным сидом
- Проверка: частично: поиск этих вызовов в точке входа и тест воспроизводимости (G-REPRO-011); остальное - ручное ревью.
- Источник: [PyTorch, «Reproducibility»](https://docs.pytorch.org/docs/2.14/notes/randomness.html) (PyTorch 2.14) · официальный гайд · высокая · не Google.
- Пример:

```python
def seed_everything(seed: int) -> torch.Generator:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.use_deterministic_algorithms(True)
    torch.backends.cudnn.benchmark = False
    generator = torch.Generator()
    generator.manual_seed(seed)
    return generator


def seed_worker(worker_id: int) -> None:
    worker_seed = torch.initial_seed() % 2**32
    np.random.seed(worker_seed)
    random.seed(worker_seed)


loader = torch.utils.data.DataLoader(
    dataset,
    batch_size=config.batch_size,
    num_workers=4,
    worker_init_fn=seed_worker,
    generator=seed_everything(config.seed),
)
```

PyTorch - не библиотека Google; правило закрывает пробел для смешанных стеков. Документация PyTorch оговаривает, что полная воспроизводимость между релизами, отдельными коммитами и платформами не гарантируется, а `use_deterministic_algorithms(True)` поднимает ошибку на операциях без детерминированной реализации. Внутренний конфликт документации PyTorch: гайд по производительности советует `cudnn.benchmark = True` ради скорости; профиль берёт `False` для запусков, которые нужно повторять (см. также таблицу конфликтов в [libraries.md](libraries.md)).

### G-REPRO-008 · SHOULD · scikit-learn: `random_state` задаётся явно у всех объектов, которые его принимают; в сплиттеры кросс-валидации передаётся целое число; на глобальный сид NumPy код не полагается
- Проверка: частично: поиск `random_state=None` и вызовов без `random_state`; остальное - ручное ревью.
- Источник: [scikit-learn, «Common pitfalls and recommended practices», «Getting reproducible results across multiple executions»](https://scikit-learn.org/stable/common_pitfalls.html#getting-reproducible-results-across-multiple-executions) (scikit-learn 1.9.1) · официальный гайд · высокая · не Google.
- Пример:

```python
# плохо: результат зависит от глобального состояния NumPy
np.random.seed(0)
model = RandomForestClassifier()

# хорошо: генератор объявлен один раз и передан явно
rng = np.random.RandomState(config.seed)
cv = KFold(n_splits=5, shuffle=True, random_state=config.seed)
model = RandomForestClassifier(random_state=rng)
```

Тонкость из того же раздела: оценщику в кросс-валидации лучше передавать экземпляр `RandomState` (у каждого фолда свой поток случайных чисел), сплиттеру - целое число (разбиение одинаково при повторных вызовах `split`). Расхождение с рецептами выше: `keras.utils.set_random_seed` и рецепт PyTorch выставляют именно глобальный сид NumPy - он нужен как страховка для чужого кода, но собственный код должен получать генератор или сид явно.

### G-REPRO-009 · SHOULD · Модели сравнивают по метрикам, усреднённым по нескольким запускам
- Проверка: ручное ревью отчёта об эксперименте (указаны число запусков и разброс).
- Источник: [ML Crash Course, «Test model updates with reproducible training»](https://developers.google.com/machine-learning/crash-course/production-ml-systems/deployment-testing) (2025-08-25) · официальный гайд · высокая.

### G-REPRO-010 · SHOULD · Вместе с результатом записываются версии фреймворков, ускоритель и бэкенд; побитового совпадения между версиями, железом и бэкендами не ожидают
- Проверка: ручное ревью записи об эксперименте (G-REPRO-017).
- Источник: [docstring `enable_op_determinism`](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/python/framework/config.py) (HEAD 2026-10-09) · официальный гайд · высокая; [Keras 3](https://keras.io/keras_3/) (страница без даты; проверено 2026-10-09) · официальный гайд · высокая · реконструкция (источники описывают границы гарантий; требование записывать версии - наше).

### G-REPRO-011 · SHOULD · Воспроизводимость обучения проверяется тестом: два коротких запуска с одним сидом и конфигом дают метрики в пределах заданного допуска
- Проверка: тест в CI.
- Источник: [«The ML Test Score», тест Infra 1 «Training is reproducible»](https://storage.googleapis.com/pub-tools-public-publication-data/pdf/aad9f93b86b7addfea4c419b9100c6cdd26cacea.pdf) (IEEE Big Data 2017) · книга, статья или доклад · высокая; [ML Crash Course, «Test model updates with reproducible training»](https://developers.google.com/machine-learning/crash-course/production-ml-systems/deployment-testing) (2025-08-25) · официальный гайд · высокая · реконструкция в части формы теста.
- Пример: набросок; предполагается, что `train_and_evaluate` возвращает словарь метрик:

```python
def test_training_is_reproducible(tmp_path):
    config = default.get_config()
    config.num_epochs = 1
    first = train.train_and_evaluate(config, str(tmp_path / 'a'))
    second = train.train_and_evaluate(config, str(tmp_path / 'b'))
    np.testing.assert_allclose(first['loss'], second['loss'], rtol=1e-6)
```

Для TensorFlow с `enable_op_determinism` и для JAX с одинаковыми ключами на одном устройстве допуск можно сжать до точного равенства; для смешанных стеков оставляйте допуск. Место этого теста в CI и подсчёт ML Test Score - в [mlops.md](mlops.md).

## 4. Правила: окружение, зависимости, данные

Как закрепляют зависимости репозитории Google (подсчёт автора профиля по клонам на 2026-10-09):

| Репозиторий | Что лежит в репозитории |
|---|---|
| tensorflow/tensorflow | `requirements_lock_3_10.txt` … `requirements_lock_3_14.txt`: полное транзитивное замыкание с `--hash=sha256:`, генерируется pip-compile через Bazel-цель |
| jax-ml/jax | `build/requirements_lock_3_12.txt` … `3_15.txt` с хешами, генерируется `uv pip compile` скриптом `build/update_requirements_uv.py` |
| keras-team/keras | `requirements*.txt` без версий |
| google/flax | зависимости в `pyproject.toml`; `uv.lock` есть только у подпроекта `flaxlib_src` |
| google-deepmind/optax, chex; google/orbax | только `pyproject.toml` |
| tensorflow/tfx | `requirements.txt` |

Итого lock-файлы с хешами - у 2 из 8 просмотренных ML-репозиториев, и оба собирают нативный код.

google-research (коммит `72ffe35`): `requirements.txt` в корне проекта есть у 468 из 755 проектов. Из этих 468 файлов:

| Как указаны версии | Файлов | Доля |
|---|---|---|
| у всех зависимостей точная версия (`==`) | 64 | 14 % |
| у части зависимостей точная версия | 102 | 22 % |
| только диапазоны (`>=` и подобные) | 212 | 45 % |
| версий нет вовсе | 85 | 18 % |
| файл без зависимостей | 5 | 1 % |
| есть хеши (`--hash=`) | 0 | 0 % |

В примерах Flax картина лучше: из 12 файлов `requirements.txt` в `examples/` полностью закреплены 8, ещё в двух не закреплена одна строка.

Интерпретация: закреплённое окружение у Google - свойство библиотек с нативной сборкой, а не исследовательского кода. Правила G-REPRO-012 и G-REPRO-013 поэтому помечены как реконструкция, а второе имеет низкую уверенность.

### G-REPRO-012 · SHOULD · Зависимости библиотеки, сервиса или пайплайна закреплены lock-файлом с хешами, который генерирует инструмент (pip-compile или uv) для каждой поддерживаемой версии Python
- Проверка: `pip install --require-hashes -r <lock>` или `uv pip sync --require-hashes <lock>` в CI; джоб, который перегенерирует lock-файл и падает при расхождении.
- Источник: [TensorFlow, «Managing hermetic Python»](https://github.com/tensorflow/tensorflow/blob/master/ci/official/requirements_updater/README.md) (HEAD 2026-10-09) · производный гайд проекта · высокая; [`build/requirements_lock_3_12.txt` в JAX](https://github.com/jax-ml/jax/blob/main/build/requirements_lock_3_12.txt) (HEAD 2026-10-09) · практика, выведенная из репозиториев (2 из 8: tensorflow, jax) · средняя · реконструкция.
- Пример: README TensorFlow объясняет мотив - сборка должна быть воспроизводимой и не зависеть от локальной системы, поэтому закреплены все транзитивные зависимости вместе с хешами. Команда в духе JAX (опции проверены по `uv pip compile --help`, uv 0.11.32; сама компиляция не запускалась - реестр пакетов недоступен из среды сборки):

```shell
uv pip compile requirements.in --universal --generate-hashes \
    --python-version 3.12 -o requirements_lock_3_12.txt
```

### G-REPRO-013 · SHOULD · У каталога эксперимента есть собственный файл зависимостей с точными версиями (`==`)
- Проверка: частично: CI-шаг ищет в `requirements.txt` строки без `==`; остальное - ручное ревью.
- Источник: [flax/examples/mnist/requirements.txt](https://github.com/google/flax/blob/main/examples/mnist/requirements.txt) (2026-10-07) · практика, выведенная из репозиториев (полностью закреплены 8 из 12 файлов в примерах Flax и 64 из 468 в google-research) · низкая · реконструкция; [Cookiecutter Data Science, opinions](https://cookiecutter-data-science.drivendata.org/opinions/) (v2.3.0, 2025-07-23) · сторонний источник · высокая · не Google.
- Пример: Cookiecutter Data Science формулирует принцип прямо - воспроизведение анализа начинается с воспроизведения окружения, в котором он выполнялся. У Google такого текста нет.

Контейнеры. Документы Google Cloud советуют запускать шаги обучения в контейнерах - ради изоляции окружений и одинакового поведения в разработке и продакшене - и помечать образ SHA коммита. Эти правила записаны как G-MLOPS-008 и G-MLOPS-009 в [mlops.md](mlops.md) и здесь не повторяются.

### G-REPRO-014 · SHOULD · Версия датасета зафиксирована в коде загрузки и указана в результатах (в TFDS - как минимум компонент MAJOR)
- Проверка: частично: поиск `tfds.load(` без версии в имени датасета; остальное - ручное ревью.
- Источник: [TFDS, «Datasets versioning»](https://www.tensorflow.org/datasets/datasets_versioning) (2021-06-17, не обновляется) · официальный гайд · высокая.
- Пример:

```python
# плохо: версия датасета определяется тем, что установлено сегодня
ds = tfds.load('imagenet2012')

# хорошо: MAJOR закреплён; PATCH и MINOR данные читателя не меняют
ds = tfds.load('imagenet2012:3.*.*')
```

В TFDS рост MAJOR означает, что данные или разбиения изменились; семантика заявлена как «best effort». Общий принцип - читать входные данные по версии или снимку, а не «последнюю версию» - записан как G-MLOPS-006 в [mlops.md](mlops.md).

## 5. Правила: конфиг и код запуска

### G-REPRO-015 · SHOULD · Действующий конфиг запуска сохраняется в рабочем каталоге рядом с метриками
- Проверка: частично: тест, что после короткого запуска в рабочем каталоге есть сохранённый конфиг; остальное - ручное ревью.
- Источник: [flax/examples/mnist/train.py](https://github.com/google/flax/blob/main/examples/mnist/train.py) (2026-10-07) · практика, выведенная из репозиториев (гиперпараметры пишутся в журнал TensorBoard в 7 из 11 примеров Flax с конфигом) · средняя · реконструкция; [gin docs, «Retrieving "operative" parameter values»](https://github.com/google/gin-config/blob/master/docs/index.md#retrieving-operative-parameter-values) (документация 2024-12-04) · конфиг или инструмент · высокая.
- Пример: во Flax это одна строка - `summary_writer.hparams(dict(config))`. `ConfigDict` печатается в YAML; в gin ту же роль играет operative config (G-ML-013 в [project-structure.md](project-structure.md)). Сохранять нужно действующие значения с учётом оверрайдов командной строки, а не исходный файл конфига.

### G-REPRO-016 · SHOULD · Код зафиксирован в системе контроля версий даже на предварительных итерациях; запись о запуске ссылается на коммит и содержит команду воспроизведения
- Проверка: ручное ревью записи об эксперименте.
- Источник: [ML Crash Course, «Test model updates with reproducible training»](https://developers.google.com/machine-learning/crash-course/production-ml-systems/deployment-testing) (2025-08-25) · официальный гайд · высокая; [Deep Learning Tuning Playbook, «Setting up experiment tracking»](https://github.com/google-research/tuning_playbook#setting-up-experiment-tracking) (2024-06-13, не обновляется) · книга, статья или доклад · высокая.
- Пример: Tuning Playbook допускает и запись о незакоммиченных изменениях - как минимум заметку о том, чем запуск отличался от коммита.

## 6. Правила: метрики и трекинг экспериментов

Чем пользуется код Google. В примерах Flax метрики пишутся в TensorBoard-совместимый журнал в рабочем каталоге: через `flax.metrics.tensorboard.SummaryWriter` (4 примера) или `clu.metric_writers` (6 примеров) - всего 10 из 11 примеров с конфигом. В `requirements.txt` проектов google-research `tensorboard` указан в 49 из 468 файлов, `clu` - в 32, `wandb` - в 5, `mlflow` - ни в одном (подсчёт автора профиля, коммит `72ffe35`; нижняя оценка, см. оговорку в [project-structure.md](project-structure.md)).

| Инструмент | Чей | Что даёт | Место в профиле |
|---|---|---|---|
| TensorBoard | Google (TensorFlow) | журнал скалярных метрик и гиперпараметров запуска, сравнение запусков | по умолчанию для метрик обучения |
| Experiments (Vertex AI, с 2026 года - Gemini Enterprise Agent Platform) | продукт Google Cloud | связывает параметры, метрики и артефакты запусков через ML Metadata | управляемый вариант для команд на Google Cloud |
| ML Metadata (TFX) | Google | записи о запусках компонентов пайплайна и их артефактах | см. [mlops.md](mlops.md) |
| MLflow Tracking | не Google | запуски с параметрами, метриками, артефактами и датасетами | альтернатива вне Google Cloud; см. [libraries.md](libraries.md) |

Оговорка: [страница продукта Experiments](https://docs.cloud.google.com/vertex-ai/docs/experiments/intro-vertex-ai-experiments) при проверке отдала только заголовок и краткое описание (отслеживание и анализ архитектур моделей, гиперпараметров и окружений обучения); подробности взяты из [best practices](https://docs.cloud.google.com/architecture/ml-on-gcp-best-practices#use-tensorboard-and-experiments-to-analyze-experiments).

### G-REPRO-017 · SHOULD · Каждый эксперимент записан в системе трекинга: название, ссылка на конфиг, заметки, число запусков (trials), лучшая метрика на валидации, команда воспроизведения
- Проверка: ручное ревью; шаблон записи эксперимента в репозитории или трекере.
- Источник: [Deep Learning Tuning Playbook, «Setting up experiment tracking»](https://github.com/google-research/tuning_playbook#setting-up-experiment-tracking) (2024-06-13, не обновляется) · книга, статья или доклад · высокая.
- Пример: гайд не предписывает инструмент - подойдёт любой, который хранит эти поля и удобен команде, вплоть до таблицы. Его довод: эксперимент, которого нет в трекинге, для команды всё равно что не существует. Минимальная запись:

| Поле | Пример |
|---|---|
| Название | `lr-sweep-2026-10-09` |
| Конфиг | `configs/default.py` @ `3f2a1c9`, оверрайды `--config.learning_rate=0.05` |
| Заметки | проверяем чувствительность к learning rate |
| Число запусков | 12 |
| Лучшая метрика на валидации | accuracy 0.9917, шаг 4200 |
| Воспроизведение | `python -m my_project.main --config=… --workdir=…` |
| Окружение (G-REPRO-010) | JAX 0.11.2, 1×GPU, lock-файл `requirements_lock_3_12.txt` |

### G-REPRO-018 · SHOULD · Метрики обучения и оценки пишутся в журнал TensorBoard-совместимого формата в рабочем каталоге запуска
- Проверка: частично: тест, что после короткого запуска в рабочем каталоге появился журнал событий; остальное - ручное ревью.
- Источник: [flax/examples/mnist/train.py](https://github.com/google/flax/blob/main/examples/mnist/train.py) (2026-10-07) · практика, выведенная из репозиториев (10 из 11 примеров Flax с конфигом) · средняя · реконструкция; [Best practices for implementing ML on Google Cloud, «…TensorBoard and Experiments…»](https://docs.cloud.google.com/architecture/ml-on-gcp-best-practices#use-tensorboard-and-experiments-to-analyze-experiments) (ревизия 2024-09-09) · официальный гайд · высокая.
- Пример: формат вызовов `logging` для текстовых сообщений (шаблон с `%`-подстановкой, а не f-строка) задаёт Python-гайд - см. [../languages/python.md](../languages/python.md).

### G-REPRO-019 · SHOULD · Чекпойнты сохраняются регулярно в рабочий каталог запуска; хранятся N лучших, а лучший выбирается ретроспективно по метрике на валидации
- Проверка: ручное ревью настройки чекпойнтера.
- Источник: [Deep Learning Tuning Playbook, «Saving checkpoints and retrospectively selecting the best checkpoint»](https://github.com/google-research/tuning_playbook#saving-checkpoints-and-retrospectively-selecting-the-best-checkpoint) (2024-06-13, не обновляется) · книга, статья или доклад · высокая; [Best practices for implementing ML on Google Cloud, чекпойнты](https://docs.cloud.google.com/architecture/ml-on-gcp-best-practices#use-training-checkpoints-to-save-the-current-state-of-your-experiment) (ревизия 2024-09-09) · официальный гайд · высокая.
- Пример: Tuning Playbook советует обучать фиксированное число шагов и выбирать чекпойнт задним числом - лучший часто не последний. Документ Google Cloud добавляет: чекпойнты нужны и для того, чтобы сбой не обнулял прогресс; каждому эксперименту или запуску - своя папка. Форматы сохранения для конкретных библиотек (Orbax, `.keras`) - в [libraries.md](libraries.md).

## 7. Пробелы и альтернативы «не Google»

| Пробел | Что есть у Google | Альтернатива «не Google» |
|---|---|---|
| Гайд по фиксации окружения ML-проекта | публичных данных не найдено; есть README TensorFlow о собственной сборке и практика двух репозиториев | Cookiecutter Data Science: окружение - первый шаг воспроизведения ([opinions](https://cookiecutter-data-science.drivendata.org/opinions/)) |
| Детерминизм JAX на GPU (XLA) | публичных данных не найдено | - |
| Воспроизводимость в PyTorch | не библиотека Google | [заметка «Reproducibility» в документации PyTorch 2.14](https://docs.pytorch.org/docs/2.14/notes/randomness.html) - правило G-REPRO-007 |
| Случайность в scikit-learn | не библиотека Google | [«Common pitfalls and recommended practices»](https://scikit-learn.org/stable/common_pitfalls.html) - правило G-REPRO-008 |
| Сервер трекинга вне Google Cloud | TensorBoard (журналы), продукт Experiments | [MLflow Tracking](https://mlflow.org/docs/latest/ml/tracking/): запуски с параметрами, метриками, артефактами |
| Содержимое продуктовой документации Experiments | страница при проверке отдала только заголовок | - |

## 8. Сводка: правило → инструмент

| Правило | Проверка |
|---|---|
| G-REPRO-011 | тест в CI |
| G-REPRO-012 | `pip install --require-hashes`, `uv pip sync --require-hashes`; джоб перегенерации lock-файла |
| G-REPRO-013 | поиск строк без `==` в `requirements.txt` (частично) |
| G-REPRO-003, G-REPRO-004, G-REPRO-007, G-REPRO-008, G-REPRO-014, G-REPRO-015, G-REPRO-018 | частично: тест или поиск по коду |
| G-REPRO-001, G-REPRO-002, G-REPRO-005, G-REPRO-006, G-REPRO-009, G-REPRO-010, G-REPRO-016, G-REPRO-017, G-REPRO-019 | ручное ревью |
