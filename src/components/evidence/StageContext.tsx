import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * 오픈소스 목록에서 지금 가리키는 기여(PR)의 순번.
 * 목록(왼쪽)과 증거판(오른쪽)이 같은 값을 보도록 위로 끌어올렸습니다.
 */
type StageState = { contribution: number; setContribution: (i: number) => void }

const StageContext = createContext<StageState>({ contribution: 0, setContribution: () => {} })

export function StageProvider({ children }: { children: ReactNode }) {
  const [contribution, setContribution] = useState(0)
  return (
    <StageContext.Provider value={{ contribution, setContribution }}>{children}</StageContext.Provider>
  )
}

export const useStage = () => useContext(StageContext)
