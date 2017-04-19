# svg-vue-r

A lightweight SVG graph editor built with Vue.js

# Running the example

    npm run dev

# Integrating it to your application

Make sure that you have the proper asset plugin to load `.vue` files. For instance, [vue-loader](https://www.npmjs.com/package/vue-loader) if you are using webpack. Other loaders exist if you are using other methods.

Then, simply copy the `.vue` files in `src` to your application's asset directory. Then put something like this in your javascript initialisation code:

    import Vue from 'vue';
    import SvgVueR from './SvgVueR.vue';

    new Vue({
      el: '#app',
      components: { SvgVueR }
    });

You can then write, in your application's template files:

    <div id="app">
        <svg-vue-r></svg-vue-r>
    </div>

# Running the unit tests

    npm test

# Features that are coming up

  * Editing items
  * Adding more shapes & text
