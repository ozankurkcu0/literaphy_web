#!/usr/bin/env node
/**
 * Admin panel için telefon+şifre hesabı oluşturur/günceller.
 *
 * Kullanım:
 *   node scripts/create-admin.mjs
 *   node scripts/create-admin.mjs "0542 461 96 30" "gizliSifre123" "Ozan"
 *
 * Şifre asla düz metin olarak saklanmaz — bcrypt ile hash'lenip
 * data/admins.local.json dosyasına yazılır (bu dosya .gitignore'da,
 * asla commit'lenmez). Production'a (Vercel) geçerken bu betiğin sonunda
 * yazdırılan ADMIN_ACCOUNTS_JSON değerini ortam değişkeni olarak
 * kullanabilirsin — bkz. docs/admin-panel-kurulum.md
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import bcrypt from "bcryptjs";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "admins.local.json");

function normalizePhone(raw) {
  return raw.replace(/\D/g, "");
}

async function prompt(question, argValue) {
  if (argValue) return argValue;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer;
}

async function main() {
  const [argPhone, argPassword, argName] = process.argv.slice(2);

  const phoneRaw = await prompt("Telefon numarası: ", argPhone);
  const password = await prompt("Şifre: ", argPassword);
  const name = await prompt("Ad (opsiyonel, boş bırakılabilir): ", argName ?? "");

  const phone = normalizePhone(phoneRaw);
  if (!phone) {
    console.error("Geçerli bir telefon numarası girmelisiniz.");
    process.exit(1);
  }
  if (!password || password.length < 6) {
    console.error("Şifre en az 6 karakter olmalı.");
    process.exit(1);
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  fs.mkdirSync(DATA_DIR, { recursive: true });
  let accounts = [];
  if (fs.existsSync(FILE_PATH)) {
    try {
      accounts = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
    } catch {
      accounts = [];
    }
  }

  accounts = accounts.filter((account) => normalizePhone(account.phone) !== phone);
  accounts.push({ phone, passwordHash, ...(name ? { name } : {}) });

  fs.writeFileSync(FILE_PATH, JSON.stringify(accounts, null, 2) + "\n", "utf-8");

  console.log(`\n✓ ${FILE_PATH} güncellendi (${accounts.length} hesap).`);
  console.log("\nProduction'da (Vercel) bunun yerine env değişkeni kullanmak isterseniz,");
  console.log("ADMIN_ACCOUNTS_JSON değişkenine şu değeri yapıştırın:\n");
  console.log(JSON.stringify(accounts));
}

main();
