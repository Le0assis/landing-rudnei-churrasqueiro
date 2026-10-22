import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { createInterface } from "node:readline";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

async function readPassword() {
  if (!process.stdin.isTTY) {
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    let text = Buffer.concat(chunks).toString("utf8");
    if (text.endsWith("\n")) text = text.slice(0, -1);
    if (text.endsWith("\r")) text = text.slice(0, -1);
    return text;
  }

  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    return await new Promise((resolve) => {
      readline.question("Senha do admin: ", resolve);
    });
  } finally {
    readline.close();
  }
}

const password = await readPassword();

if (password.length < 10) {
  console.error("A senha precisa ter pelo menos 10 caracteres.");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = await scrypt(password, salt, 64);

process.stdout.write(`scrypt:${salt.toString("hex")}:${hash.toString("hex")}\n`);
