import App from "./app";
import corsPlugin from "./infrastructure/plugins/cors.plugin";
import Routes from "./infrastructure/routes/index.routes";

const app = new App({
  routes: [Routes],
  plugins: []
});

app.listen();
