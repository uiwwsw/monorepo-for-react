// vite.config.ts
import { defineConfig } from "file:///C:/Users/2101A00080/ymtc/monorepo/node_modules/.pnpm/vite@4.4.5_@types+node@20.5.9_less@4.2.0/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/2101A00080/ymtc/monorepo/node_modules/.pnpm/@vitejs+plugin-react-swc@3.3.2_vite@4.4.5/node_modules/@vitejs/plugin-react-swc/index.mjs";
import dts from "file:///C:/Users/2101A00080/ymtc/monorepo/node_modules/.pnpm/vite-plugin-dts@3.5.3_@types+node@20.5.9_typescript@5.0.2_vite@4.4.5/node_modules/vite-plugin-dts/dist/index.mjs";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "file:///C:/Users/2101A00080/ymtc/monorepo/node_modules/.pnpm/tailwindcss@3.3.3_ts-node@10.9.1/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///C:/Users/2101A00080/ymtc/monorepo/node_modules/.pnpm/autoprefixer@10.4.15_postcss@8.4.29/node_modules/autoprefixer/lib/autoprefixer.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/2101A00080/ymtc/monorepo/libraries/frontend/ui/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [react(), dts()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src/components", __vite_injected_original_import_meta_url)),
      "#": fileURLToPath(new URL("./src/utils", __vite_injected_original_import_meta_url)),
      $: fileURLToPath(new URL("./src/styles", __vite_injected_original_import_meta_url))
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  },
  build: {
    lib: {
      entry: "src/index.ts",
      name: "@library-frontend/ui",
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwyMTAxQTAwMDgwXFxcXHltdGNcXFxcbW9ub3JlcG9cXFxcbGlicmFyaWVzXFxcXGZyb250ZW5kXFxcXHVpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwyMTAxQTAwMDgwXFxcXHltdGNcXFxcbW9ub3JlcG9cXFxcbGlicmFyaWVzXFxcXGZyb250ZW5kXFxcXHVpXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy8yMTAxQTAwMDgwL3ltdGMvbW9ub3JlcG8vbGlicmFyaWVzL2Zyb250ZW5kL3VpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnO1xyXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJztcclxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJztcclxuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInO1xyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBkdHMoKV0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL2NvbXBvbmVudHMnLCBpbXBvcnQubWV0YS51cmwpKSxcclxuICAgICAgJyMnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL3V0aWxzJywgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICAgICQ6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvc3R5bGVzJywgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY3NzOiB7XHJcbiAgICBwb3N0Y3NzOiB7XHJcbiAgICAgIHBsdWdpbnM6IFt0YWlsd2luZGNzcywgYXV0b3ByZWZpeGVyXSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgbGliOiB7XHJcbiAgICAgIGVudHJ5OiAnc3JjL2luZGV4LnRzJyxcclxuICAgICAgbmFtZTogJ0BsaWJyYXJ5LWZyb250ZW5kL3VpJyxcclxuICAgICAgZmlsZU5hbWU6IChmb3JtYXQpID0+IGBpbmRleC4ke2Zvcm1hdH0uanNgLFxyXG4gICAgfSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgZXh0ZXJuYWw6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgIHJlYWN0OiAnUmVhY3QnLFxyXG4gICAgICAgICAgJ3JlYWN0LWRvbSc6ICdSZWFjdERPTScsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVcsU0FBUyxvQkFBb0I7QUFDcFksT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWUsV0FBVztBQUNuQyxPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGtCQUFrQjtBQUw0TSxJQUFNLDJDQUEyQztBQU90UixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUFBLEVBQ3hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksb0JBQW9CLHdDQUFlLENBQUM7QUFBQSxNQUMvRCxLQUFLLGNBQWMsSUFBSSxJQUFJLGVBQWUsd0NBQWUsQ0FBQztBQUFBLE1BQzFELEdBQUcsY0FBYyxJQUFJLElBQUksZ0JBQWdCLHdDQUFlLENBQUM7QUFBQSxJQUMzRDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLFNBQVMsQ0FBQyxhQUFhLFlBQVk7QUFBQSxJQUNyQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLFVBQVUsQ0FBQyxXQUFXLFNBQVMsTUFBTTtBQUFBLElBQ3ZDO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsU0FBUyxXQUFXO0FBQUEsTUFDL0IsUUFBUTtBQUFBLFFBQ04sU0FBUztBQUFBLFVBQ1AsT0FBTztBQUFBLFVBQ1AsYUFBYTtBQUFBLFFBQ2Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
