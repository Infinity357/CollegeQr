async function login(){

let username=document.getElementById("username").value;
let password=document.getElementById("password").value;

if(username=="" || password=="")
{
    alert("Please enter username and password");
    return;
}

try {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        const user = data.user;
        if (user.role === 'teacher') {
            localStorage.setItem("currentTeacher", JSON.stringify({
                name: user.name, 
                id: user.username, 
                email: user.email, 
                contact: user.contact
            }));
            window.location.href="teacher_dashboard.html";
        } else if (user.role === 'guard') {
            localStorage.setItem("currentTeacher", JSON.stringify({
                name: user.name, 
                id: user.username
            }));
            window.location.href="gate.html";
        } else if (user.role === 'student') {
            localStorage.setItem("currentStudent", JSON.stringify(user));
            window.location.href="dashboard.html";
        }
    } else {
        alert(data.error || "Wrong ID or Password. Please try again.");
    }
} catch (error) {
    console.error("Login error:", error);
    alert("An error occurred during login. Please try again later.");
}

}
