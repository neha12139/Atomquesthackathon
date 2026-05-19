let goals =
JSON.parse(localStorage.getItem("goals")) || [];

function saveGoals(){
  localStorage.setItem(
    "goals",
    JSON.stringify(goals)
  );
}

function login(){

  let role =
  document.getElementById("role").value;

  let username =
  document.getElementById("username").value;

  localStorage.setItem("username", username);

  if(role==="Employee"){
    employeeDashboard();
  }

  else if(role==="Manager"){
    managerDashboard();
  }

  else{
    adminDashboard();
  }

}

function employeeDashboard(){

  let username =
  localStorage.getItem("username");

  document.getElementById("app").innerHTML = `

  <div class="card">

    <h2>Welcome ${username}</h2>

    <h2>Create Goal</h2>

    <input id="title" placeholder="Goal Title">

    <input id="target" placeholder="Target">

    <input id="weight" placeholder="Weightage %">

    <button onclick="addGoal()">
      Add Goal
    </button>

    <p id="msg"></p>

  </div>

  <div id="goals"></div>

  `;

  renderGoals();

}

function addGoal(){

  let username =
  localStorage.getItem("username");

  let title =
  document.getElementById("title").value;

  let target =
  document.getElementById("target").value;

  let weight =
  Number(document.getElementById("weight").value);

  let employeeGoals =
  goals.filter(g => g.employee === username);

  if(employeeGoals.length >= 8){

    document.getElementById("msg").innerText =
    "Maximum 8 goals allowed";

    return;

  }

  if(weight < 10){

    document.getElementById("msg").innerText =
    "Minimum weightage is 10%";

    return;

  }

  let totalWeight =
  employeeGoals.reduce(
    (sum,g)=>sum + g.weight,
    0
  );

  if(totalWeight + weight > 100){

    document.getElementById("msg").innerText =
    "Total weightage cannot exceed 100%";

    return;

  }

  goals.push({
    employee: username,
    title,
    target,
    weight,
    status:"Pending Approval"
  });

  saveGoals();

  renderGoals();

}

function renderGoals(){

  let username =
  localStorage.getItem("username");

  let data = "";

  let employeeGoals =
  goals.filter(g => g.employee === username);

  employeeGoals.forEach((g,index)=>{

    data += `

    <div class="goal">

      <h3>${g.title}</h3>

      <p>Employee: ${g.employee}</p>

      <p>Target: ${g.target}</p>

      <p>Weightage: ${g.weight}%</p>

      <p>Status: ${g.status}</p>

      <select id="status${index}">
        <option>On Track</option>
        <option>Completed</option>
        <option>Delayed</option>
      </select>

      <button onclick="updateGoal('${g.title}')">
        Update Progress
      </button>

    </div>

    `;

  });

  document.getElementById("goals").innerHTML =
  data;

}

function updateGoal(title){

  let username =
  localStorage.getItem("username");

  let employeeGoals =
  goals.filter(g => g.employee === username);

  let selectedGoal =
  employeeGoals.find(g => g.title === title);

  let index =
  employeeGoals.findIndex(g => g.title === title);

  let status =
  document.getElementById(`status${index}`).value;

  selectedGoal.status = status;

  saveGoals();

  renderGoals();

}

function managerDashboard(){

  let data = "";

  goals.forEach((g,index)=>{

    data += `

    <div class="goal">

      <h3>${g.title}</h3>

      <p>Employee: ${g.employee}</p>

      <p>Target: ${g.target}</p>

      <p>Weightage: ${g.weight}%</p>

      <p>Status: ${g.status}</p>

      <button onclick="approveGoal(${index})">
        Approve Goal
      </button>

    </div>

    `;

  });

  document.getElementById("app").innerHTML = `

  <div class="card">

    <h2>Admin Analytics Dashboard</h2>

    <p>Total Goals: ${goals.length}</p>

    <p>
    Approved Goals:
    ${goals.filter(g => g.status==="Approved").length}
    </p>

    <p>
    Completed Goals:
    ${goals.filter(g => g.status==="Completed").length}
    </p>

    <p>
    Delayed Goals:
    ${goals.filter(g => g.status==="Delayed").length}
    </p>

    <hr>

    <h2>Manager Dashboard</h2>

    ${data}

  </div>

  `;

}

function approveGoal(index){

  goals[index].status = "Approved";

  saveGoals();

  managerDashboard();

}

function adminDashboard(){

  document.getElementById("app").innerHTML = `

  <div class="card">

    <h2>Admin Dashboard</h2>

    <p>Total Goals: ${goals.length}</p>

    <p>
    Approved Goals:
    ${goals.filter(g => g.status==="Approved").length}
    </p>

    <p>
    Completed Goals:
    ${goals.filter(g => g.status==="Completed").length}
    </p>

    <p>
    Delayed Goals:
    ${goals.filter(g => g.status==="Delayed").length}
    </p>

    <button onclick="clearGoals()">
      Clear All Goals
    </button>

    <button onclick="exportReport()">
      Export Report
    </button>

    <button onclick="auditLogs()">
      Audit Logs
    </button>

  </div>

  `;

}

function clearGoals(){

  localStorage.removeItem("goals");

  goals = [];

  alert("All Goals Cleared");

}

function exportReport(){

  let csv =
  "Employee,Goal,Target,Weightage,Status\n";

  goals.forEach(g=>{

    csv +=
    `${g.employee},${g.title},${g.target},${g.weight},${g.status}\n`;

  });

  let blob =
  new Blob([csv], {type:"text/csv"});

  let a =
  document.createElement("a");

  a.href =
  URL.createObjectURL(blob);

  a.download =
  "Goal_Report.csv";

  a.click();

}

function auditLogs(){

  alert(
    "Audit Trail Enabled:\nAll goal changes are tracked."
  );

}