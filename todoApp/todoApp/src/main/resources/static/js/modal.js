document.querySelector('#post-it-img').addEventListener('click', async function() {
    // สร้าง Element ของ Modal
    const modalElement = document.createElement('div');
    const innerElement = document.createElement('div');

    modalElement.classList.add('modal');
    innerElement.classList.add('inner');

    innerElement.innerHTML = `
    <button type="button" class="modal-close btn btn-outline-secondary" id="modalClose">×</button>
    <form id="todoForm">
        <div class="form-group">
            <label for="dueDate">Due Date:</label>
            <input class="form-control" type="date" id="dueDate" name="dueDate" required>
        </div>
        <div class="form-group">
            <label for="content">Content:</label>
            <textarea class="form-control" rows="4" id="content" name="content" maxlength="100" required></textarea>
        </div>
        <div class="form-group">
            <label for="color">Color:</label>
            <select class="form-control" id="color" name="color" required>
                <option value="RED">Red</option>
                <option value="GREEN">Green</option>
                <option value="BLUE">Blue</option>
                <option value="YELLOW">Yellow</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary add-btn">Add Todo</button>
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
