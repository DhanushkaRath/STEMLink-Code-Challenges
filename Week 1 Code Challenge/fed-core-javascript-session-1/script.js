//const name = "Dhanushka"
//name = "vino"

//let name = "vinodi"
//name = "Yashi"

//const person = {
 // name : "Duburu",
 // age : 24,
//};

//console.log(person.name);

const todoCreateButton = document.querySelector(".todo__create__button");
const todoInput = document.querySelector(".todo__input");
const todoContainer = document.querySelector(".todo__container");

const todoValues = [];
let todoElements = [];

todoCreateButton.addEventListener("click", () => {
  const value = todoInput.value;
  if(value === ""){
    return;
  }
  
  todoValues.push(value);
  console.log(todoValues);
  todoInput.value = "";

  todoElements = todoValues.map((val) => {
    return `<div class="todo__item">
          <div class="todo__item__left">
            <input type="checkbox" id="completed" name="completed" />
            <span>${val}</span>
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
              class="lucide lucide-trash"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </div>
        </div>`;
  });

  console.log(todoElements.join(" "));
  todoContainer.innerHTML = todoElements.join(" ");
});



//
//function add(a, b){
 // console.log(a+b)
//}

//add(1, 2);

//arrow functions
//const add = (a, b) => {
 // console.log(a+b);
//};

//add(3, 4);

// const numbers = [1,2,3,4,5]

// const evenNumbers = numbers.map((val) => {
//     return val * 2;
// } )
// console.log(evenNumbers);
