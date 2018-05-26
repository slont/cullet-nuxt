<template>
  <div class="element-view">
    <text-element :params="element" v-if="'text' === element.type"/>
    <image-element :params="element" v-else-if="'image' === element.type"/>
    <location-element :params="element" v-else-if="'location' === element.type"/>
    <twitter-element :params="element" v-else-if="'twitter' === element.type"/>
    <instagram-element :params="element" v-else-if="'instagram' === element.type"/>
    <datetime-element :params="element" v-else-if="'date' === element.type"/>
    <datetime-element :params="element" v-else-if="'time' === element.type"/>
    <datetime-element :params="element" v-else-if="'datetime' === element.type"/>
    <tag-element :params="element" v-else-if="'tag' === element.type"/>
    <link-element :params="element" v-else-if="'link' === element.type"/>
    <phone-element :params="element" v-else-if="'phone' === element.type"/>
    <email-element :params="element" v-else-if="'email' === element.type"/>
    <rating-element :params="element" v-else-if="'rating' === element.type"/>
    <switch-element :params="element" v-else-if="'switch' === element.type"/>
  </div>
</template>

<script>
  import TextElement from '@/components/element/TextElement'
  import ImageElement from '@/components/element/ImageElement'
  import LocationElement from '@/components/element/LocationElement'
  import TwitterElement from '@/components/element/TwitterElement'
  import InstagramElement from '@/components/element/InstagramElement'
  import DatetimeElement from '@/components/element/DatetimeElement'
  import TagElement from '@/components/element/TagElement'
  import LinkElement from '@/components/element/LinkElement'
  import PhoneElement from '@/components/element/PhoneElement'
  import EmailElement from '@/components/element/EmailElement'
  import RatingElement from '@/components/element/RatingElement'
  import SwitchElement from '@/components/element/SwitchElement'

  export default {
    components: {
      TextElement,
      ImageElement,
      LocationElement,
      TwitterElement,
      InstagramElement,
      DatetimeElement,
      TagElement,
      LinkElement,
      PhoneElement,
      EmailElement,
      RatingElement,
      SwitchElement
    },
    props: {
      element: {
        type: Object,
        default: () => ({
          type: '',
          label: '',
          valueStr: '',
          valueNum: 0,
          valueDbl: 0.0
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .element-view {
  }
</style>
