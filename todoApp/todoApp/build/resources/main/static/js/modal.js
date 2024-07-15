document.querySelector('#post-it-img').addEventListener('click', async function() {
    // สร้าง Element ของ Modal
    const modalElement = document.createElement('div');
    const innerElement = document.createElement('div');

    modalElement.classList.add('modal');
    innerElement.classList.add('inner');

    innerElement.innerHTML = `
    <button type="button" class="modal-close" id="modalClose">×</button>
    <form id="todoForm">
        <label for="dueDate">Due Date:</label>
        <input class="date-input" type="date" name="dueDate" required></input>
        <br>
        <label for="content">Content:</label>
        <textarea rows="4" cols="50" maxlength="100" name="content" required></textarea>
        <br>
        <label for="color">Color:</label>
        <select name="color" required>
            <option value="RED">Red</option>
            <option value="GREEN">Green</option>
            <option value="BLUE">Blue</option>
            <option value="YELLOW">Yellow</option>
        </select>
        <br>
        <button class="add-btn">Add</button>
    </form>
    `;

    modalElement.appendChild(innerElement);
    document.body.appendChild(modalElement);

    // เพิ่ม Event Listener สำหรับปุ่มปิด Modal
    document.getElementById("modalClose").addEventListener("click", function() {
        closeModalWindow(modalElement);
    });

    // เพิ่ม Event Listener สำหรับปุ่ม Add Todo
    document.querySelector(".add-btn").addEventListener("click", async function(event) {
        event.preventDefault();
        const form = document.getElementById('todoForm');
        const formData = new FormData(form);
        const userId = localStorage.getItem("USER-ID");

        if (!userId) {
            console.error('USER-ID is missing in localStorage');
            return;
        }

        const requestBody = {
            user_id: userId,
            content: formData.get("content"),
            due_date: formData.get("dueDate"),
            color: formData.get("color"),
            created_at: new Date().toISOString()
        };

        try {
            const response = await postData(requestBody, "http://localhost:8080/todo");
            if (response.ok) {
                loadTodos();
                closeModalWindow(modalElement);
            } else {
                const errorText = await response.text();
                console.error('Failed to add todo:', response.statusText, errorText);
            }
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    });
});

function closeModalWindow(modalElement) {
    document.body.removeChild(modalElement);
}

async function postData(data, url) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response;
}

async function loadTodos() {
    try {
        const userId = localStorage.getItem("USER-ID");
        const response = await fetch(`http://localhost:8080/todo/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to load todos');
        }
        const todos = await response.json();
        const todoTableBody = document.getElementById('todoTableBody');
        todos.forEach(todo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${todo.id}</td>
                <td>${todo.content}</td>
                <td>${todo.dueDate}</td>
                <td>${todo.color}</td>
                <td>${todo.created_at}</td>
                <td>${todo.updated_at}</td>
            `;
            todoTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading todos:', error);
    }
}
