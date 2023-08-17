let user = ""

fetch("http://localhost:8080/api/user").then(res => res.json())
    .then(data => {
        user = data;
        showUsername(user)
        showRoles(user);
    })

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

//

let tableUsers = [];
let editModal = new bootstrap.Modal(document.getElementById('editModal'));
let deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

let request = new Request("http://localhost:8080/api/admin/users", {
    method: "GET",
    headers: {
        'Content-Type': 'application/json',
    },
});

getUsers();

function getUsers() {
    fetch(request).then(res =>
        res.json()).then(data => {
        tableUsers = [];
        if (data.length > 0) {
            data.forEach(user => {
                tableUsers.push(user)
            })
        } else {
            tableUsers = [];
        }
        showUsers(tableUsers);
    })
}

function showUsers(table) {
    let temp = "";
    table.forEach(user => {
        temp += "<tr>"
        temp += "<td>" + user.id + "</td>"
        temp += "<td>" + user.name + "</td>"
        temp += "<td>" + user.surname + "</td>"
        temp += "<td>" + user.age + "</td>"
        temp += "<td>" + user.username + "</td>"
        temp += "<td>" + user.roles.map(role => role.title.substring(5)).join(' ') + "</td>"
        temp += "<td>" + `<button onclick='showEditModal(${user.id})' class="btn btn-primary" id="edit" type="button">Edit</button>` + "</td>"
        temp += "<td>" + `<a onclick='showDeleteModal(${user.id})' class="btn btn-danger" id="delete">Delete</a>` + "</td>"
        temp += "</tr>"
        document.getElementById("usersTable").innerHTML = temp;
    })
}

function showEditModal(id) {
    let request = new Request("http://localhost:8080/api/admin/user/" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    fetch(request)
        .then(res => res.json())
        .then(editUser => {
            document.getElementById('editId').setAttribute('value', editUser.id);
            document.getElementById('editName').setAttribute('value', editUser.name);
            document.getElementById('editSurname').setAttribute('value', editUser.surname);
            document.getElementById('editAge').setAttribute('value', editUser.age);
            document.getElementById('editUsername').setAttribute('value', editUser.username);
            document.getElementById('editPassword').setAttribute('value', editUser.password);

            let rolesEditOptions = document.querySelectorAll('#editRoles option');

            rolesEditOptions.forEach(option => option.removeAttribute('selected'));
            editUser.roles.forEach(role => {
                let roleOption = document.getElementById('editRoles' + role.id);
                if (roleOption) {
                    roleOption.setAttribute('selected', 'true');
                }
            });

            let defaultRoleOption = document.getElementById('editRoles2');
            if (defaultRoleOption) {
                defaultRoleOption.setAttribute('selected', 'true');
            }

            editModal.show();
        });

    document.getElementById('editForm').addEventListener('submit', submitEditForm);
}

function submitEditForm(event) {
    event.preventDefault();
    let editUserForm = new FormData(event.target);
    let user = {
        id: editUserForm.get('id'),
        name: editUserForm.get('name'),
        surname: editUserForm.get('surname'),
        age: editUserForm.get('age'),
        username: editUserForm.get('username'),
        password: editUserForm.get('password'),
        roles: roles("#editRoles")
    }
    let request = new Request('http://localhost:8080/api/admin/edit', {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    fetch(request).then(
        function (response) {
            getUsers();
            event.target.reset();
            editModal.hide();
        });

}

function roles(event) {
    let rolesAdmin = {};
    let rolesUser = {};
    let roles = [];
    let allRoles = [];
    let sel = document.querySelector(event);
    for (let i = 0, n = sel.options.length; i < n; i++) {
        if (sel.options[i].selected) {
            roles.push(sel.options[i].value);
        }
    }
    if (roles.includes('1')) {
        rolesAdmin["id"] = 1;
        rolesAdmin["roleType"] = "ROLE_ADMIN";
        allRoles.push(rolesAdmin);
    }
    if (roles.includes('2')) {
        rolesUser["id"] = 2;
        rolesUser["roleType"] = "ROLE_USER";
        allRoles.push(rolesUser);
    }
    return allRoles;
}

function showDeleteModal(id) {
    document.getElementById('closeDeleteModal').setAttribute('onclick', () => {
        deleteModal.hide();
        document.getElementById('deleteForm').reset();
    });

    let request = new Request("http://localhost:8080/api/admin/user/" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    fetch(request).then(res => res.json()).then(deleteUser => {
            document.getElementById('deleteId').setAttribute('value', deleteUser.id);
            document.getElementById('deleteName').setAttribute('value', deleteUser.name);
            document.getElementById('deleteSurname').setAttribute('value', deleteUser.surname);
            document.getElementById('deleteAge').setAttribute('value', deleteUser.age);
            document.getElementById('deleteUsername').setAttribute('value', deleteUser.username);

            let rolesDeleteOptions = document.querySelectorAll('#editRoles option');

            rolesDeleteOptions.forEach(option => option.removeAttribute('selected'));
            deleteUser.roles.forEach(role => {
                let roleOption = document.getElementById('deleteRoles' + role.id);
                if (roleOption) {
                    roleOption.setAttribute('selected', 'true');
                }
            });

            let defaultRoleOption = document.getElementById('deleteRoles2');
            if (defaultRoleOption) {
                defaultRoleOption.setAttribute('selected', 'true');
            }
            //
            deleteModal.show();
        }
    );
    var isDelete = false;
    document.getElementById('deleteForm').addEventListener('submit', event => {
        event.preventDefault();
        if (!isDelete) {
            isDelete = true;
            let request = new Request('http://localhost:8080/api/admin/delete/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetch(request).then(() => {
                getUsers();
            });
            document.getElementById('deleteForm').reset();
        }

        deleteModal.hide();
    });
}

document.getElementById('newUser').addEventListener('submit', addNewUser);

function addNewUser(form) {
    form.preventDefault();
    let newUserForm = new FormData(form.target);
    let user = {
        id: null,
        name: newUserForm.get('name'),
        surname: newUserForm.get('surname'),
        age: newUserForm.get('age'),
        username: newUserForm.get('username'),
        password: newUserForm.get('password'),
        roles: roles("#roles1")
    };

    console.log(user)

    let req = new Request("http://localhost:8080/api/admin/add", {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    fetch(req).then(() => getUsers())
    form.target.reset();
    const triggerE1 = document.querySelector('#tabContent button[data-bs-target="#users-tab-pane"]');
    bootstrap.Tab.getInstance(triggerE1).show()
}
