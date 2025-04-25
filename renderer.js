window.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('txtFile');
    const cpiSelect = document.getElementById('cpiSelect');
    const generateButton = document.getElementById('generateBtn');
    const statusText = document.getElementById('statusText');

    generateButton.addEventListener('click', () => {
        const file = fileInput.files[0];
        const cpi = cpiSelect.value;

        if (!file) {
            alert('Please select a .txt file.');
            return;
        }

        if (!['10', '17'].includes(cpi)) {
            alert('Please select a valid CPI.');
            return;
        }

        const filePath = file.path;
        statusText.textContent = 'Generating PDF... Please wait.';

        window.electronAPI.generatePDF(filePath, cpi);
    });

    // Wait for 'pdf-ready' from main process
    window.electronAPI.onPDFReady((pdfPath) => {
        // Open the generated PDF in the default viewer
        window.open(`file://${pdfPath}`);
    
        // Update the status text
        statusText.textContent = 'PDF generated successfully!';
    
        // Clear the status text after 1.5 seconds
        setTimeout(() => {
            statusText.textContent = '';
        }, 1500);
    });
    

    window.electronAPI.onPDFError((error) => {
        statusText.textContent = `Error generating PDF: ${error}`;
    });
});
