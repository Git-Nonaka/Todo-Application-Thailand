function enableDrag(objectList) {
    const trashCan = document.getElementById("trash-can-img");

    objectList.forEach(elem => {
        elem.onpointermove = function(event) {
            if (event.buttons) {
                const screenWidth = window.innerWidth;
                const screenHeight = window.innerHeight;
                this.style.left = Math.max(0, Math.min(this.offsetLeft + event.movementX, screenWidth - this.offsetWidth)) + 'px';
                this.style.top = Math.max(document.querySelector("header").offsetHeight, Math.min(this.offsetTop + event.movementY, screenHeight - this.offsetHeight)) + 'px';
                this.setPointerCapture(event.pointerId);
            }
        };

        elem.onpointerup = async function(event) {
            const id = elem.getAttribute("data-id");
            if (!id || id === "null") {
                console.error("Invalid ID:", id);
                return;
            }

            const postItRect = this.getBoundingClientRect();
            const trashCanRect = trashCan.getBoundingClientRect();

            const expandedTrashCanRect = {
                left: trashCanRect.left,
                top: trashCanRect.top,
                right: trashCanRect.right,
                bottom: trashCanRect.bottom
            };

            const distance = getDistance(postItRect, expandedTrashCanRect);
            const threshold = 100;

            console.log(distance)

            if ((distance > 175) && (distance < 180)) {
                console.log("Post-it dropped near trash can area");
                await deletePostIt(id);
            } else {
                console.log("Post-it not near trash can area");
            }

            // อัปเดตตำแหน่งหลังจากลากเสร็จ
            const newLeft = this.offsetLeft;
            const newTop = this.offsetTop;
            await updatePosition(event, newLeft, newTop);

            this.draggable = false;
        };
    });

    document.addEventListener("pointermove", function() {
        // ตรวจสอบและอัพเดตสถานะถังขยะ
        const postItList = document.querySelectorAll(".post-it");
        postItList.forEach(postIt => {
            const postItRect = postIt.getBoundingClientRect();
            const trashCanRect = trashCan.getBoundingClientRect();

            // ขยายพื้นที่รับรู้การลากของถังขยะ
            const expandedTrashCanRect = {
                left: trashCanRect.left - 50,
                top: trashCanRect.top - 50,
                right: trashCanRect.right + 50,
                bottom: trashCanRect.bottom + 50
            };

            const distance = getDistance(postItRect, expandedTrashCanRect);
            const threshold = 300; // กำหนดระยะทางที่อนุญาต

            if (distance < threshold) {
                trashCan.classList.add("highlight");
            } else {
                trashCan.classList.remove("highlight");
            }
        });
    });
}

function getDistance(rect1, rect2) {
    const dx = Math.max(rect1.left, rect2.left) - Math.min(rect1.right, rect2.right);
    const dy = Math.max(rect1.top, rect2.top) - Math.min(rect1.bottom, rect2.bottom);
    return Math.sqrt(dx * dx + dy * dy);
}


async function deletePostIt(id) {
    try {
        const response = await deleteData(`http://localhost:8080/todo/${id}`);
        if (response) {
            console.log("Delete successful:", response);
            fetchTodo();
            loadTodos();
        } else {
            console.error('Failed to delete todo.');
        }
    } catch (error) {
        console.error("Error deleting todo:", error);
    }
}

async function updatePosition(event, left, top) {
    const postIt = event.target.closest('.post-it'); // ใช้ closest เพื่อให้แน่ใจว่าเลือกได้ถูกต้อง
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
        isChecked: postIt.getAttribute("data-isChecked") === 'true',
        positionX: parseInt(left),
        positionY: parseInt(top)
    };

    try {
        const response = await putData(requestBody, `http://localhost:8080/todo/${id}`);
        if (response) {
            console.log("Update successful:", response);
        } else {
            console.log("Update successful, no response body.");
        }
    } catch (error) {
        console.error("Error updating position:", error);
    }
}
