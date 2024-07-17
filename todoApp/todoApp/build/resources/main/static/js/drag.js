function enableDrag(objectList) {

    objectList.forEach(elem => {
        elem.onpointermove = function(event) {
            if(event.buttons){
                const screenWidth = window.innerWidth
                const screenHeight = window.innerHeight
                this.style.left = Math.max(0, Math.min(this.offsetLeft + event.movementX, screenWidth - this.offsetWidth)) + 'px'
                this.style.top = Math.max(document.querySelector("header").offsetHeight, Math.min(this.offsetTop + event.movementY, screenHeight - this.offsetHeight) ) + 'px'
                this.draggable      = false
                this.setPointerCapture(event.pointerId)
            }
        }
    })

    objectList.forEach(elem => {
        elem.onpointerup = async function(event) {
            if (event.button === 0) {

                updatePosition(event, this.style.left, this.style.top)

                targetCenter = [ parseInt(this.style.left) + this.clientWidth / 2, parseInt(this.style.top) + this.clientHeight / 2 ]
                const trashCan = document.getElementById("trash-can-img")
                const rect = trashCan.getBoundingClientRect()
        
                if ( rect.left <= targetCenter[0] && targetCenter[0] <= rect.right 
                    && rect.top <= targetCenter[1] && targetCenter[1] <= rect.bottom ) {
                    deletePostIt(event)
                }
        
                this.draggable = false;
            }
        }
    })
}

async function updatePosition(event, left, top) {
    const postIt = event.target
    const id = postIt.getAttribute("data-id")
    const requestBody = {
        content: postIt.getAttribute("data-content"),
        dueDate: postIt.getAttribute("data-dueDate"),
        color: postIt.getAttribute("data-color"),
        isChecked: postIt.getAttribute("data-isChecked"),
        positionX: parseInt(left),
        positionY: parseInt(top)
    }
    const response = await putData(requestBody, `http://localhost:8080/todo/${id}`)
}

async function deletePostIt(event) {
    const postIt = event.target
    const id = postIt.getAttribute("data-id")
    const response = await deleteData(`http://localhost:8080/todo/${id}`)
    fetchTodo()
}