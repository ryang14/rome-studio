import "bootstrap/dist/css/bootstrap.css";
import BootstrapVue from "bootstrap-vue";
import Vue from "vue";
import App from "./App.vue";

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
