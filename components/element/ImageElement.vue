<template>
  <cl-element class="image-element" :params="params" placeholder="ラベル（オプション）"
              @remove="$emit('remove')" :editable="editable"
              @focus="$emit('focus')" @blur="$emit('blur')">
    <span class="element-type-icon icon is-left" v-if="editable">
      <i class="material-icons">photo</i>
    </span>
    <div class="control file" v-if="editable">
      <div class="field image-field">
        <div class="control">
          <div class="file is-boxed">
            <label class="file-label">
              <input @change="changeImage" class="file-input" type="file" name="resume"
                     @focus="$emit('focus')" @blur="$emit('blur')">
              <div class="file-view" v-if="params.valueStr">
                <img :src="params.valueStr" v-if="loading"/>
                <img :src="params.valueStr" :srcset="`${params.valueStr}_640w 640w`" v-else/>
                <a @click.stop.prevent="removeImage" class="delete"></a>
              </div>
              <div class="file-cta" v-else>
                <span class="icon is-size-1"><i class="material-icons">add</i></span>
              </div>
              <div class="control loading-mask is-size-1" :class="{ 'is-loading': loading }"></div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <figure class="image file-view" v-else-if="params.valueStr">
      <img :src="params.valueStr" :srcset="`${params.valueStr}_640w 640w`"/>
    </figure>
  </cl-element>
</template>

<script>
  import FileModel from '@/models/File'
  import ClElement from './ClElement'

  export default {
    components: { ClElement },
    props: {
      params: {
        type: Object,
        default: () => ({
          label: '',
          valueStr: '',
          valueNum: 0,
          valueDbl: 0.0
        })
      },
      editable: Boolean
    },
    computed: {
      loading() {
        return /^data:.+/.test(this.params.valueStr)
      },
      themeId() {
        return this.$route.params.themeId
      }
    },
    methods: {
      changeImage(e) {
        this.createDataUrl(e, (dataUrl, fileName) => {
          this.params.valueStr = dataUrl
          new FileModel().create(this.dataURLtoBlob(dataUrl), fileName, this.themeId).then(res => {
            this.params.valueStr = res.data.path
          })
        })
      },
      removeImage() {
        this.params.valueStr = ''
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .image-element {
    > .control.file {
      justify-content: center;

      .file-view {
        margin-top: 0 !important;
        text-align: center;

        img {
          max-width: 70%;
          margin: 0 auto;
        }
        .delete {
          position: absolute;
          top: 5px;
          right: 5px;
          z-index: 10;
        }
        + .file {
          position: absolute;
          top: 0;
          opacity: .7;
        }
      }
    }
  }
</style>
