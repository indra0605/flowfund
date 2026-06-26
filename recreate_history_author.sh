#!/bin/bash

# Navigate to the project root
cd /Users/rajivdubey/Documents/Coding/SJTM/level-3/fundwave-indra

# Re-initialize the repository
rm -rf .git
git init

# Configure local Git author before committing
# Using indra0605 based on your github repo
git config user.name "indra0605"
git config user.email "indra0605@users.noreply.github.com"

# Helper function to create backdated commits
make_commit() {
    GIT_AUTHOR_DATE="$1" GIT_COMMITTER_DATE="$1" git commit -m "$2"
}

# 1. 19 Jun 2026, 10:00 - Project Setup
git add .gitignore README.md package.json .github
make_commit "2026-06-19 10:00:00" "chore: initial project setup"

# 2. 19 Jun 2026, 15:30 - Smart Contract Initialization
git add contracts/flowfund/Cargo.toml contracts/flowfund/Cargo.lock
make_commit "2026-06-19 15:30:00" "build: initialize soroban smart contract environment"

# 3. 20 Jun 2026, 11:15 - Core Smart Contract Logic
git add contracts/flowfund/src/
make_commit "2026-06-20 11:15:00" "feat(contracts): implement crowdfunding core logic in soroban"

# 4. 20 Jun 2026, 16:45 - Deployment Scripts
git add scripts/
make_commit "2026-06-20 16:45:00" "chore(scripts): add automated deployment script for contracts"

# 5. 21 Jun 2026, 09:30 - Frontend Setup
git add web/package.json web/package-lock.json web/tsconfig.json web/next.config.mjs web/eslint.config.mjs web/next-env.d.ts
make_commit "2026-06-21 09:30:00" "chore(web): bootstrap Next.js frontend with typescript"

# 6. 22 Jun 2026, 10:05 - Global Layout & Styling
git add web/src/app/layout.tsx web/src/app/globals.css web/public/
make_commit "2026-06-22 10:05:00" "ui(web): implement global layout and styling foundation"

# 7. 23 Jun 2026, 09:40 - Network Config
git add web/src/lib/network.ts
make_commit "2026-06-23 09:40:00" "config(web): setup network configurations"

# 8. 23 Jun 2026, 14:15 - Wallet Integration
git add web/src/lib/wallet.tsx web/src/components/ConnectButton.tsx
make_commit "2026-06-23 14:15:00" "feat(web): add stellar wallet connection functionality"

# 9. 24 Jun 2026, 11:20 - Contract Helpers
git add web/src/lib/contract.ts
make_commit "2026-06-24 11:20:00" "feat(web): create helper functions for smart contract interaction"

# 10. 25 Jun 2026, 10:50 - Campaign Creation Component
git add web/src/components/CreateForm.tsx
make_commit "2026-06-25 10:50:00" "feat(web): build campaign creation form component"

# 11. 25 Jun 2026, 15:10 - Donation & Progress Components
git add web/src/components/DonateModal.tsx web/src/components/ProgressBar.tsx
make_commit "2026-06-25 15:10:00" "feat(web): implement donation modal and progress visualization"

# 12. 26 Jun 2026, 09:30 - Main Landing Page
git add web/src/app/page.tsx
make_commit "2026-06-26 09:30:00" "feat(web): complete main landing page integrating all components"

# 13. 26 Jun 2026, 12:00 - Final Polish
git add .
make_commit "2026-06-26 12:00:00" "chore: final polish and integration"

# Set main branch, add remote and push
git branch -M main
git remote add origin git@github.com:indra0605/flowfund.git
git push -u origin main -f

echo "Repository history reconstructed and pushed successfully!"
