<template>
  <div class="cl-buttons buttons has-addons">
    <text-button @add="addElement"/>
    <image-button @add="addElement"/>
    <twitter-button @add="addElement"/>
    <instagram-button @add="addElement"/>
    <datetime-button @add="addElement"/>
    <link-button @add="addElement"/>
    <rating-button @add="addElement"/>
    <tag-button @add="addElement"/>
  </div>
</template>

<script>
  import ElementButton from './ElementButton'
  import TextButton from './TextButton'
  import ImageButton from './ImageButton'
  import LocationButton from './LocationButton'
  import TwitterButton from './TwitterButton'
  import InstagramButton from './InstagramButton'
  import DatetimeButton from './DatetimeButton'
  import TagButton from './TagButton'
  import LinkButton from './LinkButton'
  import PhoneButton from './PhoneButton'
  import EmailButton from './EmailButton'
  import RatingButton from './RatingButton'
  import SwitchButton from './SwitchButton'

  export default {
    components: {
      ElementButton,
      TextButton,
      ImageButton,
      LocationButton,
      TwitterButton,
      InstagramButton,
      DatetimeButton,
      TagButton,
      LinkButton,
      PhoneButton,
      EmailButton,
      RatingButton,
      SwitchButton
    },
    methods: {
      addElement(element) {
        this.$emit('add', element)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .cl-buttons {
    flex-direction: column;
    width: $element-button-size;

    .button:not(:last-child) {
      margin-right: 0;
      margin-bottom: -1px;
    }
    .subtitle {
      margin-bottom: .5em;
      color: grey;
    }
    .buttons-label:not(:first-child) {
      margin-top: 1.5em;
    }
  }
</style>
