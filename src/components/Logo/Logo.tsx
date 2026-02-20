import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '50%',
        width: '120px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '8px',
      }}
    >
      <img
        alt="Multi-Q Logo"
        width={104}
        height={104}
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        className={clsx('w-full h-full object-contain', className)}
        src="/logo.png"
      />
    </div>
  )
}
