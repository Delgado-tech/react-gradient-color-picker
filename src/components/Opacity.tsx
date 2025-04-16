/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, useRef } from 'react'
import { usePicker } from '../context.js'
import { getHandleValue } from '../utils/utils.js'

const Opacity = () => {
  const {
    config,
    hc = {},
    squareWidth,
    handleChange,
    defaultStyles,
    pickerIdSuffix,
  } = usePicker()
  const [dragging, setDragging] = useState(false)
  const { r, g, b } = hc
  const bg = `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(${r},${g},${b},.5) 100%)`
  const { barSize } = config

  const opacityRef = useRef<HTMLDivElement>(null)

  const stopDragging = () => {
    setDragging(false)
  }

  const handleDown = () => {
    setDragging(true)
  }

  const handleOpacity = (x: number) => {
    if (opacityRef.current) {
      const newO = getHandleValue(x, opacityRef.current, barSize) / 100
      console.log(newO)
      const newColor = `rgba(${r}, ${g}, ${b}, ${newO})`
      handleChange(newColor)
    }
  }

  const handleMove = (e: any) => {
    if (dragging) {
      handleOpacity(e.clientX)
    }
  }

  const handleClick = (e: any) => {
    if (!dragging) {
      handleOpacity(e.clientX)
    }
  }

  const left = squareWidth - 18

  useEffect(() => {
    const handleUp = () => {
      stopDragging()
    }

    window.addEventListener('mouseup', handleUp)
    window.addEventListener('mousemove', handleMove)

    return () => {
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('mousemove', handleMove)
    }
  }, [dragging])

  return (
    <div
      onMouseDown={handleDown}
      style={{
        height: 14,
        marginTop: 17,
        marginBottom: 4,
        cursor: 'ew-resize',
        position: 'relative',
      }}
      id={`rbgcp-opacity-wrapper${pickerIdSuffix}`}
      // className="rbgcp-opacity-wrap"
    >
      <div
        // className="rbgcp-opacity-checkered"
        id={`rbgcp-opacity-checkered-bg${pickerIdSuffix}`}
        style={{ ...defaultStyles.rbgcpCheckered, width: '100%', height: 14 }}
      />
      <div
        // className="rbgcp-handle rbgcp-handle-opacity"
        id={`rbgcp-opacity-handle${pickerIdSuffix}`}
        style={{ ...defaultStyles.rbgcpHandle, left: left * hc?.a, top: -2 }}
      />
      <div
        ref={opacityRef}
        style={{ ...defaultStyles.rbgcpOpacityOverlay, background: bg }}
        id={`rbgcp-opacity-overlay${pickerIdSuffix}`}
        // className="rbgcp-opacity-overlay"
        onClick={(e) => handleClick(e)}
      />
    </div>
  )
}

export default Opacity
