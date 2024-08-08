import CreationPage from '@/components/CreationPage.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import LandingPage from '@/views/LandingPage.vue'
import ReviewsView from '@/views/ReviewsView.vue'
import SigninView from '@/views/SigninView.vue'
import SignupView from '@/views/SignupView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: "/", name: "landing-page", component: LandingPage },
  { path: "/signin", name: "login", component: SigninView },
  { path: "/signup", name: "register", component: SignupView },
  { path: "/reviews", name: "reviews", component: ReviewsView, meta: { requiresAuth: true } },
  { path: "/dashboard", name: "dashboard", component: DashboardPage, meta: { requiresAuth: true } },
  { path: "/writeReview", name: "review-creation", component: CreationPage, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});


router.beforeEach((to, from, next) => {
  const isValid = localStorage.getItem("token");

  if (to.matched.some(record => record.meta.requiresAuth) && !isValid) {
    next('/signin');
  } else {
    next();
  }
});


export default router
