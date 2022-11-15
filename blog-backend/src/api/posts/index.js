import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const posts = new Router();

posts.get('/', postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write);

const post = new Router(); // /api/posts/:id
post.get('/', postsCtrl.read);
post.delete('/', postsCtrl.checkOwnPost, postsCtrl.remove);
post.patch('/', postsCtrl.checkOwnPost, postsCtrl.update);

posts.use('/:id', postsCtrl.getPostId, post.routes());

export default posts;

