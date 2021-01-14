<template>
    <div>
        <form
				name="contact"
				class="pb-4 pl-4 pr-4"
				method="POST"
				data-netlify="true"
				netlify
			>
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
				<v-btn outlined dark style="float: right" type="submit" large
					>Send</v-btn
				>
            <br />
        </form>
    </div>
</template>

<script>
    export default {
    }
</script>

<style scoped>

</style>