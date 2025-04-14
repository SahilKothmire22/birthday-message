document.addEventListener("DOMContentLoaded", function() {
  // Trigger confetti on page load
  launchConfetti();
  
  // Background color transition on scroll
  window.addEventListener("scroll", function() {
    const scrollPosition = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercentage = scrollPosition / maxScroll;
    
    // Calculate RGB values for background transition from light pink to dark pink
    const r = Math.floor(255 - (scrollPercentage * 117)); // 255 -> 138
    const g = Math.floor(230 - (scrollPercentage * 188)); // 230 -> 42
    const b = Math.floor(240 - (scrollPercentage * 158)); // 240 -> 82
    
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    
    // Change text color for better readability when background gets darker
    if (scrollPercentage > 0.5) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
    
    // Show the upload box when the user scrolls near the bottom
    const uploadBox = document.getElementById("uploadBox");
    if (scrollPercentage > 0.85) {
      uploadBox.style.display = "block";
    }
  });
  
  // Interactive elements
  const gridItems = document.querySelectorAll('.grid-item');
  gridItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      launchTinyConfetti(this);
    });
  });
  
  // Check all images and handle loading issues
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // When image loads successfully
    img.addEventListener('load', function() {
      console.log('Image loaded successfully:', this.src);
      this.style.opacity = 1;
    });
    
    // Force image reload with correct dimensions
    if (img.complete) {
      // For already loaded images
      img.style.opacity = 1;
    }
  });
  
  // Handle photo upload
  const photoUpload = document.getElementById('photoUpload');
  const photoGallery = document.getElementById('photoGallery');
  
  if (photoUpload) {
    photoUpload.addEventListener('change', function(event) {
      const files = event.target.files;
      
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
              const galleryItem = document.createElement('div');
              galleryItem.className = 'gallery-item';
              galleryItem.style.animationDelay = `${i * 0.1}s`;
              
              const img = document.createElement('img');
              img.src = e.target.result;
              img.alt = 'Uploaded photo';
              
              galleryItem.appendChild(img);
              photoGallery.appendChild(galleryItem);
            };
            
            reader.readAsDataURL(file);
          }
        }
        
        // Show small confetti when photos are added
        launchSmallConfetti();
      }
    });
  }

  // Handle video upload preview
  const videoUpload = document.getElementById('videoUpload');
  const previewArea = document.getElementById('previewArea');

  if (videoUpload) {
    videoUpload.addEventListener('change', function(event) {
      const file = event.target.files[0];
      
      if (file && file.type.startsWith('video/')) {
        const videoElement = document.createElement('video');
        videoElement.controls = true;
        videoElement.autoplay = false;
        
        const videoURL = URL.createObjectURL(file);
        videoElement.src = videoURL;
        
        // Clear previous preview and add new video
        previewArea.innerHTML = '';
        previewArea.appendChild(videoElement);
        
        // Add celebration animation
        const celebrationDiv = document.createElement('div');
        celebrationDiv.classList.add('celebration');
        celebrationDiv.innerHTML = 
          <div>
            <p class="success-message">Video uploaded successfully! 🎬</p>
            <div class="sparkles">✨✨✨</div>
          </div>
        ;
        celebrationDiv.style.opacity = '0';
        previewArea.appendChild(celebrationDiv);
        
        // Animate the celebration
        setTimeout(() => {
          celebrationDiv.style.transition = 'opacity 0.5s ease';
          celebrationDiv.style.opacity = '1';
        }, 100);
        
        // Launch confetti when video is uploaded
        launchConfetti();
      }
    });
  }
  
  // Add confetti effect
  function launchConfetti() {
    var count = 200;
    var defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }
  
  // Launch smaller confetti
  function launchSmallConfetti() {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
  
  // Launch tiny confetti at a specific element
  function launchTinyConfetti(element) {
    const rect = element.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    confetti({
      particleCount: 15,
      spread: 30,
      origin: { x, y },
      colors: ['#ff6a88', '#ff99ac', '#ffc3a0', '#ffcbc4']
    });
  }
  
  // Randomly launch confetti every 10-15 seconds
  setInterval(function() {
    if (Math.random() > 0.7) { // 30% chance to trigger confetti
      launchSmallConfetti();
    }
  }, 10000 + Math.random() * 5000);
  
  // Add click event to title to launch confetti
  document.querySelector('.title').addEventListener('click', function() {
    launchConfetti();
  });
  
  // Add pop animation to emojis on click
  const emojis = document.querySelectorAll('.party-popper, .cake, .gift');
  emojis.forEach(emoji => {
    emoji.addEventListener('click', function() {
      this.style.animation = 'none';
      this.offsetHeight; // Trigger reflow
      this.style.animation = 'pop 0.5s forwards';
      launchTinyConfetti(this);
      
      setTimeout(() => {
        this.style.animation = this.classList.contains('party-popper') ? 'shake 1s infinite' :
                              this.classList.contains('cake') ? 'bounceIn 1s infinite alternate' :
                              'rotate 2s infinite alternate';
      }, 500);
    });
  });
});
// Pop animation for emojis
const style = document.createElement('style');
style.textContent = `
  @keyframes pop {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.4); }
    100% { transform: scale(1); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  @keyframes bounceIn {
    0%   { transform: translateY(-30px); opacity: 0; }
    60%  { transform: translateY(10px); opacity: 1; }
    100% { transform: translateY(0); }
  }

  @keyframes rotate {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(10deg); }
  }
`;
document.head.appendChild(style);
