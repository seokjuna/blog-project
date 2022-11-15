import Router from 'koa-router';
import posts  from './posts';
import auths from './auth/index';

const api = new Router();

api.use('/posts', posts.routes());
api.use('/auth', auths.routes());

// 라우터를 내보냄
export default api;