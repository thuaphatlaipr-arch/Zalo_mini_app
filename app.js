/**
 * Zalo Mini App Logic - VP THADS & Thừa Phát Lại Phan Rang
 * Tương thích ZMP SDK & Trình duyệt di động / Webview
 */

const API_BASE = window.location.origin;

// State management
const state = {
  currentTab: 'home',
  services: [],
  selectedPhotos: [],
  userLocation: null,
  userInfo: {
    name: 'Khách hàng Zalo',
    phone: '',
    avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
  }
};

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  initZaloSDK();
  loadServices();
  setupEventListeners();
  checkUrlParams();
});

// 1. Zalo SDK Bridge & Fallback
function initZaloSDK() {
  if (window.ZMP) {
    try {
      window.ZMP.getUserInfo({
        success: (res) => {
          if (res && res.userInfo) {
            state.userInfo.name = res.userInfo.name || state.userInfo.name;
            state.userInfo.avatar = res.userInfo.avatar || state.userInfo.avatar;
            document.getElementById('user-name-display').innerText = state.userInfo.name;
            document.getElementById('user-avatar-display').src = state.userInfo.avatar;
          }
        },
        fail: (err) => console.log('ZMP getUserInfo fail:', err)
      });
    } catch (e) {
      console.warn('ZMP SDK not fully loaded, using fallback mode');
    }
  }
}

// 2. Tab Navigation System
function switchTab(tabId) {
  state.currentTab = tabId;
  
  // Hide all screens
  document.querySelectorAll('.tab-screen').forEach(el => el.classList.add('hidden'));
  
  // Show target screen
  const targetScreen = document.getElementById(`screen-${tabId}`);
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update bottom nav active state
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('text-blue-900', 'font-bold');
      btn.classList.remove('text-slate-400', 'font-medium');
      const icon = btn.querySelector('.nav-icon');
      if (icon) icon.classList.add('scale-110');
    } else {
      btn.classList.remove('text-blue-900', 'font-bold');
      btn.classList.add('text-slate-400', 'font-medium');
      const icon = btn.querySelector('.nav-icon');
      if (icon) icon.classList.remove('scale-110');
    }
  });
}

// 3. Load Legal Services from API
async function loadServices() {
  try {
    const res = await fetch(`${API_BASE}/api/zalo/services`);
    const data = await res.json();
    if (data.success && data.services) {
      state.services = data.services;
      renderServicesList(data.services);
      renderServiceDropdowns(data.services);
    }
  } catch (err) {
    console.error('Lỗi nạp dịch vụ:', err);
  }
}

function renderServicesList(services) {
  const container = document.getElementById('services-grid-list');
  if (!container) return;

  container.innerHTML = services.map(s => `
    <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
      <div class="flex items-start gap-3">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center text-xl shrink-0 font-bold border border-blue-100">
          <i class="fa-solid fa-${getIconForCategory(s.category)}"></i>
        </div>
        <div class="flex-1">
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">${s.category}</span>
          <h4 class="font-bold text-slate-800 text-sm mt-1 leading-snug">${s.name}</h4>
          <p class="text-xs text-slate-500 mt-1 line-clamp-2">${s.desc}</p>
          <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-bold text-amber-700"><i class="fa-solid fa-tag mr-1"></i>${s.fee_estimate}</span>
            <button onclick="quickBookService('${s.name}')" class="text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition">
              Chọn ngay <i class="fa-solid fa-arrow-right text-[10px] ml-0.5"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function getIconForCategory(cat) {
  if (cat.includes('Vi Bằng')) return 'file-signature';
  if (cat.includes('Tống Đạt')) return 'envelope-circle-check';
  return 'gavel';
}

function renderServiceDropdowns(services) {
  const selectAppointment = document.getElementById('appointment-service');
  const selectVibang = document.getElementById('vibang-service-type');
  
  if (selectAppointment) {
    selectAppointment.innerHTML = '<option value="">-- Chọn dịch vụ cần tư vấn --</option>' + 
      services.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
  }

  if (selectVibang) {
    selectVibang.innerHTML = services.filter(s => s.category.includes('Vi Bằng')).map(s => 
      `<option value="${s.name}">${s.name}</option>`
    ).join('');
  }
}

function quickBookService(serviceName) {
  switchTab('booking');
  const sel = document.getElementById('appointment-service');
  if (sel) sel.value = serviceName;
}

// 4. Quick ViBang Request with Photos & GPS
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Date picker default tomorrow
  const dateInput = document.getElementById('appointment-date');
  if (dateInput) {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    dateInput.value = tmr.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  // Photo uploader
  const photoInput = document.getElementById('vibang-photo-input');
  if (photoInput) {
    photoInput.addEventListener('change', handlePhotoSelection);
  }

  // Appointment Form Submit
  const formApp = document.getElementById('form-appointment');
  if (formApp) {
    formApp.addEventListener('submit', submitAppointmentForm);
  }

  // ViBang Form Submit
  const formVibang = document.getElementById('form-vibang');
  if (formVibang) {
    formVibang.addEventListener('submit', submitVibangForm);
  }

  // Lookup Form
  const formLookup = document.getElementById('form-lookup');
  if (formLookup) {
    formLookup.addEventListener('submit', handleLookupSearch);
  }
}

// Geolocation Handler
function getCurrentLocation() {
  const locDisplay = document.getElementById('vibang-location-status');
  if (locDisplay) locDisplay.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-blue-600"></i> Đang lấy vị trí GPS...';

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        state.userLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        if (locDisplay) {
          locDisplay.innerHTML = `<i class="fa-solid fa-location-dot text-emerald-600"></i> Đã định vị: (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`;
        }
      },
      (err) => {
        if (locDisplay) locDisplay.innerHTML = '<span class="text-rose-500"><i class="fa-solid fa-triangle-exclamation"></i> Không thể lấy GPS tự động, vui lòng nhập rõ địa chỉ.</span>';
      },
      { timeout: 8000 }
    );
  }
}

// Photo Upload Handler
function handlePhotoSelection(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  const previewContainer = document.getElementById('vibang-photo-previews');
  
  files.forEach(file => {
    if (state.selectedPhotos.length >= 6) {
      showToast('Chỉ cho phép tải lên tối đa 6 ảnh hiện trạng', 'warning');
      return;
    }
    state.selectedPhotos.push(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const idx = state.selectedPhotos.length - 1;
      const box = document.createElement('div');
      box.className = 'photo-preview-box animate-scale';
      box.innerHTML = `
        <img src="${event.target.result}" alt="Hiện trạng" />
        <button type="button" class="photo-delete-btn" onclick="removePhoto(${idx})">
          <i class="fa-solid fa-xmark"></i>
        </button>
      `;
      previewContainer.appendChild(box);
    };
    reader.readAsDataURL(file);
  });
}

function removePhoto(idx) {
  state.selectedPhotos.splice(idx, 1);
  const previewContainer = document.getElementById('vibang-photo-previews');
  previewContainer.innerHTML = '';
  state.selectedPhotos.forEach((file, newIdx) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const box = document.createElement('div');
      box.className = 'photo-preview-box';
      box.innerHTML = `
        <img src="${event.target.result}" alt="Hiện trạng" />
        <button type="button" class="photo-delete-btn" onclick="removePhoto(${newIdx})">
          <i class="fa-solid fa-xmark"></i>
        </button>
      `;
      previewContainer.appendChild(box);
    };
    reader.readAsDataURL(file);
  });
}

// 5. Submit Forms
async function submitAppointmentForm(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit-appointment');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Đang gửi thông tin...';

  const payload = {
    fullname: document.getElementById('appointment-name').value,
    phone: document.getElementById('appointment-phone').value,
    service: document.getElementById('appointment-service').value,
    date: document.getElementById('appointment-date').value,
    time_slot: document.getElementById('appointment-time').value,
    note: document.getElementById('appointment-note').value,
    zalo_user_id: state.userInfo.name
  };

  try {
    const res = await fetch(`${API_BASE}/api/zalo/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success) {
      showSuccessModal(
        'Đặt Lịch Hẹn Thành Công!',
        `Mã lịch hẹn của bạn: <strong class="text-blue-900 font-mono text-lg">${result.id}</strong><br><br>Văn phòng THADS & Thừa phát lại Phan Rang sẽ gọi điện xác nhận trong vòng 15-30 phút.`,
        () => {
          document.getElementById('form-appointment').reset();
          switchTab('tracking');
          document.getElementById('lookup-input').value = result.id;
          handleLookupSearch(new Event('submit'));
        }
      );
    } else {
      showToast(result.error || 'Có lỗi xảy ra', 'error');
    }
  } catch (err) {
    showToast('Lỗi kết nối máy chủ', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-calendar-check mr-2"></i> Xác Nhận Đặt Lịch Hẹn';
  }
}

async function submitVibangForm(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit-vibang');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Đang tải hồ sơ & ảnh...';

  const formData = new FormData();
  formData.append('requester_name', document.getElementById('vibang-name').value);
  formData.append('phone', document.getElementById('vibang-phone').value);
  formData.append('address', document.getElementById('vibang-address').value);
  formData.append('service_type', document.getElementById('vibang-service-type').value);
  formData.append('description', document.getElementById('vibang-description').value);

  if (state.userLocation) {
    formData.append('lat', state.userLocation.lat);
    formData.append('lng', state.userLocation.lng);
  }

  state.selectedPhotos.forEach((file, i) => {
    formData.append(`photo_${i}`, file);
  });

  try {
    const res = await fetch(`${API_BASE}/api/zalo/vibang-requests`, {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    if (result.success) {
      showSuccessModal(
        'Tiếp Nhận Yêu Cầu Thành Công!',
        `Mã tra cứu hồ sơ: <strong class="text-blue-900 font-mono text-lg">${result.tracking_code}</strong><br><br>Văn phòng đã tiếp nhận hồ sơ cùng ${result.data.photos_count} ảnh hiện trạng. Thừa phát lại đang xử lý yêu cầu.`,
        () => {
          document.getElementById('form-vibang').reset();
          state.selectedPhotos = [];
          document.getElementById('vibang-photo-previews').innerHTML = '';
          switchTab('tracking');
          document.getElementById('lookup-input').value = result.tracking_code;
          handleLookupSearch(new Event('submit'));
        }
      );
    } else {
      showToast(result.error || 'Có lỗi xảy ra', 'error');
    }
  } catch (err) {
    showToast('Lỗi kết nối máy chủ', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane mr-2"></i> Gửi Yêu Cầu Lập Vi Bằng Ngay';
  }
}

// 6. Realtime Tracking & Progress Stepper
async function handleLookupSearch(e) {
  if (e && e.preventDefault) e.preventDefault();
  const query = document.getElementById('lookup-input').value.trim();
  if (!query) {
    showToast('Vui lòng nhập Mã hồ sơ hoặc SĐT', 'warning');
    return;
  }

  const container = document.getElementById('lookup-results-container');
  container.innerHTML = `
    <div class="text-center py-10">
      <i class="fa-solid fa-circle-notch fa-spin text-3xl text-blue-900 mb-3"></i>
      <p class="text-sm text-slate-500 font-medium">Đang tra cứu cơ sở dữ liệu VP THADS Phan Rang...</p>
    </div>
  `;

  try {
    const res = await fetch(`${API_BASE}/api/zalo/lookup?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.success && data.results && data.results.length > 0) {
      renderTrackingResults(data.results);
    } else {
      container.innerHTML = `
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <i class="fa-solid fa-magnifying-glass-location text-3xl text-amber-600 mb-3"></i>
          <h4 class="font-bold text-slate-800 text-base">Không tìm thấy hồ sơ phù hợp</h4>
          <p class="text-xs text-slate-600 mt-2">Không có kết quả nào cho từ khóa <strong>"${query}"</strong>. Quý khách vui lòng kiểm tra lại số điện thoại hoặc mã hồ sơ (VD: <em>VB-2026/01, YCVB-..., LH-...</em>).</p>
        </div>
      `;
    }
  } catch (err) {
    container.innerHTML = `<div class="p-4 text-center text-red-500 text-sm">Lỗi tra cứu dữ liệu. Vui lòng thử lại.</div>`;
  }
}

function renderTrackingResults(results) {
  const container = document.getElementById('lookup-results-container');
  container.innerHTML = results.map(item => `
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-4 animate-fade-in">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <span class="text-xs font-bold px-2.5 py-1 rounded-full ${getTypeBadgeClass(item.type)}">${item.type}</span>
        <span class="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">${item.code}</span>
      </div>

      <div class="mt-3">
        <h3 class="font-bold text-slate-800 text-base leading-snug">${item.title}</h3>
        <div class="text-xs text-slate-500 mt-1 space-y-1">
          <div><i class="fa-regular fa-user mr-1.5 text-slate-400"></i>Người yêu cầu / Đương sự: <strong class="text-slate-700">${item.customer}</strong></div>
          ${item.phone ? `<div><i class="fa-solid fa-phone mr-1.5 text-slate-400"></i>Số điện thoại: ${item.phone}</div>` : ''}
          ${item.address ? `<div><i class="fa-solid fa-location-dot mr-1.5 text-slate-400"></i>Địa điểm: ${item.address}</div>` : ''}
          <div><i class="fa-regular fa-clock mr-1.5 text-slate-400"></i>Thời gian: ${item.created_at || 'Đang cập nhật'}</div>
        </div>
      </div>

      <!-- Stepper Progress -->
      <div class="mt-5 pt-4 border-t border-slate-100">
        <div class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Tiến độ xử lý</span>
          <span class="text-blue-900 font-bold">Bước ${item.status_step}/5</span>
        </div>
        
        <div class="space-y-3 relative pl-6">
          <div class="step-item ${item.status_step >= 1 ? 'completed' : ''}">
            <div class="text-xs font-bold ${item.status_step >= 1 ? 'text-emerald-700' : 'text-slate-400'}">1. Tiếp nhận yêu cầu</div>
            <div class="text-[11px] text-slate-500">Đã lưu hồ sơ vào hệ điều hành</div>
          </div>
          <div class="step-item ${item.status_step >= 2 ? 'completed' : ''}">
            <div class="text-xs font-bold ${item.status_step >= 2 ? 'text-emerald-700' : 'text-slate-400'}">2. Phân công Thừa phát lại & Thẩm tra</div>
            <div class="text-[11px] text-slate-500">${item.assigned_staff || 'Cử nhân sự chuyên trách'}</div>
          </div>
          <div class="step-item ${item.status_step >= 3 ? 'completed' : ''}">
            <div class="text-xs font-bold ${item.status_step >= 3 ? 'text-emerald-700' : 'text-slate-400'}">3. Lập vi bằng / Tổ chức thực hiện</div>
            <div class="text-[11px] text-slate-500">Ghi nhận hiện trường & biên tập phụ lục</div>
          </div>
          <div class="step-item ${item.status_step >= 4 ? 'completed' : ''}">
            <div class="text-xs font-bold ${item.status_step >= 4 ? 'text-emerald-700' : 'text-slate-400'}">4. Ký duyệt & Đăng ký Sở Tư pháp</div>
            <div class="text-[11px] text-slate-500">Ký phát hành và nộp Cổng DVC</div>
          </div>
          <div class="step-item ${item.status_step >= 5 ? 'completed' : ''}">
            <div class="text-xs font-bold ${item.status_step >= 5 ? 'text-emerald-700' : 'text-slate-400'}">5. Hoàn tất & Bàn giao kết quả</div>
            <div class="text-[11px] text-slate-500">Khách hàng nhận bản chính & bản điện tử</div>
          </div>
        </div>

        <div class="mt-4 p-3 bg-blue-50/80 rounded-xl border border-blue-100 flex items-start gap-2.5">
          <i class="fa-solid fa-circle-info text-blue-800 text-sm mt-0.5"></i>
          <div>
            <div class="text-xs font-bold text-blue-900">${item.status_text}</div>
            <div class="text-xs text-blue-800 mt-0.5">${item.status_desc}</div>
          </div>
        </div>

        ${item.pdf_link ? `
          <div class="mt-3">
            <a href="${API_BASE}${item.pdf_link}" target="_blank" class="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-red-700 shadow-sm transition">
              <i class="fa-solid fa-file-pdf"></i> Tải / Xem Vi Bằng Bản Điện Tử (PDF)
            </a>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function getTypeBadgeClass(type) {
  if (type.includes('HỒ SƠ VI BẰNG')) return 'bg-emerald-100 text-emerald-800';
  if (type.includes('TỐNG ĐẠT')) return 'bg-indigo-100 text-indigo-800';
  if (type.includes('LỊCH HẸN')) return 'bg-amber-100 text-amber-800';
  return 'bg-blue-100 text-blue-800';
}

// 7. Modals & Toast Utility
function showSuccessModal(title, messageHtml, onClose) {
  const modal = document.getElementById('app-modal');
  document.getElementById('modal-title').innerText = title;
  document.getElementById('modal-body').innerHTML = messageHtml;
  modal.classList.remove('hidden');

  const btnClose = document.getElementById('modal-close-btn');
  const handleClose = () => {
    modal.classList.add('hidden');
    btnClose.removeEventListener('click', handleClose);
    if (onClose) onClose();
  };
  btnClose.addEventListener('click', handleClose);
}

function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  const bg = type === 'error' ? 'bg-rose-600' : type === 'warning' ? 'bg-amber-600' : 'bg-slate-800';
  toast.className = `fixed top-5 left-1/2 -translate-x-1/2 z-50 ${bg} text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 animate-fade-in`;
  toast.innerHTML = `<i class="fa-solid fa-${type === 'error' ? 'circle-xmark' : 'circle-check'}"></i> <span>${msg}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  const code = params.get('code');
  if (tab) switchTab(tab);
  if (code) {
    switchTab('tracking');
    document.getElementById('lookup-input').value = code;
    handleLookupSearch(new Event('submit'));
  }
}
