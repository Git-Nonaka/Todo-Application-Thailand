document.querySelector('#post-it-img').addEventListener('click', async function() {
    const modalElement = document.createElement('div');
    const innerElement = document.createElement('div');

    modalElement.classList.add('modal');
    innerElement.classList.add('inner');

    innerElement.innerHTML = `
    <div class="modal-content">
        <button type="button" class="modal-close btn btn-outline-secondary" id="modalClose">×</button>
        <form id="todoForm">
            <div class="form-group">
                <label for="dueDate">Due Date :</label>
                <input class="form-control" type="date" id="dueDate" name="dueDate" required>
            </div>
            <div class="form-group">
                <label for="content">Content :</label>
                <textarea class="form-control" rows="2" id="content" name="content" maxlength="255" required 
                    style="resize: none; width: 100%; border: 1px solid #ccc; background-color: #fff; height: 12px; width: 200px; margin-top: 93px; font-size: 14px;"></textarea>
            </div>
            <div class="form-group">
                <label for="color">Color :</label>
                <select class="form-control" id="color" name="color" required>
                    <option value="RED">Red</option>
                    <option value="GREEN">Green</option>
                    <option value="BLUE">Blue</option>
                </select>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-primary add-btn">Add Todo</button>
            </div>
        </form>
    </div>
    `;

    modalElement.appendChild(innerElement);
    document.body.appendChild(modalElement);

    document.getElementById("modalClose").addEventListener("click", function() {
        closeModalWindow(modalElement);
    });

    document.getElementById("todoForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        const form = document.getElementById('todoForm');
        const formData = new FormData(form);
        const userId = localStorage.getItem("USER-ID");

        if (!userId) {
            console.error('USER-ID is missing in localStorage');
            return;
        }

        const requestBody = {
            userId: userId,
            content: formData.get("content"),
            dueDate: formData.get("dueDate"),
            color: formData.get("color"),
            isChecked: false,
            positionX: 0.0,
            positionY: 0.0,
        };

        console.log("Request Body:", requestBody);

        try {
            const tokenValid = await checkToken();
            if (!tokenValid) {
                console.error("Invalid token");
                return;
            }

            const response = await fetch("http://localhost:8080/todo", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("X-AUTH-TOKEN") // เปลี่ยนจาก X-AUTH-TOKEN เป็น Authorization
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                loadTodos(); // อัปเดต todos
                closeModalWindow(modalElement);
            } else {
                const responseData = await response.json();
                console.error('Failed to add todo:', responseData);
            }
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    });
});

function closeModalWindow(modalElement) {
    document.body.removeChild(modalElement);
}

async function loadTodos() {
    try {
        const userId = localStorage.getItem("USER-ID");
        const response = await fetch(`http://localhost:8080/todo/${userId}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("X-AUTH-TOKEN") // เพิ่ม header Authorization
            }
        });
        if (!response.ok) {
            throw new Error('Failed to load todos');
        }
        const todos = await response.json();
        const todoTableBody = document.getElementById('todoTableBody');
        todoTableBody.innerHTML = '';
        todos.forEach(todo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${todo.id}</td>
                <td>${todo.content}</td>
                <td>${todo.dueDate}</td>
                <td>${todo.color}</td>
            `;
            todoTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading todos:', error);
    }
}

function openEditModal(id) {
    const postIt = document.querySelector(`.post-it[data-id="${id}"]`);
    const content = postIt.getAttribute("data-content");
    const dueDate = postIt.getAttribute("data-dueDate");
    const color = postIt.getAttribute("data-color");
    const isChecked = postIt.getAttribute("data-isChecked") === 'true'; // ดึงค่า isChecked จาก post-it
    const positionX = postIt.getAttribute("data-positionX") || 0.0; // ดึงค่าปัจจุบัน หรือใช้ค่าเริ่มต้น
    const positionY = postIt.getAttribute("data-positionY") || 0.0; // ดึงค่าปัจจุบัน หรือใช้ค่าเริ่มต้น

    const modalElement = document.createElement('div');
    const innerElement = document.createElement('div');

    modalElement.classList.add('modal');
    innerElement.classList.add('inner');

    innerElement.innerHTML = `
    <div class="modal-content">
        <button type="button" class="modal-close btn btn-outline-secondary" id="modalClose">×</button>
        <form id="editTodoForm">
            <input type="hidden" id="id" name="id" value="${id}">
            <div class="form-group">
                <label for="editDueDate">Due Date :</label>
                <input class="form-control" type="date" id="editDueDate" name="dueDate" value="${dueDate}" required>
            </div>
            <div class="form-group">
                <label for="editContent">Content :</label>
                <textarea class="form-control" rows="2" id="editContent" name="content" maxlength="255" required>${content}</textarea>
            </div>
            <div class="form-group">
                <label for="editColor">Color :</label>
                <select class="form-control" id="editColor" name="color" required>
                    <option value="RED" ${color === 'RED' ? 'selected' : ''}>Red</option>
                    <option value="GREEN" ${color === 'GREEN' ? 'selected' : ''}>Green</option>
                    <option value="BLUE" ${color === 'BLUE' ? 'selected' : ''}>Blue</option>
                </select>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
        </form>
    </div>
    `;

    modalElement.appendChild(innerElement);
    document.body.appendChild(modalElement);

    document.getElementById("modalClose").addEventListener("click", function() {
        closeModalWindow(modalElement);
    });

    document.getElementById("editTodoForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        const form = document.getElementById('editTodoForm');
        const formData = new FormData(form);
        const id = formData.get("id");
        
        if (!id) {
            console.error('Todo ID is missing');
            return;
        }

        // ตรวจสอบค่าที่ดึงมาจากฟอร์ม
        const content = formData.get("content");
        const dueDate = formData.get("dueDate");
        const color = formData.get("color");
        
        if (!content || !dueDate || !color) {
            console.error('Form data is incomplete');
            return;
        }

        // ใช้ค่า positionX และ positionY ปัจจุบัน
        const requestBody = {
            content: formData.get("content"),
            dueDate: formData.get("dueDate"),
            color: formData.get("color"),
            isChecked: formData.get("isChecked") === 'on', // ตรวจสอบว่าค่าของ isChecked ถูกต้อง
            positionX: parseFloat(postIt.getAttribute("data-positionX")) || 0.0,
            positionY: parseFloat(postIt.getAttribute("data-positionY")) || 0.0
        };

        console.log('Request Body:', requestBody); // ตรวจสอบ requestBody ก่อนส่งคำขอ
    
        try {
            const response = await fetch(`http://localhost:8080/todo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("X-AUTH-TOKEN")
                },
                body: JSON.stringify(requestBody)
            });
            
            if (response.ok) {
                loadTodos(); // Refresh the Todo list
                closeModalWindow(modalElement);
            } else {
                const responseData = await response.json();
                console.error('Failed to update todo:', responseData);
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    });
}

