import { ReqObj, OptionType } from '../core/types';

declare global {
  interface Window {
    __PRE_FETCH_OPTIONS__: OptionType[];
    __PRE_FETCH_RESULTS__: Record<string, Promise<any>>;
    __PRE_FETCH_COMPLETED__: Record<string, boolean>;
  }
}

function shouldFetch(option: OptionType): boolean {
  const { pathList, hashList } = option;
  const currentPath = location.pathname;
  const currentHash = location.hash;

  const pathMatch = pathList.includes('all') || pathList.some(path => currentPath.startsWith(path));
  const hashMatch = hashList.includes('all') || hashList.some(hash => currentHash.startsWith(hash));

  return pathMatch && hashMatch;
}

function getParamValue(params: ReqObj): Record<string, string> {
  const result: Record<string, string> = {};
  
  // 获取当前页面的URL参数
  const urlParams = new URLSearchParams(window.location.search);
  
  // 合并静态参数（优先级最低）
  Object.entries(params.staticParams || {}).forEach(([key, value]) => {
    result[key] = String(value);
  });
  
  // 合并cookie参数（优先级中等）
  Object.entries(params.cookieParams || {}).forEach(([key, cookieName]) => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(c => c.startsWith(cookieName + '='));
    if (cookie) {
      result[key] = cookie.split('=')[1];
    }
  });
  
  // 合并URL参数（优先级最高）
  Object.entries(params.queryParams || {}).forEach(([key, paramName]) => {
    const value = urlParams.get(String(paramName));
    if (value !== null) {
      result[key] = value;
    }
  });
  
  return result;
}

function buildUrl(url: string, paramValues: Record<string, string>, method: string): string {
  const urlObj = new URL(url, window.location.origin);
  
  if (method.toUpperCase() === 'GET') {
    Object.entries(paramValues).forEach(([key, value]) => {
      urlObj.searchParams.append(key, value);
    });
  }
  
  return urlObj.toString();
}

async function fetchData(req: ReqObj): Promise<void> {
  const { key, method, url } = req;
  const upperCaseMethod = method.toUpperCase();
  const paramValues = getParamValue(req);
  const fullUrl = buildUrl(url, paramValues, upperCaseMethod);

  let fetchOptions: RequestInit = { method: upperCaseMethod };

  if (upperCaseMethod === 'POST') {
    fetchOptions.headers = {
      'Content-Type': 'application/json'
    };
    fetchOptions.body = JSON.stringify(paramValues);
  }

  try {
    const response = await fetch(fullUrl, fetchOptions);
    const data = await response.json();
    window.__PRE_FETCH_COMPLETED__[key] = true;
    return data;
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    window.__PRE_FETCH_COMPLETED__[key] = true;
    throw error;
  }
}

function main(): void {
  const options = window.__PRE_FETCH_OPTIONS__;
  window.__PRE_FETCH_RESULTS__ = {};
  window.__PRE_FETCH_COMPLETED__ = {};

  options.forEach(option => {
    if (shouldFetch(option)) {
      option.reqs.forEach(req => {
        const { key } = req;
        window.__PRE_FETCH_RESULTS__[key] = fetchData(req);
        window.__PRE_FETCH_COMPLETED__[key] = false;
      });
    }
  });
}

main();

// 添加一个全局函数来获取预请求的结果
(window as any).getPreFetchResult = async function(key: string): Promise<any> {
  if (key in window.__PRE_FETCH_RESULTS__) {
    if (!window.__PRE_FETCH_COMPLETED__[key]) {
      return await window.__PRE_FETCH_RESULTS__[key];
    } else {
      return window.__PRE_FETCH_RESULTS__[key];
    }
  }
  return null;
};
