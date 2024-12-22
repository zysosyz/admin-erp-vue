import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// 基础配置
const BASE_URL = "/api/amazon-manage/";
const TIMEOUT = 6000;

// 创建axios实例
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT
});

// 请求拦截器
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // const token = localStorage.getItem("token");
  // if (token) {
  //   config.headers["Authorization"] = token;
  // }
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use((response: AxiosResponse) => {
  return response.data;
}, error => {
  return Promise.reject(error);
});

// 请求方法类型
type RequestMethod = 'get' | 'post' | 'put' | 'delete';

// HTTP请求函数
function http(
  url: string, 
  method: RequestMethod = 'get',
  data?: any,
  contentType: string = 'application/json'
) {
  const config: AxiosRequestConfig = {
    url,
    method,
    headers: {
      'Content-Type': contentType
    }
  };

  if (method.toLowerCase() === 'get') {
    config.params = data;
  } else {
    config.data = data;
  }

  return instance(config);
}

export default http;