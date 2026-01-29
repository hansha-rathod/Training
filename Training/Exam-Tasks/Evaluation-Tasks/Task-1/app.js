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

// ============================================================================
// SCROLL SYNCHRONIZER
// ============================================================================

class ScrollSynchronizer {
    constructor(sourceEl, mappingEl) {
        this.source = sourceEl;
        this.mapping = mappingEl;
        this.isSyncing = false;
        this.throttleDelay = 16;
        this.lastScrollTime = 0;
        
        if (this.source && this.mapping) {
            this.init();
        }
    }
    
    init() {
        try {
            this.source.addEventListener('scroll', 
                this.throttle(this.syncScroll.bind(this, 'source')), 
                { passive: true }
            );
            
            this.mapping.addEventListener('scroll', 
                this.throttle(this.syncScroll.bind(this, 'mapping')), 
                { passive: true }
            );
        } catch (error) {
            console.error('[Scroll Sync Error]', error);
        }
    }
    
    syncScroll(initiator) {
        if (this.isSyncing) return;
        
        try {
            this.isSyncing = true;
            const scrollTop = this[initiator].scrollTop;
            
            if (initiator === 'source') {
                this.mapping.scrollTop = scrollTop;
            } else {
                this.source.scrollTop = scrollTop;
            }
            
        } catch (error) {
            console.error('[Sync Error]', error);
        } finally {
            setTimeout(() => this.isSyncing = false, 10);
        }
    }
    
    throttle(func) {
        return (...args) => {
            const now = Date.now();
            
            if (now - this.lastScrollTime >= this.throttleDelay) {
                this.lastScrollTime = now;
                func(...args);
            }
        };
    }
    
    destroy() {
        if (this.source && this.mapping) {
            this.source.removeEventListener('scroll', this.syncScroll);
            this.mapping.removeEventListener('scroll', this.syncScroll);
        }
    }
}

let scrollSynchronizer = null;

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
    }
    
    getTypeMapping() {
        // Map destination types to master types
        const mapping = {
            'Assets': new Set(),
            'Liabilities': new Set(),
            'Equity': new Set(),
            'Revenue': new Set(),
            'COGS': new Set(),
            'Expense': new Set(),
            'Other Rev & Exp': new Set()
        };
        
        allDestinationData.forEach(item => {
            const mainType = this.mapDestToMasterType(item.type);
            
            if (mapping[mainType] && item.group) {
                mapping[mainType].add(item.group);
            }
        });
        
        // Convert Sets to Arrays
        Object.keys(mapping).forEach(key => {
            mapping[key] = Array.from(mapping[key]).sort();
        });
        
        return mapping;
    }
    
    mapDestToMasterType(destType) {
        if (!destType) return 'Other Rev & Exp';
        
        const upperType = destType.toUpperCase();
        
        if (upperType.includes('ASSET')) return 'Assets';
        if (upperType.includes('LIABIL')) return 'Liabilities';
        if (upperType.includes('EQUITY') || upperType.includes('CAPITAL')) return 'Equity';
        if (upperType.includes('REVENUE')) return 'Revenue';
        if (upperType.includes('COST') && upperType.includes('PRODUCT')) return 'COGS';
        if (upperType.includes('EXPENSE') || upperType.includes('LABOR') || upperType.includes('PROFESSIONAL')) return 'Expense';
        
        return 'Other Rev & Exp';
    }
    
    updateDestinationFilters(type) {
        try {
            const typeMapping = this.getTypeMapping();
            const relevantSubTypes = typeMapping[type] || [];
            
            const $filterContainer = $('.dest-filter-nav .d-flex').first();
            $filterContainer.find('.dest-filter:not(:first)').remove();
            
            // Add relevant sub-type buttons
            relevantSubTypes.forEach(subType => {
                $filterContainer.append(`
                    <button class="btn btn-sm dest-filter" data-filter="${subType}">
                        ${subType}
                    </button>
                `);
            });
            
            // Reset active state
            $('.dest-filter').removeClass('active').first().addClass('active');
            this.activeFilters.local = '';
            
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

let masterData = {};
let destinationData = [];
let allDestinationData = [];
let currentType = 'Assets';
let localDestFilter = '';
let searchTerm = '';
let undoStack = [];

// File paths
const MASTER_FILE = 'Master_Chart_of_account.xlsx';
const DESTINATION_FILE = 'destination_chart_of_account.xlsx';

// ============================================================================
// INITIALIZATION
// ============================================================================

$(document).ready(function() {
    console.log('Initializing Account Mapping Application with ExcelJS...');
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
 */
async function loadMasterChart() {
    try {
        const response = await fetch(MASTER_FILE);
        
        if (!response.ok) {
            throw new FileLoadError(MASTER_FILE, new Error(`HTTP ${response.status}`));
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        
        const worksheet = workbook.worksheets[0];
        
        if (!worksheet) {
            throw new FileLoadError(MASTER_FILE, new Error('No worksheet found'));
        }
        
        // Parse rows
        const rows = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header
            
            const rowData = {
                type: row.getCell(1).value,
                group: row.getCell(2).value,
                subGroup: row.getCell(3).value,
                number: row.getCell(4).value,
                name: row.getCell(5).value
            };
            
            rows.push(rowData);
        });
        
        // Organize by type and group
        masterData = {};
        rows.forEach(row => {
            if (!row.type || !row.number) return;
            
            const type = String(row.type).trim();
            const group = row.group ? String(row.group).trim() : 'Other';
            const number = String(row.number).trim();
            const name = row.name ? String(row.name).trim() : '';
            
            // Skip header rows
            if (number.toUpperCase() === type.toUpperCase()) return;
            
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
        
        console.log('Master Chart processed:', masterData);
        
    } catch (error) {
        throw new FileLoadError(MASTER_FILE, error);
    }
}

/**
 * Load Destination Chart from Excel
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
        
        // Parse rows
        allDestinationData = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header
            
            const accountCode = row.getCell(5).value;
            const accountName = row.getCell(6).value;
            const accountType = row.getCell(2).value;
            const subAccountName = row.getCell(4).value;
            
            if (accountCode && accountName) {
                allDestinationData.push({
                    id: `d${accountCode}`,
                    number: String(accountCode),
                    name: String(accountName),
                    type: accountType ? String(accountType).trim() : '',
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
    // Type navigation buttons (GLOBAL - affects all sections)
    $(document).on('click', '.type-btn', function() {
        const type = $(this).data('type');
        switchType(type);
    });
    
    // Submit button
    $('#submitBtn').on('click', saveMapping);
    
    // Destination filter buttons (LOCAL - only affects destination panel)
    $(document).on('click', '.dest-filter', function() {
        $('.dest-filter').removeClass('active');
        $(this).addClass('active');
        localDestFilter = $(this).data('filter');
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
    
    // Filter destination data based on type
    filterDestinationByType(type);
    
    // Update destination filters dynamically
    filterManager.updateDestinationFilters(type);
    
    // Reset search
    $('#dest-search').val('');
    searchTerm = '';
    
    // Fade out, switch content, fade in
    $('#source-structure, #mapping-grid, #dest-list').fadeOut(200, function() {
        renderSourceStructure();
        renderMappingGrid();
        renderDestinationList();
        loadPersistedMapping();
        
        // Initialize scroll synchronization
        if (scrollSynchronizer) {
            scrollSynchronizer.destroy();
        }
        
        const sourceEl = document.getElementById('source-structure');
        const mappingEl = document.getElementById('mapping-grid');
        
        if (sourceEl && mappingEl) {
            scrollSynchronizer = new ScrollSynchronizer(sourceEl, mappingEl);
        }
        
        $('#source-structure, #mapping-grid, #dest-list').fadeIn(200);
    });
}

/**
 * Filter destination data by current type (GLOBAL)
 */
function filterDestinationByType(type) {
    try {
        const mappedType = filterManager.mapDestToMasterType(type);
        
        // Filter based on the mapping
        destinationData = allDestinationData.filter(item => {
            const itemMappedType = filterManager.mapDestToMasterType(item.type);
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
 * Render source account structure (left panel)
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
 * Render mapping grid (center panel) - ALIGNED with source rows
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
    
    // Render all destination items
    destinationData.forEach(item => {
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
 */
function makeDestinationDraggable() {
    try {
        $('.dest-item:visible').draggable({
            helper: 'clone',
            revert: 'invalid',
            revertDuration: 200,
            zIndex: 1000,
            cursor: 'move',
            containment: 'document',
            start: function(event, ui) {
                try {
                    $(this).css('opacity', '0.5');
                } catch (err) {
                    console.error('[Drag Start Error]', err);
                    return false;
                }
            },
            stop: function() {
                $(this).css('opacity', '1');
            }
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
        $('#dest-list').sortable({
            handle: '.dest-item-drag-handle',
            placeholder: 'dest-item-placeholder',
            tolerance: 'pointer',
            cursor: 'move',
            opacity: 0.8,
            forcePlaceholderSize: true,
            helper: 'clone',
            start: function(event, ui) {
                ui.placeholder.height(ui.item.height());
                ui.placeholder.css('visibility', 'visible');
            },
            update: function(event, ui) {
                // Optional: Save new order
                console.log('[Sortable] Order updated');
            }
        });
        
        // Disable sortable on hidden items to prevent glitches
        $('#dest-list').on('sortstart', function(event, ui) {
            if (ui.item.css('display') === 'none') {
                $('#dest-list').sortable('cancel');
            }
        });
        
    } catch (error) {
        console.error('[Sortable Error]', error);
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
        
        // Save undo state
        saveUndoState('Item moved');
        
        // Get item data
        let itemData;
        if (isFromDestination) {
            itemData = {
                id: $draggedItem.data('id'),
                number: $draggedItem.data('number'),
                name: $draggedItem.data('name'),
                type: $draggedItem.data('type')
            };
        } else {
            itemData = {
                id: $draggedItem.data('id'),
                number: $draggedItem.data('number'),
                name: $draggedItem.data('name'),
                type: $draggedItem.data('type')
            };
            $draggedItem.remove();
        }
        
        // Check if target cell is occupied
        const $existingItem = $targetCell.find('.mapped-item');
        
        if ($existingItem.length > 0) {
            performShifting($targetCell, $existingItem, targetCol, rowIndex, rowId);
        }
        
        // Place new item in target cell
        const $newMappedItem = createMappedItem(itemData);
        $targetCell.empty().append($newMappedItem);
        makeMappedDraggable($newMappedItem);
        
        // If from destination, hide the original
        if (isFromDestination) {
            $draggedItem.hide();
        }
        
        // Update source row indicator
        updateSourceRowIndicator(rowIndex);
        
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
        const itemData = {
            id: $occupiedItem.data('id'),
            number: $occupiedItem.data('number'),
            name: $occupiedItem.data('name'),
            type: $occupiedItem.data('type')
        };
        
        const $row = $(`.mapping-row[data-row-index="${rowIndex}"]`);
        const $mostCell = $row.find('.cell-most');
        const $likelyCell = $row.find('.cell-likely');
        const $possibleCell = $row.find('.cell-possible');
        
        if (targetCol === 'most') {
            const $likelyOccupant = $likelyCell.find('.mapped-item');
            if ($likelyOccupant.length > 0) {
                const $possibleOccupant = $possibleCell.find('.mapped-item');
                if ($possibleOccupant.length > 0) {
                    returnToDestination($possibleOccupant);
                }
                $possibleCell.empty().append($likelyOccupant);
            }
            $likelyCell.empty().append($occupiedItem);
            
        } else if (targetCol === 'likely') {
            const $possibleOccupant = $possibleCell.find('.mapped-item');
            if ($possibleOccupant.length > 0) {
                returnToDestination($possibleOccupant);
            }
            $possibleCell.empty().append($occupiedItem);
            
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
 */
function returnToDestination($mappedItem) {
    try {
        const itemId = $mappedItem.data('id');
        
        // Show the original destination item
        const $destItem = $(`.dest-item[data-id="${itemId}"]`);
        $destItem.show();
        
        // Reapply draggable
        makeDestinationDraggable();
        
        // Remove the mapped item
        $mappedItem.remove();
        
    } catch (error) {
        console.error('[Return to Destination Error]', error);
    }
}

/**
 * Remove a mapped item
 */
function removeMappedItem($item) {
    try {
        saveUndoState('Item removed');
        returnToDestination($item);
        
        // Update source row indicator
        const rowIndex = $item.closest('.mapping-row').data('row-index');
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
        const $row = $(`.mapping-row[data-row-index="${rowIndex}"]`);
        const hasMappings = $row.find('.mapped-item').length > 0;
        
        const $sourceRow = $(`.source-row[data-row-index="${rowIndex}"]`);
        const $indicator = $sourceRow.find('.source-row-mapped');
        
        if (hasMappings) {
            $indicator.removeClass('d-none');
        } else {
            $indicator.addClass('d-none');
        }
    } catch (error) {
        console.error('[Update Indicator Error]', error);
    }
}

// ============================================================================
// FILTER & SEARCH
// ============================================================================

/**
 * Filter destination list (LOCAL filter - only affects destination panel)
 */
function filterDestinationList() {
    try {
        const $items = $('.dest-item');
        
        $items.each(function() {
            const $item = $(this);
            const itemGroup = $item.data('group') || '';
            const itemText = ($item.data('number') + ' ' + $item.data('name')).toLowerCase();
            
            let showItem = true;
            
            // Apply local group filter (if set)
            if (localDestFilter && itemGroup !== localDestFilter) {
                showItem = false;
            }
            
            // Apply search
            if (searchTerm && !itemText.includes(searchTerm)) {
                showItem = false;
            }
            
            // Check if already mapped (hidden)
            const isHidden = $item.css('display') === 'none';
            if (isHidden && !searchTerm && !localDestFilter) {
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
        
        $('.mapping-row').each(function() {
            const $row = $(this);
            const rowId = $row.data('row-id');
            const rowData = {};
            
            ['most', 'likely', 'possible'].forEach(col => {
                const $cell = $row.find(`.cell-${col}`);
                const $item = $cell.find('.mapped-item');
                
                if ($item.length > 0) {
                    rowData[col] = {
                        id: $item.data('id'),
                        number: $item.data('number'),
                        name: $item.data('name')
                    };
                }
            });
            
            if (Object.keys(rowData).length > 0) {
                mappingData.rows[rowId] = rowData;
            }
        });
        
        // Save using storage manager
        const result = storageManager.saveMapping(currentType, mappingData);
        
        if (result.success) {
            updateLastUpdated(mappingData.updatedAt);
            
            setTimeout(() => {
                $btn.prop('disabled', false).text('Submit');
                showToast('Mapping saved successfully! 🎉', 'success');
            }, 500);
        } else {
            throw new StorageError('Failed to save mapping');
        }
        
    } catch (error) {
        console.error('[Save Error]', error);
        $btn.prop('disabled', false).text('Submit');
        showToast('Failed to save mapping', 'error');
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
            const $row = $(`.mapping-row[data-row-id="${rowId}"]`);
            
            if ($row.length === 0) {
                return;
            }
            
            Object.entries(rowData).forEach(([col, itemData]) => {
                const $cell = $row.find(`.cell-${col}`);
                const $mappedItem = createMappedItem(itemData);
                $cell.empty().append($mappedItem);
                makeMappedDraggable($mappedItem);
                
                // Hide from destination list
                $(`.dest-item[data-id="${itemData.id}"]`).hide();
            });
            
            // Update source row indicator
            const rowIndex = $row.data('row-index');
            updateSourceRowIndicator(rowIndex);
        });
        
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
        const state = {
            message: message,
            html: $('#mapping-grid').html()
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
        $('#mapping-grid').html(state.html);
        
        // Reinitialize drag and drop
        initializeDragDrop();
        
        // Make all mapped items draggable again
        $('.mapped-item').each(function() {
            makeMappedDraggable($(this));
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