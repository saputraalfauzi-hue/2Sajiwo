let saldo = 0;
let transaksi = [];

function muatData() {
    const dataTersimpan = localStorage.getItem('dataKeuangan');
    if (dataTersimpan) {
        const data = JSON.parse(dataTersimpan);
        saldo = data.saldo || 0;
        transaksi = data.transaksi || [];
    }
    perbaruiTampilan();
}

function simpanData() {
    const dataKeuangan = {
        saldo: saldo,
        transaksi: transaksi
    };
    localStorage.setItem('dataKeuangan', JSON.stringify(dataKeuangan));
}

function tambahTransaksi() {
    const jumlahInput = document.getElementById('jumlah');
    const tipeInput = document.getElementById('tipe');
    
    const jumlah = parseFloat(jumlahInput.value);
    const tipe = tipeInput.value;

    if (isNaN(jumlah) || jumlah <= 0) {
        alert("Harap masukkan jumlah yang valid.");
        return;
    }

    let nilaiTransaksi = jumlah;
    if (tipe === 'pengeluaran') {
        nilaiTransaksi = -jumlah; 
    }

    saldo += nilaiTransaksi;
    
    transaksi.push({
        nilai: nilaiTransaksi,
        tipe: tipe,
        tanggal: new Date().toLocaleDateString('id-ID')
    });

    simpanData();
    perbaruiTampilan();

    jumlahInput.value = '';
}

function perbaruiTampilan() {
    const saldoElement = document.getElementById('saldo');
    const riwayatElement = document.getElementById('riwayat');

    saldoElement.textContent = `Rp ${saldo.toLocaleString('id-ID')}`;
    saldoElement.className = saldo >= 0 ? 'income' : 'expense';

    riwayatElement.innerHTML = ''; 
    
    transaksi.slice().reverse().forEach(item => {
        const li = document.createElement('li');
        const sign = item.nilai > 0 ? '+' : '';
        const cssClass = item.nilai > 0 ? 'income' : 'expense';

        li.innerHTML = `${item.tanggal}: <span class="${cssClass}">${sign}Rp ${Math.abs(item.nilai).toLocaleString('id-ID')}</span>`;
        riwayatElement.appendChild(li);
    });
}

function hapusSemuaData() {
    if (confirm("Apakah Anda yakin ingin menghapus semua data?")) {
        localStorage.removeItem('dataKeuangan');
        saldo = 0;
        transaksi = [];
        perbaruiTampilan();
    }
}

muatData();
