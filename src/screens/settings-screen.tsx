import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { DEV_BOOTSTRAP_PRESETS, type DevBootstrapPresetKey } from '@/lib/dev-bootstrap'
import { setShowPurchasedUpgrades, setUpdateFrequency, type GameState } from '@/lib/game-engine'

interface SettingsScreenProps {
  game: GameState
  isRefreshing: boolean
  refreshError: string | null
  onRefreshApp: () => Promise<void>
  onResetGame: () => void
  onApplyDevBootstrap: (preset: DevBootstrapPresetKey) => void
  onGameChange: (updater: (current: GameState) => GameState) => void
}

export function SettingsScreen({
  game,
  isRefreshing,
  refreshError,
  onRefreshApp,
  onResetGame,
  onApplyDevBootstrap,
  onGameChange,
}: SettingsScreenProps) {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-base font-semibold">App Updates</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Installed home-screen mode does not expose browser refresh controls. Use this to fetch
          the latest deployed version and reload the app.
        </p>
        <Button variant="secondary" className="mt-4" disabled={isRefreshing} onClick={() => void onRefreshApp()}>
          {isRefreshing ? 'Refreshing...' : 'Refresh App'}
        </Button>
        {refreshError && <p className="mt-2 text-sm text-red-600">{refreshError}</p>}
      </section>

      <section className="border-t border-border/70 pt-4">
        <h3 className="text-base font-semibold">Performance</h3>
        <p className="mt-1 text-sm text-muted-foreground">Choose how frequently the game updates on screen.</p>
        <div
          className="mt-3 inline-flex items-center overflow-hidden rounded-md border border-border"
          role="group"
          aria-label="Update frequency"
        >
          {(['slow', 'medium', 'fast'] as const).map((mode) => (
            <Button
              key={mode}
              type="button"
              size="sm"
              variant={game.settings.updateFrequency === mode ? 'default' : 'ghost'}
              className="rounded-none px-3 text-xs capitalize"
              onClick={() => onGameChange((current) => setUpdateFrequency(current, mode))}
            >
              {mode}
            </Button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Slow: 4 fps, Medium: 12 fps, Fast: 30 fps</p>
      </section>

      <section className="border-t border-border/70 pt-4">
        <h3 className="text-base font-semibold">Upgrade Display</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Hide completed upgrades by default to keep the list focused.
        </p>
        <div className="mt-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Show Purchased Upgrades</p>
            <p className="text-xs text-muted-foreground">Display already-owned upgrades in the Upgrades tab.</p>
          </div>
          <Switch
            checked={game.settings.showPurchasedUpgrades}
            onCheckedChange={(checked) => onGameChange((current) => setShowPurchasedUpgrades(current, checked))}
          />
        </div>
      </section>

      <section className="border-t border-border/70 pt-4">
        <h3 className="text-base font-semibold">Reset Game</h3>
        <p className="mt-1 text-sm text-muted-foreground">This clears all progress and starts a fresh run.</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="mt-4 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700">
              Reset Game
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset your game?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently erase your current progress. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={onResetGame}>
                Yes, reset game
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {import.meta.env.DEV && (
        <section className="border-t border-border/70 pt-4">
          <h3 className="text-base font-semibold">Dev Bootstrap</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Load preset save states for faster feature testing in development.
          </p>
          <div className="mt-3 space-y-2">
            {DEV_BOOTSTRAP_PRESETS.map((preset) => (
              <div key={preset.key} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{preset.label}</p>
                  <p className="text-xs text-muted-foreground">{preset.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onApplyDevBootstrap(preset.key)}
                >
                  Load
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
