# Правила работы с ML-библиотеками: профиль Google

> Данные актуальны на 2026-10-09.

У библиотек Google антипаттерны записаны прямо в документации: у TensorFlow - в гайде по `tf.function`, у JAX - в «The Sharp Bits», у Keras - в гайдах по сериализации и в Keras API design guidelines, у Flax - в гайдах по NNX. Общий мотив один: код, который трассируется и компилируется (`tf.function`, `jax.jit`), должен быть чистой функцией над тензорами, а модель сохраняется в формате без исполняемого кода. Большинство рекомендаций имеют уровень SHOULD; MUST в профиле стоит там, где источник использует обязательную формулировку или где нарушение даёт ошибку либо неверный результат без предупреждения. Для PyTorch, scikit-learn и Hugging Face правил Google нет - публичных данных не найдено; взяты официальные гайды этих проектов с пометкой «не Google».

Области идентификаторов: `G-LIB` (этот документ), `G-MLOPS` ([mlops.md](mlops.md)). Сиды, детерминизм и трекинг экспериментов - в [reproducibility.md](reproducibility.md); структура проекта, конфиги экспериментов, типизация тензоров и docstring - в [project-structure.md](project-structure.md); ноутбуки - в [notebooks.md](notebooks.md). Примеры кода отформатированы по профилю (4 пробела, см. [python.md](../languages/python.md)); собственный код TensorFlow, JAX и Flax использует 2 пробела - об этом расхождении см. раздел 5.

## 1. Библиотеки и их состояние

| Библиотека | Владелец | Состояние на 2026-10-09 | Что учитывать |
|---|---|---|---|
| TensorFlow | Google | активна: v2.21.0 от 2026-03-04; гайды на tensorflow.org не обновлялись с 2024 года | с версии 2.16 `tf.keras` по умолчанию - Keras 3 |
| Keras 3 | keras-team (Google) | активна: v3.15.1 от 2026-07-29; гайды на keras.io датированы 2023 годом | работает на JAX, TensorFlow, PyTorch и OpenVINO (только инференс); пакет `tf_keras` (Keras 2) - в режиме поддержки |
| Keras API design guidelines | keras-team | не обновляется: документ добавлен 2020-05-29, последняя правка (опечатка) 2022-02-12; лицензия в репозитории не указана | сам называет себя рекомендациями, а не правилами |
| JAX | команда JAX (`jax-ml/jax`) | активна: 0.11.2 от 2026-09-17; «The Sharp Bits» правился 2026-10-06 | документация перестроена по уровням (101, 201 и далее); прежние страницы о случайных числах, потоке управления и отладке сохранены по старым адресам, но больше не поддерживаются; актуальные - `101/random`, `201/control-flow`, `201/debugging` |
| Flax | команда Flax (Google) | активна: v0.12.10 от 2026-09-24 | два API: NNX (рекомендован новым пользователям) и Linen (не объявлен устаревшим) |
| Optax, Chex, Orbax | Google DeepMind, Google | активны: optax v0.2.8, chex v0.1.92, orbax v0.12.7 | Orbax - рекомендованный Flax способ сохранять чекпойнты |
| PyTorch | PyTorch Foundation | документация 2.14 | не Google |
| scikit-learn | проект scikit-learn | 1.9.1 | не Google |
| Hugging Face (Transformers, Hub) | Hugging Face | Transformers v5.17.0 | не Google |
| MLflow, DVC | проекты MLflow и DVC | MLflow 3; версия DVC на страницах документации не указана | не Google; правила применения - в [mlops.md](mlops.md) и [reproducibility.md](reproducibility.md) |

## 2. Сводная таблица

Столбец «Уверенность»: высокая - рекомендация прямо сформулирована в официальном источнике; средняя - источник краткий, устаревший или это практика из одного примера. Стрелка ведёт к правилу с идентификатором, если оно есть.

| Библиотека | Рекомендации | Антипаттерны | Источник | Уверенность |
|---|---|---|---|---|
| TensorFlow | Отлаживать в eager-режиме, затем добавлять `@tf.function`; для отладки - `tf.config.run_functions_eagerly(True)` → G-LIB-001 | Побочные эффекты Python внутри `tf.function` (`print`, `list.append`, изменение объектов): они выполняются только при трассировке | [tf.function](https://www.tensorflow.org/guide/function) | высокая |
| TensorFlow | Передавать тензоры, задавать `input_signature`, использовать `reduce_retracing=True` → G-LIB-002 | Python-аргумент, меняющийся от вызова к вызову: каждое значение - новая трассировка | [tf.function](https://www.tensorflow.org/guide/function) | высокая |
| TensorFlow | Данные подавать через `tf.data.Dataset`, результаты цикла копить в `tf.TensorArray` → G-LIB-003 | Цикл по данным Python или NumPy внутри `tf.function`; генераторы как аргументы; накопление в списке Python | [tf.function](https://www.tensorflow.org/guide/function) | высокая |
| TensorFlow | Результаты возвращать через `return`; переменные держать в `tf.Module` и слоях Keras; оборачивать в `tf.function` крупные блоки → G-LIB-004 | Рекурсивные `tf.function`; `tf.Tensor` в атрибутах объектов; `compat.v1` | [tf.function](https://www.tensorflow.org/guide/function), [Effective TF2](https://www.tensorflow.org/guide/effective_tf2) | высокая |
| TensorFlow | Использовать самый высокоуровневый API, которого хватает: `fit`, `evaluate`, `predict` раньше собственного `train_step` и `GradientTape` | Низкоуровневый цикл обучения без необходимости | [Effective TF2](https://www.tensorflow.org/guide/effective_tf2), [шаблон ноутбука](https://github.com/tensorflow/docs/blob/master/tools/templates/notebook.ipynb) | высокая |
| TensorFlow (`tf.data`) | `prefetch`; параллельные `interleave` и `map`; `cache` после дорогого `map`; `batch` до `map` → G-LIB-005 | Синхронный пайплайн без `prefetch`; `cache` перед дорогим преобразованием; поэлементный `map` | [tf.data performance](https://www.tensorflow.org/guide/data_performance) | высокая |
| TensorFlow | Смешанная точность: `mixed_float16` на GPU, `mixed_bfloat16` на TPU; выход модели в `float32`; в своём цикле - `LossScaleOptimizer` → G-LIB-006 | Softmax и выход модели в `float16`; `mixed_float16` на обычном x86 CPU | [Mixed precision](https://www.tensorflow.org/guide/mixed_precision) | высокая |
| TensorFlow | Объекты Keras сохранять в `.keras` и экспортировать `Model.export`; SavedModel - для `tf.Module`; для обслуживания объявлять сигнатуры → G-LIB-007 | Вызывать загруженную функцию с новой сигнатурой; загружать SavedModel из недоверенного источника | [SavedModel](https://www.tensorflow.org/guide/saved_model) | высокая |
| TensorFlow | Детерминизм: `keras.utils.set_random_seed` (как в G-REPRO-004; в коде на `tf_keras` - `tf.keras.utils.set_random_seed`) и `tf.config.experimental.enable_op_determinism()` в начале программы → [reproducibility.md](reproducibility.md) | Ожидать детерминизма между версиями TensorFlow и на разном железе | [docstring `enable_op_determinism`](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/python/framework/config.py) | высокая |
| TensorFlow (C++ ops) | Сначала композиция существующих операций; имя в CamelCase с префиксом проекта; `OP_REQUIRES`; `tf_custom_op_library` → G-MLOPS-029 … G-MLOPS-031 | Разделяемое состояние в `OpKernel` без мьютекса; несовместимое изменение спецификации операции | [Create an op](https://www.tensorflow.org/guide/create_op) | высокая |
| Keras 3 | В пользовательских слоях, функциях потерь и метриках - только `keras.ops` → G-LIB-008 | Вызовы `tf.*`, `torch.*`, `jax.numpy.*` внутри слоя: слой привязан к одному бэкенду | [Making new layers and models via subclassing](https://keras.io/guides/making_new_layers_and_models_via_subclassing/) | высокая |
| Keras 3 | Веса создавать в `build()` через `add_weight`, вложенные слои - в `__init__`; аргумент `training` в `call()`; `Layer` - для блоков, `Model` - для того, что обучают и сохраняют → G-LIB-009 | Создавать веса при каждом вызове | [Making new layers and models via subclassing](https://keras.io/guides/making_new_layers_and_models_via_subclassing/) | высокая |
| Keras 3 | Пользовательский класс определяет `get_config()` (при непримитивных аргументах - и `from_config()`) и регистрируется `@keras.saving.register_keras_serializable` → G-LIB-010 | Рассчитывать, что файл `.keras` содержит код пользовательских классов | [Serialization and saving](https://keras.io/guides/serialization_and_saving/) | высокая |
| Keras 3 | Модель целиком - `model.save("model.keras")`; только веса - `save_weights("model.weights.h5")` → G-LIB-011 | `pickle` для моделей; имя файла без расширения `.keras` | [Serialization and saving](https://keras.io/guides/serialization_and_saving/), [FAQ](https://keras.io/getting_started/faq/) | высокая |
| Keras 3 | Загружать модели с `safe_mode=True` (по умолчанию) → G-LIB-012 | `safe_mode=False` для чужих файлов: десериализация `lambda` исполняет произвольный код | [docstring `load_model`](https://github.com/keras-team/keras/blob/master/keras/src/saving/saving_api.py) | высокая |
| Keras 3 | Старый код на Keras 2 - пакет `tf_keras` и `TF_USE_LEGACY_KERAS=1`; новый код - Keras 3 → G-LIB-013 | Смешивать Keras 2 и Keras 3 в одной программе; начинать новый проект на `tf_keras` | [Keras 3](https://keras.io/keras_3/) | высокая |
| Keras 3 | Воспроизводимость: `keras.utils.set_random_seed(seed)`, `PYTHONHASHSEED` до старта процесса → [reproducibility.md](reproducibility.md) | Ожидать одинаковых случайных чисел на разных бэкендах при одном сиде | [FAQ](https://keras.io/getting_started/faq/), [Keras 3](https://keras.io/keras_3/) | высокая |
| Keras 3 | На бэкенде JAX в функциональном коде - методы `stateless_call`, `stateless_apply`, `stateless_update_state` | - | [Keras 3](https://keras.io/keras_3/) | средняя |
| Keras (дизайн API) | Не больше 6-7 аргументов; явные одноуровневые аргументы; значения по умолчанию - лучшая практика; простые типы Python, значения-перечисления - строки → G-LIB-014 | `MyLayer(hyperparameter_dict)`; аргументы, раскрывающие реализацию; зависимость от имён переменных | [Keras API design guidelines](https://github.com/keras-team/governance/blob/master/keras_api_design_guidelines.md#seek-to-minimize-cognitive-load-for-our-users) | высокая (документ 2020 года) |
| Keras (дизайн API) | Имена: `num_*` для счётчиков, `axis`, `ndim`, `units`; слои - существительные (`Normalization`); полные слова (`attention_scores`) | Сокращения (`attn_scores`); глаголы в именах слоёв (`Normalize`) | [Keras API design guidelines](https://github.com/keras-team/governance/blob/master/keras_api_design_guidelines.md#seek-to-minimize-cognitive-load-for-our-users) | высокая (документ 2020 года) |
| Keras (дизайн API) | То, что создаёт состояние или побочные эффекты, - класс; функции без состояния | Функция со скрытым состоянием | [Keras API design guidelines](https://github.com/keras-team/governance/blob/master/keras_api_design_guidelines.md#balance-expressivity-vs-user-friendliness) | высокая (документ 2020 года) |
| Keras (дизайн API) | Ввод пользователя проверять `ValueError`; сообщение отвечает «что передано, что ожидалось, как исправить»; в каждом docstring - пример кода → G-LIB-015 | `assert` для проверки ввода | [Keras API design guidelines](https://github.com/keras-team/governance/blob/master/keras_api_design_guidelines.md#dont-neglect-error-messages-docstrings-and-documentation) | высокая (документ 2020 года) |
| Keras (вклад в репозиторий) | Каждая новая операция имеет реализацию, не зависящую от бэкенда, и тесты обоих путей; ruff, строка 80; тесты `*_test.py` рядом с кодом | Вызывать публичный `keras.ops` внутри `keras/src/ops/` вместо `backend.ops` | [CONTRIBUTING.md](https://github.com/keras-team/keras/blob/master/CONTRIBUTING.md) | высокая |
| JAX | Под `jit`, `grad`, `vmap` - только чистые функции; состояние цикла - через `lax.scan` и `lax.fori_loop` → G-LIB-016 | `print`, чтение и запись глобальных переменных, итераторы Python внутри `jit` | [The Sharp Bits, «Pure functions»](https://docs.jax.dev/en/latest/notebooks/Common_Gotchas_in_JAX.html) | высокая |
| JAX | Обновлять массив функционально: `x = x.at[idx].set(y)`, `.at[idx].add(...)` → G-LIB-017 | `x[idx] = y`: массивы неизменяемы, это ошибка | [The Sharp Bits, «In-place updates»](https://docs.jax.dev/en/latest/notebooks/Common_Gotchas_in_JAX.html) | высокая |
| JAX | Явные ключи: `jax.random.key(seed)`, затем `jax.random.split` перед каждым использованием → G-LIB-018 | Повторное использование ключа; расчёт на глобальный сид в стиле NumPy; ожидание, что генерация по одному числу и пакетом даст одно и то же | [Pseudorandom numbers](https://docs.jax.dev/en/latest/101/random.html) | высокая |
| JAX | Ветвление и циклы по значениям: `lax.cond`, `lax.switch`, `lax.while_loop`, `lax.fori_loop`, `lax.scan`, `jnp.where`; статические аргументы - `static_argnums`, `static_argnames` → G-LIB-019 | Python `if` и `while` по трассируемому значению (`TracerBoolConversionError`); `and` и `or` над массивами; частая смена статических аргументов (перекомпиляция) | [Control flow and logical operators with `jit`](https://docs.jax.dev/en/latest/201/control-flow.html) | высокая |
| JAX | Формы массивов под трансформациями статические; маскирование через `jnp.where(mask, x, 0)` → G-LIB-020 | Булева индексация `x[mask]` под `jit` | [The Sharp Bits, «Dynamic shapes»](https://docs.jax.dev/en/latest/notebooks/Common_Gotchas_in_JAX.html) | высокая |
| JAX | Выход за границы считать неопределённым поведением; при необходимости задавать режим: `x.at[i].get(mode="fill", fill_value=jnp.nan)` → G-LIB-021 | Рассчитывать на исключение, как в NumPy: чтение прижимается к краю, обновление молча пропускается | [The Sharp Bits, «Out-of-bounds indexing»](https://docs.jax.dev/en/latest/notebooks/Common_Gotchas_in_JAX.html) | высокая |
| JAX | Списки и кортежи превращать в массив; в публичных функциях входы - `jax.typing.ArrayLike`, выходы - `jax.Array` → G-LIB-022 | Передавать `list` и `tuple` в трассируемые функции: каждый элемент становится отдельной переменной | [The Sharp Bits, «Non-array inputs»](https://docs.jax.dev/en/latest/notebooks/Common_Gotchas_in_JAX.html), [jax.typing](https://docs.jax.dev/en/latest/jax.typing.html) | высокая |
| JAX | `float64` включать при старте: `JAX_ENABLE_X64=True` или `jax.config.update("jax_enable_x64", True)`; искать NaN флагом `jax_debug_nans` → G-LIB-023 | Включать x64 после начала вычислений; держать проверку NaN включённой в обычных запусках | [The Sharp Bits, «Double (64bit) precision»](https://docs.jax.dev/en/latest/notebooks/Common_Gotchas_in_JAX.html), [Debugging runtime values](https://docs.jax.dev/en/latest/201/debugging.html) | высокая |
| JAX | `jit` для методов: вынести вычисление в функцию, либо сделать `self` статическим аргументом с `__hash__` и `__eq__`, либо зарегистрировать класс как PyTree → G-LIB-024 | `@jit` прямо на методе класса | [The Sharp Bits, «Using jax.jit with class methods»](https://docs.jax.dev/en/latest/notebooks/Common_Gotchas_in_JAX.html) | высокая |
| Flax | Новые проекты - на NNX → G-LIB-025 | Считать Linen удалённым или запрещённым | [docs_nnx/index.rst](https://github.com/google/flax/blob/main/docs_nnx/index.rst) | высокая |
| Flax (NNX) | Состояние - атрибуты `nnx.Module`; случайность - `rngs: nnx.Rngs` в конструкторах; оптимизатор - `nnx.Optimizer(model, optax.adam(1e-3), wrt=nnx.Param)`; трансформации - `nnx.jit`, `nnx.value_and_grad` | - | [Why Flax NNX](https://flax.readthedocs.io/en/latest/why.html) | высокая |
| Flax (NNX) | Чекпойнты через Orbax: сохранять `nnx.State` из `nnx.split`, восстанавливать через `nnx.merge` → G-LIB-026 | `flax.training.checkpoints` (объявлен устаревшим в 2023 году) | [Save and load checkpoints](https://flax.readthedocs.io/en/latest/guides/checkpointing.html) | высокая |
| Flax (NNX) | Убирать накладные расходы `nnx.jit`: `nnx.cached_partial` или функциональный шаг обучения → G-LIB-027 | Менять структуру графа модулей внутри шага обучения | [Performance considerations](https://flax.readthedocs.io/en/latest/guides/performance.html) | высокая |
| Flax | Новый способ обучения - форк примера и правка цикла; дублирование кода лучше плохой абстракции; все примеры устроены одинаково (см. [project-structure.md](project-structure.md)) | Добавлять опции в функции фреймворка ради частного случая | [Philosophy](https://flax.readthedocs.io/en/latest/philosophy.html), [README](https://github.com/google/flax/blob/main/README.md) | высокая |
| Flax | При работе вместе с `tf.data` и TFDS скрывать GPU от TensorFlow: `tf.config.experimental.set_visible_devices([], "GPU")` | Оставлять TensorFlow доступ к GPU: он может занять память, нужную JAX | [пример MNIST, main.py](https://github.com/google/flax/blob/main/examples/mnist/main.py) | средняя (практика одного примера) |
| PyTorch (не Google) | Сохранять `state_dict`; чекпойнт - словарь с состояниями модели и оптимизатора; `torch.load(..., weights_only=True)`; перед инференсом `model.eval()` → G-LIB-028 | `torch.save(model, path)` целиком; `weights_only=False` для чужих файлов | [Serialization semantics](https://docs.pytorch.org/docs/2.14/notes/serialization.html), [Saving and loading models](https://docs.pytorch.org/tutorials/beginner/saving_loading_models.html) | высокая |
| PyTorch (не Google) | Создавать тензоры сразу на устройстве; `torch.no_grad()` при валидации; `num_workers` у `DataLoader`; AMP: `torch.autocast` только вокруг прямого прохода и функции потерь → G-LIB-029 | `.item()`, `.cpu()`, `print(tensor)` в горячем цикле; anomaly detection и профайлер в обычном обучении; `backward()` под `autocast` | [Performance tuning guide](https://docs.pytorch.org/tutorials/recipes/recipes/tuning_guide.html), [AMP recipe](https://docs.pytorch.org/tutorials/recipes/recipes/amp_recipe.html) | высокая |
| PyTorch (не Google) | `torch.compile` и `torch.export`; ветвление по данным - `torch.cond`; распределённое обучение - `DistributedDataParallel` → G-LIB-030 | `torch.jit.trace` и `torch.jit.script` в новом коде; `DataParallel` | [torch.compile tutorial](https://docs.pytorch.org/tutorials/intermediate/torch_compile_tutorial.html), [Performance tuning guide](https://docs.pytorch.org/tutorials/recipes/recipes/tuning_guide.html) | высокая |
| PyTorch (не Google) | Сиды и детерминизм: `torch.manual_seed`, `torch.use_deterministic_algorithms(True)`, генератор и `worker_init_fn` у `DataLoader` → [reproducibility.md](reproducibility.md) | Ожидать воспроизводимости между релизами, платформами, CPU и GPU | [Reproducibility](https://docs.pytorch.org/docs/2.14/notes/randomness.html) | высокая |
| scikit-learn (не Google) | Сначала разбиение на train и test, потом предобработка; предобработка, отбор признаков и модель - в одном `Pipeline` → G-LIB-031 | `fit` на тестовых данных; отбор признаков на всех данных до разбиения | [Common pitfalls and recommended practices](https://scikit-learn.org/stable/common_pitfalls.html) | высокая |
| scikit-learn (не Google) | `random_state` передавать явно; в сплиттеры кросс-валидации - целое число → [reproducibility.md](reproducibility.md) | Глобальный сид `np.random.seed(0)` | [Common pitfalls and recommended practices](https://scikit-learn.org/stable/common_pitfalls.html) | высокая |
| scikit-learn (не Google) | Свой estimator: `__init__` только сохраняет параметры; `fit` возвращает `self`; выученные атрибуты оканчиваются на `_`; проверка `check_estimator` → G-LIB-032 | Логика и валидация в `__init__`; глобальные генераторы случайных чисел; `import *` | [Developing scikit-learn estimators](https://scikit-learn.org/stable/developers/develop.html) | высокая |
| Hugging Face (не Google) | Веса - в safetensors → G-LIB-033 | Pickle-файлы весов из недоверенных источников | [Safetensors](https://huggingface.co/docs/safetensors/index) | средняя (страница краткая) |
| Hugging Face (не Google) | Карточка модели - `README.md` с YAML-метаданными (`license`, `language`, `library_name`, `pipeline_tag`, `base_model`, `datasets`, `tags`); карточка датасета - так же → G-LIB-034 | Полагаться на автоопределение библиотеки вместо `library_name` | [Model cards](https://huggingface.co/docs/hub/model-cards), [Dataset cards](https://huggingface.co/docs/hub/datasets-cards) | высокая |
| Hugging Face (не Google) | Файлы больше 10 МБ в репозитории Hub - через `git-xet` (CLI `hf` делает это сам) | Коммитить большие файлы обычным git | [Getting started with repositories](https://huggingface.co/docs/hub/repositories-getting-started) | высокая |
| Hugging Face (не Google) | Transformers: три класса на модель (конфигурация, модель, препроцессор); единые `from_pretrained()`, `save_pretrained()`, `push_to_hub()`; код модели самодостаточен, копии синхронизируются пометкой `# Copied from` | Общие абстракции для поведения, специфичного для одной модели | [Philosophy](https://huggingface.co/docs/transformers/philosophy), [блог, 2022-04-05](https://huggingface.co/blog/transformers-design-philosophy) | высокая |
| MLflow (не Google) | Каждый запуск обучения - run с параметрами, метриками, артефактами и датасетами; модель логируется с сигнатурой или `input_example`; в реестре - версии и алиасы | Нетрекаемые запуски; файловое хранилище при использовании реестра; модель без сигнатуры | [Tracking](https://mlflow.org/docs/latest/ml/tracking/), [Model Registry](https://mlflow.org/docs/latest/ml/model-registry/), [Model signatures](https://mlflow.org/docs/latest/ml/model/signatures/) | высокая |
| DVC (не Google) | `dvc add` создаёт `.dvc`-файл и запись в `.gitignore`, в git идут они; данные - в удалённое хранилище (`dvc push`); пайплайн - стадии в `dvc.yaml`, гиперпараметры - в `params.yaml` → G-MLOPS-003 | Коммитить данные в git; циклы в графе стадий; гиперпараметры в коде | [Get Started](https://doc.dvc.org/start), [Defining pipelines](https://doc.dvc.org/user-guide/pipelines/defining-pipelines) | высокая |

## 3. Правила

### 3.1. TensorFlow

Все гайды TensorFlow из этого раздела не обновлялись с 2024 года: даты ячеек - от 2024-03-23 до 2024-08-15. Библиотека при этом выпускается (v2.21.0).

### G-LIB-001 · SHOULD · Функция сначала отлаживается в eager-режиме, `@tf.function` добавляется после; внутри `tf.function` код не полагается на побочные эффекты Python
- Проверка: ручное ревью; для отладки - `tf.config.run_functions_eagerly(True)`.
- Источник: [Better performance with tf.function](https://www.tensorflow.org/guide/function) (2024-08-15) · официальный гайд · высокая.
- Пример:

```python
# плохо: print и append выполнятся один раз - при трассировке
history = []

@tf.function
def step(x):
    print("step", x)
    history.append(x)
    return x * 2

# хорошо: вывод через операцию графа, результат - через return
@tf.function
def step(x):
    tf.print("step", x)
    return x * 2
```

### G-LIB-002 · SHOULD · В `tf.function` передаются тензоры, а не меняющиеся значения Python; сигнатура фиксируется через `input_signature` или `reduce_retracing=True`
- Проверка: ручное ревью; предупреждение TensorFlow о частой повторной трассировке в логах.
- Источник: [Better performance with tf.function, раздел об управлении повторной трассировкой](https://www.tensorflow.org/guide/function) (2024-08-15) · официальный гайд · высокая.
- Пример:

```python
# плохо: каждое новое число Python - новый граф
@tf.function
def train_step(batch, learning_rate):
    ...

for learning_rate in (0.1, 0.01, 0.001):
    train_step(batch, learning_rate)

# хорошо: скаляр передан тензором, сигнатура зафиксирована
@tf.function(input_signature=(
    tf.TensorSpec(shape=[None, 28, 28], dtype=tf.float32),
    tf.TensorSpec(shape=[], dtype=tf.float32),
))
def train_step(batch, learning_rate):
    ...

train_step(batch, tf.constant(0.1))
```

### G-LIB-003 · SHOULD · Данные подаются в `tf.function` через `tf.data.Dataset`, а результаты цикла накапливаются в `tf.TensorArray`
- Проверка: ручное ревью.
- Источник: [Better performance with tf.function, раздел о преобразованиях AutoGraph](https://www.tensorflow.org/guide/function) (2024-08-15) · официальный гайд · высокая.
- Пример:

```python
# плохо: список Python не является частью графа
@tf.function
def doubled(n):
    outputs = []
    for i in tf.range(n):
        outputs.append(i * 2)
    return outputs

# хорошо
@tf.function
def doubled(n):
    outputs = tf.TensorArray(tf.int32, size=n)
    for i in tf.range(n):
        outputs = outputs.write(i, i * 2)
    return outputs.stack()
```

### G-LIB-004 · SHOULD · Состояние хранится в `tf.Variable` внутри `tf.Module` или слоёв Keras; `tf.Tensor` не сохраняется в атрибутах объектов, API `compat.v1` не используется
- Проверка: частично: поиск `compat.v1` (`grep` или ruff `TID251` с запретом `tensorflow.compat.v1`); остальное - ручное ревью.
- Источник: [Effective TensorFlow 2](https://www.tensorflow.org/guide/effective_tf2) (2024-03-23) · официальный гайд · высокая; [Better performance with tf.function, раздел об ограничениях](https://www.tensorflow.org/guide/function) (2024-08-15) · официальный гайд · высокая.

### G-LIB-005 · SHOULD · Входной пайплайн `tf.data` заканчивается `prefetch`, преобразования выполняются параллельно, `cache` стоит после дорогого `map`, а `batch` - до `map`, если преобразование векторизуется
- Проверка: ручное ревью; профилирование входного пайплайна.
- Источник: [Better performance with the tf.data API, итоговый список практик](https://www.tensorflow.org/guide/data_performance) (2024-08-15) · официальный гайд · высокая.
- Пример:

```python
# плохо: поэлементный синхронный map, нет prefetch
dataset = dataset.map(parse_example).batch(64)

# хорошо: векторизованный параллельный map, кеш после него, prefetch в конце
dataset = (
    dataset.batch(64)
    .map(parse_batch, num_parallel_calls=tf.data.AUTOTUNE)
    .cache()
    .prefetch(tf.data.AUTOTUNE)
)
```

`cache` уместен, только если результат помещается в память или на локальный диск.

### G-LIB-006 · SHOULD · При смешанной точности политика задаётся глобально, выходной слой модели остаётся в `float32`, а в собственном цикле обучения используется `LossScaleOptimizer`
- Проверка: ручное ревью; тест на `dtype` выхода модели.
- Источник: [Mixed precision](https://www.tensorflow.org/guide/mixed_precision) (2024-03-23) · официальный гайд · высокая.
- Пример:

```python
keras.mixed_precision.set_global_policy("mixed_float16")

# плохо: softmax считается в float16
outputs = keras.layers.Dense(10, activation="softmax")(x)

# хорошо: последний слой явно в float32
x = keras.layers.Dense(10)(x)
outputs = keras.layers.Activation("softmax", dtype="float32")(x)
```

На обычном x86 CPU политика `mixed_float16` замедляет обучение; для TPU и CPU с AMX гайд называет `mixed_bfloat16`.

### G-LIB-007 · SHOULD · Модели Keras сохраняются в `.keras` и экспортируются `Model.export`; SavedModel для обслуживания имеет явные сигнатуры; SavedModel из недоверенного источника не загружается
- Проверка: ручное ревью; тест круга «экспорт → загрузка → предсказание» (G-MLOPS-013).
- Источник: [Using the SavedModel format](https://www.tensorflow.org/guide/saved_model) (2024-03-23) · официальный гайд · высокая.

Гайд прямо говорит, что модель TensorFlow - это код. Python-код в SavedModel не сохраняется, поэтому загруженную функцию нельзя вызвать с сигнатурой, которой не было при экспорте. Номер версии в пути экспорта - см. G-MLOPS-007.

### 3.2. Keras

Гайды на keras.io датированы 2023 годом. Keras API design guidelines - документ 2020 года без содержательных правок с тех пор и без указанной лицензии; он описывает проектирование API самой Keras, а профиль применяет его к собственным слоям и библиотечным функциям.

### G-LIB-008 · SHOULD · В пользовательских слоях, функциях потерь и метриках используются только `keras.ops` и другие пространства имён Keras
- Проверка: частично: ruff `TID251` с запретом импортов `tensorflow`, `torch`, `jax` в модулях слоёв; остальное - ручное ревью и тест слоя на двух бэкендах.
- Источник: [Making new layers and models via subclassing](https://keras.io/guides/making_new_layers_and_models_via_subclassing/) (2023-06-25) · официальный гайд · высокая.
- Пример:

```python
# плохо: слой работает только на бэкенде TensorFlow
class MeanPool(keras.layers.Layer):
    def call(self, inputs):
        return tf.math.reduce_mean(inputs, axis=1)

# хорошо: слой не зависит от бэкенда
class MeanPool(keras.layers.Layer):
    def call(self, inputs):
        return keras.ops.mean(inputs, axis=1)
```

### G-LIB-009 · SHOULD · Веса слоя создаются в `build()` через `add_weight`, вложенные слои - в `__init__`, а слой с разным поведением в обучении и инференсе принимает аргумент `training` в `call()`
- Проверка: ручное ревью.
- Источник: [Making new layers and models via subclassing](https://keras.io/guides/making_new_layers_and_models_via_subclassing/) (2023-06-25) · официальный гайд · высокая.

### G-LIB-010 · MUST · Пользовательский класс Keras (слой, модель, функция потерь) определяет `get_config()` и регистрируется декоратором `@keras.saving.register_keras_serializable`
- Проверка: тест «сохранить в `.keras` → загрузить → сравнить предсказания» для каждого пользовательского класса.
- Источник: [Serialization and saving](https://keras.io/guides/serialization_and_saving/) (2023-06-30) · официальный гайд · высокая. `get_config()` источник требует словом «must»; регистрацию декоратором называет предпочтительным способом.
- Пример:

```python
# плохо: файл .keras не содержит кода класса, загрузка не восстановит factor
class Scale(keras.layers.Layer):
    def __init__(self, factor=1.0, **kwargs):
        super().__init__(**kwargs)
        self.factor = factor

# хорошо
@keras.saving.register_keras_serializable(package="my_project")
class Scale(keras.layers.Layer):
    def __init__(self, factor=1.0, **kwargs):
        super().__init__(**kwargs)
        self.factor = factor

    def call(self, inputs):
        return inputs * self.factor

    def get_config(self):
        config = super().get_config()
        config.update({"factor": self.factor})
        return config
```

### G-LIB-011 · SHOULD · Модель Keras целиком сохраняется в файл `.keras`, только веса - в `.weights.h5`; `pickle` для моделей не используется
- Проверка: частично: ruff `S301` (вызовы `pickle`); остальное - ручное ревью.
- Источник: [Serialization and saving](https://keras.io/guides/serialization_and_saving/) (2023-06-30) · официальный гайд · высокая; [Keras FAQ](https://keras.io/getting_started/faq/) (просмотрено 2026-10-09) · официальный гайд · высокая.

### G-LIB-012 · SHOULD · Модель Keras загружается с `safe_mode=True`; `safe_mode=False` допустим только для файла из доверенного источника
- Проверка: поиск `safe_mode=False` в коде; ручное ревью.
- Источник: [docstring `keras.saving.load_model`](https://github.com/keras-team/keras/blob/master/keras/src/saving/saving_api.py) (HEAD 2026-10-09) · конфиг или инструмент · высокая.

### G-LIB-013 · MUST · В одной программе не смешиваются Keras 2 (`tf_keras`) и Keras 3; новые проекты пишутся на Keras 3
- Проверка: поиск импортов `tf_keras` и переменной `TF_USE_LEGACY_KERAS`; ручное ревью.
- Источник: [Keras 3](https://keras.io/keras_3/) (просмотрено 2026-10-09) · официальный гайд · высокая. Уровень MUST: источник называет совмещение двух версий невозможным. Вторая часть правила («новые проекты - на Keras 3») - вывод профиля: источник прямо этого не говорит, но оставляет Keras 2 только для проектов, которые не развиваются активно. `tf_keras` находится в режиме поддержки и нужен только для существующего кода.

### G-LIB-014 · SHOULD · Публичный API собственных слоёв и функций следует Keras API design guidelines: не больше 6-7 аргументов, явные одноуровневые аргументы вместо словаря гиперпараметров, значения по умолчанию соответствуют лучшей практике
- Проверка: частично: ruff `PLR0913` или pylint `R0913` (`max-args = 7`); остальное - ручное ревью.
- Источник: [Keras API design guidelines, раздел о когнитивной нагрузке](https://github.com/keras-team/governance/blob/master/keras_api_design_guidelines.md#seek-to-minimize-cognitive-load-for-our-users) (2020-05-29, не обновляется) · официальный гайд · высокая.
- Пример:

```python
# плохо: что лежит в словаре, видно только из кода слоя
layer = Attention(hyperparameter_dict)

# хорошо: аргументы видны в сигнатуре, значения по умолчанию разумны
layer = Attention(num_heads=8, key_dim=64, dropout=0.1)
```

### G-LIB-015 · SHOULD · Пользовательский ввод проверяется исключением `ValueError`, а не `assert`; сообщение об ошибке говорит, что передано, что ожидалось и как исправить
- Проверка: ruff `S101`; содержание сообщения - ручное ревью.
- Источник: [Keras API design guidelines, раздел об ошибках и документации](https://github.com/keras-team/governance/blob/master/keras_api_design_guidelines.md#dont-neglect-error-messages-docstrings-and-documentation) (2020-05-29, не обновляется) · официальный гайд · высокая; [`pyproject.toml` репозитория keras: в `select` включён `S101`](https://github.com/keras-team/keras/blob/master/pyproject.toml) (HEAD 2026-10-09) · конфиг или инструмент · высокая. Источник пишет «always», но сам документ называет себя рекомендациями, поэтому уровень SHOULD.
- Пример:

```python
# плохо: assert отключается флагом -O и ничего не объясняет
assert 0 <= rate < 1

# хорошо
if not 0 <= rate < 1:
    raise ValueError(
        "Argument `rate` must be a float in the range [0, 1). "
        f"Received: rate={rate}."
    )
```

### 3.3. JAX

Источник раздела - «The Sharp Bits» (метка проверки актуальности 2024-06-03, файл правился 2026-10-06) и страницы новой документации `101/random`, `201/control-flow`, `201/debugging` (метка 2026-07-09). Уровень MUST стоит там, где документация пишет «requires» или «never» либо нарушение даёт ошибку.

### G-LIB-016 · MUST · Функции под `jit`, `grad` и `vmap` функционально чисты: все входы приходят параметрами, все результаты возвращаются; глобальные переменные, `print` и итераторы Python внутри них не используются
- Проверка: ручное ревью; тест, вызывающий функцию дважды с разными значениями.
- Источник: [JAX - The Sharp Bits, «Pure functions»](https://docs.jax.dev/en/latest/notebooks/Common_Gotchas_in_JAX.html) (JAX 0.11.2; проверка актуальности 2024-06-03) · официальный гайд · высокая. Нарушение не всегда даёт ошибку: побочный эффект выполняется только при первой трассировке, и поведение, по словам источника, не гарантируется.
- Пример:

```python
# плохо: значение глобальной переменной «запекается» при первой трассировке
scale = 2.0

@jax.jit
def apply(x):
    print("called")
    return x * scale

# хорошо: всё, от чего зависит результат, передано аргументами
@jax.jit
def apply(x, scale):
    return x * scale
```

Для отладочной печати трассируемых значений предназначена `jax.debug.print`.

### G-LIB-017 · MUST · Массивы JAX не изменяются на месте: обновление записывается через `x.at[idx].set(y)` и родственные методы
- Проверка: ошибка времени выполнения при присваивании по индексу; ручное ревью.
- Источник: [JAX - The Sharp Bits, «In-place updates»](https://docs.jax.dev/en/latest/notebooks/Common_Gotchas_in_JAX.html) (JAX 0.11.2; проверка актуальности 2024-06-03) · официальный гайд · высокая.
- Пример:

```python
x = jnp.zeros(3)

# плохо: ошибка - массив неизменяем
x[0] = 1.0

# хорошо: возвращается новый массив
x = x.at[0].set(1.0)
```

Оператор `x += 1` ошибки не даёт, но и не меняет исходный массив: имя привязывается к новому значению, а другие ссылки на старый массив остаются прежними.

### G-LIB-018 · MUST · Случайность в JAX идёт через явные ключи: ключ создаётся `jax.random.key(seed)`, перед каждым использованием расщепляется `jax.random.split`, один ключ не используется дважды
- Проверка: ручное ревью; тест на различие двух случайных тензоров.
- Источник: [Pseudorandom numbers](https://docs.jax.dev/en/latest/101/random.html) (JAX 0.11.2; проверка актуальности 2026-07-09) · официальный гайд · высокая. Как выводить ключи для шагов обучения (`fold_in(key, step)` или один `split(key, n)`, а не цепочка расщеплений) - G-REPRO-006 в [reproducibility.md](reproducibility.md).
- Пример:

```python
key = jax.random.key(0)

# плохо: один ключ - одинаковые «случайные» числа в двух местах
noise = jax.random.normal(key, (3,))
jitter = jax.random.normal(key, (3,))

# хорошо
key, noise_key, jitter_key = jax.random.split(key, 3)
noise = jax.random.normal(noise_key, (3,))
jitter = jax.random.normal(jitter_key, (3,))
```

В новом коде документация советует `jax.random.key`, а не старый `jax.random.PRNGKey`. JAX не обещает, что генерация N чисел по одному и одним вызовом даст одинаковую последовательность. Общие правила о сидах - в [reproducibility.md](reproducibility.md).

### G-LIB-019 · MUST · Под `jit` ветвление и циклы по значениям массивов записываются через `lax.cond`, `lax.while_loop`, `lax.fori_loop`, `lax.scan` или `jnp.where`; Python `if`, `while`, `and`, `or` применяются только к статическим значениям
- Проверка: ошибка `TracerBoolConversionError` при трассировке; ручное ревью.
- Источник: [Control flow and logical operators with `jit`](https://docs.jax.dev/en/latest/201/control-flow.html) (JAX 0.11.2; проверка актуальности 2026-07-09) · официальный гайд · высокая.
- Пример:

```python
# плохо: Python не может превратить трассируемое значение в bool
@jax.jit
def positive_part(x):
    if x > 0:
        return x
    return 0.0

# хорошо
@jax.jit
def positive_part(x):
    return jnp.where(x > 0, x, 0.0)
```

Ветвление по значению, которое известно при трассировке (флаг, размер), допустимо: такой аргумент объявляется статическим через `static_argnums` или `static_argnames`, и каждое новое его значение вызывает перекомпиляцию. `jnp.logical_and` в отличие от `and` вычисляет оба операнда.

### G-LIB-020 · MUST · Формы всех массивов под `jit`, `vmap` и `grad` статические: булева индексация и другие формы, зависящие от значений, заменяются маскированием
- Проверка: ошибка при трассировке; ручное ревью.
- Источник: [JAX - The Sharp Bits, «Dynamic shapes»](https://docs.jax.dev/en/latest/notebooks/Common_Gotchas_in_JAX.html) (JAX 0.11.2; проверка актуальности 2024-06-03) · официальный гайд · высокая.
- Пример:

```python
# плохо: размер x[mask] зависит от значений
@jax.jit
def nansum(x):
    mask = ~jnp.isnan(x)
    return x[mask].sum()

# хорошо: форма не меняется, лишние элементы заменены нулями
@jax.jit
def nansum(x):
    mask = ~jnp.isnan(x)
    return jnp.where(mask, x, 0).sum()
```

### G-LIB-021 · SHOULD · Выход за границы массива в JAX считается неопределённым поведением: индексы проверяются до вызова или режим задаётся явно
- Проверка: ручное ревью; тесты на граничные индексы.
- Источник: [JAX - The Sharp Bits, «Out-of-bounds indexing»](https://docs.jax.dev/en/latest/notebooks/Common_Gotchas_in_JAX.html) (JAX 0.11.2; проверка актуальности 2024-06-03) · официальный гайд · высокая.
- Пример:

```python
x = jnp.arange(10.0)

# плохо: исключения не будет, вернётся последний элемент
value = x[11]

# хорошо: поведение за границей задано явно
value = x.at[11].get(mode="fill", fill_value=jnp.nan)
```

Обновление по индексу за границей молча пропускается.

### G-LIB-022 · SHOULD · В функции JAX передаются массивы, а не списки и кортежи; публичные функции аннотируют входы `jax.typing.ArrayLike`, а выходы - `jax.Array`
- Проверка: частично: проверка типов (см. [python.md](../languages/python.md)); остальное - ручное ревью.
- Источник: [JAX - The Sharp Bits, «Non-array inputs: NumPy vs. JAX»](https://docs.jax.dev/en/latest/notebooks/Common_Gotchas_in_JAX.html) (JAX 0.11.2) · официальный гайд · высокая; [jax.typing](https://docs.jax.dev/en/latest/jax.typing.html) (JAX 0.11.2) · официальный гайд · высокая.
- Пример:

```python
# плохо: jnp.sum не принимает список
total = jnp.sum([1, 2, 3])

# хорошо
total = jnp.sum(jnp.array([1, 2, 3]))


def normalize(x: jax.typing.ArrayLike) -> jax.Array:
    x = jnp.asarray(x)
    return x / jnp.linalg.norm(x)
```

### G-LIB-023 · SHOULD · Двойная точность включается при старте программы, а проверка NaN - только на время отладки
- Проверка: ручное ревью: `jax.config.update("jax_enable_x64", True)` стоит до первых вычислений; `jax_debug_nans` нет в конфигурации обычных запусков.
- Источник: [JAX - The Sharp Bits, «Double (64bit) precision»](https://docs.jax.dev/en/latest/notebooks/Common_Gotchas_in_JAX.html) (JAX 0.11.2) · официальный гайд · высокая; [Debugging runtime values](https://docs.jax.dev/en/latest/201/debugging.html) (JAX 0.11.2; проверка актуальности 2026-07-09) · официальный гайд · высокая.

По умолчанию JAX работает с одинарной точностью, и запрос `dtype=jnp.float64` без включённого режима вернёт `float32`. Проверка NaN замедляет работу из-за обменов между устройством и хостом.

### G-LIB-024 · SHOULD · `jax.jit` не ставится прямо на метод класса: вычисление выносится в свободную функцию, либо `self` объявляется статическим аргументом с корректными `__hash__` и `__eq__`, либо класс регистрируется как PyTree
- Проверка: ручное ревью.
- Источник: [JAX - The Sharp Bits, «Using jax.jit with class methods»](https://docs.jax.dev/en/latest/notebooks/Common_Gotchas_in_JAX.html) (JAX 0.11.2; проверка актуальности 2024-06-03) · официальный гайд · высокая.
- Пример:

```python
# плохо: JAX не знает, как обращаться с self
class Scaler:
    def __init__(self, factor):
        self.factor = factor

    @jax.jit
    def apply(self, x):
        return self.factor * x


# хорошо: чистая функция-помощник
@jax.jit
def _apply(factor, x):
    return factor * x


class Scaler:
    def __init__(self, factor):
        self.factor = factor

    def apply(self, x):
        return _apply(self.factor, x)
```

Вариант со статическим `self` годится только для объектов, которые не изменяются после создания.

### 3.4. Flax

### G-LIB-025 · SHOULD · Новые проекты на Flax пишутся на API NNX; существующий код на Linen переписывать не требуется
- Проверка: ручное ревью импортов (`from flax import nnx` против `flax.linen`).
- Источник: [Flax, docs_nnx/index.rst](https://github.com/google/flax/blob/main/docs_nnx/index.rst) (v0.12.10; HEAD 2026-10-07) · официальный гайд · высокая.

### G-LIB-026 · SHOULD · Чекпойнты во Flax сохраняются через Orbax: записывается `nnx.State`, полученный `nnx.split`, восстановление идёт через `nnx.merge`; `flax.training.checkpoints` в новом коде не используется
- Проверка: поиск импорта `flax.training.checkpoints`; тест «сохранить → восстановить → сравнить».
- Источник: [Save and load checkpoints](https://flax.readthedocs.io/en/latest/guides/checkpointing.html) (v0.12.10) · официальный гайд · высокая.
- Пример:

```python
import orbax.checkpoint as ocp
from flax import nnx

# сохранение
_, state = nnx.split(model)
checkpointer = ocp.StandardCheckpointer()
checkpointer.save(checkpoint_dir / "state", state)

# восстановление: абстрактная модель задаёт структуру
abstract_model = nnx.eval_shape(lambda: MyModel(rngs=nnx.Rngs(0)))
graphdef, abstract_state = nnx.split(abstract_model)
state = checkpointer.restore(checkpoint_dir / "state", abstract_state)
model = nnx.merge(graphdef, state)
```

Команда Flax собственную библиотеку чекпойнтов не поддерживает; актуальные API Orbax нужно сверять с его документацией.

### G-LIB-027 · SHOULD · В горячем цикле обучения на NNX накладные расходы обхода графа модулей убираются через `nnx.cached_partial` или функциональный шаг обучения, и структура графа модулей внутри шага не меняется
- Проверка: ручное ревью; замер времени шага.
- Источник: [Performance considerations](https://flax.readthedocs.io/en/latest/guides/performance.html) (v0.12.10) · официальный гайд · высокая.
- Пример:

```python
# проще всего: закешировать обход графа
cached_train_step = nnx.cached_partial(train_step, model, optimizer, metrics)
loss = cached_train_step(x, y)

# функциональный шаг: split до цикла, обычный jax.jit, merge внутри
graphdef, state = nnx.split((model, optimizer, metrics))

@jax.jit
def jax_train_step(graphdef, state, x, y):
    model, optimizer, metrics = nnx.merge(graphdef, state)
    ...
    return loss, nnx.state((model, optimizer, metrics))
```

Для крупных моделей накладные расходы `nnx.jit` теряются на фоне вычислений, и менять цикл не нужно.

### 3.5. Библиотеки без правил Google

Для PyTorch, scikit-learn и Hugging Face правил Google нет - публичных данных не найдено. Правила ниже взяты из официальных гайдов самих проектов и все помечены «не Google».

### G-LIB-028 · SHOULD · PyTorch: сохраняется `state_dict`, а не объект модели, и загрузка идёт через `torch.load(..., weights_only=True)`
- Проверка: поиск `weights_only=False` и `torch.save(model`; ручное ревью.
- Источник: [Serialization semantics](https://docs.pytorch.org/docs/2.14/notes/serialization.html) (PyTorch 2.14) · официальный гайд · высокая · не Google; [Saving and loading models](https://docs.pytorch.org/tutorials/beginner/saving_loading_models.html) (2025-06-26) · официальный гайд · высокая · не Google.
- Пример:

```python
# плохо: файл привязан к классам и структуре каталогов, загрузка исполняет pickle
torch.save(model, "model.pt")
model = torch.load("model.pt", weights_only=False)

# хорошо
torch.save(
    {"model_state_dict": model.state_dict(),
     "optimizer_state_dict": optimizer.state_dict(),
     "epoch": epoch},
    "checkpoint.pt",
)
checkpoint = torch.load("checkpoint.pt", weights_only=True)
model.load_state_dict(checkpoint["model_state_dict"])
model.eval()
```

`weights_only=True` - значение по умолчанию начиная с PyTorch 2.6.

### G-LIB-029 · SHOULD · PyTorch: в цикле обучения нет лишних синхронизаций CPU и GPU и отладочных API, а при AMP под `torch.autocast` находятся только прямой проход и функция потерь
- Проверка: ручное ревью; профилирование.
- Источник: [Performance tuning guide](https://docs.pytorch.org/tutorials/recipes/recipes/tuning_guide.html) (2025-07-09) · официальный гайд · высокая · не Google; [Automatic mixed precision recipe](https://docs.pytorch.org/tutorials/recipes/recipes/amp_recipe.html) (просмотрено 2026-10-09) · официальный гайд · высокая · не Google.
- Пример:

```python
for inputs, targets in loader:
    optimizer.zero_grad(set_to_none=True)
    with torch.autocast(device_type="cuda", dtype=torch.float16):
        loss = loss_fn(model(inputs), targets)
    scaler.scale(loss).backward()  # вне autocast
    scaler.unscale_(optimizer)     # только если дальше идёт клиппинг
    torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
    scaler.step(optimizer)
    scaler.update()
    # плохо: loss.item() или print(loss) на каждом шаге - синхронизация с GPU
```

### G-LIB-030 · SHOULD · PyTorch: в новом коде используются `torch.compile` и `torch.export`, а не `torch.jit.trace` и `torch.jit.script`; распределённое обучение строится на `DistributedDataParallel`, а не на `DataParallel`
- Проверка: поиск `torch.jit.` и `DataParallel(`; ручное ревью.
- Источник: [Introduction to torch.compile](https://docs.pytorch.org/tutorials/intermediate/torch_compile_tutorial.html) (2026-04-01) · официальный гайд · высокая · не Google; [Performance tuning guide](https://docs.pytorch.org/tutorials/recipes/recipes/tuning_guide.html) (2025-07-09) · официальный гайд · высокая · не Google.

### G-LIB-031 · MUST · scikit-learn: `fit` и `fit_transform` не вызываются на тестовых данных; предобработка, отбор признаков и модель объединяются в `Pipeline`
- Проверка: ручное ревью; тест, что предобработка не вызывается вне `Pipeline`.
- Источник: [Common pitfalls and recommended practices, раздел об утечке данных](https://scikit-learn.org/stable/common_pitfalls.html) (scikit-learn 1.9.1) · официальный гайд · высокая · не Google. Уровень MUST: источник формулирует общее правило словом «never».
- Пример:

```python
# плохо: масштабирование обучено на всех данных, тест «подсмотрен»
X_scaled = StandardScaler().fit_transform(X)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, random_state=0)

# хорошо: сначала разбиение, предобработка - внутри Pipeline
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)
model = make_pipeline(StandardScaler(), LogisticRegression())
model.fit(X_train, y_train)
score = model.score(X_test, y_test)
```

### G-LIB-032 · SHOULD · scikit-learn: собственный estimator следует контракту библиотеки - `__init__` только сохраняет параметры в одноимённые атрибуты, `fit` возвращает `self`, выученные атрибуты оканчиваются на `_`, `random_state` обрабатывается в `fit`
- Проверка: `sklearn.utils.estimator_checks.check_estimator` в тестах.
- Источник: [Developing scikit-learn estimators](https://scikit-learn.org/stable/developers/develop.html) (scikit-learn 1.9.1) · официальный гайд · высокая · не Google.
- Пример:

```python
# плохо: логика и проверки в конструкторе ломают клонирование и подбор параметров
class Clipper(BaseEstimator, TransformerMixin):
    def __init__(self, limit=1.0):
        if limit <= 0:
            raise ValueError("limit must be positive")
        self.bound = abs(limit)

# хорошо
class Clipper(BaseEstimator, TransformerMixin):
    def __init__(self, limit=1.0):
        self.limit = limit

    def fit(self, X, y=None):
        if self.limit <= 0:
            raise ValueError(f"limit must be positive, got {self.limit}.")
        self.n_features_in_ = X.shape[1]
        return self

    def transform(self, X):
        return np.clip(X, -self.limit, self.limit)
```

### G-LIB-033 · SHOULD · Hugging Face: веса публикуются и загружаются в формате safetensors; pickle-файлы весов из недоверенных источников не загружаются
- Проверка: расширения файлов в репозитории модели; ручное ревью.
- Источник: [Safetensors](https://huggingface.co/docs/safetensors/index) (просмотрено 2026-10-09) · официальный гайд · средняя · не Google.

### G-LIB-034 · SHOULD · Hugging Face Hub: карточка модели - `README.md` с YAML-метаданными, где `library_name` задан явно; карточка датасета оформляется так же
- Проверка: наличие блока метаданных в `README.md`; ручное ревью.
- Источник: [Model cards](https://huggingface.co/docs/hub/model-cards) (просмотрено 2026-10-09) · официальный гайд · высокая · не Google; [Dataset cards](https://huggingface.co/docs/hub/datasets-cards) (просмотрено 2026-10-09) · официальный гайд · высокая · не Google.
- Пример:

```yaml
---
license: apache-2.0
language: en
library_name: keras
pipeline_tag: text-classification
base_model: <BASE_MODEL>
datasets:
  - <DATASET>
tags:
  - <TAG>
---
```

Содержательные разделы карточки - в шаблоне [MODEL_CARD.md](../../templates/ml/MODEL_CARD.md) (правило G-MLOPS-025).

## 4. Сквозные темы

Интерпретация по источникам из таблицы: три темы повторяются у всех библиотек, и именно на них стоит строить ревью.

1. Трассировка и компиляция требуют чистых функций. `tf.function`, `jax.jit` и `torch.compile` исполняют Python-код один раз и затем переиспользуют результат, поэтому побочные эффекты, глобальное состояние и ветвление по значениям ведут себя не так, как в обычном Python (G-LIB-001 … 003, G-LIB-016, G-LIB-019, G-LIB-030).
2. Модель сохраняется в формате без исполняемого кода и загружается в безопасном режиме: `.keras` и `safe_mode=True`, safetensors, `weights_only=True`; SavedModel считается кодом (G-LIB-007, G-LIB-011, G-LIB-012, G-LIB-028, G-LIB-033).
3. Случайность управляется явно: ключи в JAX, `random_state` в scikit-learn, генератор у `DataLoader` (G-LIB-018 и [reproducibility.md](reproducibility.md)).

## 5. Расхождения между источниками

| Тема | Вариант А | Вариант Б | Что берёт профиль |
|---|---|---|---|
| Отступ в Python-коде ML-библиотек | 2 пробела: TensorFlow (гайд по стилю и `pylintrc`), JAX, Flax, Optax, Chex | 4 пробела: публичный Google Python Style Guide и Keras | 4 пробела, как в публичном гайде; расхождение описано в [python.md](../languages/python.md) |
| Инструменты Keras | Документ `keras-team/governance` (2023): black, isort, flake8 | Репозиторий `keras` (HEAD 2026-10-09): ruff для линта и формата, строка 80 | Вариант Б: действующий конфиг новее документа |
| Статус Flax Linen | Главная страница документации NNX: Linen не будет объявлен устаревшим в ближайшее время | README каталога старой документации называет её «deprecated» | Формулировку главной страницы: новый код - на NNX, Linen допустим (G-LIB-025) |
| `cudnn.benchmark` в PyTorch (не Google) | `True` ради скорости (гайд по производительности) | `False` ради воспроизводимости (заметка о случайности) | `False` для запусков, которые нужно повторять; `True` - осознанно, для свёрточных сетей со стабильным размером входа |
| Обязательность правил Keras API guidelines | Формулировки «always», «should» | Документ называет себя рекомендациями | SHOULD (G-LIB-014, G-LIB-015) |

## 6. Чего нет

Публичных данных не найдено по следующим темам:

- правила Google для PyTorch, scikit-learn и Hugging Face;
- официальное соглашение Google о записи форм тензоров в аннотациях или именах (см. [project-structure.md](project-structure.md));
- отдельные «правила использования» Optax: в исследовании прочитаны только конфиги репозитория.

Не разбирались: гайд TensorFlow «Migrate to TF2», разделы гайда `tf.function` о создании переменных, рекомендация закреплять ревизию модели при загрузке с Hugging Face Hub (на прочитанных страницах её нет).
