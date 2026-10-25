/**
 * 임계 감쇠(damping 1.0) 스프링.
 *
 * 고정 시간 애니메이션과 달리 "지금 값 + 지금 속도"에서 출발하므로,
 * 움직이는 도중에 다시 잡거나 방향을 바꿔도 끊김 없이 이어집니다.
 * 바텀시트를 손가락으로 끌다 놓을 때 그 속도를 그대로 넘겨받는 데 씁니다.
 */

type SpringOptions = {
  from: number
  to: number
  /** 시작 속도 (px/s). 드래그를 놓은 순간의 속도를 넘깁니다 */
  velocity?: number
  /** 목표에 다가가는 빠르기(초). 작을수록 빠릅니다. 고정 duration이 아닙니다 */
  response?: number
  onUpdate: (value: number) => void
  onDone?: () => void
}

export function animateSpring({
  from,
  to,
  velocity = 0,
  response = 0.35,
  onUpdate,
  onDone,
}: SpringOptions): () => void {
  const omega = (2 * Math.PI) / response
  const x0 = from - to
  const start = performance.now()
  let frame = requestAnimationFrame(function step(now) {
    const t = (now - start) / 1000
    // 임계 감쇠 해: x(t) = (x0 + (v0 + ωx0)t)·e^(−ωt)
    const decay = Math.exp(-omega * t)
    const x = (x0 + (velocity + omega * x0) * t) * decay
    const v = (velocity - (velocity + omega * x0) * omega * t) * decay
    if (Math.abs(x) < 0.5 && Math.abs(v) < 5) {
      onUpdate(to)
      onDone?.()
      return
    }
    onUpdate(to + x)
    frame = requestAnimationFrame(step)
  })
  return () => cancelAnimationFrame(frame)
}

/**
 * 손을 뗀 뒤 관성으로 더 갈 거리. 놓은 지점이 아니라 "가려던 지점"으로
 * 닫힘 여부를 판단하면, 살짝 튕기기만 해도 시트가 닫힙니다.
 * (Apple, Designing Fluid Interfaces 샘플 코드의 감속 공식)
 */
export function projectMomentum(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate)
}

/** 경계 너머로 끌수록 덜 따라오게 하는 저항 (딱 멈추지 않고 부드럽게) */
export function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot))
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
