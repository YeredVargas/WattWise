function inicializarToggle(idToggle, idEstado) {
  const toggleSwitch = document.getElementById(idToggle);
  const estadoTexto = document.getElementById(idEstado);

  if (!toggleSwitch || !estadoTexto) {
      console.error("No se encontró el toggle o el texto de estado en el DOM.");
      return;
  }

  // Mostrar el estado inicial
  let estado = toggleSwitch.checked ? "ON" : "OFF";
  estadoTexto.innerText = `El estado inicial es: ${estado}`;

  // Actualizar el estado cuando cambie el toggle
  toggleSwitch.addEventListener("change", function () {
      estado = this.checked ? "ON" : "OFF";
      estadoTexto.innerText = `El estado actual es: ${estado}`;
      console.log("Estado del toggle:", estado);
  });
}




  function focusOnInput(modalId, inputId) {
    $(modalId).on('shown.bs.modal', function () {
      $(inputId).trigger('focus');
    });
  }

  focusOnInput('#myModal', '#myInput');

  function toggleModal() {
    const modal = document.querySelector('.modal');
    const trigger = document.querySelector('.material-symbols-outlined');
    
    // Evento para abrir la modal al hacer clic en el trigger
    trigger.addEventListener('click', function() {
        modal.style.display = 'flex'; // Muestra la modal
    });

    // Evento para cerrar la modal al hacer clic fuera del formulario
    modal.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            modal.style.display = 'none'; // Oculta la modal
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    toggleModal();
});