 //............................................Canvas and X,Y Position ......................................................//

// Canvas size and contex

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let dpi = window.devicePixelRatio; // To fix the pixulated canvas issue

function fix_dpi() {
  let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
  let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
  canvas.setAttribute('height', style_height * dpi);
  canvas.setAttribute('width', style_width * dpi);
}
fix_dpi();

document.querySelector("#first-size").addEventListener("click", () => {
  canvas.style.height = `${90}vh`;
  canvas.style.width = `${85}vw`;
  fix_dpi();
  document.querySelector(".drop-down-menue").style.width = "0";
})

document.querySelector("#second-size").addEventListener("click", () => {
  canvas.style.height = `${50}vh`;
  canvas.style.width = `${50}vw`;
  fix_dpi();
  document.querySelector(".drop-down-menue").style.width = "0";
})

document.querySelector("#third-size").addEventListener("click", () => {
  canvas.style.height = `${30}vh`;
  canvas.style.width = `${30}vh`;
  fix_dpi();
  document.querySelector(".drop-down-menue").style.width = "0";
})



// Mouse position

function getMousePos(canvas, e) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

// Touch position
function getTouchPos(canvas, e) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: e.touches[0].clientX - rect.left,
    y: e.touches[0].clientY - rect.top
  };
}

//............................................Tools......................................................//

// change tool's focus, put its name in the title, and call its function !

var allTools = document.querySelectorAll(".tool");

for (var i = 0; i < allTools.length; i++) {
  allTools[i].addEventListener("click", function() {
    for (var i = 0; i < allTools.length; i++) {
      allTools[i].style.backgroundColor = "#ebecf0";
      allTools[i].firstElementChild.style.stroke = "black";
    }
    this.style.backgroundColor = "black";
    this.firstElementChild.style.stroke = "white";
    var idName = this.id;
    selectTool(idName);
  });
}

var title = document.querySelector("#title");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Tools handler

function selectTool(idName) {

  switch (idName) {

    case "autodraw":
      title.innerHTML = capitalizeFirstLetter(idName);
      hideContent();
      removeAllEventListeners();
      document.querySelector(".auto-draw-content").style.display = "flex";
      break;

    case "draw":
      title.innerHTML = capitalizeFirstLetter(idName);
      hideContent();
      document.querySelector(".draw-content").style.display = "block";
      removeAllEventListeners();

      draw();
      break;

    case "type":
      title.innerHTML = capitalizeFirstLetter(idName);
      hideContent();
      document.querySelector(".type-content").style.display = "flex";
      document.querySelector("#fill-content").style.display = "inline-block";
      removeAllEventListeners();

      type();
      break;

    case "BackgroundColor":
      title.innerHTML = capitalizeFirstLetter(idName);
      removeAllEventListeners();
      hideContent();
      fillBackground();
      break;

    case "shape":
      title.innerHTML = capitalizeFirstLetter(idName);
      removeAllEventListeners();
      hideContent();
      document.querySelector(".draw-content").style.display = "inline-block";
      document.querySelector(".shapes-container").style.display = "inline-block";
      document.querySelector("#fill-content").style.display = "inline-block";
      drawShapes();
      break;

    case "zoom":
      title.innerHTML = capitalizeFirstLetter(idName);
      hideContent();
      break;

  }
}

function hideContent() {
  document.querySelector(".draw-content").style.display = "none";
  document.querySelector(".auto-draw-content").style.display = "none";
  document.querySelector(".type-content").style.display = "none";
  document.querySelector(".shapes-container").style.display = "none";
  document.querySelector("#fill-content").style.display = "none";

}

function removeAllEventListeners() {
  canvas.removeEventListener("mousedown", write);
  canvas.removeEventListener("click", fill);
  canvas.removeEventListener("mousedown", startPosition);
  canvas.removeEventListener('mousedown', dragStart);
  canvas.removeEventListener('mouseup', dragStop);
  canvas.removeEventListener('mousemove', drag);
  canvas.removeEventListener('touchstart', dragStartTouch);
  canvas.removeEventListener('touchmove', dragTouch);
  canvas.removeEventListener('touchup', dragStopTouch);
}

//............................................All Tools Functions......................................................//


// Draw function for Mobile and Desktop

let painting = false;

function draw() {
  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", endPosition);
  canvas.addEventListener("mousemove", drawing);
  canvas.addEventListener("touchstart", startPosition);
  canvas.addEventListener("touchend", endPosition);
  canvas.addEventListener("touchmove", drawingMobile);
}

function startPosition() {
  painting = true;
}

function endPosition() {
  painting = false;
  ctx.beginPath();
  cPush();
}

function drawing(e) {
  if (!painting) return;

  ctx.lineWidth = document.querySelector("#myRange").value;
  ctx.lineCap = "round";
  ctx.strokeStyle = document.querySelector(".colors").style.backgroundColor;

  var pos = getMousePos(canvas, e);
  ctx.lineTo(pos.x * dpi, pos.y * dpi);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x * dpi, pos.y * dpi);
}

function drawingMobile(e) {
  if (!painting) return;

  ctx.lineWidth = document.querySelector("#myRange").value;
  ctx.lineCap = "round";
  ctx.strokeStyle = document.querySelector(".colors").style.backgroundColor;

  var pos = getTouchPos(canvas, e);
  ctx.lineTo(pos.x * dpi, pos.y * dpi);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x * dpi, pos.y * dpi);
}


// Type function

var ctx3 = canvas.getContext("2d");
var text2 = document.querySelector("#blank");
var fontSize = document.querySelector("#font-size");
var fontStyle = document.querySelector("#font-style");


function type() {
  canvas.addEventListener("mousedown", write);
}

function write(e) {
  var pos = getMousePos(canvas, e);
  var theFont = fontSize.value + "px " + fontStyle.value;

  if (fillBox.checked) {
    ctx3.font = theFont;
    ctx3.fillStyle = document.querySelector(".colors").style.backgroundColor;
    ctx3.fillText(text2.value, pos.x * dpi, pos.y * dpi);
  } else {
    ctx3.font = theFont;
    ctx3.lineWidth = 1;
    ctx4.lineCap = "butt";
    ctx3.strokeStyle = document.querySelector(".colors").style.backgroundColor;
    ctx3.strokeText(text2.value, pos.x * dpi, pos.y * dpi);
  }
  cPush();
}

// AutoDraw images function
var images = document.querySelectorAll(".auto-draw-image-content img");
var img;

for (var i = 0; i < images.length; i++) {

  images[i].addEventListener("click", function() {
    img = new Image()
    img.src = this.src;
    img.setAttribute('crossorigin', 'anonymous');

    img.onload = function() {
      idName = "img";
      drawShapes();
    };
  });
}

function print(e) {
  ctx.drawImage(img, (dragStartLocation.x * dpi) - (e.x - dragStartLocation.x) / 2, (dragStartLocation.y * dpi) - (e.x - dragStartLocation.x) / 2, (e.x - dragStartLocation.x) * dpi * 2, (e.x - dragStartLocation.x) * dpi * 2);
}


// Fill background color function

const ctx2 = canvas.getContext("2d");


function fillBackground() {
  canvas.addEventListener("click", fill);
}

function fill() {
  ctx2.fillStyle = document.querySelector(".colors").style.backgroundColor;
  ctx2.fillRect(0, 0, canvas.width, canvas.height);
  cPush();
}


// Shapes functions: square, circle and traingle.

let dragging = false;
let dragStartLocation;
let snapshot;
const ctx4 = canvas.getContext("2d");
var fillBox = document.getElementById("fillBox");

function takeSnapshot() {
  snapshot = ctx4.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapshot() {
  ctx4.putImageData(snapshot, 0, 0);
}

function drawCircle(e) {
  var radius = Math.sqrt(Math.pow((dragStartLocation.x - e.x), 2) + Math.pow((dragStartLocation.y - e.y), 2));
  ctx4.beginPath();
  ctx4.arc(dragStartLocation.x * dpi, dragStartLocation.y * dpi, radius * dpi, 0, 2 * Math.PI, false);
  if (fillBox.checked) {
      ctx4.fill();
  } else {
      ctx4.stroke();
  }
  ctx4.beginPath();
}

function drawPolygon(e, sides, angle) {
  var coordinates = [],
    radius = Math.sqrt(Math.pow((dragStartLocation.x - e.x), 2) + Math.pow((dragStartLocation.y - e.y), 2)),
    index = 0;

  for (index = 0; index < sides + 1; index++) {
    coordinates.push({
      x: dragStartLocation.x + radius * Math.cos(angle),
      y: dragStartLocation.y - radius * Math.sin(angle)
    });
    angle += (2 * Math.PI) / sides;
  }
  ctx4.beginPath();
  ctx4.moveTo(coordinates[0].x * dpi, coordinates[0].y * dpi);

  for (index = 0; index < sides + 1; index++) {
    ctx4.lineTo(coordinates[index].x * dpi, coordinates[index].y * dpi);
    if (fillBox.checked) {
        ctx4.fill();
    } else {
        ctx4.stroke();
    }
  }

  ctx4.closePath();
  ctx4.beginPath();
}

function drawLine(e) {
    ctx.beginPath();
    ctx.moveTo(dragStartLocation.x  * dpi, dragStartLocation.y  * dpi);
    ctx.lineTo(e.x  * dpi, e.y  * dpi);
    ctx.stroke();
}

function dragStart(e) {
  dragging = true;
  ctx4.lineWidth = document.querySelector("#myRange").value;
  ctx4.strokeStyle = document.querySelector(".colors").style.backgroundColor;
  ctx4.fillStyle = document.querySelector(".colors").style.backgroundColor;
  dragStartLocation = getMousePos(canvas, e);
  takeSnapshot();
}

function drag(e) {
  if (!dragging) return;
  restoreSnapshot();
  let pos = getMousePos(canvas, e);
  selectShape(pos, idName);
}

function dragStop(e) {
  dragging = false;
  restoreSnapshot();
  let pos = getMousePos(canvas, e);
  selectShape(pos, idName);
  cPush();
}

function dragStartTouch(e) {
  dragging = true;
  ctx4.lineWidth = document.querySelector("#myRange").value;
  ctx4.strokeStyle = document.querySelector(".colors").style.backgroundColor;
  ctx4.fillStyle = document.querySelector(".colors").style.backgroundColor;
  dragStartLocation = getTouchPos(canvas, e);
  takeSnapshot();
}

function dragTouch(e) {
  if (!dragging) return;
  restoreSnapshot();
  let pos = getTouchPos(canvas, e);
  selectShape(pos, idName);
}

function dragStopTouch(e) {
  dragging = false;
  restoreSnapshot();
  let pos = getTouchPos(canvas, e);
  selectShape(pos, idName);
  cPush();
}

function drawShapes() {
  canvas.addEventListener('mousedown', dragStart);
  canvas.addEventListener('mousemove', drag);
  canvas.addEventListener('mouseup', dragStop);
  canvas.addEventListener('touchstart', dragStartTouch);
  canvas.addEventListener('touchmove', dragTouch);
  canvas.addEventListener('touchup', dragStopTouch);
}


var idName;
var allShapes = document.querySelectorAll(".shapes-content div");
for (var i = 0; i < allShapes.length; i++) {
  allShapes[i].addEventListener("click", function() {
    for (var i = 0; i < allShapes.length; i++) {
      allShapes[i].style.border = "1px solid transparent";
    }
    this.style.border = "1px solid #aaa";
    idName = this.id;
    selectShape(idName);
  });
}


function selectShape(pos, idName) {

  switch (idName) {

    case "circle":
      ctx4.lineCap = "round";
      drawCircle(pos);
      break;

    case "traingle":
      ctx4.lineCap = "round";
      drawPolygon(pos, 3, Math.PI / 2);
      break;

    case "square":
      ctx4.lineCap = "square";
      drawPolygon(pos, 4, Math.PI / 4);
      break;

    case "img":
      print(pos);
      break;

      case "line":
        ctx4.lineCap = "round";
        drawLine(pos)
        break;

      case "polygon":
        ctx4.lineCap = "round";
        drawPolygon(pos, 6, Math.PI / 3);
        break;

  }
}


// Undo function

var cPushArray = new Array();
var cStep = -1;

function cPush() {
  cStep++;
  if (cStep < cPushArray.length) {
    cPushArray.length = cStep;
  }
  cPushArray.push(canvas.toDataURL());
}

document.querySelector("#undo").addEventListener("click", () => {
  if (cStep < 0) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cStep--;
  if (cStep >= 0) {
    var canvasPic = new Image();
    canvasPic.src = cPushArray[cStep];
    canvasPic.onload = function() {
      ctx.drawImage(canvasPic, 0, 0, canvas.width, canvas.height);
    }
  }
})

// Redo function

document.querySelector("#redo").addEventListener("click", () => {
  if (cStep < cPushArray.length - 1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cStep++;
    var canvasPic = new Image();
    canvasPic.src = cPushArray[cStep];
    canvasPic.onload = function() {
      ctx.drawImage(canvasPic, 0, 0, canvas.width, canvas.height);
    }
  }
})



// change the main color

for (var i = 0; i < document.querySelectorAll(".pallet li").length; i++) {
  document.querySelectorAll(".pallet li")[i].addEventListener("click", function() {
    var colorOption = this.style.backgroundColor;
    document.querySelector(".colors").style.backgroundColor = colorOption;
  });
}

document.querySelector("#colors-input").addEventListener("focus", () => {
  document.querySelector(".colors-pallet").style.display = "flex";
})

document.querySelector("#colors-input").addEventListener("blur", () => {
  document.querySelector(".colors-pallet").style.display = "none";
  document.querySelector(".colors").style.backgroundColor = document.querySelector("#colors-input").value;
})


//............................................Menue + Models......................................................//


//Download
document.querySelector("#download").addEventListener("click", () => {
  document.querySelector(".mask").style.display = "block";
  document.querySelector(".drop-down-menue").style.display = "none";
})
document.querySelector("#download-button").addEventListener("click", () => {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.href = canvas.toDataURL();
  a.download = "canvas-image.png";
  a.click();
  document.body.removeChild(a);
  document.querySelector(".mask").style.display = "none";
})
document.querySelector("#cancel").addEventListener("click", () => {
  document.querySelector(".mask").style.display = "none";
})

// Share
document.querySelector("#share").addEventListener("click", () => {
  document.querySelector(".drop-down-menue").style.display = "none";
  document.querySelector(".mask2").style.display = "block";
  var dataURI = canvas.toDataURL();
  document.querySelector("#share-input").value = dataURI;
})
document.querySelector("#copied").addEventListener("click", () => {
  document.querySelector(".mask2").style.display = "none";
})

// Delete
document.querySelector("#delete").addEventListener("click", () => {
  document.querySelector(".drop-down-menue").style.display = "none";
  document.querySelector(".mask3").style.display = "block";
})
document.querySelector("#delete-button").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cPushArray = [];
  document.querySelector(".mask3").style.display = "none";
})
document.querySelector("#dont-delete").addEventListener("click", () => {
  document.querySelector(".mask3").style.display = "none";
})

// drop Down Menue + close some models
document.querySelector("#ham").onclick = dropMenue;
document.querySelector("#exit").onclick = closeMenue;
document.querySelector("#exit2").onclick = skip;
document.querySelector("#skip").onclick = skip;

function dropMenue() {
  document.querySelector(".drop-down-menue").style.display = "block";
  var x = window.matchMedia("(max-width: 770px)");
  position(x);
  x.addListener(position);

  function position(x) {
    if (x.matches) {
      document.querySelector(".drop-down-menue").style.width = "100vw";
    } else {
      document.querySelector(".drop-down-menue").style.width = "250px";
    }
  }
  x.removeListener(position);
}

function closeMenue() {
  document.querySelector(".drop-down-menue").style.width = "0";
}

function skip() {
  document.querySelector(".drop-down-menue").style.display = "none";
  document.querySelector(".how-to").style.display = "none";
  document.querySelector("#about").style.display = "none";
}

document.querySelector("#how-to").onclick = show;

function show() {
  document.querySelector(".how-to").style.display = "flex";
}

document.querySelector(".about").onclick = show2;

function show2() {
  document.querySelector("#about").style.display = "block";
}

//............................................Sliders......................................................//

// "How-to" vedio show slider

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("vedio");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1
  }
  if (n < 1) {
    slideIndex = slides.length
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

// Colors pallet's slider

var palletIndex = 1;
showPallet(palletIndex);

function plusPallet(n) {
  showPallet(palletIndex += n);
}

function currentPallet(n) {
  showPallet(palletIndex = n);
}

function showPallet(n) {
  var i;
  var pallets = document.querySelectorAll(".pallet");
  if (n > pallets.length) {
    palletIndex = 1
  }
  if (n < 1) {
    palletIndex = pallets.length
  }


  for (i = 0; i < pallets.length; i++) {
    pallets[i].style.display = "none";
  }

  pallets[palletIndex - 1].style.display = "flex";
}



//............................................Commented Snippets of Codes......................................................//



// canvas.height = (window.innerHeight /2) * window.devicePixelRatio;
// canvas.width = (window.innerWidth/2) * window.devicePixelRatio;
//
// canvas.style.height = `${(window.innerHeight /2)}px`;
// canvas.style.width = `${(window.innerWidth/2)}px`;


// function getMousePosForRec(canvas, e) {
//     var rect = canvas.getBoundingClientRect();
//     return {
//       x: e.clientX - rect.left ,
//       y: e.clientY - rect.top
//     };
// }

// window.addEventListener("resize", ()=> {
//
//
// })
