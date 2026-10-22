import { copyFileSync, existsSync } from "node:fs";

if (existsSync(".env.local")) {
  console.log(".env.local já existe. Não mexi nele.");
} else {
  copyFileSync(".env.example", ".env.local");
  console.log("Criei .env.local a partir de .env.example.");
  console.log("Esses valores são só para o computador local. Troque antes de publicar.");
}
