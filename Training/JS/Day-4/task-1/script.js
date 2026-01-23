$(document).ready(function() {
    // ExcelJS Workbook
    let workbook = new ExcelJS.Workbook();
    let worksheet = null;
    let rowCounter = 0;
    let userInteracted = {};

    // Initialize ExcelJS worksheet
    function initializeWorksheet() {
        worksheet = workbook.addWorksheet('TimeLog Data');
        
        // Define columns
        worksheet.columns = [
            { header: 'Row Index', key: 'rowIndex', width: 10 },
            { header: 'Project Name', key: 'projectName', width: 20 },
            { header: 'TimeLog Date', key: 'timelogDate', width: 15 },
            { header: 'Phase', key: 'phase', width: 15 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Logged Hours', key: 'loggedHours', width: 15 },
            { header: 'Billable Hours', key: 'billableHours', width: 15 },
            { header: 'Notes', key: 'notes', width: 30 },
            { header: 'Out of Stock', key: 'outOfStock', width: 15 },
            { header: 'BC Link', key: 'bcLink', width: 30 },
            { header: 'BC Description', key: 'bcDescription', width: 30 }
        ];

        // Add first row
        addRowToWorksheet(1);
        syncWorksheetToDOM();
    }

    // Add row to ExcelJS worksheet
    function addRowToWorksheet(rowIndex) {
        worksheet.addRow({
            rowIndex: rowIndex,
            projectName: '',
            timelogDate: '',
            phase: '',
            status: '',
            loggedHours: '',
            billableHours: '',
            notes: '',
            outOfStock: false,
            bcLink: '',
            bcDescription: ''
        });
        rowCounter = Math.max(rowCounter, rowIndex);
    }

    // Sync worksheet data to DOM
    function syncWorksheetToDOM() {
        $('#inputTableBody').empty();
        
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header
            
            const rowData = {
                rowIndex: row.getCell(1).value,
                projectName: row.getCell(2).value || '',
                timelogDate: row.getCell(3).value || '',
                phase: row.getCell(4).value || '',
                status: row.getCell(5).value || '',
                loggedHours: row.getCell(6).value || '',
                billableHours: row.getCell(7).value || '',
                notes: row.getCell(8).value || '',
                outOfStock: row.getCell(9).value || false,
                bcLink: row.getCell(10).value || '',
                bcDescription: row.getCell(11).value || ''
            };
            
            const htmlRow = createHTMLRow(rowData);
            $('#inputTableBody').append(htmlRow);
        });
    }

    // Create HTML row
    function createHTMLRow(data) {
        const idx = data.rowIndex;
        return `
            <tr data-row-index="${idx}">
                <td class="index-col">${idx}</td>
                <td>
                    <select id="projectName_${idx}" class="required">
                        <option value="">Select Project</option>
                        <option value="JAVA Script Project" ${data.projectName === 'JAVA Script Project' ? 'selected' : ''}>JAVA Script Project</option>
                        <option value="Python Project" ${data.projectName === 'Python Project' ? 'selected' : ''}>Python Project</option>
                        <option value="React Project" ${data.projectName === 'React Project' ? 'selected' : ''}>React Project</option>
                        <option value="Node.js Project" ${data.projectName === 'Node.js Project' ? 'selected' : ''}>Node.js Project</option>
                    </select>
                    <div class="error-message">Project name is required</div>
                </td>
                <td>
                    <input type="date" id="timelogDate_${idx}" class="required" value="${data.timelogDate}">
                    <div class="error-message">Date is required</div>
                </td>
                <td>
                    <select id="phase_${idx}" class="required">
                        <option value="">Select Phase</option>
                        <option value="Communication" ${data.phase === 'Communication' ? 'selected' : ''}>Communication</option>
                        <option value="Planning" ${data.phase === 'Planning' ? 'selected' : ''}>Planning</option>
                        <option value="Development" ${data.phase === 'Development' ? 'selected' : ''}>Development</option>
                        <option value="Testing" ${data.phase === 'Testing' ? 'selected' : ''}>Testing</option>
                        <option value="Deployment" ${data.phase === 'Deployment' ? 'selected' : ''}>Deployment</option>
                    </select>
                    <div class="error-message">Phase is required</div>
                </td>
                <td>
                    <select id="status_${idx}" class="required">
                        <option value="">Select Status</option>
                        <option value="Pending" ${data.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="In Progress" ${data.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Completed" ${data.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="On Hold" ${data.status === 'On Hold' ? 'selected' : ''}>On Hold</option>
                    </select>
                    <div class="error-message">Status is required</div>
                </td>
                <td>
                    <input type="text" id="loggedHours_${idx}" placeholder="HH:MM" class="required time-input" value="${data.loggedHours}">
                    <div class="error-message">Valid time format required (HH:MM)</div>
                </td>
                <td>
                    <input type="text" id="billableHours_${idx}" placeholder="HH:MM" class="required time-input" value="${data.billableHours}">
                    <div class="error-message">Valid time format required (HH:MM)</div>
                </td>
                <td>
                    <input type="text" id="notes_${idx}" class="required" value="${data.notes}">
                    <div class="error-message">Notes are required</div>
                </td>
                <td class="checkbox-cell">
                    <input type="checkbox" id="outOfStock_${idx}" ${data.outOfStock ? 'checked' : ''}>
                </td>
                <td>
                    <input type="text" id="bcLink_${idx}" class="required" value="${data.bcLink}">
                    <div class="error-message">BC Link is required</div>
                </td>
                <td>
                    <input type="text" id="bcDescription_${idx}" class="required" value="${data.bcDescription}">
                    <div class="error-message">BC Description is required</div>
                </td>
            </tr>
        `;
    }

    // Update worksheet from DOM
    function updateWorksheetFromDOM(rowIndex) {
        const excelRowNumber = rowIndex + 1; // +1 for header row
        const row = worksheet.getRow(excelRowNumber);
        
        row.getCell(1).value = rowIndex;
        row.getCell(2).value = $('#projectName_' + rowIndex).val();
        row.getCell(3).value = $('#timelogDate_' + rowIndex).val();
        row.getCell(4).value = $('#phase_' + rowIndex).val();
        row.getCell(5).value = $('#status_' + rowIndex).val();
        row.getCell(6).value = $('#loggedHours_' + rowIndex).val();
        row.getCell(7).value = $('#billableHours_' + rowIndex).val();
        row.getCell(8).value = $('#notes_' + rowIndex).val();
        row.getCell(9).value = $('#outOfStock_' + rowIndex).is(':checked');
        row.getCell(10).value = $('#bcLink_' + rowIndex).val();
        row.getCell(11).value = $('#bcDescription_' + rowIndex).val();
        
        row.commit();
    }

    // Time format validation
    function isValidTimeFormat(time) {
        const timeRegex = /^([0-9]{1,2}):([0-5][0-9])$/;
        return timeRegex.test(time);
    }

    // Convert time to minutes
    function timeToMinutes(time) {
        const parts = time.split(':');
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }

    // Time input formatting
    $('body').on('blur', '.time-input', function() {
        let val = $(this).val().trim();
        if (val && !val.includes(':')) {
            if (val.length <= 2) {
                $(this).val(val + ':00');
            }
        }
    });

    // Billable hours validation
    $('body').on('blur', '[id^="billableHours_"]', function() {
        const rowIndex = $(this).attr('id').split('_')[1];
        const loggedHours = $('#loggedHours_' + rowIndex).val();
        const billableHours = $(this).val();

        if (loggedHours && billableHours && isValidTimeFormat(loggedHours) && isValidTimeFormat(billableHours)) {
            const loggedMinutes = timeToMinutes(loggedHours);
            const billableMinutes = timeToMinutes(billableHours);

            if (billableMinutes > loggedMinutes) {
                $(this).val(loggedHours);
                alert('Billable hours cannot exceed logged hours. Setting billable hours equal to logged hours.');
            }
        }
    });

    // Validate single row
    function validateRow(rowIndex) {
        let isValid = true;
        const errors = [];
        const rowData = {};

        const projectName = $('#projectName_' + rowIndex).val();
        if (!projectName) {
            if (userInteracted['projectName_' + rowIndex]) {
                $('#projectName_' + rowIndex).addClass('error').next('.error-message').show();
                errors.push('Project Name is required');
            }
            isValid = false;
        } else {
            $('#projectName_' + rowIndex).removeClass('error').next('.error-message').hide();
            rowData.projectName = projectName;
        }

        const timelogDate = $('#timelogDate_' + rowIndex).val();
        if (!timelogDate) {
            if (userInteracted['timelogDate_' + rowIndex]) {
                $('#timelogDate_' + rowIndex).addClass('error').next('.error-message').show();
                errors.push('TimeLog Date is required');
            }
            isValid = false;
        } else {
            $('#timelogDate_' + rowIndex).removeClass('error').next('.error-message').hide();
            rowData.timelogDate = timelogDate;
        }

        const phase = $('#phase_' + rowIndex).val();
        if (!phase) {
            if (userInteracted['phase_' + rowIndex]) {
                $('#phase_' + rowIndex).addClass('error').next('.error-message').show();
                errors.push('Phase is required');
            }
            isValid = false;
        } else {
            $('#phase_' + rowIndex).removeClass('error').next('.error-message').hide();
            rowData.phase = phase;
        }

        const status = $('#status_' + rowIndex).val();
        if (!status) {
            if (userInteracted['status_' + rowIndex]) {
                $('#status_' + rowIndex).addClass('error').next('.error-message').show();
                errors.push('Status is required');
            }
            isValid = false;
        } else {
            $('#status_' + rowIndex).removeClass('error').next('.error-message').hide();
            rowData.status = status;
        }

        const loggedHours = $('#loggedHours_' + rowIndex).val();
        if (!loggedHours || !isValidTimeFormat(loggedHours)) {
            if (userInteracted['loggedHours_' + rowIndex]) {
                $('#loggedHours_' + rowIndex).addClass('error').next('.error-message').show();
                errors.push('Valid Logged Hours format required (HH:MM)');
            }
            isValid = false;
        } else {
            $('#loggedHours_' + rowIndex).removeClass('error').next('.error-message').hide();
            rowData.loggedHours = loggedHours;
        }

        const billableHours = $('#billableHours_' + rowIndex).val();
        if (!billableHours || !isValidTimeFormat(billableHours)) {
            if (userInteracted['billableHours_' + rowIndex]) {
                $('#billableHours_' + rowIndex).addClass('error').next('.error-message').show();
                errors.push('Valid Billable Hours format required (HH:MM)');
            }
            isValid = false;
        } else {
            if (loggedHours && isValidTimeFormat(loggedHours)) {
                const loggedMinutes = timeToMinutes(loggedHours);
                const billableMinutes = timeToMinutes(billableHours);
                
                if (billableMinutes > loggedMinutes) {
                    $('#billableHours_' + rowIndex).val(loggedHours);
                    rowData.billableHours = loggedHours;
                } else {
                    rowData.billableHours = billableHours;
                }
            } else {
                rowData.billableHours = billableHours;
            }
            $('#billableHours_' + rowIndex).removeClass('error').next('.error-message').hide();
        }

        const notes = $('#notes_' + rowIndex).val().trim();
        if (!notes) {
            if (userInteracted['notes_' + rowIndex]) {
                $('#notes_' + rowIndex).addClass('error').next('.error-message').show();
                errors.push('Notes are required');
            }
            isValid = false;
        } else {
            $('#notes_' + rowIndex).removeClass('error').next('.error-message').hide();
            rowData.notes = notes;
        }

        const outOfStock = $('#outOfStock_' + rowIndex).is(':checked');
        rowData.outOfStock = outOfStock;

        const bcLink = $('#bcLink_' + rowIndex).val().trim();
        if (!bcLink) {
            if (userInteracted['bcLink_' + rowIndex]) {
                $('#bcLink_' + rowIndex).addClass('error').next('.error-message').show();
                errors.push('BC Link is required');
            }
            isValid = false;
        } else {
            $('#bcLink_' + rowIndex).removeClass('error').next('.error-message').hide();
            rowData.bcLink = bcLink;
        }

        const bcDescription = $('#bcDescription_' + rowIndex).val().trim();
        if (!bcDescription) {
            if (userInteracted['bcDescription_' + rowIndex]) {
                $('#bcDescription_' + rowIndex).addClass('error').next('.error-message').show();
                errors.push('BC Description is required');
            }
            isValid = false;
        } else {
            $('#bcDescription_' + rowIndex).removeClass('error').next('.error-message').hide();
            rowData.bcDescription = bcDescription;
        }

        return { isValid, rowData, errors };
    }

    // Validate all rows and get valid data
    function getValidatedRecords() {
        const validRecords = [];
        
        $('#inputTableBody tr').each(function() {
            const rowIndex = $(this).data('row-index');
            const result = validateRow(rowIndex);
            
            if (result.isValid) {
                validRecords.push(result.rowData);
            }
        });
        
        return validRecords;
    }

    // Update display table
    function updateDisplayTable() {
        const records = getValidatedRecords();
        
        if (records.length > 0) {
            renderDisplayTable(records);
            $('#displayTableContainer').slideDown();
        } else {
            $('#displayTableContainer').slideUp();
        }
    }

    // Render display table
    function renderDisplayTable(records) {
        $('#displayTableBody').empty();
        
        records.forEach((record, index) => {
            const row = `
                <tr>
                    <td class="index-col">${index + 1}</td>
                    <td>${record.projectName}</td>
                    <td>${formatDateTime(record.timelogDate)}</td>
                    <td>${record.phase}</td>
                    <td>${record.status}</td>
                    <td>${record.loggedHours}</td>
                    <td>${record.billableHours}</td>
                    <td>${record.notes}</td>
                    <td class="checkbox-cell">${record.outOfStock ? 'true' : 'false'}</td>
                    <td>${record.bcLink}</td>
                    <td>${record.bcDescription}</td>
                </tr>
            `;
            $('#displayTableBody').append(row);
        });
    }

    // Format date time
    function formatDateTime(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day} 00:00:00`;
    }

    // Add new rows
    $('#addRowBtn').on('click', function() {
        const count = parseInt($('#addRowCount').val()) || 1;
        
        if (count < 1) {
            alert('Please enter a valid number of rows to add');
            return;
        }

        for (let i = 0; i < count; i++) {
            rowCounter++;
            addRowToWorksheet(rowCounter);
        }
        
        syncWorksheetToDOM();
    });

    // Delete last row
    $('#deleteLastRow').on('click', function() {
        const rows = $('#inputTableBody tr');
        
        if (rows.length > 1) {
            // Only delete if there's more than one row
            const lastRow = rows.last();
            lastRow.remove();
            
            // Update rowCounter to the highest index in remaining rows
            let maxIndex = 0;
            $('#inputTableBody tr').each(function() {
                const idx = $(this).data('row-index');
                if (idx > maxIndex) {
                    maxIndex = idx;
                }
            });
            rowCounter = maxIndex;
        } else if (rows.length === 1) {
            // If only one row exists, just clear its values but keep the row
            const rowIndex = rows.first().data('row-index');
            $('#projectName_' + rowIndex).val('');
            $('#timelogDate_' + rowIndex).val('');
            $('#phase_' + rowIndex).val('');
            $('#status_' + rowIndex).val('');
            $('#loggedHours_' + rowIndex).val('');
            $('#billableHours_' + rowIndex).val('');
            $('#notes_' + rowIndex).val('');
            $('#outOfStock_' + rowIndex).prop('checked', false);
            $('#bcLink_' + rowIndex).val('');
            $('#bcDescription_' + rowIndex).val('');
            
            // Clear any error states
            $('#inputTableBody .required').removeClass('error');
            $('#inputTableBody .error-message').hide();
        }
    });

    // Track user interaction
    $('body').on('focus', '.required, input[type="checkbox"]', function() {
        const fieldId = $(this).attr('id');
        userInteracted[fieldId] = true;
    });

    // Real-time validation on change
    $('body').on('change blur', '.required', function() {
        const rowIndex = $(this).closest('tr').data('row-index');
        updateWorksheetFromDOM(rowIndex);
        validateRow(rowIndex);
        updateDisplayTable();
    });

    // Handle checkbox changes
    $('body').on('change', 'input[type="checkbox"]', function() {
        const rowIndex = $(this).closest('tr').data('row-index');
        updateWorksheetFromDOM(rowIndex);
        updateDisplayTable();
    });

    // Initialize on page load
    initializeWorksheet();
});

