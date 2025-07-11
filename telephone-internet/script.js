// Telephone-Internet Management Script

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTelecom();
    setupTelecomEventListeners();
    updateTelecomPreview();
});

// Initialize telecom page
function initializeTelecom() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    const dueDate = document.getElementById('dueDate');
    if (dueDate) {
        dueDate.value = today;
    }

    // Generate initial random bill number
    generateRandomBillNumber();
}

// Generate random bill number for telecom
function generateRandomBillNumber() {
    const randomNumber = Math.floor(Math.random() * 1000000) + 1;
    document.getElementById('billNumber').value = 'TEL' + randomNumber.toString().padStart(6, '0');
}

// Set up event listeners for telecom page
function setupTelecomEventListeners() {
    // Telecom form event listeners
    const telecomFormInputs = document.querySelectorAll('#telecomForm input, #telecomForm select');
    telecomFormInputs.forEach(input => {
        input.addEventListener('input', updateTelecomPreview);
        input.addEventListener('change', updateTelecomPreview);
    });

    // Telecom calculation listeners
    const billAmount = document.getElementById('billAmount');
    if (billAmount) {
        billAmount.addEventListener('input', calculateTelecomAmounts);
    }
}

// Telecom calculation function
function calculateTelecomAmounts() {
    const billAmount = parseFloat(document.getElementById('billAmount').value) || 0;
    const gstRate = 0.18; // 18% GST
    const gstAmount = billAmount * gstRate;
    const totalAmount = billAmount + gstAmount;

    document.getElementById('gstAmount').value = gstAmount.toFixed(2);
    document.getElementById('totalAmount').value = totalAmount.toFixed(2);
}

// Get telecom form data
function getTelecomFormData() {
    const billAmount = parseFloat(document.getElementById('billAmount').value) || 0;

    // Return default data even when form is empty
    return {
        serviceProvider: document.getElementById('serviceProvider').value || 'AIRTEL TELECOM',
        providerAddress: document.getElementById('providerAddress').value || '123 Telecom Street, City, State',
        gstNumber: document.getElementById('gstNumber').value || 'GST123456789',
        contactNumber: document.getElementById('contactNumber').value || '+91 98765 43210',
        billNumber: document.getElementById('billNumber').value,
        accountNumber: document.getElementById('accountNumber').value || 'ACC123456789',
        serviceType: document.getElementById('serviceType').value || 'Mobile',
        planName: document.getElementById('planName').value || 'Premium Plan',
        billAmount: billAmount || 500.00,
        gstAmount: billAmount * 0.18 || 90.00,
        totalAmount: billAmount * 1.18 || 590.00,
        dueDate: document.getElementById('dueDate').value || new Date().toISOString().split('T')[0],
        customerName: document.getElementById('customerName').value || 'John Doe',
        customerAddress: document.getElementById('customerAddress').value || '456 Customer Street, City, State',
        billingPeriod: document.getElementById('billingPeriod').value || 'Jan 2024',
        paymentMode: document.getElementById('paymentMode').value || 'Online'
    };
}

// Update telecom preview
function updateTelecomPreview() {
    const formData = getTelecomFormData();
    const previewHtml = generateTelecomBillPreview(formData);
    document.getElementById('billPreview').innerHTML = previewHtml;
}

// Generate telecom bill preview
function generateTelecomBillPreview(data) {
    return `
        <div class="bill-logo">
            <img src="logo.jpeg" alt="Telecom Logo" onerror="this.style.display='none'" onload="this.style.display='block'">
        </div>
        <div class="bill-header">${data.serviceProvider.toUpperCase()}</div>
        <div class="bill-subheader">${data.providerAddress}</div>
        <div class="bill-separator"></div>
        <div class="bill-title">TELECOM BILL</div>
        
        <div class="bill-details-grid">
            <div class="bill-detail-left">
                <div class="bill-row">
                    <span class="bill-label">Bill No:</span>
                    <span class="bill-value">${data.billNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Account No:</span>
                    <span class="bill-value">${data.accountNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Service Type:</span>
                    <span class="bill-value">${data.serviceType}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Plan Name:</span>
                    <span class="bill-value">${data.planName}</span>
                </div>
            </div>
            <div class="bill-detail-right">
                <div class="bill-row">
                    <span class="bill-label">GST No:</span>
                    <span class="bill-value">${data.gstNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Contact:</span>
                    <span class="bill-value">${data.contactNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Due Date:</span>
                    <span class="bill-value">${formatDate(data.dueDate)}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Payment Mode:</span>
                    <span class="bill-value">${data.paymentMode}</span>
                </div>
            </div>
        </div>
        
        <div class="bill-section">
            <div class="bill-section-title">CUSTOMER DETAILS:</div>
            <div class="bill-row">
                <span class="bill-label">Customer Name:</span>
                <span class="bill-value">${data.customerName}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">Customer Address:</span>
                <span class="bill-value">${data.customerAddress}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">Billing Period:</span>
                <span class="bill-value">${data.billingPeriod}</span>
            </div>
        </div>
        
        <div class="bill-section">
            <div class="bill-section-title">BILL DETAILS:</div>
            <div class="bill-table">
                <div class="bill-table-header">
                    <span class="bill-table-col">Item</span>
                    <span class="bill-table-col">Amount</span>
                    <span class="bill-table-col">Total</span>
                </div>
                <div class="bill-table-row">
                    <span class="bill-table-col">${data.serviceType} Service</span>
                    <span class="bill-table-col">₹${data.billAmount.toFixed(2)}</span>
                    <span class="bill-table-col">₹${data.billAmount.toFixed(2)}</span>
                </div>
                <div class="bill-table-row">
                    <span class="bill-table-col">GST (18%)</span>
                    <span class="bill-table-col">₹${data.gstAmount.toFixed(2)}</span>
                    <span class="bill-table-col">₹${data.gstAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        <div class="bill-total">
            <div class="bill-total-line"></div>
            <div class="bill-row">
                <span class="bill-label">TOTAL AMOUNT:</span>
                <span class="bill-value">₹${data.totalAmount.toFixed(2)}</span>
            </div>
        </div>
        
        <div class="bill-footer">
            <p>Thank You! Visit Again</p>
            <p>For queries call: ${data.contactNumber}</p>
            <p>Pay before due date to avoid late fees</p>
        </div>
        
        <div class="bill-bottom">
            <span class="bill-bottom-left">Generated: ${new Date().toLocaleString('en-IN')}</span>
            <span class="bill-bottom-right">Due Date: ${formatDate(data.dueDate)}</span>
        </div>
    `;
}

// Download telecom preview PDF
async function downloadTelecomPreviewPDF() {
    const formData = getTelecomFormData();
    if (!formData) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set page dimensions
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    try {
        // Add logo with better error handling
        const logo = new Image();
        logo.crossOrigin = 'anonymous';

        await new Promise((resolve, reject) => {
            logo.onload = () => {
                try {
                    // Calculate logo dimensions to fit properly
                    const maxWidth = 50;
                    const maxHeight = 35;
                    let logoWidth = logo.width;
                    let logoHeight = logo.height;

                    // Scale down if too large
                    if (logoWidth > maxWidth || logoHeight > maxHeight) {
                        const ratio = Math.min(maxWidth / logoWidth, maxHeight / logoHeight);
                        logoWidth *= ratio;
                        logoHeight *= ratio;
                    }

                    // Center the logo above the service provider name
                    const logoX = 25;
                    const logoY = 15;
                    doc.addImage(logo, 'JPEG', logoX, logoY, logoWidth, logoHeight);
                    resolve();
                } catch (error) {
                    console.log('Error adding logo to PDF:', error);
                    resolve();
                }
            };
            logo.onerror = () => {
                console.log('Logo not found or CORS blocked, continuing without logo');
                resolve();
            };

            logo.src = 'logo.jpeg';
        });
    } catch (error) {
        console.log('Error loading logo:', error);
    }

    // Service provider header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(formData.serviceProvider.toUpperCase(), pageWidth/2, 60, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.providerAddress, pageWidth/2, 70, { align: 'center' });

    // Bill details in a structured format
    let yPos = 85;
    const leftMargin = 20;
    const rightMargin = pageWidth - 20;

    // Add a line separator
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPos - 5, rightMargin, yPos - 5);

    // Bill header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TELECOM BILL', pageWidth/2, yPos, { align: 'center' });
    yPos += 15;

    // Bill details in two columns
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Left column
    doc.text(`Bill No: ${formData.billNumber}`, leftMargin, yPos);
    doc.text(`Account No: ${formData.accountNumber}`, leftMargin, yPos + 8);
    doc.text(`Service Type: ${formData.serviceType}`, leftMargin, yPos + 16);
    doc.text(`Plan Name: ${formData.planName}`, leftMargin, yPos + 24);

    // Right column
    doc.text(`GST No: ${formData.gstNumber}`, rightMargin - 60, yPos, { align: 'right' });
    doc.text(`Contact: ${formData.contactNumber}`, rightMargin - 60, yPos + 8, { align: 'right' });
    doc.text(`Due Date: ${formatDate(formData.dueDate)}`, rightMargin - 60, yPos + 16, { align: 'right' });
    doc.text(`Payment Mode: ${formData.paymentMode}`, rightMargin - 60, yPos + 24, { align: 'right' });

    yPos += 35;

    // Customer details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER DETAILS:', leftMargin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Customer Name: ${formData.customerName}`, leftMargin, yPos);
    doc.text(`Customer Address: ${formData.customerAddress}`, leftMargin, yPos + 8);
    doc.text(`Billing Period: ${formData.billingPeriod}`, leftMargin, yPos + 16);

    yPos += 30;

    // Bill details in a table format
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL DETAILS:', leftMargin, yPos);
    yPos += 8;

    // Add a table-like structure
    const tableY = yPos;
    const col1 = leftMargin;
    const col2 = leftMargin + 80;
    const col3 = rightMargin - 40;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', col1, tableY);
    doc.text('Amount', col2, tableY);
    doc.text('Total', col3, tableY, { align: 'right' });

    yPos += 8;
    doc.setLineWidth(0.2);
    doc.line(leftMargin, yPos - 2, rightMargin, yPos - 2);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.serviceType} Service`, col1, yPos);
    doc.text(`₹${formData.billAmount.toFixed(2)}`, col2, yPos);
    doc.text(`₹${formData.billAmount.toFixed(2)}`, col3, yPos, { align: 'right' });

    yPos += 8;
    doc.text(`GST (18%)`, col1, yPos);
    doc.text(`₹${formData.gstAmount.toFixed(2)}`, col2, yPos);
    doc.text(`₹${formData.gstAmount.toFixed(2)}`, col3, yPos, { align: 'right' });

    yPos += 15;

    // Total section
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPos, rightMargin, yPos);
    yPos += 8;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL AMOUNT:', leftMargin, yPos);
    doc.text(`₹${formData.totalAmount.toFixed(2)}`, rightMargin, yPos, { align: 'right' });

    yPos += 15;

    // Footer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank You! Visit Again', pageWidth/2, yPos, { align: 'center' });
    doc.text(`For queries call: ${formData.contactNumber}`, pageWidth/2, yPos + 6, { align: 'center' });
    doc.text('Pay before due date to avoid late fees', pageWidth/2, yPos + 12, { align: 'center' });

    // Add generation info at bottom
    yPos += 25;
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, leftMargin, yPos);
    doc.text(`Due Date: ${formatDate(formData.dueDate)}`, rightMargin, yPos, { align: 'right' });

    // Save the PDF
    doc.save(`telecom-bill-${formData.billNumber}.pdf`);
    showMessage('Telecom bill downloaded successfully!', 'success');
}

// Clear telecom form
function clearTelecomForm() {
    document.getElementById('telecomForm').reset();
    document.getElementById('dueDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('serviceType').value = 'Mobile';
    document.getElementById('paymentMode').value = 'Online';
    document.getElementById('gstAmount').value = '';
    document.getElementById('totalAmount').value = '';

    // Generate new random bill number
    generateRandomBillNumber();

    // Show preview with default values
    updateTelecomPreview();
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
window.clearTelecomForm = clearTelecomForm;
window.downloadTelecomPreviewPDF = downloadTelecomPreviewPDF; 