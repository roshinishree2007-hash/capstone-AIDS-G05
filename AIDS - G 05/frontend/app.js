/**
 * AI LAB GPU & WORKSTATION RESERVATION SYSTEM
 * Frontend Application Logic (Modern Vanilla JavaScript ES6+)
 * Dual Responsive: Laptop Desktop & Mobile Smartphones
 */

const API_BASE_URL = 'http://localhost:8080/api';

// State Management
let workstations = [];
let bookings = [];
let isBackendOnline = false;
let currentSection = 'fleet';

// Fallback initial dataset (guarantees immediate high-fidelity rendering)
const FALLBACK_WORKSTATIONS = [
  { id: 1, workstationCode: 'WS-GPU-01', workstationName: 'Workstation Alpha 1', gpuModel: 'NVIDIA GeForce RTX 4090', vramGb: 24, cpuModel: 'Intel Core i9-14900K (24 Cores)', ramGb: 128, storageInfo: '2TB NVMe PCIe 4.0 SSD', status: 'AVAILABLE', labLocation: 'AI Deep Learning Lab - Row 1' },
  { id: 2, workstationCode: 'WS-GPU-02', workstationName: 'Workstation Alpha 2', gpuModel: 'NVIDIA GeForce RTX 4090', vramGb: 24, cpuModel: 'Intel Core i9-14900K (24 Cores)', ramGb: 128, storageInfo: '2TB NVMe PCIe 4.0 SSD', status: 'AVAILABLE', labLocation: 'AI Deep Learning Lab - Row 1' },
  { id: 3, workstationCode: 'WS-GPU-03', workstationName: 'Workstation Alpha 3', gpuModel: 'NVIDIA GeForce RTX 4090', vramGb: 24, cpuModel: 'AMD Ryzen 9 7950X (16 Cores)', ramGb: 128, storageInfo: '2TB NVMe PCIe 4.0 SSD', status: 'RESERVED', labLocation: 'AI Deep Learning Lab - Row 1' },
  { id: 4, workstationCode: 'WS-GPU-04', workstationName: 'Workstation Alpha 4', gpuModel: 'NVIDIA GeForce RTX 4090', vramGb: 24, cpuModel: 'AMD Ryzen 9 7950X (16 Cores)', ramGb: 128, storageInfo: '2TB NVMe PCIe 4.0 SSD', status: 'AVAILABLE', labLocation: 'AI Deep Learning Lab - Row 1' },
  { id: 5, workstationCode: 'WS-GPU-05', workstationName: 'Workstation Titan 1', gpuModel: 'NVIDIA A100 Tensor Core', vramGb: 80, cpuModel: 'AMD EPYC 7763 (64 Cores)', ramGb: 256, storageInfo: '4TB NVMe Enterprise SSD', status: 'IN_USE', labLocation: 'AI Deep Learning Lab - Cluster Rack A' },
  { id: 6, workstationCode: 'WS-GPU-06', workstationName: 'Workstation Titan 2', gpuModel: 'NVIDIA A100 Tensor Core', vramGb: 80, cpuModel: 'AMD EPYC 7763 (64 Cores)', ramGb: 256, storageInfo: '4TB NVMe Enterprise SSD', status: 'AVAILABLE', labLocation: 'AI Deep Learning Lab - Cluster Rack A' },
  { id: 7, workstationCode: 'WS-GPU-07', workstationName: 'Workstation Titan 3', gpuModel: 'NVIDIA H100 PCIe', vramGb: 80, cpuModel: 'Intel Xeon Platinum 8480+ (56 Cores)', ramGb: 256, storageInfo: '7.68TB NVMe Enterprise SSD', status: 'AVAILABLE', labLocation: 'AI Deep Learning Lab - Cluster Rack A' },
  { id: 8, workstationCode: 'WS-GPU-08', workstationName: 'Workstation Pro 1', gpuModel: 'NVIDIA RTX A6000', vramGb: 48, cpuModel: 'AMD Threadripper PRO 5975WX (32 Cores)', ramGb: 128, storageInfo: '4TB NVMe PCIe 4.0 SSD', status: 'AVAILABLE', labLocation: 'AI Deep Learning Lab - Row 2' },
  { id: 9, workstationCode: 'WS-GPU-09', workstationName: 'Workstation Pro 2', gpuModel: 'NVIDIA RTX A6000', vramGb: 48, cpuModel: 'AMD Threadripper PRO 5975WX (32 Cores)', ramGb: 128, storageInfo: '4TB NVMe PCIe 4.0 SSD', status: 'MAINTENANCE', labLocation: 'AI Deep Learning Lab - Row 2' },
  { id: 10, workstationCode: 'WS-GPU-10', workstationName: 'Workstation Pro 3', gpuModel: 'NVIDIA RTX A5000', vramGb: 24, cpuModel: 'Intel Core i9-13900K (24 Cores)', ramGb: 64, storageInfo: '2TB NVMe PCIe 4.0 SSD', status: 'AVAILABLE', labLocation: 'AI Deep Learning Lab - Row 2' },
  { id: 11, workstationCode: 'WS-GPU-11', workstationName: 'Workstation Beta 1', gpuModel: 'NVIDIA GeForce RTX 3090 Ti', vramGb: 24, cpuModel: 'Intel Core i9-12900K (16 Cores)', ramGb: 64, storageInfo: '2TB NVMe PCIe 4.0 SSD', status: 'AVAILABLE', labLocation: 'AI Deep Learning Lab - Row 3' },
  { id: 12, workstationCode: 'WS-GPU-12', workstationName: 'Workstation Beta 2', gpuModel: 'NVIDIA GeForce RTX 3090', vramGb: 24, cpuModel: 'Intel Core i9-12900K (16 Cores)', ramGb: 64, storageInfo: '2TB NVMe PCIe 4.0 SSD', status: 'AVAILABLE', labLocation: 'AI Deep Learning Lab - Row 3' },
  { id: 13, workstationCode: 'WS-GPU-13', workstationName: 'Workstation Beta 3', gpuModel: 'NVIDIA GeForce RTX 3090', vramGb: 24, cpuModel: 'AMD Ryzen 9 5950X (16 Cores)', ramGb: 64, storageInfo: '2TB NVMe PCIe 4.0 SSD', status: 'AVAILABLE', labLocation: 'AI Deep Learning Lab - Row 3' },
  { id: 14, workstationCode: 'WS-GPU-14', workstationName: 'Workstation Beta 4', gpuModel: 'NVIDIA GeForce RTX 3090', vramGb: 24, cpuModel: 'AMD Ryzen 9 5950X (16 Cores)', ramGb: 64, storageInfo: '2TB NVMe PCIe 4.0 SSD', status: 'RESERVED', labLocation: 'AI Deep Learning Lab - Row 3' },
  { id: 15, workstationCode: 'WS-GPU-15', workstationName: 'Workstation Gamma 1', gpuModel: 'NVIDIA GeForce RTX 4080', vramGb: 16, cpuModel: 'Intel Core i7-14700K (20 Cores)', ramGb: 64, storageInfo: '1TB NVMe PCIe 4.0 SSD', status: 'AVAILABLE', labLocation: 'AI Deep Learning Lab - Row 4' },
  { id: 16, workstationCode: 'WS-GPU-16', workstationName: 'Workstation Gamma 2', gpuModel: 'NVIDIA GeForce RTX 4080', vramGb: 16, cpuModel: 'Intel Core i7-14700K (20 Cores)', ramGb: 64, storageInfo: '1TB NVMe PCIe 4.0 SSD', status: 'AVAILABLE', labLocation: 'AI Deep Learning Lab - Row 4' },
  { id: 17, workstationCode: 'WS-GPU-17', workstationName: 'Workstation Gamma 3', gpuModel: 'NVIDIA GeForce RTX 4070 Ti', vramGb: 12, cpuModel: 'AMD Ryzen 7 7800X3D (8 Cores)', ramGb: 64, storageInfo: '1TB NVMe PCIe 4.0 SSD', status: 'AVAILABLE', labLocation: 'AI Deep Learning Lab - Row 4' },
  { id: 18, workstationCode: 'WS-GPU-18', workstationName: 'Workstation Gamma 4', gpuModel: 'NVIDIA GeForce RTX 4070 Ti', vramGb: 12, cpuModel: 'AMD Ryzen 7 7800X3D (8 Cores)', ramGb: 64, storageInfo: '1TB NVMe PCIe 4.0 SSD', status: 'AVAILABLE', labLocation: 'AI Deep Learning Lab - Row 4' },
  { id: 19, workstationCode: 'WS-GPU-19', workstationName: 'Workstation Delta 1', gpuModel: 'Dual NVIDIA RTX 4090 (SLI/NVLink)', vramGb: 48, cpuModel: 'AMD Threadripper 7970X (32 Cores)', ramGb: 192, storageInfo: '4TB NVMe PCIe 5.0 SSD', status: 'AVAILABLE', labLocation: 'AI Deep Learning Lab - Row 5' },
  { id: 20, workstationCode: 'WS-GPU-20', workstationName: 'Workstation Delta 2', gpuModel: 'Dual NVIDIA RTX 4090 (SLI/NVLink)', vramGb: 48, cpuModel: 'AMD Threadripper 7970X (32 Cores)', ramGb: 192, storageInfo: '4TB NVMe PCIe 5.0 SSD', status: 'AVAILABLE', labLocation: 'AI Deep Learning Lab - Row 5' }
];

const FALLBACK_BOOKINGS = [
  {
    id: 1,
    studentId: 1,
    rollNumber: 'AI2024-001',
    studentName: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    workstationId: 3,
    workstationCode: 'WS-GPU-03',
    workstationName: 'Workstation Alpha 3',
    gpuModel: 'NVIDIA GeForce RTX 4090',
    vramGb: 24,
    labLocation: 'AI Deep Learning Lab - Row 1',
    bookingDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '11:00',
    projectTitle: 'Vision Transformer (ViT) Fine-tuning on Medical Imaging',
    modelFramework: 'PyTorch 2.3 + HuggingFace',
    status: 'CONFIRMED',
    checkedInAt: null,
    releasedAt: null,
    assistantNotes: 'Morning slot reserved for ViT fine-tuning'
  },
  {
    id: 2,
    studentId: 2,
    rollNumber: 'AI2024-014',
    studentName: 'Diya Patel',
    email: 'diya.patel@college.edu',
    workstationId: 5,
    workstationCode: 'WS-GPU-05',
    workstationName: 'Workstation Titan 1',
    gpuModel: 'NVIDIA A100 Tensor Core',
    vramGb: 80,
    labLocation: 'AI Deep Learning Lab - Cluster Rack A',
    bookingDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '12:00',
    projectTitle: 'LLaMA-3 8B Quantized LoRA Parameter-Efficient Fine-Tuning',
    modelFramework: 'PyTorch + vLLM + Unsloth',
    status: 'IN_USE',
    checkedInAt: new Date().toISOString(),
    releasedAt: null,
    assistantNotes: 'Checked in by Lab Assistant. High VRAM allocated.'
  },
  {
    id: 3,
    studentId: 3,
    rollNumber: 'AI2024-027',
    studentName: 'Rohan Iyer',
    email: 'rohan.iyer@college.edu',
    workstationId: 14,
    workstationCode: 'WS-GPU-14',
    workstationName: 'Workstation Beta 4',
    gpuModel: 'NVIDIA GeForce RTX 3090',
    vramGb: 24,
    labLocation: 'AI Deep Learning Lab - Row 3',
    bookingDate: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '16:00',
    projectTitle: 'YOLOv10 Real-time Drone Surveillance Object Detection',
    modelFramework: 'Ultralytics + TensorRT',
    status: 'CONFIRMED',
    checkedInAt: null,
    releasedAt: null,
    assistantNotes: 'Scheduled afternoon session'
  }
];

// DOM Elements
const backendStatusPill = document.getElementById('backend-status-pill');
const backendStatusText = document.getElementById('backend-status-text');
const workstationsGridContainer = document.getElementById('workstations-grid-container');
const studentBookingsTableBody = document.getElementById('student-bookings-table-body');
const assistantDeskTableBody = document.getElementById('assistant-desk-table-body');
const assistantMaintenanceTableBody = document.getElementById('assistant-maintenance-table-body');
const formWorkstationSelect = document.getElementById('form-workstation');
const reservationForm = document.getElementById('reservation-form');
const formValidationAlert = document.getElementById('form-validation-alert');
const previewSpecsBody = document.getElementById('preview-specs-body');
const durationCounter = document.getElementById('duration-counter');
const toastContainer = document.getElementById('toast-container');

// Filters
const filterSearch = document.getElementById('filter-search');
const filterStatus = document.getElementById('filter-status');
const filterGpu = document.getElementById('filter-gpu');
const filteredCountBadge = document.getElementById('filtered-count-badge');

// KPIs
const kpiTotal = document.getElementById('kpi-total-workstations');
const kpiAvailable = document.getElementById('kpi-available-workstations');
const kpiReserved = document.getElementById('kpi-reserved-workstations');
const kpiInUse = document.getElementById('kpi-in-use-workstations');

// Modals
let wsDetailsModalInstance = null;
let releaseModalInstance = null;

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize modals
  const wsDetailsEl = document.getElementById('workstationDetailsModal');
  if (wsDetailsEl) wsDetailsModalInstance = new bootstrap.Modal(wsDetailsEl);

  const relModalEl = document.getElementById('releaseModal');
  if (relModalEl) releaseModalInstance = new bootstrap.Modal(relModalEl);

  // Set default date
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('form-booking-date');
  if (dateInput) {
    dateInput.value = today;
    dateInput.min = today;
  }

  // Set default time inputs
  setupDefaultTimes();

  // Navigation Click Handlers
  setupNavigationHandlers();

  // Filter Listeners
  if (filterSearch) filterSearch.addEventListener('input', renderFilteredWorkstations);
  if (filterStatus) filterStatus.addEventListener('change', renderFilteredWorkstations);
  if (filterGpu) filterGpu.addEventListener('change', renderFilteredWorkstations);

  // Time & Duration Listeners
  const startTimeInput = document.getElementById('form-start-time');
  const endTimeInput = document.getElementById('form-end-time');
  if (startTimeInput) startTimeInput.addEventListener('input', updateDurationMeter);
  if (endTimeInput) endTimeInput.addEventListener('input', updateDurationMeter);

  // Workstation select listener for live preview
  if (formWorkstationSelect) {
    formWorkstationSelect.addEventListener('change', (e) => {
      updateSelectedWorkstationPreview(e.target.value);
    });
  }

  // Reservation Form Submit
  if (reservationForm) reservationForm.addEventListener('submit', handleReservationSubmit);

  // Refresh Button
  const btnRefresh = document.getElementById('btn-refresh-data');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', async () => {
      btnRefresh.querySelector('i').classList.add('bi-spin');
      await syncData();
      btnRefresh.querySelector('i').classList.remove('bi-spin');
      showToast('info', 'Refreshed', 'Workstation catalog and reservations updated.');
    });
  }

  // Confirm Release Button
  const btnConfirmRelease = document.getElementById('btn-confirm-release');
  if (btnConfirmRelease) {
    btnConfirmRelease.addEventListener('click', handleConfirmRelease);
  }

  // Initial Sync
  await syncData();
  updateDurationMeter();
});

// ==========================================================================
// NAVIGATION (FLEET, RESERVE, BOOKINGS, ASSISTANT)
// ==========================================================================
function setupNavigationHandlers() {
  const desktopBtns = document.querySelectorAll('.desktop-nav-pills .nav-pill-btn');
  const mobileBtns = document.querySelectorAll('.mobile-bottom-nav .mobile-nav-item');

  const allNavBtns = [...desktopBtns, ...mobileBtns];

  allNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      navigateToSection(target);
    });
  });
}

function navigateToSection(sectionId, preselectedWsId = null) {
  currentSection = sectionId;

  // Hide all sections
  const sections = document.querySelectorAll('.app-section');
  sections.forEach(s => s.classList.add('d-none'));

  // Show target section
  const targetSection = document.getElementById(`section-${sectionId}`);
  if (targetSection) targetSection.classList.remove('d-none');

  // Update navigation button active states
  document.querySelectorAll('.desktop-nav-pills .nav-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-target') === sectionId);
  });
  document.querySelectorAll('.mobile-bottom-nav .mobile-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-target') === sectionId);
  });

  // If navigating to reserve with preselected workstation
  if (sectionId === 'reserve') {
    if (preselectedWsId && formWorkstationSelect) {
      formWorkstationSelect.value = preselectedWsId;
      updateSelectedWorkstationPreview(preselectedWsId);
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================================
// DATA SYNC & API CALLS
// ==========================================================================
async function syncData() {
  try {
    const wsResponse = await fetch(`${API_BASE_URL}/workstations`, { method: 'GET' });
    if (wsResponse.ok) {
      workstations = await wsResponse.json();
      isBackendOnline = true;
    } else {
      throw new Error('Backend HTTP error');
    }

    const bookingsResponse = await fetch(`${API_BASE_URL}/bookings`, { method: 'GET' });
    if (bookingsResponse.ok) {
      bookings = await bookingsResponse.json();
    }
  } catch (err) {
    isBackendOnline = false;
    if (workstations.length === 0) {
      workstations = JSON.parse(JSON.stringify(FALLBACK_WORKSTATIONS));
    }
    if (bookings.length === 0) {
      bookings = JSON.parse(JSON.stringify(FALLBACK_BOOKINGS));
    }
  }

  updateBackendStatusIndicator();
  updateKPIs();
  populateWorkstationDropdown();
  renderFilteredWorkstations();
  renderStudentBookings();
  renderAssistantDesk();

  // If a workstation is currently selected, refresh its preview
  if (formWorkstationSelect && formWorkstationSelect.value) {
    updateSelectedWorkstationPreview(formWorkstationSelect.value);
  }
}

function updateBackendStatusIndicator() {
  if (isBackendOnline) {
    backendStatusPill.className = 'system-status-pill';
    backendStatusPill.style.background = 'rgba(16, 185, 129, 0.2)';
    backendStatusPill.style.color = '#34d399';
    backendStatusText.textContent = 'REST API Online';
  } else {
    backendStatusPill.className = 'system-status-pill';
    backendStatusPill.style.background = 'rgba(245, 158, 11, 0.2)';
    backendStatusPill.style.color = '#fbbf24';
    backendStatusText.textContent = 'Standalone Mode';
  }
}

function updateKPIs() {
  const total = workstations.length;
  const available = workstations.filter(w => w.status === 'AVAILABLE').length;
  const reserved = workstations.filter(w => w.status === 'RESERVED').length;
  const inUse = workstations.filter(w => w.status === 'IN_USE').length;

  if (kpiTotal) kpiTotal.textContent = total;
  if (kpiAvailable) kpiAvailable.textContent = available;
  if (kpiReserved) kpiReserved.textContent = reserved;
  if (kpiInUse) kpiInUse.textContent = inUse;
}

function populateWorkstationDropdown() {
  if (!formWorkstationSelect) return;
  const currentVal = formWorkstationSelect.value;
  formWorkstationSelect.innerHTML = '<option value="">-- Choose an Available Workstation --</option>';

  workstations.forEach(ws => {
    const isAvail = ws.status === 'AVAILABLE';
    const opt = document.createElement('option');
    opt.value = ws.id;
    opt.textContent = `${ws.workstationCode} - ${ws.workstationName} (${ws.gpuModel} ${ws.vramGb}GB) [${ws.status}]`;
    if (!isAvail && ws.status !== 'RESERVED') {
      opt.disabled = true;
    }
    formWorkstationSelect.appendChild(opt);
  });

  if (currentVal) formWorkstationSelect.value = currentVal;
}

function updateSelectedWorkstationPreview(wsId) {
  if (!previewSpecsBody) return;
  const ws = workstations.find(w => String(w.id) === String(wsId));

  if (!ws) {
    previewSpecsBody.innerHTML = `<p class="text-muted small">Please select a workstation to preview hardware specs.</p>`;
    return;
  }

  previewSpecsBody.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-2">
      <span class="workstation-card-code">${escapeHtml(ws.workstationCode)}</span>
      <span class="badge-status ${ws.status}">${escapeHtml(ws.status)}</span>
    </div>
    <div class="fw-bold text-white fs-6 mb-2">${escapeHtml(ws.workstationName)}</div>
    <div class="gpu-highlight w-100 mb-3">
      <i class="bi bi-gpu-card"></i>
      <span>${escapeHtml(ws.gpuModel)} &bull; ${ws.vramGb}GB VRAM</span>
    </div>
    <ul class="spec-list mb-0">
      <li><span>CPU:</span> <span class="val text-truncate" style="max-width: 160px;">${escapeHtml(ws.cpuModel)}</span></li>
      <li><span>System RAM:</span> <span class="val">${ws.ramGb} GB</span></li>
      <li><span>Storage:</span> <span class="val text-truncate" style="max-width: 160px;">${escapeHtml(ws.storageInfo)}</span></li>
      <li><span>Location:</span> <span class="val text-truncate" style="max-width: 160px;">${escapeHtml(ws.labLocation)}</span></li>
    </ul>
  `;
}

// ==========================================================================
// RENDER WORKSTATIONS GRID
// ==========================================================================
function renderFilteredWorkstations() {
  if (!workstationsGridContainer) return;

  const query = (filterSearch?.value || '').toLowerCase().trim();
  const statusFilter = filterStatus?.value || 'ALL';
  const gpuFilter = filterGpu?.value || 'ALL';

  const filtered = workstations.filter(ws => {
    const matchQuery =
      ws.workstationName.toLowerCase().includes(query) ||
      ws.workstationCode.toLowerCase().includes(query) ||
      ws.gpuModel.toLowerCase().includes(query) ||
      ws.cpuModel.toLowerCase().includes(query);

    const matchStatus = statusFilter === 'ALL' || ws.status === statusFilter;
    const matchGpu = gpuFilter === 'ALL' || ws.gpuModel.toLowerCase().includes(gpuFilter.toLowerCase());

    return matchQuery && matchStatus && matchGpu;
  });

  if (filteredCountBadge) {
    filteredCountBadge.textContent = `Showing ${filtered.length} of ${workstations.length} Workstations`;
  }

  workstationsGridContainer.innerHTML = '';

  if (filtered.length === 0) {
    workstationsGridContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-cpu fs-1 text-muted"></i>
        <p class="mt-3 text-secondary">No workstations match the selected criteria.</p>
        <button class="btn btn-outline-custom btn-sm mt-1" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  filtered.forEach(ws => {
    const cardCol = document.createElement('div');
    cardCol.className = 'col-12 col-sm-6 col-lg-4 col-xl-3';

    const isAvailable = ws.status === 'AVAILABLE';
    const reserveButtonDisabled = !isAvailable ? 'disabled' : '';

    cardCol.innerHTML = `
      <div class="workstation-card">
        <div>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="workstation-card-code">${escapeHtml(ws.workstationCode)}</span>
            <span class="badge-status ${ws.status}">${escapeHtml(ws.status.replace('_', ' '))}</span>
          </div>
          <h3 class="workstation-card-title">${escapeHtml(ws.workstationName)}</h3>
          <div class="gpu-highlight">
            <i class="bi bi-gpu-card"></i>
            <span>${escapeHtml(ws.gpuModel)} &bull; ${ws.vramGb}GB</span>
          </div>
          <ul class="spec-list">
            <li><span>CPU:</span> <span class="val text-truncate" style="max-width: 150px;">${escapeHtml(ws.cpuModel)}</span></li>
            <li><span>RAM:</span> <span class="val">${ws.ramGb} GB</span></li>
            <li><span>Storage:</span> <span class="val">${escapeHtml(ws.storageInfo)}</span></li>
          </ul>
        </div>
        <div class="d-flex gap-2 pt-2 border-top border-secondary border-opacity-25">
          <button class="btn btn-outline-custom btn-sm flex-fill" onclick="viewWorkstationDetails(${ws.id})">
            <i class="bi bi-info-circle me-1"></i>Specs
          </button>
          <button class="btn btn-primary-custom btn-sm flex-fill" ${reserveButtonDisabled} onclick="navigateToSection('reserve', ${ws.id})">
            <i class="bi bi-calendar-check me-1"></i>Reserve
          </button>
        </div>
      </div>
    `;
    workstationsGridContainer.appendChild(cardCol);
  });
}

function resetFilters() {
  if (filterSearch) filterSearch.value = '';
  if (filterStatus) filterStatus.value = 'ALL';
  if (filterGpu) filterGpu.value = 'ALL';
  renderFilteredWorkstations();
}

// ==========================================================================
// RENDER STUDENT BOOKINGS TABLE
// ==========================================================================
function renderStudentBookings() {
  if (!studentBookingsTableBody) return;
  studentBookingsTableBody.innerHTML = '';

  if (bookings.length === 0) {
    studentBookingsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4 text-muted">
          No bookings on record. Navigate to "Reserve Workstation" to schedule a deep learning session.
        </td>
      </tr>
    `;
    return;
  }

  bookings.forEach(b => {
    const tr = document.createElement('tr');

    let badgeClass = 'bg-secondary';
    if (b.status === 'CONFIRMED') badgeClass = 'bg-warning text-dark';
    else if (b.status === 'IN_USE') badgeClass = 'bg-info text-dark';
    else if (b.status === 'COMPLETED') badgeClass = 'bg-success';
    else if (b.status === 'CANCELLED') badgeClass = 'bg-danger';

    const canCancel = b.status === 'CONFIRMED';

    tr.innerHTML = `
      <td class="font-monospace fw-bold text-primary">#${b.id}</td>
      <td>
        <div class="fw-semibold">${escapeHtml(b.studentName || 'Student')}</div>
        <small class="text-secondary font-monospace">${escapeHtml(b.rollNumber || '')}</small>
      </td>
      <td>
        <div class="fw-semibold">${escapeHtml(b.workstationName || b.workstationCode || 'Workstation')}</div>
        <small class="text-info">${escapeHtml(b.gpuModel || '')}</small>
      </td>
      <td>
        <div><i class="bi bi-calendar3 me-1 text-secondary"></i>${escapeHtml(b.bookingDate || '')}</div>
        <small class="text-secondary font-monospace">${escapeHtml(formatTime(b.startTime))} - ${escapeHtml(formatTime(b.endTime))}</small>
      </td>
      <td>
        <div class="text-truncate" style="max-width: 220px;" title="${escapeHtml(b.projectTitle)}">${escapeHtml(b.projectTitle)}</div>
        <small class="text-secondary text-truncate d-block" style="max-width: 200px;">${escapeHtml(b.modelFramework)}</small>
      </td>
      <td><span class="badge ${badgeClass}">${escapeHtml(b.status)}</span></td>
      <td class="text-end">
        ${canCancel ? `
          <button class="btn btn-outline-danger btn-sm" onclick="cancelReservation(${b.id})">
            <i class="bi bi-x-circle me-1"></i>Cancel
          </button>
        ` : `<span class="text-muted small">--</span>`}
      </td>
    `;
    studentBookingsTableBody.appendChild(tr);
  });
}

// ==========================================================================
// RENDER LAB ASSISTANT DESK
// ==========================================================================
function renderAssistantDesk() {
  if (!assistantDeskTableBody) return;
  assistantDeskTableBody.innerHTML = '';

  if (bookings.length === 0) {
    assistantDeskTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-4 text-muted">No reservations in the system.</td>
      </tr>
    `;
  } else {
    bookings.forEach(b => {
      const tr = document.createElement('tr');

      let badgeClass = 'bg-secondary';
      if (b.status === 'CONFIRMED') badgeClass = 'bg-warning text-dark';
      else if (b.status === 'IN_USE') badgeClass = 'bg-info text-dark';
      else if (b.status === 'COMPLETED') badgeClass = 'bg-success';
      else if (b.status === 'CANCELLED') badgeClass = 'bg-danger';

      const isConfirmed = b.status === 'CONFIRMED';
      const isInUse = b.status === 'IN_USE';

      tr.innerHTML = `
        <td class="font-monospace fw-bold text-primary">#${b.id}</td>
        <td>
          <div class="fw-semibold">${escapeHtml(b.studentName)}</div>
          <small class="text-secondary font-monospace">${escapeHtml(b.rollNumber)} &bull; ${escapeHtml(b.email)}</small>
        </td>
        <td>
          <div class="fw-semibold">${escapeHtml(b.workstationCode)}</div>
          <small class="text-secondary">${escapeHtml(b.gpuModel)}</small>
        </td>
        <td>
          <div>${escapeHtml(b.bookingDate)}</div>
          <small class="font-monospace text-secondary">${escapeHtml(formatTime(b.startTime))} - ${escapeHtml(formatTime(b.endTime))}</small>
        </td>
        <td>
          <div class="text-truncate" style="max-width: 170px;" title="${escapeHtml(b.projectTitle)}">${escapeHtml(b.projectTitle)}</div>
          <small class="text-secondary text-truncate d-block" style="max-width: 150px;">${escapeHtml(b.modelFramework)}</small>
        </td>
        <td><span class="badge ${badgeClass}">${escapeHtml(b.status)}</span></td>
        <td>
          <small class="text-secondary">${b.checkedInAt ? new Date(b.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}</small>
        </td>
        <td class="text-end">
          <div class="btn-group btn-group-sm">
            ${isConfirmed ? `
              <button class="btn btn-sm btn-info" onclick="checkInBooking(${b.id})" title="Check-In Student">
                <i class="bi bi-box-arrow-in-right me-1"></i>Check-In
              </button>
            ` : ''}
            ${isInUse ? `
              <button class="btn btn-sm btn-success" onclick="openReleaseModal(${b.id})" title="Release GPU">
                <i class="bi bi-check-circle me-1"></i>Release
              </button>
            ` : ''}
            ${(isConfirmed || isInUse) ? `
              <button class="btn btn-sm btn-outline-danger" onclick="cancelReservation(${b.id})" title="Cancel slot">
                <i class="bi bi-trash"></i>
              </button>
            ` : `<span class="text-muted small px-2">Finalized</span>`}
          </div>
        </td>
      `;
      assistantDeskTableBody.appendChild(tr);
    });
  }

  // Render Assistant Maintenance Table
  if (!assistantMaintenanceTableBody) return;
  assistantMaintenanceTableBody.innerHTML = '';

  workstations.forEach(ws => {
    const tr = document.createElement('tr');
    const isMaintenance = ws.status === 'MAINTENANCE';

    tr.innerHTML = `
      <td class="font-monospace fw-bold text-info">${escapeHtml(ws.workstationCode)}</td>
      <td class="fw-semibold">${escapeHtml(ws.workstationName)}</td>
      <td><small class="text-secondary">${escapeHtml(ws.gpuModel)} (${ws.vramGb}GB)</small></td>
      <td><small class="text-secondary">${escapeHtml(ws.labLocation)}</small></td>
      <td><span class="badge-status ${ws.status}">${escapeHtml(ws.status)}</span></td>
      <td class="text-end">
        <button class="btn btn-sm ${isMaintenance ? 'btn-success' : 'btn-outline-warning'}" onclick="toggleWorkstationMaintenance(${ws.id}, '${ws.status}')">
          <i class="bi ${isMaintenance ? 'bi-check-lg' : 'bi-wrench'} me-1"></i>
          ${isMaintenance ? 'Restore Online' : 'Set Maintenance'}
        </button>
      </td>
    `;
    assistantMaintenanceTableBody.appendChild(tr);
  });
}

// ==========================================================================
// RESERVATION CREATION & VALIDATION
// ==========================================================================
function updateDurationMeter() {
  const startTime = document.getElementById('form-start-time')?.value;
  const endTime = document.getElementById('form-end-time')?.value;
  if (!durationCounter) return;

  if (!startTime || !endTime) {
    durationCounter.innerHTML = `<i class="bi bi-stopwatch"></i> Duration: --`;
    return;
  }

  const mins = calculateMinutesBetween(startTime, endTime);
  if (mins <= 0) {
    durationCounter.className = 'duration-meter-pill text-danger border-danger';
    durationCounter.innerHTML = `<i class="bi bi-exclamation-triangle"></i> Invalid: Start time must precede End time`;
  } else if (mins > 120) {
    durationCounter.className = 'duration-meter-pill text-danger border-danger';
    durationCounter.innerHTML = `<i class="bi bi-exclamation-circle"></i> Duration: ${mins} mins (Exceeds 120m Limit)`;
  } else {
    durationCounter.className = 'duration-meter-pill text-success border-success';
    durationCounter.innerHTML = `<i class="bi bi-check2-circle"></i> Duration: ${mins} mins (Policy Compliant)`;
  }
}

async function handleReservationSubmit(e) {
  e.preventDefault();
  if (formValidationAlert) formValidationAlert.classList.add('d-none');

  const rollNumber = document.getElementById('form-roll-number').value.trim();
  const studentName = document.getElementById('form-student-name').value.trim();
  const email = document.getElementById('form-email').value.trim();
  const workstationId = parseInt(document.getElementById('form-workstation').value, 10);
  const bookingDate = document.getElementById('form-booking-date').value;
  const startTime = document.getElementById('form-start-time').value;
  const endTime = document.getElementById('form-end-time').value;
  const projectTitle = document.getElementById('form-project-title').value.trim();
  const modelFramework = document.getElementById('form-model-framework').value.trim();

  // Validate required fields
  if (!rollNumber || !studentName || !email || !workstationId || !bookingDate || !startTime || !endTime || !projectTitle || !modelFramework) {
    showFormError('Please fill in all required fields.');
    return;
  }

  // Validate start time < end time
  if (startTime >= endTime) {
    showFormError('Start time must be strictly before end time.');
    return;
  }

  // Validate 2-hour limit (Rule 1)
  const durationMinutes = calculateMinutesBetween(startTime, endTime);
  if (durationMinutes <= 0) {
    showFormError('Reservation duration must be greater than zero.');
    return;
  }
  if (durationMinutes > 120) {
    showFormError(`Selected duration is ${durationMinutes} minutes. Lab policy strictly enforces a maximum duration of 2 hours (120 minutes).`);
    return;
  }

  const payload = {
    rollNumber,
    studentName,
    email,
    workstationId,
    bookingDate,
    startTime: startTime.length === 5 ? `${startTime}:00` : startTime,
    endTime: endTime.length === 5 ? `${endTime}:00` : endTime,
    projectTitle,
    modelFramework,
    department: 'Artificial Intelligence & Data Science',
    semester: 4
  };

  const btnSubmit = document.getElementById('btn-submit-booking');
  const spinner = document.getElementById('booking-spinner');
  if (btnSubmit) btnSubmit.disabled = true;
  if (spinner) spinner.classList.remove('d-none');

  try {
    if (isBackendOnline) {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.message || responseData.error || 'Reservation rejected.');
      }

      showToast('success', 'Reservation Confirmed!', `Slot booked for Workstation #${workstationId}.`);
    } else {
      simulateOfflineBooking(payload);
      showToast('success', 'Reservation Recorded!', `Slot booked for ${payload.studentName}.`);
    }

    reservationForm.reset();
    setupDefaultTimes();
    await syncData();

    // Switch directly to the active queue section so user sees their new reservation!
    navigateToSection('bookings');
  } catch (error) {
    showFormError(error.message);
    showToast('error', 'Booking Conflict', error.message);
  } finally {
    if (btnSubmit) btnSubmit.disabled = false;
    if (spinner) spinner.classList.add('d-none');
  }
}

function showFormError(msg) {
  if (formValidationAlert) {
    formValidationAlert.textContent = msg;
    formValidationAlert.classList.remove('d-none');
  }
}

function calculateMinutesBetween(start, end) {
  const [h1, m1] = start.split(':').map(Number);
  const [h2, m2] = end.split(':').map(Number);
  return (h2 * 60 + m2) - (h1 * 60 + m1);
}

function simulateOfflineBooking(payload) {
  const existingActive = bookings.filter(b =>
    b.rollNumber === payload.rollNumber &&
    b.bookingDate === payload.bookingDate &&
    (b.status === 'CONFIRMED' || b.status === 'IN_USE')
  );
  if (existingActive.length > 0) {
    throw new Error(`Student ${payload.rollNumber} already has an active reservation on ${payload.bookingDate}. (Max 1 per day)`);
  }

  const conflict = bookings.find(b =>
    b.workstationId === payload.workstationId &&
    b.bookingDate === payload.bookingDate &&
    (b.status === 'CONFIRMED' || b.status === 'IN_USE') &&
    (payload.startTime < b.endTime && payload.endTime > b.startTime)
  );
  if (conflict) {
    throw new Error(`Time slot conflict: Workstation already booked from ${conflict.startTime} to ${conflict.endTime}`);
  }

  const ws = workstations.find(w => w.id === payload.workstationId);
  const newBooking = {
    id: Date.now() % 10000,
    studentId: 99,
    rollNumber: payload.rollNumber,
    studentName: payload.studentName,
    email: payload.email,
    department: payload.department,
    workstationId: payload.workstationId,
    workstationCode: ws ? ws.workstationCode : 'WS',
    workstationName: ws ? ws.workstationName : 'Workstation',
    gpuModel: ws ? ws.gpuModel : 'GPU',
    vramGb: ws ? ws.vramGb : 24,
    labLocation: ws ? ws.labLocation : 'AI Lab',
    bookingDate: payload.bookingDate,
    startTime: payload.startTime,
    endTime: payload.endTime,
    projectTitle: payload.projectTitle,
    modelFramework: payload.modelFramework,
    status: 'CONFIRMED',
    checkedInAt: null,
    releasedAt: null,
    assistantNotes: 'Booked via Portal'
  };

  bookings.unshift(newBooking);
  if (ws && ws.status === 'AVAILABLE') {
    ws.status = 'RESERVED';
  }
}

// ==========================================================================
// LAB ASSISTANT DESK ACTIONS
// ==========================================================================
async function checkInBooking(bookingId) {
  try {
    if (isBackendOnline) {
      const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/checkin`, { method: 'PUT' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Check-in failed');
    } else {
      const b = bookings.find(item => item.id === bookingId);
      if (b) {
        b.status = 'IN_USE';
        b.checkedInAt = new Date().toISOString();
        const ws = workstations.find(w => w.id === b.workstationId);
        if (ws) ws.status = 'IN_USE';
      }
    }
    showToast('success', 'Student Checked In', `Reservation #${bookingId} is now IN_USE.`);
    await syncData();
  } catch (err) {
    showToast('error', 'Action Failed', err.message);
  }
}

function openReleaseModal(bookingId) {
  const hiddenId = document.getElementById('release-booking-id');
  const notesField = document.getElementById('release-notes');
  if (hiddenId) hiddenId.value = bookingId;
  if (notesField) notesField.value = '';
  if (releaseModalInstance) releaseModalInstance.show();
}

async function handleConfirmRelease() {
  const hiddenId = document.getElementById('release-booking-id');
  const notesField = document.getElementById('release-notes');
  const bookingId = hiddenId?.value;
  const assistantNotes = notesField?.value || '';

  if (!bookingId) return;

  try {
    if (isBackendOnline) {
      const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/release`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assistantNotes })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Release failed');
    } else {
      const b = bookings.find(item => item.id === Number(bookingId));
      if (b) {
        b.status = 'COMPLETED';
        b.releasedAt = new Date().toISOString();
        b.assistantNotes = assistantNotes;
        const ws = workstations.find(w => w.id === b.workstationId);
        if (ws) ws.status = 'AVAILABLE';
      }
    }

    if (releaseModalInstance) releaseModalInstance.hide();
    showToast('success', 'Workstation Released', `Booking #${bookingId} completed and GPU freed.`);
    await syncData();
  } catch (err) {
    showToast('error', 'Release Failed', err.message);
  }
}

async function toggleWorkstationMaintenance(workstationId, currentStatus) {
  const targetStatus = currentStatus === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';

  try {
    if (isBackendOnline) {
      const res = await fetch(`${API_BASE_URL}/workstations/${workstationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus, notes: 'Toggled by Lab Assistant' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Status update failed');
    } else {
      const ws = workstations.find(w => w.id === workstationId);
      if (ws) ws.status = targetStatus;
    }

    showToast('info', 'Hardware Status Updated', `Workstation #${workstationId} set to ${targetStatus}.`);
    await syncData();
  } catch (err) {
    showToast('error', 'Status Update Error', err.message);
  }
}

async function cancelReservation(bookingId) {
  if (!confirm(`Are you sure you want to cancel reservation #${bookingId}?`)) return;

  try {
    if (isBackendOnline) {
      const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Cancellation failed');
      }
    } else {
      const b = bookings.find(item => item.id === bookingId);
      if (b) {
        b.status = 'CANCELLED';
        const ws = workstations.find(w => w.id === b.workstationId);
        if (ws && ws.status !== 'MAINTENANCE') ws.status = 'AVAILABLE';
      }
    }

    showToast('info', 'Reservation Cancelled', `Booking #${bookingId} has been cancelled.`);
    await syncData();
  } catch (err) {
    showToast('error', 'Cancellation Error', err.message);
  }
}

// ==========================================================================
// WORKSTATION SPECS MODAL
// ==========================================================================
function viewWorkstationDetails(workstationId) {
  const ws = workstations.find(w => w.id === workstationId);
  if (!ws) return;

  const titleEl = document.getElementById('wsDetailsModalTitle');
  const bodyEl = document.getElementById('wsDetailsModalBody');
  const btnReserve = document.getElementById('btn-reserve-from-details');

  if (titleEl) titleEl.textContent = `${ws.workstationCode} - ${ws.workstationName}`;

  if (bodyEl) {
    bodyEl.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <span class="badge-status ${ws.status}">${escapeHtml(ws.status)}</span>
        <span class="text-secondary small font-monospace"><i class="bi bi-geo-alt me-1"></i>${escapeHtml(ws.labLocation)}</span>
      </div>
      <div class="card p-3 mb-3" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12);">
        <h4 class="h6 fw-bold text-info mb-1"><i class="bi bi-gpu-card me-2"></i>GPU Specifications</h4>
        <p class="mb-1 fw-bold text-white fs-5">${escapeHtml(ws.gpuModel)}</p>
        <p class="mb-0 text-secondary small">Dedicated Video Memory: <strong>${ws.vramGb} GB GDDR6X / HBM2e</strong></p>
      </div>
      <table class="table table-sm table-borderless text-secondary small mb-0">
        <tr><td class="fw-semibold text-light" style="width: 35%;">Processor (CPU):</td><td>${escapeHtml(ws.cpuModel)}</td></tr>
        <tr><td class="fw-semibold text-light">System RAM:</td><td>${ws.ramGb} GB ECC / DDR5</td></tr>
        <tr><td class="fw-semibold text-light">Storage:</td><td>${escapeHtml(ws.storageInfo)}</td></tr>
        <tr><td class="fw-semibold text-light">CUDA Support:</td><td>CUDA 12.4 / cuDNN 9.1</td></tr>
      </table>
    `;
  }

  if (btnReserve) {
    btnReserve.disabled = ws.status !== 'AVAILABLE';
    btnReserve.onclick = () => {
      if (wsDetailsModalInstance) wsDetailsModalInstance.hide();
      navigateToSection('reserve', ws.id);
    };
  }

  if (wsDetailsModalInstance) wsDetailsModalInstance.show();
}

// ==========================================================================
// HELPERS
// ==========================================================================
function setupDefaultTimes() {
  const now = new Date();
  let startHour = now.getHours() + 1;
  if (startHour >= 22) startHour = 9;
  const endHour = Math.min(startHour + 2, 21);

  const pad = (n) => String(n).padStart(2, '0');
  const startTimeInput = document.getElementById('form-start-time');
  const endTimeInput = document.getElementById('form-end-time');

  if (startTimeInput) startTimeInput.value = `${pad(startHour)}:00`;
  if (endTimeInput) endTimeInput.value = `${pad(endHour)}:00`;
}

function showToast(type, title, message) {
  if (!toastContainer) return;

  const toastEl = document.createElement('div');
  toastEl.className = `toast toast-custom ${type} show align-items-center`;
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');

  let icon = 'bi-info-circle text-info';
  if (type === 'success') icon = 'bi-check-circle-fill text-success';
  if (type === 'error') icon = 'bi-exclamation-triangle-fill text-danger';

  toastEl.innerHTML = `
    <div class="toast-header bg-transparent text-white border-0 pb-0">
      <i class="bi ${icon} me-2"></i>
      <strong class="me-auto">${escapeHtml(title)}</strong>
      <button type="button" class="btn-close btn-close-white btn-sm" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body pt-1 text-light small">
      ${escapeHtml(message)}
    </div>
  `;

  toastContainer.appendChild(toastEl);

  setTimeout(() => {
    toastEl.classList.remove('show');
    setTimeout(() => toastEl.remove(), 300);
  }, 4500);
}

function formatTime(t) {
  if (!t) return '';
  return t.length > 5 ? t.substring(0, 5) : t;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
