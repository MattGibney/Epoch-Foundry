import type Decimal from 'decimal.js'

import { CreditsHeader } from '@/components/game/credits-header'
import type { GameState } from '@/lib/game-engine'
import { formatIdleNumber } from '@/lib/number-format'
import { AboutScreen } from '@/screens/about-screen'
import { AchievementsScreen } from '@/screens/achievements-screen'
import { ContractsScreen } from '@/screens/contracts-screen'
import { ProductionScreen } from '@/screens/production-screen'
import { SettingsScreen } from '@/screens/settings-screen'
import { StatsScreen } from '@/screens/stats-screen'
import { UpgradesScreen } from '@/screens/upgrades-screen'

export type TabKey =
  | 'production'
  | 'upgrades'
  | 'stats'
  | 'achievements'
  | 'contracts'
  | 'settings'
  | 'about'

interface CommonTabProps {
  game: GameState
  creditsPerSecond: Decimal
  formatRenderedCredits: (value: Decimal.Value) => string
  formatTopCreditsDisplay: (value: Decimal.Value) => string
  onAnchorRefChange: (element: HTMLElement | null) => void
  onGameChange: (updater: (current: GameState) => GameState) => void
}

interface ProductionTabViewProps extends CommonTabProps {
  formatAffordabilityEta: (totalSeconds: number) => string
  getSecondsUntilAffordable: (
    credits: Decimal,
    cost: Decimal,
    creditsPerSecond: Decimal,
  ) => number | null
}

export function ProductionTabView(props: ProductionTabViewProps) {
  return (
    <>
      <CreditsHeader
        credits={props.game.credits}
        creditsPerSecond={props.creditsPerSecond}
        formatTopCreditsDisplay={props.formatTopCreditsDisplay}
        formatRenderedCredits={props.formatRenderedCredits}
        onAnchorRefChange={props.onAnchorRefChange}
      />
      <section className="mt-5">
        <ProductionScreen
          game={props.game}
          creditsPerSecond={props.creditsPerSecond}
          onGameChange={props.onGameChange}
          formatRenderedCredits={props.formatRenderedCredits}
          formatAffordabilityEta={props.formatAffordabilityEta}
          getSecondsUntilAffordable={props.getSecondsUntilAffordable}
        />
      </section>
    </>
  )
}

export function UpgradesTabView(props: CommonTabProps) {
  return (
    <>
      <CreditsHeader
        credits={props.game.credits}
        creditsPerSecond={props.creditsPerSecond}
        formatTopCreditsDisplay={props.formatTopCreditsDisplay}
        formatRenderedCredits={props.formatRenderedCredits}
        onAnchorRefChange={props.onAnchorRefChange}
      />
      <section className="mt-5">
        <UpgradesScreen
          game={props.game}
          onGameChange={props.onGameChange}
          formatRenderedCredits={props.formatRenderedCredits}
        />
      </section>
    </>
  )
}

interface StatsTabViewProps extends CommonTabProps {
  runDuration: number
  offlineProgressCapSeconds: number
  prestigeMultiplier: Decimal
  prestigeGain: Decimal
  canPrestigeNow: boolean
  onOpenPrestige: () => void
  formatDuration: (seconds: number) => string
}

export function StatsTabView(props: StatsTabViewProps) {
  return (
    <>
      <CreditsHeader
        credits={props.game.credits}
        creditsPerSecond={props.creditsPerSecond}
        formatTopCreditsDisplay={props.formatTopCreditsDisplay}
        formatRenderedCredits={props.formatRenderedCredits}
        onAnchorRefChange={props.onAnchorRefChange}
      />
      <section className="mt-5">
        <StatsScreen
          game={props.game}
          runDuration={props.runDuration}
          offlineProgressCapSeconds={props.offlineProgressCapSeconds}
          creditsPerSecond={props.creditsPerSecond}
          prestigeMultiplier={props.prestigeMultiplier}
          prestigeGain={props.prestigeGain}
          canPrestigeNow={props.canPrestigeNow}
          onOpenPrestige={props.onOpenPrestige}
          formatDuration={props.formatDuration}
          formatRenderedCredits={props.formatRenderedCredits}
          formatIdleNumber={formatIdleNumber}
        />
      </section>
    </>
  )
}

interface AchievementsTabViewProps extends CommonTabProps {
  unlockedAchievementCount: number
}

export function AchievementsTabView(props: AchievementsTabViewProps) {
  return (
    <>
      <CreditsHeader
        credits={props.game.credits}
        creditsPerSecond={props.creditsPerSecond}
        formatTopCreditsDisplay={props.formatTopCreditsDisplay}
        formatRenderedCredits={props.formatRenderedCredits}
        onAnchorRefChange={props.onAnchorRefChange}
      />
      <section className="mt-5">
        <AchievementsScreen
          game={props.game}
          unlockedAchievementCount={props.unlockedAchievementCount}
        />
      </section>
    </>
  )
}

interface ContractsTabViewProps extends CommonTabProps {
  nowMs: number
  formatDuration: (seconds: number) => string
}

export function ContractsTabView(props: ContractsTabViewProps) {
  return (
    <>
      <CreditsHeader
        credits={props.game.credits}
        creditsPerSecond={props.creditsPerSecond}
        formatTopCreditsDisplay={props.formatTopCreditsDisplay}
        formatRenderedCredits={props.formatRenderedCredits}
        onAnchorRefChange={props.onAnchorRefChange}
      />
      <section className="mt-5">
        <ContractsScreen
          game={props.game}
          nowMs={props.nowMs}
          onGameChange={props.onGameChange}
          formatRenderedCredits={props.formatRenderedCredits}
          formatDuration={props.formatDuration}
        />
      </section>
    </>
  )
}

interface SettingsTabViewProps extends CommonTabProps {
  isRefreshing: boolean
  refreshError: string | null
  onRefreshApp: () => Promise<void>
  onResetGame: () => void
}

export function SettingsTabView(props: SettingsTabViewProps) {
  return (
    <>
      <CreditsHeader
        credits={props.game.credits}
        creditsPerSecond={props.creditsPerSecond}
        formatTopCreditsDisplay={props.formatTopCreditsDisplay}
        formatRenderedCredits={props.formatRenderedCredits}
        onAnchorRefChange={props.onAnchorRefChange}
      />
      <section className="mt-5">
        <SettingsScreen
          game={props.game}
          isRefreshing={props.isRefreshing}
          refreshError={props.refreshError}
          onRefreshApp={props.onRefreshApp}
          onResetGame={props.onResetGame}
          onGameChange={props.onGameChange}
        />
      </section>
    </>
  )
}

export function AboutTabView() {
  return <AboutScreen />
}
