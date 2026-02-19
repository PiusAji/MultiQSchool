// Reusable SVG wave divider components

interface DividerProps {
  position?: 'top' | 'bottom'
  color?: string
  flip?: boolean
}

export function WaveDivider({
  position = 'bottom',
  color = '#ffffff',
  flip = false,
}: DividerProps) {
  return (
    <div
      className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden leading-none ${flip ? 'rotate-180' : ''}`}
    >
      <svg
        className="relative block w-full h-[60px] md:h-[80px]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill={color}
        />
      </svg>
    </div>
  )
}

export function BlobDivider({ position = 'bottom', color = '#ffffff' }: DividerProps) {
  return (
    <div
      className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden leading-none`}
    >
      <svg
        className="relative block w-full h-[60px] md:h-[100px]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          fill={color}
        />
      </svg>
    </div>
  )
}

export function CurveDivider({
  position = 'bottom',
  color = '#ffffff',
  flip = false,
}: DividerProps) {
  return (
    <div
      className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden leading-none ${flip ? 'scale-x-[-1]' : ''}`}
    >
      <svg
        className="relative block w-full h-[50px] md:h-[70px]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z" fill={color} />
      </svg>
    </div>
  )
}

export function TiltDivider({
  position = 'bottom',
  color = '#ffffff',
  flip = false,
}: DividerProps) {
  return (
    <div
      className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden leading-none ${flip ? 'scale-x-[-1]' : ''}`}
    >
      <svg
        className="relative block w-full h-[40px] md:h-[60px]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path d="M1200 0L0 120V0z" fill={color} />
      </svg>
    </div>
  )
}

export function CloudDivider({ position = 'bottom', color = '#ffffff' }: DividerProps) {
  return (
    <div
      className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 w-full overflow-hidden leading-none`}
    >
      <svg
        className="relative block w-full h-[60px] md:h-[80px]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M741,116.23C291,117.43,0,27.57,0,6V120H1200V6C1200,27.93,1186.4,119.83,741,116.23Z"
          fill={color}
        />
      </svg>
    </div>
  )
}
