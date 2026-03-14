import ProductoTab from "../models/ProductoTab.js";

export const listarTabs = async (req, res) => {
  const tabs = await ProductoTab.findAll({
    order: [["orden", "ASC"]],
  });

  res.json(tabs);
};
