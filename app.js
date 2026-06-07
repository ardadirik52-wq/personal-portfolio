document.addEventListener('DOMContentLoaded', () => {
    // 1. Yazı Döndürücü (Text Rotator)
    const rotator = document.getElementById('textRotator');
    if (rotator) {
        const words = JSON.parse(rotator.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let delay = 150;

        function typeEffect() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                rotator.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                delay = 75;
            } else {
                rotator.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                delay = 150;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                delay = 2000; // Bekleme süresi
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 500;
            }

            setTimeout(typeEffect, delay);
        }
        setTimeout(typeEffect, 1000);
    }

    // 2. Mobil Menü Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            
            // Hamburger ikonunu X'e veya normale çevirebiliriz (isteğe bağlı)
            const isActive = mobileMenu.classList.contains('active');
            menuToggle.innerHTML = isActive 
                ? `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
                : `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
        });

        // Mobil linklerden birine tıklandığında menüyü kapat
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuToggle.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
            });
        });
    }

    // 3. Proje Filtreleme
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Aktif sınıfını güncelle
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 4. Yetenek Barları Animasyonu (IntersectionObserver)
    const skillsSection = document.getElementById('about');
    const skillFills = document.querySelectorAll('.skill-fill');
    
    if (skillsSection && skillFills.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillFills.forEach(fill => {
                        const targetWidth = fill.style.width;
                        fill.style.width = '0%';
                        setTimeout(() => {
                            fill.style.width = targetWidth;
                        }, 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(skillsSection);
    }

    // 5. Scrollspy (Aktif Link Değişimi) & Navbar Efekti
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link:not(.btn-contact-nav)');
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        let current = '';
        
        // Navbar scroll küçülme efekti
        if (window.scrollY > 50) {
            navbar.style.padding = '0.75rem 0';
            navbar.style.backgroundColor = 'rgba(7, 9, 19, 0.9)';
        } else {
            navbar.style.padding = '1.25rem 0';
            navbar.style.backgroundColor = 'rgba(7, 9, 19, 0.75)';
        }

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 6. İletişim Formu Kontrolü & Yerel Veritabanı
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Kaydediliyor...';
            submitBtn.disabled = true;

            // Form verilerini al
            const nameVal = document.getElementById('name').value;
            const emailVal = document.getElementById('email').value;
            const messageVal = document.getElementById('message').value;

            // Veritabanı (localStorage) kaydı
            setTimeout(() => {
                try {
                    const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
                    const newMessage = {
                        id: Date.now(),
                        date: new Date().toLocaleString('tr-TR'),
                        name: nameVal,
                        email: emailVal,
                        message: messageVal
                    };
                    messages.push(newMessage);
                    localStorage.setItem('contact_messages', JSON.stringify(messages));

                    formFeedback.className = 'form-feedback success';
                    formFeedback.textContent = 'Mesajınız başarıyla veritabanına kaydedildi!';
                    contactForm.reset();
                } catch (error) {
                    formFeedback.className = 'form-feedback error';
                    formFeedback.textContent = 'Hata: Mesaj veritabanına kaydedilemedi.';
                }

                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;

                setTimeout(() => {
                    formFeedback.textContent = '';
                    formFeedback.className = 'form-feedback';
                }, 5000);
            }, 1000);
        });
    }

    // 7. Gizli Yönetici Paneli & Mesaj Yönetimi
    const logoLink = document.querySelector('.logo');
    const adminLoginModal = document.getElementById('adminLoginModal');
    const adminDashboardModal = document.getElementById('adminDashboardModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeDashboardModal = document.getElementById('closeDashboardModal');
    const loginBtn = document.getElementById('loginBtn');
    const adminPasswordInput = document.getElementById('adminPassword');
    const loginFeedback = document.getElementById('loginFeedback');
    const messagesTableBody = document.getElementById('messagesTableBody');
    const noMessagesMsg = document.getElementById('noMessagesMsg');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');

    // Sadece sizde aktif olması için yerel bilgisayarınızın dosya yolu veya özel gizli parametre kontrolü
    const urlParams = new URLSearchParams(window.location.search);
    const isAdminMode = window.location.href.includes('C:/Users/Windows/.gemini/antigravity/scratch/personal-portfolio') || urlParams.get('admin') === 'arda05';

    // Oturum kontrolü (Sayfa yenilendiğinde giriş yapılmışsa paneli otomatik aç)
    setTimeout(() => {
        if (sessionStorage.getItem('admin_logged_in') === 'true' && isAdminMode) {
            openModal(adminDashboardModal);
            loadMessages();
        }
    }, 100);

    let logoClickCount = 0;

    // Logoya 5 kez tıklayınca giriş modali açılsın (Sadece "?admin=true" modundaysa)
    if (logoLink && isAdminMode) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            logoClickCount++;
            if (logoClickCount === 5) {
                logoClickCount = 0;
                openModal(adminLoginModal);
            }
        });
    }


    // Modal açma / kapama yardımcı fonksiyonları
    function openModal(modal) {
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('show'), 10);
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    }

    if (closeLoginModal) closeLoginModal.addEventListener('click', () => closeModal(adminLoginModal));
    if (closeDashboardModal) {
        closeDashboardModal.addEventListener('click', () => {
            sessionStorage.removeItem('admin_logged_in');
            closeModal(adminDashboardModal);
        });
    }

    // Dışarı tıklayınca kapat
    window.addEventListener('click', (e) => {
        if (e.target === adminLoginModal) closeModal(adminLoginModal);
        if (e.target === adminDashboardModal) {
            sessionStorage.removeItem('admin_logged_in');
            closeModal(adminDashboardModal);
        }
    });

    // Giriş işlemi
    if (loginBtn && adminPasswordInput) {
        loginBtn.addEventListener('click', () => {
            const password = adminPasswordInput.value;
            if (password === 'admin123') {
                loginFeedback.textContent = '';
                adminPasswordInput.value = '';
                sessionStorage.setItem('admin_logged_in', 'true'); // Oturumu başlat
                closeModal(adminLoginModal);
                openModal(adminDashboardModal);
                loadMessages();
            } else {
                loginFeedback.textContent = 'Hatalı şifre! Tekrar deneyin.';
            }
        });

        // Enter ile giriş yapabilme
        adminPasswordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loginBtn.click();
            }
        });
    }

    // Mesajları listeleme
    function loadMessages() {
        if (!messagesTableBody || !noMessagesMsg) return;
        
        const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
        messagesTableBody.innerHTML = '';
        
        if (messages.length === 0) {
            noMessagesMsg.style.display = 'block';
        } else {
            noMessagesMsg.style.display = 'none';
            // En yeni mesajlar üstte görünsün diye tersine çeviriyoruz
            const reversedMessages = [...messages].reverse();
            reversedMessages.forEach((msg) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${msg.date}</td>
                    <td><strong>${escapeHtml(msg.name)}</strong></td>
                    <td><a href="mailto:${escapeHtml(msg.email)}">${escapeHtml(msg.email)}</a></td>
                    <td>${escapeHtml(msg.message)}</td>
                    <td><button class="btn-delete-msg" data-id="${msg.id}">Sil</button></td>
                `;
                messagesTableBody.appendChild(tr);
            });

            // Silme butonlarını bağla
            document.querySelectorAll('.btn-delete-msg').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    deleteMessage(id);
                });
            });
        }
    }

    // Tekil mesaj silme
    function deleteMessage(id) {
        if (confirm('Bu mesajı veritabanından silmek istediğinize emin misiniz?')) {
            const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
            const filtered = messages.filter(msg => msg.id !== id);
            localStorage.setItem('contact_messages', JSON.stringify(filtered));
            loadMessages();
        }
    }

    // Tümünü temizleme
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (confirm('TÜM mesajları kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
                localStorage.removeItem('contact_messages');
                loadMessages();
            }
        });
    }

    // CSV (Excel uyumlu) İndirme
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
            const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
            if (messages.length === 0) {
                alert('Dışa aktarılacak hiç mesaj bulunmuyor.');
                return;
            }

            let csvContent = "\uFEFF"; // Türkçe karakter desteği için BOM ekliyoruz
            csvContent += "Tarih,Ad Soyad,E-posta,Mesaj\n";

            messages.forEach(msg => {
                const name = `"${msg.name.replace(/"/g, '""')}"`;
                const email = `"${msg.email.replace(/"/g, '""')}"`;
                const message = `"${msg.message.replace(/"/g, '""')}"`;
                csvContent += `${msg.date},${name},${email},${message}\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `gelen_mesajlar_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // XSS önleme yardımcı fonksiyonu
    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
