import Radio from "./component/index.vue";

Radio.install = function(Vue) {
  Vue.component(Radio.name, Radio);
};

export default Radio;
