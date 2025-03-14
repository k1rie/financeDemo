// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyADL1xx5zFEHODTLSZQ0U7pS9g3fw89hw4",
    authDomain: "db-mvp-8ca46.firebaseapp.com",
    projectId: "db-mvp-8ca46",
    storageBucket: "db-mvp-8ca46.appspot.com",
    messagingSenderId: "992298317332",
    appId: "1:992298317332:web:ecc0a275363ec998ff9901"
};

// Inicializar Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Referencias a servicios de Firebase
const auth = firebase.auth();

// Referencias a elementos del DOM
const loginForm = document.getElementById('earlyAccessForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const successModal = document.getElementById('successModal');
const closeModal = document.querySelector('.close-modal');
const receivedMessage = document.getElementById('receivedMessage');



// Manejo del formulario de login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!email || !password) {
        showMessage('Please complete all fields.');
        return;
    }
    
    try {
        console.log('Intentando iniciar sesión con:', email);
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        if (user) {
            receivedMessage.textContent = 'Login successful! Redirecting to the administration panel...';
            showModal();
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 2000);
        }
    } catch (error) {
        console.error('Error de autenticación:', error);
        let errorMessage = 'Error logging in. Please try again.';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect email or password. Please verify your credentials.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many failed attempts. Please try again later.';
        }
        showMessage(errorMessage);
    }
});

// Función para mostrar mensajes de error o información
function showMessage(message) {
    receivedMessage.textContent = message;
    showModal();
}

// Funciones para manejo del modal
function showModal() {
    successModal.style.display = 'flex';
}

function hideModal() {
    successModal.style.display = 'none';
}

// Cerrar modal al hacer clic en X
if (closeModal) {
    closeModal.addEventListener('click', hideModal);
}

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (event) => {
    if (event.target === successModal) {
        hideModal();
    }
});

