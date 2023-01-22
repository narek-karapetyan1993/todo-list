
import { createTodoApp } from "./modules/view.js";

const storeType = localStorage.getItem("store") || "local";
const owner = document.title;

async function getModule(storeType) {
  if (storeType && storeType === "api") {
    return await import("./modules/api.js");
  } else {
    return await import("./modules/local.js");
  }
}

getModule(storeType).then(async (mod) => {
  createTodoApp(document.getElementById("todo-app"), {
    title: owner,
    owner: owner,
    getTodoItemList: mod.getTodoList,
    onCreateFormSubmit: mod.createTodoItem,
    onDoneClick: mod.switchTodoItemDone,
    onDeleteClick: mod.deleteTodoItem,
  });
});
