import Drift from "drift-zoom";

const principal = document.getElementById("img-principal");

if (principal && window.innerWidth > 768) {
  let drift = new Drift(principal, {
    paneContainer: document.querySelector(".zoom-pane"),
    inlinePane: false,
    hoverBoundingBox: true,
    zoomFactor: 2,
  });

  document.querySelectorAll(".miniatura").forEach((img) => {
    img.addEventListener("click", () => {
      const src = img.dataset.src;

      principal.src = src;
      principal.setAttribute("data-zoom", src);

      drift.destroy();
      drift = new Drift(principal, {
        paneContainer: document.querySelector(".zoom-pane"),
        inlinePane: false,
        hoverBoundingBox: true,
        zoomFactor: 2,
      });
    });
  });
}
