import React from 'react'
import { TailSpin } from 'react-loader-spinner';

export default function Loading() {
  return (
        <div>
      <TailSpin
        height="80"
        width="80"
        color="#3252DF"
        ariaLabel="tail-spin-loading"
      />
    </div>
  )
}
