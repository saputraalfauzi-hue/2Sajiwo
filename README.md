# Web Code Storage

Aplikasi penyimpanan kode web yang memungkinkan Anda menyimpan, mengedit, dan mengelola kode HTML, CSS, dan JavaScript secara lokal di browser Anda.

## Fitur Utama

### 1. **Manajemen Kode**
- **Tambah Kode Baru**: Buat entri baru dengan judul, HTML, CSS, dan JavaScript
- **Edit Kode**: Perbarui kode yang sudah ada
- **Hapus Kode**: Hapus kode individu atau multiple
- **Pilih/Batal Pilih**: Seleksi multiple untuk operasi batch

### 2. **Editor Kode**
- **Editor Dark Mode**: Background hitam dengan teks putih
- **Penghitung Karakter**: Tampilkan jumlah karakter untuk setiap editor
- **Upload File**: Upload file HTML, CSS, dan JS langsung ke editor
- **Clear Button**: Hapus konten editor dengan satu klik

### 3. **Pratinjau Live**
- **Pratinjau Real-time**: Lihat hasil kode secara instan
- **Perluas Pratinjau**: Mode fullscreen untuk pratinjau yang lebih besar
- **Download HTML**: Download pratinjau sebagai file HTML

### 4. **Manajemen Data**
- **LocalStorage**: Semua data disimpan di browser lokal
- **Impor/Ekspor**: Backup dan restore data dengan format JSON
- **Tiga Mode Impor**: Tambah, Ganti, atau Gabungkan data

### 5. **UI/UX**
- **Responsif**: Tampilan optimal di desktop, tablet, dan mobile
- **Perluas Tampilan**: Mode expanded untuk ruang kerja lebih luas
- **Notifikasi**: Feedback visual untuk setiap aksi
- **Grid View**: Tampilan kode dalam grid yang rapi

## Cara Menggunakan

### Instalasi
1. Salin ketiga file (index.html, style.css, script.js) ke folder yang sama
2. Buka file index.html di browser web
3. Tidak perlu instalasi atau server - aplikasi berjalan langsung di browser

### Menyimpan Kode Baru
1. Isi **Judul Kode**
2. Masukkan kode di editor **HTML**, **CSS**, dan/atau **JavaScript**
3. Klik **Simpan Kode**

### Upload File Kode
1. Klik tombol **Upload HTML**, **Upload CSS**, atau **Upload JS**
2. Pilih file dari komputer Anda
3. Konten file akan langsung dimuat ke editor

### Mengedit Kode
1. Klik pada item kode di daftar kode tersimpan
2. Kode akan dimuat ke editor
3. Edit kode sesuai kebutuhan
4. Klik **Perbarui Kode**

### Pratinjau Kode
1. Setelah memasukkan kode, klik **Jalankan Kode**
2. Hasil akan muncul di panel pratinjau
3. Gunakan tombol **Refresh** untuk memperbarui pratinjau
4. Gunakan tombol **Perluas** untuk mode fullscreen

### Impor/Ekspor Data
#### Mengekspor Data:
1. Pilih kode yang ingin diekspor (gunakan tombol **Pilih**)
2. Klik **Ekspor Terpilih**
3. File JSON akan didownload

#### Mengimpor Data:
1. Klik **Impor Kode dari JSON**
2. Pilih file JSON yang sebelumnya diekspor
3. Pilih mode impor:
   - **Tambah ke kode yang ada**: Data baru ditambahkan
   - **Ganti semua kode yang ada**: Data lama diganti
   - **Gabungkan dan update**: Data lama diupdate, baru ditambahkan
4. Klik **Impor Sekarang**

### Operasi Batch
1. Gunakan tombol **Pilih Semua** untuk memilih semua kode
2. Gunakan **Batal Pilih** untuk membatalkan seleksi
3. Gunakan **Hapus Terpilih** untuk menghapus kode yang dipilih
4. Gunakan **Ekspor Terpilih** untuk mengekspor kode yang dipilih

## Format Data JSON

Aplikasi menggunakan format JSON berikut untuk impor/ekspor:

```json
{
  "version": "1.0",
  "exportDate": "2023-12-01T10:30:00.000Z",
  "count": 5,
  "codes": [
    {
      "id": "123456789",
      "title": "Contoh Kode",
      "html": "<div>...</div>",
      "css": "body { ... }",
      "js": "console.log('...')",
      "date": "2023-12-01T10:30:00.000Z",
      "created": "2023-12-01T10:30:00.000Z"
    }
  ]
}