<template>
	<div>
		<v-row>
			<v-col cols="12" md="6" lg="7">
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
						:label="`.${n}`"
						:value="n"
						:disabled="!!error.length"
					></v-radio>
				</v-radio-group>
				<v-radio-group v-else row style="display:inline">
					<v-radio
						:label="'loading...'"
						disabled
					></v-radio>
				</v-radio-group>
				
				<v-btn class="mr-4" @click="download" :disabled="loading || !!error.length" large>
					<span v-if="!downloading">	
						Download
					</span>
					<div v-else>
						<div style="margin:14px 0 -20px">{{progress}}%</div>
						<v-text-field
							dense
							color="success"
							loading
							disabled
						></v-text-field>
					</div>
				</v-btn>
			</v-col>
			<v-col>
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
			</v-col>
		</v-row>
		
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
		
		<v-row>
			<v-col cols="12" lg="4">
				<p>1. Download the Stickers into zip file</p>
				<center>
					<video loop autoplay>
						<source src="/1.mov" type="video/mp4">
					</video>
				</center>
			</v-col>
			<v-col cols="12" lg="4">
				<p>2. Open Sticker Pack Creator from Signal Desktop</p>
				<center>
					<video loop autoplay>
						<source src="/2.mov" type="video/mp4">
					</video>
				</center>

			</v-col>
			<v-col cols="12" lg="4">
				<p>3. Unzip, drag and drop the folder into Creator.</p>
				<center>
					<video loop autoplay>
						<source src="/3.mov" type="video/mp4">
					</video>
				</center>
			</v-col>
		</v-row>
		<br>

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
		sticker_cloud_URL: "https://stickers.cloud/pack/pepe",
		awaitingSearch: false,
		error: [],
		file_types:['webp','png'],
		file_type:'webp',
		loading: false,
		webp:[],
		progress:0,
		downloading:false,
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
				eventCategory: "url input",
				eventAction: "fetch",
				eventLabel: "sticker cloud",
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
			this.downloading = true;
			var imgs = [];

			this.$ga.event({
				eventCategory: "download button",
				eventAction: "click",
				eventLabel: "sticker cloud",
				eventValue: this.name,
			});

			var count = 0;
			this.progress = 0;

			this.webp.forEach((img) => {
				imgs.push(
					imageConversion.urltoBlob(
						`/${
							img.split("://").pop().split(".")[0]
						}/${img.split("packs/").pop()}`
					).then(res=>{this.progress = parseInt((count++ / imgs.length)*100);return res})
				);
			});

			Promise.all(imgs).then((blobs) => {
				blobs.forEach((blob, i) => {
					zip.file(`${this.name}${i}.${this.file_type}`, blob);
				});
				zip.generateAsync({ type: "blob" }).then((zipFile) => {
					const fileName = `${this.name}(${this.file_type}).zip`;
					return FileSaver.saveAs(zipFile, fileName);
				});
				this.downloading = false;
			});
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
	video{
		max-width: 400px;
	}
</style>