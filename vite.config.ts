import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		chunkSizeWarningLimit: 1000
	},
	resolve: {
		alias: {
			"@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
			"@views": fileURLToPath(new URL("./src/components/views", import.meta.url)),
			"@icons": fileURLToPath(new URL("./src/components/icons", import.meta.url)),
			"@pages": fileURLToPath(new URL("./src/components/pages", import.meta.url)),
			"@composables": fileURLToPath(new URL("./src/composables", import.meta.url)),
			"@models": fileURLToPath(new URL("./src/models", import.meta.url)),
			"@stores": fileURLToPath(new URL("./src/stores", import.meta.url)),
			"@router": fileURLToPath(new URL("./src/router", import.meta.url))
		}
	}
});
