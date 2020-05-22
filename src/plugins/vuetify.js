import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: false,
        themes: {
            light: {
              primary: '#455A64',
              accent: '#5D4037',
              secondary: '#78909C',
              success: '#7CB342',
              info: '#64B5F6',
              warning: '#FFB300',
              error: '#F4511E'
            }
        }
      },
});
