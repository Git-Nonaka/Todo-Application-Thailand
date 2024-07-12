document.querySelector('#post-it-img').addEventListener('click', async function() {
  const modalElement = document.createElement('div');
  const innerElement = document.createElement('div');

  modalElement.classList.add('modal');
  innerElement.classList.add('inner');

  innerElement.innerHTML = `
  <button type="button" class="modal-close" id="modalClose">×</button>
  <form>
      <input class="date-input" type="date" name="dueDate"></input>
      <textarea rows="4" cols="50" maxlendth="100" name="content"></textarea>
      <button class="add-btn">add</button>
  </form>
  `
  ;

  modalElement.appendChild(innerElement);
  document.body.appendChild(modalElement);

  document.getElementById("modalClose").addEventListener("click", function() {
      closeModalWindow(modalElement);
  })

  document.querySelector(".add-btn").addEventListener("click", async function(event) {
      event.preventDefault()
      const form = event.target.form
      const formData = new FormData(form)
      const requestBody = {
          userId: localStorage.getItem("USER-ID"),
          content: formData.get("content"),
          dueDate: formData.get("dueDate"),
          color: "RED"
      }
      const response = await postData(requestBody, "http://localhost:8080/todo")
      fetchTodo()
      closeModalWindow(modalElement)
  })
});

function closeModalWindow(modalElement){
    document.body.removeChild(modalElement);
}