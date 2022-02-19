function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");

  return d;
}

function getBallAngle() {
  function angle(originX, originY, targetX, targetY) {
    // https://stackoverflow.com/questions/9614109/how-to-calculate-an-angle-from-points/47653643#47653643
    const dy = targetY - originY;
    const dx = targetX - originX;
    let theta = Math.atan2(dx, -dy); // rads, range [-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range [-180, 180]
    return theta < 0 ? 360 + theta : theta; // degs, range [0, 360)
  }

  const bg = document.getElementById("bg").getBoundingClientRect();
  const bgCenter = { x: bg.left + bg.width / 2, y: bg.top + bg.height / 2 };
  const ball = document.getElementById("ball").getBoundingClientRect();
  const ballCenter = {
    x: ball.left + ball.width / 2,
    y: ball.top + ball.height / 2,
  };
  return angle(bgCenter.x, bgCenter.y, ballCenter.x, ballCenter.y);
}

function isBallInArc() {
    console.log(`ball angle: ${getBallAngle()}`)
    console.log(`start: ${window.arch.archStart}`)
    console.log(`end: ${window.arch.archEnd}`)
  return (
    getBallAngle() + 12 > window.arch.archStart &&
    getBallAngle() - 12 < window.arch.archEnd
  );
}

function randomizeArch() {
  let archStart = Math.floor(Math.random() * 300);
  let archEnd = archStart + Math.max(Math.floor(Math.random() * 59), 20);
  document
    .getElementById("arc")
    .setAttribute("d", describeArc(50, 50, 15, archStart, archEnd));
  window.arch = { archStart, archEnd };
}

function incrementScore() {
  document.getElementById("score").textContent =
    parseInt(document.getElementById("score").textContent) + 1;
}

function stopBall() {
  document.getElementById("ball").style.animationPlayState = "paused";
}

function startBall() {
  document.getElementById("ball").style.animationPlayState = "running";
}

function increaseBallSpeed() {
  var current = document.getElementById("ball")
    .style.animationDuration || "3000ms";
  current = parseInt(current.substring(0, current.length - 2));
  document.getElementById("ball").style.animationDuration = `${current - 15}ms`;
}

function startGame() {
  Array.from(document.getElementsByClassName("help")).forEach((element) => element.style.display = "none");
  document.getElementById("play").style.display = "none";
  randomizeArch();
  document.getElementById("score").textContent = "0";
  startBall();
  window.state = "started";
}

function displayHelp() {
    Array.from(document.getElementsByClassName("help")).forEach((element) => element.style.display = "block");
    document.getElementById("play").style.display = "block";
}

window.onload = function () {
    document
      .getElementById("arc")
      .setAttribute("d", describeArc(50, 50, 15, 180, 275));
  window.state = "stopped";
};

window.addEventListener("mousedown", (e) => {
    e.preventDefault();
  if (window.state === "started") {
    if (isBallInArc()) {
      randomizeArch();
      incrementScore();
      increaseBallSpeed();
    } else {
      console.log("Ending game.")
      window.state = "stopped";
      stopBall();
      displayHelp();
    }
  } else {
      startGame();
  }
});