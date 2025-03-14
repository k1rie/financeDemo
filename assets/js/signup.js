

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyADL1xx5zFEHODTLSZQ0U7pS9g3fw89hw4",
    authDomain: "db-mvp-8ca46.firebaseapp.com",
    projectId: "db-mvp-8ca46",
    storageBucket: "db-mvp-8ca46.firebasestorage.app",
    messagingSenderId: "992298317332",
    appId: "1:992298317332:web:ecc0a275363ec998ff9901"
  };
  
  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Elementos del DOM
  const form = document.getElementById('earlyAccessForm');
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const interestLevelInput = document.getElementById('interestLevel');
  const modal = document.getElementById('successModal');
  const closeModal = document.querySelector('.close-modal');
  
  // Función para validar el formulario
  function validateForm() {
    // Crear elementos para mensajes de error si no existen
    let nameError = document.getElementById('nameError');
    if (!nameError) {
      nameError = document.createElement('div');
      nameError.id = 'nameError';
      nameError.className = 'error-message';
      fullNameInput.parentNode.appendChild(nameError);
    }
    
    let emailError = document.getElementById('emailError');
    if (!emailError) {
      emailError = document.createElement('div');
      emailError.id = 'emailError';
      emailError.className = 'error-message';
      emailInput.parentNode.appendChild(emailError);
    }
    
    let interestError = document.getElementById('interestError');
    if (!interestError) {
      interestError = document.createElement('div');
      interestError.id = 'interestError';
      interestError.className = 'error-message';
      interestLevelInput.parentNode.appendChild(interestError);
    }
    
    // Limpiar mensajes de error anteriores
    nameError.textContent = '';
    emailError.textContent = '';
    interestError.textContent = '';
    
    let isValid = true;
    
    // Validar nombre completo
    if (fullNameInput.value.trim() === '') {
      nameError.textContent = 'Please enter your full name';
      isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(fullNameInput.value)) {
      nameError.textContent = 'Name should only contain letters and spaces';
      isValid = false;
    }
    
    // Validar email
    if (emailInput.value.trim() === '') {
      emailError.textContent = 'Please enter your email address';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      emailError.textContent = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Validar nivel de interés
    if (interestLevelInput.value === '') {
      interestError.textContent = 'Please select your interest level';
      isValid = false;
    }
    
    return isValid;
  }
  
  // Función para mostrar el modal
  function showModal() {
    modal.style.display = 'flex';
  }
  
  // Función para cerrar el modal
  function closeModalHandler() {
    modal.style.display = 'none';
  }
  
  // Manejar el envío del formulario
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Obtener los valores del formulario
    const fullName = fullNameInput.value;
    const email = emailInput.value;
    const interestLevel = interestLevelInput.value;
    
    // Mapear los valores del select a etiquetas descriptivas
    const interestLabels = {
      'beginner': 'Just curious',
      'intermediate': 'Interested in learning',
      'advanced': 'Ready to invest'
    };
    
    try {
      // Guardar los datos en Firestore
      await db.collection('signups').add({
        fullName,
        email,
        interestLevel: interestLabels[interestLevel] || interestLevel,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // Resetear el formulario
      form.reset();
      
      // Mostrar el modal de éxito
      showModal();
      
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      alert('There was an error processing your signup. Please try again later.');
    }
  });
  
  // Event listener para cerrar el modal
  closeModal.addEventListener('click', closeModalHandler);
  
  // Cerrar el modal si se hace clic fuera de él
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModalHandler();
    }
  });
  
  // Agregar un poco de CSS para los mensajes de error en línea
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      .error-message {
        color: #ff3b30;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        margin-bottom: 0.5rem;
      }
      .form-group {
        margin-bottom: 1rem;
      }
    </style>
  `);