// Driver Salary Management Script

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDriverSalary();
    setupDriverSalaryEventListeners();
    updateSalaryReceipt();
});

// Initialize driver salary page
function initializeDriverSalary() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    const receiptDate = document.getElementById('receiptDate');
    if (receiptDate) {
        receiptDate.value = today;
    }
}

// Set up event listeners for driver salary page
function setupDriverSalaryEventListeners() {
    // Driver salary receipt listeners
    const salaryFormInputs = document.querySelectorAll('#salaryForm input, #salaryForm select');
    salaryFormInputs.forEach(input => {
        input.addEventListener('input', updateSalaryReceipt);
        input.addEventListener('change', updateSalaryReceipt);
    });
}

// Clear salary form
function clearSalaryForm() {
    document.getElementById('salaryForm').reset();
    document.getElementById('receiptDate').value = new Date().toISOString().split('T')[0];
    updateSalaryReceipt();
}

// Update salary receipt preview
function updateSalaryReceipt() {
    const formData = getSalaryFormData();
    const receiptHtml = generateSalaryReceipt(formData);
    document.getElementById('salaryReceipt').innerHTML = receiptHtml;
}

// Get salary form data
function getSalaryFormData() {
    return {
        employerName: document.getElementById('employerName').value || 'Employer Name',
        driverName: document.getElementById('driverName').value || 'Driver Name',
        dlNumber: document.getElementById('dlNumber').value || 'DL Number',
        carNumber: document.getElementById('carNumber').value || 'Car Number',
        monthYear: document.getElementById('monthYear').value || 'Month Year',
        salaryAmount: parseFloat(document.getElementById('salaryAmount').value) || 0,
        receiptDate: document.getElementById('receiptDate').value || new Date().toISOString().split('T')[0]
    };
}

// Generate salary receipt HTML
function generateSalaryReceipt(data) {
    return `
        <div class="bill-header" style="text-decoration: underline; margin-bottom: 20px;">DRIVER SALARY RECEIPT</div>
        
        <div class="bill-section" style="margin-bottom: 20px;">
            <div class="bill-row" style="text-align: justify; line-height: 1.6;">
                <span>Received with thanks from <strong>${data.employerName}</strong> INR <strong>₹${data.salaryAmount.toFixed(2)}</strong> cash as a remuneration for Driving Car No. <strong>${data.carNumber}</strong> for the month of <strong>${data.monthYear}</strong>.</span>
            </div>
        </div>
        
        <div class="bill-section">
            <div class="bill-row">
                <span class="bill-label">Name: ${data.driverName}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">DL No: ${data.dlNumber}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">Date: ${formatDate(data.receiptDate)}</span>
            </div>
        </div>
        
        <div class="bill-footer" style="margin-top: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div style="text-align: center;">
                    <p style="margin-bottom: 10px;">Sign of Driver</p>
                    <img src="sign.jpg" alt="Driver Signature" style="max-width: 150px; max-height: 60px; object-fit: contain;" onerror="this.style.display='none'" onload="this.style.display='block'">
                    <div style="border-bottom: 1px solid #000; width: 150px; height: 1px; margin-top: 5px;"></div>
                </div>
                <div style="text-align: center;">
                    <p style="margin-bottom: 10px;">Affix Revenue Stamp</p>
                    <img src="revenueStamp.jpg" alt="Revenue Stamp" style="max-width: 80px; max-height: 60px; object-fit: contain;" onerror="this.style.display='none'" onload="this.style.display='block'">
                </div>
            </div>
        </div>
    `;
}

// Download salary PDF
async function downloadSalaryPDF() {
    const formData = getSalaryFormData();
    if (!formData || formData.driverName === 'Driver Name') {
        showMessage('Please fill in the form first before downloading the receipt.', 'error');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set font
    doc.setFont('helvetica');

    generateSalaryReceiptPDF(doc, formData);
    doc.save(`driver-salary-receipt-${formData.driverName}-${new Date().toISOString().split('T')[0]}.pdf`);
}

// Generate salary receipt PDF
function generateSalaryReceiptPDF(doc, data) {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('DRIVER SALARY RECEIPT', pageWidth/2, 30, { align: 'center' });

    // Add underline
    const textWidth = doc.getTextWidth('DRIVER SALARY RECEIPT');
    doc.setLineWidth(0.5);
    doc.line((pageWidth - textWidth) / 2, 35, (pageWidth + textWidth) / 2, 35);

    // Receipt text - Fixed to avoid extra spaces
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const receiptText = `Received with thanks from ${data.employerName} INR ₹${data.salaryAmount.toFixed(2)} cash as a remuneration for Driving Car No. ${data.carNumber} for the month of ${data.monthYear}.`;

    // Use a simpler approach to handle text wrapping without extra spaces
    const maxWidth = pageWidth - 40;
    const words = receiptText.split(' ');
    let currentLine = '';
    let yPos = 60;
    
    for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
        const testWidth = doc.getTextWidth(testLine);
        
        if (testWidth > maxWidth && currentLine !== '') {
            // Draw the current line and start a new one
            doc.text(currentLine, 20, yPos, { align: 'left' });
            yPos += 8;
            currentLine = words[i];
        } else {
            currentLine = testLine;
        }
    }
    
    // Draw the last line
    if (currentLine) {
        doc.text(currentLine, 20, yPos, { align: 'left' });
        yPos += 8;
    }

    yPos += 20;

    // Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Name: ${data.driverName}`, 20, yPos);
    yPos += 12;
    doc.text(`DL No: ${data.dlNumber}`, 20, yPos);
    yPos += 12;
    doc.text(`Date: ${formatDate(data.receiptDate)}`, 20, yPos);

    yPos += 30;

    // Signature and stamp area
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Driver signature
    doc.text('Sign of Driver', 20, yPos);

    // Add sign image
    const signImg = new Image();
    signImg.src = 'sign.jpg';
    signImg.onload = function() {
        try {
            doc.addImage(signImg, 'JPEG', 20, yPos + 5, 60, 30);
        } catch (e) {
            console.log('Sign image loading failed:', e);
        }
    };
    signImg.onerror = function() {
        console.log('Sign image not found');
    };

    doc.setLineWidth(0.5);
    doc.line(20, yPos + 40, 100, yPos + 40);

    // Revenue stamp
    doc.text('Affix Revenue Stamp', pageWidth - 60, yPos);

    // Add revenue stamp image
    const stampImg = new Image();
    stampImg.src = 'revenueStamp.jpg';
    stampImg.onload = function() {
        try {
            doc.addImage(stampImg, 'JPEG', pageWidth - 80, yPos + 5, 40, 30);
        } catch (e) {
            console.log('Stamp image loading failed:', e);
        }
    };
    stampImg.onerror = function() {
        console.log('Stamp image not found');
    };
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // Insert at the top of the page content
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(messageDiv, container.firstChild);
    }

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Export functions for global access
window.clearSalaryForm = clearSalaryForm;
window.downloadSalaryPDF = downloadSalaryPDF; 