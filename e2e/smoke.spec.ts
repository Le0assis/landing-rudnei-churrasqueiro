import { expect, test } from "@playwright/test";

function futureDate(daysAhead: number): string {
  const target = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(target);
}

test("a home apresenta o churrasco e o orçamento", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Churrasco de pai e filho em Marília, há 5 anos" }),
  ).toBeVisible();
  await expect(page.getByText("escolhido pelo público").first()).toBeVisible();
  await expect(page.getByText("Marília", { exact: false }).first()).toBeVisible();
  const body = await page.locator("body").innerText();
  expect(body).not.toMatch(/prêmio|premiad|troféu|campeão/i);

  await page.getByRole("radio", { name: /Churrasco Completo/ }).check();
  await page.getByLabel("Número de pessoas").fill("40");
  await page.getByLabel("Data do evento").fill(futureDate(30));
  await page.getByLabel("Cidade").fill("Marília");
  await page.getByRole("button", { name: "Aumentar garçons" }).click();
  await page.getByRole("button", { name: "Aumentar garçons" }).click();
  await expect(page.getByTestId("labor-total")).toHaveText(/1\.800,00/);

  const quote = page.getByRole("link", { name: "Mandar orçamento no WhatsApp" });
  await expect(quote).toBeVisible();
  const href = await quote.getAttribute("href");
  expect(href).toContain("https://wa.me/5514996272725?text=");
  const message = decodeURIComponent(href?.split("text=")[1] ?? "");
  expect(message).toContain("Pessoas: 40");
  expect(message).toContain("Marília");
  expect(message).toContain("1.800,00");
  expect(message).toContain("não entram");

  await page.getByRole("radio", { name: /Churrasco Assador/ }).check();
  await page.getByRole("textbox", { name: "Garçons", exact: true }).fill("0");
  await expect(page.getByTestId("labor-total")).toHaveText(/700,00/);

  await page.getByRole("button", { name: "O valor inclui a carne?" }).click();
  await expect(page.getByText("Os R$ 1.500 e os R$ 700 são só a mão de obra.")).toBeVisible();
});

test("o caminho secreto não vaza e o login funciona", async ({ page }) => {
  const adminPath = process.env.ADMIN_PATH;
  expect(adminPath).toBeTruthy();

  await page.goto("/");
  await expect(page.locator("body")).not.toContainText(adminPath ?? "caminho-ausente");

  const robots = await page.request.get("/robots.txt");
  const robotsText = await robots.text();
  expect(robotsText).toContain("Disallow: /interno");
  expect(robotsText).toContain("Disallow: /api/admin");
  expect(robotsText).not.toContain(adminPath ?? "");

  const sitemap = await page.request.get("/sitemap.xml");
  const sitemapText = await sitemap.text();
  expect(sitemapText).not.toContain(adminPath ?? "");
  expect(sitemapText).not.toContain("/interno");

  const hidden = await page.request.get("/interno/painel");
  expect(hidden.status()).toBe(404);

  const denied = await page.evaluate(async () => {
    const response = await fetch("/api/admin/photos");
    return response.status;
  });
  expect(denied).toBe(401);

  await page.goto(`/${adminPath}`);
  await expect(page.getByRole("heading", { name: "Fotos do carrossel" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  await page.getByLabel("Senha").fill("senha-errada-123");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByText("Não foi possível entrar.")).toBeVisible();

  await page.getByLabel("Senha").fill("churrasco-local-apenas");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("button", { name: "Publicar foto" })).toBeVisible();

  await page.getByLabel("Nova foto").setInputFiles("public/placeholders/brasa.jpg");
  await page.getByLabel("Descrição da foto").fill("Foto de teste do carrossel");
  await page.getByRole("button", { name: "Publicar foto" }).click();
  await expect(page.getByText("Foto de teste do carrossel")).toBeVisible();

  const listed = await page.request.get("/api/photos");
  const gallery = (await listed.json()) as { usingPlaceholders: boolean; photos: { alt: string }[] };
  expect(gallery.usingPlaceholders).toBe(false);
  expect(gallery.photos.some((photo) => photo.alt === "Foto de teste do carrossel")).toBe(true);

  await page.getByRole("button", { name: "Apagar" }).click();
  await page.getByRole("button", { name: "Confirmar" }).click();
  await expect(page.getByText("Nenhuma foto ainda")).toBeVisible();
});

test("no celular o WhatsApp fica fixo", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("link", { name: "WhatsApp fixo no celular" })).toBeVisible();
  await expect(page.getByRole("link", { name: "WhatsApp flutuante" })).toBeHidden();
});

test("no desktop o botão flutuante aparece", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await expect(page.getByRole("link", { name: "WhatsApp flutuante" })).toBeVisible();
  await expect(page.getByRole("link", { name: "WhatsApp fixo no celular" })).toBeHidden();
});
