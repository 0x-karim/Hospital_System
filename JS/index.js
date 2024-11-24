'use strict'
const addPatientForm = document.querySelector('#addPatientForm')
const displayForm = document.querySelector('#displayForm')
const messageBody = document.querySelector('.message-body')
const patientsList = document.querySelector('.patients-list')
const closeBtn = document.querySelector('#closeBtn')
const exitButton = document.querySelector('#exitButton')

let specializationArr;

if (localStorage.getItem('specializationArr') != null) {
    specializationArr = JSON.parse(localStorage.getItem('specializationArr'));
}else {
    specializationArr = Array.from({ length: 20 }, () => [])
}

addPatientForm.addEventListener('submit', e => {
    e.preventDefault()
    const specialization = parseInt(document.querySelector('#specializationInput').value);
    const patientName = document.querySelector('#patientNameInput').value;
    const patientStatus = parseInt(document.querySelector('#patientStatus').value);

    if (specializationArr[specialization - 1].length >= 5) {
        alertMessage.classList.add('d-flex');
        alertMessage.classList.remove('d-none');
        messageBody.innerHTML = '<h4 class="fw-bold py-5">Sorry, no available places in this specialization for any patient.</h4>';
        return;

    }else{
        const patient = { patientName, patientStatus }
        if (patientStatus === 1) {
            specializationArr[specialization - 1].unshift(patient);
            localStorage.setItem('specializationArr' , JSON.stringify(specializationArr));
        } else {
            specializationArr[specialization - 1].push(patient);
            localStorage.setItem('specializationArr' , JSON.stringify(specializationArr));
        }
    }
})

displayForm.addEventListener('submit', e => {
    e.preventDefault();
    const displayInput = parseInt(document.querySelector('#displayInput').value);
    
    if (!specializationArr[displayInput - 1] || specializationArr[displayInput - 1].length === 0) {
        patientsList.classList.add('d-none');
        patientsList.classList.remove('d-block');
        alertMessage.classList.add('d-flex');
        alertMessage.classList.remove('d-none');
        messageBody.innerHTML = '<h4 class="fw-bold py-5">No patients in this specialization.</h4>';
        return;
    } else {
        patientsList.classList.add('d-block');
        patientsList.classList.remove('d-none');
        renderPatients(displayInput);
    }
});

function renderPatients(displayInput) {
    let patientCartoona = '';
    let patientNumberCartoona = '';

    for (let i = 0; i < specializationArr[displayInput - 1].length; i++) {
        patientCartoona += `<tr class="bg-secondary-subtle">
                                <td class="py-3">${specializationArr[displayInput - 1][i].patientName}</td>
                                <td class="py-3">${specializationArr[displayInput - 1][i].patientStatus}</td>
                                <td class="py-3"><button class="pickup btn btn-warning" data-index="${i}">Get</button></td>
                            </tr>`;
    }

    patientNumberCartoona = `<tr>
                                <td class="py-3 w-25 fw-bold text-secondary text-capitalize" colspan="3">
                                    There are <span class="text-success">${specializationArr[displayInput - 1].length}</span> patients in this specialization 
                                </td>
                            </tr>`;

    document.querySelector('.patients-list .specilize table tbody').innerHTML = patientCartoona;
    document.querySelector('.patients-list .specilize table tfoot').innerHTML = patientNumberCartoona;

    const btnGroup = Array.from(document.querySelectorAll('.pickup'));
    btnGroup.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            const invokePatient = specializationArr[displayInput - 1][index].patientName;

            specializationArr[displayInput - 1].splice(index, 1);
            
            if (specializationArr[displayInput - 1].length == 0) {
                patientsList.classList.add('d-none');
                patientsList.classList.remove('d-block');
            }

            localStorage.setItem('specializationArr', JSON.stringify(specializationArr));
            alertMessage.classList.add('d-flex');
            alertMessage.classList.remove('d-none');
            messageBody.innerHTML = `<h4 class="fw-bold py-5">Patient ${invokePatient} is asked to go with the doctor.</h4>`;
            
            renderPatients(displayInput);
        });
    });
}

exitButton.addEventListener('click', () => window.close())

closeBtn.addEventListener('click', () => {
    alertMessage.classList.add('d-none');
    alertMessage.classList.remove('d-flex');
})