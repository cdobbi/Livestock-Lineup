document.addEventListener("DOMContentLoaded", function () {
  const publishDateElement = document.getElementById("publish-date");
  const now = new Date();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  publishDateElement.textContent = now.toLocaleDateString("en-US", options);
});
