// Main Application Logic for Amalan Tracking App

// Application state
const AppState = {
    currentPage: '',
    currentMember: null,
    currentWeek: null,
    currentMonth: null,
    currentYear: null,
    memberData: {},
    dashboardData: {},
    reportData: {},
    isLoading: false
};

// Member names
const MEMBERS = ['ATK', 'AYS', 'FTR', 'WIN'];

// Default amalan list
const DEFAULT_AMALAN = [
    'Dzikir pagi/petang',
    'Tilawah', 
    'Shalat tepat waktu',
    'Shalat malam',
    'Shalat Dhuha',
    'Puasa Sunnah',
    'Istighfar',
    'Shalawat',
    'Membaca Baqiyatush-shalihat',
    'Infaq Harian',
    'Doa kemenangan dakwah dan umat islam'
];

/**
 * Initialize application
 */
function initApp() {
    // Set current page
    AppState.currentPage = getCurrentPageName();
    
    // Set current date values
    AppState.currentWeek = DateUtils.getCurrentWeek();
    AppState.currentMonth = DateUtils.getCurrentMonth();
    AppState.currentYear = DateUtils.getCurrentYear();
    
    // Initialize page-specific functionality
    switch (AppState.currentPage) {
        case 'dashboard':
            initDashboard();
            break;
        case 'detail':
            initDetailPage();
            break;
        case 'report':
            initReportPage();
            break;
    }
    
    // Setup global event listeners
    setupGlobalEventListeners();
}

/**
 * Get current page name from URL
 */
function getCurrentPageName() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (filename === 'dashboard.html') return 'dashboard';
    if (filename === 'detail.html') return 'detail';
    if (filename === 'report.html') return 'report';
    if (filename === 'index.html' || filename === '') return 'login';
    
    return 'unknown';
}

/**
 * Setup global event listeners
 */
function setupGlobalEventListeners() {
    // Navigation handling
    setupNavigation();
    
    // Sync button
    const syncButton = document.getElementById('syncButton');
    if (syncButton) {
        syncButton.addEventListener('click', handleSync);
    }
    
    // Refresh on focus (when app comes back to foreground)
    window.addEventListener('focus', handleWindowFocus);
    
    // Handle back button
    window.addEventListener('popstate', handlePopState);
}

/**
 * Setup navigation
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            navigateToPage(page);
        });
    });
}

/**
 * Navigate to page
 */
function navigateToPage(page, params = {}) {
    const pageMap = {
        'dashboard': 'dashboard.html',
        'detail': 'detail.html',
        'report': 'report.html',
        'login': 'index.html'
    };
    
    const url = pageMap[page];
    if (url) {
        URLUtils.navigateTo(url, params);
    }
}

/**
 * Handle window focus
 */
async function handleWindowFocus() {
    if (isLoggedIn() && AppState.currentPage !== 'login') {
        // Refresh current page data
        await refreshCurrentPageData();
    }
}

/**
 * Handle browser back button
 */
function handlePopState(event) {
    // Refresh page data when navigating back
    setTimeout(refreshCurrentPageData, 100);
}

/**
 * Handle sync button click
 */
async function handleSync() {
    try {
        await api.syncData();
        await refreshCurrentPageData();
    } catch (error) {
        UIUtils.showToast('Gagal sinkronisasi data', 'error');
    }
}

/**
 * Refresh current page data
 */
async function refreshCurrentPageData() {
    switch (AppState.currentPage) {
        case 'dashboard':
            await loadDashboardData();
            break;
        case 'detail':
            await loadDetailData();
            break;
        case 'report':
            await loadReportData();
            break;
    }
}

// === DASHBOARD PAGE ===

/**
 * Initialize dashboard page
 */
async function initDashboard() {
    if (!requireAuth()) return;
    
    // Setup week selector
    setupWeekSelector();
    
    // Load dashboard data
    await loadDashboardData();
    
    // Setup member card click handlers
    setupMemberCards();
    
    // Setup quick actions
    setupQuickActions();
}

/**
 * Setup week selector
 */
function setupWeekSelector() {
    const weekSelector = document.getElementById('weekSelector');
    if (!weekSelector) return;
    
    // Create week options
    for (let week = 1; week <= 4; week++) {
        const button = document.createElement('button');
        button.className = 'week-option';
        button.textContent = `Pekan ${week}`;
        button.dataset.week = week;
        
        if (week === AppState.currentWeek) {
            button.classList.add('active');
        }
        
        button.addEventListener('click', () => handleWeekChange(week));
        weekSelector.appendChild(button);
    }
}

/**
 * Handle week change
 */
async function handleWeekChange(week) {
    AppState.currentWeek = week;
    
    // Update active week button
    document.querySelectorAll('.week-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.week == week);
    });
    
    // Reload dashboard data
    await loadDashboardData();
}

/**
 * Load dashboard data
 */
async function loadDashboardData() {
    try {
        setLoading(true);
        
        const stats = await api.getDashboardStats();
        AppState.dashboardData = stats;
        
        renderDashboard();
        
    } catch (error) {
        console.error('Load dashboard error:', error);
        UIUtils.showToast('Gagal memuat data dashboard', 'error');
    } finally {
        setLoading(false);
    }
}

/**
 * Render dashboard
 */
function renderDashboard() {
    renderCurrentWeekInfo();
    renderMemberCards();
}

/**
 * Render current week info
 */
function renderCurrentWeekInfo() {
    const weekInfo = document.getElementById('currentWeekInfo');
    if (!weekInfo) return;
    
    const weekRange = DateUtils.getWeekRange(AppState.currentWeek, AppState.currentMonth, AppState.currentYear);
    const monthName = DateUtils.getMonthName(AppState.currentMonth);
    
    weekInfo.innerHTML = `
        <h3>Pekan ${AppState.currentWeek}</h3>
        <p>${weekRange.startDate}-${weekRange.endDate} ${monthName} ${AppState.currentYear}</p>
    `;
}

/**
 * Render member cards
 */
function renderMemberCards() {
    const container = document.getElementById('memberCards');
    if (!container) return;
    
    container.innerHTML = '';
    
    MEMBERS.forEach(member => {
        const memberData = AppState.dashboardData[member] || {};
        const card = createMemberCard(member, memberData);
        container.appendChild(card);
    });
}

/**
 * Create member card element
 */
function createMemberCard(memberName, data) {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.dataset.member = memberName;
    
    const totalAmalan = data.totalAmalan || 0;
    const completedAmalan = data.completedAmalan || 0;
    const percentage = totalAmalan > 0 ? Math.round((completedAmalan / totalAmalan) * 100) : 0;
    
    card.innerHTML = `
        <div class="member-name">${memberName}</div>
        <div class="member-stats">
            <div class="stat-item">
                <span class="stat-value">${completedAmalan}</span>
                <span class="stat-label">Selesai</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${totalAmalan}</span>
                <span class="stat-label">Total</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${percentage}%</span>
                <span class="stat-label">Progress</span>
            </div>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
    `;
    
    return card;
}

/**
 * Setup member card click handlers
 */
function setupMemberCards() {
    document.addEventListener('click', (e) => {
        const memberCard = e.target.closest('.member-card');
        if (memberCard) {
            const member = memberCard.dataset.member;
            navigateToDetail(member);
        }
    });
}

/**
 * Navigate to detail page
 */
function navigateToDetail(member) {
    navigateToPage('detail', { 
        member: member,
        week: AppState.currentWeek,
        month: AppState.currentMonth,
        year: AppState.currentYear
    });
}

/**
 * Setup quick actions
 */
function setupQuickActions() {
    const reportButton = document.getElementById('quickReport');
    if (reportButton) {
        reportButton.addEventListener('click', () => {
            navigateToPage('report');
        });
    }
}

// === DETAIL PAGE ===

/**
 * Initialize detail page
 */
async function initDetailPage() {
    if (!requireAuth()) return;
    
    // Get member from URL
    AppState.currentMember = URLUtils.getParam('member');
    
    if (!AppState.currentMember || !ValidationUtils.isValidMember(AppState.currentMember)) {
        UIUtils.showToast('Anggota tidak valid', 'error');
        navigateToPage('dashboard');
        return;
    }
    
    // Get week/month/year from URL or use current
    AppState.currentWeek = parseInt(URLUtils.getParam('week')) || DateUtils.getCurrentWeek();
    AppState.currentMonth = parseInt(URLUtils.getParam('month')) || DateUtils.getCurrentMonth();
    AppState.currentYear = parseInt(URLUtils.getParam('year')) || DateUtils.getCurrentYear();
    
    // Setup page header
    setupDetailHeader();
    
    // Setup week navigation
    setupDetailWeekNavigation();
    
    // Load detail data
    await loadDetailData();
    
    // Setup form handlers
    setupAmalanForm();
}

/**
 * Setup detail page header
 */
function setupDetailHeader() {
    const memberName = document.getElementById('memberName');
    const backButton = document.getElementById('backButton');
    
    if (memberName) {
        memberName.textContent = AppState.currentMember;
    }
    
    if (backButton) {
        backButton.addEventListener('click', () => {
            navigateToPage('dashboard');
        });
    }
}

/**
 * Setup detail week navigation
 */
function setupDetailWeekNavigation() {
    const prevWeek = document.getElementById('prevWeek');
    const nextWeek = document.getElementById('nextWeek');
    
    if (prevWeek) {
        prevWeek.addEventListener('click', () => changeDetailWeek(-1));
    }
    
    if (nextWeek) {
        nextWeek.addEventListener('click', () => changeDetailWeek(1));
    }
    
    updateDetailWeekDisplay();
}

/**
 * Change detail week
 */
function changeDetailWeek(direction) {
    let newWeek = AppState.currentWeek + direction;
    let newMonth = AppState.currentMonth;
    let newYear = AppState.currentYear;
    
    // Handle week overflow/underflow
    if (newWeek < 1) {
        newWeek = 4;
        newMonth--;
        if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }
    } else if (newWeek > 4) {
        newWeek = 1;
        newMonth++;
        if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        }
    }
    
    AppState.currentWeek = newWeek;
    AppState.currentMonth = newMonth;
    AppState.currentYear = newYear;
    
    // Update URL
    URLUtils.setParam('week', newWeek);
    URLUtils.setParam('month', newMonth);
    URLUtils.setParam('year', newYear);
    
    updateDetailWeekDisplay();
    loadDetailData();
}

/**
 * Update detail week display
 */
function updateDetailWeekDisplay() {
    const weekDisplay = document.getElementById('currentWeekDisplay');
    if (!weekDisplay) return;
    
    const weekRange = DateUtils.getWeekRange(AppState.currentWeek, AppState.currentMonth, AppState.currentYear);
    const monthName = DateUtils.getMonthName(AppState.currentMonth);
    
    weekDisplay.textContent = `Pekan ${AppState.currentWeek} - ${weekRange.startDate}-${weekRange.endDate} ${monthName} ${AppState.currentYear}`;
}

/**
 * Load detail data
 */
async function loadDetailData() {
    try {
        setLoading(true);
        
        const data = await api.getWeeklyData(
            AppState.currentMember,
            AppState.currentWeek,
            AppState.currentMonth,
            AppState.currentYear
        );
        
        AppState.memberData = data;
        renderDetailPage();
        
    } catch (error) {
        console.error('Load detail error:', error);
        UIUtils.showToast('Gagal memuat data anggota', 'error');
    } finally {
        setLoading(false);
    }
}

/**
 * Render detail page
 */
function renderDetailPage() {
    renderAmalanList();
}

/**
 * Render amalan list
 */
function renderAmalanList() {
    const container = document.getElementById('amalanList');
    if (!container) return;
    
    container.innerHTML = '';
    
    DEFAULT_AMALAN.forEach((amalanName, index) => {
        const currentValue = AppState.memberData.amalan?.[amalanName] || 0;
        const amalanItem = createAmalanItem(amalanName, currentValue, index);
        container.appendChild(amalanItem);
    });
}

/**
 * Create amalan item element
 */
function createAmalanItem(amalanName, currentValue, index) {
    const item = document.createElement('div');
    item.className = 'amalan-item';
    item.dataset.amalan = amalanName;
    
    item.innerHTML = `
        <div class="amalan-header">
            <span class="amalan-name">${amalanName}</span>
            <span class="amalan-count">${currentValue}</span>
        </div>
        <div class="amalan-input">
            <button class="btn btn-secondary btn-sm decrease-btn" data-action="decrease">-</button>
            <input type="number" class="form-input amalan-value" 
                   value="${currentValue}" min="0" max="9999"
                   data-amalan="${amalanName}">
            <button class="btn btn-secondary btn-sm increase-btn" data-action="increase">+</button>
            <button class="btn btn-primary btn-sm save-btn" data-action="save">Simpan</button>
        </div>
    `;
    
    return item;
}

/**
 * Setup amalan form handlers
 */
function setupAmalanForm() {
    const container = document.getElementById('amalanList');
    if (!container) return;
    
    // Delegate event handling
    container.addEventListener('click', handleAmalanButtonClick);
    container.addEventListener('input', handleAmalanInputChange);
    container.addEventListener('keypress', handleAmalanKeyPress);
}

/**
 * Handle amalan button clicks
 */
async function handleAmalanButtonClick(e) {
    const button = e.target.closest('button');
    if (!button) return;
    
    const action = button.dataset.action;
    const amalanItem = button.closest('.amalan-item');
    const input = amalanItem.querySelector('.amalan-value');
    const amalanName = input.dataset.amalan;
    
    switch (action) {
        case 'decrease':
            adjustAmalanValue(input, -1);
            break;
        case 'increase':
            adjustAmalanValue(input, 1);
            break;
        case 'save':
            await saveAmalanValue(amalanName, input.value, button);
            break;
    }
}

/**
 * Handle amalan input changes
 */
function handleAmalanInputChange(e) {
    if (e.target.classList.contains('amalan-value')) {
        const input = e.target;
        const amalanItem = input.closest('.amalan-item');
        const countDisplay = amalanItem.querySelector('.amalan-count');
        
        // Update display
        countDisplay.textContent = input.value;
        
        // Validate input
        validateAmalanInput(input);
    }
}

/**
 * Handle enter key press
 */
function handleAmalanKeyPress(e) {
    if (e.key === 'Enter' && e.target.classList.contains('amalan-value')) {
        const input = e.target;
        const amalanItem = input.closest('.amalan-item');
        const saveButton = amalanItem.querySelector('.save-btn');
        saveButton.click();
    }
}

/**
 * Adjust amalan value
 */
function adjustAmalanValue(input, delta) {
    const currentValue = parseInt(input.value) || 0;
    const newValue = Math.max(0, Math.min(9999, currentValue + delta));
    input.value = newValue;
    
    // Trigger input change event
    input.dispatchEvent(new Event('input'));
}

/**
 * Validate amalan input
 */
function validateAmalanInput(input) {
    const value = parseInt(input.value);
    
    if (isNaN(value) || value < 0 || value > 9999) {
        input.classList.add('form-error');
        return false;
    } else {
        input.classList.remove('form-error');
        return true;
    }
}

/**
 * Save amalan value
 */
async function saveAmalanValue(amalanName, value, button) {
    try {
        if (!validateAmalanInput(button.closest('.amalan-item').querySelector('.amalan-value'))) {
            UIUtils.showToast('Nilai tidak valid', 'error');
            return;
        }
        
        UIUtils.setButtonLoading(button, true);
        
        await api.updateAmalan(
            AppState.currentMember,
            amalanName,
            parseInt(value),
            AppState.currentWeek,
            AppState.currentMonth,
            AppState.currentYear
        );
        
        UIUtils.showToast('Data berhasil disimpan', 'success');
        
        // Update local data
        if (!AppState.memberData.amalan) {
            AppState.memberData.amalan = {};
        }
        AppState.memberData.amalan[amalanName] = parseInt(value);
        
    } catch (error) {
        console.error('Save amalan error:', error);
        UIUtils.showToast('Gagal menyimpan data', 'error');
    } finally {
        UIUtils.setButtonLoading(button, false);
    }
}

// === REPORT PAGE ===

/**
 * Initialize report page
 */
async function initReportPage() {
    if (!requireAuth()) return;
    
    // Setup month/year selector
    setupReportSelector();
    
    // Load report data
    await loadReportData();
    
    // Setup export functionality
    setupReportExport();
}

/**
 * Setup report selector
 */
function setupReportSelector() {
    const monthSelector = document.getElementById('monthSelector');
    const yearSelector = document.getElementById('yearSelector');
    
    if (monthSelector) {
        // Populate months
        for (let month = 1; month <= 12; month++) {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = DateUtils.getMonthName(month);
            if (month === AppState.currentMonth) {
                option.selected = true;
            }
            monthSelector.appendChild(option);
        }
        
        monthSelector.addEventListener('change', loadReportData);
    }
    
    if (yearSelector) {
        // Populate years
        const currentYear = DateUtils.getCurrentYear();
        for (let year = currentYear - 2; year <= currentYear + 1; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            if (year === AppState.currentYear) {
                option.selected = true;
            }
            yearSelector.appendChild(option);
        }
        
        yearSelector.addEventListener('change', loadReportData);
    }
}

/**
 * Load report data
 */
async function loadReportData() {
    try {
        setLoading(true);
        
        // Get selected month/year
        const monthSelector = document.getElementById('monthSelector');
        const yearSelector = document.getElementById('yearSelector');
        
        const month = monthSelector ? parseInt(monthSelector.value) : AppState.currentMonth;
        const year = yearSelector ? parseInt(yearSelector.value) : AppState.currentYear;
        
        const data = await api.getMonthlyReport(month, year);
        AppState.reportData = data;
        
        renderReport();
        
    } catch (error) {
        console.error('Load report error:', error);
        UIUtils.showToast('Gagal memuat laporan', 'error');
    } finally {
        setLoading(false);
    }
}

/**
 * Render report
 */
function renderReport() {
    renderReportSummary();
    renderReportCharts();
    renderReportTable();
}

/**
 * Render report summary
 */
function renderReportSummary() {
    const container = document.getElementById('reportSummary');
    if (!container || !AppState.reportData) return;
    
    const summary = AppState.reportData.summary || {};
    
    container.innerHTML = `
        <div class="grid grid-cols-2">
            <div class="stat-card">
                <h4>Total Amalan</h4>
                <div class="stat-value">${summary.totalAmalan || 0}</div>
            </div>
            <div class="stat-card">
                <h4>Anggota Teraktif</h4>
                <div class="stat-value">${summary.mostActive || '-'}</div>
            </div>
        </div>
    `;
}

/**
 * Render report charts (placeholder)
 */
function renderReportCharts() {
    const container = document.getElementById('reportCharts');
    if (!container) return;
    
    // Simple chart implementation would go here
    // For now, just show basic data
    container.innerHTML = '<p class="text-center text-muted">Chart visualization akan ditambahkan</p>';
}

/**
 * Render report table
 */
function renderReportTable() {
    const container = document.getElementById('reportTable');
    if (!container || !AppState.reportData) return;
    
    const memberData = AppState.reportData.members || {};
    
    let tableHTML = `
        <table class="report-table">
            <thead>
                <tr>
                    <th>Anggota</th>
                    <th>Total Amalan</th>
                    <th>Amalan Terfavorit</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    MEMBERS.forEach(member => {
        const data = memberData[member] || {};
        tableHTML += `
            <tr>
                <td>${member}</td>
                <td>${data.totalAmalan || 0}</td>
                <td>${data.topAmalan || '-'}</td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
}

/**
 * Setup report export
 */
function setupReportExport() {
    const exportButton = document.getElementById('exportReport');
    if (exportButton) {
        exportButton.addEventListener('click', handleReportExport);
    }
}

/**
 * Handle report export
 */
function handleReportExport() {
    // Simple CSV export
    let csvContent = "Anggota,Total Amalan,Amalan Terfavorit\n";
    
    const memberData = AppState.reportData?.members || {};
    MEMBERS.forEach(member => {
        const data = memberData[member] || {};
        csvContent += `${member},${data.totalAmalan || 0},${data.topAmalan || '-'}\n`;
    });
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-amalan-${AppState.currentMonth}-${AppState.currentYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    UIUtils.showToast('Laporan berhasil diekspor', 'success');
}

// === UTILITY FUNCTIONS ===

/**
 * Set loading state
 */
function setLoading(loading) {
    AppState.isLoading = loading;
    
    if (loading) {
        UIUtils.showLoading();
    } else {
        UIUtils.hideLoading();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export for global use
window.AppState = AppState;
window.MEMBERS = MEMBERS;
window.DEFAULT_AMALAN = DEFAULT_AMALAN;
window.initApp = initApp;
window.navigateToPage = navigateToPage;
window.refreshCurrentPageData = refreshCurrentPageData;