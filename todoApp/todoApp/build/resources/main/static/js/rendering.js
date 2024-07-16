document.addEventListener("DOMContentLoaded", fetchTodo())

async function fetchTodo() {
    await checkToken()
    const userId = localStorage.getItem("USER-ID")
    const todo = await getData(`http://localhost:8080/todo/${userId}`)
    const todoJson = await todo.json()
    renderTodo(todoJson)
}

function renderTodo(todoJson) {
    const field = document.getElementById("mainField")
    field.innerHTML = ""

    todoJson.forEach(elem => {
        const postIt = document.createElement("div")
        postIt.classList.add("post-it")
        postIt.setAttribute("data-id", elem.id)
        postIt.setAttribute("data-content", elem.content)
        postIt.setAttribute("data-dueDate", elem.dueDate)
        postIt.setAttribute("data-color", elem.color)
        postIt.setAttribute("data-isChecked", elem.isChecked)
        postIt.setAttribute("data-positionX", elem.positionX)
        postIt.setAttribute("data-positionY", elem.positionY)

        const checkedValue = elem.isChecked ? "checked" : "";
        postIt.innerHTML += `
        <input type="checkbox" id="checkBox${elem.id}" name="checkbox" ${checkedValue} onchange="updateCheckBox(event)">
        <label for="checkBox${elem.id}" class="post-it-checkbox"></label>
        <div class="post-it-content">
            ${elem.content}
        </div>
        <div class="post-it-date">
            Deadline: ${elem.dueDate}
        </div>
        `
        postIt.style.top = elem.positionY + "px"
        postIt.style.left = elem.positionX + "px"

        field.appendChild(postIt)
    });

    const postItList = document.querySelectorAll(".post-it")
    enableDrag(postItList)
}




async function updateCheckBox(event) {
    const postIt = event.target.parentNode
    const id = postIt.getAttribute("data-id")
    const requestBody = {
        content: postIt.getAttribute("data-content"),
        dueDate: postIt.getAttribute("data-dueDate"),
        color: postIt.getAttribute("data-color"),
        isChecked: event.target.checked,
        positionX: postIt.getAttribute("data-positionX"),
        positionY: postIt.getAttribute("data-positionY")
    }
    const response = await putData(requestBody, `http://localhost:8080/todo/${id}`)
}





