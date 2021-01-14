<template>
	<div>
		<h1 style="font-size:'50px'">Sticker Cloud Downloader</h1>
		<br />
		<p>Download sticker packs from sticker cloud~</p>
		<ol>
			<li>
				Go to
				<a target="_blank" href="https://stickers.cloud"
					>Stickers Cloud</a
				>
			</li>
			<li>Choose a Sticker Pack</li>
			<li>Copy the URL and paste it on below</li>
		</ol>
		<br />
		<small>May not support IOS Chrome for now.</small>
		<br />
		<br />
		<v-text-field
			v-model="sticker_cloud_URL"
			label="paste Sticker Cloud URL here"
			:loading="loading"
			:error-messages="error"
		></v-text-field>
		<v-btn class="mr-4" @click="download" :disabled="loading" large>
			Download
		</v-btn>
		<br/>
		<br/>
		<p>
			Then upload on signal~ Let's use signal
			<a
				target="_blank"
				href="https://support.signal.org/hc/en-us/articles/360031836512-Stickers"
				>tutorial</a
			>
		</p>
		<iframe
			class="mt-3 mb-5"
			:src="sticker_cloud_URL"
			frameborder="0"
			scrolling="no"
			sandbox="allow-same-origin allow-scripts"
			width="100%"
			height="600px"
			id="iframe"
		></iframe>

		<div class="card container mb-5">
			<center>
				<h1>Report Bugs</h1>
			</center>
			<br>
			<form name="contact" class="pb-4 pl-4 pr-4" netlify>
				<v-text-field
					dark
					outlined
					name="title"
					label="Title"
					value=""
				></v-text-field>
				<v-textarea
					dark
					outlined
					name="content"
					value=""
					label="Content"
				></v-textarea>
				<v-btn outlined dark style="float: right" type="submit"
					large >Send</v-btn
				>
				<br />
			</form>
		</div>

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
		error: [],
		loading: false,
	}),
	mounted: () => {
		// console.log(this.ga);
	},
	methods: {
		async download() {
			
			this.loading = true;
			var imgs = [];
			const name = this.sticker_cloud_URL.split("/").pop();

			this.$ga.event({
				eventCategory: 'download',
				eventAction: 'click',
				eventLabel: 'mouseclick',
				eventValue: name,
			})
			
			const sc = await this.$axios.get(`/sc/${name}`);

			if (sc.data.success) {
				var webp = sc.data.result.stickers.map((s) => s.sticker_src);
				webp.forEach((img) => {
					imgs.push(
						imageConversion.urltoBlob(
							`/${
								img.split("://").pop().split(".")[0]
							}/${img.split("packs/").pop()}`
						)
					);
				});
				Promise.all(imgs).then((blobs) => {
					blobs.forEach((blob, i) => {
						zip.file(`${name}${i}.png`, blob);
					});
					zip.generateAsync({ type: "blob" }).then((zipFile) => {
						const fileName = `${name}.zip`;
						return FileSaver.saveAs(zipFile, fileName);
					});
				});
			} else {
				this.error = ["Invalid URL"];
			}

			this.loading = false;
		},
	},
};
</script>

<style lang="scss" scoped>
	iframe {
		pointer-events: none;
	}
	.card {
		padding: 32px 12px;
		border: solid white;
		border-width: 1px;
		border-radius: 8px;
	}
</style>