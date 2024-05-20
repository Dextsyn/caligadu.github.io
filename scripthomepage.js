let currentIndex = 0;

function showNextSlide() {
    const slides = document.querySelector('.slides');
    currentIndex = (currentIndex + 1) % 2; // Two slides (0 and 1)
    const offset = -currentIndex * 100;
    slides.style.transform = `translateX(${offset}%)`;
}

// Automatically move to the next slide every 3 seconds
setInterval(showNextSlide, 3000);
