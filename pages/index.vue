<template>
	<div>
		<h1>Sticker Cloud Downloader</h1>
		<br />
		<p>download sticker packs from sticker cloud~</p>
		<form @submit.prevent="submit">
			<v-text-field
				v-model="sticker_cloud_URL"
				label="paste Sticker Cloud URL here"
			></v-text-field>
			<v-btn class="mr-4" type="submit"> Download </v-btn>
		</form>
		<br />
		<p>
			then upload on signal~
			<a
				target="_blank"
				href="https://support.signal.org/hc/en-us/articles/360031836512-Stickers"
				>tutorial</a
			>
		</p>
		<iframe
			:src="sticker_cloud_URL"
			frameborder="0"
			scrolling="no"
			sandbox="allow-same-origin allow-scripts"
			width="100%"
			height="600px"
			id="iframe"
		></iframe>
	</div>
</template>

<script>
const imageConversion = require("image-conversion");
import JsZip from "jszip";
import FileSaver from "file-saver";
const zip = JsZip();

export default {
	data: () => ({
		sticker_cloud_URL: "https://stickers.cloud/pack/pepe",
	}),
	mounted: () => {},
	methods: {
		async submit() {
			var imgs = [];
			const name = this.sticker_cloud_URL.split("pack/").pop();
			const sc = await this.$axios.get(`/sc/${name}`);
			var webp = sc.data.result.stickers.map((s) => s.sticker_src);
			webp.forEach((img) => {
				imgs.push(
					imageConversion.urltoBlob(
						`/${img.split("://").pop().split(".")[0]}/${img
							.split("packs/")
							.pop()}`
					)
				);
			});
			Promise.all(imgs).then((blobs) => {
				blobs.forEach((blob, i) => {
					zip.file(`${i}.png`, blob);
				});
				zip.generateAsync({ type: "blob" }).then((zipFile) => {
					const fileName = `${name}.zip`;
					return FileSaver.saveAs(zipFile, fileName);
				});
			});
		},
	},
};
</script>

<style lang="scss" scoped>
	iframe {
		pointer-events: none;
	}
</style>