const todoCreateButton = document.querySelector(".todo__create__button");
const todoInput = document.querySelector(".todo__input");
const todoContainer = document.querySelector(".todo__container");
const currentDateElement = document.getElementById("current-date");
const currentTimeElement = document.getElementById("current-time");

const todoValues = [];
let todoElements =[];

//date and time
const updateDateTime = () => {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.innerText = now.toLocaleDateString(undefined, options);
    currentTimeElement.innerText = now.toLocaleTimeString();
};

setInterval(updateDateTime);

updateDateTime();

const renderTodos = () => {
    todoContainer.innerHTML = todoValues.map((todo, index) => {
        return `<div class="todo__item" data-index="${index}">
            <div class="todo__item__left">
                <input type="checkbox" id="completed-${index}" name="completed" ${todo.completed ? 'checked' : ''} />
                <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
            </div>
            <div class="todo__item__right">
                <svg
                    class="todo__delete__button"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="red"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    data-index="${index}"
                >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
            </div>
        </div>`;
    })
     .join(" ");
};

todoCreateButton.addEventListener("click", () => {
    const value = todoInput.value.trim();
    if (value === "") {
        return;
    }
    
    todoValues.push({ text: value, completed: false });
    todoInput.value = "";
    renderTodos();
});

todoContainer.addEventListener("click", (event) => {
    const index = event.target.closest('.todo__item')?.dataset.index;

    if (event.target.classList.contains("todo__delete__button")) {
        todoValues.splice(index, 1); 
        renderTodos(); 
    } else if (event.target.type === "checkbox") {
        todoValues[index].completed = event.target.checked; 
        renderTodos(); 
    }
});
