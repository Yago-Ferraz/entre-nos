
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

export const getProdutos = async () => {
  const response = await API_AUTH.get("/produtos/");
  return response.data;
};

export const patchProduto = async (id: number, produto: any) => {
  const formData = new FormData();

  Object.entries(produto).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });

  // Se for imagem, trata separadamente
  if (produto.imagem && typeof produto.imagem === "string") {
    const uriParts = produto.imagem.split("/");
    const fileName = uriParts.pop() || "photo.jpg";
    let fileType = fileName.split(".").pop();

    if (!["jpg", "jpeg", "png"].includes(fileType?.toLowerCase() || "")) {
      fileType = "jpeg";
    }

    formData.append("imagem", {
      uri: produto.imagem,
      name: fileName,
      type: `image/${fileType}`,
    } as any);
  }

  const response = await API_AUTH.patch(`/produtos/${id}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};


export const deleteProduto = async (id: number) => {
  const response = await API_AUTH.delete(`/produtos/${id}/`);
  return response.data;
};