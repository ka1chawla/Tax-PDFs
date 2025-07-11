// Tax Filing Management Script

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTaxFiling();
    setupTaxFilingEventListeners();
    updateTaxFilingPreview();
});

// Initialize tax filing page
function initializeTaxFiling() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    const serviceDate = document.getElementById('serviceDate');
    if (serviceDate) {
        serviceDate.value = today;
    }

    // Generate initial random invoice number
    generateRandomTaxInvoiceNumber();
}

// Generate random invoice number for tax filing
function generateRandomTaxInvoiceNumber() {
    const randomNumber = Math.floor(Math.random() * 1000000) + 1;
    document.getElementById('invoiceNumber').value = 'TAX' + randomNumber.toString().padStart(6, '0');
}

// Set up event listeners for tax filing page
function setupTaxFilingEventListeners() {
    // Tax filing form event listeners
    const taxFilingFormInputs = document.querySelectorAll('#taxFilingForm input, #taxFilingForm select, #taxFilingForm textarea');
    taxFilingFormInputs.forEach(input => {
        input.addEventListener('input', updateTaxFilingPreview);
        input.addEventListener('change', updateTaxFilingPreview);
    });

    // Tax filing calculation listeners
    const consultationHours = document.getElementById('consultationHours');
    const hourlyRate = document.getElementById('hourlyRate');

    if (consultationHours) {
        consultationHours.addEventListener('input', calculateTaxFilingAmounts);
    }
    if (hourlyRate) {
        hourlyRate.addEventListener('input', calculateTaxFilingAmounts);
    }
}

// Tax filing calculation function
function calculateTaxFilingAmounts() {
    const consultationHours = parseFloat(document.getElementById('consultationHours').value) || 0;
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value) || 0;

    const subtotal = consultationHours * hourlyRate;
    const gstRate = 0.18; // 18% GST
    const gstAmount = subtotal * gstRate;
    const totalAmount = subtotal + gstAmount;

    document.getElementById('subtotal').value = subtotal.toFixed(2);
    document.getElementById('gstAmount').value = gstAmount.toFixed(2);
    document.getElementById('totalAmount').value = totalAmount.toFixed(2);
}

// Get tax filing form data
function getTaxFilingFormData() {
    const consultationHours = parseFloat(document.getElementById('consultationHours').value) || 0;
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value) || 0;

    const subtotal = consultationHours * hourlyRate;
    const gstAmount = subtotal * 0.18;
    const totalAmount = subtotal + gstAmount;

    // Return default data even when form is empty
    return {
        consultantName: document.getElementById('consultantName').value || 'ABC TAX CONSULTANTS',
        consultantAddress: document.getElementById('consultantAddress').value || '123 Tax Street, City, State',
        gstNumber: document.getElementById('gstNumber').value || 'GST123456789',
        contactNumber: document.getElementById('contactNumber').value || '+91 98765 43210',
        invoiceNumber: document.getElementById('invoiceNumber').value,
        serviceDate: document.getElementById('serviceDate').value || new Date().toISOString().split('T')[0],
        serviceType: document.getElementById('serviceType').value || 'Income Tax Filing',
        assessmentYear: document.getElementById('assessmentYear').value || '2024-25',
        consultationHours: consultationHours || 2.0,
        hourlyRate: hourlyRate || 1000.00,
        subtotal: subtotal || 2000.00,
        gstAmount: gstAmount || 360.00,
        totalAmount: totalAmount || 2360.00,
        paymentMode: document.getElementById('paymentMode').value || 'Online',
        clientName: document.getElementById('clientName').value || 'John Doe',
        clientAddress: document.getElementById('clientAddress').value || '456 Client Street, City, State',
        panNumber: document.getElementById('panNumber').value || 'N/A',
        aadharNumber: document.getElementById('aadharNumber').value || 'N/A',
        serviceDescription: document.getElementById('serviceDescription').value || 'Professional tax consultation and filing services provided as per client requirements.'
    };
}

// Update tax filing preview
function updateTaxFilingPreview() {
    const formData = getTaxFilingFormData();
    const previewHtml = generateTaxFilingBillPreview(formData);
    document.getElementById('billPreview').innerHTML = previewHtml;
}

// Generate tax filing bill preview
function generateTaxFilingBillPreview(data) {
    return `
        <div class="bill-logo">
            <img src="logo.jpeg" alt="Tax Consultant Logo" onerror="this.style.display='none'" onload="this.style.display='block'">
        </div>
        <div class="bill-header">${data.consultantName.toUpperCase()}</div>
        <div class="bill-subheader">${data.consultantAddress}</div>
        <div class="bill-separator"></div>
        <div class="bill-title">TAX CONSULTATION INVOICE</div>
        
        <div class="bill-details-grid">
            <div class="bill-detail-left">
                <div class="bill-row">
                    <span class="bill-label">Invoice No:</span>
                    <span class="bill-value">${data.invoiceNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Service Date:</span>
                    <span class="bill-value">${formatDate(data.serviceDate)}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Service Type:</span>
                    <span class="bill-value">${data.serviceType}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Assessment Year:</span>
                    <span class="bill-value">${data.assessmentYear}</span>
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
                    <span class="bill-label">Hours:</span>
                    <span class="bill-value">${data.consultationHours}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Rate/Hour:</span>
                    <span class="bill-value">₹${data.hourlyRate.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        <div class="bill-section">
            <div class="bill-section-title">CLIENT DETAILS:</div>
            <div class="bill-row">
                <span class="bill-label">Client Name:</span>
                <span class="bill-value">${data.clientName}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">Client Address:</span>
                <span class="bill-value">${data.clientAddress}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">PAN Number:</span>
                <span class="bill-value">${data.panNumber}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">Aadhar Number:</span>
                <span class="bill-value">${data.aadharNumber}</span>
            </div>
        </div>
        
        <div class="bill-section">
            <div class="bill-section-title">SERVICE DETAILS:</div>
            <div class="bill-table">
                <div class="bill-table-header">
                    <span class="bill-table-col">Item</span>
                    <span class="bill-table-col">Hours</span>
                    <span class="bill-table-col">Rate/Hour</span>
                    <span class="bill-table-col">Amount</span>
                </div>
                <div class="bill-table-row">
                    <span class="bill-table-col">${data.serviceType}</span>
                    <span class="bill-table-col">${data.consultationHours}</span>
                    <span class="bill-table-col">₹${data.hourlyRate.toFixed(2)}</span>
                    <span class="bill-table-col">₹${data.subtotal.toFixed(2)}</span>
                </div>
                <div class="bill-table-row">
                    <span class="bill-table-col">GST (18%)</span>
                    <span class="bill-table-col"></span>
                    <span class="bill-table-col"></span>
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
            <p>Professional tax services with complete confidentiality</p>
        </div>
        
        <div class="bill-bottom">
            <span class="bill-bottom-left">Generated: ${new Date().toLocaleString('en-IN')}</span>
            <span class="bill-bottom-right">Payment Mode: ${data.paymentMode}</span>
        </div>
    `;
}

// Download tax filing preview PDF
async function downloadTaxFilingPreviewPDF() {
    const formData = getTaxFilingFormData();
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

                    // Center the logo above the consultant name
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

    // Consultant header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(formData.consultantName.toUpperCase(), pageWidth/2, 60, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.consultantAddress, pageWidth/2, 70, { align: 'center' });

    // Invoice details in a structured format
    let yPos = 85;
    const leftMargin = 20;
    const rightMargin = pageWidth - 20;

    // Add a line separator
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPos - 5, rightMargin, yPos - 5);

    // Invoice header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX CONSULTATION INVOICE', pageWidth/2, yPos, { align: 'center' });
    yPos += 15;

    // Invoice details in two columns
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Left column
    doc.text(`Invoice No: ${formData.invoiceNumber}`, leftMargin, yPos);
    doc.text(`Service Date: ${formatDate(formData.serviceDate)}`, leftMargin, yPos + 8);
    doc.text(`Service Type: ${formData.serviceType}`, leftMargin, yPos + 16);
    doc.text(`Assessment Year: ${formData.assessmentYear}`, leftMargin, yPos + 24);

    // Right column
    doc.text(`GST No: ${formData.gstNumber}`, rightMargin - 60, yPos, { align: 'right' });
    doc.text(`Contact: ${formData.contactNumber}`, rightMargin - 60, yPos + 8, { align: 'right' });
    doc.text(`Hours: ${formData.consultationHours}`, rightMargin - 60, yPos + 16, { align: 'right' });
    doc.text(`Rate/Hour: ₹${formData.hourlyRate.toFixed(2)}`, rightMargin - 60, yPos + 24, { align: 'right' });

    yPos += 35;

    // Client details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT DETAILS:', leftMargin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Client Name: ${formData.clientName}`, leftMargin, yPos);
    doc.text(`Client Address: ${formData.clientAddress}`, leftMargin, yPos + 8);
    doc.text(`PAN Number: ${formData.panNumber}`, leftMargin, yPos + 16);
    doc.text(`Aadhar Number: ${formData.aadharNumber}`, leftMargin, yPos + 24);

    yPos += 30;

    // Service details in a table format
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('SERVICE DETAILS:', leftMargin, yPos);
    yPos += 8;

    // Add a table-like structure
    const tableY = yPos;
    const col1 = leftMargin;
    const col2 = leftMargin + 80;
    const col3 = leftMargin + 120; // Added for Hours
    const col4 = rightMargin - 40; // Added for Amount

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', col1, tableY);
    doc.text('Hours', col2, tableY);
    doc.text('Rate/Hour', col3, tableY);
    doc.text('Amount', col4, tableY, { align: 'right' });

    yPos += 8;
    doc.setLineWidth(0.2);
    doc.line(leftMargin, yPos - 2, rightMargin, yPos - 2);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.serviceType}`, col1, yPos);
    doc.text(`${formData.consultationHours}`, col2, yPos);
    doc.text(`₹${formData.hourlyRate.toFixed(2)}`, col3, yPos);
    doc.text(`₹${formData.subtotal.toFixed(2)}`, col4, yPos, { align: 'right' });

    yPos += 8;
    doc.text(`GST (18%)`, col1, yPos);
    doc.text(`₹${formData.gstAmount.toFixed(2)}`, col4, yPos, { align: 'right' });

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
    doc.text('Professional tax services with complete confidentiality', pageWidth/2, yPos + 12, { align: 'center' });

    // Add generation info at bottom
    yPos += 25;
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, leftMargin, yPos);
    doc.text(`Payment Mode: ${formData.paymentMode}`, rightMargin, yPos, { align: 'right' });

    // Save the PDF
    doc.save(`tax-consultation-invoice-${formData.invoiceNumber}.pdf`);
    showMessage('Tax consultation invoice downloaded successfully!', 'success');
}

// Clear tax filing form
function clearTaxFilingForm() {
    document.getElementById('taxFilingForm').reset();
    document.getElementById('serviceDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('serviceType').value = 'Income Tax Filing';
    document.getElementById('paymentMode').value = 'Online';
    document.getElementById('panNumber').value = 'N/A';
    document.getElementById('aadharNumber').value = 'N/A';
    document.getElementById('subtotal').value = '';
    document.getElementById('gstAmount').value = '';
    document.getElementById('totalAmount').value = '';

    // Generate new random invoice number
    generateRandomTaxInvoiceNumber();

    // Show preview with default values
    updateTaxFilingPreview();
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
window.clearTaxFilingForm = clearTaxFilingForm;
window.downloadTaxFilingPreviewPDF = downloadTaxFilingPreviewPDF; 