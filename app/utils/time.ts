export function formatTime(remainingSeconds: number) {
  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds - minutes * 60

  function formatTime(string: number, pad: string, length: number) {
    return (new Array(length + 1).join(pad) + string).slice(-length)
  }

  return formatTime(minutes, "0", 2) + ":" + formatTime(seconds, "0", 2)
}
