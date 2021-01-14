<template>
	<div>
		<h1 style="font-size: '50px'">Sticker Cloud Downloader</h1>
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
		<small>*May not support IOS Chrome for now. Plz try Safari or use a Desktop.</small>
		<br />
		<br />
		<v-text-field
			v-model="sticker_cloud_URL"
			label="paste Sticker Cloud URL here"
			:loading="loading"
			:error-messages="error"
		></v-text-field>
		<span>File type:</span>
		<v-radio-group v-if="!loading" v-model="file_type" row style="display:inline">
			<v-radio
				v-for="(n,i) in file_types"
				:key="i"
				:label="n"
				:value="n"
			></v-radio>
		</v-radio-group>
		<v-radio-group v-else row style="display:inline">
			<v-radio
				:label="'loading...'"
				disabled
			></v-radio>
		</v-radio-group>
		<v-btn class="mr-4" @click="download" :disabled="loading" large>
			Download
		</v-btn>
		<br />
		<br />
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

		<!-- <div class="card container mb-5">
			<center>
				<h1>Report Bugs</h1>
			</center>
			<br />
				<Form />
		</div> -->
	</div>
</template>

<script>
const imageConversion = require("image-conversion");
import JsZip from "jszip";
import FileSaver from "file-saver";

export default {
	data: () => ({
		sticker_cloud_URL: "https://stickers.cloud/pack/isabelle",
		awaitingSearch: false,
		error: [],
		file_types:['webp','png'],
		file_type:'webp',
		loading: false,
		webp:[]
	}),
	mounted: function () {
		this.fetch()
	},
	computed:{
		name:function () {
			return this.sticker_cloud_URL.split("/").pop();
		}
	},
	methods: {
		async fetch(){
			this.loading = true
			this.$ga.event({
				eventCategory: "download",
				eventAction: "click",
				eventLabel: "mouseclick",
				eventValue: this.name,
			});
			const sc = await this.$axios.get(`/sc/${this.name}`);
			if(sc.data.result.animated){
				this.file_types = ['webp','gif']
				this.file_type = 'webp'
			} else {
				this.file_types = ['webp','png']
				this.file_type = 'webp'
			}
			if (sc.data.success) {
				this.error = [];
				this.webp = sc.data.result.stickers.map((s) => s.sticker_src);
			} else {
				this.error = ["Invalid URL"];
			}
			this.loading=false
		},
		async download() {
			const zip = JsZip();
			this.loading = true;
			var imgs = [];
			this.$ga.event({
				eventCategory: "download",
				eventAction: "click",
				eventLabel: "mouseclick",
				eventValue: this.name,
			});
			this.webp.forEach((img) => {
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
					zip.file(`${this.name}${i}.${this.file_type}`, blob);
				});
				zip.generateAsync({ type: "blob" }).then((zipFile) => {
					const fileName = `${this.name}.zip`;
					return FileSaver.saveAs(zipFile, fileName);
				});
			});
			this.loading = false;
		},
	},
	watch: {
		sticker_cloud_URL: function (val) {
			this.loading=true
			if (!this.awaitingSearch) {
				setTimeout(() => {
					this.fetch();
				this.awaitingSearch = false;
			}, 1500); // 1.5 sec delay
			}
			this.awaitingSearch = true;

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