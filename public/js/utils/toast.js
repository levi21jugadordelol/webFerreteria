export function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");

  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.textContent = message;

  toast.style.padding = "10px 15px";
  toast.style.marginBottom = "10px";
  toast.style.borderRadius = "6px";
  toast.style.color = "#fff";
  toast.style.fontSize = "14px";

  toast.style.backgroundColor = type === "error" ? "#e74c3c" : "#2ecc71";

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2500);
}
