import Axios from "axios";

export const api = process.env.REACT_APP_RECORDS_API_URL || "https://5bf7c3745cd31800137928d8.mockapi.io"

export const getAll = () => 
  Axios.get(`${api}/records`)

export const create = (body) =>
  Axios.post(`${api}/records`, body)

export const update = (id, body) =>
  Axios.put(`${api}/records/${id}`, body)

export const remove = (id) =>
  Axios.delete(`${api}/records/${id}`)
