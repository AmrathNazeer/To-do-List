
const API = "https://6971f17932c6bacb12c51f9b.mockapi.io/simple-todo";
let allTasks = [];

async function load(){
    let create = document.getElementById("create")
    try{

        create.innerHTML=" ";
        document.getElementById("loader").style.display = "block";
        let response = await fetch(API);
        let data = await response.json();
        allTasks = data;
      
        display(data);
        document.getElementById("loader").style.display = "none";
}catch(error){
        create.innerText = "Error fetching data";
    }
}

//Display Function

function display(data){
    
    let create = document.getElementById("create");
    create.innerHTML=" ";

        data.forEach(task=> {
            let row =document.createElement("tr");
            let titlecell = document.createElement("td");
            titlecell.innerText = task.title;
            if (task.status ==="Completed"){
                titlecell.style.textDecoration="line-through";
            }
            let prioritycell = document.createElement("td");
            prioritycell.innerText = task.priority;
            
            let statuscell = document.createElement("td");
            statuscell.innerText = task.status; 

            let actioncell = document.createElement("td");
               let completeBtn = document.createElement("button");
                completeBtn.innerText = "Completed / Pending";
                completeBtn.onclick = () => toggleStatus(task.id, task.status);
              
               let editBtn = document.createElement("button");
               editBtn.innerText = "EDIT";
               editBtn.onclick = () => showEditUI(task, row);

        // delete button
                let deleteBtn = document.createElement("button");
                deleteBtn.innerText = "DELETE";
                deleteBtn.onclick = () => deleteTask(task.id);

                actioncell.append(completeBtn, editBtn, deleteBtn);
            
            
            row.appendChild(titlecell);
            row.appendChild(prioritycell);
            row.appendChild(statuscell);
             row.appendChild(actioncell);

            create.appendChild(row);
            });
        }
// ADD TASK
async function addTask() {
    let title = document.getElementById("title").value;
    let priority = document.getElementById("priority").value;

    if (!title) return;

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: title,
            priority: priority,
            status: "Pending"
        })
    });

    document.getElementById("title").value = "";
    load();
}

// TOGGLE STATUS
async function toggleStatus(id, status) {
    let newStatus = status === "Pending" ? "Completed" : "Pending";

    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
    });

    load();
}

// EDIT PRIORITY
function showEditUI(task, row) {
    let priorityCell = row.children[1];
    let actionCell = row.children[3];

// Create dropdown
    let select = document.createElement("select");
    ["Low", "Medium", "High"].forEach(p => {
        let option = document.createElement("option");
        option.value = p;
        option.innerText = p;
        if (p === task.priority) option.selected = true;
        select.appendChild(option);
    });

// Save button
    let saveBtn = document.createElement("button");
    saveBtn.innerText = "SAVE";
    saveBtn.onclick = async () => {
        await fetch(`${API}/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ priority: select.value })
        });
        load();
    };

// Cancel button
    let cancelBtn = document.createElement("button");
    cancelBtn.innerText = "CANCEL";
    cancelBtn.onclick = () => load();

// Replace UI
    priorityCell.innerHTML = "";
    priorityCell.appendChild(select);

    actionCell.innerHTML = "";
    actionCell.append(saveBtn, cancelBtn);
}

// DELETE TASK
async function deleteTask(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    load();
}

// FILTER (JS ONLY)
function filterTasks(type) {
    if (type === "All") {
        display(allTasks);
    } else {
        let filtered = allTasks.filter(t => t.status === type);
        display(filtered);
    }
}
document.addEventListener("DOMContentLoaded",load);

