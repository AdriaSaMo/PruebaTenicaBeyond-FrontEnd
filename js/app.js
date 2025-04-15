document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "https://localhost:7154/api/todoitems";
    const itemsContainer = document.getElementById("itemsContainer");
    const addTodoForm = document.getElementById("addTodoForm");
    const addProgressionForm = document.getElementById("addProgressionForm");
  
    function fetchTodoItems() {
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          itemsContainer.innerHTML = "";
          data.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "todo-item";
  
            const headerContainer = document.createElement("div");
            headerContainer.style.display = "flex";
            headerContainer.style.justifyContent = "space-between";
            headerContainer.style.alignItems = "center";
  
            const header = document.createElement("h3");
            header.textContent = `${item.id}) ${item.title} - ${item.description} (${item.category})`;
            header.style.marginRight = "10px";
            headerContainer.appendChild(header);
  
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = "&#128465;"; // Papelera
            deleteButton.style.border = "none";
            deleteButton.style.background = "transparent";
            deleteButton.style.cursor = "pointer";
            deleteButton.style.fontSize = "1.5rem";
            deleteButton.title = "Eliminar TodoItem";
            deleteButton.addEventListener("click", function() {
              fetch(`${apiUrl}/${item.id}`, {
                method: "DELETE"
              })
              .then(async response => {
                if (!response.ok) {
                  const errorText = await response.text();
                  throw new Error(errorText || "Error al eliminar el TodoItem");
                }
                return response;
              })
              .then(() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Eliminado',
                  text: 'TodoItem eliminado correctamente'
                });
                fetchTodoItems();
              })
              .catch(error => {
                console.error("Error al eliminar TodoItem:", error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: error.message || 'Error al eliminar el TodoItem'
                });
              });
            });
            headerContainer.appendChild(deleteButton);
            itemDiv.appendChild(headerContainer);
  
            const completionText = document.createElement("p");
            completionText.textContent = `Completado: ${item.isCompleted ? "Sí" : "No"}`;
            itemDiv.appendChild(completionText);
  
            const progressContainer = document.createElement("div");
            progressContainer.className = "progress-container";
            const progressBar = document.createElement("div");
            progressBar.className = "progress-bar";
            progressBar.style.width = `${item.totalPercentage}%`;
            progressContainer.appendChild(progressBar);
            itemDiv.appendChild(progressContainer);
  
            itemsContainer.appendChild(itemDiv);
          });
        })
        .catch(error => {
          console.error("Error al cargar los TodoItems:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los TodoItems'
          });
        });
    }
  
    fetchTodoItems();
  
    addTodoForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const category = document.getElementById("category").value;
  
      const newTodo = { title, description, category };
  
      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo)
      })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(data => {
        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'TodoItem creado exitosamente'
        });
        fetchTodoItems();
        addTodoForm.reset();
      })
      .catch(error => {
        console.error("Error al crear TodoItem:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Error al crear TodoItem'
        });
      });
    });
  
    addProgressionForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const todoId = document.getElementById("todoId").value;
      const progressDate = document.getElementById("progressDate").value;
      const progressPercent = document.getElementById("progressPercent").value;
  
      const progression = {
        Date: progressDate,
        Percent: parseFloat(progressPercent)
      };
  
      fetch(`${apiUrl}/${todoId}/progressions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progression)
      })
      .then(response => response.text())
      .then(text => text ? JSON.parse(text) : {})
      .then(data => {
        Swal.fire({
          icon: 'success',
          title: 'Progreso Agregado',
          text: 'La progresión se ha registrado correctamente'
        });
        fetchTodoItems();
        addProgressionForm.reset();
      })
      .catch(error => {
        console.error("Error al agregar progresión:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Error al agregar progresión'
        });
      });
    });
  
    const updateTodoForm = document.getElementById("updateTodoForm");
  
    updateTodoForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const todoId = document.getElementById("updateTodoId").value;
      const newDescription = document.getElementById("newDescription").value;
  
      fetch(`${apiUrl}/${todoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: newDescription })
      })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response;
      })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'La descripción se ha actualizado correctamente'
        });
        fetchTodoItems(); 
        updateTodoForm.reset();
      })
      .catch(error => {
        console.error("Error al actualizar la descripción:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Error al actualizar la descripción'
        });
      });
    });
  
    // Actualización de la lista cada 5 segundos
    setInterval(fetchTodoItems, 5000);
  });
  