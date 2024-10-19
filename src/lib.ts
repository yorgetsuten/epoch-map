export function resize(
  params: { orig: { width: number; height: number } } & (
    | { width: number }
    | { height: number }
  )
) {
  if ('width' in params) {
    return {
      width: params.width,
      height: params.orig.height * (params.width / params.orig.width)
    }
  } else {
    return {
      height: params.height,
      width: (params.orig.width * params.height) / params.orig.height
    }
  }
}

export function easeOutElastic(x: number) {
  const c4 = (2 * Math.PI) / 3

  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(6, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1
}

export function easeInOutQuad(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
