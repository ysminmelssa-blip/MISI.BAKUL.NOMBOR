# Misi Bakul Nombor (versi Webcam)

1. Muat naik `index.html` ke repo GitHub, kemudian Settings > Pages > Deploy from branch (main, root).
2. Buka pautan `https://NAMA.github.io/REPO/` (mesti HTTPS supaya kamera dibenarkan).
3. Tekan butang 📷 Webcam, benarkan kamera.
   - 👆 Tahan jari di atas butang kira-kira 1 saat untuk memilih.
   - 🤏 Cubit (ibu jari + telunjuk) untuk memegang buah/bakul, gerakkan, lepaskan untuk meletak.
4. Tanpa webcam: sentuhan atau mouse berfungsi seperti biasa.

Pilihan luar talian (internet lemah): letak fail `hand_landmarker.task` (model MediaPipe Hand Landmarker, ~8MB)
di folder yang sama dengan `index.html`. Game akan guna fail itu dahulu.
Pustaka MediaPipe masih dimuat dari jsDelivr (CDN).
