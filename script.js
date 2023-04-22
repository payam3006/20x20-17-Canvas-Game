const q = console.log;
q("hello!");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
q(ctx);
const scoreContainer = document.getElementById("scoreContainer");
const rulesContainer = document.getElementById("rules");

function showRules() {
  rulesContainer.classList.remove("closeRules");

  rulesContainer.classList.add("openRules");
}
function closeRules() {
  rulesContainer.classList.add("closeRules");

  rulesContainer.classList.remove("openRules");
}

/////////////////////////inputs///////////////////////
let blockWidthWeight = 10;
let blockheightWeight = 3;
let marginsWeight = 10;
let gapWeight = 1.5;
let blockHorizontalNum = 9;
let blockVerticalNum = 5;
let weightHorizontalSum =
  blockWidthWeight * blockHorizontalNum +
  gapWeight * (blockHorizontalNum - 1) +
  marginsWeight * 2;

//////////////////////////////////////////////////////

let winHeight = (window.innerHeight * 7) / 5;
let winWidth = window.innerWidth;
canvas.width = winWidth;
canvas.height = winHeight;

let blockWidth = (blockWidthWeight / weightHorizontalSum) * winWidth;
let blockHeight = blockWidth / (blockWidthWeight / blockheightWeight);
let gap = (gapWeight / weightHorizontalSum) * winWidth;
let margins = (marginsWeight / weightHorizontalSum) * winWidth;

let hd = margins;
let vd = margins;

window.addEventListener("resize", function () {
  winHeight = (window.innerHeight * 7) / 5;
  winWidth = window.innerWidth;
  canvas.width = winWidth;
  canvas.height = winHeight;
  blockWidth = (blockWidthWeight / weightHorizontalSum) * winWidth;
  blockHeight = blockWidth / (blockWidthWeight / blockheightWeight);
  gap = (gapWeight / weightHorizontalSum) * winWidth;
  margins = (marginsWeight / weightHorizontalSum) * winWidth;
  hd = margins;
  vd = margins;

  circle = {
    x: winWidth / 2,
    y: winHeight / 2,
    size: blockHeight,
    dx: winWidth / 300,
    dy: winHeight / 300,
  };

  //   block = {
  //     x: winWidth / 5,
  //     y: winHeight - blockHeight * 2,
  //     dx: winWidth / 120,
  //   };

  // update();
});

let circle = {
  x: winWidth / 2,
  y: winHeight / 2,
  size: blockHeight,
  dx: winWidth / 300,
  dy: winHeight / 300,
};

const drawCircle = () => {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.size / 2, 0, Math.PI * 2);
  ctx.fill();
};

let blocks = [];
for (let i = 0; i < blockHorizontalNum; i++) {
  blocks = blocks.concat([Array(blockVerticalNum)]);
}

let score = 0;
const fillScore = () => {
  scoreContainer.innerText = `Score: ${score}`;
};
fillScore();

function fillBlocks() {
  for (let i = 0; i < blockHorizontalNum; i++) {
    for (let j = 0; j < blockVerticalNum; j++) {
      blocks[i][j] = 1;
    }
  }
}

fillBlocks();

const checkHit = () => {
  for (let i = 0; i < blockHorizontalNum; i++) {
    for (let j = 0; j < blockVerticalNum; j++) {
      if (blocks[i][j] != 0) {
        ////top
        if (
          circle.x >= hd + (blockWidth + gap) * i &&
          circle.x <= hd + (blockWidth + gap) * i + blockWidth
        ) {
          if (
            circle.dy > 0 &&
            circle.y + circle.size / 2 >= vd + (blockHeight + gap) * j &&
            circle.y <= vd + (blockHeight + gap) * j + blockHeight
          ) {
            blocks[i][j] = 0;
            circle.dy *= -1;
            score += 1;
            fillScore();

            ///bottom
          } else {
            if (
              circle.dy < 0 &&
              circle.y - circle.size / 2 <=
                vd + (blockHeight + gap) * j + blockHeight &&
              circle.y - circle.size / 2 >= vd + (blockHeight + gap) * j
            ) {
              blocks[i][j] = 0;
              circle.dy *= -1;
              score += 1;
              fillScore();
            }
          }
        }
        ///left
        if (
          circle.y >= vd + (blockHeight + gap) * j &&
          circle.y <= vd + (blockHeight + gap) * j + blockHeight
        ) {
          if (
            circle.dx > 0 &&
            circle.x + circle.size / 2 >= hd + (blockWidth + gap) * i &&
            circle.x - circle.size / 2 <=
              hd + (blockWidth + gap) * i + blockWidth
          ) {
            blocks[i][j] = 0;
            circle.dx *= -1;
            score += 1;
            fillScore();

            ///right
          } else {
            if (
              circle.dx < 0 &&
              circle.x - circle.size / 2 <=
                hd + (blockWidth + gap) * i + blockWidth &&
              circle.x + circle.size / 2 >=
                hd + (blockWidth + gap) * i + blockWidth
            ) {
              blocks[i][j] = 0;
              circle.dx *= -1;
              score += 1;
              fillScore();
            }
          }
        }
      }
    }
  }
};

// q(blocks);

function drawBlocks() {
  for (let i = 0; i < blockHorizontalNum; i++) {
    for (let j = 0; j < blockVerticalNum; j++) {
      if (blocks[i][j] == 1) {
        ctx.fillRect(
          hd + (blockWidth + gap) * i,
          vd + (blockHeight + gap) * j,
          blockWidth,
          blockHeight
        );
      }
    }
  }
}

let block = {
  x: winWidth / 5,
  y: winHeight - blockHeight * 2,
  dx: winWidth / 80,
};

function drawBlock() {
  ctx.fillRect(block.x, block.y, blockWidth * 2.5, blockHeight);
}

window.addEventListener("keydown", (e) => {
  if (e.key == "ArrowRight" && block.x < winWidth - blockWidth * 2.5) {
    block.x += block.dx * 2;
  }
  if (e.key == "ArrowLeft" && block.x > 0) {
    block.x -= block.dx * 2;
  }
});

function update() {
  ctx.fillStyle = "blue";

  ctx.clearRect(0, 0, winWidth, winHeight);

  drawBlocks();

  drawBlock();

  drawCircle();

  if (circle.x >= winWidth - circle.size / 2) {
    circle.dx *= -1;
  }
  if (circle.x <= 0 + circle.size / 2) {
    circle.dx *= -1;
  }
  if (
    circle.y >= block.y - circle.size / 2 &&
    circle.x >= block.x - circle.size / 2 &&
    circle.x <= block.x + blockWidth * 2.5 - circle.size / 2
  ) {
    circle.dy *= -1;
  }
  if (circle.y >= winHeight - circle.size / 2) {
    circle.dy *= -1;
    fillBlocks();
    score = 0;
    fillScore();
  }
  if (circle.y <= 0 + circle.size / 2) {
    circle.dy *= -1;
  }

  checkHit();

  circle.x += circle.dx;
  circle.y += circle.dy;

  requestAnimationFrame(update);
}

update();
