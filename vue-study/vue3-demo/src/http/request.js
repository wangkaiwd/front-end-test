import axios from 'axios';
import { isEmptyObject } from '@/shared/util';
import store from '@/store/index';

/**
 * Axios请求，实现功能如下：
 *  1. 支持axios的所有原有功能
 *  2. 内部设置请求和响应拦截
 *  3. 为请求添加全局loading
 *  4. 当页面切换时取消所有之前页面还在进行的请求(cancel request: xhr.abort())
 *
 * 思路：每次请求开始之前将
 */
class Http {
  constructor (config = {}) {
    this.config = {
      timeout: 30000,
      baseURL: 'https://5fc755fcf3c77600165d8245.mockapi.io/',
      ...config
    };
    this.source = undefined;
  }

  _setInterceptor (url) {
    this.reqInterceptor(url);
    this.resInterceptor(url);
  }

  _removeGlobalLoading () {
    if (isEmptyObject(store.state.reqs)) {
      store.commit('setLoading', false);
    }
  }

  reqInterceptor (url) {
    const { reqs } = store.state;
    this.instance.interceptors.request.use(
      (config) => {
        if (isEmptyObject(store.state.reqs)) {
          store.commit('setLoading', true);
        }
        store.commit('setReqs', { ...reqs, [url]: this.source });
        return config;
      },
      (err) => {
        this._removeGlobalLoading();
        return Promise.reject(err);
      }
    );
  }

  resInterceptor (url) {
    this.instance.interceptors.response.use(
      (response) => {
        store.commit('deleteReqs', url);
        this._removeGlobalLoading();
        return response.data;
      },
      (err) => {
        this._removeGlobalLoading();
        return Promise.reject(err);
      }
    );
  }

  request (config) { // 每个请求都是一个axios实例，并且为该实例添加拦截器。这样能做到为每个请求都添加拦截器的功能
    this.instance = axios.create(this.config);
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    config.cancelToken = this.source.token;
    this._setInterceptor(config.url);
    return this.instance.request(config);
  }

  get (url, config = {}) {
    if (!url) {url = '';}
    return this.request({
      url,
      method: 'get',
      ...config
    });
  }

  post (url, config) {
    return this.request({
      url,
      method: 'post',
      ...config
    });
  }
}

const http = new Http();
export default http;
