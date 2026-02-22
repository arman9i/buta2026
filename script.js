// 1. Variabel Global
let alumniData = [];
let isPlaying = false;
let storyTimer;

// 2. Ambil Data dari JSON saat halaman dimuat
async function loadAlumniData() {
    try {
        const response = await fetch('data.json');
        alumniData = await response.json();
        renderAlumni(alumniData);
    } catch (error) {
        console.error("Gagal memuat data alumni:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadAlumniData);

// 3. Fungsi Render Alumni (Menampilkan kartu-kartu di halaman 2)
function renderAlumni(data) {
    const list = document.getElementById('alumniList');
    list.innerHTML = "";
    data.forEach(item => {
        const randomRot = Math.floor(Math.random() * 10) - 5;
        const card = document.createElement('div');
        card.className = 'scrap-card';
        card.style.setProperty('--r', `${randomRot}deg`);
        
        // Saat diklik, panggil fungsi showProfile yang baru
        card.onclick = () => showProfile(item);
        
        card.innerHTML = `
            <img src="${item.foto}" alt="${item.nama}">
            <h3>${item.nama}</h3>
        `;
        list.appendChild(card);
    });
}

// 4. FUNGSI BARU: showProfile (MENGGANTIKAN YANG LAMA)
// Fungsi ini sekarang menampilkan FOTO BESAR dan INFO LENGKAP
function showProfile(item) {
    const modal = document.getElementById('profileModal');
    const modalData = document.getElementById('modalData');

    // Cek apakah ada data video, jika tidak tampilkan foto biasa
    const mediaHTML = item.video 
        ? `<video src="${item.video}" class="modal-photo" autoplay loop muted playsinline></video>`
        : `<img src="${item.foto}" class="modal-photo" alt="${item.nama}">`;

    modalData.innerHTML = `
        <div class="modal-body">
            ${mediaHTML}
            <h2 style="font-family: 'Gochi Hand'; margin-top:10px;">${item.nama}</h2>
            <p><strong>Kelas:</strong> ${item.kelas}</p>
            
            ${item.audio ? `
            <div class="voice-note-container" style="margin: 15px 0;">
                <audio controls style="height: 30px;">
                    <source src="${item.audio}" type="audio/mpeg">
                </audio>
            </div>` : ''}

            <p style="font-style: italic;">"${item.pesan}"</p>
            <hr style="width: 80%; border: 0.5px dashed #ccc;">
            <p>${item.bio}</p>
        </div>
    `;

    modal.style.display = "flex";
}

// 5. Fungsi Musik
function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const icon = document.getElementById('musicIcon');
    const text = document.querySelector('.music-text');

    if (isPlaying) {
        music.pause();
        icon.innerText = "🔇";
        text.innerText = "Music Off";
    } else {
        music.play();
        icon.innerText = "🎵";
        text.innerText = "Music On";
    }
    isPlaying = !isPlaying;
}

// 6. Fungsi Navigasi Halaman & Suara Transisi
function nextPage(pageNum) {
    const sound = document.getElementById('paperSound');
    const wrapper = document.querySelector('.book-wrapper');
    
    if(sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    wrapper.style.opacity = '0';
    setTimeout(() => {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page' + pageNum).classList.add('active');
        wrapper.style.opacity = '1';
        window.scrollTo(0, 0);
    }, 300);
}

// 7. Tutup Modal
function closeModal() {
    document.getElementById('profileModal').style.display = "none";
}

// 8. Pencarian
function searchAlumni() {
    const term = document.getElementById('searchBar').value.toLowerCase();
    const filtered = alumniData.filter(a => a.nama.toLowerCase().includes(term));
    renderAlumni(filtered);
}

// Fungsi untuk menampilkan detail gambar di Page 4
function showGalleryDetail(imageSrc, title, description) {
    const modal = document.getElementById('profileModal');
    const modalData = document.getElementById('modalData');

    // Mengisi konten modal dengan gambar dan teks keterangan
    modalData.innerHTML = `
        <div class="modal-body">
            <h2 style="margin-bottom: 10px; font-family: 'Gochi Hand', cursive;">${title}</h2>
            <img src="${imageSrc}" style="width: 100%; border-radius: 10px; box-shadow: 3px 3px 10px rgba(0,0,0,0.2);">
            <p style="margin-top: 15px; font-size: 1.2rem; line-height: 1.4;">${description}</p>
        </div>
    `;

    modal.style.display = "flex";
}

// --- FITUR SWIPE (TAMBAHKAN DI SINI) ---

let touchstartX = 0;
let touchendX = 0;

function checkDirection() {
    const threshold = 60; // Jarak minimal geser agar dianggap swipe
    const activePage = document.querySelector('.page.active');
    if (!activePage) return;

    // Mengambil nomor halaman dari ID (contoh: "page1" diambil angka 1)
    const currentPageId = activePage.id;
    const currentPageNum = parseInt(currentPageId.replace('page', ''));

    if (touchendX < touchstartX - threshold) {
        // Geser ke KIRI -> Halaman BERIKUTNYA
        if (currentPageNum < 8) { // Sesuaikan jika total halaman bertambah
            nextPage(currentPageNum + 1);
        }
    }
    
    if (touchendX > touchstartX + threshold) {
        // Geser ke KANAN -> Halaman SEBELUMNYA
        if (currentPageNum > 1) {
            nextPage(currentPageNum - 1);
        }
    }
}

// Listener untuk mendeteksi sentuhan di layar
document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    checkDirection();
}, false);