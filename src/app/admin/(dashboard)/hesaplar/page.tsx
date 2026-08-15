"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Check, Copy, Info, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cardSurfaceClass } from "@/lib/utils";

interface AccountSummary {
  phone: string;
  name?: string;
}

type Source = "file" | "env";

function formatPhoneDisplay(phone: string): string {
  if (phone.length !== 11 || !phone.startsWith("0")) return phone;
  return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7, 9)} ${phone.slice(9, 11)}`;
}

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<AccountSummary[] | null>(null);
  const [source, setSource] = useState<Source>("file");
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [accountsJsonToCopy, setAccountsJsonToCopy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchAccounts = useCallback(async () => {
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/accounts");
      const data = await response.json();
      if (!response.ok) {
        setLoadError(data.error ?? "Hesaplar alınamadı.");
        return;
      }
      setAccounts(data.accounts ?? []);
      setSource(data.source ?? "file");
    } catch {
      setLoadError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  function resetForm() {
    setName("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (password !== confirmPassword) {
      setFormError("Şifreler eşleşmiyor.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password, name }),
      });
      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error ?? "Hesap kaydedilemedi.");
        setSaving(false);
        return;
      }
      resetForm();
      setAccounts(data.accounts ?? []);
      if (!data.persisted) setAccountsJsonToCopy(data.accountsJson);
      setCopied(false);
    } catch {
      setFormError("Sunucuya ulaşılamadı, lütfen tekrar deneyin.");
    }
    setSaving(false);
  }

  async function handleDelete(account: AccountSummary) {
    const confirmed = window.confirm(
      `${account.name || account.phone} hesabını silmek istediğinize emin misiniz?`,
    );
    if (!confirmed) return;

    const response = await fetch(`/api/admin/accounts/${encodeURIComponent(account.phone)}`, {
      method: "DELETE",
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      window.alert(data.error ?? "Hesap silinemedi.");
      return;
    }
    setAccounts(data.accounts ?? []);
    if (!data.persisted) setAccountsJsonToCopy(data.accountsJson);
    setCopied(false);
  }

  async function handleCopy() {
    if (!accountsJsonToCopy) return;
    try {
      await navigator.clipboard.writeText(accountsJsonToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard erişimi yoksa kullanıcı zaten kutudan seçip kopyalayabilir
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-semibold text-foreground">Hesaplar</h1>
        <p className="mt-1 text-[14px] text-foreground-muted">
          Panele giriş yapabilen telefon/şifre hesapları.
        </p>
      </div>

      {source === "env" && (
        <div className="flex items-start gap-3 rounded-lg border border-hairline bg-surface px-5 py-4 text-[13.5px] text-foreground-secondary">
          <Info className="mt-0.5 size-4 shrink-0 text-foreground-muted" aria-hidden />
          <p>
            Bu ortamda hesaplar <code className="font-mono text-[12.5px]">ADMIN_ACCOUNTS_JSON</code> env
            değişkeninden okunuyor (production). Buradan yaptığınız değişiklikler sunucu yeniden başlayana
            kadar geçerli olur ama kalıcı olması için aşağıda çıkan JSON&rsquo;u Vercel&rsquo;e yapıştırıp
            yeniden deploy etmeniz gerekir.
          </p>
        </div>
      )}

      {accountsJsonToCopy && (
        <div className="flex flex-col gap-2 rounded-lg border border-warning/25 bg-warning/5 px-5 py-4">
          <p className="text-[13px] font-medium text-warning">
            Kalıcı olması için bu değeri Vercel&rsquo;deki ADMIN_ACCOUNTS_JSON değişkenine yapıştırıp
            yeniden deploy edin:
          </p>
          <div className="flex items-start gap-2">
            <textarea
              readOnly
              value={accountsJsonToCopy}
              rows={3}
              className="w-full flex-1 resize-none rounded-md border border-hairline bg-base p-2.5 font-mono text-[12px] text-foreground-secondary"
            />
            <Button type="button" variant="secondary" size="md" onClick={handleCopy}>
              {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
              {copied ? "Kopyalandı" : "Kopyala"}
            </Button>
          </div>
        </div>
      )}

      {loadError && (
        <div className="rounded-lg border border-danger/30 bg-danger/5 px-5 py-4 text-[13.5px] text-danger">
          {loadError}
        </div>
      )}

      {accounts === null && !loadError ? (
        <div className="rounded-lg border border-hairline bg-surface px-6 py-16 text-center text-[14px] text-foreground-muted">
          Yükleniyor…
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {(accounts ?? []).map((account) => (
            <li
              key={account.phone}
              className={`${cardSurfaceClass} flex items-center justify-between gap-3 px-4 py-3.5`}
            >
              <div>
                <p className="text-[14px] font-medium text-foreground">{account.name || "(isimsiz)"}</p>
                <p className="text-[12.5px] text-foreground-muted">{formatPhoneDisplay(account.phone)}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(account)}
                className="flex size-8 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-danger/10 hover:text-danger"
                aria-label={`${account.name || account.phone} hesabını sil`}
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-lg border border-hairline bg-surface p-5"
      >
        <p className="text-[14px] font-semibold text-foreground">Admin ekle / şifre güncelle</p>
        <p className="text-[12.5px] text-foreground-muted">
          Yeni bir telefon numarası girerseniz hesap eklenir; mevcut bir numarayı girerseniz o hesabın
          şifresi günceller.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Ad" name="accountName" value={name} onChange={(event) => setName(event.target.value)} />
          <Input
            label="Telefon"
            name="accountPhone"
            type="tel"
            required
            placeholder="05xx xxx xx xx"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Şifre"
            name="accountPassword"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Input
            label="Şifre (tekrar)"
            name="accountPasswordConfirm"
            type="password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>

        {formError && <p className="text-[13px] font-medium text-danger">{formError}</p>}

        <div>
          <Button type="submit" variant="primary" size="md" disabled={saving}>
            <UserPlus className="size-4" aria-hidden />
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </Button>
        </div>
      </form>
    </div>
  );
}
