export function HelpScreen() {
  return (
    <div className="space-y-8 pb-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Help</h1>
        <p className="text-sm text-muted-foreground">
          Quick reference for systems, progression, and challenge mechanics.
        </p>
      </section>

      <section className="space-y-3 border-t border-border/70 pt-5">
        <h2 className="text-base font-semibold">Core Loop</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Buy producers to increase credits per second.</p>
          <p>Buy upgrades to multiply producer and global output.</p>
          <p>Prestige to reset your run and gain permanent essence multipliers.</p>
        </div>
      </section>

      <section className="space-y-3 border-t border-border/70 pt-5">
        <h2 className="text-base font-semibold">Core Systems</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Credits:</span> main currency used for
            producer and upgrade purchases.
          </p>
          <p>
            <span className="font-medium text-foreground">Producers:</span> 10 tiers with rising
            cost and production.
          </p>
          <p>
            <span className="font-medium text-foreground">Upgrades:</span> chained upgrades with
            tier dependencies and global multipliers.
          </p>
          <p>
            <span className="font-medium text-foreground">Prestige:</span> resets the run and
            grants essence for permanent scaling.
          </p>
          <p>
            <span className="font-medium text-foreground">Achievements:</span> long-term goals
            that track account progression.
          </p>
        </div>
      </section>

      <section className="space-y-3 border-t border-border/70 pt-5">
        <h2 className="text-base font-semibold">Challenges</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Challenges unlock after purchasing the `Challenge Protocols` upgrade.</p>
          <p>Challenges are opt-in: effects only apply after pressing `Begin`.</p>
          <p>Unaccepted contracts expire and reroll after a short offer window.</p>
          <p>Accepted contracts also expire if not completed in time.</p>
        </div>
      </section>

      <section className="space-y-3 border-t border-border/70 pt-5">
        <h2 className="text-base font-semibold">What Are The Challenge Rewards?</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Credits:</span> immediate credits added
            to your current run.
          </p>
          <p>
            <span className="font-medium text-foreground">Essence:</span> persistent prestige
            currency.
          </p>
          <p>
            <span className="font-medium text-foreground">Production Boost:</span> temporary
            multiplier to total credits/sec.
          </p>
          <p>
            <span className="font-medium text-foreground">Cost Discount:</span> reduced purchase
            cost for the next N purchases.
          </p>
          <p>
            <span className="font-medium text-foreground">Next Reward Multiplier:</span>{' '}
            multiplier applied to your next claimed contract payout.
          </p>
        </div>
      </section>

      <section className="space-y-3 border-t border-border/70 pt-5">
        <h2 className="text-base font-semibold">Save & Offline</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Progress is saved automatically to IndexedDB.</p>
          <p>Offline production is applied on load up to your current cap.</p>
          <p>Offline cap starts at 15 minutes and can be expanded to 6 hours via upgrades.</p>
        </div>
      </section>

      <section className="space-y-3 border-t border-border/70 pt-5">
        <h2 className="text-base font-semibold">Long-Term Progression</h2>
        <p className="text-sm leading-7 text-muted-foreground">
          Progression is designed around repeated runs: push production, unlock stronger
          multipliers, and time prestige/challenge windows to compound permanent growth.
        </p>
      </section>
    </div>
  )
}
