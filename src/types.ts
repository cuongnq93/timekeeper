export type SignalType = 'green' | 'yellow' | 'red'

export interface SignalCard {
  type: SignalType
  title: string
  message: string
  time: number // thời gian (giây) khi hiển thị bảng
  backgroundColor: string
  textColor: string
}

export interface TimerConfig {
  greenTime: number // thời gian hiển thị bảng xanh (giây)
  yellowTime: number // thời gian hiển thị bảng vàng (giây)
  redTime: number // thời gian hiển thị bảng đỏ (giây)
  totalTime: number // tổng thời gian speech (giây)
  cards: SignalCard[]
}

export interface TimerState {
  currentTime: number // thời gian hiện tại (giây)
  isRunning: boolean
  currentSignal: SignalType | null
  showSignal: boolean
  manualMode: boolean // chế độ thủ công
}

// Cấu hình mặc định theo chuẩn Toastmasters
export const DEFAULT_CONFIG: TimerConfig = {
  greenTime: 60, // 1 phút
  yellowTime: 90, // 1.5 phút
  redTime: 120, // 2 phút
  totalTime: 150, // 2.5 phút
  cards: [
    {
      type: 'green',
      title: 'KEEP GOING',
      message: 'You are doing great!',
      time: 60,
      backgroundColor: '#22c55e',
      textColor: '#ffffff'
    },
    {
      type: 'yellow',
      title: 'MAKE A CONCLUSION',
      message: 'Time to wrap up',
      time: 90,
      backgroundColor: '#eab308',
      textColor: '#000000'
    },
    {
      type: 'red',
      title: 'STOP',
      message: 'Time is up!',
      time: 120,
      backgroundColor: '#ef4444',
      textColor: '#ffffff'
    }
  ]
}
