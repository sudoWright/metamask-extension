import { Messenger } from '@metamask/messenger';
import { AccountsControllerListAccountsAction } from '@metamask/accounts-controller';
import {
  AccountTreeControllerGetAccountsFromSelectedAccountGroupAction,
  AccountTreeControllerSelectedAccountGroupChangeEvent,
} from '@metamask/account-tree-controller';
import type { TokensGetV3AssetsAction } from '@metamask/core-backend';
import {
  KeyringControllerLockEvent,
  KeyringControllerUnlockEvent,
} from '@metamask/keyring-controller';
import {
  NetworkEnablementControllerGetStateAction,
  NetworkEnablementControllerEvents,
} from '@metamask/network-enablement-controller';
import type {
  AccountsApiDataSourceActions,
  AccountsApiDataSourceEvents,
  BackendWebsocketDataSourceActions,
  BackendWebsocketDataSourceEvents,
  RpcDataSourceActions,
  RpcDataSourceEvents,
  SnapDataSourceActions,
  SnapDataSourceEvents,
  TokenDataSourceActions,
  DetectionMiddlewareActions,
  PriceDataSourceActions,
  PriceDataSourceEvents,
} from '@metamask/assets-controllers';
import { RootMessenger } from '../../../lib/messenger';

/**
 * The actions that the AssetsController messenger requires.
 */
type Actions =
  | AccountsControllerListAccountsAction
  | AccountTreeControllerGetAccountsFromSelectedAccountGroupAction
  | NetworkEnablementControllerGetStateAction
  | TokensGetV3AssetsAction
  | AccountsApiDataSourceActions
  | BackendWebsocketDataSourceActions
  | RpcDataSourceActions
  | SnapDataSourceActions
  | TokenDataSourceActions
  | DetectionMiddlewareActions
  | PriceDataSourceActions;

/**
 * The events that the AssetsController messenger requires.
 */
type Events =
  | AccountTreeControllerSelectedAccountGroupChangeEvent
  | NetworkEnablementControllerEvents
  | KeyringControllerLockEvent
  | KeyringControllerUnlockEvent
  | AccountsApiDataSourceEvents
  | BackendWebsocketDataSourceEvents
  | RpcDataSourceEvents
  | SnapDataSourceEvents
  | PriceDataSourceEvents;

export type AssetsControllerMessenger = ReturnType<
  typeof getAssetsControllerMessenger
>;

/**
 * Create a messenger restricted to the allowed actions and events of the
 * AssetsController.
 *
 * @param messenger - The base messenger used to create the restricted messenger.
 * @returns The restricted messenger for AssetsController.
 */
export function getAssetsControllerMessenger(
  messenger: RootMessenger<Actions, Events>,
) {
  const controllerMessenger = new Messenger<
    'AssetsController',
    Actions,
    Events,
    typeof messenger
  >({
    namespace: 'AssetsController',
    parent: messenger,
  });

  messenger.delegate({
    messenger: controllerMessenger,
    actions: [
      'AccountsController:listAccounts',
      'AccountTreeController:getAccountsFromSelectedAccountGroup',
      'NetworkEnablementController:getState',
      // BackendApiClient action for metadata enrichment
      'BackendApiClient:Tokens:getV3Assets',
      // AccountsApiDataSource actions
      'AccountsApiDataSource:getActiveChains',
      'AccountsApiDataSource:fetch',
      'AccountsApiDataSource:subscribe',
      'AccountsApiDataSource:unsubscribe',
      // BackendWebsocketDataSource actions
      'BackendWebsocketDataSource:getActiveChains',
      'BackendWebsocketDataSource:fetch',
      'BackendWebsocketDataSource:subscribe',
      'BackendWebsocketDataSource:unsubscribe',
      // RpcDataSource actions
      'RpcDataSource:getActiveChains',
      'RpcDataSource:fetch',
      'RpcDataSource:subscribe',
      'RpcDataSource:unsubscribe',
      // SnapDataSource actions (handles Solana, Bitcoin, Tron snaps)
      'SnapDataSource:getActiveChains',
      'SnapDataSource:fetch',
      'SnapDataSource:subscribe',
      'SnapDataSource:unsubscribe',
      // Middleware data source actions
      'TokenDataSource:getMiddleware',
      'DetectionMiddleware:getMiddleware',
      // PriceDataSource actions
      'PriceDataSource:fetch',
      'PriceDataSource:subscribe',
      'PriceDataSource:unsubscribe',
    ],
    events: [
      'AccountTreeController:selectedAccountGroupChange',
      'NetworkEnablementController:stateChange',
      'KeyringController:lock',
      'KeyringController:unlock',
      // AccountsApiDataSource events
      'AccountsApiDataSource:activeChainsChanged',
      'AccountsApiDataSource:assetsUpdated',
      // BackendWebsocketDataSource events
      'BackendWebsocketDataSource:activeChainsChanged',
      'BackendWebsocketDataSource:assetsUpdated',
      // RpcDataSource events
      'RpcDataSource:activeChainsChanged',
      'RpcDataSource:assetsUpdated',
      // SnapDataSource events (handles Solana, Bitcoin, Tron snaps)
      'SnapDataSource:activeChainsChanged',
      'SnapDataSource:assetsUpdated',
      // PriceDataSource events
      'PriceDataSource:assetsUpdated',
    ],
  });

  return controllerMessenger;
}
