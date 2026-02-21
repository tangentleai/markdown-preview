import { CORE_CAPABILITY_INVENTORY, type CoreCapabilityItem } from './capabilityInventory'
import type { DocumentModelContract } from './documentModel'
import type { FileServiceContract } from './fileService'
import type { FindReplaceContract } from './findReplace'
import type { RenderPipelineContract } from './renderPipeline'

export interface CoreBoundaryContracts {
  documentModel: DocumentModelContract
  renderPipeline: RenderPipelineContract
  findReplace: FindReplaceContract
  fileService: FileServiceContract
}

export interface CoreBoundaryDefinition {
  capabilities: readonly CoreCapabilityItem[]
  contracts: CoreBoundaryContracts
}

export const createCoreBoundaryDefinition = (contracts: CoreBoundaryContracts): CoreBoundaryDefinition => ({
  capabilities: CORE_CAPABILITY_INVENTORY,
  contracts
})
