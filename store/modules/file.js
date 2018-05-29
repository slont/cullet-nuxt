export const state = () => ({
  endpoint: '/files'
})

export const actions = {
  async create({state}, params = {file: '', fileName: '', themeId: ''}) {
    const formData = new FormData()
    formData.append('file', params.file, params.fileName)
    if (params.themeId) {
      formData.append('themeId', params.themeId)
    }
    return this.$axios({
      method: 'POST',
      body: formData,
      config: {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    })
  }
}
