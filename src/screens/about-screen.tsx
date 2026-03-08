export function AboutScreen() {
  return (
    <div className="space-y-10 pb-6">
      <section className="pb-2">
        <div className="pt-12 pb-10 text-center">
          <h1 className="text-5xl font-semibold tracking-tight">Epoch Foundry</h1>
          <p className="mt-4 text-sm text-muted-foreground">Forge production across epochs.</p>
        </div>
      </section>
      <section className="mx-auto max-w-prose">
        <p className="text-justify text-sm leading-7 text-muted-foreground">
          Epoch Foundry is a long-form idle game about scaling production over repeated runs. Build
          up credits, optimize upgrade timing, and use prestige to convert each reset into
          permanent momentum.
        </p>
      </section>
      <section className="space-y-3 border-t border-border/70 pt-6">
        <p className="text-sm leading-7 text-muted-foreground">
          For full gameplay systems, challenge mechanics, rewards, and save details, open the Help
          section from Other.
        </p>
      </section>
    </div>
  )
}
