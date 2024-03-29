const axiosInstance = axios.create({
    baseURL : 'https://booking-appointment-app-backend.onrender.com/api'
});

function validate () {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    if(!name){
        alert('Enter Your Name');
        return false;
    }
    if(!phone){
        alert('Enter Your Phone No.');
        return false;
    }
    if(!email){
        alert('Enter Your Email Id');
        return false;
    }
    return true;
}

async function handleFormSubmit (event) {
    if(validate){
        event.preventDefault();

        const name = event.target.name.value;
        const phone = event.target.phone.value;
        const email = event.target.email.value;

        const obj = {
            name,
            phone,
            email
        };

        try {
            const res = await axiosInstance.post('/appointments', obj);
            console.log(res.data);
            showNewAppointments(res.data);
        } catch (err) {
            console.log(err);
            alert(err.message);
        }
    }
}

window.addEventListener('DOMContentLoaded', async() => {
    try {
        const res = await axiosInstance.get('/appointments');
        console.log(res)
    
        for(let i=0; i<res.data.length; i++){
            showNewAppointments(res.data[i]);
        }
    } catch (err) {
        console.log(err);
        alert(err.message);
    }
});

function showNewAppointments (obj) {
    const tbody = document.querySelector('tbody');

    tbody.innerHTML += `<tr>
        <td>${obj.name}</td>
        <td style="white-space: normal; word-wrap: break-word;">${obj.phone}</td>
        <td style="white-space: normal; word-wrap: break-word;">${obj.email}</td>
        <td>
        <button type="button" class="btn btn-info" onclick = "editAppointment(${obj.id}, this)">Edit</button>
        <button type="button" class="btn btn-danger" onclick = "deleteAppointment(${obj.id}, this)">Delete</button>
        </td>
    </tr>`;

    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
}

async function editAppointment (id, event) {
    const email = event.parentElement.previousElementSibling.textContent;
    const phone = event.parentElement.previousElementSibling.previousElementSibling.textContent;
    const name = event.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    
    
    // populate these values in the input fields
    document.getElementById('name').value = name;
    document.getElementById('phone').value = phone;
    document.getElementById('email').value = email;

    document.getElementById('add').style.display = 'none';
    document.getElementById('update').style.display = 'inline-block';

    const editBtn = document.getElementById('update');

    editBtn.addEventListener('click', async() => {
        if(validate()){
            const inputName = document.getElementById('name').value;
            const inputPhone = document.getElementById('phone').value;
            const inputEmail = document.getElementById('email').value;
    
            const obj = {
                name : inputName,
                phone : inputPhone,
                email : inputEmail
            }
            try {
                // update in the dom through event object
                event.parentElement.previousElementSibling.textContent = inputEmail;
                event.parentElement.previousElementSibling.previousElementSibling.textContent = inputPhone;
                event.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent = inputName;
        
                // update in database
                const updt = await axiosInstance.put(`/appointments/${id}`, obj);

            } catch (err) {
                console.log(err);
                alert(err.message);
            }
        }

    })
}

async function deleteAppointment (id, event) {
    try {
        const tbody = document.querySelector('tbody');
        const tr = event.parentElement.parentElement;
        tbody.removeChild(tr);
        const del = await axiosInstance.delete(`/appointments/${id}`);
    } catch (err) {
        console.log(err);
        alert(err.message);
    }
}