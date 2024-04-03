import {createRouter, createWebHistory} from 'vue-router'
import {loadingBar, notification} from "@/main";

const routes = [
    {
      path: '/',
      name: 'index',
      redirect: '/home',
      meta: {
        title: '首页'
      },
      component: () => import('@/views/Index.vue'),
      children: [
          {
              path: 'home',
              name: 'home',
              component: () => import('@/views/Home'),
              meta: {
                  title: '首页'
              }
          },
          {
              path: 'article-control',
              name: 'article-control',
              redirect: '/article-control/article-list',
              meta: {
                  title: '文章管理'
              },
              children: [
                  {
                      path: 'article-list',
                      name: 'article-list',
                      component: () => import('../views/article-control/ArticleList'),
                      meta: {
                          title: '文章列表'
                      }
                  },
                  {
                      path: 'article-add',
                      name: 'article-add',
                      component: () => import('../views/article-control/AddOrEdit'),
                      meta: {
                          title: '发布文章'
                      },
                  },
                  {
                      path: 'article-edit/:id',
                      name: 'article-edit',
                      component: () => import('../views/article-control/AddOrEdit'),
                      meta: {
                          title: '编辑文章'
                      }
                  },
                  {
                      path: 'tag-control',
                      name: 'tag-control',
                      component: () => import('../views/tag-control/TagList'),
                      meta: {
                          title: '标签管理'
                      }
                  },
                  {
                      path: 'category-control',
                      name: 'category-control',
                      component: () => import('../views/category-control/CategoryList'),
                      meta: {
                          title: '分类管理'
                      }
                  },
              ]
          },
          {
              path: 'photo-control',
              name: 'photo-control',
              redirect: '/photo-control/photo-list',
              meta: {
                  title: '图片管理'
              },
              children: [
                  {
                      path: 'photo-list',
                      name: 'photo-list',
                      component: () => import('../views/photo-control/PhotoList'),
                      meta: {
                          title: '图片列表'
                      }
                  },
              ]
          },
          {
              path: 'permission-control',
              name: 'permission-control',
              redirect: '/permission-control/role-list',
              meta: {
                  title: '权限管理'
              },
              children: [
                  {
                      path: 'role-list',
                      name: 'role-list',
                      component: () => import('../views/permission-control/RoleList'),
                      meta: {
                          title: '角色管理'
                      }
                  },
                  {
                      path: 'api-list',
                      name: 'api-list',
                      component: () => import('../views/permission-control/ApiList'),
                      meta: {
                          title: '接口管理'
                      }
                  },
              ]
          },
          {
              path: 'user-control',
              name: 'user-control',
              redirect: '/user-control/user-list',
              meta: {
                  title: '用户管理'
              },
              children: [
                  {
                      path: 'user-list',
                      name: 'user-list',
                      component: () => import('../views/user-control/UserList'),
                      meta: {
                          title: '用户列表'
                      }
                  },
              ]
          },
      ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/Register'),
        meta: {
            title: '注册'
        }
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    loadingBar.start()
    if (to.path !== '/login' && to.path !== '/register') {
        let token = localStorage.getItem('token')
        if (token !== null && token !== undefined && token !== '') {
        } else {
            notification.error({title: '通知', content: '请登录', duration: 5000})
            router.push('/login?to=' + to.path)
        }
    }
    next()
})

router.afterEach((to, from) => {
    // 后置守卫一般用来 优化用户的体验 例如切换路由时更改页面的title
    document.querySelector('title').innerText = to.meta.title + ' - 管理后台'
    loadingBar.finish()
})

export default router
