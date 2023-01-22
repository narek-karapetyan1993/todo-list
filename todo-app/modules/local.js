export async function getTodoList(owner) {
  const taskStr = localStorage.getItem('tasks');
  return new Promise((resolve) => resolve(
    taskStr
      ? JSON.parse(taskStr).filter((todoItem) => todoItem.owner === owner)
      : [],
  ));
}

export async function createTodoItem({ owner, name }) {
  const taskStr = localStorage.getItem('tasks');
  const tasks = JSON.parse(taskStr);
  const newTask = {
    name,
    owner,
    done: false,
    id: Date.now().toString(),
  };
  localStorage.setItem(
    'tasks',
    JSON.stringify([...(tasks || []), newTask]),
  );
  return new Promise((resolve) => resolve(newTask));
}

export async function switchTodoItemDone({ todoItem }) {
  const taskStr = localStorage.getItem('tasks');
  const tasks = JSON.parse(taskStr);
  const { id } = todoItem;
  const curTask = tasks.filter((todoItem) => todoItem.id === id)[0];
  curTask.done = !curTask.done;
  localStorage.setItem(
    'tasks',
    JSON.stringify([...tasks.filter((todoItem) => todoItem.id !== id), curTask]),
  );
  return new Promise((resolve) => resolve(true));
}

export async function deleteTodoItem({ element, todoItem }) {
  // eslint-disable-next-line no-restricted-globals
  if (!confirm('Вы уверены?')) {
    return;
  }
  element.remove();
  const { id } = todoItem;
  const taskStr = localStorage.getItem('tasks');
  const tasks = JSON.parse(taskStr);
  localStorage.setItem(
    'tasks',
    JSON.stringify([...tasks.filter((todoItem) => todoItem.id !== id)]),
  );
  return new Promise((resolve) => resolve(true));
}
