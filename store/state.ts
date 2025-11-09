
export interface BasicSliceState {
  status: 'idle' | 'loading' | 'completed' | 'failed'
  error?: string
  code?: string
}
export interface ActionSliceState {
  status: 'idle' | 'loading' | 'completed' | 'failed'
  error?: string
  statusAction: 'idle' | 'loading' | 'completed' | 'failed'
}

export type requestStatus = 'idle' | 'loading' | 'completed' | 'failed'
export interface RequestState {
  status: requestStatus
  error?: string
  code?: string
  data?: any
  type?: string
}
