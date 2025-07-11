// Car Hire Management Script

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeCarHire();
    setupCarHireEventListeners();
    updateCarHirePreview();
});

// Initialize car hire page
function initializeCarHire() {
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    const rentalDate = document.getElementById('rentalDate');
    const returnDate = document.getElementById('returnDate');
    
    if (rentalDate) {
        rentalDate.value = today;
    }
    if (returnDate) {
        returnDate.value = tomorrow;
    }

    // Generate initial random invoice number
    generateRandomInvoiceNumber();
}

// Generate random invoice number for car hire
function generateRandomInvoiceNumber() {
    const randomNumber = Math.floor(Math.random() * 1000000) + 1;
    document.getElementById('invoiceNumber').value = 'CAR' + randomNumber.toString().padStart(6, '0');
}

// Set up event listeners for car hire page
function setupCarHireEventListeners() {
    // Car hire form event listeners
    const carHireFormInputs = document.querySelectorAll('#carHireForm input, #carHireForm select');
    carHireFormInputs.forEach(input => {
        input.addEventListener('input', updateCarHirePreview);
        input.addEventListener('change', updateCarHirePreview);
    });

    // Car hire calculation listeners
    const rentalDate = document.getElementById('rentalDate');
    const returnDate = document.getElementById('returnDate');
    const dailyRate = document.getElementById('dailyRate');

    if (rentalDate) {
        rentalDate.addEventListener('change', calculateCarHireAmounts);
    }
    if (returnDate) {
        returnDate.addEventListener('change', calculateCarHireAmounts);
    }
    if (dailyRate) {
        dailyRate.addEventListener('input', calculateCarHireAmounts);
    }
}

// Car hire calculation function
function calculateCarHireAmounts() {
    const rentalDate = new Date(document.getElementById('rentalDate').value);
    const returnDate = new Date(document.getElementById('returnDate').value);
    const dailyRate = parseFloat(document.getElementById('dailyRate').value) || 0;

    if (rentalDate && returnDate && returnDate >= rentalDate) {
        const timeDiff = returnDate.getTime() - rentalDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end day

        document.getElementById('numberOfDays').value = daysDiff;

        const subtotal = daysDiff * dailyRate;
        const gstRate = 0.18; // 18% GST
        const gstAmount = subtotal * gstRate;
        const totalAmount = subtotal + gstAmount;

        document.getElementById('subtotal').value = subtotal.toFixed(2);
        document.getElementById('gstAmount').value = gstAmount.toFixed(2);
        document.getElementById('totalAmount').value = totalAmount.toFixed(2);
    } else {
        document.getElementById('numberOfDays').value = '';
        document.getElementById('subtotal').value = '';
        document.getElementById('gstAmount').value = '';
        document.getElementById('totalAmount').value = '';
    }
}

// Get car hire form data
function getCarHireFormData() {
    const rentalDate = new Date(document.getElementById('rentalDate').value);
    const returnDate = new Date(document.getElementById('returnDate').value);
    const dailyRate = parseFloat(document.getElementById('dailyRate').value) || 0;

    let numberOfDays = 0;
    let subtotal = 0;
    let gstAmount = 0;
    let totalAmount = 0;

    if (rentalDate && returnDate && returnDate >= rentalDate) {
        const timeDiff = returnDate.getTime() - rentalDate.getTime();
        numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        subtotal = numberOfDays * dailyRate;
        gstAmount = subtotal * 0.18;
        totalAmount = subtotal + gstAmount;
    }

    // Return default data even when form is empty
    return {
        rentalCompany: document.getElementById('rentalCompany').value || 'PREMIUM CAR RENTALS',
        companyAddress: document.getElementById('companyAddress').value || '123 Rental Street, City, State',
        gstNumber: document.getElementById('gstNumber').value || 'GST123456789',
        contactNumber: document.getElementById('contactNumber').value || '+91 98765 43210',
        invoiceNumber: document.getElementById('invoiceNumber').value,
        vehicleNumber: document.getElementById('vehicleNumber').value || 'MH01AB1234',
        vehicleModel: document.getElementById('vehicleModel').value || 'Swift Dzire',
        vehicleType: document.getElementById('vehicleType').value || 'Sedan',
        rentalDate: document.getElementById('rentalDate').value || new Date().toISOString().split('T')[0],
        returnDate: document.getElementById('returnDate').value || new Date(Date.now() + 86400000).toISOString().split('T')[0],
        dailyRate: dailyRate || 1500.00,
        numberOfDays: numberOfDays || 1,
        subtotal: subtotal || 1500.00,
        gstAmount: gstAmount || 270.00,
        totalAmount: totalAmount || 1770.00,
        paymentMode: document.getElementById('paymentMode').value || 'Cash',
        customerName: document.getElementById('customerName').value || 'John Doe',
        customerAddress: document.getElementById('customerAddress').value || '456 Customer Street, City, State',
        driverName: document.getElementById('driverName').value || 'Self',
        licenseNumber: document.getElementById('licenseNumber').value || 'N/A'
    };
}

// Update car hire preview
function updateCarHirePreview() {
    const formData = getCarHireFormData();
    const previewHtml = generateCarHireBillPreview(formData);
    document.getElementById('billPreview').innerHTML = previewHtml;
}

// Generate car hire bill preview
function generateCarHireBillPreview(data) {
    return `
        <div class="bill-logo">
            <img src="logo.jpeg" alt="Car Rental Logo" onerror="this.style.display='none'" onload="this.style.display='block'">
        </div>
        <div class="bill-header">${data.rentalCompany.toUpperCase()}</div>
        <div class="bill-subheader">${data.companyAddress}</div>
        <div class="bill-separator"></div>
        <div class="bill-title">CAR HIRE INVOICE</div>
        
        <div class="bill-details-grid">
            <div class="bill-detail-left">
                <div class="bill-row">
                    <span class="bill-label">Invoice No:</span>
                    <span class="bill-value">${data.invoiceNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Vehicle No:</span>
                    <span class="bill-value">${data.vehicleNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Vehicle Model:</span>
                    <span class="bill-value">${data.vehicleModel}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Vehicle Type:</span>
                    <span class="bill-value">${data.vehicleType}</span>
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
                    <span class="bill-label">Rental Date:</span>
                    <span class="bill-value">${formatDate(data.rentalDate)}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Return Date:</span>
                    <span class="bill-value">${formatDate(data.returnDate)}</span>
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
                <span class="bill-label">Driver Name:</span>
                <span class="bill-value">${data.driverName}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">License No:</span>
                <span class="bill-value">${data.licenseNumber}</span>
            </div>
        </div>
        
        <div class="bill-section">
            <div class="bill-section-title">RENTAL DETAILS:</div>
            <div class="bill-table">
                <div class="bill-table-header">
                    <span class="bill-table-col">Item</span>
                    <span class="bill-table-col">Rate/Day</span>
                    <span class="bill-table-col">Days</span>
                    <span class="bill-table-col">Amount</span>
                </div>
                <div class="bill-table-row">
                    <span class="bill-table-col">${data.vehicleType} Rental</span>
                    <span class="bill-table-col">₹${data.dailyRate.toFixed(2)}</span>
                    <span class="bill-table-col">${data.numberOfDays}</span>
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
            <p>Safe driving! Return vehicle in good condition</p>
        </div>
        
        <div class="bill-bottom">
            <span class="bill-bottom-left">Generated: ${new Date().toLocaleString('en-IN')}</span>
            <span class="bill-bottom-right">Payment Mode: ${data.paymentMode}</span>
        </div>
    `;
}

// Download car hire preview PDF
async function downloadCarHirePreviewPDF() {
    const formData = getCarHireFormData();
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

                    // Center the logo above the rental company name
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

    // Rental company header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(formData.rentalCompany.toUpperCase(), pageWidth/2, 60, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.companyAddress, pageWidth/2, 70, { align: 'center' });

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
    doc.text('CAR HIRE INVOICE', pageWidth/2, yPos, { align: 'center' });
    yPos += 15;

    // Invoice details in two columns
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Left column
    doc.text(`Invoice No: ${formData.invoiceNumber}`, leftMargin, yPos);
    doc.text(`Vehicle No: ${formData.vehicleNumber}`, leftMargin, yPos + 8);
    doc.text(`Vehicle Model: ${formData.vehicleModel}`, leftMargin, yPos + 16);
    doc.text(`Vehicle Type: ${formData.vehicleType}`, leftMargin, yPos + 24);

    // Right column
    doc.text(`GST No: ${formData.gstNumber}`, rightMargin - 60, yPos, { align: 'right' });
    doc.text(`Contact: ${formData.contactNumber}`, rightMargin - 60, yPos + 8, { align: 'right' });
    doc.text(`Rental Date: ${formatDate(formData.rentalDate)}`, rightMargin - 60, yPos + 16, { align: 'right' });
    doc.text(`Return Date: ${formatDate(formData.returnDate)}`, rightMargin - 60, yPos + 24, { align: 'right' });

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
    doc.text(`Driver Name: ${formData.driverName}`, leftMargin, yPos + 16);
    doc.text(`License No: ${formData.licenseNumber}`, leftMargin, yPos + 24);

    yPos += 30;

    // Rental details in a table format
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('RENTAL DETAILS:', leftMargin, yPos);
    yPos += 8;

    // Add a table-like structure
    const tableY = yPos;
    const col1 = leftMargin;
    const col2 = leftMargin + 80;
    const col3 = leftMargin + 120; // Added for Days
    const col4 = rightMargin - 40; // Added for Amount

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', col1, tableY);
    doc.text('Rate/Day', col2, tableY);
    doc.text('Days', col3, tableY);
    doc.text('Amount', col4, tableY, { align: 'right' });

    yPos += 8;
    doc.setLineWidth(0.2);
    doc.line(leftMargin, yPos - 2, rightMargin, yPos - 2);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.vehicleType} Rental`, col1, yPos);
    doc.text(`₹${formData.dailyRate.toFixed(2)}`, col2, yPos);
    doc.text(`${formData.numberOfDays}`, col3, yPos);
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
    doc.text('Safe driving! Return vehicle in good condition', pageWidth/2, yPos + 12, { align: 'center' });

    // Add generation info at bottom
    yPos += 25;
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, leftMargin, yPos);
    doc.text(`Payment Mode: ${formData.paymentMode}`, rightMargin, yPos, { align: 'right' });

    // Save the PDF
    doc.save(`car-hire-invoice-${formData.invoiceNumber}.pdf`);
    showMessage('Car hire invoice downloaded successfully!', 'success');
}

// Clear car hire form
function clearCarHireForm() {
    document.getElementById('carHireForm').reset();
    document.getElementById('rentalDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('returnDate').value = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    document.getElementById('vehicleType').value = 'Sedan';
    document.getElementById('paymentMode').value = 'Cash';
    document.getElementById('driverName').value = 'Self';
    document.getElementById('licenseNumber').value = 'N/A';
    document.getElementById('numberOfDays').value = '';
    document.getElementById('subtotal').value = '';
    document.getElementById('gstAmount').value = '';
    document.getElementById('totalAmount').value = '';

    // Generate new random invoice number
    generateRandomInvoiceNumber();

    // Show preview with default values
    updateCarHirePreview();
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
window.clearCarHireForm = clearCarHireForm;
window.downloadCarHirePreviewPDF = downloadCarHirePreviewPDF; 