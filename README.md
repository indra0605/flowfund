# FlowFund

FlowFund is a mini end-to-end Stellar + Soroban dApp: a crowdfunding / donation platform backed by a deployed Soroban smart contract on Stellar Testnet, with live progress driven by periodic on-chain reads, transaction lifecycle feedback, and a clean Next.js 16 / React 19 frontend.

## Submission Checklist (fill before submitting)

- Live demo link: update after FlowFund web redeploy
- Demo video (1 minute) link: https://drive.google.com/file/d/1dFeg8Ik0mn7KfHMuFhhfVLJVmekP0H8L/view?usp=sharing
- Test output screenshot (3+ passing tests): ✅ (see `cargo test` output below)
- Public GitHub repo link: `https://github.com/indra0605/flowfund`
- 3+ meaningful commits for Level 3: ✅

## Submission Overview

This project demonstrates:

- **Soroban smart contract** for create / donate / finalize / withdraw / refund
- Contract deployment on **Stellar Testnet** via the official `stellar` CLI
- Contract reads and writes from a typed Next.js frontend
- **Live progress**: per-campaign raised/goal recomputed every 5 s from the contract
- **Multi-wallet integration** with `StellarWalletsKit` (Freighter, xBull, Albedo, Rabet, Hana, Ledger, Trezor)
- **Visible transaction lifecycle** feedback in the donate / create flows
- Wallet error handling for missing wallet, rejected signature, and unfunded accounts
- **Donor refunds** if a campaign fails its deadline, **creator withdraw** on success
- Loading states and progress indicators during reads / writes
- TypeScript strict mode, ESLint (Next 16 core-web-vitals), and a CI workflow

## Key Features

- Anyone can create a campaign with a goal (XLM or any SAC token), a deadline, and a description
- Anyone can donate — contributions are held by the contract, not the creator
- The contract auto-marks a campaign **Successful** when the goal is met and **Failed** when the deadline passes unmet
- Creators can `withdraw` the raised funds only after a successful campaign
- Donors can `refund` their contribution only from a failed campaign
- Live status bar per campaign and a 5-second auto-refresh on the home feed
- Read-only browsing of campaigns is possible even without a connected wallet
- Wallet errors are surfaced inline; no silent failures

## Screenshots

<table width="100%">
  <tr>
    <td align="center" width="50%">
      <strong>🏠 Home Feed</strong><br/><br/>
      <em><img width="2032" height="1161" alt="2026-06-19_08-57-42" src="https://github.com/user-attachments/assets/f1eab0bd-8d01-4f69-94e3-ac7185000251" />
</em>
    </td>
    <td align="center" width="50%">
      <strong>📝 Stellar Wallet Kit</strong><br/><br/>
      <em><img width="1877" height="1006" alt="2026-06-19_08-31-14" src="https://github.com/user-attachments/assets/6857daf7-a1cf-499e-8f3c-b5fced4b5009" />
</em>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <strong>💸 Donate</strong><br/><br/>
      <em><img width="1877" height="1006" alt="2026-06-19_08-31-14" src="https://github.com/user-attachments/assets/c5299192-53b4-4a1f-aa85-04f572c40cc7" />
</em>
    </td>
    <td align="center" width="50%">
      <strong>✅ CI Results</strong><br/><br/>
      <em>Replace with: green GitHub Actions run for `web (typecheck + lint + build)` and `contract (build + test)`</em>
    </td>
  </tr>
</table>

## Mobile responsive screenshot

<div align="center">
<em>Replace with: a phone-width screenshot (≈ 389 × 700) of the home feed captured from the browser dev tools or a real device.</em>
</div>

## Deployed Contract

- **Network:** `Stellar Testnet`
- **Contract id:** `CBRMVJOFGBFOEGWSKS23FK4U45JSII7JQNGEGNHUQNU3VRUCKEIUWX5M`
- **WASM hash:** `3f21e9dae849d247e86e1c3bd98e7831b9ec1ae863508803ae303dc405f92f50`
- **Source account:** `GD7UEGTSGE4WKXZZQBHZCHXZGMTCSLAMWCAD7WJGSWGUS3TZGJGLTCNE` (identity: `alice`)
- **Stellar Lab:** <https://lab.stellar.org/r/testnet/contract/CBRMVJOFGBFOEGWSKS23FK4U45JSII7JQNGEGNHUQNU3VRUCKEIUWX5M>
- **Soroban RPC:** `https://soroban-testnet.stellar.org`
- **Default donation asset (native XLM SAC on testnet):** `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`

## Verifiable Contract Calls

- **Upload tx hash:** `a645257eb1edbd2402ff7b4b360bfaa76c003c13918f2e91bb4b1d2f6f91283a`
- **Deploy tx hash:** `5ed55c959c59ed14541cfbff07e1021418b2bbf91e7b472ef6c43ebf47aac2e4`
- **Deployed at:** `2026-06-26T15:51:35Z`
- **Stellar Expert (deploy):** <https://stellar.expert/explorer/testnet/tx/5ed55c959c59ed14541cfbff07e1021418b2bbf91e7b472ef6c43ebf47aac2e4>

Full deployment record (tx hashes, WASM hash, source account, timestamps) lives in [`.soroban/deployments.json`](.soroban/deployments.json) and is refreshed by `npm run deploy`.

## Live Demo

Update after FlowFund web redeploy.

## Setup

Run all commands from the **repo root** unless stated otherwise.

1. Install contract deps (one-time):

   ```bash
   rustup target add wasm32-unknown-unknown
   ```

2. Install web deps:

   ```bash
   cd web
   npm install
   ```

3. Build the Soroban contract (produces `contracts/flowfund/target/wasm32-unknown-unknown/release/flowfund.wasm`):

   ```bash
   cd contracts/flowfund
   cargo build --release --target wasm32-unknown-unknown
   ```

4. Deploy the contract to Stellar Testnet (writes the contract id to `web/.env.local`):

   ```bash
   cd ../..
   npm run deploy            # alias: ./scripts/deploy.sh
   ```

5. Start the frontend:

   ```bash
   cd web
   npm run dev
   ```

6. Build for production:

   ```bash
   npm run build
   ```

Open <http://localhost:3000>.

## Tests

Run the contract unit tests (3+ tests pass; required for the Level 3 submission screenshot):

```bash
cd contracts/flowfund
cargo test --locked
```

For the submission, include a screenshot of the terminal output showing **3+ tests passing**.

## Environment Variables

The frontend reads these from `web/.env.local`. The deploy script writes the first three for you; the rest are optional.

```env
# Network the web app should target. Use "testnet" for development,
# "futurenet" for the SDF futurenet, or "public" for mainnet.
NEXT_PUBLIC_NETWORK=testnet

# Deployed FlowFund contract id on the network above.
# Updated automatically by ./scripts/deploy.sh.
NEXT_PUBLIC_CONTRACT_ID=CBRMVJOFGBFOEGWSKS23FK4U45JSII7JQNGEGNHUQNU3VRUCKEIUWX5M

# SAC token address used as the default donation asset (XLM on testnet).
NEXT_PUBLIC_TOKEN_ADDRESS=CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
```

## Testnet Notes

- A connected wallet must be funded on Stellar Testnet before it can send contract transactions
- If a wallet has not been created on Testnet yet, fund it with Friendbot first and then retry
- The home feed works without a connected wallet (it just calls `list_campaigns` as a read)

## Scripts

Run from the **repo root**:

- `npm run dev` — start the Next.js dev server
- `npm run build` — production build of the web app
- `npm run start` — start the built Next.js server
- `npm run lint` — run ESLint on the web app
- `npm run typecheck` — run `tsc --noEmit` on the web app
- `npm run deploy` — build + deploy the Soroban contract to testnet
- `npm run deploy:reset` — deploy and then call `init()` / a post-deploy invoke
- `npm run deploy:futurenet` — deploy to futurenet
- `cargo test --locked` (inside `contracts/flowfund/`) — run the contract unit tests
- `cargo build --release --target wasm32-unknown-unknown` (inside `contracts/flowfund/`) — build the contract WASM

## Deploy (Vercel / Netlify)

This is a standard Next.js 16 build.

- **Node.js:** `^20.19.0` or `>=22.12.0` (Next 16 requirement)
- **Build command:** `npm --prefix web run build`
- **Output directory:** `.next` (Next.js default; Vercel picks this up automatically)
- **Env vars:** set the three `NEXT_PUBLIC_*` vars from the section above (at minimum `NEXT_PUBLIC_CONTRACT_ID` if you deploy a new contract)

## Demo Video (1 minute)

https://drive.google.com/file/d/1dFeg8Ik0mn7KfHMuFhhfVLJVmekP0H8L/view?usp=sharing

Suggested walkthrough:

1. Open the deployed site and show the campaign feed refreshing every 5 s.
2. Connect a wallet (Freighter or any wallet listed in the modal).
3. Create a campaign (show the transaction phases: `preparing` → `awaiting-signature` → `pending` → `success`).
4. Donate to the campaign and show the progress bar updating.
5. Open the contract on Stellar Lab via the link in the UI.

## Project Structure

```
flowfund/
├── contracts/flowfund/      # Soroban smart contract (Rust)
│   ├── src/lib.rs           # create / donate / finalize / withdraw / refund
│   └── Cargo.toml
├── web/                     # Next.js 16 frontend (React 19, Turbopack)
│   ├── src/
│   │   ├── app/             # App Router pages (layout.tsx, page.tsx)
│   │   ├── components/      # ConnectButton, CreateForm, DonateModal, ProgressBar
│   │   └── lib/             # contract.ts, wallet.tsx, network.ts
│   └── package.json
├── scripts/deploy.sh        # build + deploy + write web/.env.local
├── .soroban/                # deployment records (checked in)
└── .github/workflows/ci.yml # CI: contract build + test, web typecheck + lint + build
```

## CI

GitHub Actions runs on every push / PR to `main`:

- `web`: `npm ci` → `npm run typecheck` → `npm run lint` → `npm run build`
- `contract`: `cargo test --locked` → `cargo build --release --target wasm32-unknown-unknown` → upload the WASM artifact

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Additional Docs

- Frontend guide: [web/README.md](./web/README.md) *(add if you have one)*
- Contract guide: [contracts/flowfund/README.md](./contracts/flowfund/README.md) *(add if you have one)*

## Submission Notes

- GitHub repository: `https://github.com/indra0605/flowfund`
- The project includes multiple meaningful commits in git history
- The contract is deployed on Stellar Testnet and called from the frontend
- Live progress + visible transaction status are implemented end-to-end
- Before final submission, replace the screenshot placeholders in the "Screenshots" and "Mobile responsive screenshot" sections with real captures
