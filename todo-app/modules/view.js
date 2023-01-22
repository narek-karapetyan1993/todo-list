function createAppTitle(title) {
  const appTitle = document.createElement('h2');
  appTitle.textContent = title;
  return appTitle;
}

function createTodoItemForm() {
  const form = document.createElement('form');
  const input = document.createElement('input');
  const buttonWrapper = document.createElement('div');
  const button = document.createElement('button');

  form.classList.add('input-group', 'mb-3');
  input.classList.add('form-control');
  input.placeholder = 'Введите название нового дела';
  buttonWrapper.classList.add('input-group-append');
  button.classList.add('btn', 'btn-primary', 'ms-1');
  button.textContent = 'Добавить дело';

  button.disabled = true;
  input.addEventListener('input', () => {
    button.disabled = !input.value;
  });

  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper);

  return {
    form,
    input,
    button,
  };
}

function createTodoList() {
  const list = document.createElement('ul');
  list.classList.add('List-group', 'p-0');
  return list;
}

function createTodoItemElement(todoItem, { onDone, onDelete }) {
  const doneClass = 'list-group-item-success';

  const item = document.createElement('li');
  const buttonGroup = document.createElement('div');
  const doneButton = document.createElement('button');
  const deleteButton = document.createElement('button');

  item.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-center',
    'list-group-item-success',
  );

  if (todoItem.done) {
    item.classList.add(doneClass);
  } else {
    item.classList.remove(doneClass);
  }

  item.textContent = todoItem.name;

  buttonGroup.classList.add('btn-group', 'btn-group-sm');
  doneButton.classList.add('btn', 'btn-success');
  doneButton.textContent = 'Готово';
  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.textContent = 'Удалить';

  doneButton.addEventListener('click', () => {
    onDone({ todoItem, element: item });
    item.classList.toggle(doneClass);
  });
  deleteButton.addEventListener('click', () => {
    onDelete({ todoItem, element: item });
  });

  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup);

  return item;
}

function createStoreBtn() {
  const toLocal = 'Перейти на локальное хранилище';
  const toApi = 'Перейти на серверное хранилище';

  let storeType = localStorage.getItem('store') || 'local';

  const storeBtn = document.createElement('button');

  storeBtn.classList.add('btn', 'btn-primary', 'mb-3');
  storeBtn.textContent = storeType === 'local' ? toApi : toLocal;

  storeBtn.addEventListener('click', () => {
    if (storeBtn.textContent === toApi) {
      storeBtn.textContent = toLocal;
      storeType = 'api';
    } else {
      storeBtn.textContent = toApi;
      storeType = 'local';
    }
    window.location.reload();
    localStorage.setItem('store', storeType);
  });
  return storeBtn;
}

async function createTodoApp(
  container,
  {
    title,
    owner,
    getTodoItemList = [],
    onCreateFormSubmit,
    onDoneClick,
    onDeleteClick,
  },
) {
  const storeBtn = createStoreBtn();
  const todoAppTitle = createAppTitle(title);
  const todoItemForm = createTodoItemForm();
  const todoItemList = await getTodoItemList(owner);
  const todoList = createTodoList();
  const handlers = { onDone: onDoneClick, onDelete: onDeleteClick };

  container.append(storeBtn);
  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  todoItemList.forEach((todoItem) => {
    const todoItemElement = createTodoItemElement(todoItem, handlers);
    todoList.append(todoItemElement);
  });

  todoItemForm.form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!todoItemForm.input.value) {
      return;
    }

    const todoItem = await onCreateFormSubmit({
      name: todoItemForm.input.value.trim(),
      owner,
    });

    const todoItemElement = createTodoItemElement(todoItem, handlers);

    todoList.append(todoItemElement);

    todoItemForm.input.value = '';
  });
}

export { createTodoApp };
