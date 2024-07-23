document.addEventListener("DOMContentLoaded", fetchTodo())

async function fetchTodo() {
    await checkToken()
    const userId = localStorage.getItem("USER-ID")
    const todo = await getData(`http://localhost:8080/todo/${userId}`)
    const todoJson = await todo.json()
    renderTodo(todoJson)
}

function renderTodo(todoJson) {
    const field = document.getElementById("mainField");
    field.innerHTML = "";

    todoJson.forEach(elem => {
        const postIt = document.createElement("div");
        postIt.classList.add("post-it");
        postIt.setAttribute("data-id", elem.id); // ตรวจสอบการตั้งค่า ID
        postIt.setAttribute("data-userId", elem.userId);
        postIt.setAttribute("data-content", elem.content);
        postIt.setAttribute("data-dueDate", elem.dueDate);
        postIt.setAttribute("data-color", elem.color);
        postIt.setAttribute("data-isChecked", elem.isChecked);
        postIt.setAttribute("data-positionX", elem.positionX);
        postIt.setAttribute("data-positionY", elem.positionY);

        const checkedValue = elem.isChecked ? "checked" : "";
        postIt.innerHTML = `
        <div class="post-it-header">
            <input type="checkbox" id="checkBox${elem.id}" name="checkbox" ${checkedValue} onchange="updateCheckBox(event)">
            <label for="checkBox${elem.id}" class="post-it-checkbox"></label>
        </div>
        <div class="post-it-content">
            <p>${elem.content}</p>
        </div>
        <div class="post-it-footer">
            <p class="post-it-date">Deadline: ${elem.dueDate}</p>
        </div>
        `;
        postIt.style.top = elem.positionY + "px";
        postIt.style.left = elem.positionX + "px";

        field.appendChild(postIt);
    });

    const postItList = document.querySelectorAll(".post-it");
    enableDrag(postItList);
}

async function updateCheckBox(event) {
    const postIt = event.target.closest('.post-it');
    const id = postIt.getAttribute("data-id");
    const userId = postIt.getAttribute("data-userId");

    if (!id || id === "null") {
        console.error("Invalid ID:", id);
        return;
    }

    const requestBody = {
        userId: parseInt(userId),
        content: postIt.getAttribute("data-content"),
        dueDate: postIt.getAttribute("data-dueDate"),
        color: postIt.getAttribute("data-color"),
        isChecked: event.target.checked,
        positionX: parseInt(postIt.getAttribute("data-positionX")),
        positionY: parseInt(postIt.getAttribute("data-positionY"))
    };

    console.log("Updating checkbox with requestBody:", requestBody);

    try {
        const response = await putData(requestBody, `http://localhost:8080/todo/${id}`);
        
        if (response) {
            console.log("Response from server:", response);
            if (response.ok) {
                console.log("Update successful:", response);
            } else {
                console.error("Update failed:", response.statusText);
            }
        } else {
            console.error("No response received from server.");
        }
    } catch (error) {
        console.error("Error updating checkbox:", error);
    }
}