const studentDatabase = {
    "231030146": { pass: "yc123", name: "Yuvika Chaudhary", email: "yuvika12@gmail.com", contact: "8435688578", roll: "231030146", batch: "A15" },
    "231030083": { pass: "aviral123", name: "Aviral Gupta", email: "aviral32@gmail.com", contact: "7649467959", roll: "231030083", batch: "A13" },
    "231030197": { pass: "mayank123", name: "Mayank", email: "mayank46@gmail.com", contact: "9787687577", roll: "231030197", batch: "A17" },
    "231030202": { pass: "sourav123", name: "Sourav Bhatt", email: "sourav78@gmail.com", contact: "8547890965", roll: "231030202", batch: "A17" }
};

function login(){

let username=document.getElementById("username").value;
let password=document.getElementById("password").value;

if(username=="" || password=="")
{
alert("Please enter username and password");
}
else if((username=="GauravNegi123" || username=="Anita123") && password=="teacher123")
{
    if (username === "Anita123") {
        localStorage.setItem("currentTeacher", JSON.stringify({name: "Anita", id: "Anita123", email: "anita42@gmail.com", contact: "8768598474"}));
    } else {
        localStorage.setItem("currentTeacher", JSON.stringify({name: "Gaurav Negi", id: "GauravNegi123", email: "gaurav321@gmail.com", contact: "9785493932"}));
    }
    window.location.href="teacher_dashboard.html";
}
else if(username=="Gate123" && password=="gate123")
{
    localStorage.setItem("currentTeacher", JSON.stringify({name: "Gate Guard", id: "Gate123"}));
    window.location.href="gate.html";
}
else if(studentDatabase[username] && studentDatabase[username].pass === password)
{
localStorage.setItem("currentStudent", JSON.stringify(studentDatabase[username]));
window.location.href="dashboard.html";
}
else
{
alert("Wrong ID or Password. Please try again.");
}

}
