import Decimal from 'decimal.js'

import {
  ProducerList,
  type ProducerListEntry,
} from '@/components/game/producer-list'
import { UNKNOWN_PRODUCER_REVEAL_RATIO } from '@/lib/consts'
import { MINER_SUBSYSTEM_CONFIG, type SubsystemKey } from '@/lib/progression-config'
import {
  buyGenerator,
  canBuyGenerator,
  GENERATOR_DEFS,
  GENERATOR_ORDER,
  getSubsystemForGenerator,
  getGeneratorCost,
  getGeneratorProductionPerSecond,
  isGeneratorManagedBySubsystem,
  setBuyAmount,
  type GameState,
} from '@/lib/game-engine'

interface ProductionScreenProps {
  game: GameState
  creditsPerSecond: Decimal
  onGameChange: (updater: (current: GameState) => GameState) => void
  formatRenderedCredits: (value: Decimal.Value) => string
  formatAffordabilityEta: (totalSeconds: number) => string
  getSecondsUntilAffordable: (
    credits: Decimal,
    cost: Decimal,
    creditsPerSecond: Decimal,
  ) => number | null
  onOpenSubsystem: (subsystem: SubsystemKey) => void
}

export function ProductionScreen({
  game,
  creditsPerSecond,
  onGameChange,
  formatRenderedCredits,
  formatAffordabilityEta,
  getSecondsUntilAffordable,
  onOpenSubsystem,
}: ProductionScreenProps) {
  const credits = new Decimal(game.credits)
  const highestOwnedIndex = GENERATOR_ORDER.reduce(
    (highest, key, index) => (game.generators[key] > 0 ? index : highest),
    -1,
  )

  let maxRevealedIndex = highestOwnedIndex
  let ghostIndex: number | null = null

  for (let index = highestOwnedIndex + 1; index < GENERATOR_ORDER.length; index += 1) {
    const key = GENERATOR_ORDER[index]
    const revealThreshold = new Decimal(GENERATOR_DEFS[key].baseCost).times(
      UNKNOWN_PRODUCER_REVEAL_RATIO,
    )
    if (credits.greaterThanOrEqualTo(revealThreshold)) {
      maxRevealedIndex = index
      continue
    }

    ghostIndex = index
    break
  }

  const entries = GENERATOR_ORDER.reduce<ProducerListEntry[]>((accumulator, key, index) => {
    const owned = game.generators[key]
    const isOwned = owned > 0
    const isRevealed = isOwned || index <= maxRevealedIndex
    const isGhost = ghostIndex === index

    if (!isRevealed && !isGhost) {
      return accumulator
    }

    const definition = GENERATOR_DEFS[key]
    if (isGhost) {
      accumulator.push({
        key: definition.key,
        type: 'ghost',
        description: '??? ??? ??? ??? ??? ??? ???.',
      })
      return accumulator
    }

    const cost = getGeneratorCost(game, key)
    const subsystem = getSubsystemForGenerator(key)
    const isSubsystemEntry = isGeneratorManagedBySubsystem(game, key)
    const canBuy = canBuyGenerator(game, key)
    const contribution = getGeneratorProductionPerSecond(game, key)
    const remainingCredits = canBuy ? new Decimal(0) : cost.minus(credits)
    const secondsUntilAffordable = getSecondsUntilAffordable(
      credits,
      cost,
      creditsPerSecond,
    )
    const affordabilityPercent = Decimal.min(new Decimal(100), credits.div(cost).times(100))
      .toDecimalPlaces(0, Decimal.ROUND_FLOOR)
      .toNumber()
    const subsystemLabel = subsystem === 'miners' ? MINER_SUBSYSTEM_CONFIG.label : 'Subsystem'

    accumulator.push({
      key: definition.key,
      label: definition.label,
      description: definition.description,
      owned,
      productionPerSecond: contribution,
      cost,
      currencyLabel: 'credits',
      canAfford: canBuy,
      affordabilityPercent,
      helperText: isSubsystemEntry ? (
        <>
          <span className="text-sm">Main producer complete</span>
          <span className="mt-2 block">
            Enter <span className="font-medium text-foreground">{subsystemLabel}</span> to keep
            scaling {definition.label} output.
          </span>
        </>
      ) : canBuy ? (
        'Ready to purchase'
      ) : (
        <>
          Need{' '}
          <span className="font-mono tabular-nums">
            {formatRenderedCredits(remainingCredits)}
          </span>{' '}
          more
          {secondsUntilAffordable !== null && secondsUntilAffordable > 0
            ? ` (${formatAffordabilityEta(secondsUntilAffordable)})`
            : ''}
        </>
      ),
      buttonLabel: isSubsystemEntry ? 'Open' : 'Buy',
      buttonDisabled: !isSubsystemEntry && !canBuy,
      onAction: () => {
        if (isSubsystemEntry && subsystem) {
          onOpenSubsystem(subsystem)
          return
        }

        onGameChange((current) => buyGenerator(current, key))
      },
    })
    return accumulator
  }, [])

  return (
    <ProducerList
      buyAmount={game.buyAmount}
      onBuyAmountChange={(amount) => onGameChange((current) => setBuyAmount(current, amount))}
      formatRenderedValue={formatRenderedCredits}
      entries={entries}
    />
  )
}
