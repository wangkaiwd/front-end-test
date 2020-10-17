import Vue from 'vue';
import VueRouter from '../myRouter/index';
import Home from '../views/Home.vue';
import About from '../views/About';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    children: [
      {
        path: 'a', // 这个路径不能加/
        name: 'A',
        component: {
          render: (h) => <div>this is an about/a</div>
        }
      },
      {
        path: 'b',
        name: 'B',
        component: {
          render: (h) => <div>this is an about/b</div>
        }
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
