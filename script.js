let codes = JSON.parse(localStorage.getItem('webCodes')) || [];
let currentEditId = null;
let deleteId = null;
let selectedCodes = new Set();
let isExpandedView = false;

const codeTitleInput = document.getElementById('codeTitle');
const htmlCodeInput = document.getElementById('htmlCode');
const cssCodeInput = document.getElementById('cssCode');
const jsCodeInput = document.getElementById('jsCode');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const runCodeBtn = document.getElementById('runCodeBtn');
const codeGrid = document.getElementById('codeGrid');
const previewFrame = document.getElementById('previewFrame');
const refreshPreviewBtn = document.getElementById('refreshPreview');
const totalCodesElement = document.getElementById('total-codes');
const deleteModal = document.getElementById('deleteModal');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const selectAllBtn = document.getElementById('selectAllBtn');
const deselectAllBtn = document.getElementById('deselectAllBtn');
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
const expandViewBtn = document.getElementById('expandView');
const togglePreviewBtn = document.getElementById('togglePreviewBtn');
const expandPreviewBtn = document.getElementById('expandPreviewBtn');
const previewExpandedModal = document.getElementById('previewExpandedModal');
const expandedPreviewFrame = document.getElementById('expandedPreviewFrame');
const closeExpandedPreviewBtn = document.getElementById('closeExpandedPreview');

const htmlCount = document.getElementById('htmlCount');
const cssCount = document.getElementById('cssCount');
const jsCount = document.getElementById('jsCount');

function init() {
    updateCodeList();
    updateStats();
    attachEventListeners();
    updatePreview();
    loadExpandedViewState();
}

function attachEventListeners() {
    saveBtn.addEventListener('click', saveCode);
    resetBtn.addEventListener('click', resetForm);
    runCodeBtn.addEventListener('click', updatePreview);
    refreshPreviewBtn.addEventListener('click', updatePreview);
    
    htmlCodeInput.addEventListener('input', () => {
        htmlCount.textContent = `${htmlCodeInput.value.length} karakter`;
    });
    
    cssCodeInput.addEventListener('input', () => {
        cssCount.textContent = `${cssCodeInput.value.length} karakter`;
    });
    
    jsCodeInput.addEventListener('input', () => {
        jsCount.textContent = `${jsCodeInput.value.length} karakter`;
    });
    
    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });
    
    confirmDeleteBtn.addEventListener('click', () => {
        if (deleteId !== null) {
            deleteCode(deleteId);
            deleteModal.style.display = 'none';
            deleteId = null;
        }
    });
    
    selectAllBtn.addEventListener('click', selectAllCodes);
    deselectAllBtn.addEventListener('click', deselectAllCodes);
    deleteSelectedBtn.addEventListener('click', deleteSelectedCodes);
    expandViewBtn.addEventListener('click', toggleExpandedView);
    expandPreviewBtn.addEventListener('click', expandPreview);
    closeExpandedPreviewBtn.addEventListener('click', closeExpandedPreview);
    
    togglePreviewBtn.addEventListener('click', togglePreview);
    
    window.addEventListener('click', (event) => {
        if (event.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
        if (event.target === previewExpandedModal) {
            previewExpandedModal.style.display = 'none';
        }
    });
    
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && previewExpandedModal.style.display === 'flex') {
            previewExpandedModal.style.display = 'none';
        }
    });
}

function saveCode() {
    const title = codeTitleInput.value.trim();
    const html = htmlCodeInput.value.trim();
    const css = cssCodeInput.value.trim();
    const js = jsCodeInput.value.trim();
    
    if (!title) {
        alert('Silakan masukkan judul kode');
        codeTitleInput.focus();
        return;
    }
    
    const codeData = {
        id: currentEditId || Date.now().toString(),
        title,
        html,
        css,
        js,
        date: new Date().toISOString(),
        created: currentEditId ? getCodeById(currentEditId).created : new Date().toISOString()
    };
    
    if (currentEditId) {
        const index = codes.findIndex(code => code.id === currentEditId);
        if (index !== -1) {
            codes[index] = codeData;
        }
        currentEditId = null;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Kode';
    } else {
        codes.unshift(codeData);
    }
    
    localStorage.setItem('webCodes', JSON.stringify(codes));
    
    updateCodeList();
    updateStats();
    resetForm();
    updatePreview();
    
    showNotification(currentEditId ? 'Kode berhasil diperbarui!' : 'Kode berhasil disimpan!');
}

function deleteCode(id) {
    codes = codes.filter(code => code.id !== id);
    selectedCodes.delete(id);
    localStorage.setItem('webCodes', JSON.stringify(codes));
    updateCodeList();
    updateStats();
    
    if (currentEditId === id) {
        resetForm();
        updatePreview();
    }
    
    showNotification('Kode berhasil dihapus!');
}

function editCode(id) {
    const code = getCodeById(id);
    if (!code) return;
    
    currentEditId = id;
    codeTitleInput.value = code.title;
    htmlCodeInput.value = code.html;
    cssCodeInput.value = code.css;
    jsCodeInput.value = code.js;
    
    htmlCount.textContent = `${code.html.length} karakter`;
    cssCount.textContent = `${code.css.length} karakter`;
    jsCount.textContent = `${code.js.length} karakter`;
    
    saveBtn.innerHTML = '<i class="fas fa-edit"></i> Perbarui Kode';
    
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    
    updatePreview();
}

function resetForm() {
    codeTitleInput.value = '';
    htmlCodeInput.value = '';
    cssCodeInput.value = '';
    jsCodeInput.value = '';
    
    htmlCount.textContent = '0 karakter';
    cssCount.textContent = '0 karakter';
    jsCount.textContent = '0 karakter';
    
    currentEditId = null;
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Kode';
}

function updateCodeList() {
    if (codes.length === 0) {
        codeGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-code"></i>
                <h3>Belum ada kode yang disimpan</h3>
                <p>Mulai dengan menambahkan kode HTML, CSS, dan JavaScript Anda</p>
            </div>
        `;
        return;
    }
    
    codeGrid.innerHTML = codes.map(code => {
        const date = new Date(code.date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        const hasHTML = code.html.length > 0;
        const hasCSS = code.css.length > 0;
        const hasJS = code.js.length > 0;
        
        const langs = [];
        if (hasHTML) langs.push('HTML');
        if (hasCSS) langs.push('CSS');
        if (hasJS) langs.push('JS');
        
        const isSelected = selectedCodes.has(code.id);
        
        return `
            <div class="code-item ${isSelected ? 'selected' : ''}" data-id="${code.id}">
                <div class="code-item-header">
                    <div class="code-title">${code.title}</div>
                    <div class="code-date">${date}</div>
                </div>
                
                <div class="code-content-summary">
                    <div class="code-langs">
                        ${hasHTML ? '<span class="lang-tag lang-html">HTML</span>' : ''}
                        ${hasCSS ? '<span class="lang-tag lang-css">CSS</span>' : ''}
                        ${hasJS ? '<span class="lang-tag lang-js">JavaScript</span>' : ''}
                    </div>
                    <div style="margin-top: 10px; font-size: 0.9rem; color: var(--gray);">
                        ${langs.length > 0 ? `Kode: ${langs.join(', ')}` : 'Tidak ada kode'}
                    </div>
                    <div style="margin-top: 5px; font-size: 0.8rem; color: var(--gray);">
                        ${hasHTML ? `HTML: ${code.html.length} karakter` : ''}<br>
                        ${hasCSS ? `CSS: ${code.css.length} karakter` : ''}<br>
                        ${hasJS ? `JS: ${code.js.length} karakter` : ''}
                    </div>
                </div>
                
                <div class="code-actions">
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${code.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${code.id}">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                    <button class="btn ${isSelected ? 'btn-secondary' : 'btn-success'} btn-sm select-btn" data-id="${code.id}">
                        <i class="fas ${isSelected ? 'fa-times' : 'fa-check'}"></i> ${isSelected ? 'Batal' : 'Pilih'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            editCode(id);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            deleteId = e.currentTarget.getAttribute('data-id');
            deleteModal.style.display = 'flex';
        });
    });
    
    document.querySelectorAll('.select-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = e.currentTarget.getAttribute('data-id');
            toggleSelectCode(id);
        });
    });
    
    document.querySelectorAll('.code-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.code-actions')) {
                const id = e.currentTarget.getAttribute('data-id');
                editCode(id);
            }
        });
    });
}

function toggleSelectCode(id) {
    if (selectedCodes.has(id)) {
        selectedCodes.delete(id);
    } else {
        selectedCodes.add(id);
    }
    updateCodeList();
}

function selectAllCodes() {
    codes.forEach(code => {
        selectedCodes.add(code.id);
    });
    updateCodeList();
}

function deselectAllCodes() {
    selectedCodes.clear();
    updateCodeList();
}

function deleteSelectedCodes() {
    if (selectedCodes.size === 0) {
        alert('Tidak ada kode yang dipilih untuk dihapus');
        return;
    }
    
    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedCodes.size} kode yang dipilih?`)) {
        return;
    }
    
    codes = codes.filter(code => !selectedCodes.has(code.id));
    selectedCodes.clear();
    localStorage.setItem('webCodes', JSON.stringify(codes));
    updateCodeList();
    updateStats();
    
    if (currentEditId && selectedCodes.has(currentEditId)) {
        resetForm();
        updatePreview();
    }
    
    showNotification(`${selectedCodes.size} kode berhasil dihapus!`);
}

function updatePreview() {
    const html = htmlCodeInput.value.trim();
    const css = cssCodeInput.value.trim();
    const js = jsCodeInput.value.trim();
    
    const previewHTML = createPreviewHTML(html, css, js);
    
    previewFrame.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.className = 'preview-iframe';
    iframe.srcdoc = previewHTML;
    previewFrame.appendChild(iframe);
    
    expandedPreviewFrame.innerHTML = '';
    const expandedIframe = document.createElement('iframe');
    expandedIframe.className = 'expanded-preview-iframe';
    expandedIframe.srcdoc = previewHTML;
    expandedPreviewFrame.appendChild(expandedIframe);
}

function createPreviewHTML(html, css, js) {
    if (!html && !css && !js) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { 
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f5f7fb;
                        color: #6c757d;
                        flex-direction: column;
                        gap: 15px;
                        text-align: center;
                        padding: 20px;
                        margin: 0;
                    }
                    i { font-size: 3rem; }
                </style>
            </head>
            <body>
                <i class="fas fa-laptop-code"></i>
                <h3>Pratinjau Kode</h3>
                <p>Pratinjau akan muncul di sini ketika Anda menyimpan atau memilih kode</p>
            </body>
            </html>
        `;
    }
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                ${css}
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    padding: 20px;
                    margin: 0;
                    background-color: #f5f7fb;
                }
                .preview-header {
                    text-align: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #ddd;
                    color: #333;
                }
                .code-info {
                    background-color: #e9ecef;
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    font-size: 0.9rem;
                }
            </style>
        </head>
        <body>
            <div class="preview-header">
                <h3>Pratinjau Kode</h3>
                <p>Ini adalah hasil dari kode yang Anda masukkan</p>
                <div class="code-info">
                    ${html ? 'HTML tersedia' : ''} ${css ? '| CSS tersedia' : ''} ${js ? '| JavaScript tersedia' : ''}
                </div>
            </div>
            ${html}
            <script>
                ${js}
            <\/script>
        </body>
        </html>
    `;
}

function toggleExpandedView() {
    isExpandedView = !isExpandedView;
    
    if (isExpandedView) {
        document.body.classList.add('expanded-view');
        expandViewBtn.innerHTML = '<i class="fas fa-compress"></i>';
        expandViewBtn.title = 'Kembali ke tampilan normal';
    } else {
        document.body.classList.remove('expanded-view');
        expandViewBtn.innerHTML = '<i class="fas fa-expand"></i>';
        expandViewBtn.title = 'Perluas tampilan';
    }
    
    localStorage.setItem('webCodesExpandedView', isExpandedView);
}

function loadExpandedViewState() {
    const savedState = localStorage.getItem('webCodesExpandedView');
    if (savedState === 'true') {
        isExpandedView = true;
        document.body.classList.add('expanded-view');
        expandViewBtn.innerHTML = '<i class="fas fa-compress"></i>';
        expandViewBtn.title = 'Kembali ke tampilan normal';
    }
}

function expandPreview() {
    previewExpandedModal.style.display = 'flex';
    const html = htmlCodeInput.value.trim();
    const css = cssCodeInput.value.trim();
    const js = jsCodeInput.value.trim();
    
    const previewHTML = createPreviewHTML(html, css, js);
    
    expandedPreviewFrame.innerHTML = '';
    const expandedIframe = document.createElement('iframe');
    expandedIframe.className = 'expanded-preview-iframe';
    expandedIframe.srcdoc = previewHTML;
    expandedPreviewFrame.appendChild(expandedIframe);
}

function closeExpandedPreview() {
    previewExpandedModal.style.display = 'none';
}

function togglePreview() {
    const previewContainer = document.querySelector('.preview-container');
    const previewIframe = document.getElementById('previewFrame');
    
    if (previewIframe.style.display === 'none') {
        previewIframe.style.display = 'block';
        togglePreviewBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Sembunyikan';
    } else {
        previewIframe.style.display = 'none';
        togglePreviewBtn.innerHTML = '<i class="fas fa-eye"></i> Tampilkan';
    }
}

function updateStats() {
    totalCodesElement.textContent = codes.length;
}

function getCodeById(id) {
    return codes.find(code => code.id === id);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--primary);
        color: white;
        padding: 15px 25px;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        z-index: 1000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', init);