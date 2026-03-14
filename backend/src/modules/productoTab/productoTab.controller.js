import ProductoTab from "./productoTab.model.js";

export const listarTabs = async (req, res) => {
  const tabs = await ProductoTab.findAll({
    order: [["orden", "ASC"]],
  });

  res.json(tabs);
};
