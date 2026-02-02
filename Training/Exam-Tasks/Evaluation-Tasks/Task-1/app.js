/**
 * Account Mapping Application with ExcelJS
 * Enhanced with comprehensive error handling and improved features
 */

// ============================================================================
// CUSTOM ERROR CLASSES
// ============================================================================

class AppError extends Error {
    constructor(message, code, metadata = {}) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.metadata = metadata;
        this.timestamp = new Date().toISOString();
    }
}

class FileLoadError extends AppError {
    constructor(fileName, originalError) {
        super(
            `Failed to load ${fileName}`,
            'FILE_LOAD_ERROR',
            { fileName, originalError: originalError?.message || String(originalError) }
        );
    }
}

class DragDropError extends AppError {
    constructor(operation, details) {
        super(
            `Drag & drop operation failed: ${operation}`,
            'DRAG_DROP_ERROR',
            details
        );
    }
}

class StorageError extends AppError {
    constructor(message, details = {}) {
        super(message, 'STORAGE_ERROR', details);
    }
}

class ValidationError extends AppError {
    constructor(field, value, reason) {
        super(
            `Validation failed for ${field}`,
            'VALIDATION_ERROR',
            { field, value, reason }
        );
    }
}

// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================

class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.maxLogSize = 100;
        this.setupGlobalHandlers();
    }
    
    setupGlobalHandlers() {
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event.error, event);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.handleGlobalError(event.reason, event);
        });
    }
    
    handleGlobalError(error, event) {
        console.error('[Global Error]', error);
        this.logError(error);
        
        if (this.isCritical(error)) {
            this.showCriticalError(error);
        }
        
        if (this.shouldPreventDefault(error)) {
            event?.preventDefault();
        }
    }
    
    logError(error) {
        const entry = {
            timestamp: new Date().toISOString(),
            message: error?.message || String(error),
            stack: error?.stack,
            code: error?.code,
            metadata: error?.metadata
        };
        
        this.errorLog.push(entry);
        
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog.shift();
        }
    }
    
    isCritical(error) {
        const criticalCodes = ['FILE_LOAD_ERROR', 'STORAGE_ERROR'];
        return error?.code && criticalCodes.includes(error.code);
    }
    
    shouldPreventDefault(error) {
        return error instanceof AppError;
    }
    
    showCriticalError(error) {
        const message = this.getUserFriendlyMessage(error);
        showErrorModal(message, error);
    }
    
    getUserFriendlyMessage(error) {
        const messages = {
            'FILE_LOAD_ERROR': 'Unable to load required data files. Please refresh the page.',
            'STORAGE_ERROR': 'Unable to save your changes. Your browser storage may be full.',
            'DRAG_DROP_ERROR': 'An error occurred during drag and drop. Please try again.',
            'VALIDATION_ERROR': 'Invalid data detected. Please check your inputs.'
        };
        
        return messages[error?.code] || 'An unexpected error occurred. Please refresh the page.';
    }
}

const errorHandler = new ErrorHandler();

// ============================================================================
// STORAGE MANAGER
// ============================================================================

class StorageManager {
    constructor() {
        this.storageAvailable = this.checkStorageAvailability();
        this.maxRetries = 3;
    }
    
    checkStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('[Storage] localStorage unavailable:', e);
            return false;
        }
    }
    
    saveMapping(type, data) {
        if (!this.storageAvailable) {
            return this.fallbackSave(type, data);
        }
        
        const storageKey = `account_mapping::${type}`;
        let attempts = 0;
        
        while (attempts < this.maxRetries) {
            try {
                const serialized = JSON.stringify(data);
                
                if (serialized.length > 5000000) {
                    throw new StorageError('Data too large for storage');
                }
                
                localStorage.setItem(storageKey, serialized);
                return { success: true };
                
            } catch (e) {
                attempts++;
                
                if (e.name === 'QuotaExceededError') {
                    this.cleanOldData();
                    
                    if (attempts === this.maxRetries) {
                        return this.fallbackSave(type, data);
                    }
                } else {
                    console.error('[Storage Error]', e);
                    throw new StorageError(e.message);
                }
            }
        }
    }
    
    loadMapping(type) {
        const storageKey = `account_mapping::${type}`;
        
        try {
            const data = localStorage.getItem(storageKey);
            
            if (!data) {
                return null;
            }
            
            const parsed = JSON.parse(data);
            
            if (!this.validateMapping(parsed)) {
                throw new ValidationError('mapping', parsed, 'Invalid structure');
            }
            
            return parsed;
            
        } catch (e) {
            console.error('[Load Error]', e);
            
            if (e.name === 'SyntaxError') {
                this.handleCorruptedData(storageKey);
            }
            
            return null;
        }
    }
    
    validateMapping(data) {
        return data 
            && typeof data === 'object'
            && data.type
            && data.rows
            && typeof data.rows === 'object';
    }
    
    cleanOldData() {
        const keys = Object.keys(localStorage);
        const now = Date.now();
        
        keys.forEach(key => {
            if (key.startsWith('account_mapping::')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    const age = now - new Date(data.updatedAt).getTime();
                    
                    if (age > 30 * 24 * 60 * 60 * 1000) {
                        localStorage.removeItem(key);
                    }
                } catch (e) {
                    localStorage.removeItem(key);
                }
            }
        });
    }
    
    handleCorruptedData(key) {
        console.warn('[Storage] Corrupted data detected, removing:', key);
        localStorage.removeItem(key);
    }
    
    fallbackSave(type, data) {
        showToast('Storage full. Please clear browser data or export your work.', 'warning');
        return { success: false, method: 'none' };
    }
}

const storageManager = new StorageManager();

// single combined scrollable panel
// ============================================================================
// FILTER MANAGER
// ============================================================================

class FilterManager {
    constructor() {
        this.activeFilters = {
            global: '',
            local: '',
            search: ''
        };
        this.searchTimeout = null;
        // Master types from Master Chart - these are the only types shown in filters
        this.masterTypes = ['Assets', 'Liabilities', 'Equity', 'Revenue', 'COGS', 'Expense', 'Other Revenue & Expense'];
    }

    /**
     * Map destination AccountTypeName to master type categories
     * "Others" are grouped by SubAccountName (destGroup parameter)
     */
    mapDestToMasterType(destType, destGroup = '') {
        if (!destType) return 'Other Revenue & Expense';

        const upperType = destType.toUpperCase().trim();
        const upperGroup = destGroup ? destGroup.toUpperCase().trim() : '';

        // CRITICAL: Check for "Other" patterns FIRST - these go to "Other Revenue & Expense"
        // This catches "Other Assets", "Other Revenue", "Other Expenses", etc.
        // Also checks the SubAccountName (group) field for "Other" patterns
        if (upperType.startsWith('OTHER ') || upperGroup.startsWith('OTHER ')) {
            return 'Other Revenue & Expense';
        }

        // Check if type or group contains "Other" keyword
        if ((upperType.includes(' OTHER') || upperType === 'OTHER') ||
            (upperGroup.includes(' OTHER') || upperGroup === 'OTHER')) {
            return 'Other Revenue & Expense';
        }

        // Direct exact matches (case-insensitive)
        if (upperType === 'ASSETS' || upperType === 'ASSET') return 'Assets';
        if (upperType === 'LIABILITIES' || upperType === 'LIABILITY') return 'Liabilities';
        if (upperType === 'EQUITY') return 'Equity';
        if (upperType === 'REVENUE') return 'Revenue';
        if (upperType === 'COGS') return 'COGS';
        if (upperType === 'EXPENSE' || upperType === 'EXPENSES') return 'Expense';

        // Asset mappings (excluding "Other" prefixed which are handled above)
        if (upperType.includes('ASSET')) return 'Assets';
        if (upperType.includes('CASH') && !upperType.includes('FLOW')) return 'Assets';
        if (upperType.includes('RECEIVABLE')) return 'Assets';
        if (upperType.includes('PREPAID')) return 'Assets';
        if (upperType.includes('INVENTORY')) return 'Assets';
        if (upperType.includes('FIXED') || upperType.includes('PROPERTY') || upperType.includes('EQUIPMENT')) return 'Assets';

        // Liability mappings
        if (upperType.includes('LIABIL')) return 'Liabilities';
        if (upperType.includes('PAYABLE')) return 'Liabilities';
        if (upperType.includes('ACCRUED')) return 'Liabilities';
        if (upperType.includes('DEBT') || upperType.includes('LOAN')) return 'Liabilities';

        // Equity mappings
        if (upperType.includes('EQUITY')) return 'Equity';
        if (upperType.includes('CAPITAL')) return 'Equity';
        if (upperType.includes('RETAINED EARNINGS')) return 'Equity';
        if (upperType.includes('SHARE')) return 'Equity';

        // Revenue mappings (excluding "Other Revenue" which is handled above)
        if (upperType.includes('REVENUE')) return 'Revenue';
        if (upperType.includes('SALES')) return 'Revenue';
        if (upperType.includes('INCOME') && !upperType.includes('OPERATING')) return 'Revenue';

        // COGS mappings
        if (upperType.includes('COST') && (upperType.includes('GOODS') || upperType.includes('PRODUCT') || upperType.includes('SALE'))) return 'COGS';
        if (upperType === 'COST OF GOODS SOLD') return 'COGS';

        // Expense mappings (excluding "Other Expense" which is handled above)
        if (upperType.includes('EXPENSE')) return 'Expense';
        if (upperType.includes('OPERATING')) return 'Expense';
        if (upperType.includes('G&A') || upperType.includes('GENERAL') || upperType.includes('ADMINISTRATIVE')) return 'Expense';
        if (upperType.includes('LABOR')) return 'Expense';
        if (upperType.includes('PROFESSIONAL')) return 'Expense';
        if (upperType.includes('OFFICE')) return 'Expense';
        if (upperType.includes('RENT')) return 'Expense';
        if (upperType.includes('UTILITIES')) return 'Expense';
        if (upperType.includes('DEPRECIATION') || upperType.includes('AMORTIZATION')) return 'Expense';

        return 'Other Revenue & Expense';
    }

    getTypeMapping() {
        // Get unique master types that exist in destination data
        const availableMasterTypes = new Set();

        allDestinationData.forEach(item => {
            const masterType = this.mapDestToMasterType(item.type, item.group);
            if (this.masterTypes.includes(masterType)) {
                availableMasterTypes.add(masterType);
            }
        });

        return Array.from(availableMasterTypes).sort();
    }

    updateDestinationFilters(globalType) {
        try {
            const availableMasterTypes = this.getTypeMapping();
            const $filterContainer = $('.dest-filter-nav .d-flex').first();
            $filterContainer.find('.dest-filter').remove();

            // Always add "All" filter
            $filterContainer.append(`
                <button class="btn btn-sm dest-filter" data-filter="">
                    All
                </button>
            `);

            // Define standard types to show in order (excluding "Other Revenue & Expense" from this list)
            const standardTypes = ['Assets', 'Liabilities', 'Equity', 'Revenue', 'COGS', 'Expense'];

            // Add standard type filters if they exist in destination data
            standardTypes.forEach(type => {
                if (availableMasterTypes.includes(type)) {
                    const isActive = type === globalType ? 'active' : '';
                    $filterContainer.append(`
                        <button class="btn btn-sm dest-filter ${isActive}" data-filter="${type}">
                            ${type}
                        </button>
                    `);
                }
            });

            // Add "Other" filter at the end (shows items in "Other Revenue & Expense" category)
            const isOtherActive = globalType === 'Other Revenue & Expense' ? 'active' : '';
            $filterContainer.append(`
                <button class="btn btn-sm dest-filter ${isOtherActive}" data-filter="Other">
                    Other
                </button>
            `);

            // CRITICAL: Set local filter based on global type
            // If global type is "Other Revenue & Expense", set local filter to "Other"
            // Otherwise set to matching type or empty (All)
            if (globalType === 'Other Revenue & Expense') {
                this.activeFilters.local = 'Other';
                localDestFilter = 'Other';
            } else if (standardTypes.includes(globalType)) {
                this.activeFilters.local = globalType;
                localDestFilter = globalType;
            } else {
                this.activeFilters.local = '';
                localDestFilter = '';
            }

        } catch (error) {
            console.error('[Filter Update Error]', error);
        }
    }

    safeSearch(term) {
        clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(() => {
            try {
                const sanitized = term.toLowerCase().trim();

                if (sanitized.length > 100) {
                    showToast('Search term too long', 'warning');
                    return;
                }

                this.activeFilters.search = sanitized;
                filterDestinationList();

            } catch (error) {
                console.error('[Search Error]', error);
                showToast('Search failed', 'error');
            }
        }, 300);
    }
}

const filterManager = new FilterManager();

// ============================================================================
// GLOBAL STATE
// ============================================================================

let masterData = {};  // object organized by master type ({ typeName: [{ heading, rows: [{id, number, name}] }] }).
let destinationData = [];  // array of all destination accounts read from the destination excel (full set).
let allDestinationData = [];  // filtered array derived from allDestinationData for the active currentType
let currentType = 'Assets';  // string (one of master types). Initially first key in masterData.
let localDestFilter = '';  // local filter value for the destination list (syncs with filterManager.activeFilters.local).
let searchTerm = '';  // lowercase search string used to filter dest items.
let undoStack = [];  // array of previous states for undo functionality.

// File paths
const MASTER_FILE = 'Master_Chart_of_account.xlsx';
const DESTINATION_FILE = 'destination_chart_of_account.xlsx';

// ============================================================================
// UTILITY HELPER FUNCTIONS - Reduces code redundancy
// ============================================================================

/**
 * Find a row by index with automatic fallback
 * Tries combined-row first (new structure), then mapping-row (old structure)
 * @param {number|string} rowIndex - The row index to find
 * @returns {jQuery} The row element or empty jQuery object
 */
function findRowByIndex(rowIndex) {
    return $(`.combined-row[data-row-index="${rowIndex}"]`).length > 0
        ? $(`.combined-row[data-row-index="${rowIndex}"]`)
        : $(`.mapping-row[data-row-index="${rowIndex}"]`);
}

/**
 * Find a row by row ID with automatic fallback
 * @param {string} rowId - The row ID to find
 * @returns {jQuery} The row element or empty jQuery object
 */
function findRowById(rowId) {
    return $(`.combined-row[data-row-id="${rowId}"]`).length > 0
        ? $(`.combined-row[data-row-id="${rowId}"]`)
        : $(`.mapping-row[data-row-id="${rowId}"]`);
}

/**
 * Get all three mapping cells from a row
 * @param {jQuery|HTMLElement} $row - The row element
 * @returns {object} Object with most, likely, possible cells
 */
function getCellsFromRow($row) {
    $row = $($row);
    return {
        most: $row.find('.cell-most'),
        likely: $row.find('.cell-likely'),
        possible: $row.find('.cell-possible')
    };
}

/**
 * Extract item data from a jQuery element
 * @param {jQuery|HTMLElement} $item - The item element
 * @returns {object} Item data object with id, number, name, type
 */
function extractItemData($item) {
    $item = $($item);
    return {
        id: $item.data('id'),
        number: $item.data('number'),
        name: $item.data('name'),
        type: $item.data('type')
    };
}

/**
 * Show a SweetAlert notification with preset configurations
 * @param {string} type - Alert type: 'success', 'error', 'warning', 'info', 'confirm', 'delete'
 * @param {object} options - Additional options to override defaults
 * @returns {Promise} SweetAlert result promise
 */
function showAlert(type, options = {}) {
    const presets = {
        success: {
            icon: 'success',
            confirmButtonColor: '#198754',
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true
        },
        error: {
            icon: 'error',
            confirmButtonColor: '#dc3545',
            title: 'Error'
        },
        warning: {
            icon: 'warning',
            confirmButtonColor: '#f59e0b'
        },
        info: {
            icon: 'info',
            confirmButtonColor: '#17a2b8'
        },
        confirm: {
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        },
        delete: {
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel'
        },
        save: {
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, Save',
            cancelButtonText: 'Cancel'
        }
    };

    const config = { ...presets[type], ...options };
    return Swal.fire(config);
}

/**
 * Check if any cell in a row has mapped items
 * @param {jQuery|HTMLElement} $row - The row element
 * @returns {boolean} True if any cell has content
 */
function rowHasMappings($row) {
    const cells = getCellsFromRow($row);
    return cells.most[0]?.children.length > 0 ||
           cells.likely[0]?.children.length > 0 ||
           cells.possible[0]?.children.length > 0;
}

/**
 * Execute function with error handling and notification
 * @param {Function} fn - Function to execute
 * @param {string} context - Context description for error messages
 * @param {string} errorMessage - Custom error message (optional)
 * @returns {boolean} True if successful, false otherwise
 */
function tryOrNotify(fn, context, errorMessage = null) {
    try {
        fn();
        return true;
    } catch (error) {
        console.error(`[${context}]`, error);
        const msg = errorMessage || `An error occurred in ${context.toLowerCase()}.`;
        showToast(msg, 'error');
        return false;
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

$(document).ready(function() {
    console.log('Initializing Account Mapping Application with ExcelJS...');

    // Authentication Guard - Check if user is logged in
    if (typeof auth !== 'undefined' && !auth.isAuthenticated) {
        console.warn('User not authenticated, redirecting to login...');
        // Immediate redirect to login page
        if (typeof auth !== 'undefined') {
            auth.redirectToLogin();
        } else {
            window.location.href = 'login.html';
        }
        return;
    }

    // Set user display name (both button and dropdown)
    if (typeof auth !== 'undefined' && auth.getDisplayUsername) {
        const username = auth.getDisplayUsername();
        $('#displayUsername').text(username);
        $('#dropdownUsername').text(username);
    }

    loadExcelData();
    initializeEventHandlers();
});

/**
 * Load data from Excel files using ExcelJS
 */
async function loadExcelData() {
    showLoading(true);
    
    try {
        await Promise.all([
            loadMasterChart(),
            loadDestinationChart()
        ]);
        
        console.log('Excel data loaded successfully');
        console.log('Master types:', Object.keys(masterData));
        console.log('Destination accounts:', allDestinationData.length);
        
        // Set initial type
        const availableTypes = Object.keys(masterData);
        if (availableTypes.length > 0) {
            currentType = availableTypes[0];
        }
        
        // Render initial view
        switchType(currentType);
        loadLastUpdated();
        
        showLoading(false);
    } catch (error) {
        console.error('Error loading Excel data:', error);
        errorHandler.handleGlobalError(error);
        showErrorModal('Failed to load Excel files. Please ensure files are in the same directory.', error);
        showLoading(false);
    }
}

/**
 * Load Master Chart from Excel
 * Columns: Type (grouping), Group, SubGroup, Number, Name
 * Groups by "Type" column for top navigation
 */
async function loadMasterChart() {
    try {
        const response = await fetch(MASTER_FILE);

        if (!response.ok) {
            throw new FileLoadError(MASTER_FILE, new Error(`HTTP ${response.status}`));
        }

        const arrayBuffer = await response.arrayBuffer(); // for raw binary data
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.worksheets[0];

        if (!worksheet) {
            throw new FileLoadError(MASTER_FILE, new Error('No worksheet found'));
        }

        // Parse rows - find columns by exact name match (important for correct data)
        const headerRow = worksheet.getRow(1);
        const typeCol = findColumn(headerRow, ['Type', 'Category', 'AccountType']);
        const groupCol = findColumn(headerRow, ['Group', 'SubGroup', 'AccountGroup']);
        const subGroupCol = findColumn(headerRow, ['SubGroup', 'Sub Account', 'SubGroup']);
        const numberCol = findColumn(headerRow, ['Number', 'AccountNumber', 'Account Code', 'Code']);
        const nameCol = findColumn(headerRow, ['Name', 'AccountName', 'Account Name', 'Description']);

        const rows = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header

            const rowData = {
                type: typeCol ? row.getCell(typeCol).value : row.getCell(1).value,
                group: groupCol ? row.getCell(groupCol).value : row.getCell(2).value,
                subGroup: subGroupCol ? row.getCell(subGroupCol).value : row.getCell(3).value,
                number: numberCol ? row.getCell(numberCol).value : row.getCell(4).value,
                name: nameCol ? row.getCell(nameCol).value : row.getCell(5).value
            };

            rows.push(rowData);
        });

        // Organize by Type (for top nav) and Group (for sub-headings)
        masterData = {};
        rows.forEach(row => {
            if (!row.type || !row.number) return;

            let type = String(row.type).trim();
            const group = row.group ? String(row.group).trim() : 'Other';
            const number = String(row.number).trim();
            const name = row.name ? String(row.name).trim() : '';

            // Normalize type names to match navigation buttons
            type = filterManager.mapDestToMasterType(type);

            // Skip header rows or invalid entries
            if (!number || number.toUpperCase() === type.toUpperCase() || number === '0') return;

            if (!masterData[type]) {
                masterData[type] = [];
            }

            let groupObj = masterData[type].find(g => g.heading === group);
            if (!groupObj) {
                groupObj = { heading: group, rows: [] };
                masterData[type].push(groupObj);
            }

            groupObj.rows.push({
                id: number,
                number: number,
                name: name
            });
        });

        console.log('Master Chart processed:', Object.keys(masterData), masterData);

    } catch (error) {
        throw new FileLoadError(MASTER_FILE, error);
    }
}

/**
 * Find column index by searching for common header names
 * Uses exact matching first, then partial matching as fallback
 */
function findColumn(headerRow, searchTerms) {
    // First try exact match
    for (const term of searchTerms) {
        for (let col = 1; col <= headerRow.cellCount; col++) {
            const cellValue = headerRow.getCell(col).value;
            if (cellValue) {
                const cellStr = String(cellValue).trim().toLowerCase();
                const termStr = term.toLowerCase();
                // Exact match (case-insensitive, ignoring extra spaces)
                if (cellStr === termStr || cellStr.replace(/\s+/g, '') === termStr.replace(/\s+/g, '')) {
                    return col;
                }
            }
        }
    }

    // Fallback to partial match only if no exact match found
    for (const term of searchTerms) {
        for (let col = 1; col <= headerRow.cellCount; col++) {
            const cellValue = headerRow.getCell(col).value;
            if (cellValue && String(cellValue).toLowerCase().includes(term.toLowerCase())) {
                return col;
            }
        }
    }
    return null;
}

/**
 * Load Destination Chart from Excel
 * Uses "AccountTypeName" column for type grouping
 * Uses "SubAccountName" column for "Other" category grouping
 */
async function loadDestinationChart() {
    try {
        const response = await fetch(DESTINATION_FILE);

        if (!response.ok) {
            throw new FileLoadError(DESTINATION_FILE, new Error(`HTTP ${response.status}`));
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.worksheets[0];

        if (!worksheet) {
            throw new FileLoadError(DESTINATION_FILE, new Error('No worksheet found'));
        }

        // Parse rows - find columns by exact name match (important for correct data)
        const headerRow = worksheet.getRow(1);
        const accountCodeCol = findColumn(headerRow, ['AccountCode', 'Account Code', 'Code']);
        const accountNameCol = findColumn(headerRow, ['AccountName', 'Account Name', 'Name']);
        const accountTypeCol = findColumn(headerRow, ['AccountTypeName', 'Account Type', 'Type']);
        const subAccountNameCol = findColumn(headerRow, ['SubAccountName', 'Sub Account', 'SubAccount', 'SubGroup']);

        allDestinationData = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header

            const accountCode = accountCodeCol ? row.getCell(accountCodeCol).value : row.getCell(5).value;
            const accountName = accountNameCol ? row.getCell(accountNameCol).value : row.getCell(6).value;
            const accountTypeName = accountTypeCol ? row.getCell(accountTypeCol).value : row.getCell(2).value;
            const subAccountName = subAccountNameCol ? row.getCell(subAccountNameCol).value : row.getCell(4).value;

            if (accountCode && accountName) {
                allDestinationData.push({
                    id: `d${accountCode}`,
                    number: String(accountCode),
                    name: String(accountName),
                    type: accountTypeName ? String(accountTypeName).trim() : '',
                    group: subAccountName ? String(subAccountName).trim() : ''
                });
            }
        });

        console.log('Destination Chart processed:', allDestinationData.length, 'accounts');

    } catch (error) {
        throw new FileLoadError(DESTINATION_FILE, error);
    }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

function initializeEventHandlers() {
    // Logout button
    $('#logoutBtn').on('click', handleLogout);

    // Type navigation buttons (GLOBAL - affects all sections)
    $(document).on('click', '.type-btn', function() {
        const type = $(this).data('type');
        switchType(type);
    });

    // Submit button
    $('#submitBtn').on('click', saveMapping);

    // Clear All button
    $('#clearAllBtn').on('click', clearAllMappings);
    
    // Destination filter buttons (LOCAL - filters destination by master type)
    $(document).on('click', '.dest-filter', function() {
        $('.dest-filter').removeClass('active');
        $(this).addClass('active');
        localDestFilter = $(this).data('filter');
        // Sync with filterManager
        filterManager.activeFilters.local = localDestFilter;
        filterDestinationList();
    });
    
    // Search input with debounce
    $('#dest-search').on('input', function() {
        const term = $(this).val();
        filterManager.safeSearch(term);
        searchTerm = term.toLowerCase();
    });
    
    // Undo button
    $('#undoBtn').on('click', performUndo);
    
    // Remove mapped item
    $(document).on('click', '.mapped-item-remove', function(e) {
        e.stopPropagation();
        const $item = $(this).closest('.mapped-item');
        removeMappedItem($item);
    });
}

// ============================================================================
// TYPE SWITCHING (GLOBAL FILTER)
// ============================================================================

function switchType(type) {
    if (!masterData[type]) {
        console.warn('Type not found:', type);
        return;
    }

    currentType = type;

    // Update active button
    $('.type-btn').removeClass('active');
    $(`.type-btn[data-type="${type}"]`).addClass('active');

    // Filter destination data based on master type (GLOBAL filtering affects destination too)
    filterDestinationByType(type);

    // Update destination filters to show master types and set active filter to current type
    filterManager.updateDestinationFilters(type);

    // Reset search
    $('#dest-search').val('');
    searchTerm = '';

    // Fade out, switch content, fade in
    $('#combined-scroll-panel, #dest-list').fadeOut(200, function() {
        renderCombinedStructure();
        renderDestinationList();
        loadPersistedMapping();

        $('#combined-scroll-panel, #dest-list').fadeIn(200);
    });
}

/**
 * Filter destination data by current type (GLOBAL)
 */
function filterDestinationByType(type) {
    try {
        // Filter destination accounts by their mapped master type
        destinationData = allDestinationData.filter(item => {
            const itemMappedType = filterManager.mapDestToMasterType(item.type, item.group);
            return itemMappedType === type;
        });

        console.log(`Filtered to ${destinationData.length} ${type} accounts`);

    } catch (error) {
        console.error('[Filter Error]', error);
        destinationData = allDestinationData;
    }
}

// ============================================================================
// RENDERING FUNCTIONS
// ============================================================================

/**
 * Render combined structure (Source + Mapping in aligned rows)
 * Single scrollable panel with both sections
 */
function renderCombinedStructure() {
    const $container = $('#source-mapping-rows').empty();
    const typeData = masterData[currentType] || [];

    let globalRowIndex = 0;

    typeData.forEach(group => {
        // Group heading row (spans both sections)
        const $headingRow = $('<div>')
            .addClass('combined-row combined-heading-row');

        const $headingSource = $('<div>')
            .addClass('combined-source-section')
            .text(group.heading);

        const $headingMapping = $('<div>')
            .addClass('combined-mapping-section');

        $headingRow.append($headingSource, $headingMapping);
        $container.append($headingRow);

        // Data rows
        group.rows.forEach((row) => {
            const $dataRow = $('<div>')
                .addClass('combined-row')
                .attr('data-row-index', globalRowIndex)
                .attr('data-row-id', row.id);

            // Source section (left)
            const $sourceSection = $('<div>')
                .addClass('combined-source-section');

            const $sourceContent = $('<div>')
                .addClass('combined-source-content');

            const $number = $('<span>')
                .addClass('combined-source-number')
                .text(cleanNumber(row.number));

            const $name = $('<span>')
                .addClass('combined-source-name')
                .text(row.name);

            const $icons = $('<div>')
                .addClass('combined-source-icons');

            const $mapped = $('<span>')
                .addClass('combined-source-mapped d-none')
                .html('✓');

            $icons.append($mapped);
            $sourceContent.append($number, $name, $icons);
            $sourceSection.append($sourceContent);

            // Mapping section (right - 3 cells)
            const $mappingSection = $('<div>')
                .addClass('combined-mapping-section');

            ['most', 'likely', 'possible'].forEach(col => {
                const $cell = $('<div>')
                    .addClass(`mapping-cell cell-${col}`)
                    .attr('data-col', col)
                    .attr('data-row-index', globalRowIndex)
                    .attr('data-row-id', row.id);

                $mappingSection.append($cell);
            });

            $dataRow.append($sourceSection, $mappingSection);
            $container.append($dataRow);

            globalRowIndex++;
        });
    });

    // Initialize drag and drop
    initializeDragDrop();
}

/**
 * Render source account structure (left panel) - DEPRECATED, now using combined
 */
function renderSourceStructure() {
    const $container = $('#source-structure').empty();
    const typeData = masterData[currentType] || [];

    let globalRowIndex = 0;

    typeData.forEach(group => {
        // Group heading
        const $heading = $('<div>')
            .addClass('source-heading')
            .text(group.heading);
        $container.append($heading);

        // Group rows
        group.rows.forEach((row) => {
            const $row = $('<div>')
                .addClass('source-row')
                .attr('data-row-index', globalRowIndex)
                .attr('data-row-id', row.id);

            const $content = $('<div>')
                .addClass('d-flex align-items-center flex-grow-1');

            const $number = $('<span>')
                .addClass('source-row-number')
                .text(cleanNumber(row.number));

            const $name = $('<span>')
                .addClass('source-row-name')
                .text(row.name);

            $content.append($number, $name);

            const $icons = $('<div>')
                .addClass('source-row-icons');

            const $mapped = $('<span>')
                .addClass('source-row-mapped d-none')
                .html('✓');

            $icons.append($mapped);

            $row.append($content, $icons);
            $container.append($row);

            globalRowIndex++;
        });
    });
}

/**
 * Render mapping grid (center panel) - DEPRECATED, now using combined
 */
function renderMappingGrid() {
    const $container = $('#mapping-grid').empty();
    const typeData = masterData[currentType] || [];

    let globalRowIndex = 0;

    typeData.forEach(group => {
        group.rows.forEach(row => {
            const $mappingRow = $('<div>')
                .addClass('mapping-row')
                .attr('data-row-index', globalRowIndex)
                .attr('data-row-id', row.id);

            // Three droppable cells
            ['most', 'likely', 'possible'].forEach(col => {
                const $cell = $('<div>')
                    .addClass(`mapping-cell cell-${col}`)
                    .attr('data-col', col)
                    .attr('data-row-index', globalRowIndex)
                    .attr('data-row-id', row.id);

                $mappingRow.append($cell);
            });

            $container.append($mappingRow);
            globalRowIndex++;
        });
    });

    // Initialize drag and drop
    initializeDragDrop();
}

/**
 * Render destination account list (right panel)
 */
function renderDestinationList() {
    const $container = $('#dest-list').empty();

    // Update destination header with current type
    $('#dest-group-name').text(currentType);

    // Render ALL destination items (use allDestinationData, not destinationData)
    // This allows local filters to work on the complete set
    allDestinationData.forEach(item => {
        const $item = createDestinationItem(item);
        $container.append($item);
    });

    // Make destination list sortable
    makeDestinationSortable();

    // Apply current local filter and search
    filterDestinationList();

    // Make destination items draggable
    makeDestinationDraggable();
}

/**
 * Create a destination item element
 */
function createDestinationItem(item) {
    const $item = $('<div>')
        .addClass('dest-item')
        .attr('data-id', item.id)
        .attr('data-number', item.number)
        .attr('data-name', item.name)
        .attr('data-type', item.type)
        .attr('data-group', item.group);
    
    const $dragHandle = $('<div>')
        .addClass('dest-item-drag-handle')
        .html('⋮⋮');
    
    const $content = $('<div>')
        .addClass('dest-item-content');
    
    const $header = $('<div>')
        .addClass('dest-item-number')
        .text(`${cleanNumber(item.number)} -- ${item.name}`);
    
    $content.append($header);
    
    $item.append($dragHandle, $content);
    
    return $item;
}

// ============================================================================
// DRAG & DROP FUNCTIONALITY WITH ERROR HANDLING
// ============================================================================

/**
 * Initialize drag and drop functionality
 */
function initializeDragDrop() {
    try {
        // Make mapping cells droppable
        $('.mapping-cell').droppable({
            accept: '.dest-item, .mapped-item',
            hoverClass: 'ui-droppable-hover',
            tolerance: 'pointer',
            drop: function(event, ui) {
                try {
                    handleDrop($(this), ui.draggable);
                } catch (error) {
                    console.error('[Drop Error]', error);
                    showToast('Drop operation failed', 'error');
                }
            }
        });
        
        // Make destination list droppable (for returns)
        $('#dest-list').droppable({
            accept: '.mapped-item',
            tolerance: 'pointer',
            drop: function(event, ui) {
                try {
                    returnToDestination(ui.draggable);
                } catch (error) {
                    console.error('[Return Error]', error);
                    showToast('Return operation failed', 'error');
                }
            }
        });
        
    } catch (error) {
        console.error('[Drag&Drop Init Error]', error);
        throw new DragDropError('initialization', { error: error.message });
    }
}

/**
 * Make destination items draggable
 * Items remain visible in destination list after being mapped
 */
function makeDestinationDraggable() {
    try {
        // Remove draggable from all items first
        $('.dest-item').draggable('destroy');

        // Make all destination items draggable
        $('.dest-item').each(function() {
            const $item = $(this);
            // Skip if already draggable
            if ($item.hasClass('ui-draggable')) {
                return;
            }
            $item.draggable({
                helper: 'clone',
                revert: 'invalid',
                revertDuration: 200,
                zIndex: 1000,
                cursor: 'move',
                containment: 'document',
                start: function() {
                    $(this).addClass('dragging-in-progress');
                },
                stop: function() {
                    $(this).removeClass('dragging-in-progress');
                }
            });
        });
    } catch (error) {
        console.error('[Make Draggable Error]', error);
    }
}

/**
 * Make destination list sortable using jQuery UI Sortable
 */
function makeDestinationSortable() {
    try {
        // Destroy existing sortable if any
        if ($('#dest-list').hasClass('ui-sortable')) {
            $('#dest-list').sortable('destroy');
        }

        $('#dest-list').sortable({
            items: '.dest-item',  // All items are now visible
            handle: '.dest-item-drag-handle',
            placeholder: 'dest-item-placeholder',
            tolerance: 'pointer',
            cursor: 'move',
            opacity: 0.8,
            forcePlaceholderSize: true,
            helper: 'clone',
            start: function(_, ui) {
                ui.placeholder.height(ui.item.height());
                ui.placeholder.css('visibility', 'visible');
            },
            update: function(event, ui) {
                // Optional: Save new order
                console.log('[Sortable] Order updated');
            }
        });

    } catch (error) {
        console.error('[Sortable Error]', error);
    }
}

/**
 * Refresh sortable after filtering
 */
function refreshDestinationSortable() {
    try {
        if ($('#dest-list').hasClass('ui-sortable')) {
            $('#dest-list').sortable('refresh');
        }
    } catch (error) {
        console.error('[Refresh Sortable Error]', error);
    }
}

/**
 * Make mapped items draggable
 */
function makeMappedDraggable($item) {
    if (!$item || !$item.length) {
        console.error('[Drag Error] Invalid item for draggable');
        return;
    }
    
    try {
        $item.draggable({
            revert: 'invalid',
            revertDuration: 200,
            zIndex: 1000,
            cursor: 'move',
            containment: 'document',
            start: function(event, ui) {
                try {
                    $(this).addClass('dragging');
                    saveUndoState('Item moved');
                } catch (err) {
                    console.error('[Drag Start Error]', err);
                    return false;
                }
            },
            stop: function() {
                $(this).removeClass('dragging');
            }
        });
    } catch (error) {
        console.error('[Draggable Init Error]', error);
    }
}

/**
 * Handle drop event with conflict resolution
 */
function handleDrop($targetCell, $draggedItem) {
    if (!$targetCell || !$draggedItem) {
        throw new DragDropError('handle_drop', { reason: 'Invalid parameters' });
    }

    try {
        const isFromDestination = $draggedItem.hasClass('dest-item');
        const rowIndex = $targetCell.data('row-index');
        const rowId = $targetCell.data('row-id');
        const targetCol = $targetCell.data('col');

        // Get item data
        let itemData;

        if (isFromDestination) {
            itemData = extractItemData($draggedItem);
        } else {
            // Moving from one mapping cell to another
            itemData = extractItemData($draggedItem);
            $draggedItem.remove();
        }

        // CHECK: Prevent duplicate destination items in the same row
        const $row = findRowByIndex(rowIndex);
        if ($row.length > 0) {
            const cells = getCellsFromRow($row);
            // Check if this item already exists in any cell of the same row
            const existingInRow = [
                cells.most.find('.mapped-item'),
                cells.likely.find('.mapped-item'),
                cells.possible.find('.mapped-item')
            ].filter($item => $item.length > 0);

            for (const $existing of existingInRow) {
                if ($existing.data('id') === itemData.id) {
                    // Item already mapped in this row, show notification and return
                    showToast('This account is already mapped in this row', 'warning');
                    return;
                }
            }
        }

        // Save undo state
        saveUndoState('Item moved');

        // Check if target cell is occupied
        const $existingItem = $targetCell.find('.mapped-item');

        if ($existingItem.length > 0) {
            performShifting($targetCell, $existingItem, targetCol, rowIndex, rowId);
        }

        // Place new item in target cell
        const $newMappedItem = createMappedItem(itemData);
        $targetCell.empty().append($newMappedItem);
        makeMappedDraggable($newMappedItem);

        // Update source row indicator
        updateSourceRowIndicator(rowIndex);

        // Refresh sortable after drop
        setTimeout(() => {
            refreshDestinationSortable();
        }, 100);

    } catch (error) {
        console.error('[Handle Drop Error]', error);
        throw new DragDropError('handle_drop', { error: error.message });
    }
}

/**
 * Perform shifting algorithm when target cell is occupied
 */
function performShifting($targetCell, $occupiedItem, targetCol, rowIndex, rowId) {
    try {
        const itemData = extractItemData($occupiedItem);

        // Use helper to find row with fallback
        const $row = findRowByIndex(rowIndex);
        if ($row.length === 0) return;

        const cells = getCellsFromRow($row);

        if (targetCol === 'most') {
            const $likelyOccupant = cells.likely.find('.mapped-item');
            if ($likelyOccupant.length > 0) {
                const $possibleOccupant = cells.possible.find('.mapped-item');
                if ($possibleOccupant.length > 0) {
                    returnToDestination($possibleOccupant);
                }
                cells.possible.empty().append($likelyOccupant);
            }
            cells.likely.empty().append($occupiedItem);

        } else if (targetCol === 'likely') {
            const $possibleOccupant = cells.possible.find('.mapped-item');
            if ($possibleOccupant.length > 0) {
                returnToDestination($possibleOccupant);
            }
            cells.possible.empty().append($occupiedItem);

        } else if (targetCol === 'possible') {
            returnToDestination($occupiedItem);
        }

    } catch (error) {
        console.error('[Shifting Error]', error);
    }
}

/**
 * Create a mapped item element for the grid
 */
function createMappedItem(itemData) {
    const $item = $('<div>')
        .addClass('mapped-item')
        .attr('data-id', itemData.id)
        .attr('data-number', itemData.number)
        .attr('data-name', itemData.name)
        .attr('data-type', itemData.type);
    
    const $header = $('<div>')
        .addClass('mapped-item-header');
    
    const $number = $('<div>')
        .addClass('mapped-item-number')
        .text(cleanNumber(itemData.number));
    
    const probabilities = [90, 85, 83, 92, 94, 89, 65, 91];
    const prob = probabilities[Math.floor(Math.random() * probabilities.length)];
    
    const $probability = $('<div>')
        .addClass(`mapped-item-probability probability-${prob}`)
        .text(prob);
    
    $header.append($number, $probability);
    
    const $name = $('<div>')
        .addClass('mapped-item-name')
        .text(itemData.name);
    
    const $remove = $('<button>')
        .addClass('mapped-item-remove')
        .html('×')
        .attr('title', 'Remove');
    
    $item.append($header, $name, $remove);
    
    return $item;
}

/**
 * Return a mapped item back to the destination list
 * Note: Destination items remain visible, so this just removes the mapped item
 */
function returnToDestination($mappedItem) {
    try {
        // Remove the mapped item from the cell
        $mappedItem.remove();

        // Refresh sortable
        refreshDestinationSortable();

    } catch (error) {
        console.error('[Return to Destination Error]', error);
    }
}

/**
 * Remove a mapped item
 */
function removeMappedItem($item) {
    try {
        const $parentRow = $item.closest('.combined-row, .mapping-row');
        const rowIndex = $parentRow.data('row-index');

        saveUndoState('Item removed');
        returnToDestination($item);

        // Update source row indicator immediately after removal
        updateSourceRowIndicator(rowIndex);

    } catch (error) {
        console.error('[Remove Item Error]', error);
        showToast('Failed to remove item', 'error');
    }
}

/**
 * Update source row mapped indicator
 */
function updateSourceRowIndicator(rowIndex) {
    try {
        const $row = findRowByIndex(rowIndex);

        if ($row.length === 0) {
            console.warn('[Update Indicator] Row not found for index:', rowIndex);
            return;
        }

        const hasMappings = rowHasMappings($row);
        const $indicator = $row.find('.combined-source-mapped');

        if ($indicator.length > 0) {
            $indicator.toggleClass('d-none', !hasMappings);
        }
    } catch (error) {
        console.error('[Update Indicator Error]', error);
    }
}

// ============================================================================
// FILTER & SEARCH
// ============================================================================

/**
 * Filter destination list (LOCAL filter - filters by master type)
 *
 * The destination list shows ALL items from allDestinationData
 * Filters work as follows:
 * - If localDestFilter is set (not "All"), only show items matching that master type
 * - If localDestFilter is "All", show all items for the current global type context
 * - Items remain visible even after being mapped to source accounts
 */
function filterDestinationList() {
    try {
        const $items = $('.dest-item');

        $items.each(function() {
            const $item = $(this);

            const itemType = $item.data('type') || '';
            const itemGroup = $item.data('group') || '';
            const itemText = ($item.data('number') + ' ' + $item.data('name')).toLowerCase();

            // Map destination type to master type (include group for "Other" detection)
            const itemMasterType = filterManager.mapDestToMasterType(itemType, itemGroup);

            let showItem = true;

            // Apply local master type filter (if set and not "All")
            if (localDestFilter && localDestFilter !== '') {
                // Special handling for "Other" filter - matches "Other Revenue & Expense"
                if (localDestFilter === 'Other') {
                    if (itemMasterType !== 'Other Revenue & Expense') {
                        showItem = false;
                    }
                } else if (itemMasterType !== localDestFilter) {
                    showItem = false;
                }
            }

            // Apply search
            if (searchTerm && !itemText.includes(searchTerm)) {
                showItem = false;
            }

            $item.toggle(showItem);
        });

        // Refresh sortable
        if ($('#dest-list').hasClass('ui-sortable')) {
            $('#dest-list').sortable('refresh');
        }

    } catch (error) {
        console.error('[Filter Error]', error);
    }
}

// ============================================================================
// DATA PERSISTENCE
// ============================================================================

/**
 * Save current mapping to localStorage
 */
function saveMapping() {
    const $btn = $('#submitBtn');
    $btn.prop('disabled', true).text('Saving...');

    try {
        // Collect mapping data
        const mappingData = {
            type: currentType,
            updatedAt: new Date().toISOString(),
            rows: {}
        };

        // Try combined rows first (new structure), fallback to mapping rows
        let $rows = $('.combined-row[data-row-id]').not('.combined-heading-row');
        if ($rows.length === 0) {
            $rows = $('.mapping-row[data-row-id]');
        }

        let mappedCount = 0;

        $rows.each(function() {
            const $row = $(this);
            const rowId = $row.data('row-id');
            const rowData = {};

            ['most', 'likely', 'possible'].forEach(col => {
                const $cell = $row.find(`.cell-${col}`);
                const $item = $cell.find('.mapped-item');

                if ($item.length > 0) {
                    rowData[col] = extractItemData($item);
                    mappedCount++;
                }
            });

            if (Object.keys(rowData).length > 0) {
                mappingData.rows[rowId] = rowData;
            }
        });

        // Check if anything changed - compare with existing data
        const existingData = storageManager.loadMapping(currentType);
        const newJSON = JSON.stringify(mappingData.rows);
        const existingJSON = existingData ? JSON.stringify(existingData.rows) : '{}';

        if (newJSON === existingJSON && mappedCount === 0) {
            // Nothing to save
            $btn.prop('disabled', false).text('Submit');
            showAlert('warning', {
                title: 'No Changes Detected',
                text: 'There are no mappings to save. Please map some accounts before saving.'
            });
            return;
        }

        // Show confirmation dialog
        showAlert('save', {
            title: 'Save Mappings?',
            text: `You are about to save ${mappedCount} mapping(s) for ${currentType}. Continue?`
        }).then((result) => {
            if (result.isConfirmed) {
                performSave(mappingData, $btn);
            } else {
                $btn.prop('disabled', false).text('Submit');
            }
        });

    } catch (error) {
        console.error('[Save Error]', error);
        $btn.prop('disabled', false).text('Submit');
        showAlert('error', { text: 'Failed to save mapping. Please try again.' });
    }
}

/**
 * Perform the actual save operation
 */
function performSave(mappingData, $btn) {
    // Save using storage manager
    const result = storageManager.saveMapping(currentType, mappingData);

    if (result.success) {
        updateLastUpdated(mappingData.updatedAt);

        // Update all source row indicators after saving
        $('.combined-row[data-row-index]').each(function() {
            updateSourceRowIndicator($(this).data('row-index'));
        });

        $btn.prop('disabled', false).text('Submit');

        showAlert('success', {
            title: 'Saved Successfully!',
            text: `Mappings for ${currentType} have been saved.`
        });
    } else {
        throw new StorageError('Failed to save mapping');
    }
}

/**
 * Clear all mappings - removes all items from mapping cells and resets localStorage
 */
function clearAllMappings() {
    const hasMappings = $('.mapped-item').length > 0;

    const config = {
        title: hasMappings ? 'Clear All Mappings?' : 'Nothing to Clear',
        text: hasMappings
            ? 'This will remove all mapped items and reset the page. This action cannot be undone.'
            : 'There are no mappings to clear.',
        icon: hasMappings ? 'warning' : 'info',
        showCancelButton: hasMappings,
        confirmButtonText: hasMappings ? 'Yes, Clear All' : 'OK'
    };

    // Use delete preset for hasMappings case (red confirm button)
    if (hasMappings) {
        showAlert('delete', config).then((result) => {
            if (result.isConfirmed) {
                performClearAll();
            }
        });
    } else {
        showAlert('info', config);
    }
}

/**
 * Perform the actual clear operation
 */
function performClearAll() {
    const $btn = $('#clearAllBtn');
    $btn.prop('disabled', true).text('Clearing...');

    try {
        // Clear all mapping cells
        $('.mapping-cell').empty();

        // Hide all tick marks in source structure
        $('.combined-source-mapped').addClass('d-none');

        // Clear localStorage for mapping data only (NOT auth tokens)
        const storageKeys = Object.keys(localStorage);
        const authKeys = ['account_mapping::auth_token', 'account_mapping::auth_user', 'account_mapping::users'];

        storageKeys.forEach(key => {
            // Only remove mapping data keys, not authentication keys
            if (key.startsWith('account_mapping::') && !authKeys.includes(key)) {
                localStorage.removeItem(key);
            }
        });

        // Clear last updated display
        $('#lastUpdated').text('');

        // Refresh draggable and sortable
        makeDestinationDraggable();
        refreshDestinationSortable();

        $btn.prop('disabled', false).text('Clear All');

        showAlert('success', {
            title: 'Cleared Successfully!',
            text: 'All mappings have been removed and storage has been reset.'
        });

    } catch (error) {
        console.error('[Clear Error]', error);
        $btn.prop('disabled', false).text('Clear All');
        showAlert('error', { text: 'Failed to clear mappings. Please try again.' });
    }
}

/**
 * Load persisted mapping from localStorage
 */
function loadPersistedMapping() {
    try {
        const mappingData = storageManager.loadMapping(currentType);

        if (!mappingData) {
            return;
        }

        // Apply mappings
        Object.entries(mappingData.rows).forEach(([rowId, rowData]) => {
            const $row = findRowById(rowId);
            if ($row.length === 0) return;

            Object.entries(rowData).forEach(([col, itemData]) => {
                const $cell = $row.find(`.cell-${col}`);
                const $mappedItem = createMappedItem(itemData);
                $cell.empty().append($mappedItem);
                makeMappedDraggable($mappedItem);

                // Note: Destination items remain visible in the list
            });

            // Update source row indicator
            updateSourceRowIndicator($row.data('row-index'));
        });

        // Refresh draggable and sortable after loading mappings
        makeDestinationDraggable();
        refreshDestinationSortable();

    } catch (error) {
        console.error('[Load Persisted Error]', error);
    }
}

/**
 * Load and display last updated timestamp
 */
function loadLastUpdated() {
    try {
        const mappingData = storageManager.loadMapping(currentType);
        
        if (mappingData && mappingData.updatedAt) {
            updateLastUpdated(mappingData.updatedAt);
        }
    } catch (error) {
        console.error('[Load Last Updated Error]', error);
    }
}

/**
 * Update last updated display
 */
function updateLastUpdated(isoDate) {
    try {
        const date = new Date(isoDate);
        const dateStr = date.toLocaleDateString('en-US', { 
            month: '2-digit', 
            day: '2-digit', 
            year: 'numeric' 
        });
        const timeStr = date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        $('#lastUpdated').text(`Last Updated on ${dateStr} at ${timeStr}`);
    } catch (error) {
        console.error('[Update Last Updated Error]', error);
    }
}

// ============================================================================
// UNDO FUNCTIONALITY
// ============================================================================

/**
 * Save undo state
 */
function saveUndoState(message) {
    try {
        // Try to save combined structure first, fallback to mapping grid
        let $target = $('#source-mapping-rows');
        if ($target.length === 0) {
            $target = $('#mapping-grid');
        }

        const state = {
            message: message,
            html: $target.html()
        };
        undoStack.push(state);

        if (undoStack.length > 10) {
            undoStack.shift();
        }
    } catch (error) {
        console.error('[Undo Save Error]', error);
    }
}

/**
 * Perform undo action
 */
function performUndo() {
    try {
        if (undoStack.length === 0) {
            return;
        }

        const state = undoStack.pop();

        // Try combined structure first, fallback to mapping grid
        const $combinedPanel = $('#source-mapping-rows');
        if ($combinedPanel.length > 0) {
            $combinedPanel.html(state.html);
        } else {
            $('#mapping-grid').html(state.html);
        }

        // Reinitialize drag and drop
        initializeDragDrop();

        // Make all mapped items draggable again
        $('.mapped-item').each(function() {
            makeMappedDraggable($(this));
        });

        // Refresh destination draggable and sortable
        makeDestinationDraggable();
        refreshDestinationSortable();

        // Update all source row indicators to show/hide tick marks
        requestAnimationFrame(function() {
            $('.combined-row[data-row-index]').each(function() {
                const $row = $(this);
                const $indicator = $row.find('.combined-source-mapped');
                const hasMappings = rowHasMappings($row);

                if ($indicator.length > 0) {
                    $indicator.toggleClass('d-none', !hasMappings);
                }
            });
        });

        hideToast();

    } catch (error) {
        console.error('[Undo Error]', error);
        showToast('Undo failed', 'error');
    }
}

// ============================================================================
// UI HELPERS
// ============================================================================

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    try {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        
        const colors = {
            success: 'bg-success',
            error: 'bg-danger',
            warning: 'bg-warning',
            info: 'bg-info'
        };
        
        const $toast = $(`
            <div class="toast align-items-center text-white ${colors[type]} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <strong>${icons[type]}</strong> ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `);
        
        $('#undoToast').append($toast);
        
        const toast = new bootstrap.Toast($toast[0], { delay: 3000 });
        toast.show();
        
        $toast.on('hidden.bs.toast', function() {
            $(this).remove();
        });
        
    } catch (error) {
        console.error('[Toast Error]', error);
    }
}

/**
 * Hide toast notification
 */
function hideToast() {
    try {
        const toastEl = $('#undoToast .toast')[0];
        if (toastEl) {
            const toast = bootstrap.Toast.getInstance(toastEl);
            if (toast) {
                toast.hide();
            }
        }
    } catch (error) {
        console.error('[Hide Toast Error]', error);
    }
}

/**
 * Show/hide loading spinner
 */
function showLoading(show) {
    try {
        if (show) {
            $('#loadingSpinner').removeClass('d-none');
        } else {
            $('#loadingSpinner').addClass('d-none');
        }
    } catch (error) {
        console.error('[Loading Error]', error);
    }
}

/**
 * Show error modal
 */
function showErrorModal(message, error) {
    try {
        $('#errorModalMessage').text(message);
        
        if (error) {
            const details = JSON.stringify({
                code: error.code,
                message: error.message,
                metadata: error.metadata
            }, null, 2);
            $('#errorModalDetails').text(details);
        }
        
        const modal = new bootstrap.Modal('#errorModal');
        modal.show();
        
    } catch (err) {
        console.error('[Error Modal Error]', err);
        alert(message);
    }
}

/**
 * Clean number formatting (remove .0 from integers)
 */
function cleanNumber(num) {
    const str = String(num);
    return str.replace(/\.0$/, '');
}

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Handle logout button click
 */
function handleLogout(e) {
    e.preventDefault();

    showAlert('confirm', {
        title: 'Logout?',
        text: 'Are you sure you want to sign out? Any unsaved changes will be lost.',
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'Yes, Logout'
    }).then((result) => {
        if (result.isConfirmed) {
            // Perform logout
            if (typeof auth !== 'undefined') {
                auth.logout();
            } else {
                // Fallback if auth not loaded
                localStorage.removeItem('account_jwt');
                window.location.href = 'login.html';
            }
        }
    });
}
