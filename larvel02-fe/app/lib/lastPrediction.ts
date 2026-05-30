import type { PredictionInput } from "~/types/UserPage/User"

const LEGACY_LAST_PREDICTION_KEY = "last_prediction"
const LAST_PREDICTION_PREFIX = "last_prediction:"

export interface LastPredictionState {
  prediction: {
    id?: string
    risk_level: string | boolean
    risk_score?: number
    created_at?: string
  }
  formData: PredictionInput
  timestamp?: string
}

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined"
}

function parseStoredJson<T>(value: string | null): T | null {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export function getActiveUserId(): string | null {
  if (!isBrowser()) {
    return null
  }

  const storedUser = parseStoredJson<{ id?: string | number | null }>(localStorage.getItem("user"))
  const userId = storedUser?.id

  if (userId === undefined || userId === null || userId === "") {
    return null
  }

  return String(userId)
}

function getScopedLastPredictionKey(userId: string | null) {
  return userId ? `${LAST_PREDICTION_PREFIX}${userId}` : null
}

export function readLastPrediction(userId = getActiveUserId()): LastPredictionState | null {
  if (!isBrowser()) {
    return null
  }

  const scopedKey = getScopedLastPredictionKey(userId)
  if (!scopedKey) {
    return null
  }

  return parseStoredJson<LastPredictionState>(localStorage.getItem(scopedKey))
}

export function saveLastPrediction(data: LastPredictionState, userId = getActiveUserId()) {
  if (!isBrowser()) {
    return
  }

  const scopedKey = getScopedLastPredictionKey(userId)
  if (!scopedKey) {
    return
  }

  localStorage.setItem(scopedKey, JSON.stringify(data))
  localStorage.removeItem(LEGACY_LAST_PREDICTION_KEY)
}

export function clearLegacyLastPrediction() {
  if (!isBrowser()) {
    return
  }

  localStorage.removeItem(LEGACY_LAST_PREDICTION_KEY)
}
