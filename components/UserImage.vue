<template>
  <img :src="src" class="user-image"
       v-bind="{srcset: src.startsWith('https://image.cullet.me/') ? `${src}_640w 640w` : ''}"/>
</template>

<script>
  export default {
    name: 'user-image',
    props: ['src']
  }
</script>
