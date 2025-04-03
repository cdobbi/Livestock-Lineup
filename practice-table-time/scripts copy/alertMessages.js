export function showInitialAlert() {
  const alertMessage = document.createElement("div");
  alertMessage.className = "alert alert-info text-center";
  alertMessage.style.position = "fixed";
  alertMessage.style.top = "50%";
  alertMessage.style.left = "50%";
  alertMessage.style.transform = "translate(-50%, -50%)";
  alertMessage.style.zIndex = "1000";
  alertMessage.innerHTML = `
      <h4 class="alert-heading">Attention Writer!</h4>
      <p>When you're ready, click on the breed that is up next to send an alert to the exhibitor. Such as, when the judge is choosing best of breed.</p>
      <button id="close-alert" class="btn btn-primary">Close</button>
    `;
  document.body.appendChild(alertMessage);

  document.getElementById("close-alert").addEventListener("click", function () {
    alertMessage.style.display = "none";
    showSecondAlert();
  });
}

export function showSecondAlert() {
  const secondAlertMessage = document.createElement("div");
  secondAlertMessage.className = "alert alert-warning text-center";
  secondAlertMessage.style.position = "fixed";
  secondAlertMessage.style.top = "50%";
  secondAlertMessage.style.left = "50%";
  secondAlertMessage.style.transform = "translate(-50%, -50%)";
  secondAlertMessage.style.zIndex = "1000";
  secondAlertMessage.innerHTML = `
      <h4 class="alert-heading">Next Step!</h4>
      <p>If you accidentally click a box, it will send an alert to the exhibitor. Do not check a box until it's time.</p>
      <button id="close-second-alert" class="btn btn-primary">Close</button>
    `;
  document.body.appendChild(secondAlertMessage);

  document
    .getElementById("close-second-alert")
    .addEventListener("click", function () {
      secondAlertMessage.style.display = "none";
    });
}
