const firebaseConfig = {
    apiKey: "AIzaSyADL1xx5zFEHODTLSZQ0U7pS9g3fw89hw4",
    authDomain: "db-mvp-8ca46.firebaseapp.com",
    projectId: "db-mvp-8ca46",
    storageBucket: "db-mvp-8ca46.firebasestorage.app",
    messagingSenderId: "992298317332",
    appId: "1:992298317332:web:ecc0a275363ec998ff9901"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Function to download signup data from Firestore as CSV
function descargarCSV() {
    // Reference to the 'signups' collection in Firestore
    const db = firebase.firestore();
    const signupsRef = db.collection('signups');
    
    // Get all documents from the signups collection
    signupsRef.get()
        .then((querySnapshot) => {
            // Array to store all user data
            const userData = [];
            
            // Process each document
            querySnapshot.forEach((doc) => {
                userData.push(doc.data());
            });
            
            // Convert data to CSV format
            const csvContent = convertToCSV(userData);
            
            // Create and trigger download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            // Set download attributes
            link.setAttribute('href', url);
            link.setAttribute('download', `signups_${formatDate(new Date())}.csv`);
            link.style.visibility = 'hidden';
            
            // Append to document, trigger click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch((error) => {
            console.error("Error fetching signup data: ", error);
            alert("Error al descargar los datos. Por favor, intenta de nuevo más tarde.");
        });
}

// Helper function to convert data to CSV format
function convertToCSV(data) {
    if (data.length === 0) {
        return '';
    }
    
    // Get headers from the first object's keys
    const headers = Object.keys(data[0]);
    
    // Create header row
    let csvContent = headers.join(',') + '\n';
    
    // Add data rows
    data.forEach(item => {
        const row = headers.map(header => {
            // Handle different data types and escape values with commas
            let value = item[header];
            
            // Format timestamp objects if present
            if (value && typeof value === 'object' && value.seconds) {
                value = new Date(value.seconds * 1000).toISOString();
            }
            
            // Convert to string and handle special cases
            const cellValue = value !== undefined && value !== null ? String(value) : '';
            
            // Escape quotes and wrap in quotes if contains comma or newline
            if (cellValue.includes(',') || cellValue.includes('\n') || cellValue.includes('"')) {
                return `"${cellValue.replace(/"/g, '""')}"`;
            }
            return cellValue;
        });
        
        csvContent += row.join(',') + '\n';
    });
    
    return csvContent;
}

// Helper function to format date for filename
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}