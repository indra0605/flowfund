"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CampaignCard } from "@/components/ProgressBar";
import { CreateForm } from "@/components/CreateForm";
import { DonateModal } from "@/components/DonateModal";
import { ConnectButton } from "@/components/ConnectButton";
import { listCampaigns, type Campaign } from "@/lib/contract";
import { CONTRACT_ID, NETWORK } from "@/lib/network";

const REFRESH_MS = 5_000;

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [donating, setDonating] = useState<Campaign | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const tickRef = useRef(0);

  const refresh = useCallback(async () => {
    try {
      const list = await listCampaigns(0, 50);
      // newest first
      list.sort((a, b) => b.id - a.id);
      setCampaigns(list);
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load campaigns");
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(() => {
      tickRef.current += 1;
      refresh();
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [refresh]);

  const totalRaised = useMemo(() => {
    if (!campaigns) return 0n;
    return campaigns.reduce((acc, c) => acc + BigInt(c.raised), 0n);
  }, [campaigns]);

  const activeCampaigns = useMemo(() => {
    if (!campaigns) return 0;
    const now = Date.now() / 1000;
    return campaigns.filter((c) => c.status === "Active" && c.deadline > now)
      .length;
  }, [campaigns]);

  const finishedCampaigns = useMemo(() => {
    if (!campaigns) return 0;
    return campaigns.filter((c) => c.status !== "Active").length;
  }, [campaigns]);

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#top">
            <span className="brand-badge" aria-hidden="true">
              <span className="brand-mark" />
            </span>
            <span className="brand-copy">
              <strong>FlowFund</strong>
              <span>Stellar crowdfunding</span>
            </span>
          </a>
          <div className="topbar-actions row gap">
            <span className="live">
              <span className="live-dot" /> live - {NETWORK}
            </span>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="content" id="top">
        <div className="shell">
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow">
                <span className="eyebrow-dot" /> transparent funding, on-chain
              </span>
              <h1>Fund what matters, with clean progress and clear trust.</h1>
              <p>
                Launch a campaign in seconds. Donors see live milestones, funds
                stay under contract control, and payouts release only when goal
                conditions are met.
              </p>
              <div className="hero-actions">
                <button
                  className="btn primary"
                  onClick={() => setShowCreate((v) => !v)}
                >
                  {showCreate ? "Close form" : "Start campaign"}
                </button>
                <a className="btn soft" href="#campaigns">
                  Browse campaigns
                </a>
              </div>
            </div>

            <aside className="hero-card">
              <div className="hero-card-inner">
                <div className="hero-card-head">
                  <div>
                    <p>Network snapshot</p>
                    <h3>{NETWORK}</h3>
                  </div>
                  <span className="section-note">
                    {campaigns?.length ?? 0} campaigns live
                  </span>
                </div>

                <div className="summary-grid">
                  <div className="summary-card">
                    <strong>{activeCampaigns}</strong>
                    <span>active now</span>
                  </div>
                  <div className="summary-card">
                    <strong>{finishedCampaigns}</strong>
                    <span>finished or withdrawn</span>
                  </div>
                  <div className="summary-card">
                    <strong>
                      {(Number(totalRaised) / 10_000_000).toFixed(2)} XLM
                    </strong>
                    <span>raised overall</span>
                  </div>
                </div>

                <div className="subtle-divider" />

                <ul className="hero-list">
                  <li>Auto-refresh keeps funding progress current every few seconds.</li>
                  <li>Light theme tuned for legibility, not neon noise.</li>
                  <li>Contract status is visible before you start a new campaign.</li>
                </ul>
              </div>
            </aside>
          </section>

          <section className="toolbar" aria-label="Campaign summary">
            <div className="toolbar-copy">
              <strong>Campaign board</strong>
              <span>
                {campaigns?.length ?? 0} campaign
                {(campaigns?.length ?? 0) === 1 ? "" : "s"} loaded
              </span>
            </div>
            <span className="section-note">
              {CONTRACT_ID ? (
                <>
                  Contract ready <strong className="mono">{CONTRACT_ID.slice(0, 8)}...</strong>
                </>
              ) : (
                <>
                  Contract missing <strong>deploy first</strong>
                </>
              )}
            </span>
          </section>

          {!CONTRACT_ID ? (
            <div className="empty">
              <strong>Contract not deployed.</strong>
              <p className="panel-copy">
                Run <code>./scripts/deploy.sh</code> from repo root, then restart
                <code>pnpm dev</code>.
              </p>
            </div>
          ) : null}

          {err ? <p className="error">{err}</p> : null}

          <div className="stack">
            {showCreate ? <CreateForm onCreated={() => { setShowCreate(false); refresh(); }} /> : null}

            <section className="panel" id="campaigns">
              <div className="panel-body">
                {campaigns === null ? (
                  <div className="empty">Loading campaigns...</div>
                ) : campaigns.length === 0 ? (
                  <div className="empty">
                    <strong>No campaigns yet.</strong>
                    <p className="panel-copy">Start first one. Keep copy sharp, goal realistic, deadline clear.</p>
                  </div>
                ) : (
                  <div className="card-grid">
                    {campaigns.map((c) => (
                      <CampaignCard
                        key={c.id}
                        campaign={c}
                        onDonate={(camp) => setDonating(camp)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <footer className="foot">
            Built on Stellar - contract{" "}
            <code className="mono">{CONTRACT_ID || "-"}</code>
          </footer>
        </div>
      </main>

      {donating ? (
        <DonateModal campaign={donating} onClose={() => setDonating(null)} />
      ) : null}
    </>
  );
}
