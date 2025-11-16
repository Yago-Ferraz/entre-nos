
import { API_AUTH } from "./api";
import { ProdutoPayload } from "../types/produto";

export const createProduto = async (produto: ProdutoPayload | FormData, isMultipart = false) => {
  let data: any;
  let headers: any = {};

  if (isMultipart) {
    data = produto; // já é FormData
    headers["Content-Type"] = "multipart/form-data";
  } else {
    data = produto;
    headers["Content-Type"] = "application/json";
  }

  const response = await API_AUTH.post("/produtos/", data, { headers });
  return response.data;
};

export const getProdutosAnalytics = async () => {
  const response = await API_AUTH.get("/produtos/analytics/");
  return response.data;
};
