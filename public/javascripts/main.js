function onJoinRoomClick() {
    const form = document.getElementById('form')

    // remove last child in form
    form.removeChild(form.lastChild)

    // add input field to form
    appendInputField(form)

    // add submit button to form
    appendSubmitButton(form)
}

function appendInputField(form) {
    // create div
    const div = document.createElement('div')
    div.className = 'form-floating mb-3'

    // create input
    const input = document.createElement('input')
    input.className = 'form-control'
    input.id = 'room'
    input.type = 'text'
    input.name = 'room'
    input.placeholder = 'Room ID'
    input.required = true

    // create label
    const label = document.createElement('label')
    label.innerText = 'Room ID'
    label.for = 'room'

    // append input and label to div
    div.appendChild(input)
    div.appendChild(label)

    // append div to form
    form.appendChild(div)
}

function appendSubmitButton(form) {
    const button = document.createElement('button')
    button.className = 'btn btn-primary form-control'
    button.type = 'submit'
    button.innerText = 'Enter editor'
    form.appendChild(button)
}
