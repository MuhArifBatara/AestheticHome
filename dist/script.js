    
    // NAVBAR
    // Efek saat di-scroll (navbar blur, footer warna pink, tombol muncul)
    window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const footer = document.querySelector('footer');
    const backToTop = document.getElementById('backToTop');

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        footer.classList.add('scrolled');
        if (backToTop) backToTop.style.display = 'block';
    } else {
        navbar.classList.remove('scrolled');
        footer.classList.remove('scrolled');
        if (backToTop) backToTop.style.display = 'none';
    }
    });

    // ===== Scroll Halus untuk Menu Navbar & Footer =====
    document.querySelectorAll('a.nav-link, footer a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
        window.scrollTo({
            top: targetElement.offsetTop - 70, // menyesuaikan tinggi navbar
            behavior: 'smooth'
        });
        }
    });
    });

    // Back to Top Button
    document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    });




    //  HAMBURGER
    document.addEventListener("DOMContentLoaded", function () {
    const toggler = document.querySelector(".navbar-toggler");
    const collapse = document.querySelector(".navbar-collapse");

      // Klik tombol hamburger → toggle aktif
    toggler.addEventListener("click", function () {
        this.classList.toggle("active");
    });

      // Tutup menu saat salah satu link diklik
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function () {
        $('.navbar-collapse').collapse('hide');
        toggler.classList.remove("active");
        });
    });

      // Reset ikon saat menu tertutup otomatis
    $('.navbar-collapse').on('hidden.bs.collapse', function () {
        toggler.classList.remove("active");
    });
    });





    // POPUP DETAIL PRODUK 
    document.addEventListener("DOMContentLoaded", function () {
    const productModal = document.getElementById("productModal");
    const carouselInner = productModal.querySelector(".carousel-inner");

    document.querySelectorAll(".btn-detail").forEach(btn => {
        btn.addEventListener("click", function () {
        const title = this.dataset.title;
        const desc = this.dataset.desc;
        const oldPrice = this.dataset.oldprice;
        const price = this.dataset.price;
        const images = JSON.parse(this.dataset.images);

        document.getElementById("modalTitle").textContent = title;
        document.getElementById("modalDesc").innerHTML = desc;
        document.getElementById("modalOldPrice").textContent = oldPrice;
        document.getElementById("modalPrice").textContent = price;

        carouselInner.innerHTML = "";
        images.forEach((src, index) => {
            const item = document.createElement("div");
            item.classList.add("carousel-item");
            if (index === 0) item.classList.add("active");
            item.innerHTML = `<img src="${src}" class="d-block w-100" alt="">`;
            carouselInner.appendChild(item);
        });

        const oldCarousel = bootstrap.Carousel.getInstance(document.querySelector('#productCarousel'));
        if (oldCarousel) oldCarousel.dispose();
        new bootstrap.Carousel(document.querySelector('#productCarousel'), {
            interval: 4000,
            ride: false,
            touch: true,
            pause: 'hover',
            wrap: true
        });
        });
    });

    const carousel = document.getElementById('productCarousel');
    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 40;

    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        const carouselInstance = bootstrap.Carousel.getInstance(carousel);
        if (Math.abs(diff) > SWIPE_THRESHOLD) {
        diff < 0 ? carouselInstance.next() : carouselInstance.prev();
        }
    }, {passive: true});
    });


    // Detail Produk 2
    // kllik gambar produk 
    const imgs = document.querySelectorAll('.img-select a');
    const imgBtns = [...imgs];
    let imgId = 1;

    imgBtns.forEach((imgItem) => {
        imgItem.addEventListener('click', (event) => {
            event.preventDefault();
            imgId = imgItem.dataset.id;
            slideImage();
        });
    });

    function slideImage(){
        const displayWidth = document.querySelector('.img-showcase img:first-child').clientWidth;

        document.querySelector('.img-showcase').style.transform = `translateX(${- (imgId - 1) * displayWidth}px)`;
    }

    window.addEventListener('resize', slideImage);
    // akhir klik gambar produk 


    // deskripsi produk
    const parentContainer =  document.querySelector('.read-more-colom');

    parentContainer.addEventListener('click', event=>{

        const current = event.target;

        const isReadMoreBtn = current.className.includes('read-more-btn');

        if(!isReadMoreBtn) return;

        const currentText = event.target.parentNode.querySelector('.read-more-text');

        currentText.classList.toggle('read-more-text--show');

        current.textContent = current.textContent.includes('Deskripsi Lengkap') ? "Sembunyikan" : "Deskripsi Lengkap";

    })
    // akhir deskripsi produk

    // slide gambar dan video
    const sliderContainer = document.querySelector('.img-display');
    const slider = document.querySelector('.img-showcase');
    const images = document.querySelectorAll('.img-showcase img');
    const videos = document.querySelectorAll('.img-showcase video');
    const slideIndicators = document.querySelectorAll('.slide-indicator');
    let currentIndex = 0;
    let startPosition = 0;

    images.forEach((img, index) => {
        img.addEventListener('touchstart', touchStart);
        img.addEventListener('touchmove', touchMove);
        img.addEventListener('touchend', touchEnd);
    });

    videos.forEach((video, index) => {
        video.addEventListener('touchstart', touchStart);
        video.addEventListener('touchmove', touchMove);
        video.addEventListener('touchend', touchEnd);
        video.addEventListener('ended', nextSlide);
    });

    function touchStart(e) {
        const touch = e.touches[0];
        startPosition = touch.clientX;
    }

    function touchMove(e) {
        e.preventDefault(); // Prevent scrolling while swiping
    }

    function touchEnd(e) {
        const touch = e.changedTouches[0];
        const endPosition = touch.clientX;
        const difference = startPosition - endPosition;
        const sensitivity = 50; // Adjust as needed for sensitivity
        if (Math.abs(difference) > sensitivity) {
            if (difference > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % (images.length + videos.length);
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + (images.length + videos.length)) % (images.length + videos.length);
        updateSlider();
    }

    function currentSlide(index) {
        currentIndex = index - 1;
        updateSlider();
    }

    function updateSlider() {
        const slideWidth = sliderContainer.clientWidth;
        const translateX = -currentIndex * slideWidth;
        const transitionDuration = '0.8s'; // Adjust as needed
        slider.style.transition = `transform ${transitionDuration} ease-in-out`;
        slider.style.transform = `translateX(${translateX}px)`;
        updateIndicators();
    }

    function updateIndicators() {
        slideIndicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    slider.addEventListener('transitionend', () => {
        slider.style.transition = ''; // Remove transition after it's done
    });

    updateSlider();


    // akhir slide gambar dan video


    // ====== SWIPER PENILAIAN PRODUK ====== //

    const postActionsControllers = document.querySelectorAll(
      ".post-actions-controller"
    );

    postActionsControllers.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");
        const postActionsContent = document.getElementById(targetId);

        if (postActionsContent) {
          const isVisible = postActionsContent.getAttribute("data-visible");

          if (isVisible === "false") {
            postActionsContent.setAttribute("data-visible", "true");
            postActionsContent.setAttribute("aria-hidden", "false");
            btn.setAttribute("aria-expanded", "true");
          } else {
            postActionsContent.setAttribute("data-visible", "false");
            postActionsContent.setAttribute("aria-hidden", "true");
            btn.setAttribute("aria-expanded", "false");
          }
        }
      });
    });

    function handleClickOutside(event) {
      postActionsControllers.forEach((btn) => {
        const targetId = btn.getAttribute("data-target");
        const postActionsContent = document.getElementById(targetId);

        if (postActionsContent && postActionsContent.getAttribute("data-visible") === "true") {
          if (!postActionsContent.contains(event.target) && event.target !== btn) {
            postActionsContent.setAttribute("data-visible", "false");
            postActionsContent.setAttribute("aria-hidden", "true");
            btn.setAttribute("aria-expanded", "false");
          }
        }
      });
    }

    document.addEventListener("click", handleClickOutside);

    postActionsControllers.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    });

    const likeBtns = document.querySelectorAll(".post-like");

    likeBtns.forEach((likeBtn) => {
      likeBtn.addEventListener("click", () => {
        if (likeBtn.classList.contains("active")) {
          likeBtn.classList.remove("active");
        } else {
          likeBtn.classList.add("active");
        }
      });
    });

    // Swiper

    var swiper = new Swiper(".swiper", {
      grabCursor: true,
      speed: 400,
      mousewheel: {
        invert: false,
      },
      scrollbar: {
        el: ".swiper-scrollbar",
        draggable: true,
      },
      slidesPerView: 1,
      spaceBetween: 10,
      // Responsive breakpoints
      breakpoints: {
        900: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
      },
    });




// ==== SKRIP VIDEO ==== // 
document.querySelectorAll(".video-wrapper").forEach(wrapper => {
  
  // Mendeteksi video: myVideo, myVideo2, atau <video> apapun
  const video = wrapper.querySelector(".myVideo") 
              || wrapper.querySelector("#myVideo2") 
              || wrapper.querySelector("video");
  const playBtn = wrapper.querySelector(".playBtn");
  const playPauseBtn = wrapper.querySelector(".playPauseBtn");
  const volumeIcon = wrapper.querySelector(".volumeIcon");
  const volumeControl = wrapper.querySelector(".volumeControl");
  const fullscreenBtn = wrapper.querySelector(".fullscreenBtn");
  const timeDisplay = wrapper.querySelector(".timeDisplay");
  // Format waktu
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
  }

  // Update durasi
  video.addEventListener("timeupdate", () => {
    timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  });
  video.addEventListener("loadedmetadata", () => {
    timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
  });

  // Play/Pause toggle
  function togglePlay() {
    if (video.paused) {
      video.play();
      playBtn.style.display = "none";
      playPauseBtn.innerHTML = "❚❚";
    } else {
      video.pause();
      playBtn.style.display = "block";
      playPauseBtn.innerHTML = "&#9658;";
    }
  }

  playBtn.addEventListener("click", togglePlay);
  playPauseBtn.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);

  video.addEventListener("ended", () => {
    playPauseBtn.innerHTML = "&#9658;";
    playBtn.style.display = "block";
  });

  // Volume
  volumeControl.addEventListener("input", () => {
    video.volume = volumeControl.value;
    updateVolumeIcon();
  });

  function updateVolumeIcon() {
    if (video.volume === 0) volumeIcon.textContent = "🔇";
    else if (video.volume < 0.5) volumeIcon.textContent = "🔉";
    else volumeIcon.textContent = "🔊";
  }

  

  // Fullscreen
  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement === wrapper) {
      wrapper.classList.add("fullscreen");
    } else {
      wrapper.classList.remove("fullscreen");
    }
  });

});

