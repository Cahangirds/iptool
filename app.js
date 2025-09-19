// ================= BACKGROUND GLITCH =================
const canvas = document.getElementById("glitchCanvas");
const ctx = canvas.getContext("2d");
const glitchColors = ["#2b4539", "#61dca3", "#61b3dc"];
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$&*";
const fontSize = 16, charWidth = 10, charHeight = 20;
let letters = [], grid = { columns: 0, rows: 0 };
let lastGlitchTime = Date.now();
const glitchSpeed = 50, smooth = true;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const columns = Math.ceil(window.innerWidth / charWidth);
  const rows = Math.ceil(window.innerHeight / charHeight);
  grid = { columns, rows };
  letters = Array.from({ length: columns * rows }, () => ({
    char: getRandomChar(),
    color: getRandomColor(),
    targetColor: getRandomColor(),
    colorProgress: 1
  }));
}
function getRandomChar() { return characters[Math.floor(Math.random() * characters.length)]; }
function getRandomColor() { return glitchColors[Math.floor(Math.random() * glitchColors.length)]; }
function drawLetters() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${fontSize}px monospace`;
  ctx.textBaseline = "top";
  letters.forEach((letter, i) => {
    const x = (i % grid.columns) * charWidth;
    const y = Math.floor(i / grid.columns) * charHeight;
    ctx.fillStyle = letter.color;
    ctx.fillText(letter.char, x, y);
  });
}
function updateLetters() {
  const updateCount = Math.max(1, Math.floor(letters.length * 0.05));
  for (let i = 0; i < updateCount; i++) {
    const index = Math.floor(Math.random() * letters.length);
    letters[index].char = getRandomChar();
    letters[index].targetColor = getRandomColor();
    if (!smooth) {
      letters[index].color = letters[index].targetColor;
      letters[index].colorProgress = 1;
    } else letters[index].colorProgress = 0;
  }
}
function hexToRgb(hex) {
  hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m,r,g,b)=>r+r+g+g+b+b);
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return res?{r:parseInt(res[1],16),g:parseInt(res[2],16),b:parseInt(res[3],16)}:null;
}
function interpolateColor(s,e,f) {
  return `rgb(${Math.round(s.r+(e.r-s.r)*f)},${Math.round(s.g+(e.g-s.g)*f)},${Math.round(s.b+(e.b-s.b)*f)})`;
}
function handleSmoothTransitions() {
  let needsRedraw = false;
  letters.forEach(letter=>{
    if(letter.colorProgress<1){
      letter.colorProgress+=0.05;
      if(letter.colorProgress>1) letter.colorProgress=1;
      const s=hexToRgb(letter.color), e=hexToRgb(letter.targetColor);
      if(s&&e){ letter.color=interpolateColor(s,e,letter.colorProgress); needsRedraw=true; }
    }
  });
  if(needsRedraw) drawLetters();
}
function animate() {
  const now = Date.now();
  if (now - lastGlitchTime >= glitchSpeed) {
    updateLetters(); drawLetters(); lastGlitchTime = now;
  }
  if (smooth) handleSmoothTransitions();
  requestAnimationFrame(animate);
}
resizeCanvas(); animate(); window.addEventListener("resize", resizeCanvas);

// ================= TYPING EFFECT =================
const typingEl = document.querySelector(".typing-text");
const text = "Welcome to My Portfolio";
let i = 0;
function typing() {
  if (i < text.length) {
    typingEl.innerHTML += text.charAt(i);
    i++;
    setTimeout(typing, 100);
  }
}
typing();

// ================= NAVIGATION =================
const menuItems = document.querySelectorAll(".menu li a");
const sections = document.querySelectorAll(".section");

menuItems.forEach(link=>{
  link.addEventListener("click", e=>{
    e.preventDefault();
    document.querySelector(".menu li.active")?.classList.remove("active");
    link.parentElement.classList.add("active");
    const target = link.getAttribute("href").substring(1);
    sections.forEach(sec=>sec.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});

// Hamburger menu toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdownMenu = document.querySelector(".dropdown-menu");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

// Tools dropdown toggle for mobile
dropdownToggle.addEventListener("click", (e) => {
  e.preventDefault(); // link yönləndirməsin
  dropdownMenu.classList.toggle("show");
});
