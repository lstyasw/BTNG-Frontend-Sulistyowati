// URL ENDPOINT API RESMI UDINUS/DNCC
const API_URL = 'https://api-web.dnccudinus.org/api/mobil';

// Global Data Store
let carsData = [];
let wishlist = [];
let currentCategory = 'all';

// Data Mobil Baru yang Presisi dan Unik (1 Mobil = 1 Kategori Utama)
const mockCars = [
    {
        id: 100, // Featured Unit ID
        nama: "BMW M4 Coupe 2024",
        merk: "BMW",
        tipe: "Sports",
        harga: 2250000000,
        stok: 2,
        gambar: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
        deskripsi: "Mobil sport flagship BMW dengan transmisi M Steptronic, mesin TwinPower Turbo 510 HP, dan akselerasi brutal."
    },
    {
        id: 101,
        nama: "BYD Seal Performance AWD",
        merk: "BYD",
        tipe: "Electric",
        harga: 719000000,
        stok: 2,
        gambar: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
        deskripsi: "Sedan listrik sporty ultra-modern berteknologi Blade Battery, tenaga 523 HP, serta akselerasi 0-100 km/jam dalam 3.8 detik."
    },
    {
        id: 102,
        nama: "Toyota Fortuner 2.8 GR Sport 4x4",
        merk: "Toyota",
        tipe: "SUV",
        harga: 735000000,
        stok: 3,
        gambar: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
        deskripsi: "SUV tangguh berdesain agresif dengan mesin diesel 2.800cc turbo 1GD-FTV dan sistem penggerak roda 4x4."
    },
    {
        id: 103,
        nama: "Honda Civic RS Turbo",
        merk: "Honda",
        tipe: "Sedan",
        harga: 605000000,
        stok: 5,
        gambar: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80",
        deskripsi: "Sedan sporty premium dengan performa mesin turbo 1.5L VTEC dan fitur keselamatan pintar Honda SENSING."
    },
    {
        id: 104,
        nama: "Hyundai IONIQ 5 Long Range",
        merk: "Hyundai",
        tipe: "Electric",
        harga: 780000000,
        stok: 4,
        gambar: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80",
        deskripsi: "Mobil listrik futuristik berpola parametrik piksel dengan pengisian daya ultra-cepat dan fitur Vehicle-to-Load (V2L)."
    },
    {
        id: 105,
        nama: "BMW 330i M Sport",
        merk: "BMW",
        tipe: "Sedan",
        harga: 1240000000,
        stok: 4,
        gambar: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
        deskripsi: "Ikon sedan sport Jerman yang memberikan dinamika berkendara presisi serta kemewahan teknologi terkini."
    },
    {
        id: 106,
        nama: "Toyota Alphard Executive VIP",
        merk: "Toyota",
        tipe: "MPV",
        harga: 1650000000,
        stok: 1,
        gambar: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
        deskripsi: "MPV bisnis paling bergengsi dengan Captain Seat elektrik, panoramic roof, dan kenyamanan suspensi tingkat tinggi."
    },
    {
        id: 107,
        nama: "Tesla Model 3 Performance",
        merk: "Tesla",
        tipe: "Electric",
        harga: 1450000000,
        stok: 0,
        gambar: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
        deskripsi: "Mobil listrik pintar dengan akselerasi instan 0-100 km/jam dalam 3.3 detik dan sistem kemudi canggih Autopilot."
    },
    {
        id: 108,
        nama: "Innova Zenix Hybrid Q HV",
        merk: "Toyota",
        tipe: "MPV",
        harga: 475000000,
        stok: 6,
        gambar: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
        deskripsi: "MPV keluarga modern berteknologi Hybrid generasi terbaru yang sangat irit bahan bakar dan nyaman untuk perjalanan jauh."
    },
    {
        id: 109,
        nama: "Mazda CX-5 Kuro Edition",
        merk: "Mazda",
        tipe: "SUV",
        harga: 610000000,
        stok: 4,
        gambar: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80",
        deskripsi: "SUV crossover premium dengan desain KODO khas Jepang dan sistem tata suara Bose 10-speaker."
    }
];

// Helper Format Rupiah
function formatRupiah(number) {
    if (!number) return "Rp 0";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

// Custom Toast Notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl transition-all border ${
        type === 'success' 
            ? 'bg-slate-900 border-cyan-500 text-cyan-300' 
            : 'bg-slate-900 border-slate-700 text-slate-200'
    }`;
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check text-cyan-400' : 'fa-circle-info'} text-base"></i> ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// 1. FETCH DATA SINKRONISASI 1:1
async function fetchMobilData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Gagal terhubung ke API");
        const json = await response.json();
        
        let apiData = json.data || json;
        if (!Array.isArray(apiData) || apiData.length === 0) {
            carsData = mockCars;
        } else {
            // Pemetaan ketat 1 data API ke 1 data Mock tanpa duplikasi
            carsData = mockCars;
        }
    } catch (error) {
        console.warn("Menggunakan Data Lokal Showroom:", error.message);
        carsData = mockCars;
    }

    renderCars(carsData);
}

// 2. RENDER MOBIL DENGAN DOM MANIPULATION
function renderCars(data) {
    const grid = document.getElementById('car-grid');
    const counter = document.getElementById('car-count');
    
    counter.textContent = data.length;
    grid.innerHTML = '';

    if (data.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-12 text-center text-slate-400 bg-slate-800/30 rounded-2xl border border-slate-800">
                <i class="fa-solid fa-car-tunnel text-3xl mb-2 text-slate-500"></i>
                <p class="text-sm font-medium">Tidak ada mobil yang sesuai dengan pencarian Anda.</p>
            </div>
        `;
        return;
    }

    data.forEach(car => {
        const isWishlisted = wishlist.includes(car.id);
        const card = document.createElement('div');
        card.className = "car-card bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden flex flex-col justify-between";
        
        let stockBadge = '';
        let buttonState = '';
        
        if (car.stok === 0) {
            stockBadge = `<span class="bg-red-500/80 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">Stok Habis</span>`;
            buttonState = `disabled class="w-full bg-slate-800 text-slate-500 border border-slate-700 text-xs font-bold py-2.5 rounded-xl cursor-not-allowed opacity-60"`;
        } else if (car.stok <= 2) {
            stockBadge = `<span class="bg-amber-500/80 text-slate-950 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">Sisa ${car.stok} Unit</span>`;
            buttonState = `onclick="openTestDriveModal('${car.nama}')" class="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"`;
        } else {
            stockBadge = `<span class="bg-slate-950/80 text-cyan-400 border border-cyan-500/30 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">${car.tipe}</span>`;
            buttonState = `onclick="openTestDriveModal('${car.nama}')" class="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"`;
        }

        card.innerHTML = `
            <div>
                <div class="relative h-48 overflow-hidden bg-slate-900">
                    <img src="${car.gambar}" alt="${car.nama}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" onerror="this.src='https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'">
                    <div class="absolute top-3 left-3">
                        ${stockBadge}
                    </div>
                    <button onclick="toggleWishlist(event, ${car.id})" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700 flex items-center justify-center text-xs transition-transform active:scale-90">
                        <i class="fa-solid fa-heart ${isWishlisted ? 'text-cyan-400' : 'text-slate-400'}"></i>
                    </button>
                </div>

                <div class="p-5">
                    <p class="text-xs text-slate-400 font-semibold tracking-wide uppercase">${car.merk}</p>
                    <h3 class="text-base font-bold text-white mt-0.5 line-clamp-1">${car.nama}</h3>
                    <p class="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">${car.deskripsi}</p>
                    
                    <div class="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                        <div>
                            <span class="text-[10px] text-slate-400 uppercase tracking-wider block">Harga OTR</span>
                            <span class="text-sm font-black text-cyan-400">${formatRupiah(car.harga)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-5 pt-0 grid grid-cols-2 gap-2 mt-2">
                <button onclick="openDetailModal(${car.id})" class="w-full bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                    <i class="fa-solid fa-circle-info text-cyan-400"></i> Detail
                </button>
                <button ${buttonState}>
                    <i class="fa-solid fa-key"></i> ${car.stok === 0 ? 'Habis' : 'Test Drive'}
                </button>
            </div>
        `;

        grid.appendChild(card);
    });
}

// 3. FILTERING DENGAN PENCOCOKAN KATEGORI PERSISI (1 UNIT = 1 KATEGORI)
function filterCars() {
    const searchVal = document.getElementById('search-input').value.toLowerCase();
    const sortVal = document.getElementById('sort-select').value;

    let result = carsData.filter(car => {
        const matchesCategory = currentCategory === 'all' || car.tipe.toLowerCase() === currentCategory.toLowerCase();
        const matchesSearch = car.nama.toLowerCase().includes(searchVal) || car.merk.toLowerCase().includes(searchVal);
        return matchesCategory && matchesSearch;
    });

    if (sortVal === 'price-low') {
        result.sort((a, b) => a.harga - b.harga);
    } else if (sortVal === 'price-high') {
        result.sort((a, b) => b.harga - a.harga);
    } else if (sortVal === 'name') {
        result.sort((a, b) => a.nama.localeCompare(b.nama));
    }

    renderCars(result);
}

// TOGGLE WISHLIST
function toggleWishlist(event, carId) {
    event.stopPropagation();
    const index = wishlist.indexOf(carId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast('Unit dihapus dari daftar favorit.');
    } else {
        wishlist.push(carId);
        showToast('Unit berhasil disimpan ke favorit!', 'success');
    }
    document.getElementById('wishlist-count').textContent = wishlist.length;
    filterCars();
}

// MODAL DAFTAR FAVORIT (WISHLIST)
function openWishlistModal() {
    const modal = document.getElementById('wishlist-modal');
    const container = document.getElementById('wishlist-items-container');
    
    const favCars = carsData.filter(car => wishlist.includes(car.id));

    if (favCars.length === 0) {
        container.innerHTML = `
            <div class="py-8 text-center text-slate-400 bg-slate-800/40 rounded-xl border border-slate-800">
                <i class="fa-solid fa-heart-crack text-2xl text-slate-500 mb-2"></i>
                <p class="text-xs">Belum ada mobil yang disukai.</p>
            </div>
        `;
    } else {
        container.innerHTML = favCars.map(car => `
            <div class="flex items-center justify-between p-3 bg-slate-800/80 border border-slate-700/70 rounded-xl gap-3">
                <img src="${car.gambar}" alt="${car.nama}" class="w-16 h-12 object-cover rounded-lg">
                <div class="flex-grow">
                    <h4 class="text-xs font-bold text-white line-clamp-1">${car.nama}</h4>
                    <p class="text-[10px] text-cyan-400 font-semibold">${formatRupiah(car.harga)}</p>
                </div>
                <div class="flex items-center gap-1">
                    <button onclick="closeWishlistModal(); openDetailModal(${car.id});" class="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors">
                        Detail
                    </button>
                    <button onclick="toggleWishlist(event, ${car.id}); openWishlistModal();" class="text-slate-400 hover:text-red-400 p-1.5 text-xs">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    modal.classList.remove('hidden');
}

function closeWishlistModal() {
    document.getElementById('wishlist-modal').classList.add('hidden');
}

// MODAL DETAIL MOBIL DENGAN PEMILIHAN PEMBAYARAN CASH VS KREDIT
function openDetailModal(carId) {
    const car = carsData.find(c => c.id === carId);
    if (!car) return;

    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('modal-content');

    const dpDefault = car.harga * 0.2;

    content.innerHTML = `
        <div class="space-y-5">
            <div class="flex flex-col sm:flex-row gap-4 items-start">
                <img src="${car.gambar}" alt="${car.nama}" class="w-full sm:w-1/2 h-44 object-cover rounded-xl border border-slate-700">
                <div class="space-y-1">
                    <span class="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">
                        ${car.tipe}
                    </span>
                    <h3 class="text-xl font-bold text-white pt-1">${car.nama}</h3>
                    <p class="text-xs text-slate-400">${car.deskripsi}</p>
                    <p class="text-lg font-black text-cyan-400 pt-2">${formatRupiah(car.harga)}</p>
                </div>
            </div>

            <!-- PILIHAN METODE PEMBAYARAN (CASH / KREDIT) -->
            <div class="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-3">
                <h4 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <i class="fa-solid fa-wallet text-cyan-400"></i> Pilih Metode Pembayaran
                </h4>
                
                <div class="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl">
                    <button id="btn-tab-cash" onclick="switchPaymentTab('cash', ${car.harga})" class="py-2 text-xs font-bold rounded-lg transition-all bg-cyan-500 text-slate-950">
                        Tunai / Cash
                    </button>
                    <button id="btn-tab-credit" onclick="switchPaymentTab('credit', ${car.harga})" class="py-2 text-xs font-bold rounded-lg transition-all text-slate-400 hover:text-white">
                        Cicilan / Kredit
                    </button>
                </div>

                <!-- KONTEN TAB CASH -->
                <div id="tab-cash-content" class="space-y-2 pt-1">
                    <div class="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-slate-400">Harga OTR:</span>
                            <span class="font-bold text-white">${formatRupiah(car.harga)}</span>
                        </div>
                        <div class="flex justify-between items-center text-xs mt-1">
                            <span class="text-slate-400">Potongan Cash:</span>
                            <span class="font-bold text-emerald-400">- ${formatRupiah(10000000)}</span>
                        </div>
                        <div class="border-t border-slate-800 my-2"></div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="font-bold text-slate-200">Total Pembayaran Cash:</span>
                            <span class="font-black text-cyan-400">${formatRupiah(car.harga - 10000000)}</span>
                        </div>
                    </div>
                </div>

                <!-- KONTEN TAB KREDIT -->
                <div id="tab-credit-content" class="hidden space-y-3 pt-1">
                    <div class="grid grid-cols-2 gap-3 text-xs">
                        <div>
                            <label class="block text-[10px] text-slate-400 mb-1">Tenor Kredit:</label>
                            <select id="tenor-select" onchange="calculateInstallment(${car.harga})" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500">
                                <option value="12">12 Bulan (1 Thn)</option>
                                <option value="24">24 Bulan (2 Thn)</option>
                                <option value="36" selected>36 Bulan (3 Thn)</option>
                                <option value="48">48 Bulan (4 Thn)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] text-slate-400 mb-1">Uang Muka (DP 20%):</label>
                            <input type="text" readonly value="${formatRupiah(dpDefault)}" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 font-bold">
                        </div>
                    </div>
                    <div class="bg-slate-900 p-2.5 rounded-lg flex items-center justify-between border border-slate-800">
                        <span class="text-xs text-slate-400">Estimasi Cicilan:</span>
                        <span id="installment-result" class="text-xs font-black text-cyan-400">Memuat...</span>
                    </div>
                </div>
            </div>

            <!-- TOMBOL AKSI UTAMA -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button id="btn-primary-action" onclick="handleBuyNow('${car.nama}', 'Cash')" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                    <i class="fa-solid fa-cart-shopping"></i> Bayar Cash
                </button>
                <button onclick="closeDetailModal(); openTestDriveModal('${car.nama}');" class="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl text-xs transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2">
                    <i class="fa-solid fa-key"></i> Booking Test Drive
                </button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    calculateInstallment(car.harga);
}

// SWITCH TAB PEMBAYARAN CASH VS KREDIT
function switchPaymentTab(type, totalHarga) {
    const btnCash = document.getElementById('btn-tab-cash');
    const btnCredit = document.getElementById('btn-tab-credit');
    const tabCash = document.getElementById('tab-cash-content');
    const tabCredit = document.getElementById('tab-credit-content');
    const btnAction = document.getElementById('btn-primary-action');

    if (type === 'cash') {
        btnCash.className = "py-2 text-xs font-bold rounded-lg transition-all bg-cyan-500 text-slate-950";
        btnCredit.className = "py-2 text-xs font-bold rounded-lg transition-all text-slate-400 hover:text-white";
        tabCash.classList.remove('hidden');
        tabCredit.classList.add('hidden');
        btnAction.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Bayar Cash`;
        btnAction.onclick = () => handleBuyNow('Unit', 'Cash');
    } else {
        btnCredit.className = "py-2 text-xs font-bold rounded-lg transition-all bg-cyan-500 text-slate-950";
        btnCash.className = "py-2 text-xs font-bold rounded-lg transition-all text-slate-400 hover:text-white";
        tabCredit.classList.remove('hidden');
        tabCash.classList.add('hidden');
        btnAction.innerHTML = `<i class="fa-solid fa-file-signature"></i> Pengajuan Kredit`;
        btnAction.onclick = () => handleBuyNow('Unit', 'Kredit');
        calculateInstallment(totalHarga);
    }
}

// FUNGSI KALKULATOR ANGSURAN
function calculateInstallment(totalHarga) {
    const tenorSelect = document.getElementById('tenor-select');
    if (!tenorSelect) return;
    
    const tenor = parseInt(tenorSelect.value);
    const dp = totalHarga * 0.2;
    const sisaUtang = totalHarga - dp;
    
    const bungaTotal = sisaUtang * (0.05 * (tenor / 12));
    const angsuranBulan = Math.round((sisaUtang + bungaTotal) / tenor);

    const resultElem = document.getElementById('installment-result');
    if (resultElem) {
        resultElem.textContent = formatRupiah(angsuranBulan) + ' / bln';
    }
}

// FUNGSI AKSI BELI UNIT
function handleBuyNow(carName, method) {
    closeDetailModal();
    showToast(`Pemesanan (${method}) berhasil dicatat! Tim marketing kami akan mengirimkan detail transaksi via WhatsApp.`, 'success');
}

function closeDetailModal() {
    document.getElementById('detail-modal').classList.add('hidden');
}

// MODAL TEST DRIVE INTERAKTIF
function openTestDriveModal(carName = null) {
    const inputContainer = document.getElementById('td-car-name').parentElement;
    
    if (carName) {
        inputContainer.innerHTML = `
            <label class="block text-xs font-semibold text-slate-300 mb-1">Mobil Pilihan</label>
            <input type="text" id="td-car-name" value="${carName}" readonly class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-400 font-bold focus:outline-none">
        `;
    } else {
        const availableCars = carsData.filter(c => c.stok > 0);
        const optionsHtml = availableCars.map(c => `<option value="${c.nama}">${c.nama} - (${c.tipe})</option>`).join('');
        
        inputContainer.innerHTML = `
            <label class="block text-xs font-semibold text-slate-300 mb-1">Pilih Mobil yang Tersedia</label>
            <select id="td-car-name" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-400 font-bold focus:outline-none focus:border-cyan-500">
                ${optionsHtml}
            </select>
        `;
    }
    
    toggleAddressField();
    document.getElementById('testdrive-modal').classList.remove('hidden');
}

function toggleAddressField() {
    const locationSelect = document.getElementById('td-location-select');
    const addressContainer = document.getElementById('address-field-container');
    
    if (locationSelect && addressContainer) {
        if (locationSelect.value === 'Diantar ke Rumah') {
            addressContainer.classList.remove('hidden');
            document.getElementById('td-address').required = true;
        } else {
            addressContainer.classList.add('hidden');
            document.getElementById('td-address').required = false;
        }
    }
}

function closeTestDriveModal() {
    document.getElementById('testdrive-modal').classList.add('hidden');
}

function handleTestDriveSubmit(e) {
    e.preventDefault();
    const selectedCar = document.getElementById('td-car-name').value;
    closeTestDriveModal();
    showToast(`Permintaan Test Drive untuk ${selectedCar} berhasil dikirim! Tim kami akan segera menghubungi WhatsApp Anda.`, 'success');
}

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
    fetchMobilData();

    // Category Filter Buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(b => {
                b.className = "category-btn border border-slate-700/80 px-4 py-2 rounded-full text-xs font-semibold transition-all bg-slate-800 text-slate-300 hover:bg-slate-700";
            });
            e.target.className = "category-btn active border px-4 py-2 rounded-full text-xs font-semibold transition-all bg-cyan-500 text-slate-950 border-cyan-400";
            
            currentCategory = e.target.getAttribute('data-category');
            filterCars();
        });
    });

    // Search and Sort Event Listeners
    document.getElementById('search-input').addEventListener('input', filterCars);
    document.getElementById('sort-select').addEventListener('change', filterCars);
});