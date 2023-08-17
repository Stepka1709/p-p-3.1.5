let user = "";

fetch("http://localhost:8080/api/user").then(res => res.json())
    .then(data => {
        user = data;
        showUser(user)
        showUsername(user)
        showRoles(user);
        isAdmin(user);
    })

function showUser(user) {
    let temp = "";
    temp += "<tr>"
    temp += "<td>" + user.id + "</td>"
    temp += "<td>" + user.name + "</td>"
    temp += "<td>" + user.surname + "</td>"
    temp += "<td>" + user.age + "</td>"
    temp += "<td>" + user.username + "</td>"
    temp += "<td>" + user.roles.map(role => role.title.substring(5)).join(' ') + "</td>"
    temp += "</tr>"
    document.getElementById("userTable").innerHTML = temp;
}

function showUsername(user) {
    let temp = "";
    temp += user.username;
    document.getElementById("userName").innerHTML = temp;
}

function showRoles(user) {
    let temp = "";
    temp += user.roles.map(role => role.title.substring(5)).join(' ');
    document.getElementById("userRoles").innerHTML = temp;
}

function isAdmin(user) {
    if (!user.roles.some(role => role.title === "ROLE_ADMIN")) {
        console.log("admin")
        document.getElementById("isAdmin").setAttribute("hidden", "true");
    }
}