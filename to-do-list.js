function generateTodo(text, check){
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("Todo");
    if(check == 'finished'){
        todoDiv.classList.add('finished-task');
        try{
            todoDiv.classList.remove('unfinished-task');
        }
        catch(err){}
    }
    else{
        todoDiv.classList.add('unfinished-task');
        try{
            todoDiv.classList.remove('finished-task');
        }
        catch(err){}
    }
    const newTodo = document.createElement('li');
    newTodo.innerText = text;
    newTodo.classList.add('todo-item');

    todoDiv.appendChild(newTodo);


    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = 'Delete'
    deleteBtn.classList.add("delete")
    deleteBtn.classList.add("button")
    
    todoDiv.appendChild(deleteBtn);

    const checkedBtn = document.createElement("button");
    checkedBtn.innerText = (check == 'finished') ? 'Redo' : 'Finish';
    checkedBtn.classList.add(check)
    checkedBtn.classList.add("button")
    todoDiv.appendChild(checkedBtn);

    todoList.appendChild(todoDiv);

    mapToSave.set(text, [text, check])
}

//#############################3


const todoInput = document.querySelector('.todo-input')
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list')
const todoDone = document.querySelector('.done-counter')
const todoDeleted = document.querySelector('.deleted-counter')
let mapToSave = new Map();
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteTodo);
todoList.addEventListener('click', checkTodo);



// variables to store
let cachedMap = new Map(JSON.parse(localStorage.myMap))

// generate todos from localstorage
if(cachedMap.size > 0){
    for(let key of cachedMap.keys()){
        generateTodo(cachedMap.get(key)[0], cachedMap.get(key)[1])
    }
}

//save in todos in local storage before close
window.onbeforeunload = function(){
    localStorage.myMap = JSON.stringify(Array.from(mapToSave.entries()));
}




//functions
function deleteTodo(event){
    event.preventDefault();
    let value = todoDeleted.innerText;
    if(event.target.classList[0] == 'delete' ){
        event.target.parentElement.remove()
        todoDeleted.innerText = Number(value)+1;
        mapToSave.delete(event.target.parentElement.firstChild.innerText)
        console.log(event.target.parentElement.firstChild.innerText);
    }
}

function checkTodo(event){
    event.preventDefault();
    let value = todoDone.innerText;
    console.log(event.target.classList[0]);
    if(event.target.classList.contains('unfinished')){
        event.target.classList.add('finished');
        event.target.innerHTML = 'Redo'
        event.target.classList.remove('unfinished');

        event.target.parentElement.classList.add('finished-task');
        event.target.parentElement.classList.remove('unfinished-task');
        todoDone.innerText = Number(value) + 1;
        mapToSave.set(event.target.parentElement.firstChild.innerText, [event.target.parentElement.firstChild.innerText, "finished"])
        console.log(mapToSave.get(event.target.parentElement.firstChild.innerText))
    }
    else if(event.target.classList.contains('finished')){
        event.target.classList.remove('finished');
        event.target.innerHTML = 'Finish'
        event.target.classList.add('unfinished');
        event.target.parentElement.classList.add('unfinished-task');
        event.target.parentElement.classList.remove('finished-task');
        if(Number(todoDone.innerText) > 0){
            todoDone.innerText = Number(value) - 1;
        }
        mapToSave.set(event.target.parentElement.firstChild.innerText, [event.target.parentElement.firstChild.innerText, "unfinished"])
        console.log(mapToSave.get(event.target.parentElement.firstChild.innerText))
    }
    
}

function addTodo(event){
    event.preventDefault()
    if(todoInput.value && !mapToSave.get(todoInput.value)){  
        generateTodo(todoInput.value, 'unfinished');
    }
    else{
        todoInput.classList.add('shake-error');
        todoInput.addEventListener('animationend', function() {
            todoInput.classList.remove('shake-error');
        })
    }



}