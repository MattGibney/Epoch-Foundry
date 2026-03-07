export function AboutScreen() {
  return (
    <div className="space-y-6">
      <section className="pb-4">
        <div className="pt-10 pb-8 text-center">
          <h1 className="text-5xl font-semibold tracking-tight">Epoch Foundry</h1>
          <p className="mt-3 text-sm text-muted-foreground">Forge production across epochs.</p>
        </div>
      </section>
      <section>
        <p className="text-justify text-sm text-muted-foreground">
          Epoch Foundry is a long-form idle game about scaling production over repeated runs. Build
          up credits, optimize upgrade timing, and use prestige to convert each reset into
          permanent momentum.
        </p>
      </section>
      <section className="border-t border-border/70 pt-4">
        <h3 className="text-base font-semibold">How To Play</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          <li>Buy generators to increase credits per second.</li>
          <li>Use buy amounts to scale purchases faster.</li>
          <li>Purchase upgrades to multiply output by generator tier.</li>
          <li>Prestige when gains slow down to earn essence and speed future runs.</li>
        </ul>
      </section>
      <section className="border-t border-border/70 pt-4">
        <h3 className="text-base font-semibold">Core Systems</h3>
        <div className="mt-2 space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Credits:</span> the main currency used
            for all purchases.
          </p>
          <p>
            <span className="font-medium text-foreground">Generators:</span> 10 production tiers
            with escalating cost and yield.
          </p>
          <p>
            <span className="font-medium text-foreground">Upgrades:</span> multi-tier boost
            chains where stronger upgrades depend on earlier tiers.
          </p>
          <p>
            <span className="font-medium text-foreground">Prestige:</span> resets your run in
            exchange for essence, which permanently boosts production.
          </p>
          <p>
            <span className="font-medium text-foreground">Achievements:</span> long-term
            milestones that track progression and goals.
          </p>
        </div>
      </section>
      <section className="border-t border-border/70 pt-4">
        <h3 className="text-base font-semibold">Long-Term Progression</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The game is designed for long sessions across many resets. Early progression is
          straightforward; depth comes from sequencing upgrades, timing prestige windows, and
          compounding permanent multipliers.
        </p>
      </section>
      <section className="border-t border-border/70 pt-4">
        <h3 className="text-base font-semibold">Save & Offline</h3>
        <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          <p>Progress is auto-saved every 10 seconds and on app exit.</p>
          <p>Save data is stored locally in IndexedDB on this device.</p>
          <p>Offline production is applied on load, with a cap that can be expanded through late-game upgrades.</p>
        </div>
      </section>
    </div>
  )
}
