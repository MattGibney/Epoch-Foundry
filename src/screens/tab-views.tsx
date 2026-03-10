import type Decimal from 'decimal.js'

import { Pickaxe } from 'lucide-react'

import { ResourceHeader } from '@/components/game/credits-header'
import type { DevBootstrapPresetKey } from '@/lib/dev-bootstrap'
import {
  GENERATOR_DEFS,
  getGeneratorProductionPerSecond,
  getMinerOreData,
  getMinerSubsystemMultiplier,
  getMinerSubsystemPurchasedUpgradeCount,
  getMinerSubsystemTotalProductionPerSecond,
  getMinerTotalOreData,
  MINER_SUBSYSTEM_UPGRADE_ORDER,
  type GameState,
} from '@/lib/game-engine'
import { formatIdleNumber } from '@/lib/number-format'
import { MINER_SUBSYSTEM_CONFIG, type SubsystemKey } from '@/lib/progression-config'
import { AboutScreen } from '@/screens/about-screen'
import { AchievementsScreen } from '@/screens/achievements-screen'
import { HelpScreen } from '@/screens/help-screen'
import {
  MinerSubsystemProductionScreen,
  MinerSubsystemUpgradesScreen,
} from '@/screens/operations-screen'
import { ProductionScreen } from '@/screens/production-screen'
import { SettingsScreen } from '@/screens/settings-screen'
import { StatsScreen } from '@/screens/stats-screen'
import { UpgradesScreen } from '@/screens/upgrades-screen'

export type TabKey =
  | 'production'
  | 'upgrades'
  | 'stats'
  | 'achievements'
  | 'help'
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
  onOpenSubsystem: (subsystem: SubsystemKey) => void
}

export function ProductionTabView(props: ProductionTabViewProps) {
  return (
    <>
      <ResourceHeader
        label="Credits"
        value={props.game.credits}
        valuePerSecond={props.creditsPerSecond}
        formatTopValueDisplay={props.formatTopCreditsDisplay}
        formatRenderedValue={props.formatRenderedCredits}
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
          onOpenSubsystem={props.onOpenSubsystem}
        />
      </section>
    </>
  )
}

export function UpgradesTabView(props: CommonTabProps) {
  return (
    <>
      <ResourceHeader
        label="Credits"
        value={props.game.credits}
        valuePerSecond={props.creditsPerSecond}
        formatTopValueDisplay={props.formatTopCreditsDisplay}
        formatRenderedValue={props.formatRenderedCredits}
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

interface MinerSubsystemTabViewProps extends CommonTabProps {
  onExitSubsystem: () => void
}

interface MinerSubsystemProductionTabViewProps extends MinerSubsystemTabViewProps {
  formatAffordabilityEta: (totalSeconds: number) => string
  getSecondsUntilAffordable: (
    credits: Decimal,
    cost: Decimal,
    creditsPerSecond: Decimal,
  ) => number | null
}

export function MinerSubsystemProductionTabView(props: MinerSubsystemProductionTabViewProps) {
  const oreData = getMinerOreData(props.game)
  const oreDataPerSecond = getMinerSubsystemTotalProductionPerSecond(props.game)
  const minerProductionPerSecond = getGeneratorProductionPerSecond(props.game, 'miners')
  const minerMultiplier = getMinerSubsystemMultiplier(props.game)

  return (
    <>
      <ResourceHeader
        contextLabel={GENERATOR_DEFS.miners.label}
        contextValuePerSecond={minerProductionPerSecond}
        valueDetail={
          <span className="font-mono tabular-nums">
            Miner multiplier x{formatIdleNumber(minerMultiplier)}
          </span>
        }
        label={MINER_SUBSYSTEM_CONFIG.currencyLabel}
        value={oreData}
        valuePerSecond={oreDataPerSecond}
        icon={Pickaxe}
        actionLabel="Main Game"
        onAction={props.onExitSubsystem}
        formatTopValueDisplay={props.formatTopCreditsDisplay}
        formatRenderedValue={props.formatRenderedCredits}
        onAnchorRefChange={props.onAnchorRefChange}
      />
      <section className="mt-5">
        <MinerSubsystemProductionScreen
          game={props.game}
          onGameChange={props.onGameChange}
          formatRenderedValue={props.formatRenderedCredits}
          formatAffordabilityEta={props.formatAffordabilityEta}
          getSecondsUntilAffordable={props.getSecondsUntilAffordable}
        />
      </section>
    </>
  )
}

export function MinerSubsystemUpgradesTabView(props: MinerSubsystemTabViewProps) {
  const oreData = getMinerOreData(props.game)
  const oreDataPerSecond = getMinerSubsystemTotalProductionPerSecond(props.game)
  const minerProductionPerSecond = getGeneratorProductionPerSecond(props.game, 'miners')
  const minerMultiplier = getMinerSubsystemMultiplier(props.game)

  return (
    <>
      <ResourceHeader
        contextLabel={GENERATOR_DEFS.miners.label}
        contextValuePerSecond={minerProductionPerSecond}
        valueDetail={
          <span className="font-mono tabular-nums">
            Miner multiplier x{formatIdleNumber(minerMultiplier)}
          </span>
        }
        label={MINER_SUBSYSTEM_CONFIG.currencyLabel}
        value={oreData}
        valuePerSecond={oreDataPerSecond}
        icon={Pickaxe}
        actionLabel="Main Game"
        onAction={props.onExitSubsystem}
        formatTopValueDisplay={props.formatTopCreditsDisplay}
        formatRenderedValue={props.formatRenderedCredits}
        onAnchorRefChange={props.onAnchorRefChange}
      />
      <section className="mt-5">
        <MinerSubsystemUpgradesScreen
          game={props.game}
          onGameChange={props.onGameChange}
          formatRenderedValue={props.formatRenderedCredits}
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
  focusedSubsystem?: SubsystemKey | null
  onExitSubsystem?: () => void
}

export function StatsTabView(props: StatsTabViewProps) {
  const isMinerFocused = props.focusedSubsystem === 'miners'
  const headerValue = isMinerFocused ? getMinerOreData(props.game) : props.game.credits
  const headerPerSecond = isMinerFocused
    ? getMinerSubsystemTotalProductionPerSecond(props.game)
    : props.creditsPerSecond
  const minerMultiplier = isMinerFocused ? getMinerSubsystemMultiplier(props.game) : null

  return (
    <>
      <ResourceHeader
        contextLabel={isMinerFocused ? GENERATOR_DEFS.miners.label : undefined}
        contextValuePerSecond={
          isMinerFocused ? getGeneratorProductionPerSecond(props.game, 'miners') : undefined
        }
        valueDetail={
          minerMultiplier ? (
            <span className="font-mono tabular-nums">
              Miner multiplier x{formatIdleNumber(minerMultiplier)}
            </span>
          ) : undefined
        }
        label={isMinerFocused ? MINER_SUBSYSTEM_CONFIG.currencyLabel : 'Credits'}
        value={headerValue}
        valuePerSecond={headerPerSecond}
        icon={isMinerFocused ? Pickaxe : undefined}
        actionLabel={isMinerFocused ? 'Main Game' : undefined}
        onAction={isMinerFocused ? props.onExitSubsystem : undefined}
        formatTopValueDisplay={props.formatTopCreditsDisplay}
        formatRenderedValue={props.formatRenderedCredits}
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
          subsystemStats={
            isMinerFocused
              ? {
                  title: MINER_SUBSYSTEM_CONFIG.label,
                  currencyLabel: MINER_SUBSYSTEM_CONFIG.currencyLabel,
                  currentCurrency: getMinerOreData(props.game),
                  currencyPerSecond: getMinerSubsystemTotalProductionPerSecond(props.game),
                  lifetimeCurrency: getMinerTotalOreData(props.game),
                  parentLabel: GENERATOR_DEFS.miners.label,
                  parentMultiplier: getMinerSubsystemMultiplier(props.game),
                  purchasedUpgrades: getMinerSubsystemPurchasedUpgradeCount(props.game),
                  totalUpgrades: MINER_SUBSYSTEM_UPGRADE_ORDER.length,
                }
              : undefined
          }
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
      <ResourceHeader
        label="Credits"
        value={props.game.credits}
        valuePerSecond={props.creditsPerSecond}
        formatTopValueDisplay={props.formatTopCreditsDisplay}
        formatRenderedValue={props.formatRenderedCredits}
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

interface SettingsTabViewProps extends CommonTabProps {
  isRefreshing: boolean
  refreshError: string | null
  onRefreshApp: () => Promise<void>
  onResetGame: () => void
  onApplyDevBootstrap: (preset: DevBootstrapPresetKey) => void
}

export function SettingsTabView(props: SettingsTabViewProps) {
  return (
    <>
      <ResourceHeader
        label="Credits"
        value={props.game.credits}
        valuePerSecond={props.creditsPerSecond}
        formatTopValueDisplay={props.formatTopCreditsDisplay}
        formatRenderedValue={props.formatRenderedCredits}
        onAnchorRefChange={props.onAnchorRefChange}
      />
      <section className="mt-5">
        <SettingsScreen
          game={props.game}
          isRefreshing={props.isRefreshing}
          refreshError={props.refreshError}
          onRefreshApp={props.onRefreshApp}
          onResetGame={props.onResetGame}
          onApplyDevBootstrap={props.onApplyDevBootstrap}
          onGameChange={props.onGameChange}
        />
      </section>
    </>
  )
}

export function AboutTabView() {
  return <AboutScreen />
}

export function HelpTabView() {
  return <HelpScreen />
}
