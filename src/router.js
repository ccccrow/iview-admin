import Main from './views/Main.vue';

export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => {
        require(['./views/login.vue'], resolve);
    }
};

export const page404 = {
    path: '/*',
    name: 'error_404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => {
        require(['./views/error_page/404.vue'], resolve);
    }
};

export const page401 = {
    path: '/401',
    meta: {
        title: '401-权限不足'
    },
    name: 'error_401',
    component: resolve => {
        require(['./views/error_page/401.vue'], resolve);
    }
};
export const editRouter = [{
    path: '/sysedit',
    icon: 'key',
    name: 'sysedit',
    title: '系统管理',
    component: Main,
    children: [{
            path: 'user/:id',
            title: '编辑用户',
            name: 'sysedit_user',
            component: resolve => {
                require(['./views/sys/useredit.vue'], resolve);
            }
        }, {
            path: 'resource/:id/:parentid',
            title: '编辑资源',
            name: 'sysedit_resource',
            component: resolve => {
                require(['./views/sys/resourceedit.vue'], resolve);
            }
        }, {
            path: 'role/:id',
            title: '编辑角色',
            name: 'sysedit_role',
            component: resolve => {
                require(['./views/sys/roleedit.vue'], resolve);
            }
        }, {
            path: 'org/:id',
            title: '编辑机构',
            name: 'sysedit_org',
            component: resolve => {
                require(['./views/sys/orgedit.vue'], resolve);
            }
        }, {
            path: 'dict/:id',
            title: '编辑字典',
            name: 'sysedit_dict',
            component: resolve => {
                require(['./views/sys/dictedit.vue'], resolve);
            }
        },
        {
            path: 'role/resource/:id',
            title: '配置资源',
            name: 'sysresource_role',
            component: resolve => {
                require(['./views/sys/configresource.vue'], resolve);
            }
        }, {
            path: 'role/user/:id',
            title: '配置用户',
            name: 'sysuser_role',
            component: resolve => {
                require(['./views/sys/configuser.vue'], resolve);
            }
        }
    ]
}, {
    path: '/ivcedit',
    icon: 'key',
    name: 'ivcedit',
    title: '管理',
    component: Main,
    children: [{
            path: 'goodstype/:id',
            title: '编辑分类',
            name: 'ivcedit_goodstype',
            component: resolve => {
                require(['./views/ivc/goods/goodstypeedit.vue'], resolve);
            }
        }, {
            path: 'brand/:id',
            title: '编辑品牌',
            name: 'ivcedit_brand',
            component: resolve => {
                require(['./views/ivc/goods/brandedit.vue'], resolve);
            }
        }, {
            path: 'spec/:id',
            title: '编辑',
            name: 'ivcedit_spec',
            component: resolve => {
                require(['./views/ivc/goods/specedit.vue'], resolve);
            }
        },
        {
            path: 'spec/type/:specid',
            title: '规格管理',
            name: 'ivcspec_type',
            component: resolve => {
                require(['./views/ivc/goods/spectype.vue'], resolve);
            }
        }, {
            path: 'spectype/:id/:specid',
            title: '编辑',
            name: 'ivcedit_spectype',
            component: resolve => {
                require(['./views/ivc/goods/spectypeedit.vue'], resolve);
            }
        }, {
            path: 'store/:id',
            title: '编辑',
            name: 'ivcedit_store',
            component: resolve => {
                require(['./views/ivc/goods/storeedit.vue'], resolve);
            }
        }, {
            path: 'supplier/:id',
            title: '编辑',
            name: 'ivcedit_supplier',
            component: resolve => {
                require(['./views/ivc/goods/supplieredit.vue'], resolve);
            }
        }, {
            path: 'member/:id',
            title: '编辑',
            name: 'ivcedit_member',
            component: resolve => {
                require(['./views/ivc/goods/memberedit.vue'], resolve);
            }
        }, {
            path: 'goods/:id',
            title: '编辑',
            name: 'ivcedit_goods',
            component: resolve => {
                require(['./views/ivc/goods/goodsedit.vue'], resolve);
            }
        }, {
            path: 'purchase/:id',
            title: '编辑',
            name: 'ivcedit_purchase',
            component: resolve => {
                require(['./views/ivc/purchase/purchaseedit.vue'], resolve);
            }
        }
    ]
}]
export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error_500',
    component: resolve => {
        require(['./views/error_page/500.vue'], resolve);
    }
};

export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [{
            path: 'home',
            title: '首页',
            name: 'home_index',
            component: resolve => {
                require(['./views/home/home.vue'], resolve);
            }
        },
        {
            path: 'ownspace',
            title: '个人中心',
            name: 'ownspace_index',
            component: resolve => {
                require(['./views/own-space/own-space.vue'], resolve);
            }
        },
        {
            path: 'message',
            title: '消息中心',
            name: 'message_index',
            component: resolve => {
                require(['./views/message/message.vue'], resolve);
            }
        }
    ]
};


export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => {
        require(['./views/main_components/locking-page.vue'], resolve);
    }
};

export const appRouter = [{
    path: '/sys',
    icon: 'cube',
    name: 'sys',
    title: '系统管理',
    component: Main,
    children: [{
            path: 'user',
            title: '用户管理',
            name: 'sys_user',
            component: resolve => {
                require(['./views/sys/user.vue'], resolve);
            },
            meta: {
                keepAlive: true // 需要被缓存
            }
        },
        {
            path: 'resource',
            title: '资源管理',
            name: 'sys_resource',
            component: resolve => {
                require(['./views/sys/resource.vue'], resolve);
            },
            meta: {
                keepAlive: true // 需要被缓存
            }
        },
        {
            path: 'role',
            title: '角色管理',
            name: 'sys_role',
            component: resolve => {
                require(['./views/sys/role.vue'], resolve);
            },
            meta: {
                keepAlive: true // 需要被缓存
            }
        },
        {
            path: 'org',
            title: '机构管理',
            name: 'sys_org',
            component: resolve => {
                require(['./views/sys/org.vue'], resolve);
            },
            meta: {
                keepAlive: true // 需要被缓存
            }
        }, {
            path: 'dict',
            title: '字典管理',
            name: 'sys_dict',
            component: resolve => {
                require(['./views/sys/dict.vue'], resolve);
            },
            meta: {
                keepAlive: true // 需要被缓存
            }
        }
    ]
}, {
    path: '/ivc',
    icon: 'cube',
    name: 'goods',
    title: '管理',
    component: Main,
    children: [{
            path: 'goods',
            title: '商品管理',
            name: 'ivc_goods',
            component: resolve => {
                require(['./views/ivc/goods/goods.vue'], resolve);
            },
            meta: {
                keepAlive: true // 需要被缓存
            },

        }, {
            path: 'goodstype',
            title: '分类管理',
            name: 'ivc_goodstype',
            component: resolve => {
                require(['./views/ivc/goods/goodstype.vue'], resolve);
            },
            meta: {
                keepAlive: true // 需要被缓存
            }
        }, {
            path: 'brand',
            title: '品牌管理',
            name: 'ivc_brand',
            component: resolve => {
                require(['./views/ivc/goods/brand.vue'], resolve);
            },
            meta: {
                keepAlive: true // 需要被缓存
            }
        }, {
            path: 'spec',
            title: '规格管理',
            name: 'ivc_spec',
            component: resolve => {
                require(['./views/ivc/goods/spec.vue'], resolve);
            },
            meta: {
                keepAlive: true // 需要被缓存
            }
        },
        {
            path: 'store',
            title: '门店管理',
            name: 'ivc_store',
            component: resolve => {
                require(['./views/ivc/goods/store.vue'], resolve);
            },
            meta: {
                keepAlive: true // 需要被缓存
            }
        },
        {
            path: 'supplier',
            title: '供应商管理',
            name: 'ivc_supplier',
            component: resolve => {
                require(['./views/ivc/goods/supplier.vue'], resolve);
            },
            meta: {
                keepAlive: true // 需要被缓存
            }
        },
        {
            path: 'member',
            title: '会员管理',
            name: 'ivc_member',
            component: resolve => {
                require(['./views/ivc/goods/member.vue'], resolve);
            },
            meta: {
                keepAlive: true // 需要被缓存
            }
        }
    ]
},{
    path: '/ivc/purchase',
    icon: 'cube',
    name: 'purchase',
    title: '进货单管理',
    component: Main,
    children: [{
        path: 'purchase',
        title: '进货单管理',
        name: 'ivc_purchase',
        component: resolve => {
            require(['./views/ivc/purchase/purchase.vue'], resolve);
        },
        meta: {
            keepAlive: true // 需要被缓存
        },

    }]
}];

export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    ...editRouter,
    page500,
    page401,
    page404
];