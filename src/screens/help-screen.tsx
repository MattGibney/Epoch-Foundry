export function HelpScreen() {
  return (
    <div className="space-y-8 pb-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Help</h1>
        <p className="text-sm text-muted-foreground">
          Quick reference for systems, progression, and long-term growth.
        </p>
      </section>

      <section className="space-y-3 border-t border-border/70 pt-5">
        <h2 className="text-base font-semibold">Core Loop</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Buy producers to increase credits per second.</p>
          <p>Buy upgrades to multiply producer and global output.</p>
          <p>Ascend to reset your run, convert the current run into Shards, and strengthen your permanent boost.</p>
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
            <span className="font-medium text-foreground">Ascension:</span> resets the run and
            opens a planning phase where current-run credits convert into Shards that buy one-time permanent upgrades.
          </p>
          <p>
            <span className="font-medium text-foreground">Achievements:</span> long-term goals
            that track account progression.
          </p>
        </div>
      </section>

      <section className="space-y-3 border-t border-border/70 pt-5">
        <h2 className="text-base font-semibold">Save & Offline</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Progress is saved automatically to IndexedDB.</p>
          <p>Offline production is applied on load up to your current cap.</p>
          <p>Offline cap starts at 15 minutes and can be expanded permanently to 6 hours via ascension upgrades.</p>
        </div>
      </section>

      <section className="space-y-3 border-t border-border/70 pt-5">
        <h2 className="text-base font-semibold">Long-Term Progression</h2>
        <p className="text-sm leading-7 text-muted-foreground">
          Progression is designed around repeated runs: push production, unlock stronger
          multipliers, and time ascensions to turn strong runs into Shards and stronger future boosts.
        </p>
      </section>
    </div>
  )
}
