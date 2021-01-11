<template>
<div>
	<form @submit.prevent="submit">
		<v-text-field
			v-model="sticker_cloud_URL"
			label="Sticker Cloud URL"
		></v-text-field>

		<v-btn class="mr-4" type="submit"> submit </v-btn>
	</form>

  <iframe :src="sticker_cloud_URL" width="100%" height="600px" id="iframe"></iframe>

</div>
</template>

<script>
const imageConversion = require("image-conversion")
import JsZip from 'jszip';
import FileSaver from 'file-saver';
const zip = JsZip();

export default {
	data: () => ({
		sticker_cloud_URL: "https://stickers.cloud/pack/doraemon-7",
	}),
  mounted:()=>{
    $('#iframe').on('load', function(res){
    console.log(res);
  });
  },
	methods: {
		async submit() {
      var imgs = []
      const name = this.sticker_cloud_URL.split('pack/').pop()
			const sc = await this.$axios.get(`sc/${name}`);
      var webp = sc.data.result.stickers.map(s=>s.sticker_src.split('packs/').pop())
      webp.forEach((img) => {
        imgs.push(imageConversion.urltoBlob(`img/${img}`))
      });
      Promise.all(imgs).then(blobs=>{
        blobs.forEach((blob, i) => {
          zip.file(`${i}.png`, blob);
        });
        zip.generateAsync({type: 'blob'}).then(zipFile => {
          const fileName = `${name}.zip`;
          return FileSaver.saveAs(zipFile, fileName);
        });
      })
		},
	},
};
</script>

<style lang="scss" scoped>
</style>